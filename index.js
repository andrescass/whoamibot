const TelegramBot = require('node-telegram-bot-api');
const token = '1597161992:AAGrOcoYUl3e6uVbJFV0i0eHjWHmVqeqo3Y';

const bot = new TelegramBot(token, {polling: true});

// Clase para almacenar datos del juego
class Game {
    constructor(chat_id) {
        this.chat_id = chat_id;
        this.gamersIdList = [];
        this.gamersList = [];
        this.wordSender = [];
        this.guesser = [];
        this.words = [];
        this.getWors = false;
    }
}

var gameDict = {};

bot.on('message', (msg) => {
    
    if(Object.entries(gameDict).length > 0) // Reviso si hay juegos en curso
    {
        for([id, game] of Object.entries(gameDict)) // Si hay juegos en curso, reviso en cada juego
        {
            /*if(game.getWors){ // Chequeo que el juego esté en etapa de recibir palabras
                var gameId = 0;
                game.gamersList.forEach(element => {
                    var sender = false;
                    if(msg.from.id == element[0]) // Me fijo que el que escribe esté en uno de esos juegos
                    {
                        game.wordSender.forEach(element => {
                            if(msg.from.id == element) { // me fijo que no haya enviado aún una palabra
                                sender = true;
                            }
                        })
                        if(!sender)
                        {
                            game.words.push(msg.text.toString());
                            game.wordSender.push(msg.from.id);
                        }
                    }
                });
            }*/
        }
    }
    /*var Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id,"Hello dear user");
    } */
        
    });

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome");
        
    });


bot.onText(/\/startGuessing/, (msg) => {

    if(msg.chat.id === msg.from.id)
    {
        bot.sendMessage(msg.chat.id, "Este comando solo puede ejecutarse desde un grupo");
    }
    else{

    
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
            }).then((result)=>{setTimeout(() => {
                var guesser;
                bot.deleteMessage(msg.chat.id, result.message_id);
                guesser = gameDict[msg.chat.id].gamersList[Math.floor(Math.random() * gameDict[msg.chat.id].gamersList.length)];
                gameDict[msg.chat.id].guesser = [guesser[0], guesser[1]]; // Determino guesser
                bot.sendMessage(msg.chat.id, "Le toca adivinar a " + guesser[1]);

                // Envio mensaje a todos los participantes avisando quien es el guesser y, a los que no son el guesser, pidiendoles una palabra
                gameDict[msg.chat.id].gamersList.forEach(element => {
                
                    if(element[0] != guesser[0])
                    {
                        bot.sendMessage(element[0], "necesito que me sugieras una persona, personaje o similar ");
                    }
                });

                gameDict[msg.chat.id].getWors = true;
            }, 60000)}).then((result)=>{
                setTimeout(() => {
                    /* Este timeout avisa que no hay más tiempo para sugerir palabras, elimina el objeto game del diccionario y se despide
                    * dejando que la gente juegue, ya que no tiene nada mas para hacer.
                    */
                if(gameDict[msg.chat.id].words.length > 0)
                {

                }
                bot.sendMessage(msg.chat.id, "Mi tarea aquí ha finalizado, diviertanse");
                delete gameDict[msg.chat.id];
                }, 60000);
            });
        }   
        
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
            gameDict[data.group].gamersIdList.push(opts.sender_id);
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



