let posts = [];
let template = {
	item: '',
	list: '',
	viewer: ''
};

$(document).ready(function () {
	fetch('/templates')
		.then(res => res.json())
		.then(json => {
			template = json;
			template.item = template.list.split('\n').slice(1, template.list.split('\n').length - 1).join('\n');
			renderPage(1);
		});

	$(document).on('click', '.post', function (e) {
		$('.post.active').removeClass('active');
		renderEntry($(this).index() - 1);
		$(this).addClass('active');
		history.pushState({}, posts[$(this).index() - 1].name, `?view=${posts[$(this).index() - 1].date}`);
		fetch(`/view?id=${posts[$(this).index() - 1].date}`);
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
	});
});

function renderEntry(index) {
	$('#viewer').html(ejs.render(template.viewer, {post: posts[index]}));
}

function renderPage(page) {
	console.log(`Page ${page} requested`);
	fetch(`/page/${page}`)
		.then(res => res.json())
		.then(json => {
			console.log(`Page ${page} received (${json.length} posts)`);
			posts.push(...json);
			$('#list').append(ejs.render(template.list, {posts}));
		});
}
