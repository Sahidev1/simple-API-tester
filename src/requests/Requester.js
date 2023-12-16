const headers = require("./headers");
const methods = require("./methods");



class Requester {
    constructor(url=null){
        this.methods = methods;
        this.headers = headers;
        Object.seal(this.headers);
        this.url = url;
        console.log(this.url)
    }

    setBody (body){
        this.body = body;
    }

    setURL(url){
        const HTTPtag = "http://";
        this.url = url.startsWith(HTTPtag) ? url : HTTPtag + url;
    }

    setHeader(Hkey, Hvalue){
        try {
            this.headers[Hkey] = Hvalue;
        } catch (error) {
            throw new Error("Invalid Header");
        }
    }

    removeHeader(Hkey){
        try {
            this.headers[Hkey] = null;
        } catch (error) {
            throw new Error("Invalid Header");
        }
    }

    validateMethod(method){
        if (!this.methods.hasOwnProperty(method)) {
            throw new Error("Invalid Method");
        }
    }

    validateCostumHeaders(costumHeaders){
        costumHeaders.forEach(header => {
            if (!this.headers.hasOwnProperty(header)) {
                throw new Error("Invalid Header");
            }
        });
    }

    resetHeaders(){
        try {
            Object.keys(this.headers).forEach(key => {
                this.headers[key] = null;
            });
        } catch (error) {
            throw new Error("Failed to reset headers");
        }
    }

    LoadHeaders(headers){
        try {
            for (const key in headers) {
                if (headers.hasOwnProperty(key)) {
                    this.headers[key] = headers[key];
                }
            }
        } catch (error) {
            throw new Error("Invalid Headers");
        }
    }

    #filterHeaders(){
        let filteredHeaders = {};
        for (const key in this.headers) {
            if (this.headers[key] !== null) {
                filteredHeaders[key] = this.headers[key];
            }
        }

        return filteredHeaders;
    }

    async #req(method, costumURL=null, costumHeaders=null, body=null){
        const httptag = "http://";
        const url = this.url || costumURL;
        try {
            this.validateMethod(method);
            const headers = costumHeaders ? this.validateCostumHeaders(costumHeaders) : this.#filterHeaders();
            const res = await fetch(url, {
                method: method,
                headers: headers,
                body: this.body ? JSON.stringify(this.body) : null
            });
            return res;
        } catch (error) {
            throw new Error("Request Failed",{cause: error});
        }
    }

    async httpGet(costumURL=null, costumHeaders=null){
        return await this.#req(this.methods.GET, costumURL, costumHeaders);
    }

    async httpPost(costumURL=null, costumHeaders=null, body=null){
        return await this.#req(this.methods.POST, costumURL, costumHeaders, body);
    }

    attachAsyncRunner(runnerCallBack){
        this.runner = runnerCallBack;
    }

    async runAsyncRunner(){
        try {
            return await this.runner();
        } catch (error) {
            throw new Error("Failed to run runner",{cause: error})
        }
    }
    
}

module.exports = Requester;