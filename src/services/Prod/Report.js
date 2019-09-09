import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/report/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeScan(batchNo) {
  return request('/api/report/scan?batchNo=' + batchNo);
}

export async function fakeQueryGroupBy() {
  return request('/api/report/groupBys');
}

export async function fakeAdd(params) {
  return request('/api/report', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/report/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeRemove(params) {
  return request('/api/report/' + params.id, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'DELETE',
    },
  });
}

export async function fakeCheck(params) {
  return request('/api/report/check/' + params.fInterID, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}
