const mongoose = require("mongoose")

const connectDb = async (req, res) => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`Server is connected to the ${connection.connection.db.namespace} at ${connection.connection.host}`)
    } catch (error) {
        console.log('MongoDB connection error:', error)
        process.exit(1)
    }
} 

module.exports = {connectDb}


