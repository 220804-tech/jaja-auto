import React, { useState, useEffect, useCallback, createRef, useRef } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image, RefreshControl, Alert, ToastAndroid, TouchableHighlight, TouchableWithoutFeedback, StatusBar, Platform, } from "react-native";
import { Paragraph, Switch, Appbar, Button, TouchableRipple, Checkbox } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors, styles as style, ServiceUser, ServiceCheckout, Loading, Hp, Utils } from "../../export";
import * as Service from "../../services/Address";
import { useDispatch, useSelector } from "react-redux";
import EncryptedStorage from "react-native-encrypted-storage";
import Swipeable from "react-native-swipeable";
// import { StatusBar } from 'native-base';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";

export default function AddressScreen(props) {
    const dispatch = useDispatch();
    const reduxUser = useSelector((state) => state.user.user.location);
    const reduxAuth = useSelector((state) => state.auth.auth);
    const navigation = useNavigation();
    const [refreshControl, setRefreshControl] = useState(false);
    const [count, setcount] = useState(0);
    const [count2, setcount2] = useState(0);
    const [status, setStatus] = useState("Profile");
    const [itemSelected, setSelectedItem] = useState({});
    const [loading, setLoading] = useState(false);
    const reduxUseCoin = useSelector((state) => state.checkout.useCoin);

    const address = props.route.params?.address

    useEffect(() => {
        try {
            setRefreshControl(false);
            getLocation();
            if (props.route.params && props.route.params.data) {
                setStatus(props.route.params.data);
            }
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        } catch (error) {
            console.log(error.message)
        }
    }, [props]);

    useFocusEffect(
        useCallback(() => {
            try {
                if (!reduxAuth) {
                    navigation.navigate(Login);
                }
            } catch (error) {
                console.log("🚀 ~ file: AddressScreen.js ~ line 59 ~ useEffect ~ error", error.message);
            }
            getData();
        }, [count])
    );
    const onRefresh = useCallback(() => {
        setRefreshControl(false);
        navigation.navigate("Address");
        setcount(count + 1);
    }, []);

    const getData = async () => {
        try {
            ServiceUser.getProfile(reduxAuth)
                .then(async (res) => {
                    dispatch({ type: "SET_USER", payload: {} });
                    if (res) {
                        EncryptedStorage.setItem("user", JSON.stringify(res));
                        dispatch({ type: "SET_USER", payload: res });
                        setcount2(count2 + 1);
                    } else {
                        let resp = await EncryptedStorage.getItem("user");
                        if (resp) {
                            dispatch({ type: "SET_USER", payload: JSON.parse(resp) });
                        }
                    }
                })
                .catch(async (error) => {
                    console.log(error.message)
                    let resp = await EncryptedStorage.getItem("user");
                    if (resp) {
                        dispatch({ type: "SET_USER", payload: JSON.parse(resp) });
                    }
                });
        } catch (error) {
            console.log("🚀 ~ file: AddressScreen.js ~ line 79 ~ getData ~ error", error.message)

        }
    };

    const handleBack = () => {
        navigation.goBack();
        // ServiceCheckout.getCheckout(reduxAuth, reduxUseCoin ? 1 : 0).then(reps => {
        //     if (reps) {
        //         dispatch({ type: 'SET_CHECKOUT', payload: reps })
        //     }
        // })
        // ServiceCheckout.getShipping(reduxAuth, 0).then(res => {
        //     console.log("🚀 ~ file: TrolleyScreen.js ~ line 161 ~ ServiceCheckout.getShipping ~ res", res)
        //     if (res) {
        //         dispatch({ type: 'SET_SHIPPING', payload: res })
        //     }
        // })
    };

    const getLocation = () => {
        setLoading(true);
        Service.getKecamatan().then((res) => {
            EncryptedStorage.setItem("kecamatanApi", JSON.stringify(res.kecamatan));
        });
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    };

    const toggleSwitch = (idx) => {
        try {
            let arr = reduxUser;
            if (!arr[idx].is_primary) {
                arr[idx].is_primary = !arr[idx].is_primary;
                handleChangePrimary(arr[idx].id);
            }
            for (let index = 0; index < arr.length; index++) {
                if (index !== idx) {
                    arr[index].is_primary = false;
                }
            }
            setcount(count + 1);
        } catch (error) {
            console.log(error.message)
            Utils.alertPopUp(
                String(error.message) + "\n" + "Error with status code : 129872"
            );
        }
        // setAddress(arr)
    };

    const handleChangePrimary = (addressId) => {
        setRefreshControl(true);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            addressId: addressId,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://jaja.id/backend/user/changePrimaryAddress", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setRefreshControl(false);
                if (result.status.code === 200) {
                    ServiceUser.getProfile(reduxAuth).then((res) => {
                        if (res) {
                            EncryptedStorage.setItem("user", JSON.stringify(res));
                            dispatch({ type: "SET_USER", payload: res });
                            if (props.route.params) {
                                handleBack();
                            }
                        }
                        setRefreshControl(false);
                    });
                } else {
                    Alert.alert(
                        "Jaja.id",
                        String(result.status.message) + " => " + String(result.status.code),
                        [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                            },
                        ]
                    );
                }
            })
            .catch((error) => {
                console.log(error.message)
                setLoading(false);
                Alert.alert("Jaja.id", String(error.message), [
                    {
                        text: "TUTUP",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                ]);
            });
    };

    const handleDelete = (item) => {
        swipeRef.recenter();

        Alert.alert(
            "Peringatan!",
            "Anda ingin menghapus alamat?",
            [
                {
                    text: "BATAL",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Hapus",
                    onPress: () => {
                        setLoading(true);
                        ServiceUser.deleteAddress(reduxAuth, itemSelected.id).then(
                            (res) => {
                                console.log(
                                    "🚀 ~ file: AddressScreen.js ~ line 224 ~ ServiceUser.deleteAddress ~ res",
                                    res
                                );
                                if (res && res.status && res.status === 200) {
                                    ToastAndroid.show(
                                        "Alamat berhasil dihapus.",
                                        ToastAndroid.LONG,
                                        ToastAndroid.CENTER
                                    );
                                }
                                getData();
                                setTimeout(() => setLoading(false), 1000);
                            }
                        );
                        setTimeout(() => setLoading(false), 3000);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleSelectedMultiDrop = (idAddress) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "id_cart": props.route.params.cartId,
            "id_alamat_multi_drop": idAddress
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/cart/insert_cart_multidrop", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    navigation.goBack()
                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 122013')
                }
            })
            .catch(error => {
                Utils.handleError(error.message, 'Error with status code : 12202')
            });
    }

    const renderItem = ({ item, index }) => {
        let selectedMultidrop = Boolean(JSON.stringify(address?.receiverName) === JSON.stringify(item.id) ? true : false)
        return (
            // <Swipeable
            //     rightButtons={rightButtons}
            //     onRightActionRelease={() => {
            //         setSelectedItem(item)
            //     }}
            // >
            <TouchableRipple
                disabled={status === 'multidrop' ? true : false}
                rippleColor={colors.BlueJaja}
                onPress={() => {
                    if (status !== "multidrop") {
                        navigation.navigate("AddAddress", { data: item, edit: true });
                    }
                }}
                style={[style.column_start_center, styles.card]}
            >
                <View style={styles.body}>
                    <View style={style.row_between_center}>
                        <Text numberOfLines={1} style={[styles.textName, { width: "55%" }]}>
                            {item.nama_penerima ? item.nama_penerima : ""}
                        </Text>
                        {status === "checkout" ? (
                            <Button
                                mode="contained"
                                color={colors.BlueJaja}
                                labelStyle={[
                                    style.font_10,
                                    style.T_semi_bold,
                                    { color: colors.White },
                                ]}
                                onPress={() => handleChangePrimary(item.id)}>
                                Pilih Alamat
                            </Button>
                        ) : status === "multidrop" ?
                            // !selectedMultidrop ?
                            !JSON.stringify(address).includes(String(item.id)) ?
                                < TouchableRipple
                                    onPress={() => handleSelectedMultiDrop(item.id)}
                                    disabled={selectedMultidrop}
                                    style={[
                                        style.row_center,
                                        style.px_3,
                                        style.py_2,
                                        {
                                            borderRadius: 5,
                                            backgroundColor: selectedMultidrop ? colors.Silver : colors.BlueJaja,
                                        },
                                    ]}
                                >
                                    <Text style={[style.font_11, style.T_semi_bold, style.mr_5, { color: colors.White }]}>
                                        Pilih Alamat
                                    </Text>
                                </TouchableRipple>
                                : null

                            // : null
                            : (
                                <View style={[style.row_end_center, { width: "40%" }]}>
                                    <Text
                                        adjustsFontSizeToFit
                                        numberOfLines={1}
                                        style={[
                                            style.font_12,
                                            {
                                                fontFamily: "SignikaNegative-Medium",
                                                color: item.is_primary ? colors.BlueJaja : colors.Silver,
                                                marginRight: Platform.OS === "ios" ? "3%" : "0%",
                                            },
                                        ]}
                                    >
                                        Alamat utama
                                    </Text>
                                    {reduxUser && reduxUser.length > 1 ? (
                                        <Switch
                                            trackColor={{ false: "#767577", true: "#99e6ff" }}
                                            thumbColor={item.is_primary ? colors.BlueJaja : "#f4f3f4"}
                                            ios_backgroundColor="#ffff"
                                            onValueChange={() => toggleSwitch(index)}
                                            value={item.is_primary}
                                        />
                                    ) : null}
                                </View>
                            )}
                    </View>
                    <Text adjustsFontSizeToFit style={styles.textNum}>
                        {item.no_telepon ? item.no_telepon : ""}
                    </Text>
                    <Paragraph numberOfLines={3} style={styles.textAlamat}>
                        {item.provinsi +
                            ", " +
                            item.kota_kabupaten +
                            ", " +
                            item.kecamatan +
                            ", " +
                            item.kelurahan +
                            ", " +
                            item.kode_pos +
                            ", " +
                            item.alamat_lengkap}
                    </Paragraph>
                    <View style={[style.row_between_center, style.mt_3]}>
                        <Text
                            style={[
                                style.font_12,
                                { color: colors.BlueJaja, fontFamily: "SignikaNegative-Regular" },
                            ]}
                        >
                            {item.label}
                        </Text>
                        <View
                            style={{
                                flex: 0,
                                justifyContent: "flex-end",
                                flexDirection: "row",
                            }}
                        >
                            <Text
                                adjustsFontSizeToFit
                                style={[
                                    styles.textAlamat,
                                    {
                                        fontSize: 12,
                                        textAlignVertical: "bottom",
                                        marginRight: "1%",
                                        fontFamily: "SignikaNegative-Regular",
                                        color: item.latitude ? colors.BlueJaja : colors.RedDanger,
                                    },
                                ]}
                            >
                                {" "}
                                {item.alamat_google
                                    ? "Lokasi sudah dipin"
                                    : "Lokasi belum dipin"}
                            </Text>
                            <Image
                                style={styles.map}
                                source={require("../../assets/icons/google-maps.png")}
                            />
                        </View>
                    </View>
                </View>
            </TouchableRipple >
            // </Swipeable >
        );
    };

    return (
        <SafeAreaView
            style={[style.container, { backgroundColor: colors.BlueJaja }]}>
            <StatusBar
                translucent={false}
                backgroundColor={colors.BlueJaja}
                barStyle="light-content"
            />

            {loading ? <Loading /> : null}
            <Appbar.Header style={[style.appBar, { elevation: 0 }]}>
                <View style={style.row_start_center}>
                    <TouchableOpacity onPress={handleBack}>
                        <Image
                            style={style.appBarButton}
                            source={require("../../assets/icons/arrow.png")}
                        />
                    </TouchableOpacity>
                    <Text adjustsFontSizeToFit style={style.appBarText}>
                        {" "}
                        Alamat
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("AddAddress")}>
                    <Image
                        style={style.appBarButton}
                        source={require("../../assets/icons/more.png")}
                    />
                </TouchableOpacity>
            </Appbar.Header>
            <View style={style.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshControl} onRefresh={onRefresh} />
                    }
                    style={{ backgroundColor: colors.White }}
                    contentContainerStyle={{ paddingBottom: "15%" }}
                >
                    {reduxUser && reduxUser.length ? (
                        <FlatList
                            data={reduxUser}
                            keyExtractor={(item, idx) => String(idx)}
                            renderItem={renderItem}
                        />
                    ) : (
                        <Text
                            style={[
                                style.font_14,
                                style.my_5,
                                style.py_5,
                                { alignSelf: "center" },
                            ]}
                        >
                            Alamat kamu masih kosong!
                        </Text>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.White,
        justifyContent: "flex-start",
        elevation: 1,
        // marginBottom: '3%'
    },
    maps: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    map: { width: 21, height: 21, marginRight: "0%" },
    options: {
        width: 19,
        height: 19,
        marginRight: "0%",
        tintColor: colors.BlackGrey,
    },

    buttonMaps: { flex: 0, borderRadius: 20 },
    body: {
        width: "100%",
        flex: 1,
        justifyContent: "flex-start",
        paddingVertical: "4%",
        paddingHorizontal: "3%",
        marginBottom: "2%",
    },
    form: {
        flex: 0,
        flexDirection: "column",
        paddingVertical: "1%",
        marginBottom: "3%",
    },
    textAlamat: {
        fontSize: 14,
        color: colors.BlackGrayScale,
        margin: 0,
        fontFamily: "SignikaNegative-Regular",
    },
    textName: {
        fontSize: 16,
        color: colors.BlueJaja,
        fontFamily: "SignikaNegative-SemiBold",
    },
    textNum: {
        fontSize: 13,
        color: colors.BlueJaja,
        fontFamily: "SignikaNegative-Regular",
    },
});
