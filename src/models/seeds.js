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
// Todo.create([
//   { description: 'Create a model for a todo item with description and completed', completed: true },
//   { description: 'Write out the steps (generate model) for making it using Rails', completed: false },
//   { description: 'Write out the steps (schema code) for making it using Mongoose', completed: false },
//   { description: 'Write Rails code for querying the following: (1) All todo items, (2) All completed todo items, (3) All incomplete todo items, (4) Finding a todo item with a particular id, (5) Changing a todo item’s description and persisting it to the database', completed: false },
//   { description: 'Write Mongoose code for the above list of items', completed: false }
// ])