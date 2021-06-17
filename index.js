import 'react-native-gesture-handler';
import { AppRegistry, LogBox, ToastAndroid } from 'react-native';
import App from './src/services/Portal';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
LogBox.ignoreAllLogs()

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
})

AppRegistry.registerComponent(appName, () => App);
