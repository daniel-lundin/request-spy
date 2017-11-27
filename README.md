# request spy

![logo](https://github.com/daniel-lundin/request-spy/raw/master/assets/request-spy.png)

Spy on outgoing requests in node. Reports errors, host, path, method, statusCode and request time. 
Useful for logging, metrics, debugging etc.

`npm install request-spy`

# Usage

```js
const requestSpy = require('request-spy');

// Spy on all outgoing request
requestSpy.spy((error, requestData) => {
  console.log(error); // Socket errors
  console.log(requestData);
});


// Restore
requestSpy.restore();

```

`requestData` includes the following properties:

 - hostname
 - path
 - method
 - statusCode (not set if network/socket errors occur)
 - requestTime

[MIT License](LICENSE.txt) © 2017 Daniel Lundin (http://twitter.com/danielundin).
