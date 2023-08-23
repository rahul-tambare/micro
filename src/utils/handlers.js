let statusMessages = {
    100: "Continue",
    101: "Switching Protocols",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    511: "Network Authentication Required"
}

let resStatusAndMessage ={
    SI200:{
        message:"data inserted successfylly",
        status:"success",
        statusCode:200
    },
    SU200:{
        message:"data updated successfully",
        status:"success",
        statusCode:200
    },SF200:{
        message:"data fetched successfully",
        status:"success",
        statusCode:200
    },E400:{
        message:"data not found",
        status:"failure",
        statusCode:400
    },E503:{
        message:"internel server error",
        status:"failure",
        statusCode:503
    }
}

exports.response = ({res,data,statusCode,message="",status ="success"}) =>{
    res.status(statusCode).json({
        status,
        message,
        requestId:null,
        result: data
    });
}

exports.resStatus = (key)=>{
    return resStatusAndMessage[key];
}

module.exports.mobileRegex = /^([4-9][0-9]{9,11})$/;
module.exports.dateFormatSlashYMD = /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01]))/;
module.exports.dateFormatHypenYMD = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
module.exports.pinCodeRegix = /^[1-9][0-9]{5}$/;
module.exports.rangeFormat = /^\d:\d$/;
module.exports.emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
// module.exports.emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
module.exports.rangeDateFormatHypenYMD = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])):([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
module.exports.csvInjectionRegex = /^[+=@-].*/;
