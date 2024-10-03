import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import cookieSession from 'cookie-session'
import bodyParser from 'body-parser'
import user from './user.json' assert { type: 'json' }
import { addRoutes } from './api/looker_routes.js'
import { config } from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

app.use(
    cookieSession({
      maxAge: 360 * 1000,
      name: 'embed_session',
      secret: 'abcd'
    })
)

app.use(bodyParser.json())

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? config.frontend_host : 'http://localhost:8000',
  credentials: true
}))

app.use((req, res, next) => {
    console.log('Session at middleware:', req.session);
    next();
});

// Serve all Looker routes behind a `/api` prefix
addRoutes(app, user, '/api')

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '..', 'build')))

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})
