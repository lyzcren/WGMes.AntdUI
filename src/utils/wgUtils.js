export function print(module, grfId, id) {
  const w = window.open('about:blank');
  w.location.href = 'http://localhost:8001/print/' + module + '/' + grfId + '/' + id;
}
