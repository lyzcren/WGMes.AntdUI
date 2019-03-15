import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeDeptTreeData (params) {
  return request('/api/Dept/GetTreeData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeData',
    },
  });
}

export async function fakeGetRouteData (params) {
  return request('/api/Route/GetData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetData',
    },
  });
}

export async function fakeGetBillNo (params) {
  return request('/api/billNoRule/Get', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetData',
    },
  });
}