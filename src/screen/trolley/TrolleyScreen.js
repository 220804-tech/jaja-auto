import React, { useState, useEffect, useCallback, useRef, createRef } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, StatusBar, RefreshControl, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { styles, Hp, Wp, colors, useNavigation, Appbar, ServiceCart, Loading, ServiceCheckout, DefaultNotFound, Utils, ServiceProduct, } from '../../export'
import { Button, Checkbox } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux";
import Swipeable from 'react-native-swipeable';
import CheckBox from '@react-native-community/checkbox'

export default function TrolleyScreen() {
    let navigation = useNavigation()
    const dispatch = useDispatch()
    const [swipeRef, setSwipeRef] = useState(Object.create(null));
    const reduxUser = useSelector(state => state.user.user)

    const reduxCart = useSelector(state => state.cart)
    const cartStatus = useSelector(state => state.cart.cartStatus)

    const reduxAuth = useSelector(state => state.auth.auth)
    const [disableQty, setdisableQty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [disableCheckout, setDisableCheckout] = useState(false);
    const [cartSelected, setSelectedCard] = useState('')
    const [idx, setIndex] = useState(0)
    const [useCoin, setUseCoin] = useState(false)
    const [update, setupdate] = useState(true)

    if (swipeRef && !Object.keys(swipeRef).length) swipeRef[idx] = createRef();

    useEffect(() => {
        return () => {
            setLoading(false)
        }
    }, [reduxCart.cart])

    const handleCheckbox = (name, indexParent, indexChild) => {
        try {
            if (update) {
                setupdate(false)
                setDisableCheckout(true)

                // setLoading(true)
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
                myHeaders.append("Authorization", reduxAuth);
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "ci_session=sdvfphg27d6fhhbhh4ruftor53ppbcko");

                var raw = JSON.stringify({ 'cartId': name === "cart" ? arr.items[indexParent].products[indexChild].cartId : "", 'storeId': name === "store" ? arr.items[indexParent].store.id : "" })

                var requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(`https://jaja.id/backend/cart/selected?is_gift=${cartStatus === 1 ? 1 : 0}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.status.code === 200) {
                            console.log("🚀 ~ file: TrolleyScreen.js ~ line 74 ~ handleCheckbox ~ result", result)
                            handleApiCart()
                        } else {
                            Utils.alertPopUp(String(result.status.message))
                        }
                        setTimeout(() => {
                            setDisableCheckout(false)
                            setupdate(true)
                        }, 500);

                    })
                    .catch(error => {
                        setDisableCheckout(false)
                        Utils.handleError(error, 'Error with status code : 12027')
                    })
            }
            setTimeout(() => {
                setupdate(true)
            }, 3000);
        } catch (error) {

        }
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
        myHeaders.append("Authorization", reduxAuth);
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
        ServiceCart.getTrolley(reduxAuth, cartStatus === 1 ? 1 : 0, dispatch)
        setTimeout(() => setLoading(false), 1000);

    }

    const handleGetCheckout = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/checkout?isCoin=0&fromCart=1&is_gift=${cartStatus === 1 ? 1 : 0}`, requestOptions)
            .then(response => response.text())
            .then(res => {
                try {
                    let result = JSON.parse(res)
                    if (result.status.code === 200) {
                        dispatch({ type: 'SET_CHECKOUT', payload: result.data })
                        navigation.navigate('Checkout')
                    } else if (result.status.code == 404 && result.status.message == 'alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu') {
                        Utils.alertPopUp('Silahkan tambah alamat terlebih dahulu!')
                        navigation.navigate('Address', { data: "checkout" })
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12156')
                        return null
                    }
                } catch (error) {
                    Utils.alertPopUp(JSON.stringify(res) + ' : 12157\n\n' + res)
                }
            })
            .catch(error => Utils.handleError(error, 'Error with status code : 12158'));
    }

    const handleCheckout = () => {
        try {
            if (disableCheckout === false && reduxCart.cart.totalCart != 0) {
                dispatch({ type: 'SET_CHECKOUT', payload: {} })
                navigation.navigate('Checkout')

                // ServiceCheckout.getCheckout(reduxAuth, 0).then(res => {
                //     if (res) {
                //         if (res == 'Alamat') {
                //             navigation.navigate('Address', { data: "checkout" })
                //         } else {
                //             navigation.navigate('Checkout')
                //         }
                //     }
                // })
                handleGetCheckout()

                ServiceCheckout.getShipping(reduxAuth, cartStatus).then(res => {
                    if (res) {
                        dispatch({ type: 'SET_SHIPPING', payload: res })
                    }
                })
                // ServiceCheckout.getListPayment().then(res => {
                //     if (res) {
                //         dispatch({ type: 'SET_LIST_PAYMENT', payload: res })
                //     }
                // })
            } else if (reduxCart.cart.totalCart == 0) {
                Utils.alertPopUp("Pilih salah satu produk yang ingin dibeli!")

            } else {
                setDisableCheckout(true)
            }
        } catch (error) {
            console.log("🚀 ~ file: TrolleyScreen.js ~ line 251 ~ handleCheckout ~ error", error)
        }

    }

    const handleDeleteCart = (id) => {
        setLoading(true)
        ServiceCart.deleteCart(reduxAuth, id).then(res => {
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
        console.log("🚀 ~ file: TrolleyScreen.js ~ line 275 ~ TrolleyScreen ~ item", item)
        // dispatch({ type: 'SET_DETAIL_PRODUCT', payload: {} })
        // navigation.navigate("Product", { slug: item.slug, image: item.image })
        dispatch({ type: 'SET_PRODUCT_LOAD', payload: true })
        navigation.push("Product")
        dispatch({ type: 'SET_SHOW_FLASHSALE', payload: false })
        dispatch({ type: 'SET_SLUG', payload: item.slug })

        ServiceProduct.getProduct(reduxAuth, item.slug).then(res => {
            if (res?.status?.code === 400) {
                Utils.alertPopUp('Sepertinya data tidak ditemukan!')
                navigation.goBack()
            } else {
                dispatch({ type: 'SET_DETAIL_PRODUCT', payload: res.data })
            }
            dispatch({ type: 'SET_PRODUCT_LOAD', payload: false })
        })
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
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            {/* <StatusBar
                animated={true}
                translucent={false}
                backgroundColor={colors.BlueJaja}
                barStyle='light-content'
                showHideTransition="fade"
            /> */}
            <Appbar back={true} title="Keranjang" />
            {loading ? <Loading /> : null}
            <View style={{ flex: 1, backgroundColor: Platform.OS === 'ios' ? colors.White : null }}>
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
                                        {Platform.OS === 'ios' ?
                                            <CheckBox
                                                lineWidth={1.5}
                                                onTintColor={colors.BlueJaja}
                                                onCheckColor={colors.BlueJaja}
                                                onAnimationType='fill'
                                                boxType='square'
                                                disabled={false}
                                                value={item.isSelected ? true : false}
                                                onValueChange={() => handleCheckbox("store", indexParent, "")}
                                                style={styles.mr_3}
                                            />
                                            :
                                            <Checkbox
                                                color={colors.BlueJaja}
                                                status={item.isSelected ? 'checked' : 'unchecked'}
                                                onPress={() => handleCheckbox("store", indexParent, "")}
                                                style={styles.mr_2}

                                            />
                                        }
                                        <Image style={{
                                            width: Hp('5%'),
                                            height: Hp('5%'),
                                            borderRadius: 7,
                                            backgroundColor: colors.White,
                                            borderWidth: 0.2,
                                            borderColor: colors.Silver,
                                            alignSelf: 'center',
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
                                                    <View onPress={() => handleSelected(item)} style={[styles.row_center, styles.mb_2, styles.px_5]}>
                                                        {Platform.OS === 'ios' ?
                                                            <CheckBox

                                                                onAnimationType='fill'
                                                                lineWidth={1.5}
                                                                onTintColor={colors.BlueJaja}
                                                                onCheckColor={colors.BlueJaja}
                                                                boxType='square'
                                                                disabled={false}
                                                                value={item.isSelected ? true : false}
                                                                onValueChange={() => handleCheckbox("cart", indexParent, index)}
                                                                style={styles.mr}
                                                            />
                                                            :
                                                            <Checkbox
                                                                color={colors.BlueJaja}
                                                                status={item.isSelected ? 'checked' : 'unchecked'}
                                                                onPress={() => handleCheckbox("cart", indexParent, index)}

                                                            />
                                                        }
                                                        <TouchableWithoutFeedback onPress={() => handleSelected(item)}>
                                                            <Image style={{
                                                                width: Wp('24%'),
                                                                height: Wp('24%'),
                                                                marginHorizontal: '3%',
                                                                borderRadius: 5,
                                                                backgroundColor: colors.White,
                                                                borderWidth: 0.2,
                                                                borderColor: colors.Silver,
                                                                alignSelf: 'center',
                                                                resizeMode: 'contain'
                                                            }}
                                                                resizeMethod={"scale"}
                                                                // resizeMode={item.image ? "cover" : "center"}
                                                                source={{ uri: item.image }}
                                                            />
                                                        </TouchableWithoutFeedback>
                                                        <View style={[styles.column_between_center, { alignItems: 'flex-start', height: Wp('23%'), width: '60%' }]}>
                                                            <View style={styles.column_center_start}>
                                                                <Text onPress={() => handleSelected(item)} numberOfLines={1} style={[styles.font_12, styles.T_medium, { flex: 0, color: colors.BlueJaja }]}>{item.name}</Text>
                                                                <Text numberOfLines={1} style={[styles.font_10, { flex: 0, color: colors.BlackGrayScale }]}>{item.variant ? "Variant " + item.variant : ""}</Text>
                                                            </View>
                                                            {item.isDiscount ?
                                                                < View style={styles.row_around_center}>
                                                                    <Text numberOfLines={1} style={[styles.priceBefore, { flex: 0, color: colors.BlackGrayScale, marginRight: '2%' }]}>{item.priceCurrencyFormat}</Text>
                                                                    <Text numberOfLines={1} style={[styles.font_10, styles.T_semi_bold, { color: colors.RedFlashsale }]}>{item.priceDiscountCurrencyFormat}</Text>
                                                                </View>
                                                                :
                                                                <Text numberOfLines={1} style={[styles.font_12, styles.mb_2, { flex: 0, color: colors.RedMaroon }]}>{item.priceCurrencyFormat}</Text>
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
                            <Text style={[styles.font_12, styles.T_medium, { color: colors.BlueJaja, marginBottom: '-2%' }]}>Total Harga :</Text>
                            <Text numberOfLines={1} style={[styles.font_17, styles.T_semi_bold, { color: colors.BlueJaja }]}>{reduxCart.cart.totalCartCurrencyFormat ? reduxCart.cart.totalCartCurrencyFormat : 'Rp0'}</Text>
                        </View>
                        <Button disabled={disableCheckout} onPress={handleCheckout} style={{ width: '50%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }} color={colors.BlueJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained" >
                            Checkout
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    )
}