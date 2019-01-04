describe('Bot (public methods)', () => {
  let bot;
  beforeEach(() => bot = new Bot());

  it('waitMs', () => {
    bot._chain = jasmine.createSpy();
    bot.waitMs(100);
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('waitUntil', () => {
    bot._chain = jasmine.createSpy();
    bot.waitUntil(() => true);
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('waitFor', () => {
    bot._chain = jasmine.createSpy();
    bot.waitFor('.btn');
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('click', () => {
    bot._chain = jasmine.createSpy();
    bot.click('.btn');
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('input', () => {
    bot._chain = jasmine.createSpy();
    bot.input('.txt');
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('run', () => {
    bot._chain = jasmine.createSpy();
    bot.run(() => {});
    expect(bot._chain).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('clear', () => {
    bot._fns = [() => {}];
    bot.clear();
    expect(bot._fns.length).toBe(0);
  });

  describe('exec', () => {
    it('exec (1 time)', done => {
      const fnSpy = jasmine.createSpy().and.returnValue(Promise.resolve());

      bot._chain(fnSpy);
      bot._chain(fnSpy);
      bot._chain(fnSpy);

      bot.exec().then(() => {
        expect(fnSpy).toHaveBeenCalledTimes(3);
        done();
      });
    });

    it('exec (3 times)', done => {
      const fnSpy = jasmine.createSpy().and.returnValue(Promise.resolve());

      bot._chain(fnSpy);
      bot._chain(fnSpy);
      bot._chain(fnSpy);

      bot.exec(3).then(() => {
        expect(fnSpy).toHaveBeenCalledTimes(9);
        done();
      });
    });

    it('exec (already started)', done => {
      bot.exec();
      bot.exec().then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe('Bot already started');
        done();
      });
    });
  });
});

describe('Bot (private methods)', () => {
  let bot;
  beforeEach(() => bot = new Bot());

  it('_waitMs', done => {
    const cb = jasmine.createSpy();

    bot._waitMs(200).then(cb);

    setTimeout(() => {
      expect(cb).toHaveBeenCalled();
      done();
    }, 200);
  });

  describe('_waitUntil', () => {
    it('_waitUntil (result returned immediately)', done => {
      const result = {};
      bot._waitUntil(() => result, '.btn').then(res => {
        expect(res).toBe(result);
        done();
      }); 
    });

    it('_waitUntil (result returned later)', done => {
      let result = null;

      setTimeout(() => (result = {}), 1000);

      bot._waitUntil(() => result).then(res => {
        expect(res).toBe(result);
        done();
      }); 
    });

    it('_waitUntil (result does not returned in time)', done => {
      bot._waitUntil(() => null, 200, 500).then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe(`Wait until "fn" canceled due to time out`);
        done();
      }); 
    });
  });

  describe('_triggerEvent', () => {
    it('_triggerEvent (click)', done => {
      const fakeEl = { dispatchEvent: jasmine.createSpy() };
      const event = new MouseEvent('click');
      bot._getEl = () => fakeEl;

      bot._triggerEvent('.btn', event).then(el => {
        expect(el).toBe(fakeEl);
        expect(el.dispatchEvent).toHaveBeenCalledWith(event);
        done();
      });
    });

    it('_triggerEvent (input)', done => {
      const fakeEl = { dispatchEvent: jasmine.createSpy() };
      const event = new KeyboardEvent('input');
      bot._getEl = () => fakeEl;

      bot._triggerEvent('.txt', event, { value: '123' }).then(el => {
        expect(el).toBe(fakeEl);
        expect(el.value).toBe('123');
        expect(el.dispatchEvent).toHaveBeenCalledWith(event);
        done();
      });
    });

    it('_triggerEvent (element not found)', done => {
      const event = {};
      bot._getEl = () => null;

      bot._triggerEvent('.btn', event).then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe('Element ".btn" not found');
        done();
      });
    });
  });

  it('_getEl', () => {
    expect(bot._getEl('body')).toBe(document.body);
    expect(bot._getEl(document.body)).toBe(document.body);
    expect(bot._getEl('buddy')).toBeFalsy();
    expect(bot._getEl(null)).toBeFalsy();
  });

  it('_chain', () => {
    expect(bot._fns.length).toBe(0);

    expect(bot._chain(() => {})).toBe(bot);
    expect(bot._chain(() => {})).toBe(bot);

    expect(bot._fns.length).toBe(2);
  });

  it('_repeat', () => {
    expect(bot._repeat(['a', 'b'], 1)).toEqual(['a', 'b']);
    expect(bot._repeat(['a', 'b'], 2)).toEqual(['a', 'b', 'a', 'b']);
    expect(bot._repeat(['a', 'b'], 3)).toEqual(['a', 'b', 'a', 'b', 'a', 'b']);
  });
});
