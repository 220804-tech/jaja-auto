import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, StyleSheet, ToastAndroid, FlatList, Image, RefreshControl } from "react-native";
import { Paragraph, Switch } from "react-native-paper";
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { colors, styles as style, Wp, Hp, ServiceUser, ServiceCheckout } from '../../export'
import { Appbar, Button } from 'react-native-paper';
import * as Service from '../../services/Address';
import { useDispatch, useSelector } from 'react-redux'
import EncryptedStorage from 'react-native-encrypted-storage';
export default function index(props) {
    const dispatch = useDispatch()
    const reduxUser = useSelector(state => state.user.user.location)
    const reduxAuth = useSelector(state => state.auth.auth)
    const navigation = useNavigation();
    const [address, setAddress] = useState([])
    const [refreshControl, setRefreshControl] = useState(false)
    const [count, setcount] = useState(0)
    const [auth, setAuth] = useState(0)
    const [status, setStatus] = useState("Profile")

    useEffect(() => {
        setRefreshControl(false)
        getLocation()
        if (props.route.params && props.route.params.data) {
            setStatus(props.route.params.data)
        }
        console.log("🚀 ~ file: AddressScreen.js ~ line 34 ~ useEffect ~ props.route.params.data", props.route.params)

    }, [props])


    useFocusEffect(
        useCallback(() => {
            try {
                EncryptedStorage.getItem('token').then(res => {
                    if (res) {
                        setAuth(JSON.parse(res))
                    } else {
                        navigation.navigate(Login)
                    }
                })
            } catch (error) {
                console.log("🚀 ~ file: AddressScreen.js ~ line 59 ~ useEffect ~ error", error)
            }
            getItem()
            getData()
        }, []),
    );
    const onRefresh = useCallback(() => {
        setRefreshControl(false)
        getData()
    }, []);


    const getItem = async () => {
        // try {
        //     let response = await Storage.getToko()
        //     setAddress(response.lokasi)
        //     setToko(response)
        // } catch (error) {
        //     ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
        // }
    }

    const getData = async () => {
        try {
            ServiceUser.getProfile(reduxAuth).then(async res => {
                if (res) {
                    EncryptedStorage.setItem('user', JSON.stringify(res))
                    dispatch({ type: 'SET_USER', payload: res })

                } else {
                    let resp = await EncryptedStorage.getItem('user')
                    if (resp) {
                        dispatch({ type: 'SET_USER', payload: JSON.parse(resp) })
                    }
                }
            }).catch(async err => {
                let resp = await EncryptedStorage.getItem('user')
                if (resp) {
                    dispatch({ type: 'SET_USER', payload: JSON.parse(resp) })
                }
            })

        } catch (error) {

        }
    }

    const getLocation = () => {
        Service.getKecamatan().then((res) => {
            EncryptedStorage.setItem('kecamatanApi', JSON.stringify(res.kecamatan))
        });
    }

    const toggleSwitch = (idx) => {
        let arr = reduxUser;
        if (!arr[idx].is_primary) {
            arr[idx].is_primary = !arr[idx].is_primary;
            handleChangePrimary(arr[idx].id)
        }
        for (let index = 0; index < arr.length; index++) {
            if (index !== idx) {
                arr[index].is_primary = false
            }
        }
        setcount(count + 1)
        // setAddress(arr)

    }

    const handleChangePrimary = (addressId) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", auth);
        myHeaders.append("Content-Type", "application/json");
        console.log("🚀 ~ file: AddressScreen.js ~ line 90 ~ handleChangePrimary ~ addressId", addressId)

        console.log("🚀 ~ file: AddressScreen.js ~ line 96 ~ handleChangePrimary ~ auth", auth)
        var raw = JSON.stringify({
            "addressId": addressId
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/changePrimaryAddress", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    ServiceUser.getProfile(auth).then(res => {
                        if (res) {
                            EncryptedStorage.setItem('user', JSON.stringify(res))
                            dispatch({ type: 'SET_USER', payload: res })

                            if (props.route.params) {
                                ServiceCheckout.getCheckout(auth).then(reps => {
                                    if (reps) {
                                        dispatch({ type: 'SET_CHECKOUT', payload: reps })
                                        navigation.goBack()
                                    }
                                })
                            }
                        }
                    })
                }
                console.log("🚀 ~ file: AddressScreen.js ~ line 97 ~ handleChangePrimary ~ result", result)

            })
            .catch(error => console.log('error', error));
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => status === "checkout" ? handleChangePrimary(item.id) : navigation.navigate("AddAddress", { data: item, edit: true })} style={[style.column_start_center, styles.card]}>
                <View style={styles.body}>
                    <View style={style.row_between_center}>
                        <Text numberOfLines={1} style={[styles.textName, { width: '55%' }]}>{item.nama_penerima ? item.nama_penerima : ""}</Text>

                        {/* <TouchableOpacity onPress={() => console.log("pressed")}>
                            <Image style={styles.options} source={require('../../assets/icons/edit_pen.png')} />
                        </TouchableOpacity> */}
                        {status === "checkout" ?
                            <Text style={style.font_14}>{item.label}</Text>
                            :
                            <View style={[style.row_end_center, { width: '40%' }]}>
                                <Text adjustsFontSizeToFit numberOfLines={1} style={[style.font_12, { fontWeight: 'bold', color: item.is_primary ? colors.BlueJaja : colors.Silver }]}>Alamat utama</Text>
                                <Switch
                                    trackColor={{ false: "#767577", true: "#99e6ff" }}
                                    thumbColor={item.is_primary ? colors.BlueJaja : "#f4f3f4"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleSwitch(index)}
                                    value={item.is_primary} />
                            </View>
                        }
                    </View>
                    <Text adjustsFontSizeToFit style={styles.textNum}>{item.no_telepon ? item.no_telepon : ""}</Text>
                    <Paragraph numberOfLines={3} style={styles.textAlamat}>{item.provinsi + ", " + item.kota_kabupaten + ", " + item.kecamatan + ", " + item.kelurahan + ", " + item.kode_pos + ", " + item.alamat_lengkap}</Paragraph>
                    <View style={{ flex: 0, justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Text adjustsFontSizeToFit style={[styles.textAlamat, { fontSize: 12, textAlignVertical: "bottom", marginRight: '1%', fontFamily: 'serif', color: item.latitude ? colors.BlueJaja : colors.RedDanger }]}> {item.alamat_google ? "Lokasi sudah dipin" : "Lokasi belum dipin"}</Text>
                        <Image style={styles.map} source={require('../../assets/icons/google-maps.png')} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={style.appBar}>
                <View style={style.row_start_center}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
                    </TouchableOpacity>
                    <Text adjustsFontSizeToFit style={style.appBarText}> Alamat</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
                    <Image style={style.appBarButton} source={require('../../assets/icons/more.png')} />
                </TouchableOpacity>
            </Appbar.Header>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
                }
                contentContainerStyle={{ paddingHorizontal: '4%', paddingBottom: '15%', paddingTop: '4%' }}>
                <FlatList
                    data={reduxUser}
                    keyExtractor={(item, idx) => String(idx)}
                    renderItem={renderItem}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White, justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 1,
        marginBottom: '3%'
    },
    maps: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    map: { width: 21, height: 21, marginRight: '0%' },
    options: { width: 19, height: 19, marginRight: '0%', tintColor: colors.BlackGrey },

    buttonMaps: { flex: 0, borderRadius: 20 },
    body: { width: "100%", flex: 1, justifyContent: 'flex-start', backgroundColor: colors.White, paddingVertical: '4%', paddingHorizontal: '3%', },
    form: { flex: 0, flexDirection: 'column', paddingVertical: '1%', marginBottom: '3%' },
    textAlamat: { fontSize: 14, fontWeight: '500', color: colors.BlackGrayScale, margin: 0, fontFamily: 'notoserif' },
    textName: { fontSize: 14, color: colors.BlueJaja, fontWeight: 'bold' },
    textNum: { fontSize: 13, color: colors.BlueJaja, fontWeight: '900' },

})
