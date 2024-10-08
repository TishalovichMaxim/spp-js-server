import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { TaskDao } from './dal/task-dao';
import { Task, TaskStatus } from './model/task';
import multer from 'multer';
import cors from 'cors';
import { ExtractionError, TaskExtracter, TaskMapper } from './dto/task-dto'
import { TaskService } from './service/task-service'
import { TaskValidator } from './service/validation/task-validator'
import { ServiceError } from './service/exception/service-exception';

const upload = multer({ dest: 'uploads/' })
const app = express()

app.set('view engine', 'ejs')
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()) // for parsing application/x-www-form-urlencoded

const taskDao = new TaskDao()
const taskValidator = new TaskValidator()
const taskMapper = new TaskMapper()
const taskService = new TaskService(taskDao, taskValidator, taskMapper)
const taskExtracter = new TaskExtracter()

app.get('/tasks', (req, res) => {
    res.status(200)
        .send(taskService.getAll(undefined))
})

app.get('/tasks/:id(\\d+)', (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    res.status(200).send(taskService.get(taskId))
})

app.post('/tasks', (req, res) => {
    console.log("POST: tasks")
    console.log("Body: %o", req.body)

    const reqTask = taskExtracter.extract(req.body)
    
    console.log("Extracted task: %o", reqTask)

    const respTask = taskService.add(reqTask)

    console.log("Response task: %o", respTask)

    res.status(201).send(respTask)
})

app.put('/tasks/:id(\\d+)', (req, res) => {
    const taskId = Number.parseInt(req.params.id)
    console.log("PUT: tasks/%d", taskId)

    const reqTask = taskExtracter.extract(req.body)
    reqTask.id = taskId

    console.log("Update task: %o", reqTask)

    const respTask = taskService.update(reqTask)

    return res.status(200)
                .send(respTask)
})

app.delete('/tasks/:id(\\d+)', (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    taskService.delete(taskId)

    return res.status(204).send()
})

app.post('/tasks/:id(\\d+)/files', upload.single('file'), (req, res) => {
    console.log("POST: file creation")

    if (!req.file) {
        throw new ExtractionError(400, "There is no file attached...")
    }

    const taskId = Number.parseInt(req.params.id)

    console.log('POST: upload for task with id = %s', taskId)

    const newFileInfo = taskService.addFile(taskId, req.file.filename, req.file.originalname)

    console.log("Result file info: %o", newFileInfo)

    res.status(201).send(newFileInfo)
})

app.delete('/tasks/:taskId(\\d+)/files/:fileId', (req, res) => {
    const taskId = Number.parseInt(req.params.taskId)
    const fileId = req.params.fileId

    console.log('POST: file delete (%d, %s)', taskId, fileId)

    taskService.deleteFileInfo(taskId, fileId)

    res.status(204).send()
})

app.get('/tasks/:id(\\d+)/files/:file', (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    const fileId = req.params.file

    console.log("GET: download file: %s of task id = %s", fileId, taskId)

    const fileInfo = taskService.getFileInfo(taskId, fileId)

    res.status(200).download(`./uploads/${fileId}`, fileInfo.name)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServiceError || err instanceof ExtractionError) {
        res.status(err.code).send({
            message: err.message
        })
    } else {
        next(err)
    }
})

const tasks = [
    new Task(undefined, TaskStatus.DONE, "Title 1", "Content 1", new Date()),
    new Task(undefined, TaskStatus.DONE, "Title 2", "Content 2", new Date()),
    new Task(undefined, TaskStatus.DONE, "Title 3", "Content 3", new Date()),
]

for (const task of tasks) {
    taskDao.save(task)
}

const port = 18080
app.listen(port, () => {})

