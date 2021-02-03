const TelegramBot = require('node-telegram-bot-api');
const token = '1597161992:AAGrOcoYUl3e6uVbJFV0i0eHjWHmVqeqo3Y';

const bot = new TelegramBot(token, {polling: true});

// Clase para almacenar datos del juego
class Game {
    constructor(chat_id) {
        this.chat_id = chat_id;
        this.gamersList = [];
        this.guesser = [];
        this.words = [];
    }
}

var gameDict = {};

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
    var newGame = new Game(msg.chat.id);
    gameDict[msg.chat.id] = newGame;

    sentMasg = bot.sendMessage(msg.chat.id, "Dale, copate", {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Me prendo",
                    callback_data: JSON.stringify({
                        'command': 'join',
                        'group'  : msg.chat.id,
                    })

                }]
            ],
            }
        }).then((resutl)=>{setTimeout(() => {
            var guesser;
            bot.deleteMessage(msg.chat.id, resutl.message_id);
            guesser = gameDict[msg.chat.id].gamersList[Math.floor(Math.random() * gameDict[msg.chat.id].gamersList.length)];
            gameDict[msg.chat.id].guesser = [guesser[0], guesser[1]]; // Determino guesser

            // Envio mensaje a todos los participantes avisando quien es el guesser y, a los que no son el guesser, pidiendoles una palabra
            gameDict[msg.chat.id].gamersList.forEach(element => {
                bot.sendMessage(element[0], "Le toca adivinar a " + guesser[1]);

                if(element[0] != guesser[0])
                {
                    bot.sendMessage(element[0], "necesito que me sugieras una persona, personaje o similar ");
                }
            });
        }, 60000)}).then((result)=>{
            setTimeout(() => {
                /* Este timeout avisa que no hay más tiempo para sugerir palabras, elimina el objeto game del diccionario y se despide
                 * dejando que la gente juegue, ya que no tiene nada mas para hacer.
                */
            }, 60000);
        });

    
        
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
        var exists = false;
        gameDict[data.group].gamersList.forEach(element => {
            if(element[0] == opts.sender_id)
            {
                exists = true;
            }
        });

        if(!exists) // Verifico que cada une se una una sola vez
        {
            gameDict[data.group].gamersList.push([opts.sender_id, opts.sender_name]);
            bot.sendMessage(opts.sender_id, "Gracias por unirte " + opts.sender_name);
        }
        else{
            bot.sendMessage(opts.sender_id, "Ya te habías unido, aflojale hermane " );
        }
        /*if(gameDict[data.group].gamersList.includes([opts.sender_id, opts.sender_name]) == false)
        {
            gameDict[data.group].gamersList.push([opts.sender_id, opts.sender_name]);
            bot.sendMessage(opts.sender_id, "Gracias por unirte " + opts.sender_name);
        }
        else
        {
            console.log("Repetido" + opts.sender_name);
            bot.sendMessage(opts.sender_id, "Ya te habías unido, aflojale hermane " );
        }*/
    }
});



