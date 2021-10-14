const axios = require('axios');
const log = require('log-beautify');
require('dotenv').config();

const token = (async function () {
  const config = {
    method: 'post',
    url: `http://${process.env.WHATS_IP}:${process.env.WHATS_PORT}/api/${process.env.WHATS_SESSION}/${process.env.WHATS_SECRET}/generate-token`,
  };
  const { data } = await axios(config);
  log.debug(`[Whatsapp][token]\t Make login on whatsapp`)
  return data.token;
})();

const Whatsapp = {
  token,
};
Object.freeze(Whatsapp);
module.exports = Whatsapp;
