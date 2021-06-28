import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, StatusBar, Dimensions, ScrollView } from 'react-native'
import { styles, colors, Wp, Hp, useNavigation, ServiceStore, Loading, ServiceCart } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Paragraph } from 'react-native-paper'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const initialLayout = { width: Dimensions.get('window').width };
import MainPage from '../../components/Store/MainPage'
import Posts from '../../components/Store/Posts'
import Products from '../../components/Store/AllProducts'
const layout = Dimensions.get('screen').height
export default function StoreScreen() {
    const navigation = useNavigation();
    const reduxStore = useSelector(state => state.store.store)
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)

    console.log("🚀 ~ file: StoreScreen.js ~ line 12121 ~ StoreScreen ~ reduxStore", reduxAuth)
    const reduxStoreProduct = useSelector(state => state.store.storeProduct)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("first")
    const [seller, setSeller] = useState("")
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (reduxStore) {
            let dataSeller = {
                name: reduxStore.name,
                chat: reduxUser.user.uid + reduxStore.uid,
                id: reduxStore.uid
            }
            console.log(dataSeller, " qwqwq");
            setSeller(dataSeller)
        }
    }, [reduxStoreProduct, reduxStore])

    const [routes] = useState([
        { key: 'first', title: 'Halaman Utama' },
        // { key: 'second', title: 'Semua Produk' },
        // { key: 'third', title: 'Postingan' },

    ]);

    const renderScene = SceneMap({
        first: MainPage,
        second: Products,
        third: Posts,
    });

    const handleSearch = (text) => {
        console.log("🚀 ~ file: StoreScreen.js ~ line 43 ~ handleSearch ~ text", text)
        if (text !== " " && text !== "  " && text !== "   " && text !== "    " && text !== "     ") {
            setLoading(true)
            ServiceStore.getStoreProduct(reduxStore.slug, text, "", "", "", "", "").then(res => {
                setTimeout(() => setLoading(false), 1000);
                console.log("🚀 ~ file: StoreScreen.js ~ line 46 ~ ServiceStore.getStoreProduct ~ res", res)
                if (res) {
                    dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
                }
            })
        }
    }
    const handleChat = () => {
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: seller, product: null })
        } else {
            navigation.navigate('Login', { navigate: "Store" })
        }
    }

    const handleGetCart = () => {
        if (reduxAuth) {
            ServiceCart.getCart(reduxAuth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_CART', payload: res })

                }
            })
            navigation.navigate("Trolley")
        } else {
            navigation.navigate("Login")
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            />
            <View style={[styles.appBar, { flex: 0, height: Hp('6.5%'), backgroundColor: colors.BlueJaja }]}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={[styles.appBarButton, { tintColor: colors.White }]} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%' }]}>
                    <View style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]}>
                        <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                        <TextInput keyboardType="name-phone-pad" returnKeyType="search" adjustsFontSizeToFit style={styles.font_14} placeholder='Cari di toko..' onSubmitEditing={(value) => handleSearch(value.nativeEvent.text)}></TextInput>
                    </View>
                    {/* <TouchableOpacity onPress={() => setFilter(true) & actionSheetRef.current?.setModalVisible()} style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '1%', backgroundColor: colors.BlueJaja, height: '100%', width: '15%', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                        <Image source={require('../../assets/icons/filter.png')} style={[styles.icon_25, { tintColor: colors.White }]} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.column, styles.mx_3]} onPress={() => handleGetCart()}>
                        <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                        {Object.keys(reduxUser.badges).length && reduxUser.badges.totalProductInCart ?
                            <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.badges.totalProductInCart >= 100 ? "99+" : reduxUser.badges.totalProductInCart}</Text></View>
                            : null
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={{ flex: 1, height: Hp('100%') }}> */}
            <View style={{ flex: 1 }}>
                {/* <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }}> */}
                {loading ? <Loading /> : null}
                {/* <ScrollView contentContainerStyle={{ height: Hp('100%') }}> */}
                <View style={[styles.column, styles.p_4, { backgroundColor: colors.White, elevation: 3, width: Wp('100%') }]}>
                    <View style={styles.row_between_center}>
                        {Object.keys(reduxStore).length !== 0 ?
                            <View style={styles.row_start_center}>
                                <View style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: '5%', borderWidth: 0.5, borderColor: '#f5f5f5', backgroundColor: colors.White }}>
                                    <Image source={{ uri: reduxStore.image.profile ? reduxStore.image.profile : null }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 5 }} />
                                </View>
                                <View style={[styles.column_start, { height: Wp('15%') }]}>
                                    <Text style={[styles.font_14, { color: colors.BlackGrayScale, fontWeight: 'bold', marginBottom: '3%' }]}>{reduxStore.name}</Text>
                                    <Text style={[styles.font_12, { color: colors.BlackGrayScale, marginBottom: '3%' }]}>{reduxStore.location.city}</Text>
                                    {reduxStore.rating !== "0.0" ?
                                        <View style={styles.row_center}>
                                            <Text style={[styles.font_14, { color: colors.BlackGrayScale }]}>{reduxStore.rating} </Text>
                                            <Image source={require('../../assets/icons/star.png')} style={[styles.icon_14, { tintColor: colors.YellowJaja }]} />
                                        </View>
                                        :
                                        <View style={styles.row_center}>
                                        </View>}
                                </View>
                            </View>
                            : null
                        }
                        <Button onPress={handleChat} mode="contained" icon="chat" labelStyle={{ fontSize: 12, color: colors.White }} color={colors.BlueJaja} >
                            Chat
                        </Button>
                        {/* <Button mode="contained" icon="plus" labelStyle={{ fontSize: 12 }} >
                                Ikuti
                            </Button> */}
                    </View>
                    {reduxStore.greeting ?
                        <View style={[styles.pt_2]}>
                            <Paragraph style={styles.font_13}>{reduxStore.greeting}</Paragraph>
                        </View>
                        : null}

                </View>
                <View style={[{ flex: 1, backgroundColor: colors.White }]}>
                    <MainPage />
                    {/* <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={initialLayout}
                            renderTabBar={props => (
                                <TabBar
                                    indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                                    {...props}
                                    bounces={true}
                                    scrollEnabled={true}
                                    style={{ backgroundColor: 'white', width: '100%', paddingHorizontal: '1%' }}
                                    tabStyle={{ minHeight: 50, flex: 0, width: Wp('33.3%'), borderRightColor: 'grey' }} // here
                                    renderLabel={({ route, focused, color }) => {
                                        return (
                                            <Text style={{ color: colors.BlackGrayScale, fontSize: 10, width: 100, textAlign: 'center' }}>{route.title}</Text>
                                        )
                                    }}
                                />
                            )}
                        /> */}
                </View>
                {/* </ScrollView> */}
            </View>
            {/* </View> */}
        </SafeAreaView >
    )
}
