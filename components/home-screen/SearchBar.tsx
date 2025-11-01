import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { RefObject } from 'react';

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  inputRef?: RefObject<TextInput | null>;
}

export default function SearchBar({
  searchQuery,
  onChangeText,
  onSubmitEditing,
  inputRef,
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <View style={styles.inputWrapper}>
      <TextInput
        ref={inputRef}
        style={[styles.searchInput, { color: theme.colors.text }]}
        placeholder="Search"
        placeholderTextColor={(theme.colors as any).secondaryText || '#666'}
        value={searchQuery}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
      <TouchableOpacity style={styles.iconWrapper} onPress={onSubmitEditing}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 16,
  },
  iconWrapper: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});
