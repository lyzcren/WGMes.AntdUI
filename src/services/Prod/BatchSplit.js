import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/batchSplit/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/batchSplit?${stringify(params)}`);
}

export async function fakeSplit(params) {
  return request(`/api/batchSplit`, {
    method: 'POST',
    body: {
      ...params,
      method: 'changeRoute',
    },
  });
}
