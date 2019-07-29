import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/roles');
}

export async function queryRole(params) {
  return request('/api/role/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
  // return request(`/api/role?${stringify(params)}`);
}

export async function removeRole(params) {
  return request('/api/role/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRole(params) {
  return request('/api/role', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRole(params) {
  return request(`/api/role/${params.fItemID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request('/api/role/active', {
    method: 'PUT',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeDeactive(params) {
  return request('/api/role/deactive', {
    method: 'PUT',
    body: {
      ...params,
      method: 'deactive',
    },
  });
}

export async function getAuth(params) {
  return request(`/api/role/authority?${stringify(params)}`);
}

export async function setAuth(params) {
  return request('/api/role/authorize', {
    method: 'POST',
    body: {
      ...params,
      method: 'authorize',
    },
  });
}

export async function getCurrentAuth(params) {
  return request(`/api/role/currentAuthority?${stringify(params)}`);
}

export async function fakeGetAuthorizeUser(params) {
  return request('/api/role/getAuthorizedUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'getAuthorizedUser',
    },
  });
}

export async function fakeAuthorizeUser(params) {
  return request('/api/role/AuthorizeUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'AuthorizeUser',
    },
  });
}
export async function fakeUnAuthorizeUser(params) {
  return request('/api/role/UnAuthorizeUser', {
    method: 'POST',
    body: {
      ...params,
      method: 'UnAuthorizeUser',
    },
  });
}
