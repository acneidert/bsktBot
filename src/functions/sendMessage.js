var axios = require('axios');
const Whatsapp = require('../config/whatsapp');
require('dotenv').config();

module.exports = async function sendMessage({ message='', to }) {
  if(!to) throw '[sendMessage] Destinatary is Need'
  const token = await Whatsapp.token;
  var values = JSON.stringify({
    phone: to,
    message: message,
    isGroup: true,
  });

  var config = {
    method: 'post',
    url: `http://${process.env.WHATS_IP}:${process.env.WHATS_PORT}/api/${process.env.WHATS_SESSION}/send-message`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: values,
  };

  const result = await axios(config);
  return result.data.status === 'success';
};
