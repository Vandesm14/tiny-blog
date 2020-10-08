console.log('Loaded admin.js');

$(document).ready(function () {
	$(document).on('click', '.post .admin-delete', function () {
		let index = $(this).closest('.post').index();
		if (confirm(`Delete post: "${posts[index].title}"?`)) {
			$(this).closest('.post').remove();
			// TODO: Server
			console.log('Deleted post: ' + index);
		} else {
			$(this).text(posts[index].title);
		}
	});
	$(document).on('blur', ' .title', function () {
		let index = getIndex(this);
		let title = $(this).text();
		if (title === '') {
			if (confirm(`Delete post: "${posts[index].title}"?`)) {
				$(this).closest('.post').remove();
				// TODO: Server
				console.log('Deleted post: ' + index);
			} else {
				$(this).text(posts[index].title);
			}
		} else if (title !== posts[index].title) {
			// TODO: Server
			console.log('Updated title for: ' + index);
		}
	});
	$(document).on('keydown', '.title, .tags', function (e) {
		if (e.key === 'Enter') {
			$(this).blur();
		}
	});
	$(document).on('keydown', '.content', function (e) {
		if (e.key === 'Escape') {
			$(this).blur();
		}
	});
	$(document).on('focus', '.tags', function () {
		let index = getIndex(this);
		$(this).text(posts[index].tags.join(' '));
		this.selectionStart = this.selectionEnd = posts[index].tags.join(' ').length;
	});
	$(document).on('blur', '.tags', function () {
		let index = getIndex(this);
		if ($(this).text() !== posts[index].tags.join(' ')) {
			posts[index].tags = $(this).text().split(' ').filter(el => el);
			// TODO: Server
			console.log('Updated tags for: ' + index);
		}
		$(this).html(posts[index].tags.map(el => `<a href="#" class="tag">${el}</a>`));
	});
});

function getIndex(el) {
	let index = 0;
	if ($(el).closest('.post').length > 0) {
		index = $(el).closest('.post').index();
	} else if ($(el).closest('.viewer').length > 0) {
		index = $('.list').find('.post.active').index();
	}
	return index;
}
