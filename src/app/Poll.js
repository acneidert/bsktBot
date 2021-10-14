const log = require("log-beautify");
const { v4: uuidv4 } = require('uuid');

class Poll {
  constructor() {
    if (!Poll.instance) {
      this._poll = [];
      Poll.instance = this;
    }

    return Poll.instance;
  }

  add({from, to, func}) {
    const id = uuidv4();
    this._poll.push({id, from, to, func});
  }

  async run(msg) {
    const { from, to } = msg;
    if(!this._poll.length) {
      log.debug(`[Poll][run]\t There no Poll`)
      return;
    };
    log.debug(`[Poll][run]\t Iterating over Poll`)
    for (let i = 0; i < this._poll.length; i++) {
      const { from: pollFrom, to: pollTo, func, id } = this._poll[i];
      if (from === pollFrom && to === pollTo) {
        log.debug(`[Poll][run]\t Found matching Poll`);
        this._poll.splice(i, 1); // need be here to prevent infinite loop
        await func(msg);
        console.log(this._poll);
        return;
      }
    }
  }
}

const instance = new Poll();
Object.freeze(instance);

module.exports = instance;
