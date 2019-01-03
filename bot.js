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

  waitFor(el, ms, timeout) {
    return this._chain(
      () => this._waitUntil(() => this._getEl(el), ms, timeout)
    );
  }

  click(el) {
    return this._chain(() => {
      return this._triggerEvent(el, new MouseEvent('click'));
    });
  }

  input(el, val) {
    return this._chain(() => {
      return this._triggerEvent(el, new KeyboardEvent('input'), { value: val })
    });
  }

  run(fn) {
    return this._chain(() => {
      const returnVal = fn();
      return returnVal instanceof Promise? returnVal: Promise.resolve();
    });
  }

  clear() {
    this._fns = [];
    return this;
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
      .finally(() => {
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
        if (timeout && msPassed >= timeout) {
          clearInterval(timerId);
          rej(new Error(`Bot "waitUntil" stopped due to time out`));
        }
      }, ms);
    });
  }

  _triggerEvent(el, event, params) {
    const target = this._getEl(el);
    if (!target) {
      return Promise.reject(new Error(`Element "${el}" not found`));
    }

    if (event.type === 'input' && params) {
      target.value = params.value;
    }

    target.dispatchEvent(event);

    return Promise.resolve(target);
  }

  _getEl(el) {
    return typeof el === 'string'? document.querySelector(el): el;
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
