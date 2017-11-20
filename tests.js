const { test } = require('kuta');
const axios = require('axios');
const assert = require('assert');

const { spy, restore } = require('./index.js');

test.afterEach(() => {
  restore();
});

test('should spy on network requests', () => {
  let error;
  let requestData;

  spy((_error, _requestData) => {
    error = _error;
    requestData = _requestData;
  });

  return axios('http://www.wikipedia.org')
    .then(() => {
      assert.equal(error, null);
      assert.equal(requestData.hostname, 'www.wikipedia.org');
      assert.equal(requestData.path, '/');
      assert.equal(requestData.method, 'GET');
      assert.equal(requestData.statusCode, 200);
      assert(requestData.requestTime > 0);
    });
});

test('should report network errors', () => {
  let error;
  let requestData;

  spy((_error, _requestData) => {
    error = _error;
    requestData = _requestData;
  });

  return axios('http://localhost:9292')
    .catch(() => {
      assert.equal(error.message, 'connect ECONNREFUSED 127.0.0.1:9292');
      assert.equal(requestData.hostname, 'localhost');
      assert.equal(requestData.path, '/');
      assert.equal(requestData.method, 'get');
    });
});
