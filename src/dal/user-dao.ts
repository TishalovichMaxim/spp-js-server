import { User } from "../model/user"
import { DaoError } from "./dao-exception"
import { TaskDao } from "./task-dao"

class UserDao {

    private users = new Map<number, User>()

    private logins = new Set<string>()

    private nextId: number = 0

    constructor(
        private taskDao: TaskDao
    ) {
    }

    add(user: User): User {
        if (this.logins.has(user.login)) {
            throw new DaoError("User with such login already exists")
        }

        this.logins.add(user.login)

        user.id = this.nextId
        this.users.set(user.id, user)
        this.nextId++

        this.taskDao.initUser(user.id)

        return user
    }

    delete(id: number): User {
        const user = this.users.get(id)
        if (!user) {
            throw new DaoError(`There is no user with id = ${id}`)
        }

        this.users.delete(id)
        this.logins.delete(user.login)

        return user
    }

    get(id: number): User | undefined {
        return this.users.get(id)
    }

    getAll(): User[] {
        return Array.from(this.users.values())
    }

}

export { UserDao }

