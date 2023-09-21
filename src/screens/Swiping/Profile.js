import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileMain from "./ProfileMain";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import OffflineAlert from "../../components/functions/OfflineAlert";

const Profile = ({ route }) => {
  const Stack = createStackNavigator();

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  return (
    <>
      {!is_network_connected && <OffflineAlert />}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileMain" component={ProfileMain} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </>
  );
};

export default Profile;
