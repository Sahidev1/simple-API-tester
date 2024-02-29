
class TestProcedureManager{
    constructor(){
        this.procedure = {};
        this.beforeEach = {};
        this.afterEach = {};
    }


    attachTestProcedure(proc_id, proc_callback){
        try {
            this.procedure[proc_id] = proc_callback.bind(this);
        } catch (error) {
            throw new Error("Failed yo attach test procedure", {cause: error});
        }
    }

    async runTestProcedure(proc_id, args=null){
        try {
            if (!this.procedure[proc_id]) throw new Error("invalid procedure identifier");
            if (this.beforeEach[proc_id]) this.beforeEach[proc_id](args);
            let proc_res;
            if (args !== null) proc_res = await this.procedure[proc_id](args);
            proc_res = await this.procedure[proc_id]();
            if (this.afterEach[proc_id]) this.afterEach[proc_id](args);
            return proc_res;
        } catch (error) {
            throw new Error("Failed to run test procedure", {cause: error});
        }
    }

    async repeatedlyRunSyncProcedure(proc_id, repeatCount=1, args=null){
        try {
            let results = [];
            let result = null;
            for (let i = 0; i < repeatCount; i++) {
                result = await this.runTestProcedure(proc_id, args);
                results.push(result);
            }
            return results;
        } catch (error) {
            throw error;
        }
    }

    afterEachProcedure(proc_id, callback){
        this.afterEach[proc_id] = callback.bind(this);
    }

    beforeEachProcedure(proc_id, callback){
        this.beforeEach[proc_id] = callback.bind(this);
    }
}

module.exports = TestProcedureManager;

