<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import { mobileRules, passwordRules, codeRules } from "@/utils/rules";
import { showToast, type FormInstance } from "vant";
import {
  loginByPassword,
  sendMobileCode,
  loginByMobile,
} from "@/services/user";
import { useUserStore } from "@/stores";
import { useRouter, useRoute } from "vue-router";
const store = useUserStore();
const route = useRoute();
const router = useRouter();
const agree = ref<boolean>(false); // 控制复选框的状态
const show = ref<boolean>(false); // 控制密码框的显示与隐藏
// 表单数据
const mobile = ref(""); // 手机号
const password = ref(""); // 密码
const isPass = ref<boolean>(true); // 默认是密码登录
const code = ref(); // 验证码
const time = ref<number>(0); // 倒计时时间
const form = ref<FormInstance | null>(null); // 获取from实例,进行单个校验
let timerId: number; // 计时器id
// 发送短信验证码
const send = async () => {
  if (time.value > 0) return; // 判断是否正在倒计时,如果在不发送请求
  // 只校验mobile输入框
  await form.value?.validate("mobile");
  // 等待上面的校验成功,才进行下方的逻辑(validate返回的是Promise可以使用await)
  await sendMobileCode(mobile.value, "login");
  time.value = 60; // 60秒
  // 开启倒计时
  if (timerId) clearInterval(timerId); // 先清除上一次的(防止开启两次)
  timerId = setInterval(() => {
    time.value--; // 倒计时 - 1
    if (time.value <= 0) clearInterval(timerId); // 小于0关闭
  }, 1000);
};
// 当表单校验,触发这个事件(密码登录和验证码登录)
const login = async () => {
  if (!agree.value) return showToast("请勾选用户协议"); // 如果为false,进行提醒
  // isPass为true是表示是在密码登录,为false是表示是在短信验证码登录
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value); // 发送请求
  store.setUser(res.data); // 存储用户信息到Pinia中
  // 进行页面跳转(重定向,如果刚刚在其他的页面,需要跳转到该页面,如果没有跳转到首页)
  // 取出存储的地址returnUrl进行跳转(axios封装时,处理了)
  router.push((route.query.returnUrl as string) || "/user");
  showToast("登录成功");
};
// 组件销毁
onUnmounted(() => {
  clearInterval(timerId);
});
</script>
<template>
  <div class="login-page">
    <!-- 导航栏(接收子组件传递的事件) -->
    <CpNavBar
      rightText="注册"
      @click-right="$router.push('/register')"
    ></CpNavBar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? "密码登录" : "短信登录" }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? "短信验证码登录" : "密码登录" }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 登录表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        placeholder="请输入手机号"
        name="mobile"
        :rules="mobileRules"
        v-model="mobile"
        type="tel"
      ></van-field>
      <!-- 密码框 密码框和短信验证码框只能选择一个所以要判断-->
      <van-field
        v-if="isPass"
        placeholder="请输入密码"
        :rules="passwordRules"
        v-model="password"
        :type="show ? 'text' : 'password'"
      >
        <!-- 使用插槽,防止密码是否可见的svg -->
        <template #button>
          <!-- 点击事件负责,来回切换状态 -->
          <CpIcon
            @click="show = !show"
            :name="`login-eye-${show ? 'on' : 'off'}`"
          />
        </template>
      </van-field>
      <!-- 短信验证码框 -->
      <van-field
        v-else
        placeholder="短信验证码"
        :rules="codeRules"
        v-model="code"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后发送验证码` : "发送验证码"
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <!-- 修改为原生的submit类型按钮 -->
        <van-button block round type="primary" native-type="submit"
          >登录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    // 如果点击了放松验证码,切换成这个类名active
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
