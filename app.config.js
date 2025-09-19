export default {
  expo: {
    name: 'bolt-expo-nativewind',
    slug: 'bolt-expo-nativewind',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    android: {
      config: {
        googleMaps: {
          apiKey: 'YOUR_ANDROID_GOOGLE_MAPS_API_KEY',
        },
      },
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: 'YOUR_IOS_GOOGLE_MAPS_API_KEY',
      },
      infoPlist: {
        NSCameraUsageDescription:
          'This app needs access to your camera to take photos.',
        NSPhotoLibraryUsageDescription:
          'This app needs access to your photo library to select images.',
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-font', 'expo-web-browser'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: 'http://localhost:5000/',
    },
  },
};
