let posts = [];
let template = '';

$(document).ready(function () {
	fetch('/list.ejs')
	.then(res => res.text())
	.then(text => {
		template = text;
		renderPage(1);
	});
});

function renderPage(page) {
	fetch(`/page/${page}`)
	.then(res => res.json())
	.then(json => {
		posts.push(...json);
		$('#list').append(ejs.render(template, {posts}));
	});
}