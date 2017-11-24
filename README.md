# Express Mongoose Todo API

## Setup
- `yard init`
- `yard add express`
- `yarn add nodemon --dev`
- modify package.json to add scripts `"dev": "nodemon src/server.js"`
- modify package.json to add scripts `"debug": "nodemon --inspect src/server.js"`
- create src/server.js
- create express basic boilerplate
```javascript
const express = require('express')

const server = express()

server.listen(7000, () => {
  console.log('Started at http://localhost:7000')
})
```
- `yarn dev` to start server
- `yarn add mongoose`
- create src/models folder
- create src/models/init.js
```javascript
const mongoose = require('mongoose')

// Connect to our local database
mongoose.connect(
  'mongodb://localhost/todo-api',
  { useMongoClient: true },
  error => {
    //   If there was an error connecting to the database
    if (error) console.log('Error connecting to MongoDB database', error)
  }
)
// Use the Promise functionality built into Node.js
mongoose.Promise = global.Promise

module.exports = mongoose
```

- create src/models/todo.js
```javascript
// Ensure we have established a connection to the database
const mongoose = require('./init')

// Define our model
const Todo = mongoose.model('Todo', {
  description: { type: String, required: [true, 'description required'] },
  completed: { type: Boolean, default: false }
})

module.exports = Todo
```

- create `seeds.js` file in src/models
```javascript
const Todo = require('./todo')

// List all existing todos
Todo.find()
.then ( todos => {
  console.log('Todos:', todos)
})
.catch( error => {
  console.error(error)
})

// Create todos
Todo.create([
  { description: 'Create a model for a todo item with description and completed', completed: true },
  { description: 'Write out the steps (generate model) for making it using Rails', completed: false },
  { description: 'Write out the steps (schema code) for making it using Mongoose', completed: false },
  { description: `Write Rails code for querying the following: 
  (1) All todo items, 
  (2) All completed todo items, 
  (3) All incomplete todo items, 
  (4) Finding a todo item with a particular id, 
  (5) Changing a todo item’s description and persisting it to the database`, completed: false },
  { description: 'Write Mongoose code for the above list of items', completed: false }
])
```
- modify package.json to add scripts `"seed": "node src/models/seeds.js"`
- run `yarn seed` as needed
- `yarn add body-parser`
- modify server.js to look like the following:
```javascript
const express = require('express')
const bodyParser = require('body-parser')

const server = express()

// Allow POST/PUT/PATCH requests to pass along JSON, and it will be decoded
// for us and it will be decoded for us at 'req.json'
server.use(bodyParser.json())

server.use('/',[
  require('./routes/todos')
])

server.listen(7000, () => {
  console.log('Started at http://localhost:7000')
})
```
- create src/routes folder
- create src/routes/todos.js
```javascript
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
```

## Model

### Todo
- description: String
- completed: Boolean