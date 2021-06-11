import React, { useEffect, useState, createRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, ScrollView, FlatList, SafeAreaView, Alert, ToastAndroid } from 'react-native'
import { styles as style, Wp, Hp, colors, useNavigation, Loading, ServiceUser } from '../../export'
import MapView, { ProviderPropType, Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import ActionSheet from 'react-native-actions-sheet';
import * as Service from '../../services/Address';
import Maps from './Maps'
import { useDispatch, useSelector } from 'react-redux'
import { Appbar, Button } from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Checkbox } from 'react-native-paper';
export default function AddAddressScreen(props) {
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const actionSheetKecamatan = createRef();
    const actionSheetKelurahan = createRef();
    const actionSheetRef = createRef();

    const [idToko, setIdToko] = useState(false)
    const [checked, setChecked] = useState(true);
    const [showButton, setshowButton] = useState(false)
    const [status, setStatus] = useState("edit")
    const [view, setView] = useState("add")

    const [openActionsheet, setopenActionsheet] = useState("")

    const [address, setAddress] = useState("")
    const [kecamatan, setkecamatan] = useState([])
    const [kecamatanApi, setkecamatanApi] = useState([])
    const [kelurahan, setkelurahan] = useState([])
    const [kelurahanApi, setkelurahanApi] = useState([])

    const [namaPenerima, setnamaPenerima] = useState("")
    const [label, setlabel] = useState("Alamat Rumah")
    const [phoneNumber, setphoneNumber] = useState("")

    const [alamat, setalamat] = useState("")
    const [alamatGoogle, setalamatGoogle] = useState("")
    const [loading, setLoading] = useState(false)

    const [alertTextAlamat, setalertTextAlamat] = useState("")
    const [kodePos, setkodePos] = useState("")
    const [alertTextkodePos, setalertTextkodePos] = useState("")
    const [provinsiId, setprovinsiId] = useState("")
    const [provValue, setprovValue] = useState("")

    const [kabkotaId, setkabkotaId] = useState("")
    const [kabkotaValue, setkabkotaValue] = useState("")

    const [kecamatanId, setkecamatanId] = useState("")
    const [alertTextKecamatan, setalertTextKecamatan] = useState("")
    const [kelurahanId, setkelurahanId] = useState("")
    const [alertTextKelurahan, setalertTextKelurahan] = useState("")
    const [auth, setAuth] = useState("")
    const [kcValue, setkcValue] = useState("")
    const [kcColor, setkcColor] = useState(colors.Silver)
    const [klValue, setklValue] = useState("")
    const [klColor, setklColor] = useState(colors.Silver)
    const [textInputColor, settextInputColor] = useState("#C0C0C0");
    const [region, setRegion] = useState({
        latitude: Number(-6.2617525),
        longitude: Number(106.8407469),
        latitudeDelta: 0.0922 * 0.025,
        longitudeDelta: 0.0421 * 0.025,
    })

    useEffect(() => {

        if (props.route.params && props.route.params.edit) {
            let value = props.route.params.data;
            setnamaPenerima(value.nama_penerima)
            setphoneNumber(value.no_telepon)
            setprovValue(value.provinsi)
            setprovinsiId(value.provinsi_id)
            setkabkotaValue(value.kota_kabupaten)
            setkabkotaId(value.kota_kabupaten_id)
            setkcValue(value.kecamatan)
            setkecamatanId(value.kecamatan_id)
            setklValue(value.kelurahan_id)
            setkelurahanId(value.kelurahan_id)
            setkodePos(value.kode_pos)
            setlabel(value.label)
            setalamat(value.alamat_lengkap)
            setalamatGoogle(value.alamat_google)
            let reg = region;
            reg.latitude = Number(value.latitude)
            reg.longitude = Number(value.longitude)
            setRegion(reg)
            Service.getKelurahan(value.kecamatan_kd).then(res => {
                console.log("handleSelected -> res", res)
                setkelurahan(res.kelurahan)
                setkelurahanApi(res.kelurahan)
            })
            setView("edit")
        } else {
            setView("add")
        }
        setshowButton(false)
        setLoading(false)
        EncryptedStorage.getItem("token").then(res => {
            if (res) {
                setAuth(JSON.parse(res))
            } else {
                navigation.navigate('Login')
            }
        })
        getItem()
        if (props.handleSave) {
            console.log(props.handleSave, "wakakak")
            handleSave()
        }
    }, [props.handleSave, props.edit])

    const handleSave = () => {
        if (!namaPenerima) {
            Alert.alert(
                "Jaja.id",
                "Nama penerima tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else if (!phoneNumber) {
            Alert.alert(
                "Jaja.id",
                "Nomor telephone tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
        else if (!kecamatanId) {
            console.log("🚀 ~ file: edit.js ~ line 76 ~ handleSave ~ kelurahanId", kelurahanId)
            Alert.alert(
                "Jaja.id",
                "Kecamatan tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
        else if (!kelurahanId) {
            console.log("🚀 ~ file: edit.js ~ line 76 ~ handleSave ~ kelurahanId", kelurahanId)
            Alert.alert(
                "Jaja.id",
                "Kelurahan tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else if (!kodePos) {
            Alert.alert(
                "Jaja.id",
                "Kode pos tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else if (!label) {
            Alert.alert(
                "Jaja.id",
                "Label tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
        else if (!alamat) {
            Alert.alert(
                "Jaja.id",
                "Alamat tidak boleh kosong!",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        } else {
            setLoading(true)

            var myHeaders = new Headers();
            myHeaders.append("Authorization", auth);
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=3r5o41qsf9o3huu04o4dru8b2tk823ag");

            var raw = {
                "label": label,
                "receiverName": namaPenerima,
                "phoneNumber": phoneNumber,
                "address": alamat,
                "addressGoogle": alamatGoogle,
                "latitude": region.latitude,
                "longitude": region.longitude,
                "provinceId": provinsiId,
                "cityId": kabkotaId,
                "districtId": kecamatanId,
                "subDistrictId": kelurahanId,
                "postalCode": kodePos
            }
            if (view === "edit") {
                raw.addressId = props.route.params.data.id
            }
            console.log("🚀 ~ file: AddAddressScreen.js ~ line 172 ~ handleSave ~ raw", raw)

            var requestOptions = {
                method: view === "edit" ? "PUT" : "POST",
                headers: myHeaders,
                body: JSON.stringify(raw),
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/address", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: AddAddressScreen.js ~ line 215 ~ handleSave ~ result", result)
                    if (result.status.code === 200) {
                        ServiceUser.getProfile(auth).then(res => {
                            if (res) {
                                EncryptedStorage.setItem('user', JSON.stringify(res))
                                dispatch({ type: 'SET_USER', payload: res })

                            }
                        })
                        setTimeout(() => setLoading(false), 1000);
                        setTimeout(() => navigation.goBack(), 1500);
                    } else {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message + " " + result.status.code,
                            [
                                { text: "OK", onPress: () => console.log("OK Pressed") }
                            ],
                            { cancelable: false }
                        );
                    }
                })
                .catch(error => {
                    console.log("🚀 ~ file: AddAddressScreen.js ~ line 237 ~ handleSave ~ error", error)
                    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                    setLoading(false)
                })



        }
    }

    const getItem = () => {
        EncryptedStorage.getItem('kecamatanApi').then(res => {
            if (res) {
                let data = JSON.parse(res)
                setkecamatan(data);
                setkecamatanApi(data)
            } else {
                getKecamatan()
            }
        }).catch(err => {
            getKecamatan()
        })
    };


    const getKecamatan = () => {
        Service.getKecamatan().then((res) => {
            setkecamatan(res.kecamatan);
            setkecamatanApi(res.kecamatan)
        });
    }

    const handleSelected = (name, value) => {
        setshowButton(true)
        console.log("handleSelected -> name, value", name, value)
        if (name === "kecamatan") {
            setprovinsiId(value.province_id)
            setprovValue(value.province)
            setkabkotaId(value.city_id)
            setkabkotaValue(value.city)
            setkecamatanId(value.kecamatan_id)
            setkcValue(value.kecamatan)
            setkcColor(colors.BlackGrayScale)
            setklValue("Pilih kelurahan")
            setkelurahanId("")
            setklColor(colors.BlackGrayScale)

            setalertTextKecamatan("")
            actionSheetKecamatan.current?.setModalVisible(false)

            Service.getKelurahan(value.kecamatan_kd).then(res => {
                console.log("handleSelected -> res", res)
                setkelurahan(res.kelurahan)
                setkelurahanApi(res.kelurahan)
            })
        } else if (name === "kelurahan") {
            actionSheetKelurahan.current?.setModalVisible(false)
            setkelurahanId(value.kelurahan_id)
            console.log("handleSelected -> value.kelurahan_id", value.kelurahan_id)
            setklValue(value.kelurahan_desa)
            setklColor(colors.BlackGrayScale)
            setalertTextKelurahan("")
        }
    }
    const renderKecamatan = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleSelected("kecamatan", item)} style={style.FL_TouchAble}>
                <Text style={style.FL_TouchAbleItem}>{item.city}, {item.kecamatan}</Text>
            </TouchableOpacity>
        )
    }
    const renderKelurahan = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleSelected("kelurahan", item)} style={style.FL_TouchAble}>
                <Text style={style.FL_TouchAbleItem}>{item.kelurahan_desa}</Text>
            </TouchableOpacity>
        )
    }

    const handleSearch = (text, name) => {
        console.log("🚀 ~ file: EditAddressScreen.js ~ line 239 ~ handleSearch ~ text", text)
        if (name === "kecamatan") {
            const beforeFilter = kecamatanApi;
            const afterFilter = beforeFilter.filter((item) => {
                const itemData = `${item.province.toUpperCase()} ${item.city.toUpperCase()} ${item.kecamatan.toUpperCase()}`;
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setkecamatan(afterFilter);
        } else {
            const beforeFilter = kelurahanApi;
            const afterFilter = beforeFilter.filter(kel => kel.kelurahan_desa.toLowerCase().indexOf(text.toLowerCase()) > -1);
            setkelurahan(afterFilter)
        }
    };

    const handleStatus = (e) => setStatus(e)

    const handleAlamat = (data) => {
        console.log("🚀 ~ file: edit.js ~ line 162 ~ handleAlamat ~ data", data)
        // setRegion(data.region)   
        setalamatGoogle(data.alamatGoogle)
        setshowButton(true)
    }

    const handleUpdate = () => {
        setshowButton(true)
        // console.log("🚀 ~ file: edit.js ~ line 182 ~ handleUpdate ~ handleUpdate", kodePos)
        // if (openActionsheet === "Kode Pos") {
        //     if (String(kodePos).length <= 0) {
        //         setkodePos(props.route.params.data.kode_pos)
        //     }
        // }
    }

    return (
        <SafeAreaView style={style.container}>
            {loading ? <Loading /> : null}
            {status === "edit" ?
                <>
                    <Appbar.Header style={style.appBar}>
                        <View style={style.row_start_center}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
                            </TouchableOpacity>
                            <Text style={style.appBarText}>{props.route.params && props.route.params.edit ? " Ubah Alamat" : "Tambah Alamat"}</Text>
                        </View>
                        {kcValue ? <Button mode="text" color={colors.White} onPress={handleSave}>Simpan</Button> : null}
                    </Appbar.Header>
                    <ScrollView>
                        <View style={[style.column_start_center, { padding: '4%', backgroundColor: colors.White }]}>
                            {/* <TouchableWithoutFeedback onPress={() => handleEdit("Nama Lengkap")}> */}
                            <TouchableWithoutFeedback>
                                <View style={[styles.form, { marginBottom: '0%' }]}>
                                    <Text style={styles.formTitle}>Nama penerima <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={[styles.formItem, { padding: '0%' }]}>
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Input nama penerima"
                                            value={namaPenerima}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="default"
                                            maxLength={100}
                                            onChangeText={(text) => setnamaPenerima(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={[styles.form, { marginBottom: '0%' }]}>
                                    <Text style={styles.formTitle}>Nomor Telephone <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={[styles.formItem, { padding: '0%' }]}>
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Input nomor telephone"
                                            value={phoneNumber}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="numeric"
                                            maxLength={100}
                                            onChangeText={(text) => setphoneNumber(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            {kcValue ?
                                <>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.form}>
                                            <Text style={[styles.formTitle, { color: kcValue ? colors.BlackGrayScale : colors.Silver }]}>Provinsi</Text>
                                            <View style={[styles.formItem, { borderBottomColor: colors.Silver }]}>
                                                <Text style={[styles.formPlaceholder, { color: kcValue ? colors.BlackGrayScale : colors.Silver }]}>{provValue ? provValue : "Provinsi"}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={() => console.log("Pressed")}>
                                        <View style={styles.form}>
                                            <Text style={[styles.formTitle, { color: kcValue ? colors.BlackGrayScale : colors.Silver }]}>Kabupaten/Kota</Text>
                                            <View style={[styles.formItem, { borderBottomColor: colors.Silver }]}>
                                                <Text style={[styles.formPlaceholder, { color: kcValue ? colors.BlackGrayScale : colors.Silver }]}>{kabkotaValue ? kabkotaValue : "Kabupaten/kota"}</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </>
                                : null}
                            <TouchableWithoutFeedback onPress={() => actionSheetKecamatan.current?.setModalVisible(true)}>
                                <View style={styles.form}>
                                    <Text style={styles.formTitle}>Kecamatan <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={styles.formItem}>
                                        <Text style={styles.formPlaceholder}>{kcValue === "" ? "Pilih kecamatan" : kcValue}</Text>
                                        <Text style={styles.ubah}>Ubah</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => actionSheetKelurahan.current?.setModalVisible(true)} disabled={kcValue ? false : true}>
                                <View style={styles.form}>
                                    <Text style={[styles.formTitle, { color: kcValue ? colors.BlackGrayScale : colors.Silver }]}>Kelurahan <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={[styles.formItem, { borderBottomColor: colors.Silver }]}>
                                        <Text style={[styles.formPlaceholder]}>{klValue === "" ? "Pilih kelurahan" : klValue}</Text>
                                        <Text style={styles.ubah}>Ubah</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={styles.form}>
                                    <Text style={styles.formTitle}>Kode Pos <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={styles.formItem}>
                                        {/* <Text style={styles.formPlaceholder}>{kodePos ? kodePos : "Input kode pos"}</Text> */}
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Input Kode Pos"
                                            value={kodePos}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="numeric"
                                            maxLength={6}
                                            onChangeText={(text) => setkodePos(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={[styles.form, { marginBottom: '0%' }]}>
                                    <Text style={styles.formTitle}>Label <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={[styles.formItem, { padding: '0%' }]}>
                                        <View style={style.row_around_center}>
                                            <Checkbox
                                                color={colors.BlueJaja}
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    setChecked(!checked);
                                                    setlabel("Alamat Rumah")
                                                }}
                                            />
                                            <Text style={[style.font_14]}>Alamat Rumah</Text>
                                        </View>
                                        <View style={style.row_around_center}>
                                            <Checkbox
                                                color={colors.BlueJaja}
                                                status={checked ? 'unchecked' : 'checked'}
                                                onPress={() => {
                                                    setChecked(!checked);
                                                    setlabel("Alamat Kantor")
                                                }}
                                            />
                                            <Text style={[style.font_14]}>Alamat Kantor</Text>
                                        </View>
                                        {/* <TextInput
                                            style={styles.inputbox}
                                            placeholder="Rumah/Kantor"
                                            value={label}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="default"
                                            maxLength={100}
                                            onChangeText={(text) => setlabel(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        /> */}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={[styles.form, { marginBottom: '0%' }]}>
                                    <Text style={styles.formTitle}>Alamat Lengkap <Text style={{ color: colors.RedDanger }}>*</Text></Text>
                                    <View style={[styles.formItem, { padding: '0%' }]}>
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Input Alamat"
                                            value={alamat}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="default"
                                            maxLength={100}
                                            onChangeText={(text) => setalamat(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View onPress={() => setStatus("map")} style={[style.row_start_center, { flex: 0, marginTop: '5%' }]}>
                                <View style={styles.maps}>
                                    <MapView
                                        onPress={() => setStatus("map")}
                                        style={{ flex: 1 }}
                                        // onRegionChangeComplete={onRegionChange}
                                        region={region}>
                                        <Marker
                                            coordinate={region}
                                        />
                                    </MapView>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {alamatGoogle === "" ?
                                        <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: colors.RedDanger, fontFamily: 'serif' }}>Lokasi belum dipin</Text>
                                        :
                                        <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: colors.BlackGrayScale, fontFamily: 'serif', borderBottomWidth: 0.5 }}>{alamatGoogle}</Text>
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </>
                :
                <Maps data={address} handleAlamat={handleAlamat} status={handleStatus} />
            }

            <ActionSheet containerStyle={{ paddingHorizontal: '4%', flexDirection: 'column' }} ref={actionSheetKecamatan}>
                <View style={[style.row_between_center, { paddingVertical: '4%' }]}>
                    <Text style={style.actionSheetTitle}>Kecamatan</Text>
                    <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
                        <Image
                            style={style.icon_16}
                            source={require('../../assets/icons/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[style.searchBar, { height: Hp('6%]'), width: Wp('92%'), backgroundColor: "#D3D3D3" }]}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.BlackGrey }} />
                    <TextInput keyboardType="name-phone-pad" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={style.font_14} placeholder='Cari kecamatan..' onChangeText={(value) => handleSearch(value, "kecamatan")}></TextInput>
                </TouchableOpacity>
                {/* <View style={style.search}>
                    <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
                        <Image
                            source={require('../../assets/icons/loupe.png')}
                            style={{
                                height: undefined,
                                width: undefined,
                                flex: 1,
                                resizeMode: 'contain',
                                tintColor: 'grey',
                            }}
                        />
                    </View>
                    <TextInput
                        placeholder="Cari kecamatan"
                        style={{ flex: 1, paddingLeft: 10 }}
                        onChangeText={(text) => handleSearch(text, "kecamatan")}
                    />
                </View> */}
                <View style={{ height: Hp('50%'), paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}>
                        <FlatList
                            data={kecamatan.slice(0, 50)}
                            renderItem={renderKecamatan}
                            keyExtractor={item => item.id_data}
                        />

                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet containerStyle={{ padding: '4%' }} ref={actionSheetKelurahan}>
                <View style={[style.row_between_center, { paddingVertical: '4%' }]}>
                    <Text style={style.actionSheetTitle}>Kelurahan</Text>
                    <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
                        <Image
                            style={style.icon_16}
                            source={require('../../assets/icons/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[style.searchBar, { height: Hp('6%]'), width: Wp('92%'), backgroundColor: "#D3D3D3" }]}>
                    <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.BlackGrey }} />
                    <TextInput keyboardType="name-phone-pad" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={style.font_14} placeholder='Cari kelurahan..' onChangeText={(text) => handleSearch(text, "kelurahan")}>
                    </TextInput>
                </TouchableOpacity>
                <View style={{ height: Hp('50%'), paddingHorizontal: Wp('2%') }}>
                    <ScrollView style={{ flex: 1 }}>
                        {kelurahan && kelurahan.length ?
                            <FlatList
                                data={kelurahan.slice(0, 100)}
                                renderItem={renderKelurahan}
                                keyExtractor={item => item.kelurahan_id}
                            /> : null
                        }
                    </ScrollView>
                </View>
            </ActionSheet>
            <ActionSheet onClose={handleUpdate} footerHeight={80} containerStyle={{ paddingHorizontal: '4%' }}
                ref={actionSheetRef}>
                <View style={style.row_between_center}>
                    <Text style={style.actionSheetTitle}>{openActionsheet === "Kode Pos" ? "Atur Kode Pos" : "Atur Alamat"}</Text>
                    <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
                        <Image
                            style={style.icon_16}
                            source={require('../../assets/icons/close.png')}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.actionSheetBody}>
                    <View style={styles.form}>
                        <Text style={styles.formTitle}>{openActionsheet}</Text>
                        <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                            {openActionsheet === "Kode Pos" ?
                                <TextInput
                                    style={styles.inputbox}
                                    placeholder="Input Kode Pos"
                                    value={kodePos}
                                    onFocus={() => settextInputColor(colors.BlueJaja)}
                                    onBlur={() => settextInputColor('#C0C0C0')}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    onChangeText={(text) => setkodePos(text)}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                /> :
                                <TextInput
                                    style={styles.inputbox}
                                    placeholder="Input Alamat"
                                    value={alamat}
                                    onFocus={() => settextInputColor(colors.BlueJaja)}
                                    onBlur={() => settextInputColor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={100}
                                    onChangeText={(text) => setalamat(text)}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                            }
                            {/* <Image /> */}
                        </View>
                    </View>
                </View>
            </ActionSheet>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

    maps: { width: Wp('21%'), height: Wp('21%'), marginRight: '3%' },
    inputbox: {
        width: '100%',
        backgroundColor: 'transparent',
        color: 'black', padding: 0
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
    form: {
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '1%',
        marginBottom: '3%',
        width: '100%'
    },
    formPlaceholder: {
        fontSize: 14, fontWeight: '900', color: colors.BlackGrayScale, flex: 1
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formTitle: {
        fontSize: 14, fontWeight: '900', color: 'grey'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 95
    },
    body: {
        flex: 1, flexDirection: "column"
    },
    card: { padding: '4%', marginBottom: '2%' },
    imageHeader: {
        height: '30%',
        width: '100%',
        opacity: 1,
    },
    header: {
        height: Hp('20%'),
        flex: 0,
        flexDirection: 'column',
        backgroundColor: colors.BlueJaja,
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.95,
    },
    ubah: {
        flex: 0,
        color: colors.BlueJaja,
        fontWeight: 'bold',
        elevation: 1
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
})
