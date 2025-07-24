import express from 'express'
import configuracion from './config/configuracion.js'
import authRoutes from './routes/authRoute.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api',authRoutes)

export default app