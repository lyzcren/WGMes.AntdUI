function print(module, printUrl, grfId, id) {
  const w = window.open('about:blank');
  w.location.href = `${printUrl}/print/${module}/${grfId}/${id}`;
}

export default print;
