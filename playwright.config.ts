import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/scenarios',
  timeout: 120000,
  // Falha o CI se alguém esquecer um test.only no código
  forbidOnly: !!process.env.CI,
  // No CI tenta de novo até 2x, para instabilidade de rede dos sites externos
  retries: process.env.CI ? 2 : 0,
  use: {
    channel: 'msedge',
    locale: 'pt-BR',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  expect: {
    timeout: 30000
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'artifacts/report',
        open: 'never'
      }
    ]
  ]
});
