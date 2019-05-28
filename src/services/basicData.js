import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeDeptTreeData(params) {
  return request('/api/Dept/GetTreeData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeData',
    },
  });
}

export async function fakeProcessDeptTree(params) {
  return request('/api/Dept/GetProcessTree', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetProcessTree',
    },
  });
}

export async function fakeMachineData(params) {
  return request('/api/machine/GetData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeData',
    },
  });
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
  return request('/api/Param/GetData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetData',
    },
  });
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

export async function fakeGetDefect(params) {
  return request('/api/defect/getData', {
    method: 'POST',
    body: {
      ...params,
      method: 'getData',
    },
  });
}

export async function fakeGetOperatorList(params) {
  return request('/api/emp/getOperatorList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getOperatorList',
    },
  });
}

export async function fakeGetBillNo(params) {
  return request('/api/billNoRule/Get', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetData',
    },
  });
}

export async function fakeGetStatus(number) {
  return request(`/api/keyValue/${number}`);
}
