import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/user/currentUser');
}

export async function queryUser(params) {
  return request('/api/user/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
  // return request(`/api/user?${stringify(params)}`);
}

export async function removeUser(params) {
  return request('/api/user/delete', {
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
  return request('/api/user/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function activeUser(params) {
  return request(`/api/user/${params.fItemID}/active?fIsActive=${params.fIsActive}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeGetAuthorizeRole(params) {
  return request('/api/user/GetAuthorizedRole', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetAuthorizedRole',
    },
  });
}

export async function fakeAuthorizeRole(params) {
  return request('/api/role/AuthorizeUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'AuthorizeUser',
    },
  });
}
export async function fakeUnAuthorizeRole(params) {
  return request('/api/role/UnAuthorizeUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'UnAuthorizeUser',
    },
  });
}
