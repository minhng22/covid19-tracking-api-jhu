import {env} from '../service/index'

export const connect_mongodb = (req, res, next) => {
    const mongoose = require('mongoose');
    mongoose.connect(env.env_var.MONGODB_CONNECTION_STR, {useNewUrlParser: true, useUnifiedTopology: true});

    let db = mongoose.connection
    db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))
    db.once('open', () => {
        console.log('Connected to MongoDB')
        next()
    })
}