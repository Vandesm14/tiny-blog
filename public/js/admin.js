console.log('Loaded admin.js');

$(document).ready(function () {
	$(document).on('click', '.post .admin-delete', function () {
		let index = $(this).closest('.post').index();
		if (confirm(`Delete post: "${posts[index].title}"?`)) {
			$(this).closest('.post').remove();
		} else {
			$(this).text(posts[index].title);
		}
	});
	$(document).on('blur', ' .title', function () {
		let index = 0;
		if ($(this).closest('.post').length > 0) {
			index = $(this).closest('.post').index();
		} else if ($(this).closest('.viewer').length > 0) {
			index = $('.list').find('.post.active').index();
		}
		let title = $(this).text();
		if (title === '') {
			if (confirm(`Delete post: "${posts[index].title}"?`)) {
				$(this).closest('.post').remove();
			} else {
				$(this).text(posts[index].title);
			}
		} else if (title !== posts[index].title) {
			console.log('Updated', posts[index]);
		}
	});
	$(document).on('keydown', '.title', function (e) {
		if (e.key === 'Enter') {
			$(this).blur();
		}
	});
});