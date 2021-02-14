const express =require("express")
const dotenv =require("dotenv")
const bodyParser =require('body-parser')
const  connect =require("./config/db")
const router =require("./routers/userRouters")
const cors =require("cors");
const postRouters =require("./routers/PostRouters");

const app =express();
dotenv.config();



connect();
app.use(bodyParser.json());
app.use(cors());


app.use('/',router)
app.use('/',postRouters)

const PORT=process.env.PORT || 5000


app.listen( PORT ,()=>{
    console.log('Server runnig')
})