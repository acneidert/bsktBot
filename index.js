const { initializeWpp } = require("./src/app/initializeWpp");
const log = require("log-beautify");

const Whatsapp = require("./src/config/whatsapp");
const LVL = require("./src/config/logLevels");


log.setLevel(LVL.DEBUG);

require('dotenv').config();

async function main() {
    log.debug(`[index][main]\t Initializaing`)
    await Whatsapp.token;
    initializeWpp();

    log.debug(`[index][main]\t Initializaing Commands`)
    require('./src/controllers/Commands');
}

main().then(() => {
    log.info(`[BOT 🏀] => 🚀 Inicializado`)
}).catch((e) => {console.error(e)});