import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, Hp, styles, useNavigation, ServiceCart } from '../../export';
import { useSelector, useDispatch } from 'react-redux'

export default function AppbarSecond(props) {
    const navigation = useNavigation()
    const reduxUser = useSelector(state => state.user.badges)
    const reduxAuth = useSelector(state => state.auth.auth)
    const dispatch = useDispatch()

    const handleGetCart = () => {
        if (reduxAuth || auth) {
            ServiceCart.getCart(reduxAuth ? reduxAuth : auth).then(res => {
                if (res) {
                    dispatch({ type: 'SET_CART', payload: res })
                }
            })
            navigation.navigate("Trolley")
        } else {
            navigation.navigate('Login', { navigate: 'Trolley' })
        }
    }

    return (
        <View style={[styles.appBar, { flex: 0, height: Hp('6.5%'), backgroundColor: props.backgroundColor ? props.backgroundColor : colors.BlueJaja }]}>
            <TouchableOpacity style={styles.row_start_center} onPress={() => navigation.goBack()}>
                <Image style={[styles.appBarButton, { tintColor: colors.White }]} source={require('../../assets/icons/arrow.png')} />
            </TouchableOpacity>
            <View style={[styles.searchBar, { backgroundColor: colors.BlueJaja, paddingHorizontal: '0%' }]}>
                <View style={[styles.row, { width: '85%', marginRight: '1%', backgroundColor: colors.White, height: '100%', alignItems: 'center', borderRadius: 10, paddingHorizontal: '3%' }]}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                    <TextInput keyboardType="default" returnKeyType="search" adjustsFontSizeToFit style={[styles.font_13, { marginBottom: '-1%', width: '90%' }]} placeholder={props.title} onSubmitEditing={(value) => props.handleSearch(value.nativeEvent.text)}></TextInput>
                </View>
                <TouchableOpacity style={[styles.column, styles.mx_3]} onPress={() => handleGetCart()}>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, tintColor: colors.White }} />
                    {Object.keys(reduxUser).length && reduxUser.totalProductInCart ?
                        <View style={styles.countNotif}><Text style={styles.textNotif}>{reduxUser.totalProductInCart >= 100 ? "99+" : reduxUser.totalProductInCart}</Text></View>
                        : null}
                </TouchableOpacity>
            </View>
        </View>
    );
}
