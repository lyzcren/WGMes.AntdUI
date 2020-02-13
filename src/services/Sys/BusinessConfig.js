import request from '@/utils/request';

export async function fakeFetch() {
  return request('/api/BusinessConfig');
}

export async function fakeFetchBasic() {
  return request('/api/BusinessConfig/basic');
}

export async function fakeFetchSync() {
  return request('/api/BusinessConfig/sync');
}

export async function fakeFetchInv() {
  return request('/api/BusinessConfig/inv');
}

export async function fakeUpdateBasic(params) {
  return request('/api/BusinessConfig/basic', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeUpdateSync(params) {
  return request('/api/BusinessConfig/sync', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeUpdateInv(params) {
  return request('/api/BusinessConfig/inv', {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}
