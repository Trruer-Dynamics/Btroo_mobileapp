/**
 * @format
 */

import { Alert, AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/store/Store";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import messaging from "@react-native-firebase/messaging";

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   // console.log('\nthis Message handled in the background!',
//   // remoteMessage,
//   // );
// });

const root = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaProvider>
        <App />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => root);
