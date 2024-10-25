import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { TaskDao } from './dal/task-dao';
import { UserDao } from './dal/user-dao';
import multer from 'multer';
import cors from 'cors';
import { ExtractionError, extractUserCredentials, TaskExtracter, TaskMapper } from './dto/task-dto'
import { TaskService } from './service/task-service'
import { UserService } from './service/user-service'
import { TaskValidator } from './service/validation/task-validator'
import { ServiceError } from './service/exception/service-exception'
import { authenticate, generateToken } from './service/auth/auth'
import cookieParser from 'cookie-parser'

const upload = multer({ dest: 'uploads/' })
const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use(cookieParser())

const taskDao = new TaskDao()
const userDao = new UserDao(taskDao)

const userService = new UserService(userDao)

const taskValidator = new TaskValidator()
const taskMapper = new TaskMapper()
const taskService = new TaskService(taskDao, taskValidator, taskMapper)
const taskExtracter = new TaskExtracter()

const TOKEN_KEY = "auth-token"

function getExpireDate(millis: number): Date {
    return new Date(Date.now() + 3*60*60*1000 + millis)
}

function auth(req: Request, resp: Response, next: any) {
    console.log("All cookies: %o", req.cookies)
    console.log("Token cookie: %o", req.cookies[TOKEN_KEY])

    const currReq: any = req 

    try {
        const userId = authenticate(req.cookies[TOKEN_KEY])
        currReq.userId = userId
    } catch (e: any) {
        console.log(e.message)
        resp
            .status(401)
            .send(
                {
                    message: "Auth required"
                }
            )

        console.log("Before return")
        return
    }

    console.log("Before next")
    next()
}

function getUserId(req: Request): number {
    const currReq: any = req
    return currReq.userId
}

app.get('/tasks', auth, (req, res) => {
    res.status(200)
        .send(taskService.getAll(getUserId(req), undefined))
})

app.get('/tasks/:id(\\d+)', auth, (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    res.status(200).send(taskService.get(getUserId(req), taskId))
})

app.post('/log-out', (req, res) => {
    console.log("POST: /logout")

    res
        .cookie(
            TOKEN_KEY,
            "",
            {
                httpOnly: true,
                expires: getExpireDate(-1)
            }
        )
        .status(200)
        .end()
})

app.post('/sign-in', (req, res) => {
    console.log("POST: /sign-in")
    console.log("Body: %o", req.body)

    const credentials = extractUserCredentials(req.body)
    
    console.log("Extracted credentials: %o", credentials)

    const user = userService.signIn(credentials.login, credentials.password)

    const token = generateToken({ userId: user.id })

    console.log("Generated token: %s", token)

    res
        .cookie(
            TOKEN_KEY,
            token,
            {
                httpOnly: true,
                expires: getExpireDate(15*60*1000)
            }
        )
        .status(200)
        .end()
})

app.post('/sign-up', (req, res) => {
    console.log("POST: /sign-up")
    console.log("Body: %o", req.body)

    const credentials = extractUserCredentials(req.body)
    
    console.log("Extracted credentials: %o", credentials)

    const createdUser = userService.add(credentials)
    const token = generateToken({ userId: createdUser.id })

    console.log("Generated token: %o", token)

    res
        .cookie(
            TOKEN_KEY,
            token,
            {
                httpOnly: true,
                expires: getExpireDate(15*60*1000)
            }
        )
        .status(201)
        .end()
})

app.post('/tasks', auth, (req, res) => {
    console.log("POST: tasks")
    console.log("Body: %o", req.body)

    const reqTask = taskExtracter.extract(req.body)
    
    console.log("Extracted task: %o", reqTask)

    const respTask = taskService.add(getUserId(req), reqTask)

    console.log("Response task: %o", respTask)

    res.status(201).send(respTask)
})

app.put('/tasks/:id(\\d+)', auth, (req, res) => {
    const taskId = Number.parseInt(req.params.id)
    console.log("PUT: tasks/%d", taskId)

    const reqTask = taskExtracter.extract(req.body)
    reqTask.id = taskId

    console.log("Update task: %o", reqTask)

    const respTask = taskService.update(getUserId(req), reqTask)

    return res.status(200)
                .send(respTask)
})

app.delete('/tasks/:id(\\d+)', auth, (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    taskService.delete(getUserId(req), taskId)

    return res.status(204).send()
})

app.post('/tasks/:id(\\d+)/files', auth, upload.single('file'), (req, res) => {
    console.log("POST: file creation")

    if (!req.file) {
        throw new ExtractionError(400, "There is no file attached...")
    }

    const taskId = Number.parseInt(req.params.id)

    console.log('POST: upload for task with id = %s', taskId)

    const newFileInfo = taskService.addFile(getUserId(req), taskId, req.file.filename, req.file.originalname)

    console.log("Result file info: %o", newFileInfo)

    res.status(201).send(newFileInfo)
})

app.delete('/tasks/:taskId(\\d+)/files/:fileId', auth, (req, res) => {
    const taskId = Number.parseInt(req.params.taskId)
    const fileId = req.params.fileId

    console.log('POST: file delete (%d, %s)', taskId, fileId)

    taskService.deleteFileInfo(getUserId(req), taskId, fileId)

    res.status(204).send()
})

app.get('/tasks/:id(\\d+)/files/:file', auth, (req, res) => {
    const taskId = Number.parseInt(req.params.id)

    const fileId = req.params.file

    console.log("GET: download file: %s of task id = %s", fileId, taskId)

    const fileInfo = taskService.getFileInfo(getUserId(req), taskId, fileId)

    res.status(200).download(`./uploads/${fileId}`, fileInfo.name)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ServiceError || err instanceof ExtractionError) {
        console.log("Error: %s", err.message)
        res.status(err.code).send({
            message: err.message
        })
    } else {
        next(err)
    }
})

const port = 18080
app.listen(port, () => {})

