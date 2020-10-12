console.log('Loaded admin.js');

$(document).ready(function () {
	// FIXME: Don't trigger view post when admin control is clicked
	$(document).on('click', '.admin-control', function (e) {
		e.stopPropagation();
	});

	$(document).on('keydown', '.title, .tags', function (e) {
		if (e.key === 'Enter') {
			$(this).blur();
		}
	});
	$(document).on('blur', ' .title', function () {
		let index = getIndex(this);
		let title = $(this).text();
		if (title === '') {
			if (confirm(`Delete post: "${posts[index].title}"?`)) {
				$(this).closest('.post').remove();
				remove(index)
				.then(() => {
					console.log('Deleted post: ' + index);
				})
				.catch(() => {
					alert('An error occurred while deleting the post');
				});
			} else {
				$(this).text(posts[index].title);
			}
		} else if (title !== posts[index].title) {
			update('title', index, $(this).text())
			.then(() => {
				console.log('Updated title for: ' + index);
			})
			.catch(() => {
				alert('An error occurred while editing the post');
			});
		}
	});

	$(document).on('focus', '.tags', function () {
		let index = getIndex(this);
		$(this).text(posts[index].tags.join(' '));
	});
	$(document).on('blur', '.tags', function () {
		let index = getIndex(this);
		if ($(this).text() !== posts[index].tags.join(' ')) {
			posts[index].tags = $(this).text().split(' ').filter(el => el);
			update('tags', index, posts[index].tags)
			.then(() => {
				console.log('Updated tags for: ' + index);
			})
			.catch(() => {
				alert('An error occurred while editing the post');
			});
		}
		$(this).html(posts[index].tags.map(el => `<a href="#" class="tag">${el}</a>`));
	});

	$(document).on('click', '.post .admin-delete', function () {
		let index = $(this).closest('.post').index() - 1;
		if (confirm(`Delete post: "${posts[index].title}"?`)) {
			$(this).closest('.post').remove();
			remove(index)
			.then(() => {
				console.log('Deleted post: ' + index);
			})
			.catch(() => {
				alert('An error occurred while deleting the post');
			});
		} else {
			$(this).text(posts[index].title);
		}
	});
	$(document).on('click', '.post .admin-unlist', function () {
		let index = $(this).closest('.post').index() - 1;
		let action = $(this).closest('.post').hasClass('unlisted') ? 'Relist' : 'Unlist';
		if (confirm(`${action} post: "${posts[index].title}"?`)) {
			$(this).closest('.post').toggleClass('unlisted');
			update('unlist', index, $(this).closest('.post').hasClass('unlisted'))
			.then(() => {
				console.log(`${action}ed post: index`);
			})
			.catch(() => {
				alert('An error occurred while unlisting the post');
			});
		}
	});

	$(document).on('focus', '.content', function () {
		if ($(this).hasClass('textarea')) return;
		let index = getIndex(this);
		$(this).html(posts[index].content.replace(/\n/g, '<br>'));
	});
	$(document).on('blur', '.content', function () {
		let index = getIndex(this);
		if ($(this).html().replace(/<br>/g, '\n') !== posts[index].content) {
			posts[index].content = $(this).html().replace(/<br>/g, '\n');
			update('content', index, posts[index].content)
			.then(() => {
				console.log('Updated content for: ' + index);
			})
			.catch(() => {
				alert('An error occurred while editing the post');
			});
		}
		$(this).html(converter.makeHtml(posts[index].content));
	});
	$(document).on('keydown', '.content', function (e) {
		if (e.key === 'Escape') {
			$(this).blur();
		}
	});

	$(document).on('click', '#admin-add', function () {
		if ($('#admin-form').length > 0) {
			$('#admin-form').replaceWith(ejs.render(template.form));
		} else {
			$('body').append(ejs.render(template.form));
		}
	});

	$(document).on('keydown', '#form-title, #form-tags, #form-unlisted', function (e) {
		if (e.key === 'Escape') {
			$(this).blur();
		}
	});

	$(document).on('click', '#form-cancel', function (e) {
		if ($(e.target).closest('form').length === -1) return;
		$('#admin-form').remove();
	});
	$(document).on('click', '#form-submit', function () {
		let arr = $(this).closest('#admin-form').serializeArray();
		let post = {};
		arr.forEach(el => post[el.name] = el.value);
		post.date = new Date().getTime();
		post.tags = post.tags.split(' ').filter(el => el);
		post.unlist = post.unlist === 'on' ? true : false;
		poas.views = 0;
		create(post)
		.then(() => {
			$('#admin-form').remove();
			$('#list > .search-box').after(ejs.render(template.item, {post}));
			posts.unshift(post);
		})
		.catch(() => {
			alert('An error occurred while creating the post');
		});
	});
});

function getIndex(el) {
	let index = 0;
	if ($(el).closest('.post').length > 0) {
		index = $(el).closest('.post').index() - 1;
	} else if ($(el).closest('.viewer').length > 0) {
		index = $('.list').find('.post.active').index() - 1;
	}
	return index;
}

async function create(data) {
	fetch('/admin/create', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data)
	})
	.then(res => {
		return new Promise((resolve, reject) => res.status === 200 ? resolve() : reject());
	});
}

async function update(type, index, data) {
	posts[index][type] = data;
	if ($('.list .post').eq(index).hasClass('active')) {
		$('.list .post').eq(index).replaceWith(ejs.render(template.item, {
			post: posts[index]
		}));
		$('.list .post').eq(index).addClass('active');
		$('#viewer').html(ejs.render(template.viewer, {
			post: posts[index]
		}));
	} else {
		$('.list .post').eq(index).replaceWith(ejs.render(template.item, {
			post: posts[index]
		}));
	}

	fetch(`/admin/update?type=${type}&id=${posts[index].date}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			data
		})
	})
	.then(res => {
		return new Promise((resolve, reject) => res.status === 200 ? resolve() : reject());
	});
}

async function remove(index) {
	fetch(`/admin/delete?id=${posts[index].date}`, {
		method: 'DELETE'
	})
	.then(res => {
		if (res.status === 200) posts.splice(index, 1);
		return new Promise((resolve, reject) => res.status === 200 ? resolve() : reject());
	});
}