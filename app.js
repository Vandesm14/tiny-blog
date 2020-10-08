const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fs = require('fs');

const app = express();

let posts = JSON.parse(fs.readFileSync('posts.json').toString());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	let admin = req.query.admin;
	res.render(__dirname + '/views/index.ejs', {admin, posts});
});

app.get('/page/:page', (req, res) => {
	let page = +req.params.page - 1;
	let admin = req.query.admin;
	ejs.renderFile(__dirname + '/views/list.ejs', {posts: posts.slice(page*10, page*10+10), admin}, function(err, html) {
		res.json({
			html,
			json: posts.slice(page*10, page*10+10)
		});
	});
});

app.listen(3000, () => console.log('server started on port: ' + 3000));