import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL, withCredentials: true });

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) { accessToken = token; }
export function getAccessToken() { return accessToken; }

async function doRefresh(): Promise<string | null> {
  try {
    const res = await axios.post(baseURL + '/auth/refresh', {}, { withCredentials: true });
    const t = res.data?.accessToken ?? null;
    accessToken = t;
    return t;
  } catch {
    accessToken = null;
    return null;
  }
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = 'Bearer ' + accessToken;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if ((status === 401 || status === 403) && original && !original._retry && accessToken) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = 'Bearer ' + newToken;
        return api(original);
      }
      accessToken = null;
    }
    return Promise.reject(error);
  }
);

export default api;
export { doRefresh };

