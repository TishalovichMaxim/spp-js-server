import { User, UserCredentials } from '../model/user'
import { UserDao } from '../dal/user-dao'
import { sha256 } from 'js-sha256'
import { ServiceError } from './exception/service-exception'

class UserService {

    constructor(
        private userDao: UserDao
    ) {
    }

    public get(userId: number): User | undefined {
        return this.userDao.get(userId)
    }

    public delete(userId: number): User {
        return this.userDao.delete(userId)
    }

    public add(userCreds: UserCredentials): User {
        const passwordHash = sha256(userCreds.password)

        const user = new User(-1, userCreds.login, passwordHash)

        try {
            return this.userDao.add(user)
        } catch (e: any) {
            throw new ServiceError(400, e.message)
        }
    }

    public signIn(login: string, password: string): User {
        const passwordHash = sha256(password)

        const found = this.userDao.getAll()
            .filter((u: User) => u.login == login && u.passwordHash == passwordHash)

        if (found.length == 0) {
            throw new ServiceError(400, "Uncorrect credentials")
        }

        return found[0]
    }

}

export { UserService }

