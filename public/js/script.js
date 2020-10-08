let posts = [];

$(document).ready(function () {
	fetch('/page/1')
	.then(res => res.json())
	.then(json => {
		let html = json.html;
		let more = json.json;
		posts.push(...more)
		$('#list').append(html);
	});
});