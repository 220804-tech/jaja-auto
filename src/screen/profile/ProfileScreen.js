import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Linking, StyleSheet, Platform, Dimensions, Image, Alert, ScrollView, RefreshControl, TouchableWithoutFeedback } from 'react-native';
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
export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const reduxAuth = useSelector(state => state.auth.auth)
  const reduxUser = useSelector(state => state.user.user)
  const location = useSelector(state => state.user.user.location)
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(false)

  const reduxProfile = useSelector(state => state.user.user)

  const [navigate, setNavigate] = useState("Akun")


  useEffect(() => {
    if (reduxProfile && Object.keys(reduxProfile).length == 0) {
      EncryptedStorage.getItem('user').then(res => {
        if (res) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(res) })
        }
      })
    }
    getAccount()
    getItem()
  }, [props, reduxAuth])

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

  const getAccount = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", reduxAuth);
    myHeaders.append("Cookie", "ci_session=71o6pecall1g4dt83l7a6vhl4igak0ms");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`https://jaja.id/backend/order/ListRekening?id_customer=${reduxUser.id}`, requestOptions)

      .then(response => response.json())
      .then(result => {
        if (result && Object.keys(result).length && result.status.code == 200) {
          setAccount(true)
        } else {
          setAccount(false)
        }
      })
      .catch(error => {
        setAccount(false)
        Utils.handleError(error, "Error with status code : 12043")
      });
  }

  // const getItem = () => {
  // navigation.navigate("VerifikasiEmail", { email: user.email })
  // }

  const getItem = async () => {
    try {
      if (reduxAuth) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=6jh2d2a8uvcvitvneaa2t81phf3lrs3c");
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        return await fetch("https://jaja.id/backend/user/profile", requestOptions)
          .then(response => response.text())
          .then(data => {
            try {
              let result = JSON.parse(data)
              if (result.status.code === 200) {
                EncryptedStorage.setItem('user', JSON.stringify(result.data))
                dispatch({ type: 'SET_USER', payload: result.data })
                dispatch({ type: 'SET_VERIFIKASI', payload: result.data.isVerified })
                return true
              } else {
                Utils.handleErrorResponse(result, 'Error with status code : 12044')
                return false
              }
            } catch (error) {
              Utils.alertPopUp(String(error) + "\n\n" + data)
              return false
            }

          })
          .catch(error => {
            return false
            Utils.handleError(error, "Error with status code : 12045")
          });
      }
    } catch (error) {
      Utils.handleError(error, "Error with status code : 12046")

    }
  }

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
                <View style={{ height: Wp('17%'), width: Wp('17%'), backgroundColor: colors.White, borderRadius: 100, marginRight: '2%' }}>
                  <Image source={reduxAuth ? { uri: reduxProfile.image } : require('../../assets/images/JajaId.png')} style={{ resizeMode: 'contain', width: '100%', height: '100%', borderRadius: 100 }} />
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
                    <Button onPress={() => handleAuth('Login')} color={colors.White} mode="contained" contentStyle={{ width: Wp('30%'), height: Wp('10%') }} style={{ width: Wp('30%'), height: Wp('10%') }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.YellowJaja }]} uppercase={false} >
                      Login
                    </Button>
                    <Button onPress={() => handleAuth('Register')} color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('30%'), height: Wp('10%') }} style={{ marginLeft: '3%', width: Wp('30%'), height: Wp('10%') }} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} uppercase={false} >
                      Daftar
                    </Button>
                  </View>
                }
              </View>
            </View>
          </View>
          <View style={{ flex: 0, flexDirection: 'column', zIndex: 998, backgroundColor: colors.White, height: Hp('90%'), marginTop: Hp('-1%'), borderTopRightRadius: 21, borderTopLeftRadius: 21, paddingHorizontal: '4%', paddingTop: '2%' }}>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'Account' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/customer.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4,]}>Pengaturan Akun</Text>
              {!account === true ? null : <Text style={[styles.font_10, styles.T_italic, styles.ml_2, { color: colors.RedNotif }]}>( Masukkan rekening )</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'Address' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/google-maps.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Alamat</Text>
              {location && location.length ? null : <Text style={[styles.ml_2, { color: colors.RedNotif, fontStyle: 'italic', fontSize: 13 }]}>( Alamat belum lengkap )</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'Wishlist' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/love.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Favorit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'HistoryProduct' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/history.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Terakhir Dilihat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'Vouchers' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/coupon.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Voucher</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => navigation.navigate(reduxAuth ? 'Reward' : 'Login')}>
              <Image style={[styles.icon_27, styles.mr_3, { tintColor: colors.BlueJaja }]} source={require(`../../assets/icons/star.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Koin Jaja</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={() => {
              Linking.canOpenURL('https://jaja.id/bantuan/').then(supported => {
                console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 82 ~ Linking.canOpenURL ~ supported", supported)
                if (supported) {
                  Linking.openURL('https://jaja.id/bantuan/')
                } else {
                  ToastAndroid.show("Sepertinya ada masalah, coba lagi nanti.", ToastAndroid.LONG, ToastAndroid.TOP)

                }
              })
            }}>
              <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/service.png`)} />
              <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Pusat Bantuan</Text>

            </TouchableOpacity>



            {reduxAuth ?
              <TouchableOpacity style={[styles.row_start_center, styles.mb_5, { borderBottomWidth: 0.3, borderBottomColor: colors.BlackGrey }]} onPress={handleLogout}>
                <Image style={[styles.icon_27, styles.mr_3]} source={require(`../../assets/icons/logout.png`)} />
                <Text style={[styles.font_14, styles.T_medium, styles.my_4]}>Keluar</Text>

              </TouchableOpacity>
              : null
            }

            <TouchableWithoutFeedback style={styles.my_5} oSnPress={() => Linking.openURL("market://details?id=com.seller.jaja")}>
              <Text adjustsFontSizeToFit style={[style.font_14, style.my_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Mulai Berjualan?</Text>
            </TouchableWithoutFeedback>
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
