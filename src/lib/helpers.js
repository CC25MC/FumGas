const bcrypt = require('bcryptjs')

const helpers = {}

helpers.encriptPassword = async (Password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(Password, salt)
    return hash
}

helpers.machPassword = async (Password, savePassword) => {
    try {
        return await bcrypt.compare(Password, savePassword)
    } catch (e) {
        console.log(e)
    }
}

module.exports = helpers