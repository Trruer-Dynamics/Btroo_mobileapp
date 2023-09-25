import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileMain from "./ProfileMain";
import EditProfile from "./EditProfile";
import { useDispatch, useSelector } from "react-redux";
import OffflineAlert from "../../components/functions/OfflineAlert";
import { setCurrentScreen } from "../../store/reducers/screen/screen";
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ route }) => {
  const dispatch = useDispatch()
  const Stack = createStackNavigator();

  const is_network_connected = useSelector(
    (state) => state.authentication.is_network_connected
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(setCurrentScreen("Profile"))
      return () => {
      };
    }, [])
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
