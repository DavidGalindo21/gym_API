import express from 'express'
import configuracion from './config/configuracion.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

export default app
