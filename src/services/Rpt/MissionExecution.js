import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/missionExecution/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}
