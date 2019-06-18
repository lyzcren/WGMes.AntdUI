import { stringify } from 'qs';
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
