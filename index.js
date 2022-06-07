const { Telegraf } = require("telegraf")
const { scrapeData } = require("./webscrapper");
const cron = require('node-cron');
const redis = require('redis');
const axios = require('axios');
const express = require('express');
const app = express();
const port = 80;
require("dotenv").config()
const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});
const url = process.env.SITE
const Token = process.env.TOKEN
client.connect()
client.on('error', function (error) {  
console.log('Error!', error);
})
client.on('connect', function () {  
    console.log('Connected to redis');
})
 
const bot = new Telegraf(Token)
// * 8 * * *
cron.schedule('*/30 * * * * *',
      async function () {
           const result = await client.lRange('id', 0, -1)
           const text = await scrapeData();
          result.forEach(async(element) => {
               await axios.post(`${url}${Token}/sendMessage`,
                    {
                        chat_id: element,
                        text: text
                    })
            })
    })
bot.start(async (ctx) => {
    const result = await client.lRange('id', 0, -1)
    const chatId = ctx.message.chat.id
    if ((result.includes(chatId.toString()) ) == false) {
           client.lPush('id', `${chatId}`)
        }
})

bot.hears(/\/stop (.+)/, async(ctx) => {
     const result = await client.lRange('id', 0, -1)
    const chatId = ctx.message.chat.id
    if ((result.includes(chatId.toString()) ) == false) {
           client.lRem('id', 1,  `${chatId}`)
        }
     ctx.reply("Bot stopped, to continue recieving updates, type /start")
})

bot.launch()
app.listen(port || process.env.PORT, () => {
    console.log(`Listening on port ${port}`);
});
