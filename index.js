const http = require('http');
const monkeypatch = require('monkeypatch');

function spy(cb) {
  monkeypatch(http, 'request', (original, options, callback) => {
    const clientRequest = original(options, callback);
    let startTime = Date.now();
    let requestSocket;

    const errorHandler = (err) => {
      cb(err, {
        hostname: options.host || options.hostname,
        path: options.path,
        method: options.method
      });
    };


    clientRequest.once('response', (message) => {
      const requestTime = Date.now() - startTime;

      cb(null, {
        hostname: options.host || options.hostname,
        path: options.path,
        method: options.method,
        statusCode: message.statusCode,
        requestTime
      });
      requestSocket.removeListener('error', errorHandler);
    });

    clientRequest.on('socket', (socket) => {
      requestSocket = socket;
      socket.once('error', errorHandler);
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

