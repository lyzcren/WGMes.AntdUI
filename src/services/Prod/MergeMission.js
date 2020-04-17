import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakePage(params) {
  return request('/api/mergeMission/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'page',
    },
  });
}

export async function fakeGet(id) {
  return request(`/api/mergeMission/${id}`);
}

export async function fakeRemove(id) {
  return request('/api/mergeMission/' + id, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/mergeMission', {
    method: 'POST',
    body: {
      ...params,
      method: 'add',
    },
  });
}

export async function fakeUpdate(id, params) {
  return request('/api/mergeMission/' + id, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeCheck(id) {
  return request(`/api/mergeMission/check/${id}`, {
    method: 'PUT',
    body: {
      method: 'check',
    },
  });
}

export async function fakeUncheck(id) {
  return request(`/api/mergeMission/uncheck/${id}`, {
    method: 'PUT',
    body: {
      method: 'uncheck',
    },
  });
}
