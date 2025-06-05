import { Tabs } from 'expo-router';
import NavBar from '../components/NavBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <NavBar {...props} />}
    >
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="homepage" />
      <Tabs.Screen name="walks" />
      <Tabs.Screen name="user" />
    </Tabs>
  );
}