import jwt from "jsonwebtoken"

const secret = "some strong secret"

const EXPIRATION_TIME = 15*60*1000

const TOKEN_KEY = "auth-token"

const DELTA_TIME = 3*60*60*1000

function getExpireDate(millis: number): Date {
    return new Date(Date.now() + DELTA_TIME + millis)
}

type TokenData = {
    userId: number
    iat: number
}

class AuthError extends Error {
    constructor(
        message: string
    ) {
        super(message)
    }
}

function generateToken(userId: number): string {
    return jwt.sign({ userId }, secret)
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

    console.log(`Iat: ${decoded.iat}`)

    const currTime = Date.now() - DELTA_TIME
    console.log(`Current time: ${currTime}`)

    if (decoded.iat*1_000 + EXPIRATION_TIME < currTime) {
        throw new AuthError("Token is too old")
    }

    return decoded.userId
}

export { authenticate, generateToken, AuthError, EXPIRATION_TIME, TOKEN_KEY, getExpireDate }

