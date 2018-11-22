const createHmac = require('crypto').createHmac

module.exports = (data, secret = '') => {
    const hmac = createHmac('sha256', secret)

    const str = data && typeof data === 'object' ? JSON.stringify(data) : `${data}`
    hmac.update(str)

    return hmac.digest('hex')
}
