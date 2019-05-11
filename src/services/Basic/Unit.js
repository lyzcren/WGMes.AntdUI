import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Unit/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove(params) {
  return request('/api/Unit/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/Unit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/Unit/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request('/api/Unit/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}
