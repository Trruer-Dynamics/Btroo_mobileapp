import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import React from "react";
import Intro from "../../screens/Intro";
import MobileNo from "../../screens/SignUp/MobileNo";
import UserIntro from "../../screens/SignUp/UserIntro";
import PicUpload from "../../screens/SignUp/PicUpload";
import Pledge from "../../screens/Tutorial/Pledge";
import BottomTab from "../bottom/BottomTab";

import PhotoVerification from "../../screens/SignUp/PhotoVerification";
import PhotoVerificationFinal from "../../screens/SignUp/PhotoVerificationFinal";
import PhotoVerifyCamera from "../../components/screenComponents/signUp/PhotoVerifyCamera";
import Chat from "../../screens/Swiping/Match/Chat";
import MatchProfile from "../../screens/Swiping/Match/MatchProfile";
import ProfileRevealed from "../../screens/Swiping/Match/ProfileRevealed";
import Splash from "../../screens/Splash";
import { useDispatch, useSelector } from "react-redux";

import Info from "../../components/screenComponents/settingScreen/Info";
import ChatStack from "../../screens/Swiping/Match/ChatStack";

const Stack = createStackNavigator();

const StackNav = () => {
  const user_loggined = useSelector(
    (state) => state.authentication.user_loggined
  );

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        // // show screen according to authentication
        initialRouteName={user_loggined ? "BottomTab" : "Splash"}
      >
      
        <Stack.Screen name="Splash" component={Splash} />

        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        
        {/* SignUp & Login */}
        <Stack.Screen name="MobileNo" component={MobileNo} />
        <Stack.Screen name="UserIntro" component={UserIntro} />
        <Stack.Screen name="PicUpload" component={PicUpload} />
        <Stack.Screen name="PhotoVerification" component={PhotoVerification} />
        <Stack.Screen name="PhotoVerifyCamera" component={PhotoVerifyCamera} />
        <Stack.Screen
          name="PhotoVerificationFinal"
          component={PhotoVerificationFinal}
        />



        {/* Tutorial */}
        <Stack.Screen name="Pledge" component={Pledge} />

        {/* Swiping */}
       
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="Chat" component={ChatStack} />
        <Stack.Screen name="MatchProfile" component={MatchProfile} />
        <Stack.Screen name="ProfileRevealed" component={ProfileRevealed} />
        <Stack.Screen name="Info" component={Info} />


      </Stack.Navigator>
    </>
  );
};

export default StackNav;
