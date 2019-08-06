import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Dept/GetTreeList', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeList',
    },
  });
}

export async function fakeGetType(params) {
  return request('/api/Dept/GetType');
}

export async function fakeRemove(params) {
  return request(`/api/Dept/${params.fItemID}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeSync(params) {
  return request('/api/Dept/Sync', {
    method: 'POST',
    body: {
      ...params,
      method: 'Sync',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/Dept', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/Dept/${params.fItemID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeUpdateFix(params) {
  return request(`/api/Dept/${params.fItemID}/fix`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request(`/api/Dept/${params.fItemID}/active?fIsActive=${params.fIsActive}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeGetParams(params) {
  return request(`/api/dept/${params.fDeptID}/getParams`);
}

export async function fakeAddParams(params) {
  return request(`/api/dept/${params.fDeptID}/addParams`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'addParams',
    },
  });
}

export async function fakeGetWorkTimes(id) {
  return request(`/api/dept/workTimes/${id}`);
}
