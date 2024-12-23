const express = require("express")
const app = express()
const cors = require("cors")
require("./config/db")
require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use(cors(corsOptions));


const apiRoutes = require("./routes/contactRoute")

app.use("/api",apiRoutes)

app.get("/",(req,res) => {
    res.send("hiii backend uhfhggvg"); 
})


const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(`server started at port no ${PORT}`);
})