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


bot.onText(/\/startGuessing/, (msg) => {

    sentMasg = bot.sendMessage(msg.chat.id, "Dale, copate", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Me prendo",
                    callback_data: JSON.stringify({
                        'command': 'join',
                    })

                }]
            ],
            }
        }).then((resutl)=>{setTimeout(() => {bot.deleteMessage(msg.chat.id, resutl.message_id);}, 60000)});

    
        
    });

join_message = ''

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const data = JSON.parse(callbackQuery.data);
    const opts = {
        chat_id: callbackQuery.message.chat.id,
        join_message: callbackQuery.message.message_id,
        sender_id: callbackQuery.from.id,
        sender_name: callbackQuery.from.first_name
    };
    if (data.command === 'join') {
        bot.sendMessage(opts.sender_id, "Gracias por unirte " + opts.sender_name);
    }
});



