import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/MOPlan/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeSync (params) {
  return request('/api/MOPlan/sync', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}