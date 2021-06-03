// import React, { useEffect, useState, createRef } from 'react'
// import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, ScrollView, FlatList, SafeAreaView, Alert } from 'react-native'
// import { styles as style, Wp, Hp, colors, useNavigation, Loading } from '../../export'
// import MapView, { ProviderPropType, Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
// import ActionSheet from 'react-native-actions-sheet';
// import * as Service from '../../services/Address';
// // import Maps from './map'
// // import AsyncStorage from '@react-native-community/async-storage';
// import { Appbar, Button } from 'react-native-paper';
// import { useSelector } from 'react-redux'

// export default function edit(props) {
//     const navigation = useNavigation();
//     const reduxToken = useSelector(state => state.auth.auth)
//     const actionSheetKecamatan = createRef();
//     const actionSheetKelurahan = createRef();
//     const actionSheetRef = createRef();

//     const [idToko, setIdToko] = useState(false)

//     const [showButton, setshowButton] = useState(false)
//     const [status, setStatus] = useState("edit")
//     const [openActionsheet, setopenActionsheet] = useState("")

//     const [address, setAddress] = useState(props.route.params.data)
//     const [kecamatan, setkecamatan] = useState([])
//     const [kecamatanApi, setkecamatanApi] = useState([])
//     const [kelurahan, setkelurahan] = useState([])
//     const [kelurahanApi, setkelurahanApi] = useState([])

//     const [alamat, setalamat] = useState(props.route.params.data.alamat_lengkap)
//     const [alamatGoogle, setalamatGoogle] = useState(props.route.params.data.alamat_google === null ? "" : props.route.params.data.alamat_google)
//     const [loading, setLoading] = useState(false)

//     const [alertTextAlamat, setalertTextAlamat] = useState("")
//     const [kodePos, setkodePos] = useState(props.route.params.data.kode_pos)
//     const [alertTextkodePos, setalertTextkodePos] = useState("")
//     const [provinsiId, setprovinsiId] = useState("")
//     const [provValue, setprovValue] = useState("")

//     const [kabkotaId, setkabkotaId] = useState("")
//     const [kabkotaValue, setkabkotaValue] = useState("")

//     const [kecamatanId, setkecamatanId] = useState("")
//     const [alertTextKecamatan, setalertTextKecamatan] = useState("")
//     const [kelurahanId, setkelurahanId] = useState("")
//     const [alertTextKelurahan, setalertTextKelurahan] = useState("")
//     const [userId, setuserId] = useState("")
//     const [kcValue, setkcValue] = useState("")
//     const [kcColor, setkcColor] = useState(colors.BlackGrayScale)
//     const [klValue, setklValue] = useState("")
//     const [auth, setAuth] = useState("")

//     const [klColor, setklColor] = useState(colors.BlackGrayScale)
//     const [textInputColor, settextInputColor] = useState("#C0C0C0");
//     const [region, setRegion] = useState({
//         latitude: -6.2617525,
//         longitude: 106.8407469,
//         latitudeDelta: 0.0922 * 0.025,
//         longitudeDelta: 0.0421 * 0.025,
//     })

//     useEffect(() => {
//         setshowButton(false)
//         setkecamatanId(props.route.params.data.kecamatan_id)
//         setkelurahanId(props.route.params.data.kelurahan_id)
//         setkabkotaId(props.route.params.data.kota_kabupaten_id)
//         setprovinsiId(props.route.params.data.provinsi_id)
//         getItem()
//         if (props.handleSave) {
//             console.log(props.handleSave, "wakakak")
//             handleSave()
//         }
//     }, [props.handleSave])

