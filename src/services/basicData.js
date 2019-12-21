import request from '@/utils/request';

export async function fakeDeptTreeData() {
  return request('/api/Dept/GetTreeData');
}

export async function fakeProcessDeptTree() {
  return request('/api/Dept/GetProcessTree');
}

export async function fakeGetAuthorizeProcessTree() {
  return request('/api/Dept/AuthorizeProcessTree');
}

export async function fakeGetWorkShops() {
  return request('/api/Dept/GetWorkShop');
}

export async function fakeMachineData(params) {
  return request(`/api/machine/GetData?fDeptID=${params.fDeptID}`);
}

export async function fakeGetRouteData(params) {
  return request('/api/Route/GetData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetData',
    },
  });
}

export async function fakeGetTechParamData() {
  return request('/api/Param');
}

export async function fakeGetTechParamValues(params) {
  return request('/api/param/getVaules', {
    method: 'POST',
    body: {
      ...params,
      method: 'getVaules',
    },
  });
}

export async function fakeGetDeptDefect(params) {
  return request(`/api/defect/getData/${params.fDeptID}`);
}

export async function fakeGetDefect(params) {
  return request(`/api/defect/`);
}

export async function fakeGetOperatorList(params) {
  if (params && params.fDeptID) {
    return request(`/api/emp/getOperatorList?fDeptID=${params.fDeptID}`);
  }
  return request(`/api/emp/getOperatorList`);
}

export async function fakeGetBillNo(params) {
  const url = `/api/billNoRule?fNumber=${params.fNumber}`;
  return request(url);
}

export async function fakeKeyValues(number) {
  return request(`/api/keyValue/${number}`);
}

export async function fakeGetWorkTime() {
  return request(`/api/workTime/`);
}
