import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get('/api/v1/health', () => {
    return HttpResponse.json({ code: 0, msg: 'ok', data: null });
  }),
];

export const server = setupServer(...handlers);
