const mongoose = require("mongoose");
async function DbConnection(){
  

    const connectionDB = await mongoose.connect(process.env.DB)
    if(connectionDB)  console.log("MONGO DB ATLAS IS CONNECTED SUCCESSFULLY")

    }


module.exports = {DbConnection}