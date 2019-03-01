import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/Machine/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove (params) {
  return request('/api/Machine/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd (params) {
  return request('/api/Machine', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate (params) {
  return request('/api/Machine/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive (params) {
  return request('/api/Machine/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}