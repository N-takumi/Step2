var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// mongooseを用いてMongoDBに接続する
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo_list');


// ToDoスキーマを定義する
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  isCheck     : {type: Boolean, default: false},
  text        : String,
  createdDate : {type: Date, default: Date.now},
  limitDate   : Date,
  listName:String
});
mongoose.model('Todo', todoSchema);

//listスキーマを定義する write 1/12
var listSchema = new Schema({
  listName  :String,
  createdDate : {type: Date, default: Date.now},
});
mongoose.model('List',listSchema);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//ルーティング

// /にGETアクセス時、Todo,List一覧を取得
app.get('/',function (req,res) {
  var List = mongoose.model('List');
  List.find({},function (err,lists){
    var Todo = mongoose.model('Todo');
    Todo.find({},function (err,todos){
      res.render('index',{lists:lists,todos:todos});
    });
  });
});


//app.use('/', index);
//app.use('/users', users);

// /listに GETアクセス時,List一覧を取得
app.get('/list', function(req,res){
  var List = mongoose.model('List');
  //すべてのListを取得して送る
  List.find({}, function(err,lists){
    res.send(lists);
  });
});

// /listに POSTアクセス時,Listを追加する
app.post('/list', function(req,res){
  var listName = req.body.title;
  //console.log(listName);
  if(listName){
    var List = mongoose.model('List');
    var list = new List();
    list.listName = listName;
    list.save();

    res.send(true);
  }else{
    res.send(false);
  }
});

//リストの詳細ページにアクセス
app.get('/listPage/:listName',function(req,res){
  if(req.params.listName){
    var Todo = mongoose.model('Todo');
    var listName = req.params.listName;
    Todo.find({listName:listName}, function(err, todos){
      if(!err){
        res.render('todo',{todos:todos, listName:listName});
      }
    });
  }
});


// /todoにGETアクセスしたとき、ToDo一覧を取得するAPI
app.get('/todo', function(req, res) {
  var Todo = mongoose.model('Todo');
  // すべてのToDoを取得して送る
  Todo.find({}, function(err, todos) {
    res.send(todos);
  });
});


// /todoにPOSTアクセスしたとき、ToDoを追加するAPI
app.post('/todo', function(req, res) {

  //console.log(req.body);
  var Todo = mongoose.model('Todo');
  var todo = new Todo();

  //チェックボックスの更新
  if(req.body._id != null){
    Todo.update({_id:req.body._id}, {isCheck:req.body.flag}, {upsert: true}, function(err) {
    console.log(req.body._id);
    });
  }

  //console.log(req.body.flag);

  var name = req.body.name;
  var limit = req.body.limitDate;
  var listName = req.body.listName;
  // ToDoの名前と期限のパラーメタがあればMongoDBに保存
  if(name && limit) {
    todo.text = name;
    todo.limitDate = limit;
    todo.listName = listName;
    todo.save();
    res.send(true);
  } else {
    res.send(false);
  }
});

//リスト,Todo検索検索ページにアクセス
app.get('/search',function(req,res){
  res.render('search');
});

//検索機能
app.get('/Search/:text',function(req,res){
  //console.log(req.params);
  if(req.params.text){

    //正規表現を用いる
    re = new RegExp(req.params.text,'g');

    var List = mongoose.model('List');
    List.find({listName:re},function(err,resList){
      var Todo = mongoose.model('Todo');
      Todo.find({text:re},function(err,resTodo){
        if(!err){
          res.send({resTodo:resTodo,resList:resList});
        }
      });
    });

  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
