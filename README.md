# js-bot

This bot designed to simulate user actions

Main purpose is to simplify **routine/repetitive** actions with UI during **development/debugging** process

### Simple example
```javascript
new Bot()                           // create bot
  .click('.sidebar-toggle')         // click on sidebar toggle button
  .waitFor('.sidebar-menu')         // wait when sidebar menu appear in the DOM
  .waitMs(500)                      // wait 500 milliseconds
  .click('.sidebar-menu li.faq')    // click on sidebar link
  .exec();                          // execute bot (step by step)
```

### API
| method | description | return |
| ------ | ----------- | ------ |
| `waitMs(ms)` | Wait specified amount of milliseconds | _Bot_ |
| `waitUntil(fn, ms, timeout)` | Wait until function return truthy value | _Bot_ |
| `waitFor(el, ms, timeout)` | Wait for element to appear in the DOM | _Bot_ |
| `click(el)` | Trigger click event on element | _Bot_ |
| `input(el, val)` | Trigger input event on element | _Bot_ |
| `run(fn)` | Run arbitrary code | _Bot_ |
| `clear()` | Remove all steps | _Bot_ |
| `exec(times)` | Execute bot step by step | _Promise_ |
