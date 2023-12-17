const CookieTracker = require("./CookieTracker");
const RequestTest = require("./RequestTest");
const setLoader = require("./setLoader");


class CustomTest {
    /**
     * 
     * @param {Object} set_id 
     * @param {Object} [options]
     * @param {boolean} [options.useCookie]
     * @param {string} [options.myCookie]
     * @param {boolean} [options.includeRespData]
     */
    constructor(set_id, options=null){
        try {
            this.options = options;
            this.set = setLoader(set_id);
            this.#init();
        } catch (error) {
            throw new Error("Failed to create CostumTest instance", {cause:error});
        }
    }

    #init(){
        try {
            this.request_ids = Object.keys(this.set.requests);
            (this.request_ids)
            if (this.options?.useCookie) this.useCookie = true;
            if (this.options?.myCookie) this.initCookie = this.options.myCookie;
            if (this.options?.includeRespData) this.includeRespData = true;
            this.testCallback = this.request_ids.reduce((acc, currKey) => {
                acc[currKey] = null;
                return acc;
            },{});
            (JSON.stringify(this.testCallback))
            this.costumCallback = {};
        } catch (error) {
            throw new Error("Failed to initialize costum test");
        }
    }

    #createOptions(cookieTracker=null){
        const opt = {};
        if (this.useCookie) opt.listenForCookies = true;
        if (this.includeRespData) opt.getData = true;
        if (this.useCookie){
            if (this.initCookie && !cookieTracker?.hasCookie()){
                opt.cookie = this.initCookie;
            }
            else if (cookieTracker?.hasCookie()){
                opt.cookie = cookieTracker.getCurrentCookie();
            }
            else {
                opt.cookie = null;
            }
        }
        return opt;
    }
    
    /**
     * This function sets all requests callbacks to the same assertion callback
     * @param {Function} assertCB 
     */
    async setAllRequestCallbacks(assertCB){
        try {
            for (const key in this.testCallback){
                this.createTestCallback(key, assertCB);
            }
        } catch (error) {
            throw new Error("Failed to set all request callbacks", {cause:error});
        }
    }

    async runAllCallbacksInSequence(seq, cookieTracker=null, getcookies=false){
        try {
            const results = [];
            for (let i = 0; i < seq.length; i++) {
                const req_id = seq[i];
                let res = await this.runCallback(req_id, cookieTracker);
                if (getcookies && i === seq.length - 1){
                    results.push({"result": res, "cookieTracker": cookieTracker});
                } else {
                    results.push(res);
                }
            }
            return results;
        } catch (error) {
            throw new Error("in sequence call of callbacks failed");
        }
    }

    async runAllCallbacks(cookieTracker=null){
        try {
            let results = {};
            for (const key in this.testCallback){
                if (this.testCallback[key]){
                    results[key] = await this.runCallback(key, cookieTracker);
                }
            }
            return results;
        } catch (error) {
            throw new Error("Failed to run all callbacks", {cause:error});
        }
    }

    /**
     * this function creates a callback for a specific request
     * If you want to track cookies between requests, you need to pass a cookieTracker instance to the callback
     * @param {String} req_id 
     * @param {Function} assertionCB 
     * @param {CookieTracker} cookieTracker
     */
    createTestCallback(req_id, assertionCB=null){
        try {
            if (!this.testCallback.hasOwnProperty(req_id)) throw new Error("invalid request identifier");
            this.testCallback[req_id] = async (cookieTracker=null)=> {
                const opt = this.#createOptions(cookieTracker);
                let test = new RequestTest(this.set, req_id, assertionCB, opt);
                let result = await test.run();
                if (result?.["set-cookie"] && cookieTracker) cookieTracker.updateCookie(result["set-cookie"]);
                return result;
            }
        } catch (error) {
            throw new Error("Failed to add callback", {cause:error});
        }
    }

    /**
     * This function runs a specific request callback
     * it returns an object with the result and the cookieTracker instance
     * @param {String} req_id 
     * @returns {Object}
     */
    async runCallback(req_id, cookieTracker=null, getCookieTracker=false){
        try {
            if (!this.testCallback?.[req_id]) throw new Error("invalid request identifier");
            const res = await this.testCallback[req_id](cookieTracker);
            if (getCookieTracker) return {res, cookieTracker};
            return res;
        } catch (error) {
            throw new Error("Failed to run callback", {cause:error});
        }
    }

    /**
     * This function attaches a callback with an id that performs a test procedure.
     * Note the callback is expected to use an instance of CostumTest class
     * and call its methods such as createTestCallback and runCallback.
     * @param {String} callback_id 
     * @param {Function} callBack 
     */
    attachTestProcedure(callback_id,callBack){
        try {
            this.costumCallback[callback_id] = callBack.bind(this);
        } catch (error) {
            throw new Error("Failed to attach costum callback", {cause:error});
        }
    }

    /**
     * This function runs a specific test procedure callback
     * @param {String} callback_id 
     * @returns {*} whatever the callback returns
     */
    async runTestProcedure(callback_id){
        try {
            if (!this.costumCallback?.[callback_id]) throw new Error("invalid callback identifier");
            return await this.costumCallback[callback_id]();
        } catch (error) {
            throw new Error("Failed to run costum callback", {cause:error});
        }
    }
}

module.exports = CustomTest;