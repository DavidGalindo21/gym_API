import express from 'express'
import { userModel } from './models/userModel.js'
import authRoutes from './routes/authRoute.js'
import adminRoutes from './routes/adminRoute.js'
import userRoutes from './routes/userRoute.js'
import route from './routes/coachRoute.js'
import morgan from 'morgan'
import { options } from './swagger/swaggerOptions.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

app.use('/docs',  swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)))
app.use('/api',authRoutes)
app.use('/api',adminRoutes)
app.use('/api',userRoutes)
app.use('/api', route)
app.use('/users',(req,res) =>{
    userModel.find().then(users => {
        res.json(users)
    }).catch(err => {
        res.status(500).json({ error: 'Error al obtener los usuarios' })
    })
})

export default app