import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/passRate/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeQueryDetails(params) {
  return request('/api/passRate/details', {
    method: 'POST',
    body: {
      ...params,
      method: 'details',
    },
  });
}