//     const handleSave = () => {
//         if (kelurahanId === "") {
//             console.log("🚀 ~ file: edit.js ~ line 76 ~ handleSave ~ kelurahanId", kelurahanId)
//             Alert.alert(
//                 "Jaja.id",
//                 "Kelurahan tidak boleh kosong!",
//                 [
//                     { text: "OK", onPress: () => console.log("OK Pressed") }
//                 ],
//                 { cancelable: false }
//             );
//         } else if (kodePos === "") {
//             Alert.alert(
//                 "Jaja.id",
//                 "Kode pos tidak boleh kosong!",
//                 [
//                     { text: "OK", onPress: () => console.log("OK Pressed") }
//                 ],
//                 { cancelable: false }
//             );
//             console.log("🚀 ~ file: edit.js ~ line 79 ~ handleSave ~ kodePos", kodePos)
//         } else if (alamat === "") {
//             Alert.alert(
//                 "Jaja.id",
//                 "Alamat tidak boleh kosong!",
//                 [
//                     { text: "OK", onPress: () => console.log("OK Pressed") }
//                 ],
//                 { cancelable: false }
//             );
//         } else {
//             setLoading(true)
//             console.log("🚀 ~ file: edit.js ~ line 121 ~ handleSave ~ provinsiId", provinsiId)
//             var myHeaders = new Headers();
//             myHeaders.append("Authorization", reduxToken);
//             myHeaders.append("Content-Type", "application/json");
//             var raw = JSON.stringify({
//                 "id_toko": idToko,
//                 "provinsi": provinsiId,
//                 "kota_kabupaten": kabkotaId,
//                 "kecamatan": kecamatanId,
//                 "kelurahan": kelurahanId,
//                 "kode_pos": kodePos,
//                 "alamat_toko": alamat,
//                 "alamat_google": alamatGoogle,
//                 "latitude": region.latitude,
//                 "longitude": region.longitude
//             });

//             var requestOptions = {
//                 method: 'PUT',
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: 'follow'
//             };

//             fetch("https://jaja.id/backend/user/address", requestOptions)
//                 .then(response => response.json())
//                 .then(result => {
//                     console.log("🚀 ~ file: edit.js ~ line 101 ~ handleSave ~ result", result)

//                     if (result.status.code === 200) {
//                         // AsyncStorage.setItem('xxTwo', JSON.stringify(result.data.seller)).then(res => {
//                         //     setTimeout(() => setLoading(false), 200);
//                         //     setTimeout(() => navigation.goBack(), 250);
//                         // })
//                         // console.log("🚀 ~ file: edit.js ~ line 101 ~ handleSave ~ result", result)

//                     } else {
//                         setLoading(false)
//                         setTimeout(() => {
//                             Alert.alert(
//                                 "Jaja.id",
//                                 result.status.message + " " + result.status.code,
//                                 [
//                                     { text: "OK", onPress: () => console.log("OK Pressed") }
//                                 ],
//                                 { cancelable: false }
//                             );

//                         }, 200);
//                     }

//                 })
//                 .catch(error => {
//                     setLoading(false)
//                     setTimeout(() => {
//                         Alert.alert(
//                             "Jaja.id",
//                             String(error),
//                             [
//                                 { text: "OK", onPress: () => console.log("OK Pressed") }
//                             ],
//                             { cancelable: false }
//                         );

//                     }, 200);

//                 });


//         }
//     }

//     const getItem = () => {
//         try {
//             console.log("asaa")
//             Service.getKecamatan().then((res) => {
//                 console.log("🚀 ~ file: EditAddressScreen.js ~ line 173 ~ Service.getKecamatan ~ res", res.kecamatan.length)
//                 setkecamatan(res.kecamatan);
//                 setkecamatanApi(res.kecamatan)
//             });
//             Service.getKelurahan(address.kecamatan_kd).then(res => {
//                 console.log("🚀 ~ file: EditAddressScreen.js ~ line 177 ~ Service.getKelurahan ~ res", res.kelurahan.length)
//                 setkelurahan(res.kelurahan)
//                 setkelurahanApi(res.kelurahan)
//             })
//         } catch (error) {
//             console.log("🚀 ~ file: edit.js ~ line 109 ~ getItem ~ error", error)
//         }
//     };

//     const handleSelected = (name, value) => {
//         setshowButton(true)
//         console.log("handleSelected -> name, value", name, value)
//         if (name === "kecamatan") {
//             setprovinsiId(value.province_id)
//             setprovValue(value.province)
//             setkabkotaId(value.city_id)
//             setkabkotaValue(value.city)
//             setkecamatanId(value.kecamatan_id)
//             setkcValue(value.kecamatan)
//             setkcColor(colors.BlackGrayScale)
//             setklValue("Pilih kelurahan")
//             setkelurahanId("")
//             setklColor("#9A9A9A")

