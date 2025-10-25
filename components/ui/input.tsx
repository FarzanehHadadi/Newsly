import * as React from 'react';
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { TextInputProps, TextStyle } from 'react-native';
import {
  I18nManager,
  TextInput as NTextInput,
  StyleSheet,
  View,
} from 'react-native';
import { Colors as colors } from '@/constants/theme';
import { Text } from './text';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type TRule<T extends FieldValues> =
  | Omit<
      RegisterOptions<T>,
      'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
    >
  | undefined;

export type RuleType<T extends FieldValues> = { [name in keyof T]: TRule<T> };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RuleType<T>;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = React.forwardRef<NTextInput, NInputProps>((props, ref) => {
  const { label, error, testID, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const getInputStyles = () => {
    const baseStyles: any = {
      marginTop: 0,
      borderRadius: 12,
      borderWidth: 0.5,
      backgroundColor: isDark ? '#262626' : '#f5f5f5',
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 20,
      color: isDark ? '#ffffff' : '#000000',
    };

    if (isFocussed) {
      baseStyles.borderColor = isDark ? '#d4d4d8' : '#a3a3a3';
    } else {
      baseStyles.borderColor = isDark ? '#404040' : '#d4d4d4';
    }

    if (error) {
      baseStyles.borderColor = '#dc2626';
    }

    if (props.disabled) {
      baseStyles.backgroundColor = isDark ? '#404040' : '#e5e5e5';
    }

    return baseStyles;
  };

  const getLabelStyles = () => ({
    color: error ? '#dc2626' : isDark ? '#f5f5f5' : '#71717a',
    marginBottom: 4,
    fontSize: 18,
  });

  const getErrorStyles = () => ({
    fontSize: 14,
    color: isDark ? '#f87171' : '#dc2626',
    marginTop: 4,
  });

  return (
    <View style={{ marginBottom: 8 }}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          style={getLabelStyles()}
        >
          {label}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={isDark ? '#a3a3a3' : '#71717a'}
        style={[
          getInputStyles() as TextStyle,
          {
            writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          },
          inputProps.style,
        ]}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          style={getErrorStyles()}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ''}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}
Input.displayName = 'Input';
