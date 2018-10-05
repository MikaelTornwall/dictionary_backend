const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

// Luodaan middleware logger ja error

const logger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---')
  next()
}

const error = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}


app.use(bodyParser.json())
app.use(cors())
app.use(logger)

let morse = [
  {
    id: 1,
    letter: 'A',
    code: '.-',
    date: new Date()
  },
  {
    id: 2,
    letter: 'B',
    code: '-...',
    date: new Date()
  },
  {
    id: 3,
    letter: 'C',
    code: '-.-.',
    date: new Date()
  }
]

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/morse', (req, res) => {
  res.json(morse)
})

app.get('/morse/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const letter = morse.find(letter => letter.id === id)

  if( letter ) {
      res.json(letter)
  } else {
    res.status(404).json({ error: 'sivua ei löydy' })
  }
})

const generateId = () => {
  let maxId = morse.length > 0 ? morse.map(n => n.id).sort((a, b) => a - b).reverse()[0] : 1
  return maxId + 1
}

app.post('/morse', (req, res) => {
  const body = req.body

  if (body.letter === undefined || body.code === undefined) {
    return res.status(400).json({ error: 'letter or code missing' })
  }

  if (body.letter.length === 0 || body.code.length === 0) {
    return res.status(400).json({ error: 'letter or code missing' })
  }

  const letter = {
    letter: body.letter,
    code: body.code,
    id: generateId(),
    date: new Date()
  }

  res.json(letter)
})

app.delete('/morse/:id', (req, res) => {
  const id = parseInt(req.params.id)
  morse = morse.filter(letter => letter.id !== id)

  res.status(204).end()
})

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Serveri päällä portissa ${PORT}`)
})
