export default {
  expo: {
    name: 'Ofside App',
    slug: 'bolt-expo-nativewind',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    android: {
          package: "com.ofside.ofside",  // ← Add this line
      googleServicesFile: "./google-services.json",  // ← Add this line
      config: {
        googleMaps: {
          apiKey: 'AIzaSyBNcYcteWd_FceId1YrifNhtPoPAZ87RzE',
        },
      },
    },
    ios: {
      bundleIdentifier: "com.ofside.ofside",
       googleServicesFile: "./GoogleService-Info.plist"  ,
      supportsTablet: true,
      config: {
        googleMapsApiKey: 'AIzaSyBNcYcteWd_FceId1YrifNhtPoPAZ87RzE',
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
    plugins: [
      
        [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static"
          }
        }
      ],
      'expo-router', 'expo-font', 'expo-web-browser'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
       "googleExpoClientId": "your-google-expo-client-id",
      "googleIosClientId": "your-google-ios-client-id",
      // API_URL: 'http://192.168.1.9:5000',
      API_URL: process.env.API_URL,
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    },
  },
};  
