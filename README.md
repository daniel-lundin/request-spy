# request spy

Spy on outgoing request in node. Reports host, path, method, statusCode and time. 
Great for logging, metrics, debugging etc.

# Usage

```js
const requestSpy = require('request-spy');

requestSpy.init((host, path, method, status, time) => {
  console.log(host, path, method, status, time);
});
```
