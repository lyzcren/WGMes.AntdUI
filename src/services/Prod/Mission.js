import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Mission/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/Mission?${stringify(params)}`);
  // return request('/api/Mission', {
  //   method: 'GET',
  //   body: {
  //     ...params,
  //     method: 'get',
  //   },
  // });
}

export async function fakeSync(params) {
  return request('/api/Mission/sync', {
    method: 'POST',
    body: {
      ...params,
      method: 'sync',
    },
  });
}

export async function fakeGenFlow(params) {
  return request('/api/Mission/genFlow', {
    method: 'POST',
    body: {
      ...params,
      method: 'genFlow',
    },
  });
}
