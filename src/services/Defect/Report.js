import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakePage(params) {
  return request('/api/defectReport/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'page',
    },
  });
}

export async function fakeGet(id) {
  return request(`/api/defectReport/${id}`);
}

export async function fakeRemove(id) {
  return request('/api/defectReport/' + id, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/defectReport', {
    method: 'POST',
    body: {
      ...params,
      method: 'add',
    },
  });
}

export async function fakeUpdate(id, params) {
  return request('/api/defectReport/' + id, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeCheck(id) {
  return request(`/api/defectReport/check/${id}`, {
    method: 'PUT',
    body: {
      method: 'check',
    },
  });
}

export async function fakeUncheck(id) {
  return request(`/api/defectReport/uncheck/${id}`, {
    method: 'PUT',
    body: {
      method: 'uncheck',
    },
  });
}
