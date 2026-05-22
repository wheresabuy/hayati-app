import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hayati.app',
  appName: 'Hayati',
  webDir: 'out',
  server: {
    url: 'https://hayati-app.vercel.app', // Ganti dengan URL Vercel aslimu bang
    cleartext: true
  }
};

export default config;
