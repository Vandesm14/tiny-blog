const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const firebase = require('firebase');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const config = {
	apiKey: process.env.APIKEY,
	authDomain: `${process.env.PROJECTID}.firebaseapp.com`,
	databaseURL: `https://${process.env.DBNAME}.firebaseio.com`,
	storageBucket: `${process.env.BUCKET}.appspot.com`
};
firebase.initializeApp(config);

const app = express();
const db = firebase.database();

let posts = [];
let started = false;
db.ref('posts').limitToLast(30).orderByChild('date').on('value', (data) => {
	posts = data.val() ? Object.values(data.val()) : [];
	posts = posts.reverse();
	if (!started) start(0);
	fs.writeFileSync('db.json', JSON.stringify(data.toJSON()));
});

function start() {
	app.listen(3000, () => {
		console.log('server started on port: ' + 3000);
		started = true;
	});
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	res.render(__dirname + '/views/index.ejs', {admin, posts});
});

app.get('/templates', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	let templates = {
		list: ejs.render(fs.readFileSync(__dirname + '/views/partials/list.ejs').toString(), {admin}),
		viewer: ejs.render(fs.readFileSync(__dirname + '/views/partials/viewer.ejs').toString(), {admin}),
		form: ejs.render(fs.readFileSync(__dirname + '/views/partials/form.ejs').toString(), {admin})
	};
	res.json(templates);
});

app.get('/page/:page', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	let page = +req.params.page - 1;
	// TODO: Retrieve next 20 posts if  page > 3
	res.json(posts.filter(el => admin || !el.unlist ).slice(page*10, page*10+10));
});

app.get('/view', (req, res) => {
	let id = req.query.id;
	db.ref('posts').child(Object.keys(post.val())[0]).child(type).set(data);
});

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login.ejs');
});

app.post('/login', (req, res) => {
	let key = req.body.key;
	res.cookie('admin', key);
	res.redirect('/');
});

app.post('/search', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	let page = +req.params.page - 1;
	res.json(posts.filter(el => admin || !el.unlist ).slice(page*10, page*10+10));
});

// Admin Routes
app.put('/admin/create', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	let data = req.body;
	if (!admin) res.status(403).send('Forbidden, not admin');
	if (!data.date) res.status(400).send('Bad Request, missing date');
	data.date = new Date(data.date).getTime();
	console.log('create', data);
	db.ref('posts').push(data);
	res.status(200).send('Success');
});

app.post('/admin/update', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	if (!admin) res.status(403).send('Forbidden, not admin');
	let type = req.query.type;
	let id = req.query.id;
	let data = req.body.data;
	console.log('update', type, id, data);
	db.ref('posts').orderByChild('date').equalTo(+id).once('value', (post) => {
		db.ref('posts').child(Object.keys(post.val())[0]).child(type).set(data);
	});
	res.status(200).send('Success');
});

app.delete('/admin/delete', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	if (!admin) res.status(403).send('Forbidden, not admin');
	let id = req.query.id;
	console.log('delete', id);
	db.ref('posts').orderByChild('date').equalTo(+id).once('value', (post) => {
		db.ref('posts').child(Object.keys(post.val())[0]).remove()
		.then(() => {
			res.status(200).send('Success');
		})
		.catch(() => {
			res.status(500).send('Server error');
		});
	});
});