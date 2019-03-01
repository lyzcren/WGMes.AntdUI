import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/Dept/GetTreeList', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeList',
    },
  });
}

export async function fakeRemove (params) {
  return request('/api/Dept/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd (params) {
  return request('/api/Dept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate (params) {
  return request('/api/Dept/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive (params) {
  return request('/api/Dept/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}