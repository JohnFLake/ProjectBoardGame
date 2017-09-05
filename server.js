const mysql = require('mysql') 
const express = require('express')
const app = express() 
app.use(express.static('public')) 
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
})

app.get('/card', function (req, res) {
	var con = mysql.createConnection({
		host: "localhost",
		user: "jlake",
		password: "boardpass",
		database: "CardData"
	});
	con.connect(function(err) {
		if (err) throw err;
		con.query("select * from (select * from cards order by score DESC LIMIT 100) as topitems order by RAND() LIMIT 1",function (err, result, fields) {
			if (err) throw err;
			res.send(result[0]);
		});
	});
})


app.post('/card', function (req, res) {
	var con = mysql.createConnection({
		host: "localhost",
		user: "jlake",
		password: "boardpass",
		database: "CardData"
	});
	//console.log(req.body);
	con.connect(function(err) {
		if (err) throw err;
		var sql ="INSERT INTO cards (scenario, title, score) VALUES ?";
		var values = [[req.body.scenario,req.body.title,0]];
		con.query(sql,[values], function (err, result, fields) {
			if (err) throw err;
		});
		con.query("SELECT * FROM cards", function (err, result, fields) {
			if (err) throw err;
			res.sendFile(__dirname + "/public/index.html");

		});
	});
});

app.post('/upvote',function(req,res){
	var con = mysql.createConnection({
		host: "localhost",
		user: "jlake",
		password: "boardpass",
		database: "CardData"
	});
	console.log(req);
	con.connect(function(err) {
		if (err) throw err;
		var sql ="UPDATE cards SET score = score + 1 WHERE cardID = ?"
		var values = [[req.body.cardID]];
		con.query(sql,[values], function (err, result, fields) {
			if (err) throw err;
			res.sendFile(__dirname + "/public/index.html");
		});
	});
});


app.post('/downvote',function(req,res){
	var con = mysql.createConnection({
		host: "localhost",
		user: "jlake",
		password: "boardpass",
		database: "CardData"
	});
	console.log(req.body);
	con.connect(function(err) {
		if (err) throw err;
		var sql ="UPDATE cards SET score = score - 1 WHERE cardID = ?"
		var values = [[req.body.cardID]];
		con.query(sql,[values], function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.sendFile(__dirname + "/public/index.html");
		});
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
