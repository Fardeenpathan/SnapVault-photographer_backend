import app from "./src/app.js";
import connectDB from "./src/config/database.js"


connectDB();



app.listen(5000, ()=>{
    console.log("server is running on port 5000");
})

