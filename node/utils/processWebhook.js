const getWebhookData = require('./getWebhookData')

module.exports = async (payload, headers, HANDSHAKE_KEY) => {
    try {
        const webhook = await getWebhookData(payload, headers, HANDSHAKE_KEY)

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

        return {
            code,
            body,
            webhook
        }
    } catch (err) {
        return {
            code: 500,
            body: 'Internal server error',
            error: err
        }
    }
}