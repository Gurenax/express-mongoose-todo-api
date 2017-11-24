const express = require('express')
const Todo = require('../models/todo')

const router = express.Router()

// Read all todos or Run a query
router.get('/todos', (req, res) => {
  const query = req.query
  // If ?completed= was specified
  if (query.completed) {
    // Validate that completed value is specified as true or false
    if(query.completed==='true'||query.completed==='false') {
      Todo.find({ completed: query.completed })
        // Once it has loaded these documents
        .then(todos => {
          // Send them back as the response
          res.json(todos)
        })
        .catch(error => {
          res.status(400).json({ error: error.message })
        })
    }
    else {
      // If not a valid value for completed
      res.status(400).json({ error: `${query.completed} is not valid` })
    }
  }
  else {
    Todo.find()
      // Once it has loaded these documents
      .then(todos => {
        // Send them back as the response
        res.json(todos)
      })
      .catch(error => {
        res.status(400).json({ error: error.message })
      })
  }
})

// Read an individual todo
router.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // Ask the model for the document with this id
  Todo.findById(id)
    // Once it has loaded this document
    .then(todo => {
      // If an todo was found
      if(todo) {
        res.json(todo)
      }
      // If no todo was foound
      else {
        res.status(404).json({ error: `Todo not found with id: ${id}` })
      }
    })
    .catch(error => {
      // If there was an error, most likely with the format of the id
      res.status(400).json({ error: error.message })
    })
})

// Create
router.post('/todos', (req, res) => {
  const attributes = req.body
  Todo.create(attributes)
    .then(todo => {
      res.status(201).json(todo)
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// Update
router.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const attributes = req.body
  Todo.findByIdAndUpdate(id, attributes, { new: true, runValidators: true })
    .then(todo => {
      // If an todo was found and updated
      if(todo) {
        
        res.status(200).json(todo) //{todo: todo, update: attributes})
      }
      // If no todo was found
      else {
        res.status(404).json({ error: `Todo not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
})

// Destroy
router.delete('/todos/:id', (req, res) => {
  const id = req.params.id
  Todo.findByIdAndRemove(id)
    .then(todo => {
      // If an todo was found and deleted
      if(todo) {
        res.status(200).json(todo)
      }
      // If no todo was found
      else {
        res.status(404).json({ error: `Todo not found with id: ${id}` })
      }
    })
    .catch(error => {
      res.status(400).json({ error: error })
    })
  
})

module.exports = router