// use localStorage to store the token info, which might be sent from server in actual project.
export function getToken(str) {
    // return localStorage.getItem('antd-pro-token')
    const tokenString =
        typeof str === 'undefined' ? localStorage.getItem('antd-pro-token') : str;
    return tokenString === 'undefined' ? undefined : tokenString;
}

export function setToken(token) {
    return localStorage.setItem('antd-pro-token', token);
}
