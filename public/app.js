const baseURL = 'http://localhost:4001';

async function fetchTasks() {
    try {
        const response = await fetch(`${baseURL}/tasks`);
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const description = taskInput.value.trim();
    
    if (description === '') {
        alert('Please enter a task description.');
        taskInput.focus();
        return;
    }

    try {
        const response = await fetch(`${baseURL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
        
        const tasks = await response.json();
        displayTasks(tasks);
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }

    taskInput.focus();
}

async function completeTask(id) {
    try {
        await fetch(`${baseURL}/tasks/${id}/complete`, { method: 'PUT' });
        const tasks = await fetchTasks();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error completing task:', error);
    }

    document.getElementById('taskInput').focus();
}

async function deleteTask(id) {
    try {
        await fetch(`${baseURL}/tasks/${id}`, { method: 'DELETE' });
        const tasks = await fetchTasks();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error deleting task:', error);
    }

    document.getElementById('taskInput').focus();
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = 'bg-white shadow-md rounded p-4 flex justify-between items-center';
        listItem.innerHTML = `
            <span class="flex"><div class="flex items-center">${task.completed ? '✅' : '⏹️'}</div><div>${task.description}</div></span>
            
            <div class="right-0 flex flex-col space-y-2">
                <button  onclick="completeTask(${task.id})" class="rounded border-2 border-blue-400 bg-gray-200 px-2 py-1 text-white hover:bg-gray-500 hover:shadow-md hover:shadow-blue-200">✅</button>
                <button  onclick="deleteTask(${task.id})" class="rounded border-2 border-red-400 bg-gray-200 px-2 py-1 text-white hover:bg-gray-500 hover:shadow-lg hover:shadow-red-200">🗑️</button>
          </div>
        `;
        tasksList.appendChild(listItem);
    });
}

function setupEventListeners() {
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
}

async function initializeApp() {
    const tasks = await fetchTasks();
    displayTasks(tasks);
    setupEventListeners();
    document.getElementById('taskInput').focus();
}

initializeApp();
