// Ensure we have established a connection to the database
const mongoose = require('./init')

// Define our model
const Todo = mongoose.model('Todo', {
  description: { type: String, required: [true, 'description required'] },
  completed: { type: Boolean, default: false }
})

module.exports = Todo