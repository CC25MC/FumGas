const mysql = require('mysql')
const {promisify} = require('util')

const { database} = require('./keys')

const poll = mysql.createPool(database)

poll.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
    }

    if(connection) connection.release()
        console.log('DB IS CONNECTED')
        return
})

//promisyfy poll querys
poll.query = promisify(poll.query)
module.exports = poll;