import React, { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, StatusBar, RefreshControl, TouchableWithoutFeedback, Alert } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { styles, Hp, Wp, colors, useNavigation, Appbar, ServiceCart, Loading, ServiceCheckout, useFocusEffect, DefaultNotFound, Utils, } from '../../export'
import { Button, Checkbox } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";
import Swipeable from 'react-native-swipeable';

export default function TrolleyScreen() {
    let navigation = useNavigation()
    const dispatch = useDispatch()
    const [swipeRef, setSwipeRef] = useState(Object.create(null));
    const reduxUser = useSelector(state => state.user.user)

    const reduxCart = useSelector(state => state.cart)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [auth, setAuth] = useState("")
    const [disableQty, setdisableQty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [disableCheckout, setDisableCheckout] = useState(false);
    const [cartSelected, setSelectedCard] = useState('')
    const [idx, setIndex] = useState(0)
    const [useCoin, setUseCoin] = useState(false)

    if (swipeRef && !Object.keys(swipeRef).length) swipeRef[idx] = createRef();

    useEffect(() => {
        setLoading(false)
        if (!auth) {
            EncryptedStorage.getItem('token').then(res => {
                if (res) {
                    setAuth(JSON.parse(res))
                } else {
                    navigation.navigate("Login")
                }
            })
        }

    }, [reduxCart.cart])

    useFocusEffect(
        useCallback(() => {
            EncryptedStorage.getItem('token').then(res => {
                if (res) {
                    setAuth(JSON.parse(res))
                } else {
                    navigation.navigate("Login")
                }
            })
        }, []),
    );


    const handleCheckbox = (name, indexParent, indexChild) => {
        setDisableCheckout(true)
        setLoading(true)
        let arr = reduxCart.cart;
        if (name === "store") {
            arr.items[indexParent].isSelected = !arr.items[indexParent].isSelected
            if (arr.items[indexParent].isSelected) {
                arr.items[indexParent].products.map((data, i) => {
                    return arr.items[indexParent].products[i].isSelected = true
                })
            } else {
                arr.items[indexParent].products.map((data, i) => {
                    return arr.items[indexParent].products[i].isSelected = false
                })
            }
        } else {
            arr.items[indexParent].products[indexChild].isSelected = !arr.items[indexParent].products[indexChild].isSelected
        }
        dispatch({ type: 'SET_CART', payload: arr })
        // setLoading(false)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth ? reduxAuth : auth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=sdvfphg27d6fhhbhh4ruftor53ppbcko");

        var raw = JSON.stringify({ 'cartId': name === "cart" ? arr.items[indexParent].products[indexChild].cartId : "", 'storeId': name === "store" ? arr.items[indexParent].store.id : "" })

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/cart/selected", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    handleApiCart()
                } else {
                    Utils.alertPopUp(String(result.status.message))
                }
                setTimeout(() => {
                    setDisableCheckout(false)
                }, 500);

            })
            .catch(error => {
                setDisableCheckout(false)
                Utils.handleError(error, 'Error with status code : 12027')
            })
    }

    const handleQty = (name, indexParent, indexChild) => {
        setDisableCheckout(true)
        setdisableQty(true)
        let arr = reduxCart.cart;
        if (name === "plus") {
            arr.items[indexParent].products[indexChild].qty = String(parseInt(arr.items[indexParent].products[indexChild].qty) + 1)
        } else {
            if (arr.items[indexParent].products[indexChild].qty < 1) {
                arr.items[indexParent].products[indexChild].qty = 0
            } else {
                arr.items[indexParent].products[indexChild].qty = String(parseInt(arr.items[indexParent].products[indexChild].qty) - 1)
            }
        }
        setTimeout(() => {
            // dispatch({ type: "SET_CART", payload: arr })
            setdisableQty(false)
        }, 100);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth ? reduxAuth : auth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=gqp7d9ml31ktad3bjvst8jvbbn190ai7");

        var raw = JSON.stringify({
            "productId": arr.items[indexParent].products[indexChild].productId,
            "qty": arr.items[indexParent].products[indexChild].qty,
            'variantId': arr.items[indexParent].products[indexChild].variantId
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/cart/qty?action=change", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                } else if (result.status.code === 400) {
                    if (result.status.message === "quantity cannot more than stock") {
                        Utils.alertPopUp('Stok produk tidak cukup')
                    } else if (result.status.message === 'quantity cannot less than 1') {

                    } else {
                        Utils.alertPopUp(String(result.status.message) + " => " + String(result.status.code))
                    }
                } else {
                    Utils.alertPopUp(String(result.status.message) + " => " + String(result.status.code))

                    handleFailed(name, indexParent, indexChild)
                }
                handleApiCart()
                setTimeout(() => {
                    setDisableCheckout(false)
                }, 500);
            })
            .catch(error => {
                handleFailed(name, indexParent, indexChild)
                setDisableCheckout(false)
                Utils.handleError(error, 'Error with status code : 16002')
            })
    }
    const handleFailed = (name, indexParent, indexChild) => {
        let arr = reduxCart.cart;
        if (name === "plus") {
            arr.items[indexParent].products[indexChild].qty = String(parseInt(arr.items[indexParent].products[indexChild].qty) - 1)
        } else {
            if (arr.items[indexParent].products[indexChild].qty <= 1) {
                arr.items[indexParent].products[indexChild].qty = 1
            } else {
                arr.items[indexParent].products[indexChild].qty = String(parseInt(arr.items[indexParent].products[indexChild].qty) + 1)
            }
        }
        dispatch({ type: "SET_CART", payload: arr })
    }

    const handleApiCart = () => {
        ServiceCart.getCart(reduxAuth ? reduxAuth : auth).then(res => {
            if (res) {
                setTimeout(() => setLoading(false), 1000);
                dispatch({ type: 'SET_CART', payload: res })
            }
        })
    }

    const handleCheckout = () => {
        if (reduxCart.cart.totalData != '0' && disableCheckout === false && reduxCart.cart.totalCart != 0) {
            dispatch({ type: 'SET_CHECKOUT', payload: {} })
            navigation.navigate('Checkout')

            ServiceCheckout.getCheckout(reduxAuth ? reduxAuth : auth, 0).then(res => {
                if (res) {
                    if (res == 'Alamat') {
                        navigation.navigate('Address', { data: "checkout" })
                    } else {
                        navigation.navigate('Checkout')
                    }
                    console.log("🚀 ~ file: TrolleyScreen.js ~ line 200 ~ ServiceCheckout.getCheckout ~ res", res)
                    dispatch({ type: 'SET_CHECKOUT', payload: res })
                }
            })
            ServiceCheckout.getShipping(reduxAuth ? reduxAuth : auth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_SHIPPING', payload: res })
                }
            })
            ServiceCheckout.getListPayment().then(res => {
                if (res) {
                    dispatch({ type: 'SET_LIST_PAYMENT', payload: res })
                }
            })
        } else if (reduxCart.cart.totalCart == 0) {
            Utils.alertPopUp("Pilih salah satu produk yang ingin dibeli!")

        } else {
            setDisableCheckout(true)
        }

    }

    const handleDeleteCart = (id) => {
        setLoading(true)
        ServiceCart.deleteCart(reduxAuth ? reduxAuth : auth, id).then(res => {
            if (res == 200) {
                handleApiCart()
            }
            setTimeout(() => setLoading(false), 1000);
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleApiCart()
        setTimeout(() => {
            setRefreshing(false)
        }, 2000);
    }, []);

    const handleSelected = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }

    const swipeComponent = (item) => {

        return [
            <TouchableOpacity onPress={() => {
                handleDeleteCart(item.cartId)
            }} style={[styles.column_center, { height: '91.5%', width: '18%', backgroundColor: colors.RedDanger }]}>
                <Image style={[styles.icon_25, { tintColor: colors.White }]} source={require('../../assets/icons/delete.png')} />
            </TouchableOpacity>
        ]
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar
                animated={true}
                translucent={false}
                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            /> */}
            <Appbar back={true} title="Keranjang" />
            {loading ? <Loading /> : null}
            {reduxCart.cart.items && reduxCart.cart.items.length ?
                <FlatList
                    data={reduxCart.cart.items}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={{ flex: 0, flexDirection: 'column', justifyContent: 'center', width: '100%', paddingBottom: Hp('7%') }}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => {
                        let indexParent = index
                        return (
                            <View onPress={() => handleSelected(item)} style={[styles.column_center, styles.mb_2, { backgroundColor: colors.White }]}>
                                <View style={[styles.row_start_center, styles.p_2, { width: '100%', borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                    <Checkbox
                                        color={colors.BlueJaja}
                                        status={item.isSelected ? 'checked' : 'unchecked'}
                                        onPress={() => handleCheckbox("store", indexParent, "")}
                                    />
                                    <Image style={{
                                        width: Hp('5%'),
                                        height: Hp('5%'),
                                        borderRadius: 7,
                                        backgroundColor: colors.Silver,
                                        marginRight: '3%'
                                    }}
                                        resizeMethod={"scale"}
                                        resizeMode={item.image ? "cover" : "center"}
                                        source={{ uri: item.store.image }}
                                    />
                                    <View style={[styles.column_around_center, { alignItems: 'flex-start' }]}>
                                        <Text numberOfLines={1} style={[styles.font_14, styles.T_medium, { color: colors.BlackGrayScale }]}>{item.store.name}</Text>
                                        <Text numberOfLines={1} style={[styles.font_13, { color: colors.BlackGrayScale }]}>{item.store.location}</Text>
                                    </View>
                                </View>

                                <FlatList
                                    data={item.products}
                                    keyExtractor={(item, idx) => String(idx)}
                                    contentContainerStyle={{ flex: 0, width: '100%', }}
                                    style={[styles.py_2, { width: '100%' }]}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <Swipeable ref={swipeRef[index]} onRef={(ref) => setSwipeRef(ref)} rightButtons={swipeComponent(item)} onRightActionRelease={() => {
                                                setIndex(index)
                                            }}>
                                                <View onPress={() => handleSelected(item)} style={[styles.row_center, styles.mb_2, styles.p_2]}>

                                                    <Checkbox
                                                        color={colors.BlueJaja}
                                                        status={item.isSelected ? 'checked' : 'unchecked'}
                                                        onPress={() => handleCheckbox("cart", indexParent, index)}

                                                    />
                                                    <TouchableWithoutFeedback onPress={() => handleSelected(item)}>
                                                        <Image style={{
                                                            width: Wp('24%'),
                                                            height: Wp('24%'),
                                                            marginHorizontal: '3%',
                                                            borderRadius: 5,
                                                            backgroundColor: colors.BlackGrey
                                                        }}
                                                            resizeMethod={"scale"}
                                                            resizeMode={item.image ? "cover" : "center"}
                                                            source={{ uri: item.image }}
                                                        />
                                                    </TouchableWithoutFeedback>
                                                    <View style={[styles.column_center, { alignItems: 'flex-start', height: Wp('21%'), width: '60%' }]}>
                                                        <Text onPress={() => handleSelected(item)} numberOfLines={1} style={[styles.font_13, styles.T_semi_bold, { flex: 0, color: colors.BlueJaja }]}>{item.name}</Text>
                                                        <Text numberOfLines={1} style={[styles.font_10, { flex: 0, color: colors.BlackGrayScale }]}>Biru{item.variant ? "Variant " + item.variant : ""}</Text>
                                                        {item.isDiscount ?
                                                            <View style={styles.row_around_center}>
                                                                <Text numberOfLines={1} style={[styles.priceBefore, { flex: 0, color: colors.BlackGrayScale, marginRight: '2%' }]}>{item.priceCurrencyFormat}</Text>
                                                                <Text numberOfLines={1} style={[styles.priceAfter, styles.font_13, styles.T_semi_bold, { color: colors.RedFlashsale }]}>{item.priceDiscountCurrencyFormat}</Text>
                                                            </View>
                                                            :
                                                            <Text numberOfLines={1} style={[styles.priceAfter, { flex: 0, color: colors.RedMaroon }]}>{item.priceCurrencyFormat}</Text>
                                                        }
                                                        <View style={[styles.row_between_center, { flex: 0 }]}>
                                                            <View style={[styles.row_around_center, { flex: 1 }]}>
                                                                <TouchableOpacity disabled={disableQty} onPress={() => {
                                                                    if (item.qty == 1) {
                                                                        handleDeleteCart(item.cartId)
                                                                    } else {
                                                                        handleQty('min', indexParent, index)
                                                                    }
                                                                }} style={[styles.row_center, styles.mr_5, { backgroundColor: colors.BlueJaja, borderRadius: 5, height: Wp('7%'), width: Wp('7%') }]} >
                                                                    <Text style={[styles.font_20, styles.T_semi_bold, { color: colors.White, marginTop: '-2.5%' }]}>-</Text>
                                                                </TouchableOpacity>
                                                                <Text style={[styles.font_14]}>{item.qty}</Text>
                                                                <TouchableOpacity disabled={disableQty} onPress={() => handleQty('plus', indexParent, index)} style={[styles.row_center, styles.ml_5, { backgroundColor: colors.BlueJaja, borderRadius: 5, height: Wp('7%'), width: Wp('7%') }]} >
                                                                    <Text style={[styles.font_20, styles.T_semi_bold, { color: colors.White, marginTop: '-2.5%' }]}>+</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </Swipeable >
                                        )
                                    }}
                                />
                            </View>

                        )
                    }}
                />
                : <DefaultNotFound textHead="Ups.." textBody="Tampaknya keranjang anda masih kosong.." ilustration={require('../../assets/ilustrations/empty.png')} />
            }
            <View style={{ position: 'absolute', bottom: 0, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'column', elevation: 3 }}>
                {/* <View style={[styles.row_between_center, styles.px_3, { height: Hp('6%'), backgroundColor: reduxCart.cart.totalCart > 0 ? colors.White : colors.WhiteGrey }]}>
                    <View style={[styles.row_start_center]}>
                        <Image source={require('../../assets/icons/coin.png')} style={[styles.icon_14, styles.mr_5]} />
                        <Text numberOfLines={1} style={[styles.font_13, { textAlignVertical: 'center', marginBottom: "-2%" }]}>Koin dimiliki {reduxUser.coinFormat}</Text>
                    </View>

                    <Checkbox
                        color={colors.BlueJaja}
                        status={useCoin ? 'checked' : 'unchecked'}
                        disabled={reduxCart.cart.totalCart > 0 ? false : true}
                        onPress={() => {
                            if (reduxCart.cart.totalCart > 0) {
                                setUseCoin(!useCoin)
                            } else {
                                Utils.alertPopUp('Pilih salah satu produk yang ingin dibeli!')
                                setUseCoin(false)
                            }
                        }}
                    />
                </View> */}
                <View style={[styles.row, { height: Hp('7%') }]}>
                    <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '2%', paddingLeft: '4%', paddingVertical: '1%' }}>
                        <Text style={[styles.font_14, styles.T_medium, { color: colors.BlueJaja, marginBottom: '-2%' }]}>Subtotal :</Text>
                        <Text numberOfLines={1} style={[styles.font_18, styles.T_semi_bold, { color: colors.BlueJaja }]}>{reduxCart.cart.totalCartCurrencyFormat ? reduxCart.cart.totalCartCurrencyFormat : 'Rp0'}</Text>
                    </View>
                    <Button disabled={disableCheckout} onPress={handleCheckout} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_14, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                        Checkout
                    </Button>
                </View>
            </View>
        </SafeAreaView >
    )
}