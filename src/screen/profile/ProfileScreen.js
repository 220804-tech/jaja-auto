import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Linking, StyleSheet, Platform, Dimensions, Image, Alert } from 'react-native';
import { styles, Hp, Wp, colors, useNavigation, useFocusEffect, Loading, Appbar, ServiceCart } from '../../export'
import { Button } from 'react-native-paper'
import EncryptedStorage from 'react-native-encrypted-storage';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import { useDispatch, useSelector } from 'react-redux'

export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const reduxAuth = useSelector(state => state.auth.auth)
  const location = useSelector(state => state.user.user.location)

  const [auth, setAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const reduxBadges = useSelector(state => state.user.badges)
  const reduxProfile = useSelector(state => state.user.user)


  const [navigate, setNavigate] = useState("Akun")


  useEffect(() => {
    if (Object.keys(reduxProfile).length === 0) {
      console.log("🚀 ~ file: ProfileScreen.js ~ line 31 ~ useEffect ~ reduxProfile", reduxProfile)
      EncryptedStorage.getItem('user').then(res => {
        console.log("🚀 ~ file: ProfileScreen.js ~ line 2000 ~ EncryptedStorage.getItem ~ res", res)
        if (res) {
          console.log("🚀 ~ file: ProfileScreen.js ~ line 33 ~ EncryptedStorage.getItem ~ res", res)
          dispatch({ type: 'SET_USER', payload: JSON.parse(res) })
        }
      })

    }
    EncryptedStorage.getItem('token').then(res => {
      console.log("🚀 ~ file: ProfileScreen.js ~ line 42 ~ EncryptedStorage.getItem ~ res", res)
      if (res) {
        setAuth(JSON.stringify(res))
      }
    })
    getItem()
    // if (!reduxAuth) {
    //   handleAuth('Login')
  }, [props, reduxAuth])

  useFocusEffect(
    useCallback(() => {
      getItem()
    }, []),
  );


  const getItem = () => {

    // navigation.navigate("VerifikasiEmail", { email: user.email })

    console.log("🚀 ~ file: ProfileScreen.js ~ line 69 ~ getItem ~ reduxAuth", reduxAuth)
    setAuth(reduxAuth)
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

  const handleCart = () => {
    ServiceCart.getCart(auth).then(res => {
      if (res) {
        dispatch({ type: 'SET_CART', payload: res })
      }
    })
    navigation.navigate("Trolley")
  }
  const handleAuth = name => {
    navigation.navigate(name, { navigate: name })
  }

  const handleCategory = (value) => {
    dispatch({ type: 'SET_CATEGORY_STATUS', payload: value })
    navigation.navigate('Category');
  }

  return (

    <SafeAreaView style={(styles.container, { backgroundColor: colors.BlueJaja })}>
      {loading ? <Loading /> : null}
      <View style={styles.column}>
        <View style={[styles.column, { height: Hp('22%') }]}>
          <Appbar title="Akun Saya" trolley={true} notif={true} />
          <View style={[styles.column, styles.px_2]}>
            <View style={[styles.row_start, styles.p_2, styles.mb_4]}>
              <View style={{ height: Wp('17%'), width: Wp('17%'), backgroundColor: colors.White, borderRadius: 100, marginRight: '2%' }}>
                <Image source={reduxAuth ? { uri: reduxProfile.image } : require('../../assets/images/JajaId.png')} style={{ resizeMode: 'contain', width: '100%', height: '100%', borderRadius: 100 }} />
              </View>
              {reduxAuth ?
                <View style={[styles.column_around_center, { height: Wp('17%'), width: Wp('60%'), alignItems: 'flex-start' }]}>
                  <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, width: '100%' }]}>{reduxProfile.name}</Text>
                  <View style={[styles.row_start_center, { width: '100%' }]}>
                    <Text numberOfLines={1} style={[styles.font_14, styles.mr_3, { color: colors.White }]}>{reduxProfile.coin}</Text>
                    <Image source={require('../../assets/icons/coin.png')} style={styles.icon_14} />
                  </View>
                </View>
                :
                <View style={[styles.row_start, styles.mt_5, { height: Wp('17%'), width: '80%', justifyContent: 'flex-end' }]}>
                  <Button onPress={() => handleAuth('Login')} color={colors.White} mode="contained" contentStyle={{ width: Wp('25%'), height: Wp('9%') }} style={{ width: Wp('25%'), height: Wp('9%') }} labelStyle={{ color: colors.YellowJaja, fontSize: 13 }} uppercase={false} >
                    Login
                  </Button>
                  <Button onPress={() => handleAuth('Register')} color={colors.YellowJaja} mode="contained" contentStyle={{ width: Wp('25%'), height: Wp('9%') }} style={{ marginLeft: '3%', width: Wp('25%'), height: Wp('9%') }} labelStyle={{ color: colors.White, fontSize: 13 }} uppercase={false} >
                    Daftar
                  </Button>
                </View>
              }
            </View>
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
          </View>
        </View>
        <View style={{ flex: 0, flexDirection: 'column', zIndex: 998, backgroundColor: colors.White, height: Hp('85%'), marginTop: Hp('-1%'), borderTopRightRadius: 21, borderTopLeftRadius: 21, paddingHorizontal: '4%', paddingTop: '2%' }}>
          {/* <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate('Address')}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="map-pin" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}>  Alamat </Text>
                </View>
              </TouchableOpacity> */}
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'Account' : 'Login')}>
            {/* <FAIcon name="user" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} /> */}
            <Image style={{ width: 27, height: 27, marginRight: '3%' }} source={require(`../../assets/icons/customer.png`)} />
            <Text style={style.title}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'Address' : 'Login')}>
            {/* <FAIcon name="user" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} /> */}
            <Image style={{ width: 27, height: 27, marginRight: '3%', tintColor: colors.BlueJaja }} source={require(`../../assets/icons/google-maps.png`)} />
            <Text style={style.title}>Alamat</Text>
            {location && location.length ? null : <Text style={[styles.ml_2, { color: colors.RedNotif, fontStyle: 'italic', fontSize: 13 }]}>( Alamat belum lengkap )</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'Wishlist' : 'Login')}>
            <Image style={{ width: 27, height: 27, marginRight: '3%', tintColor: colors.BlueJaja }} source={require(`../../assets/icons/love.png`)} />
            <Text style={style.title}>Favorit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'HistoryProduct' : 'Login')}>
            <Image style={{ width: 27, height: 27, marginRight: '3%', tintColor: colors.BlueJaja }} source={require(`../../assets/icons/history.png`)} />
            <Text style={style.title}>Terakhir Dilihat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'Vouchers' : 'Login')}>
            <Image style={{ width: 27, height: 27, marginRight: '3%', tintColor: colors.BlueJaja }} source={require(`../../assets/icons/coupon.png`)} />
            <Text style={style.title}>Voucher</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate(reduxAuth ? 'Reward' : 'Login')}>
            <Image style={{ width: 27, height: 27, marginRight: '3%', tintColor: colors.BlueJaja }} source={require(`../../assets/icons/star.png`)} />
            <Text style={style.title}>Reward</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={handleCart}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="user" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Favorit </Text>
                </View>
              </TouchableOpacity> */}
          {/* <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => nva}>
              <View style={{ flexDirection: 'row' }}>
                <FAIcon name="bars" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                <Text style={style.title}> Pesanan Saya </Text>
              </View>
            </TouchableOpacity> */}
          <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={() => {
            Linking.canOpenURL('https://jaja.id/bantuan/').then(supported => {
              console.log("🚀 ~ file: OrderDetailsScreen.js ~ line 82 ~ Linking.canOpenURL ~ supported", supported)
              if (supported) {
                Linking.openURL('https://jaja.id/bantuan/')
              } else {
                ToastAndroid.show("Sepertinya ada masalah, coba lagi nanti.", ToastAndroid.LONG, ToastAndroid.TOP)

              }
            })
          }}>
            {/* <FAIcon name="cog" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} /> */}
            <Image style={{ width: 27, height: 27, marginRight: '3%' }} source={require(`../../assets/icons/service.png`)} />
            <Text style={style.title}>Pusat Bantuan</Text>

          </TouchableOpacity>
          {reduxAuth ?
            <TouchableOpacity style={[styles.row_start_center, { borderBottomWidth: 0.3 }]} onPress={handleLogout}>
              {/* <FAIcon name="cog" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} /> */}
              <Image style={{ width: 27, height: 27, marginRight: '3%' }} source={require(`../../assets/icons/logout.png`)} />
              <Text style={style.title}>Keluar</Text>

            </TouchableOpacity>
            : null
          }
        </View>
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
});
