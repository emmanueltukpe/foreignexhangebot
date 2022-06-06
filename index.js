const { scrapeData } = require("./webscrapper");
const CronJob = require('cron').CronJob;
require("dotenv").config();
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 5000;
const url = 'https://api.telegram.org/bot';
const apiToken = process.env.TOKEN
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