import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/defectCheck/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/defectCheck/${params.fInterID}`);
}

export async function fakeRemove(id) {
  return request('/api/defectCheck/' + id, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/defectCheck', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/defectCheck/' + params.fInterID, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeCheck(params) {
  return request(`/api/defectCheck/check/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'check',
    },
  });
}

export async function fakeUnCheck(params) {
  return request(`/api/defectCheck/uncheck/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'uncheck',
    },
  });
}

export async function fakeInvByDept(params) {
  return request(`/api/defectCheck/deptInv/${params.id}`);
}
