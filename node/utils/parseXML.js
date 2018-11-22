const Xml2js = require('xml2js')

module.exports = async function (value) {
    return new Promise((resolve, reject) => {
        const options = {
            explicitRoot: false,
            explicitArray: false
        }
        Xml2js.parseString(value, options, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
