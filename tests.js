const { test } = require('kuta');
const axios = require('axios');
const assert = require('assert');

const requestSpy = require('./index.js');


test('should spy on network requests', (done) => {
  requestSpy((host, path, method, status, time) => {
    assert.equal(host, 'www.wikipedia.org');
    assert.equal(path, '/');
    assert.equal(method, 'GET');
    assert.equal(status, 301);
    assert(time > 0);
    done();
  });

  axios('http://www.wikipedia.org');
});
