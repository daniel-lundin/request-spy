const http = require('http');
const monkeypatch = require('monkeypatch');

function spy(cb) {
  monkeypatch(http, 'request', (original, options, callback) => {
    
    let startTime = Date.now();
    const clientRequest = original(options, callback);

    clientRequest.on('response', (message) => {
      const requestTime = Date.now() - startTime;
      cb(null, {
        hostname: options.host || options.hostname,
        path: options.path,
        method: options.method,
        statusCode: message.statusCode,
        requestTime
      });
    });

    clientRequest.on('socket', (socket) => {
      const requestTime = Date.now() - startTime;

      socket.on('error', (err) => {
        cb(err, {
          hostname: options.host || options.hostname,
          path: options.path,
          method: options.method,
          requestTime
        });
      });
    });

    monkeypatch(clientRequest, 'end', (original, ...args) => {
      startTime = Date.now();
      original(...args);
    });
    return clientRequest;
  });
}

function restore() {
  http.request.unpatch();
}

module.exports = {
  spy,
  restore
};
