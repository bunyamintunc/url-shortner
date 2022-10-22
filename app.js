const express = require('express')
const shortId = require('shortid')
const createHttpError = require("http-errors")
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

mongoose.connect('mongodb://localhost:27017/', {
     dbName: 'url-shortner',
    
}).then(() => console.log('mongoose connected'))
.catch((error) => console.log(error))

app.set('view engine', 'ejs')

app.get('/', async (req,res,next) => {
     res.render('index')
})

app.get('/:shortId', async (req, res, next) => {

     try {
          const {shortId} = req.params
          const result = await shortUrl.findOne({ shortId })
          if( !result){
             throw createHttpError.NotFound('sHORT URL DOES NOT EXİST')
          }

          res.redirect(result.url)
     } catch (error) {
          next(error)
     }

     
})

app.post('/', async (req, res, next) => {
    try {
     const {url} = req.body
     if( !url ){
          throw createHttpError.BadRequest('provide a valid url')
     }
     const urlExists = await shortUrl.find({url})
     if(urlExists){
          res.render('index', {short_url: `http://localhost:3000/${urlExists.shortId}`})
          return
     }

     const shortUrl = new shortUrl({url: url, shortId: shortId.generate()})
     const result = await shortUrl.save()
     res.render('index', {short_url: `http:localhost:3000/${result.shortId}`})
    
     
} catch (error) {
     next(error)
    }
})

app.use((req, res, next) => {
     next(createHttpError.NotFound())
})

app.use((err,req,res,next) => {
     res.status(err.status || 500)
     res.render('index',{error: err.message})
})

app.listen(3000, () => console.log("on port 3000..."))