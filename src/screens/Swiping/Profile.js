import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileMain from "./ProfileMain";
import EditProfile from "./EditProfile";

const Profile = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileMain} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default Profile;
