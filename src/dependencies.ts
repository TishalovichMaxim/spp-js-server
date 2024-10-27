import { TaskDao } from "./dal/task-dao"
import { UserDao } from "./dal/user-dao"
import { TaskExtracter, TaskMapper } from "./dto/task-dto"
import { TaskService } from "./service/task-service"
import { UserService } from "./service/user-service"
import { TaskValidator } from "./service/validation/task-validator"

const taskDao = new TaskDao()
const userDao = new UserDao(taskDao)

const userService = new UserService(userDao)

const taskValidator = new TaskValidator()
const taskMapper = new TaskMapper()
const taskService = new TaskService(taskDao, taskValidator, taskMapper)
const taskExtracter = new TaskExtracter()

export { taskDao, userDao, userService, taskValidator, taskMapper, taskService, taskExtracter }
