
const axios = require('axios');

class RequestTest {
    // cookie=null ,listenForCookies=false, assertCB=null, getData=false
    // options = {cookie: null, listenForCookies: false, getData: false, costumBody: null}

    /**
     * 
     * @param {Object} set 
     * @param {string} request_id 
     * @param {function} assertCB 
     * @param {Object} [options]
     * @param {string} [options.cookie]
     * @param {boolean} [options.listenForCookies]
     * @param {boolean} [options.getData]
     * @param {Object} [options.costumBody]
     */
    constructor(set, request_id, assertCB=null, options=null){
        if (!set || !request_id) throw new Error('Please load a test set!');
        this.set = set;
        this.request_id = request_id;
        this.assertCB = assertCB;
        this.options = options;
    }

    /**
     * 
     * @param {Object} res 
     * @param {Number} res_time 
     * @returns {Object}
     */
    #create_test_res(res, res_time){
        try {
            let test_status = {
                "request-id":this.request_id,
                "status": res.status,
                "response-time_ms": Math.round(res_time),
            }
            if (this.assertCB) {
                test_status['assertion'] = this.assertCB(res)?"passed":"failed";
            }
            return test_status;
        } catch (error) {
            throw new Error("Failed to create test result");
        }
    }

    async run(){
        try {
            let req = this.set.requests[this.request_id];
            if (this.options?.cookie) req.headers['cookie'] = this.cookie;
            let conf = {
                method: req.method,
                maxBodyLength: Infinity,
                url: req.url,
                headers: req.headers || {},
                data: this.options?.costumBody || req.body || {}
            };
            let start_ms = performance.now();
            const res = await axios(conf);
            let end_ms = performance.now();
            let testres = this.#create_test_res(res, end_ms-start_ms);
            let result = {"test-result": testres};
            if (this.options?.listenForCookies && res.headers["set-cookie"]){
                result["set-cookie"]=res.headers["set-cookie"];
            }
            if (this.options?.getData){
                result["data"]=res.data;
            }
            return result;
        } catch (error) {
            throw new Error("Failed to run test", {cause: error});
        }
    }
}

module.exports = RequestTest; 