$(document).on('click', '.post', function () {
	fetch(`/view?id=${posts[$(this).index() - 1].date}`);
});