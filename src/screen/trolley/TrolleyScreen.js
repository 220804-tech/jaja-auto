import React, { useState, useEffect, useCallback } from 'react'
import CheckBox from '@react-native-community/checkbox';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ToastAndroid, FlatList, StatusBar, RefreshControl, TouchableWithoutFeedback, Alert } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { styles, Hp, Wp, colors, useNavigation, Appbar, ServiceCart, Loading, ServiceCheckout, useFocusEffect } from '../../export'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";

export default function TrolleyScreen() {
    let navigation = useNavigation()
    const dispatch = useDispatch()

    const reduxCart = useSelector(state => state.cart)
    const reduxAuth = useSelector(state => state.auth.auth)
    const [auth, setAuth] = useState("")
    const [disableQty, setdisableQty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [disableCheckout, setDisableCheckout] = useState(false);

    useEffect(() => {
        setLoading(false)
        EncryptedStorage.getItem('token').then(res => {
            if (res) {
                setAuth(JSON.parse(res))
            } else {
                navigation.navigate("Login")
            }
        })
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
                    ToastAndroid.show(result.status.message, ToastAndroid.LONG, ToastAndroid.CENTER)
                }
                setTimeout(() => {
                    setDisableCheckout(false)
                }, 500);

            })
            .catch(error => {
                setDisableCheckout(false)
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 16001",
                        JSON.stringify(error),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
            })
    }

    const handleQty = (name, indexParent, indexChild) => {
        setDisableCheckout(true)
        setdisableQty(true)
        let arr = reduxCart.cart;
        console.log("file: TrolleyScreen.js ~ line 110 ~ handleQty ~ name", arr.items[indexParent].products[indexChild])
        if (name === "plus") {
            arr.items[indexParent].products[indexChild].qty = String(parseInt(arr.items[indexParent].products[indexChild].qty) + 1)
        } else {
            if (arr.items[indexParent].products[indexChild].qty <= 1) {
                arr.items[indexParent].products[indexChild].qty = 1
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
                        ToastAndroid.show('Stok produk tidak cukup', ToastAndroid.LONG, ToastAndroid.TOP)
                    } else {
                        ToastAndroid.show(String(result.status.message) + " => " + String(result.message.code), ToastAndroid.LONG, ToastAndroid.TOP)
                    }
                } else {
                    ToastAndroid.show(String(result.status.message) + " => " + String(result.message.code), ToastAndroid.LONG, ToastAndroid.TOP)
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
                if (String(error).slice(11, String(error).length) === "Network request failed") {
                    ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi anda!", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    Alert.alert(
                        "Error with status 16002",
                        JSON.stringify(error),
                        [
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                        ],
                        { cancelable: false }
                    );
                }
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
                setTimeout(() => {
                    setLoading(false)
                }, 1000);
                dispatch({ type: 'SET_CART', payload: res })
            }
        })
    }

    const handleCheckout = () => {
        if (reduxCart.cart.totalCartCurrencyFormat !== "Rp0" && disableCheckout === false) {
            navigation.navigate('Checkout')
            dispatch({ type: 'SET_CHECKOUT', payload: {} })
            ServiceCheckout.getCheckout(reduxAuth ? reduxAuth : auth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_CHECKOUT', payload: res })
                }
            })
            ServiceCheckout.getShipping(reduxAuth ? reduxAuth : auth).then(res => {
                console.log("🚀 ~ file: TrolleyScreen.js ~ line 161 ~ ServiceCheckout.getShipping ~ res", res)
                if (res) {
                    dispatch({ type: 'SET_SHIPPING', payload: res })
                }
            })
        }
    }

    const handleDeleteCart = (id) => {
        setLoading(true)
        ServiceCart.deleteCart(reduxAuth ? reduxAuth : auth, id).then(res => {
            if (res == 200) {
                handleApiCart()
            }
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        handleApiCart()
        setTimeout(() => {
            setRefreshing(false)
        }, 3000);
    }, []);

    const handleSelected = item => {
        dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        navigation.navigate("Product", { slug: item.slug, image: item.image })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Keranjang" />
            {loading ? <Loading /> : null}
            {reduxCart.cart.items ?
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
                        console.log("file: TrolleyScreen.js ~ line 270 ~ TrolleyScreen ~ item", item.products[0].qty)
                        let indexParent = index
                        return (
                            <View onPress={() => handleSelected(item)} style={{ marginBottom: '2%', backgroundColor: colors.White, flex: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                <View style={[styles.row_start_center, styles.p_2, { width: '100%', borderBottomWidth: 0.5, borderBottomColor: colors.Silver }]}>
                                    <CheckBox
                                        disabled={false}
                                        value={item.isSelected}
                                        onValueChange={() => handleCheckbox("store", indexParent, "")}
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
                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale, fontWeight: 'bold' }]}>{item.store.name}</Text>
                                        <Text numberOfLines={1} style={[styles.font_14, { color: colors.BlackGrayScale }]}>{item.store.location}</Text>
                                    </View>
                                </View>

                                <FlatList
                                    data={item.products}
                                    keyExtractor={(item, idx) => String(idx)}
                                    contentContainerStyle={{ flex: 0, width: '100%', }}
                                    style={{ width: '100%', paddingVertical: '3%' }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View onPress={() => handleSelected(item)} style={{ marginBottom: '2%', backgroundColor: colors.White, flex: 0, flexDirection: 'row', alignItems: 'center', paddingLeft: '5%', paddingRight: '3%' }}>
                                                <CheckBox
                                                    disabled={false}
                                                    value={item.isSelected}
                                                    onValueChange={() => handleCheckbox("cart", indexParent, index)}
                                                />
                                                <TouchableWithoutFeedback onPress={() => handleSelected(item)}>
                                                    <Image style={{
                                                        width: Wp('21%'),
                                                        height: Wp('21%'),
                                                        marginHorizontal: '3%',
                                                        borderRadius: 5,
                                                        backgroundColor: colors.BlackGrey
                                                    }}
                                                        resizeMethod={"scale"}
                                                        resizeMode={item.image ? "cover" : "center"}
                                                        source={{ uri: item.image }}
                                                    />
                                                </TouchableWithoutFeedback>
                                                <View style={[styles.column_between_center, { alignItems: 'flex-start', height: Wp('21%'), width: '60%' }]}>
                                                    <Text onPress={() => handleSelected(item)} numberOfLines={1} style={[styles.font_14, { flex: 0, color: colors.BlueJaja, fontWeight: 'bold' }]}>{item.name}</Text>
                                                    <Text numberOfLines={1} style={[styles.font_10, { flex: 0, color: colors.BlackGrayScale }]}>{item.variant ? "Variant " + item.variant : ""}</Text>
                                                    {item.isDiscount ?
                                                        <View style={styles.row_around_center}>
                                                            <Text numberOfLines={1} style={[styles.priceBefore, { flex: 0, color: colors.BlackGrayScale, marginRight: '2%' }]}>{item.priceCurrencyFormat}</Text>
                                                            <Text numberOfLines={1} style={[styles.priceAfter, { flex: 0, color: colors.RedMaroon }]}>{item.priceDiscountCurrencyFormat}</Text>
                                                        </View>
                                                        :
                                                        <Text numberOfLines={1} style={[styles.priceAfter, { flex: 0, color: colors.RedMaroon }]}>{item.priceCurrencyFormat}</Text>
                                                    }
                                                    <View style={[styles.row_between_center, { flex: 1, marginTop: '2%' }]}>
                                                        <View style={[styles.row_around_center, { flex: 1 }]}>
                                                            <TouchableOpacity disabled={disableQty} onPress={() => handleQty('min', indexParent, index)} style={{ backgroundColor: colors.BlueJaja, borderRadius: 5, justifyContent: 'center', height: Wp('7%'), width: Wp('7%'), alignItems: 'center', marginRight: '5%' }}>
                                                                <Text style={[styles.font_20, { color: colors.White, fontWeight: 'bold' }]}>-</Text>
                                                            </TouchableOpacity>
                                                            <Text style={[styles.font_14]}>{item.qty}</Text>
                                                            <TouchableOpacity disabled={disableQty} onPress={() => handleQty('plus', indexParent, index)} style={{ backgroundColor: colors.BlueJaja, borderRadius: 5, height: Wp('7%'), width: Wp('7%'), justifyContent: 'center', alignItems: 'center', marginLeft: '5%' }}>
                                                                <Text style={[styles.font_20, { color: colors.White, fontWeight: 'bold' }]}>+</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                                            <TouchableOpacity onPress={() => handleDeleteCart(item.cartId)} style={{ height: '100%', justifyContent: 'center', alignItems: 'flex-end', width: '30%' }}>
                                                                <Image style={[styles.icon_25, { tintColor: colors.RedDanger }]} source={require('../../assets/icons/delete.png')} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>

                                            </View>
                                        )
                                    }}
                                />
                            </View>
                        )
                    }}
                />
                :

                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Keranjang anda masih kosog!</Text>
                </View>
            }
            <View style={{ position: 'absolute', bottom: 0, height: Hp('7%'), width: '100%', backgroundColor: colors.White, flex: 0, flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-end', paddingHorizontal: '3%', paddingLeft: '5%', paddingVertical: '1%' }}>
                    <Text style={[styles.font_14, { fontWeight: 'bold', color: colors.BlueJaja }]}>Subtotal :</Text>
                    <Text numberOfLines={1} style={[styles.font_20, { fontWeight: 'bold', color: colors.BlueJaja }]}>{reduxCart.cart.totalCartCurrencyFormat}</Text>
                </View>
                <Button onPress={handleCheckout} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" >
                    Checkout
                </Button>
            </View>
        </SafeAreaView >
    )
}
