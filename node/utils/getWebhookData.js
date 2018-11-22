const parseUrlEncoded = require('qs').parse
const parseXML = require('../utils/parseXML')
const calculateChecksum = require('../utils/checksum')

module.exports = async function (payload, headers, handshake_key) {
    const content_type = headers['content-type']

    let decoded_payload
    switch (content_type) {
        case 'application/xml':
            decoded_payload = await parseXML(payload)
            break
        case 'application/x-www-form-urlencoded':
            decoded_payload = parseUrlEncoded(payload)
            break
        case 'application/json':
            decoded_payload = JSON.parse(payload)
            break;
        default:
            decoded_payload = payload
    }

    const signature = `${headers['x-sl-signature']}`.split('=')
    const signature_checksum = signature.pop()
    const signature_method = signature.pop()

    const checksum = handshake_key ? calculateChecksum(payload, handshake_key) : ''

    return {
        webhook_id: decoded_payload && typeof decoded_payload === 'object' ? decoded_payload.id : null,
        content_type: headers['content-type'],
        signature_method,
        signature_checksum,
        calculated_checksum: checksum,
        signatures_match: signature_checksum === checksum,
        headers,
        payload,
        decoded_payload
    }
}