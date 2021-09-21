import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/services/Portal';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
LogBox.ignoreAllLogs()

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
})
messaging().onMessage(remoteMessage => {
    console.log("🚀 ~ file: index.js ~ line 12 ~ firebaseMessaging ~ remoteMessage", remoteMessage)
    ToastAndroid.show(JSON.stringify(remoteMessage.notification.body), ToastAndroid.LONG, ToastAndroid.TOP)
});
AppRegistry.registerComponent(appName, () => App);
