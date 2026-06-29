import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';

const API_BASE = '/api/v1';

const mockUser = {
  id: 1,
  openid: 'test-openid',
  username: '小助手_test',
  nickname: '测试用户',
  avatar_url: '',
  auth_method: 'wechat' as const,
};

let mockSchedules: Array<Record<string, unknown>> = [
  {
    id: 1, user_id: 1, title: '团队站会', description: '',
    start_time: '2026-06-23T09:00:00+08:00', end_time: '2026-06-23T10:00:00+08:00',
    location: '3楼大会议室', is_all_day: false, status: 1, remind_before: 30, source: 'chat',
    created_at: '2026-06-22T08:00:00+08:00', updated_at: '2026-06-22T08:00:00+08:00',
  },
  {
    id: 2, user_id: 1, title: '产品评审会', description: '',
    start_time: '2026-06-23T14:00:00+08:00', end_time: '2026-06-23T15:30:00+08:00',
    location: '线上-腾讯会议', is_all_day: false, status: 1, remind_before: 30, source: 'chat',
    created_at: '2026-06-22T08:00:00+08:00', updated_at: '2026-06-22T08:00:00+08:00',
  },
];

const mockConversations = [
  { id: 1, title: '日常对话', last_message: '帮我查看本周日程', last_message_at: '2026-06-22T15:30:00+08:00', created_at: '2026-06-22T08:00:00+08:00' },
];

const mockMessages = [
  { id: 1, role: 'user', content: '这周末有什么安排？', created_at: '2026-06-22T15:00:00+08:00' },
  { id: 2, role: 'assistant', content: '这周末暂无日程安排，需要我帮你添加吗？', created_at: '2026-06-22T15:00:05+08:00' },
];

export const handlers = [
  // Auth: QR code
  http.get(`${API_BASE}/auth/wechat/web/qrcode`, async () => {
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: { qrcode_url: 'https://via.placeholder.com/192x192.png?text=QR+Code', temp_token: 'mock-temp-token-123', expires_in: 300 },
    });
  }),

  // Auth: poll status
  http.get(`${API_BASE}/auth/wechat/web/status`, async ({ request }) => {
    await delay(500);
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: { status: 'confirmed', access_token: 'mock-jwt-token', refresh_token: 'mock-refresh-token', expires_in: 7200, user: mockUser },
    });
  }),

  // Auth: refresh
  http.post(`${API_BASE}/auth/refresh`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: { access_token: 'new-mock-jwt-token', expires_in: 7200 } });
  }),

  // Auth: logout
  http.post(`${API_BASE}/auth/logout`, async () => {
    return HttpResponse.json({ code: 0, msg: '已登出', data: null });
  }),

  // Auth: send email code
  http.post(`${API_BASE}/auth/register/send-email-code`, async () => {
    return HttpResponse.json({ code: 0, msg: '验证码已发送', data: null });
  }),

  // Auth: send SMS code
  http.post(`${API_BASE}/auth/register/send-sms-code`, async () => {
    return HttpResponse.json({ code: 0, msg: '验证码已发送', data: null });
  }),

  // Auth: register by email
  http.post(`${API_BASE}/auth/register/email`, async () => {
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: {
        access_token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 7200,
        user: { ...mockUser, id: 2, openid: undefined, auth_method: 'email', email: 'new@example.com', username: '小助手_new1' },
      },
    });
  }),

  // Auth: register by phone
  http.post(`${API_BASE}/auth/register/phone`, async () => {
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: {
        access_token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 7200,
        user: { ...mockUser, id: 3, openid: undefined, auth_method: 'phone', phone: '13800138000', username: '小助手_new2' },
      },
    });
  }),

  // Auth: credential login
  http.post(`${API_BASE}/auth/login/credential`, async () => {
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: {
        access_token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 7200,
        user: { ...mockUser, id: 1, auth_method: 'email', email: 'user@example.com' },
      },
    });
  }),

  // Conversations
  http.get(`${API_BASE}/conversations`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: mockConversations });
  }),

  http.post(`${API_BASE}/conversations`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: { id: 2, title: '新对话', created_at: new Date().toISOString() } });
  }),

  // Messages
  http.get(`${API_BASE}/conversations/:id/messages`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: mockMessages });
  }),

  http.post(`${API_BASE}/conversations/:id/messages`, async ({ request }) => {
    await delay(1500);
    const body = await request.json() as { content: string };
    return HttpResponse.json({
      code: 0, msg: '成功',
      data: { id: Date.now(), role: 'assistant', content: `好的，我已记下："${body.content}"。还有什么需要吗？`, parsed_json: null, created_at: new Date().toISOString() },
    });
  }),

  // Schedules
  http.get(`${API_BASE}/schedules`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: mockSchedules });
  }),

  http.post(`${API_BASE}/schedules`, async ({ request }) => {
    const body = await request.json();
    const newSchedule = { id: Date.now(), user_id: 1, ...body as object, status: 1, source: 'manual', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockSchedules.push(newSchedule);
    return HttpResponse.json({ code: 0, msg: '成功', data: newSchedule });
  }),

  http.put(`${API_BASE}/schedules/:id`, async ({ params, request }) => {
    const body = await request.json();
    const id = Number(params.id);
    const idx = mockSchedules.findIndex((s) => s.id === id);
    if (idx >= 0) {
      mockSchedules[idx] = { ...mockSchedules[idx], ...body as object, updated_at: new Date().toISOString() };
      return HttpResponse.json({ code: 0, msg: '成功', data: mockSchedules[idx] });
    }
    return HttpResponse.json({ code: 7, msg: '未找到', data: null }, { status: 404 });
  }),

  http.delete(`${API_BASE}/schedules/:id`, async ({ params }) => {
    mockSchedules = mockSchedules.filter((s) => s.id !== Number(params.id));
    return HttpResponse.json({ code: 0, msg: '成功', data: null });
  }),

  // User profile
  http.get(`${API_BASE}/user/profile`, async () => {
    return HttpResponse.json({ code: 0, msg: '成功', data: mockUser });
  }),
];

export const server = setupServer(...handlers);
