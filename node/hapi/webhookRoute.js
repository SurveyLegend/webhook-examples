const processWebhook = require('../utils/processWebhook')

const options = {
    auth: false,
    payload: {
        maxBytes: 5 * 1024 * 1024, // Good to have a limit on how large requests can be received and processed, to prevent malicious use
        parse: false,
        allow: [
            'application/json',
            'application/xml',
            'application/x-www-form-urlencoded'
        ]
    },

}

// Optional, used to allow requests from browsers,
// for instance when testing the webhook from SurveyLegend app in the browser.
// Servers calling this route are not affected by CORS
if (process.env.NODE_ENV !== 'production') {
    options.cors = {
        origin: ['*'], // Allow requests from any domain
        additionalHeaders: require('../utils/corsAllowedHeaders')
    }
}

module.exports = (path, HANDSHAKE_KEY) => {
    return {
        method: 'POST', // SurveyLegend webhook service performs POST requests
        path, // Enter this into webhook url in SurveyLegend app
        async handler(request, h) {
            const { headers, payload } = request

            const { code, body, webhook, error } = await processWebhook(payload.toString(), headers, HANDSHAKE_KEY)

            if (code === 200) {
                const responses = webhook.decoded_payload
                request.log(['webhook'], responses)
                // TODO: add your business logic here, save participant responses to database, save them to a file, send an email or call another webhook
            } else if(error) {
                request.log(['error'], error)
                // throw error
            }

            return h.response(body).code(code)
        },
        options
    }
}

