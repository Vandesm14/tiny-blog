let posts = [];
let template = {
	list: '',
	viewer: ''
};

$(document).ready(function () {
	fetch('/templates')
		.then(res => res.json())
		.then(json => {
			template = json;
			renderPage(1);
		});

	$(document).on('click', '.post', function () {
		renderEntry($(this).index());
	});
});

function renderEntry(index) {
	$('#viewer').html(ejs.render(template.viewer, {post: posts[index]}));
}

function renderPage(page) {
	fetch(`/page/${page}`)
		.then(res => res.json())
		.then(json => {
			posts.push(...json);
			$('#list').append(ejs.render(template.list, {
				posts
			}));
		});
}