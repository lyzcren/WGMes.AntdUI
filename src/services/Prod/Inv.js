import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/inv/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}
