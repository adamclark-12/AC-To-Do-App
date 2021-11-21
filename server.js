let express = require('express')
const mongodb = require('mongodb').MongoClient
let ObjectId  = require('mongodb').ObjectId;
let sanitizeHTML = require('sanitize-html')
//const ObjectId = mongodb.ObjectId;

let app = express()
let db 

app.use(express.static('public'))

let connectionString = 'mongodb+srv://ToDoApp:T0D0App999@cluster0.ywkv9.mongodb.net/ToDoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    db = client.db()
    app.listen(3000)

})

app.use(express.json())
app.use(express.urlencoded({extended: false})) //configures the express framework to include  body obj thats adds onto the req obj
//easy to access form data they are submitting


function passwordProtected(req, res, next){
  res.set('WWW-Authenticate', 'Basic realm="To-Do App"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic TGl0dGxlRmVsbGE6U2F1c2FnZUwwdmVy"){
    next()
  }
  else{
    res.status(401).send("Authentication required")
  }
}

app.use(passwordProtected)// uses this function for all routes, added on for first function

app.get('/', function(req, res){
    db.collection('items').find().toArray(function(err, items){ //find data in the data base 
        res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form  id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        </ul>
        
      </div>

      <script>
      let items = ${JSON.stringify(items)}
      </script>

      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`)
    }) 
})
app.post('/create-item', function(req, res){
  let safeText = sanitizeHTML(req.body.text, {allowedTags : [], allowedAttributes: {}})
    db.collection('items').insertOne({text: safeText}, function(err, info){
      if (err){
        console.log('Error occured while inserting');
      }
      else{
        let data = {"_id": info.insertedId,
        "text": req.body.text
      }
      res.json(data);
      }
    }); //creates the item in the database from what the user types in 
    

})

app.post('/update-item', function(req, res) {
  // Arguments below - {Which document you want to update}, {What you want to update on that document}, {function that gets called once the DB action is complete} 
  db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success")
  
  })
})
app.post('/delete-item', function(req, res){
  db.collection('items').deleteOne({_id: new ObjectId(req.body.id)},function(){
    res.send("success")
  })
})