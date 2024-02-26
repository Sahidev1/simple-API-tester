const fs = require('fs');
const AsyncLock = require('async-lock');
const path = require('path');
const VARPATH = path.join(__dirname, '../data/variables.json');

const lock = new AsyncLock();
const LOCK = 'Lock';
/**
 * Represents a Variable Accessor.
 * @class
 */
class VarAccesor {
    /**
     * Creates an instance of VarAccesor.
     * @constructor
     * @param {string} set_id - The ID of the variable set.
     * @returns {Promise<VarAccesor>} - The VarAccesor instance.
     */
    static async asyncConstruct(set_id) {
        try {
            let instance = new VarAccesor();
            await instance.#init(set_id);
            return instance;
        } catch (error) {
            throw new Error("Failed to load variables", { cause: error });
        }
    }
    
    async #init(set_id){
        try {
            this.set_id = set_id;
            let data = await this.#LockedCallback(() => fs.readFileSync(VARPATH));
            this.loaderVarObject = JSON.parse(data);
            this.globals = this.loaderVarObject[set_id].globals;
            this.locals = this.loaderVarObject[set_id].locals;
        } catch (error) {
            throw new Error("Failed to load variables", { cause: error });
        }
    }

    /**
     * Persists a local variable to the variable set.
     * @param {string} local_key - The key of the local variable.
     * @param {any} value - The value of the local variable.
     * @throws {Error} If the number of arguments is invalid or if there is an error persisting the variable.
     */
    async persistSetLocal(local_key, value) {
        try {
            if (arguments.length != 2) throw new Error("Invalid nr of arguments");
            this.setLocal(local_key, value);
            this.loaderVarObject[this.set_id].locals = this.locals;
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loaderVarObject)));
        } catch (error) {
            throw new Error("Failed to persist local variable", { cause: error });
        }
    }

    async #LockedCallback(callback) {
        try {
            return await lock.acquire(LOCK, () => callback(), { timeout: 500});
        } catch (error) {
            throw new Error("Failed to read callback", { cause: error });
        }
    }

    /**
     * Persists a global variable to the variable set.
     * @param {string} global_key - The key of the global variable.
     * @param {any} value - The value of the global variable.
     * @throws {Error} If the global variable already exists or if there is an error persisting the variable.
     */
    async persistCreateGlobal(global_key, value) {
        try {
            if (this.globals[global_key]) throw new Error("global already exists");
            this.globals[global_key] = value;
            this.loaderVarObject[this.set_id].globals = this.globals;
            await this.#LockedCallback(() => fs.writeFileSync(VARPATH, JSON.stringify(this.loaderVarObject)));
        } catch (error) {
            throw new Error("Failed to persist global variable", { cause: error });
        }
    }

    /**
     * Sets the value of a local variable.
     * @param {string} local_key - The key of the local variable.
     * @param {any} value - The value of the local variable.
     */
    setLocal(local_key, value) {
        this.locals[local_key] = value;
    }

    /**
     * Gets the value of a local variable.
     * @param {string} local_key - The key of the local variable.
     * @returns {any} The value of the local variable.
     */
    getLocal(local_key) {
        return this.locals[local_key];
    }

    /**
     * Gets the value of a global variable.
     * @param {string} global_key - The key of the global variable.
     * @returns {any} The value of the global variable.
     */
    getGlobal(global_key) {
        return this.globals[global_key];
    }
}

module.exports = VarAccesor;