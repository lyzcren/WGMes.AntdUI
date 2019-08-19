import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/take/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/take?${stringify(params)}`);
}

export async function fakeTake(params) {
  return request(`/api/take/${params.fInterID}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'Take',
    },
  });
}

export async function fakeGetTake(params) {
  return request(`/api/take/ListByFlow/${params.fInterID}`);
}

export async function fakeRollback(params) {
  return request(`/api/take/rollback`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'Take',
    },
  });
}
