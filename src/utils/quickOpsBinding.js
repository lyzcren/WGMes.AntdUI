// use localStorage to store the token info, which might be sent from server in actual project.
export function getDeptId(str) {
  // return localStorage.getItem('antd-pro-token')
  const tokenString = typeof str === 'undefined' ? localStorage.getItem('antd-pro-deptId') : str;
  return tokenString === 'undefined' ? undefined : tokenString;
}

export function setDeptId(id) {
  return localStorage.setItem('antd-pro-deptId', id);
}

export function getMachineId(str) {
  const tokenString = typeof str === 'undefined' ? localStorage.getItem('antd-pro-machineId') : str;
  return tokenString === 'undefined' ? undefined : tokenString;
}

export function setMachineId(id) {
  return localStorage.setItem('antd-pro-machineId', id);
}

export function getWorkTimeId(str) {
  const tokenString = typeof str === 'undefined' ? localStorage.getItem('antd-pro-worktime') : str;
  return tokenString === 'undefined' ? undefined : tokenString;
}

export function setWorkTimeId(id) {
  return localStorage.setItem('antd-pro-worktime', id);
}

export function getOperator(str) {
  const empString = typeof str === 'undefined' ? localStorage.getItem('antd-pro-operator') : str;
  return JSON.parse(empString);
}

export function setOperator(emp) {
  return localStorage.setItem('antd-pro-operator', JSON.stringify(emp));
}
