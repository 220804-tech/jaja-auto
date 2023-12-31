import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Linking, StyleSheet, Platform, Dimensions, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import { styles, Hp, Wp, colors, useNavigation, useFocusEffect, Loading, Appbar, ServiceCart, Utils } from '../../export'
import { Button, TouchableRipple } from 'react-native-paper'
import EncryptedStorage from 'react-native-encrypted-storage';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useDispatch, useSelector } from 'react-redux'
import { getDistance, getPreciseDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const reduxAuth = useSelector(state => state.auth.auth)
  const reduxUser = useSelector(state => state.user.user)
  const location = useSelector(state => state.user.user.location)
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(false)
  const [count, setcount] = useState(0)

  const reduxProfile = useSelector(state => state.user.user)

  const [navigate, setNavigate] = useState("Akun")


  useEffect(() => {
    if (reduxProfile && Object.keys(reduxProfile).length === 0) {
      getStorage()
    }
    getAccount()
  }, [props, reduxAuth, reduxProfile])

  const getStorage = () => {
    EncryptedStorage.getItem('user').then(res => {
      if (res) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(res) })
      }
    })

  }
  useFocusEffect(
    useCallback(() => {
      getItem()
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getItem().then(res => {
      setRefreshing(false)
      if (res) {
        Utils.alertPopUp('Data berhasil diupdate!')
      }

    })
    setTimeout(() => {
      setRefreshing(false)
    }, 3000);
  }, []);


  const getAccount = async () => {
    const config = {
      method: 'get',
      url: `https://jaja.id/backend/order/ListRekening?id_customer=${reduxUser.id}`,
      headers: {
        'Authorization': reduxAuth,
        'Cookie': 'ci_session=71o6pecall1g4dt83l7a6vhl4igak0ms'
      }
    };

    try {
      const response = await axios(config);

      // Axios automatically converts response data from JSON, no need to parse
      const result = response.data;
      if (result && Object.keys(result).length && result.status.code == 200) {
        setAccount(true);
      } else {
        setAccount(false);
      }
    } catch (error) {
      setAccount(false);
      Utils.handleError(error.message, "Error with status code : 12043");
    }
  };


  // const getItem = () => {
  // navigation.navigate("VerifikasiEmail", { email: user.email })
  // }

  const getItem = async () => {
    try {
      if (reduxAuth) {
        const config = {
          method: 'get',
          url: "https://jaja.id/backend/user/profile",
          headers: {
            'Authorization': reduxAuth,
            'Cookie': 'ci_session=6jh2d2a8uvcvitvneaa2t81phf3lrs3c',
          },
        };

        const response = await axios(config);
        let result = response.data;

        if (result.status.code === 200) {
          await EncryptedStorage.setItem('user', JSON.stringify(result.data));
          dispatch({ type: 'SET_USER', payload: result.data });
          dispatch({ type: 'SET_VERIFIKASI', payload: result.data.isVerified });
          setcount(count + 1);
          return true;
        } else {
          Utils.handleErrorResponse(result, 'Error with status code : 12044');
          return false;
        }
      }
    } catch (error) {
      Utils.handleError(error.message, "Error with status code : 12046");
      return false;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Jaja.id",
      "Kamu yakin ingin keluar?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",

        },
        {
          text: "Keluar", onPress: () => {
            setLoading(true)

            try {
              dispatch({ type: 'SET_NOTIF_COUNT', payload: { home: 0, chat: 0, orders: 0 } })
              EncryptedStorage.clear().then(res => {
                setTimeout(() => {
                  setLoading(false)
                  dispatch({ type: 'USER_LOGOUT' })
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Splash' }],
                  })
                }, 500);
              })
              AsyncStorage.clear()
            } catch (error) {
              setTimeout(() => {
                setLoading(false)
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Splash' }],
                })
              }, 500);
            }
          }

        }
      ]
    );


  }


  const handleDelete = async () => {
    Alert.alert(
      "HAPUS AKUN",
      "Kamu yakin ingin hapus akun ?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",

        },
        {
          text: "Hapus", onPress: () => {
            setLoading(true)
          }

        }
      ]
    );


  }

  const handleAuth = name => {
    navigation.navigate(name, { navigate: name })
  }

  const handleCategory = (value) => {
    dispatch({ type: 'SET_CATEGORY_STATUS', payload: value })
    navigation.navigate('Category');
  }

  const calculateDistance = () => {
    var dis = getDistance(
      { latitude: -4.4543, longitude: 96.1527 },
      { latitude: -6.1751, longitude: 106.9756 },
    );
    alert(
      `Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`
    );
  };

  const calculatePreciseDistance = () => {
    var pdis = getPreciseDistance(
      { latitude: -6.321586109862249, longitude: 106.87017515272444 },
      { latitude: -6.168069464610844, longitude: 107.00333140704073 },
    );
    alert(
      `Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`
    );
  };


  {/* {reduxAuth ?
    <View style={[styles.row_around_center, styles.mt_5, { width: '100%' }]}>
      <View style={[styles.column_center, { width: '50%' }]}>
        <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, textAlign: 'center' }]}>0</Text>
        <Text style={[styles.font_14, { color: colors.White }]}>Voucher</Text>
      </View>
      <View style={[styles.column_center, { width: '50%' }]}>
        <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>0</Text>
        <Text style={[styles.font_14, { color: colors.White }]}>Toko Diikuti</Text>
      </View>
    </View>
    : null} */}
  return (
    <SafeAreaView style={(styles.container, { backgroundColor: colors.BlueJaja })}>
      {loading ? <Loading /> : null}
      <Appbar title="Akun Saya" trolley={true} notif={true} />
      <View style={styles.column}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={[styles.column, { height: Hp('15%') }]}>
            <View style={[styles.column, styles.px_2]}>
              <View style={[styles.row_start, styles.p_2, styles.mb_4]}>
                <View style={{ height: Wp('19%'), width: Wp('19%'), backgroundColor: colors.White, borderRadius: 100, marginRight: '2%' }}>
                  <Image source={reduxAuth ? { uri: reduxProfile.image } : require('../../assets/images/JajaId.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 100 }} />
                </View>
                {reduxAuth ?
                  <View style={[styles.column_around_center, { height: Wp('17%'), width: Wp('60%'), alignItems: 'flex-start' }]}>
                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, width: '100%' }]}>{reduxProfile.name}</Text>
                    <View style={[styles.row_start_center, { width: '100%' }]}>
                      <TouchableRipple style={[styles.row_center, styles.mr_2, { marginTop: '-1.5%' }]}>
                        <Image source={require('../../assets/icons/coin.png')} style={styles.icon_14} />
                      </TouchableRipple>
                      <Text onPress={() => navigation.navigate(reduxAuth ? 'Reward' : 'Login')} numberOfLines={1} style={[styles.font_14, styles.mr_3, { color: colors.White }]}>{reduxProfile.coinFormat}</Text>
                    </View>
                  </View>
                  :
                  <View style={[styles.row_start, styles.mt_5, { height: Wp('17%'), width: '80%', justifyContent: 'flex-end' }]}>
                    <Button onPress={() => handleAuth('Login')} color={colors.White} mode="contained" contentStyle={{ width: Wp('31%'), height: Wp('10%') }} style={{ width: Wp('31%'), height: Wp('10%') }} labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.YellowJaja }]} uppercase={false} >
                      Login
                    </Button>
                    <Button onPress={() => handleAuth('Register')} color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('31%'), height: Wp('10%') }} style={{ marginLeft: '3%', width: Wp('31%'), height: Wp('10%') }} labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.White }]} uppercase={false} >
                      Daftar
                    </Button>
                  </View>
                }
              </View>
            </View>
          </View>
          <View style={{ flex: 0, flexDirection: 'column', zIndex: 998, backgroundColor: colors.White, height: Hp('90%'), marginTop: Hp('-1%'), borderTopRightRadius: 21, borderTopLeftRadius: 21, paddingHorizontal: '4%', paddingTop: '2%' }}>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'Account' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/customer.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4,]}>Pengaturan Akun</Text>
              {/* {!account === true ? null : <Text style={[styles.font_10, styles.T_italic, styles.ml_2, { color: colors.RedNotif }]}>( Masukkan rekening )</Text>} */}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'Address' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/google-maps.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Alamat</Text>
              {location && location.length ? null : <Text style={[styles.ml_2, { color: colors.RedNotif, fontStyle: 'italic', fontSize: 13 }]}>( Alamat belum lengkap )</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'Wishlist' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/love.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Favorit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'HistoryProduct' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/history.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Terakhir Dilihat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'Vouchers' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/coupon.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Voucher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={handleDelete}>
              <Image style={[styles.icon_21, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/close.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Hapus Akun</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => navigation.navigate(reduxAuth ? 'Reward' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/star.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Koin Jaja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, styles.mb, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={() => {
              let url = "whatsapp://send?text=" +
                'Halo, Jaja.id \n' +
                "&phone=62" + '82113840369'
              Linking.openURL(url)
                .then(data => {
                  console.log("WhatsApp Opened successfully " + data);  //<---Success
                })
                .catch(() => {
                  Utils.alertPopUp('Harap install whatsapp terlebih dahulu!')
                  setTimeout(() => {
                    Linking.openURL('https://jaja.id/bantuan/')
                  }, 1500);

                });
            }}>
              <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/service.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Pusat Bantuan</Text>

            </TouchableOpacity>



            {reduxAuth ?
              <TouchableOpacity style={[styles.row_start_center, styles.mb_5, { borderBottomWidth: 0.5, borderBottomColor: colors.Silver, }]} onPress={handleLogout}>
                <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/logout.png`)} />
                <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Keluar</Text>

              </TouchableOpacity>
              : null
            }

            {/* <TouchableWithoutFeedback style={styles.my_5} oSnPress={() => Linking.openURL("market://details?id=com.seller.jaja")}>
              <Text adjustsFontSizeToFit style={[style.font_14, style.my_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Mulai Berjualan?</Text>
            </TouchableWithoutFeedback> */}
          </View>

          {/* <TouchableWithoutFeedback onPress={() => Linking.openURL("market://details?id=com.seller.jaja")}>
          </TouchableWithoutFeedback> */}
        </ScrollView>
      </View>
    </SafeAreaView >
  );
}

const style = StyleSheet.create({
  title: {
    color: colors.BlackGrayScale,
    fontSize: Hp('2.2%'),
    marginVertical: 15,
  },
  touchIcon: { width: '14%', justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    paddingVertical: 20,
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#dddddd',
    margin: 10,
  },
});
