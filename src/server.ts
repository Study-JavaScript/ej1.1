import http from 'http';
import fs from 'fs';
import path from 'path';
import { addTask, listTasks, completeTask, deleteTask } from './app';

const server = http.createServer((req, res) => {
    // Ruta a la carpeta de recursos estáticos (una nivel por encima de dist, que es donde esta server)
    const publicPath = path.resolve(__dirname, '..', 'public');

    // Función para servir archivos estáticos, no es necesario content type ya que son archivos estáticos los cuales el navegador puede entender... ej, linea+19
    const serveStaticFile = (filePath: string) => {
        fs.createReadStream(filePath).pipe(res);
    };

    // Rutas para servir archivos estáticos y manejar las API
    // - Caso en el que el usuario o el servidor va a buscar el archivo index
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(publicPath, 'index.html');
        // serveStaticFile(filePath, 'text/html');
        serveStaticFile(filePath);
    }
    // - Caso en el que el servidor va a buscar los archivos estáticos, restantes.
    else if (req.url?.startsWith('/public/') || req.url?.startsWith('/dist/')) {
        const filePath = path.join(__dirname, '..', req.url);
        serveStaticFile(filePath);
    } 
    else if (req.url === '/tasks' && req.method === 'GET') {
        handleGetTasks(req, res);
    } else if (req.url?.startsWith('/tasks/') && req.method === 'PUT') {
        handleCompleteTask(req, res);
    } else if (req.url?.startsWith('/tasks/') && req.method === 'DELETE') {
        handleDeleteTask(req, res);
    } else if (req.url === '/tasks' && req.method === 'POST') {
        handleAddTask(req, res);
    }  else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 4001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

function handleGetTasks(req: http.IncomingMessage, res: http.ServerResponse) {
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}

function handleAddTask(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { description }: { description: string } = JSON.parse(body);
        addTask(description);
        const tasks = listTasks();
        res.end(JSON.stringify(tasks));
    });
}
//En las sig., buscamos el id que es el 3r argumento contando el dominio(localhost)
function handleCompleteTask(req: http.IncomingMessage, res: http.ServerResponse) {
    const taskId = parseInt(req.url!.split('/')[2]);
    completeTask(taskId);
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}

function handleDeleteTask(req: http.IncomingMessage, res: http.ServerResponse) {
    const taskId = parseInt(req.url!.split('/')[2]);
    deleteTask(taskId);
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}
