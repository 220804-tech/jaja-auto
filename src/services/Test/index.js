import React, {useEffect,useState} from 'react'
import {View, StyleSheet, Text, Button,Alert,BackHandler } from 'react-native'
import {fcmService} from './src/FCMService';
//import {localNotificationService} from './src/LocalNotificationService';
import App from "./navigation";
import { store, persistor } from "app/store";
import { StatusBar,AsyncStorage,Linking  } from "react-native";
import { BaseColor } from "@config";
import { Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import I18n from "react-native-i18n";
import {DataMasterDiskon} from "@data";
import NetInfo from '@react-native-community/netinfo';
import RNExitApp from 'react-native-exit-app';
import Modal from "react-native-modal";


export default function index(props) {
  const [config, setConfig]= useState({});
  const [dataMasterDiskon, setDataMasterDiskon]=useState(DataMasterDiskon[0]);
  const [bodyNotif,setBodyNotif]=useState({});
  const [modalVisible, setModalVisible]=useState(false);
  const [modalTitle,setModalTitle]=useState('Pembayaran Berhasil');
  const [modalTitleSub,setModalTitleSub]=useState('Hore Pembayaranmu Berhasil sudah selesai');
  const {navigation} = props;
  const priceSplitter = (number) => (number && number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'));

  
  useEffect(() => {
    console.disableYellowBox = true;
    I18n.fallbacks = true;
    I18n.translations = {
            en: require("./lang/en.json"),
            ko: require("./lang/ko.json"),
            vi: require("./lang/vi.json")
    };
    StatusBar.setBackgroundColor(BaseColor.primaryColor, true);
    // StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    
    // StatusBar.setBackgroundColor("rgba(0,0,0,0)");
    // StatusBar.setTranslucent(false);
    
    
    //notification START------------------------------------------------------//
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    
    //didasable untuk ios belum dpt module
    //localNotificationService.configure(onOpenNotification)

    function onRegister(token) {
        console.log('tokenFirebases',JSON.stringify(token));
      AsyncStorage.setItem('tokenFirebase', JSON.stringify(token));
    }

    function onNotification(notify) {
          console.log("[App] onNotificationx: ", JSON.stringify(notify));
      
      var body_msg=notify.body;
      var body_array = body_msg.split("#");
      var type=body_array[0];

      if(type=='Payment'){
        var bodyNotif={
          transaction: body_array[1],
          type: body_array[2],
          id_order: body_array[3],
          id_invoice: body_array[4],
          gross_amount: body_array[5],
          transaction_id: body_array[6],
          fraud: body_array[7],
          bank: body_array[8]
        }

        // if(bodyNotif.transaction=='settlement'){
        //   setBodyNotif(bodyNotif);
        //   setModalVisible(true);
        //   setModalTitle('Pembayaran Berhasil');
        //   setModalTitleSub('Hore Pembayaranmu Berhasil sudah selesai');

        // }
      }

  
      console.log('bodyNotifonNotification',JSON.stringify(bodyNotif));
      

      const options = {
        soundName: 'default',
        playSound: true //,
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      }

      //didisable karena belum dpt module di ios
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify) {
    }
    
     //-------------------------------update version-------------------------------//

    //  VersionCheck.getCountry()
    //     .then(country => console.log(country));          // KR
    //     console.log(VersionCheck.getPackageName());        // com.reactnative.app
    //     console.log(VersionCheck.getCurrentBuildNumber()); // 10
    //     console.log(VersionCheck.getCurrentVersion());     // 0.1.1

    //   VersionCheck.getLatestVersion()
    //     .then(latestVersion => {
    //       console.log(latestVersion);    // 0.1.2
    //     });

    //   VersionCheck.getLatestVersion({
    //       provider: 'appStore'  // for iOS
    //     })
    //     .then(latestVersion => {
    //       console.log(latestVersion);    // 0.1.2
    //     });

    //   VersionCheck.getLatestVersion({
    //       provider: 'playStore'  // for Android
    //     })
    //     .then(latestVersion => {
    //       console.log(latestVersion);    // 0.1.2
    //     });

    //   VersionCheck.getLatestVersion()    // Automatically choose profer provider using `Platform.select` by device platform.
    //     .then(latestVersion => {
    //       console.log(latestVersion);    // 0.1.2
    //     });

        


      

      // VersionCheck.needUpdate()
      //   .then(async res => {
      //     if (res.isNeeded) {
      //       Alert.alert(
      //         'Versi baru telah tersedia',
      //         'Silakan memperbarui aplikasi masterdiskon untuk menikmati fitur baru dan pengalaman aplikasi yang lebih baik',
      //         [
      //           {text: 'Tidak sekarang', onPress: () => RNExitApp.exitApp()},
      //           {text: 'Perbarui sekarang', onPress: () => Linking.openURL(res.storeUrl)},
      //         ]
      //       );
      //     }


      //   });

    //-------------------------------update version-------------------------------//

    return () => {
      //console.log("[App] unRegister")
      fcmService.unRegister()

      //didisable karena blm dapet module di ios
      localNotificationService.unregister()
    }

  }, [])

  return (
  
                  <Provider store={store}>
                      <PersistGate loading={null} persistor={persistor}>
                          <App />
                     </PersistGate>
                  </Provider>
  )

}

