let express = require('express');
let cookieSession = require('cookie-session');
let sanitizeHtml = require('sanitize-html');
const PORT = process.env.PORT || 80

let urlEncodedParser = express.urlencoded({extended: false});

let app = express();

app.use(cookieSession({
    name: "session",
    secret:"mykey"
}))
.use(function (req,res,next){
    if(typeof req.session.todo == "undefined"){
        req.session.todo = [];
    }
    next();
})
.get('/', function(req, res){
    console.log(req.session.todo);
    res.render('todo.ejs',{todolist:req.session.todo});
})
.post('/add', urlEncodedParser, function(req,res){
    let cleanItem = sanitizeHtml(req.body.item).trim();
    if(cleanItem != ''){
        req.session.todo.push(cleanItem);
    }
    console.log(req.session.todo);
    res.redirect('/');
})
.get('/delete/:id', function(req,res){
    let tempArray = [];
    for(let i=0;i<req.session.todo.length;i++){
        if(i!=req.params.id){
            tempArray.push(req.session.todo[i]);
        }
    }
    req.session.todo = tempArray;
    console.log(req.session.todo);
    res.redirect('/');
});

console.log("server started on port: " + PORT);

app.listen(PORT);

