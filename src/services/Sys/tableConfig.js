import request from '@/utils/request';

export async function fakeGetColumns(params) {
  return request(`/api/tableConfig/${params.key}/columns`);
}

export async function fakeUpdateColumns(params) {
  return request(`/api/tableConfig/${params.key}/columns`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'update',
    },
  });
}
