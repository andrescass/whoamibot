const TelegramBot = require('node-telegram-bot-api');
const token = '1597161992:AAGrOcoYUl3e6uVbJFV0i0eHjWHmVqeqo3Y';

const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    
    var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id,"Hello dear user");
    } 
        
    });

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome");
        
    });