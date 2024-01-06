const {mongoose, DB_URL} = require("./setup")

const dbConnect = () => {
    try {
        const conn =  mongoose.connect(DB_URL)
        console.log("DB connected")
    } catch(e) {
        console.log(`Can't connect to db: ${e.message}`)
    }
}

module.exports = {dbConnect};