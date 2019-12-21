import request from '@/utils/request';
import { tsParameterProperty } from '@babel/types';

export async function fakeQuery(params) {
  return request('/api/Route/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeGet(params) {
  return request(`/api/Route/${params.fInterID}`);
}

export async function fakeRemove(params) {
  return request(`/api/Route/${params.fInterID}`, {
    method: 'DELETE',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd(params) {
  return request('/api/Route', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate(params) {
  return request(`/api/Route/${params.fInterID}`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive(params) {
  return request('/api/Route/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeCheck(params) {
  return request('/api/Route/check', {
    method: 'POST',
    body: {
      ...params,
      method: 'check',
    },
  });
}

export async function fakeQuerySteps(params) {
  return request(`/api/Route/Steps/${params.fInterID}`);
}

export async function fakeSaveSteps(params) {
  return request(`/api/Route/Steps/${params.fInterID}`, {
    method: 'POST',
    body: {
      steps: params.steps,
      method: 'setSteps',
    },
  });
}

export async function fakeQueryParams(params) {
  let url = `/api/Route/Params/${params.fInterID}`;
  if (params.fEntryID) {
    url += `?fEntryID=${params.fEntryID}`;
  }
  return request(url);
}

export async function fakeSaveParams(params) {
  return request(`/api/Route/Params/${params.fInterID}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'setParams',
    },
  });
}
