import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/ProductList/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeQueryErp (params) {
  return request('/api/ProductList/getErpList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getErpList',
    },
  });
}

export async function fakeRemove (params) {
  return request('/api/ProductList/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd (params) {
  return request('/api/ProductList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate (params) {
  return request('/api/ProductList/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive (params) {
  return request('/api/ProductList/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}