const express = require('express')
const path = require('path')
var validUrl = require('valid-url')

const app = express()

app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs')

//veri tabanını simüle etmek için url ve kısaltılmış halini tutacağımız sınıf şablonu oluşturuldu
class Urldb {
   longUrl = ""
   shortUrl =""
    constructor(longUrl, shortUrl){
        this.longUrl = longUrl;
        this.shortUrl = shortUrl;
    }
}


// veri tabanını simüle etmek için urlDb tipinde veriler tutacak dizi oluşturuldu
var array = []
const dene = new Urldb("birinci denemek için atıldı","birinci");
array.push(dene)






//index sayfasını döndürüyor.
app.get('/', async (req,res,next) => {
     res.render('index')
})


app.post('/',  async (req, res, next) => {
  
    //url geçerli mi kontrol ediliyor.
  if( validUrl.isUri(req.body.url)){
     
    // url daha önce var mı kontrol ediliyor.
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
        res.status(409).send("Url already exists")
    }
  }else{
    res.status(422).send("Url is not valid")
  }
  
})

// girilen kısa url ile yönlendirme yapılıyor.
app.get("/:shortUrl", async (req, res, next) => {
     const {shortUrl} = req.params;
     const resultUrl = await findLongUrlForShortUrl(shortUrl)
     res.redirect(resultUrl)
})

app.listen(3000, () => console.log("on port 3000..."))


//girilen url veritabanında daha önce eklenmiş mi kontrol ediliyor.
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

//girilen kısa url veri tabanında olup olmadığı kontrolü yapılıyor.
async function findLongUrlForShortUrl(shortUrl){
    var url;
    for(i = 0; i<array.length; i++){
        if(array[i].shortUrl == shortUrl){
            url = array[i].longUrl;
        }
    }
    return url;
}


// gelen url'i kısaltmak için random 6 karakterlik bir url belirleniyor.
function generateRandomUrl(){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}