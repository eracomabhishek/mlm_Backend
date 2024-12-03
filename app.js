const express = require("express")
const app = express()
require("./config/db")
require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const apiRoutes = require("./routes/contactRoute")

app.use("/api",apiRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(`server started at port no ${PORT}`);
})