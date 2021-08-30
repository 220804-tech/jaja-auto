import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import { useSelector, useDispatch } from 'react-redux';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { Button, Paragraph } from 'react-native-paper'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import Products from '../../components/Store/AllProducts'
import MainPage from '../../components/Store/MainPage'
import Posts from '../../components/Store/Posts'
import { colors, Loading, ServiceCart, ServiceStore, styles as style, useNavigation, Wp, AppbarSecond } from '../../export'
const initialLayout = { width: Dimensions.get('window').width };
const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 44 : 20) : 0;
const HEADER_HEIGHT = Platform.OS === 'ios' ? (IS_IPHONE_X ? 88 : 64) : 64;
const NAV_BAR_HEIGHT = HEADER_HEIGHT - STATUS_BAR_HEIGHT;


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
    const renderNavBar = () => (
        <View style={styles.navContainer}>
            <View style={styles.statusBar} />
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.iconLeft} onPress={() => { }}>
                    <Text style={{ color: 'white' }}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconRight} onPress={() => { }}>
                    <Text style={{ color: 'white' }}>Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderContent = () => {
        return (
            <View style={styles.body}>
                {Array.from(Array(30).keys()).map((i) => (
                    <View
                        key={i}
                        style={{ padding: 15, alignItems: 'center', justifyContent: 'center' }}>
                        <Text>Item {i + 1}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const title = () => {
        return (
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
                                <View style={[style.row_center, { width: Wp('33.3%'), minHeight: Wp('11%') }]}>
                                    {/* <Image style={[style.icon_25, { tintColor: focused ? colors.BlueJaja : colors.BlackSilver }]} source={route.title == 'Halaman Toko' ? require('../../assets/icons/store.png') : route.title == 'Produk' ? require('../../assets/icons/goods.png') : require('../../assets/icons/store.png')} /> */}
                                    <Text style={[style.font_12, style.medium, { textAlign: 'center', color: focused ? colors.BlueJaja : colors.BlackGrayScale }]}>{route.title}</Text>
                                </View>
                            )
                        }}
                    />
                )}
            />
        );
    };

    const handleSearch = (text) => {
        if (text && text !== " " && text !== "  " && text !== "   " && text !== "    " && text !== "     ") {
            setLoading(true)
            ServiceStore.getStoreProduct(reduxStore.slug, text, "", "", "", "", "").then(res => {
                setTimeout(() => setLoading(false), 1000);
                if (res) {
                    dispatch({ "type": 'SET_STORE_PRODUCT', payload: res.items })
                }
            })
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <AppbarSecond handleSearch={handleSearch} title={reduxStore && Object.keys(reduxStore).length && reduxStore.name ? `Cari di ${reduxStore.name}..` : 'Cari di toko..'} />
            <ReactNativeParallaxHeader
                headerMinHeight={HEADER_HEIGHT}
                headerMaxHeight={250}
                extraScrollHeight={20}
                navbarColor="transparent"
                titleStyle={styles.titleStyle}
                title={title()}

                backgroundImage={require('../../assets/images/JajaId.png')}
                backgroundImageScale={1.2}
                renderNavBar={renderNavBar}
                renderContent={renderContent}
                containerStyle={styles.container}
                contentContainerStyle={styles.contentContainer}
                innerContainerStyle={styles.container}
                scrollViewProps={{
                    onScrollBeginDrag: () => console.log('onScrollBeginDrag'),
                    onScrollEndDrag: () => console.log('onScrollEndDrag'),
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    navContainer: {
        height: HEADER_HEIGHT,
        marginHorizontal: 10,
    },
    statusBar: {
        height: STATUS_BAR_HEIGHT,
        backgroundColor: 'transparent',
    },
    navBar: {
        height: NAV_BAR_HEIGHT,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
