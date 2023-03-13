// 全局state
export interface IGlobalState {
}

// Login
export interface ILoginState {
    username: string,
    token:string,
    refreshToken:string,
    idCard:string,
    tokenType:string
}