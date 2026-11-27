import 'react-native';

/**
 * CSS properties that react-native-web passes through to the browser.
 * They are ignored on iOS/Android.
 */
type WebOnlyStyle = {
  transitionProperty?: string;
  transitionDuration?: string;
  transitionTimingFunction?: string;
  backdropFilter?: string;
  outlineWidth?: number;
  outlineColor?: string;
  outlineOffset?: number;
};

declare module 'react-native' {
  interface ViewStyle extends WebOnlyStyle {}
  interface TextStyle extends WebOnlyStyle {}
  interface ImageStyle extends WebOnlyStyle {}
}
