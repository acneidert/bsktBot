const log = require("log-beautify");
const io = require('socket.io-client');
const Poll = require('../app/Poll');
const Observer = require('./Observer');
const Questions = require('../app/Questions');

require('dotenv').config();

const socket = io(`http://${process.env.WHATS_IP}:${process.env.WHATS_PORT}/`);

function initializeWpp() {
  log.debug(`[initializeWpp]\t Initializaing Whatsapp Messages`)
  socket.off('received-message').on('received-message', (message) => {
    handleMessage(message)
  });

}

async function handleMessage(resp) {
    const { response: message } = resp;
    // console.log(message);
    log.debug(`[initializeWpp][handleMessage]\t Message Recived`);
    await Questions.run(message);
    await Poll.run(message);
    Observer.notify(message);
}

module.exports = {
  initializeWpp,
}