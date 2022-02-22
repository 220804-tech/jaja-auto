import React, { useEffect, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, Text, View, TouchableOpacity, Platform, ImageBackground } from 'react-native'
import { Button, Paragraph } from 'react-native-paper'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import { useDispatch, useSelector } from 'react-redux'
import Products from '../../components/Store/StoreProducts/StoreProducts'
import MainPage from '../../components/Store/MainPage/MainPage'
// import Posts from '../../components/Store/Posts'
import { colors, Loading, ServiceCart, ServiceStore, styles, useNavigation, Wp, AppbarSecond, Hp, } from '../../export'
const initialLayout = { width: Dimensions.get('window').width };
const layout = Dimensions.get('screen').height
import database from "@react-native-firebase/database";

export default function StoreScreen({ route }) {
    const navigation = useNavigation();
    const reduxStore = useSelector(state => state.store.store)
    const reduxUser = useSelector(state => state.user)
    const reduxAuth = useSelector(state => state.auth.auth)
    const greeting = useSelector(state => state.store.store.greeting)

    const reduxStoreProduct = useSelector(state => state.store.storeProduct)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("first")
    const [seller, setSeller] = useState("")
    const [count, setcount] = useState(0)
    const [index, setIndex] = useState(0)
    const [deskripsiLenght, setdeskripsiLenght] = useState(100)
    const loadStore = useSelector(state => state.store.loadStore)
    const reduxnotifCount = useSelector(state => state.notification.notifCount)

    useEffect(() => {
        handleProduct()
    }, [])

    const handleProduct = () => {
        dispatch({ type: 'SET_NEW_PRODUCT', payload: [] })
        dispatch({ type: 'SET_STORE_PRODUCT', payload: [] })
        dispatch({ "type": 'STORE_PRODUCT_LOADING', payload: true })
        let obj = {
            slug: route.params.slug,
            page: 1,
            limit: 100,
            keyword: '',
            price: '',
            condition: '',
            preorder: '',
            brand: '',
            sort: 'produk.id_produk-desc'
        }
        ServiceStore.getProductStore(obj, dispatch, true).then(res => {
            dispatch({ "type": 'SET_NEW_PRODUCT_LOAD', payload: false })
        })
        obj.sort = ''
        obj.limit = 100
        ServiceStore.getProductStore(obj, dispatch, false).then(res => {
            dispatch({ "type": 'STORE_PRODUCT_LOADING', payload: false })
        })
    }

    useEffect(() => {
        if (reduxStore?.uid) {
            let dataSeller = {
                name: reduxStore.name,
                chat: reduxUser.user.uid + reduxStore.uid,
                id: reduxStore.uid
            }
            setSeller(dataSeller)
        }
        return () => {

        }

    }, [reduxStore?.uid])

    const [routes] = useState([
        { key: 'first', title: 'Halaman Toko' },
        { key: 'second', title: 'Produk' },
        // { key: 'third', title: 'Kategori' },

    ]);

    const renderScene = SceneMap({
        first: MainPage,
        second: Products,
        // third: Posts,
    });

    const handleSubmit = (text) => {
        console.log("🚀 ~ file: StoreScreen.js ~ line 82 ~ handleSearch ~ text", text)
        dispatch({ "type": 'SET_STORE_KEYWORD', payload: text })
        if (text && text !== " " && text !== "  " && text !== "   " && text !== "    " && text !== "     ") {
            setIndex(1)
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

            ServiceStore.getProductStore(obj, dispatch, false)
        }
    }
    const handleChat = () => {
        if (reduxAuth) {
            navigation.navigate("IsiChat", { data: seller, product: null })
            setTimeout(() => {
                try {
                    let newItem = seller
                    newItem.amount = 0
                    database().ref('friend/' + reduxUser.uid + "/" + seller.id).set(newItem);
                } catch (error) {
                }

            }, 500);
        } else {
            navigation.navigate('Login', { navigate: "Store" })
        }
    }

    const handleSearch = () => {
        console.log('text');
    }


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : colors.White }]}>
            <StatusBar
                translucent={false}
                // animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            />
            {loading || loadStore ? <Loading /> : null}
            <View style={[styles.container]}>
                {/* <ImageBackground source={image && image.mainBanner ? { uri: image.mainBanner } : null} style={{ width: '100%', height: '100%' }}> */}
                <AppbarSecond handleSearch={handleSearch} handleSubmit={handleSubmit} title={reduxStore && Object.keys(reduxStore).length && reduxStore.name ? `Cari di ${reduxStore.name}..` : 'Cari di toko..'} />
                <ScrollView nestedScrollEnabled={true} >

                    {/* stickyHeaderIndices={[0]} */}
                    {index === 0 ?
                        <View style={[styles.column, styles.px_4, styles.pt_4, styles.pb, { width: Wp('100%'), backgroundColor: colors.White }]}>
                            <View style={styles.row_between_center}>
                                {Object.keys(reduxStore).length !== 0 ?
                                    <View style={styles.row_start_center}>
                                        <View style={{ width: Wp('14.5%'), height: Wp('14.5%'), borderRadius: 5, marginRight: '5%', borderWidth: 0.5, borderColor: colors.Silver, backgroundColor: colors.White, alignItems: 'center', justifyContent: 'center' }}>
                                            {reduxStore.image.profile ?
                                                <Image source={{ uri: reduxStore.image.profile ? reduxStore.image.profile : null }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 5 }} />
                                                :
                                                <Text style={[styles.font_26, styles.T_semi_bold, { color: colors.BlueJaja, alignSelf: 'center', marginBottom: Platform.OS === 'android' ? '-1%' : 0 }]}>{String(reduxStore.name).slice(0, 1)}</Text>
                                            }
                                        </View>
                                        <View style={[styles.column_around_center, { height: Wp('14.5%'), alignItems: 'flex-start' }]}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.font_12, { color: colors.BlackGrayScale, fontFamily: 'Poppins-SemiBold', marginBottom: '3%', width: '100%' }]}>{reduxStore.name}</Text>
                                            <Text adjustsFontSizeToFit style={[styles.font_11, { color: colors.BlackGrayScale, marginBottom: '3%' }]}>{reduxStore.location.city}</Text>
                                            {reduxStore.rating !== "0.0" ?
                                                <View style={styles.row_center}>
                                                    <Text style={[styles.font_12, { color: colors.BlackGrayScale }]}>{reduxStore.rating} </Text>
                                                    <Image source={require('../../assets/icons/star.png')} style={[styles.icon_14, { tintColor: colors.YellowJaja }]} />
                                                </View>
                                                :
                                                <View style={styles.row_center}>
                                                </View>}
                                        </View>
                                    </View>
                                    : null
                                }
                                <Button disabled={seller?.id ? false : true} onPress={handleChat} mode="contained" icon="chat" labelStyle={[styles.font_11, styles.T_semi_bold, { color: colors.White }]} color={colors.BlueJaja} >
                                    Chat
                                </Button>
                            </View>
                            {greeting ?
                                <View style={[styles.py_3, { backgroundColor: colors.White, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={[styles.font_12, { color: colors.BlackGrayScale }]}>{String(greeting).slice(0, 150)}</Text>
                                    {/* {greeting ?
                                <>
                                    <View style={[styles.column, { width: '98%' }]}>
                                        <Text style={[styles.font_12, { color: colors.BlackGrayScale }]}>{String(greeting).slice(0, deskripsiLenght)}</Text>
                                        {deskripsiLenght == 100 && String(greeting).length >= 100 ?
                                            <TouchableOpacity onPress={() => setdeskripsiLenght(String(greeting).length + 100)}>
                                                <Text style={[styles.font_13, { color: colors.BlueJaja }]}>Baca selengkapnya..</Text>
                                            </TouchableOpacity>
                                            : deskripsiLenght < 100 ? null :
                                                <TouchableOpacity onPress={() => setdeskripsiLenght(100)}>
                                                    <Text style={[styles.font_13, { color: colors.BlueJaja }]}>Baca lebih sedikit</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </>
                                : null} */}
                                </View>
                                : null}
                        </View>
                        : null
                    }
                    {/* </ImageBackground> */}

                    <View style={[{ width: Wp('100%'), height: Hp('100%'), backgroundColor: colors.WhiteGrey }]}>
                        <TabView
                            tabBarPosition="top"
                            indicatorStyle={{ backgroundColor: 'white' }}
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            onIndexChange={setIndex}
                            initialLayout={initialLayout}
                            style={{ width: '100%', height: Hp('100%') }}


                            renderTabBar={props => (
                                //     <ImageBackground
                                //         source={require('../../assets/images/JajaId.png')} >
                                <TabBar
                                    {...props}
                                    indicatorStyle={{ backgroundColor: colors.BlueJaja }}
                                    // bounces={true}
                                    scrollEnabled={true}
                                    contentContainerStyle={{ padding: 0, height: '100%' }}
                                    style={{ backgroundColor: colors.White, width: Wp('100%'), elevation: 3 }}
                                    tabStyle={{ width: Wp('50%'), height: '100%', padding: 0 }} // here
                                    renderLabel={({ route, focused, color }) => {
                                        return (
                                            <View style={[styles.row_center, { width: Wp('50%'), minHeight: Wp('11%') }]}>
                                                {/* <Image style={[styles.icon_25, { tintColor: focused ? colors.BlueJaja : colors.BlackSilver }]} source={route.title == 'Halaman Toko' ? require('../../assets/icons/store.png') : route.title == 'Produk' ? require('../../assets/icons/goods.png') : require('../../assets/icons/store.png')} /> */}
                                                <Text style={[styles.font_12, styles.medium, { textAlign: 'center', color: focused ? colors.BlueJaja : colors.BlackGrayScale }]}>{route.title}</Text>
                                            </View>
                                        )
                                    }}
                                />
                                // </ImageBackground> */}
                            )}
                        />

                    </View>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}

