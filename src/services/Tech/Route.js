import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/Route/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet (params) {
  return request('/api/Route/get', {
    method: 'POST',
    body: {
      ...params,
      method: 'get',
    },
  });
}

export async function fakeRemove (params) {
  return request('/api/Route/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd (params) {
  return request('/api/Route', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate (params) {
  return request('/api/Route/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive (params) {
  return request('/api/Route/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeCheck (params) {
  return request('/api/Route/check', {
    method: 'POST',
    body: {
      ...params,
      method: 'check',
    },
  });
}

export async function fakeQuerySteps (params) {
  return request('/api/Route/getSteps', {
    method: 'POST',
    body: {
      ...params,
      method: 'getSteps',
    },
  });
}

export async function fakeSaveSteps (params) {
  return request('/api/Route/setSteps', {
    method: 'POST',
    body: {
      ...params,
      method: 'setSteps',
    },
  });
}