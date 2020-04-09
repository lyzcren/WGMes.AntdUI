import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/missionInput/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove(id) {
  return request(`/api/missionInput/${id}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/missionInput', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/missionInput/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeRollback(params) {
  return request(`/api/missionInput/rollback/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'missionInput',
    },
  });
}

export async function fakeFetchFlows(id) {
  return request(`/api/missionInput/flow/${id}`);
}
