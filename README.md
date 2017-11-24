# Express Mongoose Todo API

## Setup
- `yard init`
- `yard add express`
- `yarn add nodemon`
- modify package.json to add scripts `"yarn dev": "nodemon src/server.js"`
- modify package.json to add scripts `"yarn debug": "nodemon --inspect src/server.js"`
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
- create models
- create `seeds.js` file in src/models
- modify package.json to add scripts `"yarn seed": "node src/models/seeds.js"`

## Model

### Todo
- description: String
- completed: Boolean