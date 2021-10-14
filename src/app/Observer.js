const { v4: uuidv4 } = require('uuid');
const log = require('log-beautify');

class Observer {
  constructor() {
    if (!Observer.instance) {
      this._observers = [];
      Observer.instance = this;
    }

    return Observer.instance;
  }

  subscribe(obj) {
    const id = uuidv4();
    obj._id_subscribe = id;
    this._observers.push({ id, obj });
    return id;
  }

  unsubscribe(id) {
    this._observers = this._observers.filter(
      (subscriber) => subscriber.id !== id
    );
  }

  notify(msg) {
    const { isGroupMsg, chatId } = msg;
    this._observers.forEach(async (subscriber) => {
      log.debug(
        `[Observer][notify]\t Trying call for Sub ${subscriber.obj.command}`
      );
      const { obj } = subscriber;
      const { isGroup, isIndividual } = obj;

      // if (subscriber.obj.permission) {
      //   log.debug(`[Observer][notify]\t Not has permission to`);
      //   if (!subscriber.obj.permission(chatId)) return;
      // }

      if (isGroupMsg && isGroup) {
        log.debug(`[Observer][notify]\t Is Group ${subscriber.obj.command}`);
        await obj.__notify(msg);
      } else if (!isGroupMsg && isIndividual) {
        log.debug(
          `[Observer][notify]\t Is Individual ${subscriber.obj.command}`
        );
        subscriber.obj.__notify(msg);
      }
    });
  }
}

const instance = new Observer();
Object.freeze(instance);

module.exports = instance;
