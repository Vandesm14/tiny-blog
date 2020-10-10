module.exports = (app, db) => {
	app.get('/view', (req, res) => {
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
};