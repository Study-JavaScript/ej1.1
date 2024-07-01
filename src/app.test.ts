import { addTask, listTasks, completeTask, deleteTask, tasks } from './app';

describe('Todo List Application', () => {
    beforeEach(() => {
        tasks.length = 0; // Limpiar las tareas antes de cada prueba
    });

    it('should add a task', () => {
        addTask('Do the laundry');
        expect(tasks.length).toBe(1);
        expect(tasks[0].description).toBe('Do the laundry');
        expect(tasks[0].completed).toBe(false);
    });

    it('should list tasks', () => {
        addTask('Do the laundry');

        // Espiar console.log para capturar la salida
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        listTasks();

        // Verificar la salida esperada en la consola
        expect(consoleSpy.mock.calls[0][0]).toContain('Tasks:');
        expect(consoleSpy.mock.calls[1][0]).toContain(' - [ ] Do the laundry');
        expect(consoleSpy.mock.calls[1][0]).toContain('task id: 1');

        // Restaurar console.log original después de la prueba
        consoleSpy.mockRestore();
    });

    it('should complete a task', () => {
        addTask('Do the laundry');
        completeTask(1);
        expect(tasks[0].completed).toBe(true);
    });

    it('should delete a task', () => {
        addTask('Do the laundry');
        deleteTask(1);
        expect(tasks.length).toBe(0);
    });
});
