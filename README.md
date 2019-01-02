# js-bot

This bot designed to simulate user actions

Can be used in **development/debugging** process to perform **routine/repetitive** actions with UI

## Example
```javascript
new Bot()                           // Create bot
  .click('.sidebar-toggle')         // Click on sidebar toggle button
  .waitFor('.sidebar-menu')         // Wait when sidebar pannel appear in the DOM
  .waitMs(500)                      // Wait 500 milliseconds
  .click('.sidebar-menu li.faq')    // Click on sidebar link
  .exec();                          // Execute bot (step by step)
```
