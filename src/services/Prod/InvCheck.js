import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/invCheck/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/invCheck/${params.fInterID}`);
}

export async function fakeRemove(id) {
  return request(`/api/invCheck/${id}`, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/invCheck', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/invCheck/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeCheck(params) {
  return request(`/api/invCheck/check/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'check',
    },
  });
}

export async function fakeUnCheck(params) {
  return request(`/api/invCheck/uncheck/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'uncheck',
    },
  });
}

export async function fakeInvByDept(params) {
  return request(`/api/invCheck/deptInv/${params.id}`);
}
