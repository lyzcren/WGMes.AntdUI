import request from '@/utils/request';
import { stringify } from 'qs';

export async function fakeFetch() {
  return request('/api/BusinessConfig');
}

export async function fakeFetchBasic() {
  return request('/api/BusinessConfig/basic');
}

export async function fakeFetchSync() {
  return request('/api/BusinessConfig/sync');
}

export async function fakeFetchProd() {
  return request('/api/BusinessConfig/prod');
}

export async function fakeUpdateBasic(params) {
  return request('/api/BusinessConfig/basic', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeUpdateSync(params) {
  return request('/api/BusinessConfig/sync', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeUpdateProd(params) {
  return request('/api/BusinessConfig/prod', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeGetFields() {
  return request('/api/field');
}

export async function fakeUpdateFields(params) {
  return request('/api/field', {
    method: 'PUT',
    body: params,
  });
}

export async function fakeGetDbNames(params) {
  return request(`/api/BusinessConfig/dbNames?${stringify(params)}`);
}
