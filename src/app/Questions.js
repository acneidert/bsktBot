const log = require("log-beautify");
const { v4: uuidv4 } = require('uuid');

class Questions {
  constructor() {
    if (!Questions.instance) {
      this._Questions = [];
      Questions.instance = this;
    }

    return Questions.instance;
  }

  add({from, to, func}) {
    const id = uuidv4();
    this._Questions.push({id, from, to, func});
  }

  async run(msg) {
    const { from, to } = msg;
    if(!this._Questions.length) {
      log.debug(`[Questions][run]\t There no Questions`)
      return;
    };
    log.debug(`[Questions][run]\t Iterating over Questions`)
    for (let i = 0; i < this._Questions.length; i++) {
      const { from: questionFrom, to: questionTo, func, id } = this._Questions[i];
      if (from === questionFrom && to === questionTo) {
        log.debug(`[Questions][run]\t Found matching Question`);
        this._Questions.splice(i, 1); // need be here to prevent infinite loop
        await func(msg);
        console.log(this._Questions);
        return;
      }
    }
  }
}

const instance = new Questions();
Object.freeze(instance);

module.exports = instance;
