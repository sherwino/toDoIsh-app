const express = require('express');
var mongojs = require ('mongojs');
var db = mongojs('mongodb://admin:admin@ds121483.mlab.com:21483/meantodos', ['todos']);

const router = express.Router();

// const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api-version');
// const ListModel = require ('../models/list-model');
// const CardModel = require ('../models/card-model');

// add the  ensureLoggedInApiVersion review trello clone

//--------------------------Get Todos---------------------
router.get('/todos',(req, res, next) => {
    db.todos.find((err, todo) =>{
        if(err){
            res.send(err);
        }
        res.json(todo);
    });
});

//--------------------Get Single Task----------------------
router.get('/todo/:id', (req, res, next) => {
    db.todos.findOne({_id: mongojs.ObjectId(req.params.id)}, 
    (err, todo) => {
        if(err){
            res.send(err);
        }
        res.json(todo);
    });
});

//-------------------------------Saving Task-----------------
router.post('/todo', (req, res, next) => {
    var todo= req.body;
    if(!todo.title || !(todo.isDone + '')){
        res.status(400);
        res.json({
            "error": "Sorry Could not Save your TODO!"
        });
    } else {
        db.todos.save(todo, (err, task) => {
            if(err){
                res.send(err);
            }
            res.json(todo);
        });
    }
});

//-----------------------------------Delete Task----------------
router.delete('/todo/:id', (req, res, next) => {
    db.todos.remove({_id: mongojs.ObjectId(req.params.id)},
    (err, todo) => {
        if(err){
            res.send(err);
        }
        res.json(todo);
    });
});

//--------------------------------Update Task---------------------
router.put('/todo/:id', (req, res, next) => {
    var todo = req.body;
    var updTodo = {};
    
    if(todo.isDone){
        updTodo.isDone = todo.isDone;
    }
    
    if(todo.title){
        updTodo.todo = todo.title;
    }
    
    if(!updTodo){
        res.status(400);
        res.json({
            "message":"Sorry you could not update the TODO!"
        });
    } else {
        db.todos.update({_id: mongojs.ObjectId(req.params.id)},updTask, {}, 
        (err, task) => {
        if(err){
            res.send(err);
        }
        res.json(task);
    });
    }
});

module.exports = router;