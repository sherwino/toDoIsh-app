const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const myTodoSchema = new Schema({
    text: {
      type: String
    },
    completed: { 
      type: Boolean,
      default: false
    }
  });

const TodoModel = mongoose.model('Todo', myTodoSchema);


module.exports = TodoModel;
