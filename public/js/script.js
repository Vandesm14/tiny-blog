let posts = [];
let template = {
	item: '',
	list: '',
	viewer: ''
};
let query = new URLSearchParams(window.location.search);
let lastFetch = 0;
let lastScroll = 0;

let converter = new showdown.Converter({noHeaderId: true, simplifiedAutoLink: true, tasklists: true});

$(document).ready(async function () {
	await fetch('/templates')
		.then(res => res.json())
		.then(json => {
			template = json;
			template.item = template.list.split('\n').slice(1, template.list.split('\n').length - 1).join('\n');
		});
		
	if (query.get('view')) {
		posts = [
			...(await db.getAfter(query.get('view'))),
			(await db.getPost(query.get('view'))),
			...(await db.getBefore(query.get('view'))),
		];
		console.log('view');
	} else {
		console.log('latest');
		posts = await db.getLatest();
	}
	renderAbove(posts);

	$('#list').on('scroll', async function () {
		if ($(this).scrollTop() < 100 && lastFetch !== posts[0].date && lastScroll > $(this).scrollTop()) {
			lastFetch = posts[0].date;
			let arr = await db.getAfter(posts[0].date);
			posts.unshift(...arr);
			renderAbove(arr);
			$(this).scrollTop(lastScroll + $('.post').height() * arr.length);
		} else if ($(this).scrollTop() + $(this).height() > $(this)[0].scrollHeight - 100 && lastFetch !== posts[posts.length - 1].date && lastScroll < $(this).scrollTop()) {
			lastFetch = posts[posts.length - 1].date;
			let arr = await db.getBefore(posts[posts.length - 1].date);
			posts.push(...arr);
			renderBelow(arr);
		}
		lastScroll = $(this).scrollTop();
	});

	$(document).on('click', '.post', function (e) {
		$('.post.active').removeClass('active');
		renderEntry($(this).index() - 1);
		$(this).addClass('active');
		fetch(`/view?id=${posts[$(this).index() - 1].date}`);
		history.pushState({}, posts[$(this).index() - 1].name, `?view=${posts[$(this).index() - 1].date}`);
	});

	$(document).on('click', '#list', function (e) {
		if (!$(e.target).hasClass('list')) return;
		$('#viewer').html(
			`<div id="no-entry">
				<h1>No entry selected</h1>
				<p>
					Select an entry with a <img src="/assets/content.png"> icon to view it's content
				</p>
			</div>`);
		$('.post.active').removeClass('active');
		history.pushState({}, 'Blog | Vandesm14', '/');
	});
});

function renderEntry(index) {
	$('#viewer').html(ejs.render(template.viewer, {post: posts[index], converter}));
}

function renderAbove(arr) {
	$('#list > .search-box').after(ejs.render(template.list, {posts: arr}));
}

function renderBelow(arr) {
	$('#list').append(ejs.render(template.list, {posts: arr}));
}