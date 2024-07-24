const express = require('express')
const cors = require('cors')
const app = express()

let todos = []

// Middleware to parse JSON requests
app.use(express.json())

// Middleware to handle CORS requests
app.use(cors())

// Middleware to generate static builds
app.use(express.static('dist'))

// API endpoints
app.get('/',(req, res) => {
    res.send('Go back')
})

app.get('/api/todos',(req, res) => {
    res.json(todos)
})

app.get('/api/todos/:id',(req, res) => {
    const id = req.params.id
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        res.json(todo)
    }else {
        res.status(404).json({ error: 'Not found' })
    }
})

app.put('/api/todos/:id', (req, res) => {
    const id = req.params.id
    const updatedTodo = req.body
    
    if (typeof updatedTodo.completed === 'boolean') {
        const newTodo = {
            id: updatedTodo.id,
            text: updatedTodo.text,
            completed: updatedTodo.completed
        };
        
        todos = todos.map(todo => todo.id === id ? newTodo : todo)
        res.json(newTodo)
    } else {
        res.status(400).json({ error: 'Invalid completed value' })
    }
})

// const generateId = () => {
//     const maxId = todos.length > 0
//      ? Math.max(...todos.map(todo => Number(todo.id)))
//      : 0
//     return String(maxId + 1)
// }
app.post('/api/todos', (req, res) => {
    const newTodo = req.body
    if (!newTodo.text) {
        return res.status(400).json({error: 'Todo content is required'})
    }
    const todo = {
        id: String(Date.now()),
        text: newTodo.text,
        completed: false
    }
    todos = todos.concat(todo)
    res.json(todo)
})

app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id
    todos = todos.filter(todo => todo.id!== id)
    res.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

