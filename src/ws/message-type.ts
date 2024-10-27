enum WsRequestType {
    LogOut,
    SignIn,
    SignUp,
    Tasks,
    DeleteTask,
    AddTask,
    UpdateTask,
    AttachFile,
    DeleteAttachedFile,
}

enum WsResponseStatus {
    AuthenticationError,
    InvalidDataError,
    InvalidRequestType,
    UnknownError,
    Success,
}

export { WsRequestType, WsResponseStatus }

