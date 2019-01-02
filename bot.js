class Bot {
  constructor() {
    this._fns = [];
    this._pending = false;
  }

  waitMs(ms) {
    return this._chain(() => this._waitMs(ms));
  }

  waitUntil(fn, ms, timeout) {
    return this._chain(() => this._waitUntil(fn, ms, timeout));
  }

  waitFor(sel, ms, timeout) {
    return this._chain(
      () => this._waitUntil(() => this._getEl(sel), ms, timeout)
    );
  }

  click(sel) {
    return this._chain(() => this._click(sel));
  }

  input(sel, val) {
    return this._chain(() => this._input(sel, val));
  }

  run(fn) {
    return this._chain(() => {
      fn();
      return Promise.resolve();
    });
  }

  exec(times = 1) {
    if (this._pending) {
      return Promise.reject(new Error('Bot already started'));
    }

    this._pending = true;

    return this._repeat(this._fns, times)
      .reduce((cur, next) => {
        return cur.then(() => next());
      }, Promise.resolve())
      .then(() => {
        this._pending = false;
      });
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
          rej(new Error(`Bot "waitUntil" stopped due to time out`));
        }
      }, ms);
    });
  }

  _click(sel) {
    const el = this._getEl(sel);
    if (!el) {
      return Promise.reject(new Error(`Element with selector "${sel}" not found`));
    }

    el.dispatchEvent(new MouseEvent('click'));
    return Promise.resolve(el);
  }

  _input(sel, val) {
    const el = this._getEl(sel);
    if (!el) {
      return Promise.reject(new Error(`Element with selector "${sel}" not found`));
    }

    el.value = val;
    el.dispatchEvent(new KeyboardEvent('input'));
    return Promise.resolve(el);
  }

  _getEl(sel) {
    return document.querySelector(sel);
  }

  _chain(fn) {
    this._fns.push(fn);
    return this;
  }

  _repeat(arr, times) {
    let res = arr.slice();

    while (times > 1) {
      res = res.concat(arr);
      --times;
    }

    return res;
  }
}