import React, { useEffect, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, Text, View, ImageBackground } from 'react-native'
import { Button, Paragraph } from 'react-native-paper'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { useDispatch, useSelector } from 'react-redux'
import Products from '../../components/Store/StoreProducts/StoreProducts'
import MainPage from '../../components/Store/MainPage/MainPage'
import Posts from '../../components/Store/Posts'
import { colors, Loading, ServiceCart, ServiceStore, styles, useNavigation, Wp, AppbarSecond } from '../../export'
const initialLayout = { width: Dimensions.get('window').width };
const layout = Dimensions.get('screen').height

export default function StoreScreen() {
    const navigation = useNavigation();
    const reduxStore = useSelector(state => state.store.store)
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const greeting = useSelector(state => state.store.store.description)

    console.log("🚀 ~ file: StoreScreen.js ~ line 12121 ~ StoreScreen ~ reduxStore", reduxAuth)
    const reduxStoreProduct = useSelector(state => state.store.storeProduct)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("first")
    const [seller, setSeller] = useState("")
    const [index, setIndex] = useState(0)

    useEffect(() => {
        console.log('lllllllllllllllllllllllllllllllll', StatusBar.currentHeight)
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
            { key: 'first', title: 'Halaman Toko' },
            { key: 'second', title: 'Produk' },
            { key: 'third', title: 'Kategori' },

        ]);

        const renderScene = SceneMap({
            first: MainPage,
            second: Products,
            third: Posts,
        });

    const handleSearch = (text) => {
        if (text && text !== " " && text !== "  " && text !== "   " && text !== "    " && text !== "     ") {
            setLoading(true)
            let obj = {
                slug: reduxStore.slug,
                page: 1,
                limit: 10,
                keyword: text,
                price: '',
                condition: '',
                preorder: '',
                brand: '',
                sort: '',
            }
            ServiceStore.getStoreProduct(obj).then(res => {
                setTimeout(() => setLoading(false), 1000);
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
                // translucent={true}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            />
            <View style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
                {/* <ImageBackground source={image && image.mainBanner ? { uri: image.mainBanner } : null} style={{ width: '100%', height: '100%' }}> */}
                <AppbarSecond handleSearch={handleSearch} title={reduxStore && Object.keys(reduxStore).length && reduxStore.name ? `Cari di ${reduxStore.name}..` : 'Cari di toko..'} />


                {loading ? <Loading /> : null}
                <View style={[styles.column, styles.p_4, { width: Wp('100%'), backgroundColor: colors.White }]}>
                    <View style={styles.row_between_center}>
                        {Object.keys(reduxStore).length !== 0 ?
                            <View style={styles.row_start_center}>
                                <View style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: '5%', borderWidth: 0.5, borderColor: '#f5f5f5', backgroundColor: colors.White }}>
                                    <Image source={{ uri: reduxStore.image.profile ? reduxStore.image.profile : null }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 5 }} />
                                </View>
                                <View style={[styles.column_start, { height: Wp('15%') }]}>
                                    <Text style={[styles.font_14, { color: colors.BlackGrayScale, fontFamily: 'Poppins-SemiBold', marginBottom: '3%' }]}>{reduxStore.name}</Text>
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
                    </View>
                    {/* {greeting ?
                        <View style={[styles.py_5, styles.px_2, { width: Wp('100%'), backgroundColor: colors.White, alignItems: 'center' }]}>
                            <Paragraph style={[styles.font_13]}><Text style={[styles.font_18, styles.T_italic, { color: colors.Black }]}>"</Text>{greeting} Sint irure et quis amet reprehenderit esse laborum anim incididunt. Esse officia magna dolore irure consequat. Magna consectetur magna adipisicing mollit.<Text style={[styles.font_18, styles.T_italic, { color: colors.Black }]}>"</Text></Paragraph>
                        </View>
                        : null} */}
                </View>
                {/* </ImageBackground> */}

                <View style={[styles.container, { width: Wp('100%'), backgroundColor: colors.WhiteGrey }]}>
                    <TabView
                        tabBarPosition="top"
                        indicatorStyle={{ backgroundColor: 'white' }}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                        style={{ width: '100%', height: '100%' }}

                        renderTabBar={props => (
                            <TabBar
                                {...props}
                                indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                                // bounces={true}
                                scrollEnabled={true}
                                contentContainerStyle={{ padding: 0, height: '100%' }}
                                style={{ backgroundColor: colors.White, width: Wp('100%') }}
                                tabStyle={{ width: Wp('33.33%'), height: '100%', padding: 0 }} // here
                                renderLabel={({ route, focused, color }) => {
                                    return (
                                        <View style={[styles.row_center, { width: Wp('33.3%'), minHeight: Wp('11%') }]}>
                                            {/* <Image style={[styles.icon_25, { tintColor: focused ? colors.BlueJaja : colors.BlackSilver }]} source={route.title == 'Halaman Toko' ? require('../../assets/icons/store.png') : route.title == 'Produk' ? require('../../assets/icons/goods.png') : require('../../assets/icons/store.png')} /> */}
                                            <Text style={[styles.font_12, styles.medium, { textAlign: 'center', color: focused ? colors.BlueJaja : colors.BlackGrayScale }]}>{route.title}</Text>
                                        </View>
                                    )
                                }}
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView >
    )
}

