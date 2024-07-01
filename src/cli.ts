import { addTask, listTasks, completeTask, deleteTask } from './app';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(
`Todo List CLI
==============
Available commands:
- add <description>: Add a new task with the provided description.
- list: List all tasks.
- complete <task_id>: Mark a task as completed by its ID.
- delete <task_id>: Delete a task by its ID.
- exit: Exit the CLI.
`)

const startCLI = () => {
    rl.question('Enter command: ', (input) => {
        const args = input.trim().split(' ');
        const command = args[0];

        switch (command) {
            case 'add':
                const description = args.slice(1).join(' ');
                addTask(description);
                console.log(`Task '${description}' added.`);
                // rl.question("Enter your description: ",(inputDesc)=>{
                //     console.log(`Has introducido: ${inputDesc}`)
                // })
                break;
            case 'list':
                listTasks();
                break;
            case 'complete':
                const taskId = parseInt(args[1]);
                completeTask(taskId);
                console.log(`Task ${taskId} marked as completed.`);
                break;
            case 'delete':
                const deleteId = parseInt(args[1]);
                deleteTask(deleteId);
                console.log(`Task ${deleteId} deleted.`);
                break;
            case 'exit':
                console.log('Exiting Todo List CLI.');
                rl.close();
                return;
            default:
                console.log('Invalid command. Available commands: add, list, complete, delete, exit');
                break;
        }

        startCLI(); // Recursive call para CLI loop
    });
};

startCLI();
