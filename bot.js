class Bot {

  constructor() {

  }

  _waitMs(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  _waitFor(sel, ms = 200, timeout = 5000) {
    return new Promise((res, rej) => {
      let el = this._getEl(sel);
      if (el) {
        return res(el);
      }

      let msPassed = 0;
      let timerId = setInterval(() => {
        el = this._getEl(sel);

        if (el) {
          clearInterval(timerId);
          res(el);
        }

        msPassed += ms;
        if (msPassed >= timeout) {
          rej(new Error(`[Bot.waitFor] element with selector "${sel}" is timed out`));
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

}
