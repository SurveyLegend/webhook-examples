module.exports = [
    // General to enable CORS for most requests
    'Accept',
    'Authorization',
    'Accept-Language',      // Chrome might add this, https://github.com/hapijs/hapi/issues/2256
    // misc headers to allow
    'DNT',
    'If-Modified-Since',
    'Keep-Alive',
    'Origin',
    'User-Agent',
    'X-Mx-ReqToken',
    'X-Requested-With',
    // used by SurveyLegend webhook processing service
    'Content-Type',
    'X-SL-Signature' // custom header used by SurveyLegend webhook processing service
]