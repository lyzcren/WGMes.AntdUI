import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakePage(params) {
  return request('/api/defectTransfer/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'page',
    },
  });
}

export async function fakeGet(id) {
  return request(`/api/defectTransfer/${id}`);
}

export async function fakeRemove(id) {
  return request('/api/defectTransfer/' + id, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/defectTransfer', {
    method: 'POST',
    body: {
      ...params,
      method: 'add',
    },
  });
}

export async function fakeUpdate(id, params) {
  return request('/api/defectTransfer/' + id, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSign(id) {
  return request(`/api/defectTransfer/sign/${id}`, {
    method: 'PUT',
    body: {
      method: 'check',
    },
  });
}

export async function fakeAntiSign(id) {
  return request(`/api/defectTransfer/anti_sign/${id}`, {
    method: 'PUT',
    body: {
      method: 'uncheck',
    },
  });
}
