const RequestTest = require("./RequestTest");
const setLoader = require("./setLoader");


class CostumTest {
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
            if (this.options?.myCookie) this.cookie = this.options.myCookie;
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

    #createOptions(){
        const opt = {};
        if (this.useCookie) opt.listenForCookies = true;
        if (this.useCookie && this.cookie) opt.cookie = this.cookie;
        if (this.includeRespData) opt.getData = true;
        return opt;
    }
    
    setAllRequestCallbacks(assertCB){
        try {
            for (const key in this.testCallback){
                this.createTestCallback(key, assertCB);
            }
        } catch (error) {
            throw new Error("Failed to set all request callbacks", {cause:error});
        }
    }

    createTestCallback(req_id, assertionCB=null){
        (this.testCallback)
        try {
            if (!this.testCallback.hasOwnProperty(req_id)) throw new Error("invalid request identifier");
            const opt = this.#createOptions();
            this.testCallback[req_id] = async ()=> {
                let test = new RequestTest(this.set, req_id, assertionCB, opt);
                let result = await test.run();
                if (result?.["set-cookie"]) this.cookie = result["set-cookie"];
                return result;
            }
        } catch (error) {
            throw new Error("Failed to add callback", {cause:error});
        }
    }

    async runCallback(req_id){
        try {
            if (!this.testCallback?.[req_id]) throw new Error("invalid request identifier");
            return await this.testCallback[req_id]();
        } catch (error) {
            throw new Error("Failed to run callback", {cause:error});
        }
    }

    attachCostumCallback(callback_id,callBack){
        try {
            this.costumCallback[callback_id] = callBack.bind(this);
        } catch (error) {
            throw new Error("Failed to attach costum callback", {cause:error});
        }
    }

    async runCostumCallback(callback_id){
        try {
            if (!this.costumCallback?.[callback_id]) throw new Error("invalid callback identifier");
            return await this.costumCallback[callback_id]();
        } catch (error) {
            throw new Error("Failed to run costum callback", {cause:error});
        }
    }
}

module.exports = CostumTest;