describe('Bot', () => {
  let bot;

  beforeEach(() => {
    bot = new Bot();
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
        expect(err.message).toBe(`Bot "waitUntil" stopped due to time out`);
        done();
      }); 
    });
  });

  describe('_click', () => {
    it('_click (element found)', done => {
      const fakeEl = {
        dispatchEvent: jasmine.createSpy()
      };
      bot._getEl = () => fakeEl;

      bot._click('.btn').then(el => {
        expect(el).toBe(fakeEl);
        expect(el.dispatchEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({ type: 'click' })
        );
        done();
      });
    });

    it('_click (element not found)', done => {
      bot._getEl = () => null;

      bot._click('.btn').then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe('Element with selector ".btn" not found');
        done();
      });
    });
  });

  describe('_input', () => {
    it('_input (element found)', done => {
      const fakeEl = {
        dispatchEvent: jasmine.createSpy()
      };
      bot._getEl = () => fakeEl;

      bot._input('.txt', 'hello').then(el => {
        expect(el).toBe(fakeEl);
        expect(el.value).toBe('hello');
        expect(el.dispatchEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({ type: 'input' })
        );
        done();
      });
    });

    it('_input (element not found)', done => {
      bot._getEl = () => null;

      bot._input('.txt').then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe('Element with selector ".txt" not found');
        done();
      });
    });
  });

  it('_getEl', () => {
    expect(bot._getEl('body')).toBe(document.body);
    expect(bot._getEl('buddy')).toBeFalsy();
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
