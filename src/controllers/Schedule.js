const {Schedule: dbSchedule, Chat} = require('../app/database');
const Questions = require("../app/Questions");
const sendMessage = require('../functions/sendMessage');

class Schedule {
    static async add({message}){
        const {from, to, chatId } = message;
        const chat = await Chat.findOne({chatId, active: true}).populate('schedule');
        if(!chat){
            sendMessage({chatId, message: "[BOT 🏀]\n Precisa registrar o BOT no Grupo"});
            return;
        }
        const newSchedule = dbSchedule({
            who_insert: from,
            chat: chat._id,
        })
        console.log(chat)
        await newSchedule.save();
        await chat.schedule.push(newSchedule);
        await chat.save();
        await sendMessage({to: chatId, message: '[BOT 🏀]\n Onde será feito o jogo?'})
        Questions.add({from, to, func: async (msg) => {
            newSchedule.where = msg.body;
            newSchedule.save();
            await sendMessage({to: chatId, message: '[BOT 🏀]\n Qual horário do jogo?'})
            Questions.add({from, to, func: async (msg) => {
                newSchedule.when = msg.body;
                newSchedule.save();
                await sendMessage({to: chatId, message: '[BOT 🏀]\n Quanto será cobrado? _(Somente Número)_'})
                Questions.add({from, to, func: async (msg) => {
                    newSchedule.value = msg.body * 1;
                    newSchedule.save();
                    await sendMessage({to: chatId, message: '[BOT 🏀]\n Okay! Obrigado!'})
                }});
            }});
        }});
        
    }

    static async list({message}) {
        const chat = await Chat.findOne({chatId: message.chatId, active: true});
        const schedules = await dbSchedule.find({chat}).populate('chat')
        let mensagem = '[BOT 🏀]\n *Horários*\n\n'
        schedules.forEach(schedule => {
            mensagem += `  🏀 *${schedule.where}* - `
            mensagem += `${schedule.when} - `
            mensagem += `R$ ${schedule.value},00\n`
        })
        sendMessage({to: message.chatId, message: mensagem}) 
    }
}

module.exports = Schedule;