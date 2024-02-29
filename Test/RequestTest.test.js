const {describe, expect, test, beforeEach} = require('@jest/globals');
jest.mock('axios');

const RequestTest = require('../src/TestRunner/RequestTest');
const { default: axios } = require('axios');

let requestTestInstance = null;

const mock_request = {
    "url": "http://fake-website2928311.com/",
    "method": "GET",
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    }
}
const mock_request_id = 'mock-request';
const mock_assertion_callback = (res)=>{res.status == '200'};
const mock_options = {
    cookie:"mockcookie",
    listenForCookies: true, 
    getData: true,
    costumBody: false
}



describe('RequestTest', () => {
    beforeEach(()=> {
        requestTestInstance = new RequestTest(mock_request, mock_request_id, mock_assertion_callback, mock_options);
    });

    const MOCK_DATA = "mockdata";
    const MOCK_SET_COOKIE = "mock_set_cookie";
    const MOCK_RESPONSE_STATUS = '200';
    const mock_response = {
        status: MOCK_RESPONSE_STATUS,
        data: MOCK_DATA,
        headers: {
            "set-cookie": MOCK_SET_COOKIE
        }
    };

    axios.mockResolvedValue(mock_response);

    test('RequestTest constructor', () => {
        expect(requestTestInstance.request).toEqual(mock_request);
        expect(requestTestInstance.request_id).toBe(mock_request_id);
        expect(requestTestInstance.assertCB.toString()).toBe(mock_assertion_callback.toString());
        expect(requestTestInstance.options).toEqual(mock_options);
    });

    test('RequestTest run', async () => {
        const result = await requestTestInstance.run();
        expect(result['test-result']['request-id']).toBe(mock_request_id);
        expect(result['test-result'].status).toBe(MOCK_RESPONSE_STATUS);
        expect(result['set-cookie']).toBe(mock_response.headers['set-cookie']);
        expect(result['data']).toBe(mock_response.data);
    });
    
});