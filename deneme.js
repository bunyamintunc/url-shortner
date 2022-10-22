const express = require('express')
const shortId = require('shortid')
const createHttpError = require("http-errors")
const mongoose = require('mongoose')
const path = require('path')
const { NOTFOUND } = require('dns')
const { symlinkSync } = require('fs')

const app = express()
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

class Urldb {
   longUrl = ""
   shortUrl =""
    constructor(longUrl, shortUrl){
        this.longUrl = longUrl;
        
        this.shortUrl = shortUrl;
    }

}

function generateRandomUrl(){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;

}

var array = []
const dene = new Urldb("birinci","birinci");
array.push(dene)





app.set('view engine', 'ejs')

app.get('/', async (req,res,next) => {
     res.render('index')
})

app.post('/',  async (req, res, next) => {
  var deger = await  isExistUrl(req.body.url);
  console.log(deger)
  if(deger === 0){
     var shortUrl = await generateRandomUrl();
     var longUrl  = req.body.url;
     var newUrl = new Urldb(longUrl,shortUrl);
     array.push(newUrl);
      res.send("http://localhost:3000/"+shortUrl)
      console.log(array)
  }else{
    res.send("geçersiz url")
  }
})

app.get("/:shortUrl", async (req, res, next) => {
     const {shortUrl} = req.params;
     const resultUrl = await findLongUrlForShortUrl(shortUrl)
     res.redirect(resultUrl)
})

async function isExistUrl(url){
    var deger = 0;
    console.log(url)
    for(i = 0; i<array.length;i++){
        if( url == array[i].longUrl){
            console.log("aynı ")
            deger = 2;
            break;
        }
    }
    return deger;
    
}

async function findLongUrlForShortUrl(shortUrl){
    
    var url;
    for(i = 0; i<array.length; i++){
        if(array[i].shortUrl == shortUrl){
            url = array[i].longUrl;
        }
    }
    return url;
}



app.listen(3000, () => console.log("on port 3000..."))