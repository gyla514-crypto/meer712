const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.get("/", (req, res) => {
  res.send("BOT alive");
});

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events || [];
    await Promise.all(events.map(handleEvent));
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

async function handleEvent(event) {
  console.log("收到事件:", JSON.stringify(event));

  if (event.type === "join") {
    console.log("BOT 被拉進群");

    if (event.source && event.source.groupId) {
      await client.pushMessage({
        to: event.source.groupId,
        messages: [
          {
            type: "text",
            text: "✅ BOT 已加入群組，Webhook 正常運作中。"
          }
        ]
      });
    }

    return;
  }

  if (event.type === "message" && event.message.type === "text") {
    console.log("有人傳訊息:", event.message.text);

    if (event.replyToken) {
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: `收到：${event.message.text}`
          }
        ]
      });
    }

    return;
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
