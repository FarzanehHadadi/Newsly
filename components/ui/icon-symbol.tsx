import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";
import { SymbolWeight } from "expo-symbols";

// This extracts the type of the "name" prop from MaterialCommunityIcons
type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Icon component using SF Symbols (iOS) and Material Icons (Android/Web).
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: MaterialIconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialCommunityIcons color={color} size={size} name={name} style={style} />;
}
