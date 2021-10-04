import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/services/Portal';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { Utils } from './src/export';
LogBox.ignoreAllLogs()

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
})
messaging().onMessage(remoteMessage => {
    Utils.alertPopUp(JSON.stringify(remoteMessage.notification.body))
});
AppRegistry.registerComponent(appName, () => App);
