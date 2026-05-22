import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hayati.app',
  appName: 'Hayati',
  webDir: 'out',
  server: {
    url: 'https://agenhayati.vercel.app',
    cleartext: true
  }
};

export default config;