//             setalertTextKecamatan("")
//             actionSheetKecamatan.current?.setModalVisible(false)

//             Service.getKelurahan(value.kecamatan_kd).then(res => {
//                 console.log("handleSelected -> res", res)
//                 setkelurahan(res.kelurahan)
//                 setkelurahanApi(res.kelurahan)
//             })
//         } else if (name === "kelurahan") {
//             actionSheetKelurahan.current?.setModalVisible(false)
//             setkelurahanId(value.kelurahan_id)
//             console.log("handleSelected -> value.kelurahan_id", value.kelurahan_id)
//             setklValue(value.kelurahan_desa)
//             setklColor(colors.BlackGrayScale)
//             setalertTextKelurahan("")
//         }
//     }
//     const renderKecamatan = ({ item }) => {
//         return (
//             <TouchableOpacity onPress={() => handleSelected("kecamatan", item)} style={style.FL_TouchAble}>
//                 <Text style={style.FL_TouchAbleItem}>{item.city}, {item.kecamatan}</Text>
//             </TouchableOpacity>
//         )
//     }
//     const renderKelurahan = ({ item }) => {
//         return (
//             <TouchableOpacity onPress={() => handleSelected("kelurahan", item)} style={style.FL_TouchAble}>
//                 <Text style={style.FL_TouchAbleItem}>{item.kelurahan_desa}</Text>
//             </TouchableOpacity>
//         )
//     }

//     const handleSearch = (text, name) => {
//         console.log("🚀 ~ file: EditAddressScreen.js ~ line 239 ~ handleSearch ~ text", text)
//         if (name === "kecamatan") {
//             const beforeFilter = kecamatanApi;
//             const afterFilter = beforeFilter.filter((item) => {
//                 const itemData = `${item.province.toUpperCase()} ${item.city.toUpperCase()} ${item.kecamatan.toUpperCase()}`;
//                 const textData = text.toUpperCase();
//                 return itemData.indexOf(textData) > -1;
//             })
//             setkecamatan(afterFilter);
//         } else {
//             const beforeFilter = kelurahanApi;
//             const afterFilter = beforeFilter.filter(kel => kel.kelurahan_desa.toLowerCase().indexOf(text.toLowerCase()) > -1);
//             setkelurahan(afterFilter)
//         }
//     };

//     const handleStatus = (e) => setStatus(e)

//     const handleAlamat = (data) => {
//         console.log("🚀 ~ file: edit.js ~ line 162 ~ handleAlamat ~ data", data)
//         setRegion(data.region)
//         setalamatGoogle(data.alamatGoogle)
//         setshowButton(true)
//     }

//     const handleUpdate = () => {
//         setshowButton(true)
//         console.log("🚀 ~ file: edit.js ~ line 182 ~ handleUpdate ~ handleUpdate", kodePos)
//         if (openActionsheet === "Kode Pos") {
//             if (String(kodePos).length <= 0) {
//                 setkodePos(props.route.params.data.kode_pos)
//             }
//         }
//     }

