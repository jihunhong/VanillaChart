module.exports = class JSONResult{
    constructor(result, msg, data){
        this.result = result;
        this.msg = msg;
        this.data = data;
    }
    success(data){
        return new JSONResult('success', null, data);
    }
    fail(msg){
        return new JSONResult('fail', msg, null);
    }
    judge(data){
        return data === undefined ? this.fail('실패') : this.success(data) ;
    }
}