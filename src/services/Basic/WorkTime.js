import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/workTime/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove(id) {
  return request('/api/workTime/' + id, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/workTime', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/workTime/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request('/api/workTime/active/' + params.id, {
    method: 'PUT',
    body: {
      method: 'active',
    },
  });
}

export async function fakeDeactive(params) {
  return request('/api/workTime/deactive/' + params.id, {
    method: 'PUT',
    body: {
      method: 'deactive',
    },
  });
}
