const express = require('express')

const app = express()

const processWebhook = require('../utils/processWebhook')

const PORT = Number.parseInt(process.env.PORT) || 3000
const WEBHOOK_URL = process.env.WEBHOOK_URL || '/' // Enter this into webhook url in SurveyLegend app

app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
    const cors = require('cors')
    const CORS_ALLOWED_HEADERS = require('../utils/corsAllowedHeaders').join(', ')
    const corsOptions = {
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        methods: 'POST', // default: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        //origin: true, // default: '*'
        allowedHeaders: CORS_ALLOWED_HEADERS
    }

    app.options(WEBHOOK_URL, cors(corsOptions)) // allow pre-flight request
    app.post(WEBHOOK_URL, cors(corsOptions))
}

// SurveyLegend webhook service performs POST requests
app.post(WEBHOOK_URL, async (req, res) => {
    const { headers, body: payload } = req

    const { code, body, webhook, error } = await processWebhook(payload, headers, process.env.HANDSHAKE_KEY)

    if (code === 200) {
        const responses = webhook.decoded_payload
        console.log(responses)
        // TODO: add your business logic here, save participant responses to database, save them to a file, send an email or call another webhook
    } else if(error) {
        console.error(error)
    }

    res.status(code).send(body)

    // TODO: Optionally add more business logic here after response has been sent back, remember to not use res variable again
})

// Default to 404
app.use('/', (req, res) => {
    res.statusCode = 404
    res.send('Not found')
})


app.listen(PORT, () => {
    console.log(`SurveyLegend webhook processing server listening on localhost:${PORT} in ${process.env.NODE_ENV || 'development'}`)
})