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
      method: 'batchSplit',
    },
  });
}

export async function fakeRemove(params) {
  return request(`/api/batchSplit`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'batchSplit',
    },
  });
}

export async function fakeRollback(params) {
  return request(`/api/batchSplit/rollback/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'batchSplit',
    },
  });
}
