const express = require('express');
const bodyParser = require('body-parser');
const turf = require('@turf/turf');
const {muteConsole} = require('./config.js')
const app = express();
app.use(bodyParser.json());
const AUTH_KEY = 'hello-world';
const middleware = (req,res,next) =>{
    if (!req.headers['auth-key']) {
        res.status(400).json({ status: 'fail', statusCode: 400, message: 'Auth key does not exist' });
    } else if (req?.headers['auth-key'] !== AUTH_KEY) {
        res.status(402).json({ status: 'fail', statusCode: 402, message: 'Incorrect Auth key' });
    }else{
        next()
    }
}

module.exports = {middleware}