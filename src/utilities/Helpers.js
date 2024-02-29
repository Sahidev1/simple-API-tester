

async function asyncDelay(ms){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

module.exports = {asyncDelay};