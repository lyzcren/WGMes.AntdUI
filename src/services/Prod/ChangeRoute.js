import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/changeRoute/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/changeRoute?${stringify(params)}`);
}

export async function fakeChangeRoute(params) {
  return request(`/api/changeRoute`, {
    method: 'POST',
    body: {
      ...params,
      method: 'changeRoute',
    },
  });
}

export async function fakeGetTake(params) {
  return request(`/api/changeRoute/ListByFlow/${params.fInterID}`);
}

export async function fakeRollback(params) {
  return request(`/api/changeRoute/rollback/${params.guid}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'changeRoute',
    },
  });
}
