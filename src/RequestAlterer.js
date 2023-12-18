
/**
 * Represents a RequestAlterer object that modifies HTTP request properties.
 * @class
 */
class RequestAlterer {
    #initURL;
    #initMethod;
    #initHeaders;
    #initBody;

    /**
     * Creates a new instance of RequestAlterer.
     * @param {Object} request - The HTTP request object.
     * @throws {Error} - If invalid arguments are provided.
     */
    constructor(request) {
        try {
            if (!request) throw new Error("Invalid arguments");
            this.request = request;
            this.#readURLandMethod();
            this.#readHeaders();
            this.#readBody();
        } catch (error) {
            throw new Error("Failed to create RequestAlterer instance", { cause: error });
        }
    }

    /**
     * Reads and stores the initial URL and method of the request.
     * @private
     */
    #readURLandMethod() {
        this.#initMethod = this.request.method;
        this.#initURL = this.request.url;
    }

    /**
     * Reads and stores the initial headers of the request.
     * @private
     */
    #readHeaders() {
        this.#initHeaders = Object.assign({}, this.request.headers);
    }

    /**
     * Reads and stores the initial body of the request.
     * @private
     */
    #readBody() {
        this.#initBody = Object.assign({}, this.request.body);
    }

    /**
     * Sets the URL of the request.
     * @param {String} url - The new URL.
     */
    setURL(url) {
        this.request.url = url;
    }

    /**
     * Sets the method of the request.
     * @param {String} method - The new method.
     */
    setMethod(method) {
        this.request.method = method;
    }

    /**
     * Sets the headers of the request.
     * @param {Object} newHeaders - The new headers.
     */
    setHeaders(newHeaders) {
        this.request.headers = newHeaders;
    }

    /**
     * Sets the body of the request.
     * @param {Object} newBody - The new body.
     */
    setBody(newBody) {
        this.request.body = newBody;
    }

    /**
     * Gets the URL of the request.
     * @returns {String} - The URL.
     */
    getURL() {
        return this.request.url;
    }

    /**
     * Gets the method of the request.
     * @returns {String} - The method.
     */
    getMethod() {
        return this.request.method;
    }

    /**
     * Gets a copy of the headers of the request.
     * @returns {Object} - The headers.
     */
    getHeaders() {
        return Object.assign({}, this.request.headers);
    }

    /**
     * Gets a copy of the body of the request.
     * @returns {Object} - The body.
     */
    getBody() {
        return Object.assign({}, this.request.body);
    }

    /**
     * Gets a copy of the initial body of the request.
     * @returns {Object} - The initial body.
     */
    getInitBody() {
        return Object.assign({}, this.#initBody);
    }

    /**
     * Sets a property of the request body.
     * @param {String} propKey - The property key.
     * @param {any} newVal - The new value.
     * @throws {Error} - If the property is not found.
     */
    setBodyProp(propKey, newVal) {
        try {
            if (!this.request.body[propKey]) throw new Error("Property not found");
            this.request.body[propKey] = newVal;
        } catch (error) {
            throw new Error("Failed to set body property", { cause: error });
        }
    }

    /**
     * Resets the request to its initial state.
     */
    resetRequest() {
        this.request.url = this.#initURL;
        this.request.method = this.#initMethod;
        this.request.headers = this.#initHeaders;
        this.request.body = this.#initBody;
    }
}

module.exports = RequestAlterer;