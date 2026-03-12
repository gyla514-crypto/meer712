const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("收到事件:", JSON.stringify(req.body));

  if (req.body.events) {
    req.body.events.forEach((event) => {
      if (event.type === "join") {
        console.log("BOT 被拉進群");
      }

      if (event.type === "message") {
        console.log("有人傳訊息");
      }
    });
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("BOT alive");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
