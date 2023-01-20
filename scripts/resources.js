document.addEventListener('DOMContentLoaded', function () {
	const newResourceForm = document.getElementById('new-resource-form');
	const newResourceName = document.getElementById('new-resource-name');
	const resourceList = document.getElementById('resource-list');

	let resources = getResources();
	renderResourceList();

	let nextResourceId = resources.length > 0
		? Math.max(...resources.map(o => o.id)) + 1
		: 0;

	console.log(nextResourceId);

	newResourceForm.addEventListener('submit', (e) => {
		e.preventDefault();

		resources.push(
			{
				id: nextResourceId++,
				title: newResourceName.value
			});

		// TODO Sorting should be a rendering concern
		resources.sort(function (a, b) {
			let titleA = a.title.toUpperCase();
			let titleB = b.title.toUpperCase();

			if (titleA < titleB) {
				return -1;
			}
			if (titleA > titleB) {
				return 1;
			}
			return 0;
		});

		renderResourceList();
		persistResources();

		newResourceName.value = '';
		newResourceName.focus();
	});

	function renderResourceList() {
		resourceList.innerHTML = resources.map((res) => {
			return `<li>${res.title} <button class="delete-resource" data-resource-id="${res.id}">❌</button></li>`
		}).join('');

		const deleteButtons = document.querySelectorAll('.delete-resource');

		deleteButtons.forEach((el) => {
			el.addEventListener('click', () => {
				deleteResource(el.dataset.resourceId);
				renderResourceList();
				persistResources();
			});
		})
	}

	// TODO Prevent deletion if they have time against them
	function deleteResource(id) {
		resources = resources.filter((res) => {
			return res.id != id;
		});

		console.log(resources);
	}

	function persistResources() {
		localStorage.setItem('resources', JSON.stringify(resources));
	}

	function getResources() {
		try {
			return localStorage.getItem('resources')
				? JSON.parse(localStorage.getItem('resources'))
				: []
		} catch {
			return [];
		}
	}
});