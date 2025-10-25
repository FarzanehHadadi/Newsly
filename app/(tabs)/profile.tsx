import { useTheme } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Switch, Text, View, Appearance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function PersonScreen() {
  const [isEnabled, setIsEnabled] = useState(
    Appearance.getColorScheme() === 'dark'
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsEnabled(colorScheme === 'dark');
    });
    return () => subscription?.remove();
  }, []);

  const toggleSwitch = () => {
    if (Appearance?.getColorScheme() === 'light')
      Appearance.setColorScheme('dark');
    else Appearance.setColorScheme('light');
  };
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={{ color: theme.colors.text }}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#4B5563', true: '#D1D5DB' }} // gray-600, light-gray-300
          thumbColor={isEnabled ? '#10b981' : '#6B7280'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
