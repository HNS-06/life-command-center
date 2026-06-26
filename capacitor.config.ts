import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.nexus.commandcenter',
  appName: 'Nexus Command',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
