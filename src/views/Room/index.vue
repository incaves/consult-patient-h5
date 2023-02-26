<script setup lang="ts">
import RoomStatus from "./components/RoomStatus.vue";
import RoomAction from "./components/RoomAction.vue";
import RoomMessage from "./components/RoomMessage.vue";
import { io } from "socket.io-client";
import { onMounted, onUnmounted, ref } from "vue";
import { baseURL } from "@/utils/request";
import { useUserStore } from "@/stores";
import { useRoute } from "vue-router";
import type { Socket } from "socket.io-client";
import type { TimeMessages, Message } from "@/types/room";
import { MsgType } from "@/enums";
// 建立连接
const store = useUserStore();
const route = useRoute();
const list = ref<Message[]>([]);
let socket: Socket;
onMounted(() => {
  socket = io(baseURL, {
    // 配置对象
    auth: {
      // token(身份认证)
      token: `Bearer ${store.user?.token}`,
    },
    query: {
      // 订单id(防止不会发错)
      orderId: route.query.orderId,
    },
  });
  // 连接成功
  socket.on("connect", () => {
    console.log("yes");
  });
  // 错误异常消息
  socket.on("error", (error) => {
    console.log("error", error);
  });
  // 已经断开连接
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
  // 接收聊天记录(默认消息)
  // 绑定消息记录事件,后台连接成功后会主动发送
  // 只能是chatMsgList 表示默认数据
  // res是请求的数据 data是数据的类型
  socket.on("chatMsgList", (res: { data: TimeMessages[] }) => {
    // console.log(res.data)
    const arr: Message[] = []; // 最终的数据
    // 处理消息(分组的时间需要作为一个通用消息来处理,items取出来放到最后面)
    res.data.forEach((item) => {
      // 追加四条消息(自己组织的,处理成消息列表的形式,目前不是)
      arr.push({
        msgType: MsgType.Notify, // 消息类型(通用消息)
        msg: { content: item.createTime }, // 默认消息(时间形式)
        createTime: item.createTime, // 时间
        id: item.createTime, // id(时间形式的id)
      });
      arr.push(...item.items); // 把接收的数据和整理的数据进行合并
    });
    // 接收的是三条数据,进行整理成了四条数据,追加到list数组中
    list.value.unshift(...arr);
    // console.log(list.value)
  });
});
// 关闭连接
onUnmounted(() => {
  socket.close();
});
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <!-- 头部提示 -->
    <RoomStatus />
    <!-- 消息内容 -->
    <RoomMessage />
    <!-- 底部对话框 -->
    <RoomAction />
  </div>
</template>
<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
