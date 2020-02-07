import request from '@/utils/request';

export async function fakeFetch() {
  return request('/api/BusinessConfig');
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
