import { extractUserCredentials } from "../../dto/task-dto"
import { WsError } from "../ws-error"
import { userService } from "../../dependencies"
import { UserCredentials } from "../../model/user"
import { WsResponseStatus } from "../message-type"
import { ServiceError } from "../../service/exception/service-exception"
import { authenticate } from "./auth"

function signUpHandler(message: any) {
    console.log("Sign up handler")

    let userCredentials: UserCredentials
    try {
        userCredentials = extractUserCredentials(message)
    } catch {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "There is no task in message"
        )
    }

    try {
        const user = userService.add(userCredentials)
        console.log("Created user: %o", user)
        authenticate(
            message.socket,
            user.id,
            message.authSockets,
        )
        console.log("User is authenticated")
    } catch (e) {
        if (e instanceof ServiceError) {
            throw new WsError(
                WsResponseStatus.InvalidDataError,
                e.message
            )
        }
    }

    return { 
        status: WsResponseStatus.Success,
    }
}

export { signUpHandler }

