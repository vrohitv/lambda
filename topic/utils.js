class Logger {
    constructor(logEnable=false){
        this.logEnable = logEnable
    }
    log(...arg){
        if(this.logEnable){
            console.log(...arg)
        }
    }
    set(value){
        this.logEnable = value;
    }
}

exports.l = new Logger();
exports.buildResponse = (statusCode, body) => {
    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  };

  exports.nullCheck = (parameter)=>{
    if(parameter == null || parameter == undefined || parameter == "" || parameter == "undefined"){
        return true
    }
    return false
  }