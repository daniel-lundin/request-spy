# request spy

Spy on outgoing requests in node. Reports host, path, method, statusCode and time. 
Great for logging, metrics, debugging etc.

`npm install request-spy`

# Usage

```js
const requestSpy = require('request-spy');

requestSpy.init((host, path, method, status, time) => {
  console.log(host, path, method, status, time);
});
```
