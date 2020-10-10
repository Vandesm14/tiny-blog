module.exports = (app, db) => {
	app.get('/view', (req, res) => {
		let id = req.query.id;
		db.ref('posts').orderByChild('date').equalTo(+id).once('value', (post) => {
			db.ref('posts').child(Object.keys(post.val())[0]).child('views').set(Object.values(post.val())[0].views + 1);
		});
	});
};