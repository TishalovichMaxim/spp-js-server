import jwt from "jsonwebtoken"
import { UserCredentials } from "../../model/user"

const secret = "some strong secret"

type TokenData = {
    userId: number
}

class AuthError extends Error {
    constructor(
        message: string
    ) {
        super(message)
    }
}

function generateToken(data: TokenData): string {
    return jwt.sign(data, secret)
}

function signIn(credentials: UserCredentials) {

}

function authenticate(token: string | undefined): number {
    if (!token) {
        throw new AuthError("There is no token...")
    }

    let decoded: TokenData
    try {
        decoded = jwt.verify(token, secret) as any
    } catch (e) {
        console.log("Error in token decoding")
        throw new AuthError("Error in token decoding")
    }

    return decoded.userId
}

export { authenticate, generateToken, AuthError }

