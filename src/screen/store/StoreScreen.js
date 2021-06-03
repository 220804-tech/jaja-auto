import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, StatusBar, Dimensions, ScrollView } from 'react-native'
import { styles, colors, Wp, Hp, useNavigation, ServiceStore, Loading } from '../../export'
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
    const reduxStoreProduct = useSelector(state => state.store.storeProduct)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState("first")
    const [index, setIndex] = useState(0)



    useEffect(() => {
        if (reduxStore) {
            console.log("🚀 ~ file: StoreScreen.js ~ line 7 ~ StoreScreen ~ reduxCheckout", reduxStore.slug)
        }
    }, [reduxStoreProduct])

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



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.White}
                barStyle='dark-content'
                showHideTransition="fade"
            />
            <View style={[styles.appBar, { flex: 0, height: Hp('6.5%'), backgroundColor: colors.White }]}>
                <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                    <Image style={[styles.appBarButton, { tintColor: colors.BlackGrayScale }]} source={require('../../assets/icons/arrow.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.searchBar, { backgroundColor: '#f5f5f5' }]}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <TextInput keyboardType="name-phone-pad" returnKeyType="search" adjustsFontSizeToFit style={styles.font_14} placeholder='Cari hobimu sekarang..' onSubmitEditing={(value) => handleSearch(value.nativeEvent.text)}></TextInput>
                </TouchableOpacity>
            </View>
            {/* <View style={{ flex: 1, height: Hp('100%') }}> */}
            <View style={{ flex: 1 }}>
                {loading ? <Loading /> : null}
                {/* <ScrollView contentContainerStyle={{ height: Hp('100%') }}> */}
                <View style={[styles.column, styles.p_3, { backgroundColor: colors.White, elevation: 3 }]}>
                    <View style={styles.row_between_center}>
                        {Object.keys(reduxStore).length !== 0 ?
                            <View style={styles.row_start_center}>
                                <View style={{ width: Wp('15%'), height: Wp('15%'), borderRadius: 5, marginRight: '5%', borderWidth: 0.5, borderColor: '#f5f5f5', backgroundColor: colors.White }}>
                                    <Image source={{ uri: reduxStore.image.profile ? reduxStore.image.profile : null }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 5 }} />
                                </View>
                                <View style={[styles.column_start, { height: Wp('15%') }]}>
                                    <Text style={[styles.font_14, { color: colors.BlackGrayScale, fontWeight: 'bold', marginBottom: '3%' }]}>{reduxStore.name}</Text>
                                    <Text style={[styles.font_12, { color: colors.BlackGrayScale, marginBottom: '3%' }]}>{reduxStore.location.city}</Text>
                                    {reduxStore.rating === "0.0" ?
                                        <View style={styles.row_center}>
                                            <Text style={[styles.font_14, { color: colors.BlackGrayScale }]}>4.0{reduxStore.rating === "0.0" ? null : reduxStore.rating} </Text>
                                            <Image source={require('../../assets/icons/star.png')} style={styles.icon_14} />
                                        </View>
                                        :
                                        <View style={styles.row_center}>
                                        </View>}
                                </View>
                            </View>
                            : null
                        }
                        <Button onPress={() => console.log("TEST")} mode="contained" icon="chat" labelStyle={{ fontSize: 12, color: colors.White }} color={colors.BlueJaja} >
                            Chat
                        </Button>
                        {/* <Button mode="contained" icon="plus" labelStyle={{ fontSize: 12 }} >
                                Ikuti
                            </Button> */}
                    </View>
                    {reduxStore.greeting ?
                        <View style={[styles.pt_2]}>
                            <Paragraph style={styles.font_24}>{reduxStore.greeting}</Paragraph>
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
