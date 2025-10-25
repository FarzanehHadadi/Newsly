import React from 'react';
import type { TextProps } from 'react-native';
import { Text as RNText } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface Props extends TextProps {
  children: React.ReactNode;
}

export const Text = ({ children, style, ...props }: Props) => {
  const theme = useTheme();

  return (
    <RNText style={[{ color: theme.colors.text }, style]} {...props}>
      {children}
    </RNText>
  );
};
