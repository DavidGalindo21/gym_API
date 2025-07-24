import express from 'express'
import configuracion from './config/configuracion.js'
import authRoutes from './routes/authRoute.js'
import adminRoutes from './routes/adminRoute.js'
import userRoutes from './routes/userRoute.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api',authRoutes)
app.use('/api',adminRoutes)
app.use('/api',userRoutes)

export default app