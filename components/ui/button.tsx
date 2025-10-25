import React from 'react';
import type { PressableProps, View, ViewStyle, TextStyle } from 'react-native';
import { ActivityIndicator, Pressable, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'ghost'
  | 'link';
type ButtonSize = 'default' | 'lg' | 'sm' | 'icon';

interface Props extends Omit<PressableProps, 'disabled'> {
  label?: string;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export const Button = React.forwardRef<View, Props>(
  (
    {
      label: text,
      loading = false,
      variant = 'default',
      disabled = false,
      size = 'default',
      fullWidth = true,
      testID,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const getContainerStyles = (): ViewStyle => {
      const baseStyles: ViewStyle = {
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingHorizontal: 16,
      };

      // Size styles
      switch (size) {
        case 'lg':
          baseStyles.height = 48;
          baseStyles.paddingHorizontal = 32;
          break;
        case 'sm':
          baseStyles.height = 32;
          baseStyles.paddingHorizontal = 12;
          break;
        case 'icon':
          baseStyles.width = 36;
          baseStyles.height = 36;
          baseStyles.paddingHorizontal = 0;
          break;
        default:
          baseStyles.height = 40;
      }

      // Variant styles
      switch (variant) {
        case 'default':
          baseStyles.backgroundColor = isDark ? '#ffffff' : '#000000';
          break;
        case 'secondary':
          baseStyles.backgroundColor = '#3b82f6';
          break;
        case 'outline':
          baseStyles.backgroundColor = 'transparent';
          baseStyles.borderWidth = 1;
          baseStyles.borderColor = isDark ? '#a3a3a3' : '#d4d4d4';
          break;
        case 'destructive':
          baseStyles.backgroundColor = '#dc2626';
          break;
        case 'ghost':
          baseStyles.backgroundColor = 'transparent';
          break;
        case 'link':
          baseStyles.backgroundColor = 'transparent';
          break;
      }

      // Disabled styles
      if (disabled) {
        baseStyles.backgroundColor = isDark ? '#404040' : '#d4d4d4';
      }

      // Full width
      if (!fullWidth) {
        baseStyles.alignSelf = 'center';
      }

      return baseStyles;
    };

    const getLabelStyles = (): TextStyle => {
      const baseStyles: TextStyle = {
        fontSize: 16,
        fontWeight: '600',
      };

      // Size styles
      switch (size) {
        case 'lg':
          baseStyles.fontSize = 20;
          break;
        case 'sm':
          baseStyles.fontSize = 14;
          break;
      }

      // Variant styles
      switch (variant) {
        case 'default':
          baseStyles.color = isDark ? '#000000' : '#ffffff';
          break;
        case 'secondary':
          baseStyles.color = '#ffffff';
          break;
        case 'outline':
          baseStyles.color = isDark ? '#f5f5f5' : '#000000';
          break;
        case 'destructive':
          baseStyles.color = '#ffffff';
          break;
        case 'ghost':
          baseStyles.color = isDark ? '#ffffff' : '#000000';
          baseStyles.textDecorationLine = 'underline';
          break;
        case 'link':
          baseStyles.color = isDark ? '#ffffff' : '#000000';
          break;
      }

      // Disabled styles
      if (disabled) {
        baseStyles.color = isDark ? '#a3a3a3' : '#71717a';
      }

      return baseStyles;
    };

    const getIndicatorStyles = () => {
      const baseStyles = {
        height: 24,
        color: '#ffffff',
      };

      if (size === 'sm') {
        baseStyles.height = 16;
      }

      // Variant colors
      switch (variant) {
        case 'default':
          baseStyles.color = isDark ? '#000000' : '#ffffff';
          break;
        case 'secondary':
          baseStyles.color = '#ffffff';
          break;
        case 'outline':
          baseStyles.color = isDark ? '#f5f5f5' : '#000000';
          break;
        case 'destructive':
          baseStyles.color = '#ffffff';
          break;
        case 'ghost':
          baseStyles.color = isDark ? '#ffffff' : '#000000';
          break;
        case 'link':
          baseStyles.color = isDark ? '#ffffff' : '#000000';
          break;
      }

      if (disabled) {
        baseStyles.color = isDark ? '#a3a3a3' : '#71717a';
      }

      return baseStyles;
    };

    return (
      <Pressable
        disabled={disabled || loading}
        style={getContainerStyles()}
        {...props}
        ref={ref}
        testID={testID}
      >
        {props.children ? (
          props.children
        ) : (
          <>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={getIndicatorStyles().color}
                testID={testID ? `${testID}-activity-indicator` : undefined}
              />
            ) : (
              <Text
                testID={testID ? `${testID}-label` : undefined}
                style={getLabelStyles()}
              >
                {text}
              </Text>
            )}
          </>
        )}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';
