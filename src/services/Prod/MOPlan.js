import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/MOPlan/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet (params) {
  return request(`/api/MOPlan?${stringify(params)}`);
  // return request('/api/MOPlan', {
  //   method: 'GET',
  //   body: {
  //     ...params,
  //     method: 'get',
  //   },
  // });
}

export async function fakeSync (params) {
  return request('/api/MOPlan/sync', {
    method: 'POST',
    body: {
      ...params,
      method: 'sync',
    },
  });
}