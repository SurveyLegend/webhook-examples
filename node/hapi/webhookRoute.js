const getWebhookData = require('../utils/getWebhookData')

module.exports = HANDSHAKE_KEY => {
    return {
        method: 'POST', // SurveyLegend webhook service performs POST requests
        path: '/webhook', // Enter this into webhook url in SurveyLegend app
        async handler(request, h) {
            try {
                const { headers, payload } = request
                const webhook = await getWebhookData(payload.toString(), headers, HANDSHAKE_KEY)

                let code
                let body = ''

                // Return 410 to unsubscribe from webhook.
                // SurveyLegend service will delete the webhook from the system,
                // since it means the url it is calling will never exist so there is no point in calling it again.
                // code = 410

                // Returning 400 or 500 type code will register this webhook call as failure, after 10 failures the webhook will be deactivated by SurveyLegend webhook service
                // code = 500
                // body = 'Internal server error'

                if (webhook.signatures_match) {
                    body = 'X-SL-Signature matches calculated checksum'
                    code = 200
                } else if (
                    HANDSHAKE_KEY &&
                    !webhook.signatures_match &&
                    typeof HANDSHAKE_KEY === 'string' &&
                    (HANDSHAKE_KEY + '').length > 0
                ) {
                    body = `X-SL-Signature (${webhook.signature_checksum}) does not match calculated checksum ${webhook.calculated_checksum} for content-type: ${webhook.headers['content-type']}`
                    code = 412
                } else {
                    body = 'Webhook was received and processed correctly.'
                    code = 200
                }

                if (code === 200) {
                    const responses = webhook.decoded_payload
                    request.log(['webhook'], responses)
                    // TODO: add your business logic here, save participant responses to database, save them to a file, send an email or call another webhook
                }

                return h.response(body).code(code)
            } catch (err) {
                return err
            }
        },
        options: {
            auth: false,
            cors: {
                origin: ['*'], // Allow requests from any domain
                additionalHeaders: [
                    // General to enable CORS for most requests
                    // 'Accept',           // part of default headers
                    // 'Authorization',    // part of default headers
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
            },
            payload: {
                maxBytes: 5 * 1024 * 1024, // Good to have a limit on how large requests can be received and processed, to prevent malicious use
                parse: false,
                allow: [
                    'application/json',
                    'application/xml',
                    'application/x-www-form-urlencoded'
                ]
            }
        }
    }
}

