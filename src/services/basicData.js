import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeDeptTreeData(params) {
  return request('/api/Dept/GetTreeData');
}

export async function fakeProcessDeptTree(params) {
  return request('/api/Dept/GetProcessTree');
}

export async function fakeGetWorkShops(params) {
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

export async function fakeGetTechParamData(params) {
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
  } else {
    return request(`/api/emp/getOperatorList`);
  }
}

export async function fakeGetBillNo(params) {
  let url = `/api/billNoRule?fNumber=${params.fNumber}`;
  return request(url);
}

export async function fakeGetStatus(number) {
  return request(`/api/keyValue/${number}`);
}
