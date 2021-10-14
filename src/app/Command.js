const Observer = require('./Observer');
const log = require('log-beautify');
const sendMessage = require('../functions/sendMessage');

class Command {
  name = '';
  help = '';
  command = '';
  action = null;
  isGroup = false;
  permission = null;
  isIndividual = false;
  _id_subscribe = null;

  constructor({
    name = '',
    command = '',
    help = '',
    action = null,
    isGroup = false,
    isIndividual = false,
    permission = null,
  }) {
    this.name = name || '';
    this.command = command || '';
    this.help = help || '';
    this.action = action;
    this.isGroup = isGroup || false;
    this.isIndividual = isIndividual || false;
    this.permission = permission;
    this.__subscribe();
  }

  __subscribe() {
    log.debug(`[Command][__subscribe]\t Subscribing command ${this.command}`);
    this._id_subscribe = Observer.subscribe(this);
  }

  async __notify(message) {
    var params = [];
    log.debug(`[Command][__notify]\t Command ${this.command}`);
    if (!message.body || typeof message.body !== 'string') return;
    if (message.body.toUpperCase().startsWith(this.command.toUpperCase())) {
      
      if (typeof this.permission === 'function') {
        const hasPermission = await this.permission({ message });
        
        if (!hasPermission) {
          await sendMessage({to: message.chatId, message: `[BOT 🏀]\n ❌ You don't have permission to use this command`});
          log.debug(
            `[Command][__notify]\t Not has permission to: ${this.command}`
          );
          return;
        }
      }

      log.debug(`[Command][__notify]\t Execute command ${this.command}`);
      params = message.body.split(' ');
      params.splice(0, 1);
      await this.action({ message, params });
    }
  }

}

module.exports = Command;
