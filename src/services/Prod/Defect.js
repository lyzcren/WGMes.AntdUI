import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/ProdDefect/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/ProdDefect/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
