const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Translation = require('./models/dictionary')
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

formatData = (data) => {
  return {
    letter: data.letter,
    code: data.code,
    id: data._id
  }
}

app.get('/api/morse', (req, res) => {
  Translation
    .find({})
    .then(data => {
      res.json(data.map(formatData))
    })
})

app.get('/api/morse/:id', (req, res) => {
  Translation
    .findById(req.params.id)
    .then(data => {
      if (data) {
        res.json(formatData(data))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })


})

app.post('/api/morse', (req, res) => {
  const body = req.body

  if (body.letter === undefined || body.code === undefined) {
    return res.status(400).json({ error: 'letter or code missing' })
  }

  if (body.letter.length === 0 || body.code.length === 0) {
    return res.status(400).json({ error: 'letter or code missing' })
  }

  const data = new Translation({
    letter: body.letter,
    code: body.code,
    date: new Date()
  })

  data
    .save()
    .then(savedData => {
      res.json(formatData(savedData))
    })
})

app.put('/api/morse/:id', (req, res) => {
  const body = req.body

  const data = {
    letter: body.letter,
    code: body.code
  }

  Translation
    .findByIdAndUpdate(req.params.id, data, { new: true } )
    .then(updatedData => {
      res.json(formatData(updatedData))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/morse/:id', (req, res) => {
  Translation
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Serveri päällä portissa ${PORT}`)
})