//     return (
//         <SafeAreaView style={style.container}>
//             {loading ? <Loading /> : null}
//             {status === "edit" ?
//                 <>
//                     <Appbar.Header style={style.appBar}>
//                         <View style={style.row_start_center}>
//                             <TouchableOpacity onPress={() => navigation.goBack()}>
//                                 <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
//                             </TouchableOpacity>
//                             <Text style={style.appBarText}>Atur Alamat</Text>
//                         </View>
//                         {showButton ? <Button mode="text" color={colors.White} onPress={handleSave}>Simpan</Button> : null}
//                     </Appbar.Header>
//                     <View style={[style.column_start_center, { padding: '4%', backgroundColor: colors.White }]}>
//                         <TouchableWithoutFeedback onPress={() => handleEdit("Nama Lengkap")}>
//                             <View style={styles.form}>
//                                 <Text style={styles.formTitle}>Provinsi</Text>
//                                 <View style={styles.formItem}>
//                                     <Text style={styles.formPlaceholder}>{provValue === "" ? address.provinsi : provValue}</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <TouchableWithoutFeedback onPress={() => console.log("Pressed")}>
//                             <View style={styles.form}>
//                                 <Text style={styles.formTitle}>Kabupaten/Kota</Text>
//                                 <View style={styles.formItem}>
//                                     <Text style={styles.formPlaceholder}>{kabkotaValue === "" ? address.kota_kabupaten : kabkotaValue}</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <TouchableWithoutFeedback onPress={() => actionSheetKecamatan.current?.setModalVisible(true)}>
//                             <View style={styles.form}>
//                                 <Text style={styles.formTitle}>Kecamatan</Text>
//                                 <View style={styles.formItem}>
//                                     <Text style={styles.formPlaceholder}>{kcValue === "" ? address.kecamatan : kcValue}</Text>
//                                     <Text style={styles.ubah}>Ubah</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <TouchableWithoutFeedback onPress={() => actionSheetKelurahan.current?.setModalVisible(true)}>
//                             <View style={styles.form}>
//                                 <Text style={styles.formTitle}>Kelurahan</Text>
//                                 <View style={styles.formItem}>
//                                     <Text style={[styles.formPlaceholder, { color: klColor }]}>{klValue === "" ? address.kelurahan : klValue}</Text>
//                                     <Text style={styles.ubah}>Ubah</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <TouchableWithoutFeedback>
//                             <View style={styles.form}>
//                                 <Text style={styles.formTitle}>Kode Pos</Text>
//                                 <View style={styles.formItem}>
//                                     {/* <Text style={styles.formPlaceholder}>{kodePos ? kodePos : "Input kode pos"}</Text> */}
//                                     <TextInput
//                                         style={styles.inputbox}
//                                         placeholder="Input Kode Pos"
//                                         value={kodePos}
//                                         onFocus={() => settextInputColor(colors.BlueJaja)}
//                                         onBlur={() => settextInputColor('#C0C0C0')}
//                                         keyboardType="numeric"
//                                         maxLength={6}
//                                         onChangeText={(text) => setkodePos(text)}
//                                         theme={{
//                                             colors: {
//                                                 primary: colors.BlueJaja,
//                                             },
//                                         }}
//                                     />
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         {/* <TouchableWithoutFeedback onPress={() => setopenActionsheet("Alamat") & actionSheetRef.current?.setModalVisible(true)}>
//                             <View style={[styles.form, { marginBottom: '0%' }]}>
//                                 <Text style={styles.formTitle}>Alamat</Text>
//                                 <View style={[styles.formItem, { padding: '0%' }]}>
//                                     <Text style={styles.formPlaceholder} numberOfLines={1}>{alamat}</Text>
//                                     <Text style={styles.ubah}>Ubah</Text>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback> */}
//                         <TouchableWithoutFeedback>
//                             <View style={[styles.form, { marginBottom: '0%' }]}>
//                                 <Text style={styles.formTitle}>Alamat</Text>
//                                 <View style={[styles.formItem, { padding: '0%' }]}>
//                                     <TextInput
//                                         style={styles.inputbox}
//                                         placeholder="Input Alamat"
//                                         value={alamat}
//                                         onFocus={() => settextInputColor(colors.BlueJaja)}
//                                         onBlur={() => settextInputColor('#C0C0C0')}
//                                         keyboardType="default"
//                                         maxLength={100}
//                                         onChangeText={(text) => setalamat(text)}
//                                         theme={{
//                                             colors: {
//                                                 primary: colors.BlueJaja,
//                                             },
//                                         }}
//                                     />
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                         <View onPress={() => setStatus("map")} style={[style.row_start_center, { flex: 0, marginTop: '5%' }]}>
//                             <View style={styles.maps}>
//                                 <MapView
//                                     onPress={() => setStatus("map")}
//                                     style={{ flex: 1 }}
//                                     // onRegionChangeComplete={onRegionChange}
//                                     region={region}>
//                                     <Marker
//                                         coordinate={region}
//                                     />
//                                 </MapView>
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 {alamatGoogle === "" ?
//                                     <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: colors.RedDanger, fontFamily: 'serif' }}>Lokasi belum dipin</Text>
//                                     :
//                                     <Text onPress={() => setStatus("map")} style={{ fontSize: 14, color: colors.BlackGrayScale, fontFamily: 'serif', borderBottomWidth: 0.5 }}>{alamatGoogle}</Text>
//                                 }
//                             </View>
//                         </View>
//                     </View>
//                 </>
//                 : <Text>Maps</Text>
//                 // <Maps data={address} handleAlamat={handleAlamat} status={handleStatus} />
//             }

//             <ActionSheet containerStyle={{ paddingHorizontal: '4%', flexDirection: 'column' }} ref={actionSheetKecamatan}>
//                 <View style={[style.row_between_center, { paddingVertical: '4%' }]}>
//                     <Text style={style.actionSheetTitle}>Kecamatan</Text>
//                     <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
//                         <Image
//                             style={style.icon_16}
//                             source={require('../../assets/icons/close.png')}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={[style.searchBar, { height: Hp('6%]'), width: Wp('92%'), backgroundColor: "#D3D3D3" }]}>
//                     <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.BlackGrey }} />
//                     <TextInput keyboardType="name-phone-pad" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={style.font_14} placeholder='Cari kecamatan..' onChangeText={(value) => handleSearch(value, "kecamatan")}></TextInput>
//                 </TouchableOpacity>
//                 {/* <View style={style.search}>
//                     <View style={{ height: '100%', width: '6%', marginRight: '1%' }}>
//                         <Image
//                             source={require('../../assets/icons/loupe.png')}
//                             style={{
//                                 height: undefined,
//                                 width: undefined,
//                                 flex: 1,
//                                 resizeMode: 'contain',
//                                 tintColor: 'grey',
//                             }}
//                         />
//                     </View>
//                     <TextInput
//                         placeholder="Cari kecamatan"
//                         style={{ flex: 1, paddingLeft: 10 }}
//                         onChangeText={(text) => handleSearch(text, "kecamatan")}
//                     />
//                 </View> */}
//                 <View style={{ height: Hp('50%'), paddingHorizontal: Wp('2%') }}>
//                     <ScrollView style={{ flex: 1 }}>
//                         <FlatList
//                             data={kecamatan.slice(0, 50)}
//                             renderItem={renderKecamatan}
//                             keyExtractor={item => item.id_data}
//                         />

//                     </ScrollView>
//                 </View>
//             </ActionSheet>
//             <ActionSheet containerStyle={{ padding: '4%' }} ref={actionSheetKelurahan}>
//                 <View style={[style.row_between_center, { paddingVertical: '4%' }]}>
//                     <Text style={style.actionSheetTitle}>Kelurahan</Text>
//                     <TouchableOpacity onPress={() => actionSheetKecamatan.current?.setModalVisible(false)}>
//                         <Image
//                             style={style.icon_16}
//                             source={require('../../assets/icons/close.png')}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableOpacity style={[style.searchBar, { height: Hp('6%]'), width: Wp('92%'), backgroundColor: "#D3D3D3" }]}>
//                     <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%', tintColor: colors.BlackGrey }} />
//                     <TextInput keyboardType="name-phone-pad" autoFocus={true} returnKeyType="search" adjustsFontSizeToFit style={style.font_14} placeholder='Cari kelurahan..' onChangeText={(text) => handleSearch(text, "kelurahan")}>
//                     </TextInput>
//                 </TouchableOpacity>
//                 <View style={{ height: Hp('50%'), paddingHorizontal: Wp('2%') }}>
//                     <ScrollView style={{ flex: 1 }}>
//                         <FlatList
//                             data={kelurahan.slice(0, 100)}
//                             renderItem={renderKelurahan}
//                             keyExtractor={item => item.kelurahan_id}
//                         />
//                     </ScrollView>
//                 </View>
//             </ActionSheet>
//             <ActionSheet onClose={handleUpdate} footerHeight={80} containerStyle={{ padding: '4%' }}
//                 ref={actionSheetRef}>
//                 <View style={style.row_between_center}>
//                     <Text style={style.actionSheetTitle}>{openActionsheet === "Kode Pos" ? "Atur Kode Pos" : "Atur Alamat"}</Text>
//                     <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
//                         <Image
//                             style={style.icon_16}
//                             source={require('../../assets/icons/close.png')}
//                         />
//                     </TouchableOpacity>
//                 </View>
//                 <View style={styles.actionSheetBody}>
//                     <View style={styles.form}>
//                         <Text style={styles.formTitle}>{openActionsheet}</Text>
//                         <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
//                             {openActionsheet === "Kode Pos" ?

//                                 <TextInput
//                                     style={styles.inputbox}
//                                     placeholder="Input Kode Pos"
//                                     value={kodePos}
//                                     onFocus={() => settextInputColor(colors.BlueJaja)}
//                                     onBlur={() => settextInputColor('#C0C0C0')}
//                                     keyboardType="number-pad"
//                                     maxLength={6}
//                                     onChangeText={(text) => setkodePos(text)}
//                                     theme={{
//                                         colors: {
//                                             primary: colors.BlueJaja,
//                                         },
//                                     }}
//                                 /> :
//                                 <TextInput
//                                     style={styles.inputbox}
//                                     placeholder="Input Alamat"
//                                     value={alamat}
//                                     onFocus={() => settextInputColor(colors.BlueJaja)}
//                                     onBlur={() => settextInputColor('#C0C0C0')}
//                                     keyboardType="default"
//                                     maxLength={100}
//                                     onChangeText={(text) => setalamat(text)}
//                                     theme={{
//                                         colors: {
//                                             primary: colors.BlueJaja,
//                                         },
//                                     }}
//                                 />
//                             }
//                             {/* <Image /> */}
//                         </View>
//                     </View>
//                 </View>
//             </ActionSheet>
//         </SafeAreaView >
//     )
// }

// const styles = StyleSheet.create({
//     map: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },

//     maps: { width: Wp('21%'), height: Wp('21%'), marginRight: '3%' },
//     inputbox: {
//         width: '100%',
//         backgroundColor: 'transparent',
//         color: 'black',
//         padding: 0
//     },
//     actionSheetBody: {
//         flex: 1, justifyContent: 'center', paddingVertical: '3%'
//     },
//     form: {
//         flex: 0,
//         flexDirection: 'column',
//         paddingVertical: '1%',
//         marginBottom: '3%',
//         width: '100%'
//     },
//     formPlaceholder: {
//         fontSize: 14, fontWeight: '900', color: colors.BlackGrayScale, flex: 1
//     },
//     // '#C7C7CD'
//     formItem: {
//         flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
//     },
//     formTitle: {
//         fontSize: 14, fontWeight: '900', color: 'grey'
//     },
//     avatar: {
//         width: 130,
//         height: 130,
//         borderRadius: 63,
//         borderWidth: 4,
//         borderColor: "white",
//         marginBottom: 10,
//         alignSelf: 'center',
//         position: 'absolute',
//         marginTop: 95
//     },
//     body: {
//         flex: 1, flexDirection: "column"
//     },
//     card: { padding: '4%', marginBottom: '2%' },
//     imageHeader: {
//         height: '30%',
//         width: '100%',
//         opacity: 1,
//     },
//     header: {
//         height: Hp('20%'),
//         flex: 0,
//         flexDirection: 'column',
//         backgroundColor: colors.BlueJaja,
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//         opacity: 0.95,
//     },
//     ubah: {
//         flex: 0,
//         color: colors.BlueJaja,
//         fontWeight: 'bold',
//         elevation: 1
//     },
//     actionSheetBody: {
//         flex: 1, justifyContent: 'center', paddingVertical: '3%'
//     },
// })
import React from 'react'
import { View, Text } from 'react-native'

export default function EditAddressScreen() {
    return (
        <View>
            <Text></Text>
        </View>
    )
}
