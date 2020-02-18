import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/report/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeScan(params) {
  return request(`/api/report/scan?${stringify(params)}`);
}

export async function fakeGet(id) {
  return request(`/api/report/${id}`);
}

export async function fakeAdd(params) {
  return request('/api/report', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/report/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeRemove(params) {
  return request(`/api/report/${params.id}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'DELETE',
    },
  });
}

export async function fakeCheck(id) {
  return request(`/api/report/check/${id}`, {
    method: 'PUT',
    body: {
      method: 'update',
    },
  });
}

export async function fakeUncheck(id) {
  return request(`/api/report/uncheck/${id}`, {
    method: 'PUT',
    body: {
      method: 'update',
    },
  });
}
