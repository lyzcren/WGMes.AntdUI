import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/UnitConverter/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(id) {
  return request(`/api/UnitConverter/${id}`);
}

export async function fakeRemove(params) {
  return request(`/api/UnitConverter/${params.fItemID}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/UnitConverter', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/UnitConverter/${params.fItemID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request(`/api/UnitConverter/${params.fItemID}/active?fIsActive=${params.fIsActive}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'active',
    },
  });
}
