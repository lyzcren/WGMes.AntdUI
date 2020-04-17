import request from '@/utils/request';
import { stringify } from 'qs';

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

export async function fakeGetByBillNo(params) {
  return request(`/api/Mission?` + stringify(params));
}

export async function fakeRemove(params) {
  return request(`/api/Mission/${params.fInterID}`, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}

export async function fakeSync(params) {
  return request(`/api/Mission/sync`, {
    method: 'POST',
    body: {
      ...params,
      method: 'sync',
    },
  });
}

export async function fakeCheckSyncing(params) {
  return request(`/api/mission/checkSyncing`);
}
