const DataStore = require('nedb-promises');
const posts = DataStore.create("posts.db");

module.exports = {
	root: {
		// query { latest { title content tags date } }
		latest: async args => {
			return await posts.find({}).limit(args.amount).sort({date: -1});
		},
	
		// query { oldest { title content tags date } }
		oldest: async args => {
			return await posts.find({}).sort({date: 1}).limit(args.amount);
		},
	
		// query { post(date: 1234) { title content tags date } }
		post: async args => {
			return await posts.findOne({ date: args.date });
		},
	
		// query { after(date: 1234, amount: 2) { title content tags date } }
		after: async args => {
			return await posts.find({ date: { $gt: args.date } }).sort({date: 1}).limit(args.amount);
		},
	
		// query { before(date: 1234, amount: 2) { title content tags date } }
		before: async args => {
			return await posts.find({ date: { $lt: args.date } }).limit(args.amount).sort({date: -1});
		},
	},
	admin: {
		// mutation { new(post: { title: \"A random title\", content: \"Some random content.\", tags: [] }) { title content tags date } }
		new: async args => {
			return await posts.insert({ ...args.post,/* date: (new Date()).getTime(),*/ hasContent: args.post.content.length > 0});
		},
	
		// mutation { update(post: { title: \"A random title\", content: \"Some random content.\", tags: [], date: 1234 }) { title content tags date } }
		update: async args => {
			return await posts.update({ date: args.date }, { ...args.post, hasContent: args.post.content.length > 0}, { returnUpdatedDocs: true });
		},
	
		// mutation { remove(date: 1234 ) { title content tags date } }
		remove: async args => {
			let post = await posts.findOne({ date: args.date });
			await posts.remove({ date: args.date });
			return post;
		}
	}
};