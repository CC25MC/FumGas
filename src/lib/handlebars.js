const {format} = require('timeago.js')
const poll = require('../database')
const helpers = {}

helpers.timeago = (timestamp) => {
    return format(timestamp)
}

module.exports = helpers