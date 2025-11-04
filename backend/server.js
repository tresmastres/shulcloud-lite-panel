import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

// "BD" en memoria
const users = [
  { email: 'admin@example.com', password: '1234', name: 'Admin' }
]

app.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ detail: 'Credenciales no válidas' })
  // en real: JWT
  res.json({ token: 'fake-token-' + user.email, name: user.name })
})

app.post('/register', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password) return res.status(400).json({ detail: 'Falta email o password' })
  const exists = users.find(u => u.email === email)
  if (exists) return res.status(400).json({ detail: 'Ya existe ese email' })
  users.push({ email, password, name: name || email })
  res.json({ ok: true })
})

app.listen(3000, () => console.log('API en http://localhost:3000'))
