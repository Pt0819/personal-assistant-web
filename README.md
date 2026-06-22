# personal-assistant-web

个人AI小助手桌面网页端 — React 19 + Vite 6 + Tailwind v4

## 快速开始

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # Vitest
pnpm build      # tsc --noEmit && vite build
pnpm e2e        # Playwright E2E
```

## 技术栈

- React 19 + TypeScript strict
- Vite 6 (bundler)
- Tailwind v4 (CSS-first)
- TanStack Query v5 (server state)
- Zustand (client state)
- React Router v7 (routing)
- Biome v2 (lint + format)
- Vitest + Testing Library (unit/component)
- Playwright (E2E)
- MSW v2 (API mocking)

## 项目结构

```
src/
├── components/   # UI 组件（ui/, chat/, calendar/, layout/）
├── pages/        # 页面（LoginPage, HomePage）
├── hooks/        # 自定义 hooks（useAuth, useChat, useCalendar）
├── services/     # API 客户端 + 服务
├── stores/       # Zustand stores（authStore, uiStore）
├── types/        # TypeScript 类型
├── utils/        # 工具函数（cn, date）
└── config/       # 配置（api, constants）
```

## 环境变量

```env
VITE_API_BASE_URL=http://localhost:8888/api/v1   # development
VITE_API_BASE_URL=https://assistant.example.com/api/v1  # production
```
