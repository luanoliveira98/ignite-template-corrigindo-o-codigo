const express = require('express')

const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())

const repositories = []

function getRepositoryById(request, response, next) {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)
  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  request.repository = repository

  return next()
}

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository)
})

app.put('/repositories/:id', getRepositoryById, (request, response) => {
  const { title, url, techs } = request.body
  const { repository } = request

  repository.title = title
  repository.url = url
  repository.techs = techs

  return response.json(repository)
})

app.delete('/repositories/:id', getRepositoryById, (request, response) => {
  const { repository } = request

  const index = repositories.indexOf(repository)

  repositories.splice(index, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', getRepositoryById, (request, response) => {
  const { repository } = request

  repository.likes++

  return response.json({ likes: repository.likes })
})

module.exports = app
