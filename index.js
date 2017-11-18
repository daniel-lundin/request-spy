const http = require('http');
const monkeypatch = require('monkeypatch');

function init(cb) {
  monkeypatch(http, 'request', (original, options, callback) => {
    
    let startTime = Date.now();
    const clientRequest = original(options, callback);

    clientRequest.on('response', (message) => {
      const requestTime = Date.now() - startTime;
      console.log(message.headers);
      cb(options.hostname, options.path, options.method, message.statusCode, requestTime);
    });

    monkeypatch(clientRequest, 'end', (original, ...args) => {
      startTime = Date.now();
      original(...args);
    });
    return clientRequest;
  });
}

module.exports = init;
