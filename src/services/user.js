import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}


export async function queryUser(params) {
  return request(`/api/user?${stringify(params)}`);
}

export async function removeUser(params) {
  return request('/api/user', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addUser(params) {
  return request('/api/user', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params) {
  return request('/api/user', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}