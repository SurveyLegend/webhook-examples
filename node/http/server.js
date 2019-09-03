const http = require('http')

const processWebhook = require('../utils/processWebhook')
const CORS_ALLOWED_HEADERS = require('../utils/corsAllowedHeaders').join(', ')

const PORT = Number.parseInt(process.env.PORT) || 3000
const WEBHOOK_URL = process.env.WEBHOOK_URL || '/'

const server = http.createServer((req, res) => {
    const { method, url, headers } = req

    if (url === WEBHOOK_URL) { // Enter this into webhook url in SurveyLegend app

        // Optional, used to allow requests from browsers,
        // for instance when testing the webhook from SurveyLegend app in the browser.
        // Servers calling this route are not affected by CORS
        if (process.env.NODE_ENV !== 'production') {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Request-Method', '*')
            res.setHeader('Access-Control-Allow-Methods', 'POST')
            res.setHeader('Access-Control-Allow-Headers', CORS_ALLOWED_HEADERS)

            // Pre-flight request
            if ( method === 'OPTIONS' ) {
                res.statusCode = 200
                return res.end()
            }
        }

        // SurveyLegend webhook service performs POST requests
        if (method === 'POST') {
            const incomingRequestBody = []

            req.on('data', chunk => incomingRequestBody.push(chunk))

            // Return to prevent sending back 404 response
            return req.on('end', async () => {
                const payload = Buffer.concat(incomingRequestBody).toString()
                const { code, body, webhook, error } = await processWebhook(payload, headers, process.env.HANDSHAKE_KEY)

                if (code === 200) {
                    const responses = webhook.decoded_payload
                    console.log(responses)
                    // TODO: add your business logic here, save participant responses to database, save them to a file, send an email or call another webhook
                } else if(error) {
                    console.error(error)
                    // throw error
                }

                res.statusCode = code
                res.write(body)

                res.end()

                // TODO: Optionally add more business logic here after response has been sent back, remember to not use res variable again
            })
        }
    }

    // Default to 404
    res.statusCode = 404
    res.write('Not found')
    res.end()
})

server.listen(PORT)

console.log(`SurveyLegend webhook processing server listening on localhost:${PORT} in ${process.env.NODE_ENV || 'development'}`)