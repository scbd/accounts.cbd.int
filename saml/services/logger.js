import { format          as _format          } from 'util'   ;
import { createLogger   , transports, format } from 'winston';
import { IncomingMessage                     } from 'http'   ;

const defaultLogLevel = process.env.LOG_LEVEL || 'info'

const GLOBAL_LOGGER = createLogger({ 
    level : defaultLogLevel,
    exitOnError: false,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
});

// ============================================================
//
// ============================================================
export function silly (msg, ...meta) {
    return GLOBAL_LOGGER.silly(formatMessage(msg, ...meta))
}

// ============================================================
//
// ============================================================
export function verbose (msg, ...meta) {
    return GLOBAL_LOGGER.verbose(formatMessage(msg, ...meta))
}

// ============================================================
//
// ============================================================
export function debug (msg, ...meta) {
    return GLOBAL_LOGGER.debug(formatMessage(msg, ...meta))
}

// ============================================================
//
// ============================================================
export function info (msg, ...meta) {
    return GLOBAL_LOGGER.info(formatMessage(msg, ...meta))
}

// ============================================================
//
// ============================================================
export function warn (msg, ...meta) {
    GLOBAL_LOGGER.warn(formatMessage(msg, ...meta))
}

// ============================================================
//
// ============================================================
export function error (msg, ...meta) {
    GLOBAL_LOGGER.error(formatMessage(msg, ...meta))
}


function formatHttpRequest(req) {

    const { method, url, body, errorMessage, error, query } = req;
    const { Authorization, authorization, ...headers }  = req.headers || {};
    let httpReq =  { 
        method, 
        url, 
        query,
        headers,
        hasAuthorizationHeader: (!!authorization || !!Authorization), 
        timestamp: new Date(),
        body : body, 
        error, 
        errorMessage, 
    };

    if(req.user && !req.user?.anonymous){
        const  { id, name } = req.user
        httpReq.user  = { id, name };
    }

    return httpReq
}

function formatHttpClientRequest(response) {

    const { request, status: responseStatus, body: responseBody, headers: responseHeaders, error } = response;
    const { method, url, qs: query, _data: payload } = request;
    const { Authorization, authorization, ...headers }  = request.header || {};
    let httpReq =  { 
        method, 
        url, 
        query,
        headers,
        hasAuthorizationHeader: (!!authorization || !!Authorization), 
        payload,
        responseStatus,
        responseContentType: responseHeaders['content-type'],
        responseBody,
    };

    return httpReq
}


function formatMessage(...params) {

    let error = null;
    let text  = null;
    let req   = null;
    let cRes  = null; //client response from superagent

    text   = params.find(e=>typeof(e)=='string');
    error  = params.find(e=>e instanceof Error);
    req    = params.find(e=>e instanceof IncomingMessage); 
    cRes   = params.find(e=>e instanceof Response);

    if(!cRes && error?.response instanceof Response) cRes = error?.response;

    params = params.filter(e=>e!==text)
    params = params.filter(e=>e!==error)
    params = params.filter(e=>e!==req)
    params = params.filter(e=>e!==cRes)

    error = cRes?.error || error;
    text  = text || error?.message || cRes?.error?.message;

    let parts = [text, ...params].filter(o=>o!==null && o!==undefined);

    parts = parts.map(o=> _format(o));

    if(error) { 
        parts.push(`\n STACK TRACE: ${_format(error.stack)}`)
    }

    if(req){
        const httpReq = formatHttpRequest(req);
        parts.push(`\n INCOMING REQ: ${_format(httpReq)}`)
    }
    
    if(cRes){
        const httpRes = formatHttpClientRequest(cRes);
        parts.push(`\n OUTGOING REQ: ${_format(httpRes)}`)
    }
    
    return parts.join(', ');
}

export default Object.freeze({
    silly, 
    verbose, 
    debug,
    info,
    warn,
    error
})