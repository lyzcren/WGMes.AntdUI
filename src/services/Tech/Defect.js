import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Defect/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove(params) {
  return request(`/api/Defect/${params.fItemID}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/Defect', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/Defect/${params.fItemID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  console.log(params.fIsActive);
  return request(`/api/Defect/active/${params.fItemID}?fIsActive=${params.fIsActive}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}
