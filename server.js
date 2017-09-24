const mysql = require('mysql') 
const express = require('express')
const app = express() 
app.use(express.static('public')) 
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var pool = mysql.createPool({
	connectionLimit: 100,
	host: "fling.seas.upenn.edu",
	user: "johnlake",
	password: "myboardpass",
	database: "johnlake"
});


app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
})

app.get('/card', function (req, res) {
	pool.getConnection(function(err,connection) {
		if (err) throw err;
		connection.query("select * from (select * from cards where score > 0 order by RAND() LIMIT 5) as topitems order by score desc LIMIT 1",function (err, result, fields) {
			connection.release();
			if (err) throw err;
			res.send(result[0]);
		});
		/*
		connection.query("select * from (select * from cards order by score DESC LIMIT 100) as topitems order by RAND() LIMIT 1",function (err, result, fields) {
			connection.release();
			if (err) throw err;
			res.send(result[0]);
		});
		*/
	});
})


app.post('/card', function (req, res) {
	//console.log(req.body);
	pool.getConnection(function(err,connection) {
		if (err) throw err;
		var sql ="INSERT INTO cards (scenario, title, score) VALUES ?";
		var values = [[req.body.scenario,req.body.title,0]];
		connection.query(sql,[values], function (err, result, fields) {
			if (err) throw err;
		});
		connection.query("SELECT * FROM cards", function (err, result, fields) {
			connection.release();
			if (err) throw err;
			res.sendFile(__dirname + "/public/index.html");

		});
	});
});

app.post('/upvote',function(req,res){
	console.log(req);
	pool.getConnection(function(err,connection) {
		if (err) throw err;
		var sql ="UPDATE cards SET score = score + 1 WHERE cardID = ?"
		var values = [[req.body.cardID]];
		connection.query(sql,[values], function (err, result, fields) {
			connection.release();
			if (err) throw err;
			res.sendFile(__dirname + "/public/index.html");
		});
	});
});


app.post('/downvote',function(req,res){
	console.log(req.body);
	pool.getConnection(function(err,connection) {
		if (err) throw err;
		var sql ="UPDATE cards SET score = score - 1 WHERE cardID = ?"
		var values = [[req.body.cardID]];
		connection.query(sql,[values], function (err, result, fields) {
			connection.release();
			if (err) throw err;
			console.log(result);
			res.sendFile(__dirname + "/public/index.html");
		});
	});
});

app.listen(80,'0.0.0.0');
