
$(document).ready(function () {
	console.log('Loaded admin.js');

	$(document).on('click', '.post .admin-delete', function () {
		let index = $(this).closest('.post').index();
		if (confirm(`Delete post: "${posts[index].title}"?`)) {
			$(this).closest('.post').remove();
		} else {
			$(this).text(posts[index].title);
		}
	});
	$(document).on('blur', '.post .title', function () {
		let index = $(this).closest('.post').index();
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
	$(document).on('keydown', '.post .title', function (e) {
		if (e.key === 'Enter') {
			$(this).blur();
		}
	});

});