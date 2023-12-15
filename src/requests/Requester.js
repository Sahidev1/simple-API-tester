const headers = require("./headers");



class Requester {
    constructor(){
        this.headers = headers;
        Object.seal(this.headers);
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

    async httpGet(url, costumHeaders=null){
        const HTTPtag = "http://";
        url = url.startsWith(HTTPtag) ? url : HTTPtag + url;
        try {
            if (costumHeaders == null) {
                const filteredHeaders = this.#filterHeaders();
                console.log(filteredHeaders);
                const response = await fetch(url, {
                    method: "GET",
                    headers: filteredHeaders
                });
                return response;
            }
            else {
                this.validateCostumHeaders(costumHeaders);
                const response = await fetch(url, {
                    method: "GET",
                    headers: costumHeaders
                });
                return response;
            }
        } catch (error) {
            throw new Error("GET Request Failed",{cause: error});
        }
    }
}

module.exports = Requester;