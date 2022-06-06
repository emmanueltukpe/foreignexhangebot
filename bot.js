// const {scrapeData} = require("./webscrapper")
// equire("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const { TOKEN, SERVER_URL } = process.env;
// const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
// const URI = `/webhook/${TOKEN}`;
// const WEBHOOK_URL = SERVER_URL + URI;

// const app = express();
// app.use(bodyParser.json());

// const init = async () => {
//   const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
//   console.log(res.data);
// };

// app.post(URI, async (req, res) => {
//   console.log(req.body);
//   const chatId = req.body.message.chat.id

//   await axios.post(`${TELEGRAM_API}/sendMessage`, {
//       chat_id:chatId,
//       text: {scrapeData}
//   });



//   return res.send();
// });

// app.listen(process.env.PORT || 5000, async () => {
//   console.log(`App running on port ${process.env.PORT || 5000}`);
//   await init();
// });

const { scrapeData } = require("./data");
const CronJob = require('cron').CronJob;
require("dotenv").config();
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 5000;
const url = 'https://api.telegram.org/bot';
const apiToken = "5316505401:AAE2qWiabyl8tLwrIq9iuoXHo5tXePZ-pWM"
// Configurations
app.use(bodyParser.json());
// Endpoints
app.post('/', (req, res) => {
     const chatId = req.body.message.chat.id;
     const sentMessage = req.body.message.text;
    const job = new CronJob(
        '*/30 * * * * *',
        async function () {
            const text = scrapeData()
                 axios.post(`${url}${apiToken}/sendMessage`, 
               {
                    chat_id: chatId,
                    text: text
               })
               .then((response) => { 
                    res.status(200).send(response);
               }).catch((error) => {
                    res.send(error);
               });
    
        },
        null,
        false,
        'UTC'
    );
    job.start()
        
});
// Listening
app.listen(process.env.PORT || port, () => {
     console.log(`Listening on port ${process.env.PORT || port}`);
});