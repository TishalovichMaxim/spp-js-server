import { WsResponseStatus } from "./message-type"

class WsError extends Error {

    constructor(
        public status: WsResponseStatus,
        message: string,
    ) {
        super(message)
    }

}

export { WsError }

