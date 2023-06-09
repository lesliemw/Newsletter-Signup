const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");
const app= express();
require('dotenv').config()
let API_KEY = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req,res){
    const firstName= req.body.fName;
    const lastName= req.body.lName;
    const email= req.body.email;
    
    const data= {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData= JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/a93ca32d88";
    const options= {
        method: "POST",
        auth: "lesliemw:API_KEY"
    }

    const request= https.request(url, options, function(response){

       if (response.statusCode===200){
            res.sendFile(__dirname + "/success.html")
        } else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData)
    request.end()
});

app.post("/failure", function (req, res){
    res.redirect("/")
})

//to set the app to run on the website's port OR on port 5000 
app.listen(process.env.PORT || 5000, function(){
    console.log("Server is live on port 5000");
});




