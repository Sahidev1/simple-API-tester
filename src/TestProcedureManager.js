
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

    summarizeResults(results){
        if (!Array.isArray(results)) results = [results];

        let analysis = {
            totalTests:0,
            totalPassed:0,
            responseTimes:[],
            statusCount:{}
        }
        
        results.reduce((acc, curr) => {
            let testResult = curr['test-result'];

            if (!acc.statusCount[testResult.status]) {
                acc.statusCount[testResult.status] = 1;
            } else {
                acc.statusCount[testResult.status] += 1;
            }

            acc.totalTests++;

            if (testResult.assertion === 'passed') acc.totalPassed++;

            acc.responseTimes.push(testResult['response-time_ms']);
            return acc;
        }, analysis);

        let sum_resp_times = analysis.responseTimes.reduce((acc, curr) => {
            acc += curr;
            return acc;
        },0);

        let passrate_percent = (analysis.totalPassed / analysis.totalTests) * 100;
        const stats = {
            'avg-responsetime': (sum_resp_times / analysis.totalTests),
            'min-responsetime': Math.min(...analysis.responseTimes),
            'max-response': Math.max(...analysis.responseTimes),
            'totalTests': analysis.totalTests,
            'totalPassed': analysis.totalPassed,
            'pass-rate': `${passrate_percent}%`,
            'status-count': analysis.statusCount
        }

        return {data:analysis, stats: stats};
    }

    afterEachProcedure(proc_id, callback){
        this.afterEach[proc_id] = callback.bind(this);
    }

    beforeEachProcedure(proc_id, callback){
        this.beforeEach[proc_id] = callback.bind(this);
    }
}

module.exports = TestProcedureManager;

