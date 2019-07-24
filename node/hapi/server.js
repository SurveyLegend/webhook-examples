const webhookRoute = require('./webhookRoute')
// Documentation, enable to explore and experiment with plugin
const Server = require('@hapi/hapi').Server

const PORT = Number.parseInt(process.env.PORT) || 3000
const IP = process.env.IP || '127.0.0.1'
const HOST = process.env.HOSTNAME || 'localhost'
const WEBHOOK_URL = process.env.WEBHOOK_URL || '/'

const server = new Server({
    host: HOST,
    address: IP,
    port: PORT,
    routes: {
        cors: true
    },
    debug: {
        log: ['error'],
        request: ['error', 'webhook']
    }
})

const routeDef = webhookRoute(WEBHOOK_URL, process.env.HANDSHAKE_KEY)

server.route(routeDef)

server.start()
    .then(() => {
        console.log(`SurveyLegend webhook processing server listening on ${server.info.uri} in ${process.env.NODE_ENV || 'development'} mode.`)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
