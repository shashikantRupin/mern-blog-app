require('dotenv').config()
const mongoose = require('mongoose');

const connection = mongoose.connect(process.env.MONGO_URI);
module.exports= {connection};