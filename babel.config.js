module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], // Configure Expo preset for NativeWind
      'nativewind/babel', // NativeWind should be a preset
    ],
    plugins: [
      'react-native-reanimated/plugin', // Reanimated plugin must be the last plugin
    ],
  };
};