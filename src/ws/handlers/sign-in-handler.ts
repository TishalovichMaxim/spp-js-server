import { extractUserCredentials } from "../../dto/task-dto"
import { WsError } from "../ws-error"
import { userService } from "../../dependencies"
import { UserCredentials } from "../../model/user"
import { WsResponseStatus } from "../message-type"
import { authenticate } from "./auth"

function signInHandler(message: any) {
    let userCredentials: UserCredentials
    try {
        userCredentials = extractUserCredentials(message)
    } catch {
        throw new WsError(
            WsResponseStatus.InvalidDataError,
            "There is no task in message"
        )
    }

    const user = userService.signIn(userCredentials.login, userCredentials.password)

    authenticate(
        message.socket,
        user.id,
        message.authSockets,
    )

    return {
        status: WsResponseStatus.Success,
    }
}

export { signInHandler }

