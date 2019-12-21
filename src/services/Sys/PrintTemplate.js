import request from '@/utils/request';

export async function fakeQueryGroups(params) {
  return request('/api/PrintTemplate/groups');
}

export async function fakeQueryPrintTemplate(params) {
  return request(`/api/PrintTemplate/GetTemplates?number=${params.number}`);
}

export async function fakeQueryRootUrl() {
  return request('/api/PrintTemplate/rootUrl');
}

export async function fakeRemovePrintTemplate(params) {
  return request(`/api/PrintTemplate/${params.id}`, {
    method: 'DELETE',
    body: {
      method: 'delete',
    },
  });
}
