// Minimal ambient declaration of the React Native surface consumed by the Fujin
// native primitive set. React Native is an OPTIONAL peer dependency — consuming
// apps bring their own copy — so it is not installed into this repo's
// node_modules. This shim lets `tsc` typecheck the native sources (prop names,
// style value shapes, token wiring) without pulling the full RN toolchain.
//
// Scope: only the components, hooks, and style properties actually used by the
// primitives are declared. Extend here when a primitive starts using more.

declare module 'react-native' {
  import type * as React from 'react';

  export type ColorValue = string;

  export interface FlexStyle {
    flex?: number;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly';
    gap?: number;
    rowGap?: number;
    columnGap?: number;
    flexGrow?: number;
    flexShrink?: number;
    width?: number | string;
    height?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    overflow?: 'visible' | 'hidden' | 'scroll';
  }

  export interface ViewStyle extends FlexStyle {
    backgroundColor?: ColorValue;
    borderColor?: ColorValue;
    borderTopColor?: ColorValue;
    borderBottomColor?: ColorValue;
    borderWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderRadius?: number;
    opacity?: number;
    elevation?: number;
    shadowColor?: ColorValue;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
  }

  export interface TextStyle extends ViewStyle {
    color?: ColorValue;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic';
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | number;
    letterSpacing?: number;
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  }

  export type StyleProp<T> =
    | T
    | null
    | undefined
    | false
    | ReadonlyArray<StyleProp<T>>;

  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    testID?: string;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
  }
  export const View: React.ComponentType<ViewProps>;

  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
    numberOfLines?: number;
    testID?: string;
  }
  export const Text: React.ComponentType<TextProps>;

  export interface PressableStateCallbackType {
    pressed: boolean;
  }
  export interface PressableProps {
    onPress?: () => void;
    disabled?: boolean;
    style?:
      | StyleProp<ViewStyle>
      | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
    children?:
      | React.ReactNode
      | ((state: PressableStateCallbackType) => React.ReactNode);
    testID?: string;
    accessibilityRole?: string;
  }
  export const Pressable: React.ComponentType<PressableProps>;

  export const StyleSheet: {
    create<T extends Record<string, ViewStyle | TextStyle>>(styles: T): T;
    flatten(style?: StyleProp<ViewStyle | TextStyle>): ViewStyle & TextStyle;
    hairlineWidth: number;
  };

  export function useColorScheme(): 'light' | 'dark' | null | undefined;
}
