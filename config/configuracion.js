export default {
    PORT : process.env.PORT || 3000,
    DB: process.env.DB || 'mongodb://mongo/gym_database',
    SECRET_KEY: process.env.SECRET_KEY || 'your_secret'
}