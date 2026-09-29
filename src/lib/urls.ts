export function withBase(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.replace(/^\//, '');
  return `${base}/${normalized}`.replace(/\/+/g, '/');
}
