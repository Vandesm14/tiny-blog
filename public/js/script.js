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

	$(document).on('click', '.post', function () {
		$('.active').removeClass('active');
		renderEntry($(this).index() - 1);
		$(this).addClass('active');
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
