const express =require("express");
const path=require("path")//built-in module
const {connectMongoDB}=require('./connect')
const cookieParser=require("cookie-parser");
const {restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth");

const URL=require('./models/url')
const app=express();
const PORT=8001;


//register routes
const urlRoute=require("./routes/url")
const staticRoute=require("./routes/staticRouter")
const userRoute=require("./routes/user")

connectMongoDB('mongodb://127.0.0.1:27017/short-url')
 .then(()=> console.log("mongoDb connected successfully"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//if any request starts with url we have to use urlRouter similar to all
app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/",checkAuth,staticRoute);
app.use("/user",userRoute);



app.get('/url/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate(
        {
            shortId,
        },
        {
            $push:{
                visitHistory:{
                    timestamp:Date.now(),
                }
            }
        }
    );
    res.redirect(entry.redirectURL)
})

app.listen(PORT,()=> console.log(`server started at PORT:${PORT}`));