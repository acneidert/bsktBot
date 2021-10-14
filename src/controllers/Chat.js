const { Chat: dbChat } = require('../app/database');
const sendMessage = require('../functions/sendMessage');

class Chat {
  static async activate({ message }) {
    const { chatId } = message;
    const chat = await dbChat.findOne({ chatId }).exec();
    if (!chat) {
      dbChat({ chatId }).save(function (err, data) {
        if (err) {
          console.error(err);
        }
      });
    } else {
      chat.active = true;
      chat.save();
    }
    await sendMessage({ message: '[BOT 🏀]\n ✅ Ativo', to: chatId });
  }

  static async deactivate({ message }) {
    const { chatId } = message;
    const chat = await dbChat.findOne({ chatId }).exec();
    if (chat) {
      chat.active = false;
      chat.save();
    }
    await sendMessage({ message: '[BOT 🏀]\n ❌ Inativo', to: chatId });
  }

  static async needBeActive({ message }) {
    const { chatId } = message;
    const chat = await dbChat.findOne({ chatId, active: true }).exec();
    console.log(chat);
    if (chat) return true;
    return false;
  }

}

module.exports = Chat;
