import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/defectRepair/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove(params) {
  return request('/api/defectRepair/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/defectRepair', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/defectRepair/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request('/api/defectRepair/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeRollback(params) {
  return request(`/api/defectRepair/rollback/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'rollback',
    },
  });
}
