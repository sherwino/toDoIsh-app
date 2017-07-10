const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
 // define model =================
    const ToDo = Schema({
        text : { type: String }
    });

const Todoo = mongoose.model('todo', ToDo );

module.exports = Todo;