import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/output/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}
