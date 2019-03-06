// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority (str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority (authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  // console.log(proAuthority);
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}

export function hasAuthority (currentAuthority) {
  const authority = getAuthority();
  if (authority.indexOf(currentAuthority) >= 0) {
    return true;
  }

  return false;
}
