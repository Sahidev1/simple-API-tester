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
            throw new Error("Failed to create CostumTest instance");
        }
    }

    #init(){
        try {
            this.request_ids = Object.keys(this.set.requests);
            if (this.options?.useCookie) this.useCookie = true;
            if (this.options?.myCookie) this.cookie = this.options.myCookie;
            if (this.options?.includeRespData) this.includeRespData = true;
            this.testCallbacks = this.request_ids.reduce((acc, currKey) => {
                acc[currKey] = null;
            },{});
        } catch (error) {
            
        }
    }
}