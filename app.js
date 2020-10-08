const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const fs = require('fs');
require('dotenv').config();

const app = express();

let posts = JSON.parse(fs.readFileSync('posts.json').toString());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	let admin = req.cookies.admin === process.env.KEY;
	res.render(__dirname + '/views/index.ejs', {admin, posts});
});

app.get('/templates', (req, res) => {
	let admin = req.cookies.admin === process.env.KEY;
	let templates = {
		list: fs.readFileSync(__dirname + `/views/partials/list${admin ? '-admin' : ''}.ejs`).toString(),
		viewer: fs.readFileSync(__dirname + `/views/partials/viewer${admin ? '-admin' : ''}.ejs`).toString()
	}
	res.json(templates);
});

app.get('/page/:page', (req, res) => {
	let page = +req.params.page - 1;
	res.json(posts.slice(page*10, page*10+10));
});

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login.ejs');
});

app.post('/login', (req, res) => {
	let key = req.body.key;
	res.cookie('admin', key);
	res.redirect('/');
});

app.listen(3000, () => console.log('server started on port: ' + 3000));