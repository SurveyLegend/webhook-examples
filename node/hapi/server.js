const webhookRoute = require('./webhookRoute')
// Documentation, enable to explore and experiment with plugin
const Server = require('hapi').Server

const server = new Server({
    host: process.env.HOSTNAME || 'localhost',
    address: process.env.IP || '127.0.0.1',
    port: Number.parseInt(process.env.PORT) || 3000,
    routes: {
        cors: true
    },
    debug: {
        log: ['error'],
        request: ['error', 'webhook']
    }
})

const routeDef = webhookRoute(process.env.HANDSHAKE_KEY)

server.route(routeDef)

server.start()
    .then(() => {
        console.log(`SurveyLegend webhook processing server listening on ${server.info.uri} in ${process.env.NODE_ENV || 'development'} mode.`)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
