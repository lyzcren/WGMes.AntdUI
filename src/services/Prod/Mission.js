import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Mission/page', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/Mission/${params.fInterID}`);
}

export async function fakeSync(params) {
  return request('/api/Mission/sync');
}
