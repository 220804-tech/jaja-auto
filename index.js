import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/services/Portal';
import { name as appName } from './app.json';
import Messaging from '@react-native-firebase/messaging';
LogBox.ignoreAllLogs()

Messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("🚀 ~ file: index.js ~ line 15 ~ Messaging ~ remoteMessage", remoteMessage)
    console.log('Message handled in the background!', remoteMessage);
});

Messaging().onMessage(remoteMessage => {
    // alert(JSON.stringify(remoteMessage.notification.title));
    ToastAndroid.show(JSON.stringify(remoteMessage.notification.body), ToastAndroid.LONG, ToastAndroid.TOP)
    // navigation.navigate(remoteMessage.data.type);
});
AppRegistry.registerComponent(appName, () => App);
