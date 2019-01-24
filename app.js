let express = require('express');
let cookieSession = require('cookie-session');
let bodyParser = require('body-parser');
let sanitizeHtml = require('sanitize-html');

let urlEncodedParser = bodyParser.urlencoded({extended: false});

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
    res.render('todo.ejs',{todolist:req.session.todo});
})
.post('/add', urlEncodedParser, function(req,res){
    let cleanItem = sanitizeHtml(req.body.item).trim();
    if(cleanItem != ''){//verifier input
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

app.listen(5000);

