export default {
    PORT : process.env.PORT || 3000,
    DB: process.env.DB || 'mongodb://localhost:27017/gym_database',
    SECRET_KEY: process.env.SECRET_KEY || 'your_secret'
}