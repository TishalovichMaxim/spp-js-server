type UserCredentials = {
    login: string,
    password: string,
}

class User {

    constructor(
        public id: number,
        public login: string,
        public passwordHash: string
    ) {
    }

}

export { User, UserCredentials }

