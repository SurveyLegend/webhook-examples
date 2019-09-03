const http = require('http')

// TODO: experiment with sending different data
const data = JSON.stringify({
    id: '123'
})


// TODO: experiment with sending different headers
const headers = {
    'Content-Type': 'application/json',
    //'Content-Type': 'application/xml',
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
}

const options = {
    hostname: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT) || 4000,
    path: process.env.WEBHOOK_URL || '/',
    method: 'POST',
    headers
}

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    const chunks = []

    res.on('data', chunk => {
        chunks.push(chunk)
    })

    res.on('end', () => {
        const body = Buffer.concat(chunks).toString()
        console.log(body)
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.write(data)
req.end()