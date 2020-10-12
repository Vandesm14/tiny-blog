const fs = require('fs');
const ejs = require('ejs');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { graphql, buildSchema } = require("graphql");
const schema = buildSchema(require("fs").readFileSync("schema.gql").toString());
const root = require('./root.js');

let cache = [];

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1
});

// for (let i = 0; i < 60; i++) {
// 	root.admin.new({post: {title: 'test' + i, date: new Date().getTime() + 20000 * i, content: '', tags: ['testing']}});
// }

// Server
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	res.render(__dirname + '/views/index.ejs', {admin, posts: []});
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

app.post('/graphql', (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	if (admin) {
		console.log(req.body);
		graphql(schema, req.body.query, {...root.root, ...root.admin})
		.then(data => {
			res.json(data);
		})
		.catch(() => res.sendStatus(400));
	} else {
		graphql(schema, req.body.query, root.root)
		.then(data => res.json(data))
		.catch(() => res.sendStatus(400));
	}
});

app.get('/view', limiter, (req, res) => {
	let admin = req.cookies.admin === process.env.ADMIN;
	if (admin) {
		res.sendStatus(200);
		return;
	}
	let id = req.query.id;
	db.ref('posts').orderByChild('date').equalTo(+id).once('value', (post) => {
		db.ref('posts').child(Object.keys(post.val())[0]).child('views').set(Object.values(post.val())[0].views + 1);
	});
	res.sendStatus(200);
});

app.post('/login', (req, res) => {
	let key = req.body.key;
	res.cookie('admin', key);
	res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render(__dirname + '/views/login.ejs');
});

// Admin Routes
// app.put('/admin/create', (req, res) => {
// 	let admin = req.cookies.admin === process.env.ADMIN;
// 	let data = req.body;
// 	if (!admin) {
// 		res.status(403).send('Forbidden, not admin');
// 		return;
// 	}
// 	if (!data.date) {
// 		res.status(400).send('Bad Request, missing date');
// 		return;
// 	}
// 	console.log('create', data);
// 	// TODO: DB push data
// 	res.status(200).send('Success');
// });

// app.post('/admin/update', (req, res) => {
// 	let admin = req.cookies.admin === process.env.ADMIN;
// 	if (!admin) {
// 		res.status(403).send('Forbidden, not admin');
// 		return;
// 	}
// 	let type = req.query.type;
// 	let id = req.query.id;
// 	let data = req.body.data;
// 	console.log('update', type, id, data);
// 	// TODO: DB update key of id
// 	res.status(200).send('Success');
// });

// app.delete('/admin/delete', (req, res) => {
// 	let admin = req.cookies.admin === process.env.ADMIN;
// 	if (!admin) {
// 		res.status(403).send('Forbidden, not admin');
// 		return;
// 	}
// 	let id = req.query.id;
// 	console.log('delete', id);
// 	// TODO: DB update key of id
// 	// res.status(200).send('Success');
// 	// res.status(500).send('Server error');
// });

app.listen(3000, () => console.log('server started on port: ' + 3000));