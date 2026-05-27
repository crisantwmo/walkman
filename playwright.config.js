const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Ejecuta las pruebas una por una en lugar de todas juntas al mismo tiempo */
  fullyParallel: false, 
  reporter: 'html',
  use: {
    /* La URL base de tu servidor local */
    baseURL: 'http://127.0.0.1:5500', 
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});