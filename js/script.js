let isEditing = false; // Global flag tracking edit status

window.onload = function () {
	if (localStorage.getItem('tasks')) {
		document.getElementById('taskList').innerHTML =
			localStorage.getItem('tasks');
		document.querySelectorAll('li').forEach(initTaskEvents);
	}

	// Enter button input
	document
		.getElementById('taskInput')
		.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				addTask();
			}
		});
};

// save tasks to localStorage
function saveTasks() {
	localStorage.setItem('tasks', document.getElementById('taskList').innerHTML);
}

function addTask() {
	const taskInput = document.getElementById('taskInput');
	const taskText = taskInput.value.trim();

	if (taskText !== '') {
		const taskList = document.getElementById('taskList');
		const newTask = document.createElement('li');

		newTask.innerHTML = `
            <span class="task-text">${taskText}</span>
            <input type="text" class="task-edit" value="${taskText}">
            <div class="button-group">
                <button class="complete">✅</button>
                <button class="edit">Edytuj</button>
                <button class="duplicate">Duplikuj</button>
                <button class="remove">Usuń</button>
            </div>
        `;

		taskList.appendChild(newTask);
		initTaskEvents(newTask);
		taskInput.value = '';
		saveTasks();
	}
}

function initTaskEvents(taskItem) {
	taskItem.querySelector('.edit').addEventListener('click', function () {
		editTask(this);
	});
	taskItem.querySelector('.complete').addEventListener('click', function () {
		toggleComplete(this);
	});
	taskItem.querySelector('.remove').addEventListener('click', function () {
		removeTask(this);
	});
	taskItem.querySelector('.duplicate').addEventListener('click', function () {
		duplicateTask(this);
	});
}

function removeTask(button) {
	button.parentElement.parentElement.remove();
	isEditing = false;
	saveTasks();
}

function toggleComplete(button) {
	const taskItem = button.parentElement.parentElement;
	taskItem.classList.toggle('completed');
	saveTasks();
}

function editTask(button) {
	const taskItem = button.parentElement.parentElement;
	const taskTextElement = taskItem.querySelector('.task-text');
	const taskEditElement = taskItem.querySelector('.task-edit');
	const buttonGroup = taskItem.querySelector('.button-group');

	if (isEditing && button.textContent === 'Edytuj') {
		showNotification('Możesz edytować tylko jedno zadanie na raz!');
		return;
	}

	if (button.textContent === 'Edytuj') {
		taskTextElement.style.display = 'none';
		taskEditElement.style.display = 'block';
		button.textContent = 'Zapisz';
		button.classList.add('save');

		taskEditElement.focus();
		taskEditElement.select();

		buttonGroup
			.querySelectorAll('button:not(.edit)')
			.forEach((btn) => (btn.style.display = 'none'));
		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Anuluj';
		cancelButton.classList.add('cancel');
		buttonGroup.appendChild(cancelButton);

		cancelButton.addEventListener('click', function () {
			taskTextElement.style.display = 'block';
			taskEditElement.style.display = 'none';
			button.textContent = 'Edytuj';
			button.classList.remove('save');
			buttonGroup
				.querySelectorAll('button')
				.forEach((btn) => (btn.style.display = 'inline'));
			cancelButton.remove();
			isEditing = false;
		});

		taskEditElement.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				button.click();
			}
		});

		isEditing = true;
	} else {
		const newTaskText = taskEditElement.value.trim();
		if (newTaskText !== '') {
			taskTextElement.textContent = newTaskText;
			taskTextElement.style.display = 'block';
			taskEditElement.style.display = 'none';
			button.textContent = 'Edytuj';
			button.classList.remove('save');

			buttonGroup
				.querySelectorAll('button')
				.forEach((btn) => (btn.style.display = 'inline'));
			buttonGroup.querySelector('.cancel').remove();Anuluj po zakończeniu edycji

			button.focus();

			isEditing = false;
			saveTasks();
		}
	}
}

// Funkcja duplikowania zadania
function duplicateTask(button) {
	const taskItem = button.parentElement.parentElement;
	const taskList = document.getElementById('taskList');
	const clonedTask = taskItem.cloneNode(true);

	taskList.appendChild(clonedTask);
	initTaskEvents(clonedTask);
	saveTasks();
}

function showNotification(message) {
	const notificationElement = document.getElementById('notification');
	notificationElement.textContent = message;
	notificationElement.classList.add('active');

	setTimeout(() => {
		notificationElement.classList.remove('active');
		notificationElement.textContent = '';
	}, 3000);
}
