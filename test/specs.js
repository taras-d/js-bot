describe('Bot', () => {
  let bot;

  beforeEach(() => {
    bot = new Bot();
  });

  it('_waitMs', done => {
    const cb = jasmine.createSpy();

    bot._waitMs(200).then(cb);

    setTimeout(() => {
      expect(cb).toHaveBeenCalled();
      done();
    }, 200);
  });

  describe('_waitFor', () => {
    it('_waitFor (element found immediately)', done => {
      const fakeEl = {};
      bot._getEl = () => fakeEl;

      bot._waitFor('.btn').then(el => {
        expect(el).toBe(fakeEl);
        done();
      }); 
    });

    it('_waitFor (element found later)', done => {
      let fakeEl = null;
      bot._getEl = () => fakeEl;

      setTimeout(() => (fakeEl = {}), 1000);

      bot._waitFor('.btn').then(el => {
        expect(el).toBe(fakeEl);
        done();
      }); 
    });

    it('_waitFor (element not found due to time out)', done => {
      bot._getEl = () => null;

      bot._waitFor('.btn', 200, 500).then(null, err => {
        expect(err).toEqual(jasmine.any(Error));
        expect(err.message).toBe(`[Bot.waitFor] element with selector ".btn" is timed out`);
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
        expect(err.message).toBe('[Bot.click] element with selector ".btn" not found');
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
        expect(err.message).toBe('[Bot.input] element with selector ".txt" not found');
        done();
      });
    });
  });

  it('_getEl', () => {
    expect(bot._getEl('body')).toBe(document.body);
    expect(bot._getEl('buddy')).toBeFalsy();
  });
});
