const http = require("http");
const https = require("https");
const monkeypatch = require("monkeypatch");

function spy(cb) {
  const patch = (original, options, callback) => {
    const clientRequest = original(options, callback);
    let startTime = Date.now();
    let requestSocket;

    const errorHandler = err => {
      cb(err, {
        hostname: options.host || options.hostname,
        path: options.path,
        method: options.method
      });
    };

    clientRequest.once("response", message => {
      const requestTime = Date.now() - startTime;

      cb(null, {
        hostname: options.host || options.hostname,
        path: options.path,
        method: options.method,
        statusCode: message.statusCode,
        requestTime
      });
      requestSocket.removeListener("error", errorHandler);
    });

    clientRequest.on("socket", socket => {
      requestSocket = socket;
      socket.once("error", errorHandler);
    });

    monkeypatch(clientRequest, "end", (original, ...args) => {
      startTime = Date.now();
      original(...args);
    });

    return clientRequest;
  };
  monkeypatch(http, "request", patch);
  monkeypatch(https, "request", patch);
}

function restore() {
  http.request.unpatch();
  https.request.unpatch();
}

module.exports = {
  spy,
  restore
};
