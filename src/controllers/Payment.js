const {
  MONTHS,
  Payment: dbPayment,
  Chat,
  Schedule,
} = require('../app/database');
const sendMessage = require('../functions/sendMessage');
const Questions = require('../app/Questions');

class Payment {
  static async makePayment({ message, params }) {
    const who = params[0];
    const { from, to } = message;
    params.splice(0, 1);
    console.log(params);
    if (!params.every((r) => MONTHS.includes(r.toUpperCase()) || r === '')) {
      const mensagem = `[BOT 🏀]\n ❌ *ERRO*\n Selecione um ou mais dos seguintes meses:\n ${MONTHS.join(
        ', '
      )}`;
      await sendMessage({ message: mensagem, to: message.chatId });
      return;
    }

    const chat = await Chat.findOne({ chatId: message.chatId, active: true });
    const schedules = await Schedule.find({ chat }).populate(
      'chat',
      'payments'
    );
    if (schedules.length === 0) {
      const mensagem = `[BOT 🏀]\n ❌ *ERRO*\n Não existe nenhum horario para este Grupo.`;
      await sendMessage({ message: mensagem, to: message.chatId });
      return;
    }
    if (schedules.length === 1) {
      params.forEach(async (param) => {
        if(param === '') return;
        const pay = dbPayment({
          who,
          month: param.toUpperCase(),
          schedule: schedules[0]._id,
          who_insert: message.from,
        });
        await pay.save();
        await schedules[0].payments.push(pay);
        schedules[0].save();
      });
      await sendMessage({
        message: `[BOT 🏀]\n Okay! Adicionado Pagamento\n Horário: *${schedules[0].where}*`,
        to: message.chatId,
      });
      return;
    }
    let mensagem = `[BOT 🏀]\n *Selecione o Horário*\n`;
    schedules.forEach((schedule, index) => {
      mensagem += `  [${index + 1}] *${schedule.where}* - `;
      mensagem += `${schedule.when}\n`;
    });
    await sendMessage({ message: mensagem, to: message.chatId });

    Questions.add({
      from,
      to,
      func: async (msg) => {
        const resp = (msg.body * 1) - 1;
        if (typeof resp === 'number') {
          console.log(resp);
          if (resp >= 0 && resp < schedules.length) {
            params.forEach(async (param) => {
              if(param === '') return;
              const pay = dbPayment({
                who,
                month: param.toUpperCase(),
                schedule: schedules[resp]._id,
                who_insert: message.from,
              });
              await pay.save();
              await schedules[resp].payments.push(pay);
              schedules[resp].save();
            });
            await sendMessage({
              message: `[BOT 🏀]\n Okay! Adicionado Pagamento!\n Horário: *${schedules[resp].where}*`,
              to: message.chatId,
            });
            return;
          }
        }

        const mensagem = `[BOT 🏀]\n *ERROR*\n ❌ Valor Incorreto!`;
        await sendMessage({ message: mensagem, to });
      },
    });
  }

  static async checkPayment({message}) {
    const {chatId, from, sender} = message;
    const whoReq = `@${from.split('@')[0]}`
    console.log(whoReq);
    const chat = await Chat.findOne({
      chatId, 
      active: true,
    }).populate({
      path:'schedule',
      populate: {
        path: 'payments',
        model: 'Payment'
      }
    });
    message = `[BOT 🏀]\n *${sender.pushname}* Pagou:\n`
    
    chat.schedule.forEach((schedule) => {
      message += `   🏀 *${schedule.where}* - ${schedule.when}\n`
      const payments = schedule.payments;
      payments.forEach((p, i) => { 
        if(p.who === whoReq) {
          message += `           ${p.month}\n`
        }
      });
    });
    sendMessage({message, to: chatId});

    console.log(chat);
  }
}

module.exports = Payment;
