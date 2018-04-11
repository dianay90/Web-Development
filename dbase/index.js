//Cite:CS 290 Lectures and Videos 

const express = require('express');
const bodyParser = require('body-parser')
const mysql = require("mysql");

const pool = mysql.createPool({
    host: "classmysql.engr.oregonstate.edu",         
    user: 'cs290_ohdi',
    password: '1211',
    database: 'cs290_ohdi'
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	  extended: true
}));

//Cite:https://stackoverflow.com/questions/26066785/proper-way-to-set-response-status-and-json-content-in-a-rest-api-made-with-nodej

app.use(express.static('public'))

app.get('/list', function(req, res,next){

  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if (!err){
      res.status(200).json(rows)
    } else {
        return next(err);
    }
  })

})

app.get('/reset-table',function(req,res,next){
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATETIME,"+
    "unit VARCHAR(255))";
    pool.query(createString, function(err){
      res.send('done');
    })
  });
});

app.get('/item/:id', function(req, res,next){

  pool.query("SELECT * FROM `workouts` WHERE id = ?",  [req.params.id],
     function(err, rows) {
       if (err) {
           return next(err);
       } else {
         res.status(200).json(rows)
       }
  });


})

app.delete('/remove', function(req, res,next){

  pool.query("DELETE FROM `workouts` WHERE id = ?",  [req.body.id],
         function(err, result) {
           if (err) {
               return next(err);
           } else {
             res.status(200).send('ok')
           }
 });



})

app.post('/add', function(req, res,next){

   pool.query("INSERT INTO `workouts` (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?, ?, ?, ?, ?)", [
      req.body.name,
      req.body.reps,
      req.body.weight,
      req.body.date,
      req.body.unit
    ],
    function(err, result){
        if (!err){
          res.status(200).json(result);
        } else {
            return next(err);
        }
  });

})

app.post('/update/:id', function(req, res,next){

   pool.query("UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=?", [
      req.body.name,
      req.body.reps,
      req.body.weight,
      req.body.date,
      req.body.unit,
      req.params.id
    ],
    function(err, result){
        if (!err){
          res.status(200).json(result);
        } else {
            return next(err);
        }
  });

})

app.use(function (req, res,next) {
    res.type('plain/text');
    res.status(400);
    res.send('400 error');
});

app.use(function (req, res,next) {
    res.type('plain/text');
    res.status(404);
    res.send('404 error');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 error');
});



app.listen(9666, function() {
     console.log('Node app is running on port');
});
