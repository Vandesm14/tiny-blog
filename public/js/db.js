const db = {
	getPost: (id) => {
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { post(date: ${id}) { title hasContent tags date } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				return json.data.post;
			}
		});
	},
	getContent: () => {
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { post(date: ${id}) { content } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				return json.data.post;
			}
		});
	},
	getBefore: (id, amount = 10) => { // Get Older
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { before(date: ${id}, amount: ${amount}) { title hasContent tags date } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				return json.data.before;
			}
		});
	},
	getAfter: (id, amount = 10) => { // Get Newer
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { after(date: ${id}, amount: ${amount}) { title hasContent tags date } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				json.data.after.reverse()
				return json.data.after;
			}
		});
	},
	getLatest: () => {
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { latest { title hasContent tags date } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				return json.data.latest;
			}
		});
	},
	getOldest: () => {
		return fetch('/graphql', {
			method: 'POST',
			body: JSON.stringify({'query': `query { oldest { title hasContent tags date } }`}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				return json.data.oldest;
			}
		});
	}
};