class Bot {

  constructor() {
    this._fns = [];
    this._started = false;
  }

  waitMs(ms) {
    return this._sequence(() => this._waitMs(ms));
  }

  waitUntil(fn, ms, timeout) {
    return this._sequence(() => this._waitUntil(fn, ms, timeout));
  }

  click(sel) {
    return this._sequence(() => this._click(sel));
  }

  input(sel, val) {
    return this._sequence(() => this._input(sel, val));
  }

  exec(fn) {
    return this._sequence(() => {
      fn();
      return Promise.resolve();
    });
  }

  start() {
    if (this._started) {
      return Promise.reject(new Error('Bot already started'));
    }

    this._started = true;

    return this._fns.reduce((cur, next) => {
      return cur.then(() => next());
    }, Promise.resolve());
  }

  _waitMs(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  _waitUntil(fn, ms = 200, timeout = 5000) {
    return new Promise((res, rej) => {
      let result = fn();
      if (result) {
        return res(result);
      }

      let msPassed = 0;
      let timerId = setInterval(() => {
        result = fn();

        if (result) {
          clearInterval(timerId);
          res(result);
        }

        msPassed += ms;
        if (msPassed >= timeout) {
          clearInterval(timerId);
          rej(new Error(`[Bot.waitUntil] stopped due to time out`));
        }
      }, ms);
    });
  }

  _click(sel) {
    const el = this._getEl(sel);
    if (!el) {
      return Promise.reject(new Error(`[Bot.click] element with selector "${sel}" not found`));
    }

    el.dispatchEvent(new Event('click'));
    return Promise.resolve(el);
  }

  _input(sel, val) {
    const el = this._getEl(sel);
    if (!el) {
      return Promise.reject(new Error(`[Bot.input] element with selector "${sel}" not found`));
    }

    el.value = val;
    el.dispatchEvent(new Event('input'));
    return Promise.resolve(el);
  }

  _getEl(sel) {
    return document.querySelector(sel);
  }

  _sequence(fn) {
    this._fns.push(fn);
    return this;
  }

}
