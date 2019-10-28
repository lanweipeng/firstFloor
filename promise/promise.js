class Promise {
    constructor(executor) {
        if (typeof executor !== 'function') {
            // console.log(executor)

            throw new TypeError(`Promise resolver ${executor} is not a function`);
        }
        this.initValue();
        this.initBind();
        executor(this.resolve, this.reject)

    }
    initBind() {
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this)
    }
    initValue() {
        this.state = 'pending';
        this.value = null;
        this.reason = null;


    }
    reject(reason) {
        if (this.state == 'pending') {
            this.state = 'rejected';
            this.reason = reason;
        }
    }
    resolve(value) {

        if (this.state == 'pending') {
            this.state = 'fullfilled';
            this.value = value
            console.log(value)
        }
    }
    then(onFulfilled,onRejected){
        if(typeof )
    }
}


// export.Promise=Promise
module.exports = Promise;