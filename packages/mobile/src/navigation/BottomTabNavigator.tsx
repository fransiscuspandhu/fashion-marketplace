import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E4E4E7",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#18181B",
        tabBarInactiveTintColor: "#A1A1AA",
        tabBarIcon: ({ color, focused }) => {
          let icon = "🏠";
          if (route.name === "Beranda") icon = "🏠";
          else if (route.name === "Katalog") icon = "👗";
          else if (route.name === "Keranjang") icon = "🛍️";
          else if (route.name === "Akun") icon = "👤";
          return <Text style={{ fontSize: 18 }}>{icon}</Text>;
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Katalog" component={CatalogScreen} />
      <Tab.Screen name="Keranjang" component={CartScreen} />
      <Tab.Screen name="Akun" component={AccountScreen} />
    </Tab.Navigator>
  );
}
