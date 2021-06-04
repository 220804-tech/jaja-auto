import React, { useEffect, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, Image, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { styles, Hp, Wp, colors, useNavigation, useFocusEffect, Loading, Appbar, ServiceCart } from '../../export'
import EncryptedStorage from 'react-native-encrypted-storage';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;
import AuthLogin from '../login/LoginScreen'
import { useDispatch, useSelector } from 'react-redux'

export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const reduxAuth = useSelector(state => state.auth)

  const [auth, setAuth] = useState(true)
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
    getItem()
  }, [props])

  useFocusEffect(
    useCallback(() => {
      getItem()
    }, []),
  );



  const handleAuth = () => {
    setAuth(true)
  }
  const getItem = () => {

    // navigation.navigate("VerifikasiEmail", { email: user.email })

    console.log("🚀 ~ file: ProfileScreen.js ~ line 69 ~ getItem ~ reduxAuth", reduxAuth.auth)
    setAuth(reduxAuth.auth)
  }

  const handleLogout = async () => {
    Alert.alert(
      "Jaja.id",
      "Kamu yakin ingin keluar?",
      [
        {
          text: "Kembali",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Keluar", onPress: () => {
            setLoading(true)

            try {
              EncryptedStorage.clear().then(res => {
                setTimeout(() => {
                  setLoading(false)
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

  return (
    <>
      {loading ? <Loading /> : null}
      {!reduxAuth.auth ?
        <AuthLogin navigate={navigate ? navigate : null} auth={handleAuth} />
        :
        <SafeAreaView style={(styles.container, { backgroundColor: colors.BlueJaja })}>
          <View style={styles.column}>
            <View style={[styles.column, { height: Hp('33%'), }]}>
              <View style={[styles.appBar, { alignItems: 'flex-start', paddingTop: Hp('2%') }]}>
                <Text style={[styles.font_16, { fontWeight: 'bold', color: colors.White }]}>Akun Saya</Text>
                <TouchableOpacity style={style.touchIcon} onPress={handleCart}>
                  <Image source={require('../../assets/icons/cart.png')} style={{ width: 24, height: 24, marginRight: '3%', tintColor: colors.White }} />
                  {Object.keys(reduxBadges).length && reduxBadges.totalProductInCart ?
                    <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxBadges.totalProductInCart >= 100 ? "99+" : reduxBadges.totalProductInCart}</Text></View>
                    : null
                  }
                </TouchableOpacity>
              </View>
              <View style={[styles.column, styles.px_2]}>
                <View style={[styles.row, styles.p_2, styles.mb_4]}>
                  <View style={{ height: Wp('17%'), width: Wp('17%'), backgroundColor: colors.Silver, borderRadius: 100, marginRight: '2%' }}>
                    <Image source={{ uri: reduxProfile.image }} style={{ width: '100%', height: '100%', borderRadius: 100 }} />
                  </View>
                  <View style={[styles.column_around_center, { height: Wp('17%'), width: Wp('60%'), alignItems: 'flex-start' }]}>
                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, width: '100%' }]}>{reduxProfile.name}</Text>
                    <View style={[styles.row_start_center, { width: '100%' }]}>
                      <Text numberOfLines={1} style={[styles.font_14, styles.mr_3, { color: colors.White }]}>{reduxProfile.coin}</Text>
                      <Image source={require('../../assets/icons/coin.png')} style={styles.icon_14} />
                    </View>
                  </View>
                </View>
                <View style={[styles.row_around_center, styles.mt_5, { width: '100%' }]}>
                  <View style={[styles.column_center, { width: '50%' }]}>
                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, textAlign: 'center' }]}>0</Text>
                    <Text style={[styles.font_14, { color: colors.White }]}>Voucher</Text>
                  </View>
                  <View style={[styles.column_center, { width: '50%' }]}>
                    <Text numberOfLines={1} style={[styles.font_14, { color: colors.White, alignSelf: 'center', textAlign: 'center' }]}>0</Text>
                    <Text style={[styles.font_14, { color: colors.White }]}>Toko Diikuti</Text>
                  </View>
                  {/* <View style={styles.column_center}>
                  <Text style={[styles.font_14, { color: colors.White }]}>0</Text>
                  <Text style={[styles.font_14, { color: colors.White }]}>Voucher Kamu</Text>
                </View> */}
                </View>
              </View>
            </View>
            <View style={{ flex: 0, flexDirection: 'column', zIndex: 9999, backgroundColor: colors.White, height: Hp('67%'), marginTop: Hp('-1%'), borderTopRightRadius: 21, borderTopLeftRadius: 21, paddingHorizontal: '4%', paddingTop: '2%' }}>
              <TouchableOpacity style={[styles.row, { borderBottomWidth: 0.3 }]} onPress={() => navigation.navigate('Account')}>
                <FAIcon name="user" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                <Text style={style.title}> Profile </Text>

              </TouchableOpacity>
              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate('Address')}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="map-pin" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}>  Alamat </Text>
                </View>
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
              <TouchableOpacity style={{ borderBottomWidth: 0.3, flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => navigation.navigate('CustomerService')}>
                <FAIcon name="cog" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                <Text style={style.title}> Pusat Bantuan </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={handleLogout}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="sign-out" size={27} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Keluar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView >

      }
      {/* <View
            style={{
              height: 60,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 20,
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                flex: 2,
                color: 'white',
                fontSize: Hp('2.5%'),
                fontWeight: 'bold',
              }}>
              {'AKUN SAYA'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <TouchableOpacity
                onPress={() => nav.navigate('Cart')}
                style={{ width: 50, alignSelf: 'center' }}>
                <FeatherIcon
                  style={{
                    flex: 2,
                    color: 'white',
                    fontSize: Hp('3%'),
                    fontWeight: 'bold',
                  }}
                  name={'shopping-cart'}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 99,
                    borderRadius: 5,
                    width: Hp('2.3%'),
                    height: Hp('2.3%'),
                    backgroundColor: colors.RedFlashsale,
                  }}>
                  <Text style={{ color: 'white', fontSize: Hp('1.5%') }}>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <View style={{ marginVertical: 25, marginHorizontal: 20 }}>
              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Splash")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Pesanan Saya </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Favorit Saya </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Voucher Saya </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Koin JAJA </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Pengaturan Akun </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Pusat Bantuan </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={() => navigation.navigate("Search")}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}> Chat dengan JAJA </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ borderBottomWidth: 0.3 }} onPress={handleLogout}>
                <View style={{ flexDirection: 'row' }}>
                  <FAIcon name="rocket" size={30} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                  <Text style={style.title}>Logout </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView> */}
    </>
  );
}

const style = StyleSheet.create({
  title: {
    marginLeft: 15,
    color: colors.BlackGrayScale,
    fontSize: Hp('2.2%'),
    marginVertical: 15,
  },
  touchIcon: { width: '14%', justifyContent: 'center', alignItems: 'center' },
});
