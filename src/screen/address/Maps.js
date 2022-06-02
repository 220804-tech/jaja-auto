import React, { useState, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, Dimensions, Modal, Platform } from 'react-native'
import MapView from 'react-native-maps';
import { Appbar, Button, TouchableRipple } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import { colors, styles as style, Wp, Hp, useFocusEffect, Utils, Loading } from '../../export';
const { width, height } = Dimensions.get('screen')
import Geolocation from '@react-native-community/geolocation';

export default function map(props) {

    const actionSheetRef = createRef();
    const [showFooter, setshowFooter] = useState(false)
    const [place_id, setplace_id] = useState("")
    const [alamatGoogle, setalamatGoogle] = useState('')
    const [alamatGoogleDetail, setalamatGoogleDetail] = useState('')
    const [dataGoogle, setdataGoogle] = useState('')
    const [address_components, setaddress_components] = useState('')
    const [dataSearch, setdataSearch] = useState([])
    const [modal, setModal] = useState(false)
    const [region, setRegion] = useState({
        latitude: -6.2617525,
        longitude: 106.8407469,
        latitudeDelta: 0.0922 * 0.025,
        longitudeDelta: 0.0421 * 0.025,
    })
    const [loading, setloading] = useState(false)

    console.log("🚀 ~ file: Maps.js ~ line 27 ~ map ~ region", region)
    const [count, setcount] = useState(0)

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;

    const [
        locationStatus,
        setLocationStatus
    ] = useState('');

    useFocusEffect(
        useCallback(() => {
            console.log("🚀 ~ file: Maps.js ~ line 43 ~ useCallback ~ props.region", props.region)
            if (props.region.latitude !== -6.2617525) {
                setRegion(props.region)
            } else {
                setloading(true)
                // handleCurrentLocation()
                getOneTimeLocation()
                setTimeout(() => {
                    setloading(false)
                }, 2000);
            }
            // return () => {
            //     Geolocation.clearWatch(watchID);
            // };
        }, []),
    );



    const getOneTimeLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log("🚀 ~ file: Maps.js ~ line 49 ~ getOneTimeLocation ~ position", position)
                const currentLongitude = JSON.stringify(position.coords.longitude);
                console.log("🚀 ~ file: Maps.js ~ line 53 ~ getOneTimeLocation ~ currentLongitude", currentLongitude)
                const currentLatitude = JSON.stringify(position.coords.latitude);
                console.log("🚀 ~ file: Maps.js ~ line 55 ~ getOneTimeLocation ~ currentLatitude", position.coords.latitude)
                onRegionChange({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
                setcount(count + 1)
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
            },
        );
    };

    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);
                onRegionChange({
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                })
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };


    const handleCurrentLocation = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
            subscribeLocationLocation()
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                    subscribeLocationLocation();
                } else {
                    Utils.alertPopUp('Permission Denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };


    const onRegionChange = regionNow => {
        console.log("🚀 ~ file: Maps.js ~ line 122 ~ map ~ regionNow", regionNow)
        let data = {
            latitude: regionNow.latitude,
            longitude: regionNow.longitude,
            latitudeDelta: regionNow?.latitudeDelta ? regionNow.latitudeDelta : 0.0922 * 0.025,
            longitudeDelta: regionNow?.longitudeDelta ? regionNow.longitudeDelta : 0.0421 * 0.025
        };
        setRegion(data)
    }

    const handleCheckLokasi = () => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + region.latitude + "," + region.longitude + "&sensor=false&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
            .then((response) => response.json())
            .then((responseJson) => {
                setalamatGoogle(responseJson.results[0].address_components[1].long_name + ' , ' + responseJson.results[0].address_components[0].short_name)
                setalamatGoogleDetail(responseJson.results[0].formatted_address)
                setdataGoogle(responseJson.results[0])
                setaddress_components(responseJson.results[0].address_components)
                handleShowData()
                setshowFooter(true)

            })
            .catch((error) => console.log("error", error));

    }

    const handleShowData = () => {
        for (var i = 0; i < address_components.length; i++) {
            const addr = address_components[i];

            if (addr.types[0] == 'administrative_area_level_4') {
                const getLocality = addr.long_name;
                // this.setState({ kelurahan: getLocality })
            }
            if (addr.types[0] == 'administrative_area_level_3') {
                const getLocality = addr.long_name;
                // this.setState({ kecamatan: getLocality })
            }
            if (addr.types[0] == 'administrative_area_level_2') {
                const getAdministrative = addr.long_name;
                // this.setState({ kota: getAdministrative })
            }
            if (addr.types[0] == 'administrative_area_level_1') {
                const getAdministrative = addr.long_name;
                // this.setState({ provinsi: getAdministrative })
            }
            if (addr.types[0] == 'country') {
                const getCountry = addr.long_name;
                // this.setState({ negara: getCountry })
            }
            if (addr.types[0] == 'postal_code') {
                const getCountry = addr.long_name;
            }
        }
    };

    const cariLatlon = (item) => {
        var value = item.place_id;
        if (value) {
            fetch("https://maps.googleapis.com/maps/api/geocode/json?place_id=" + value + "&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
                .then((response) => response.json())
                .then((responseJson) => {
                    let geometry = responseJson.results[0].geometry
                    setRegion({
                        latitude: geometry.location.lat,
                        longitude: geometry.location.lng,
                        latitudeDelta: geometry.viewport.northeast.lat - geometry.viewport.southwest.lat,
                        longitudeDelta: (geometry.viewport.northeast.lat - geometry.viewport.southwest.lat) * ASPECT_RATIO
                    })
                    setaddress_components(responseJson.results[0].address_components)
                    setTimeout(() => handleShowData(), 500);

                })
                .catch((error) => console.log("error 117", error));
        }

    }

    const handleSearch = (text) => {
        if (String(text).length > 2) {
            fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyC_O0-LKyAboQn0O5_clZnePHSpQQ5slQU")
                .then((response) => response.json())
                .then((responseJson) => {
                    setdataSearch(responseJson.predictions)
                    cariLatlon(responseJson.predictions[0])
                })
                .catch((error) => console.log("error", error));
        }
    }

    const handleSave = () => {
        let data = {
            region: region,
            alamatGoogle: alamatGoogleDetail
        }

        Alert.alert(
            "Jaja.id",
            "Anda akan menyimpan lokasi ini?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        props.status("edit")
                        props.handleAlamat(data)
                    }
                }
            ],
            { cancelable: false }
        );
    }
    return (
        <SafeAreaView style={style.container}>
            {loading ? <Loading /> : null}
            <View style={style.appBar2}>
                <View style={[style.row_start_center, { flex: 1 }]}>
                    <TouchableOpacity onPress={() => props.status("edit")}>
                        <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableRipple onPressIn={() => setModal(true)} onPress={() => actionSheetRef.current?.setModalVisible(true)} style={styles.search}>
                    <>
                        <Text onPress={() => actionSheetRef.current?.setModalVisible(true) & setModal(true)} style={[style.font_12, { color: Platform.OS === 'android' ? colors.White : null }]}>Cari lokasi...</Text>
                        <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(true)}>
                            <Image style={styles.iconSearch} source={require('../../assets/icons/loupe.png')} />
                        </TouchableOpacity>
                    </>
                </TouchableRipple>

            </View>
            {/* <ScrollView> */}
            <View style={styles.body}>
                <View style={styles.bodyMaps}>
                    <MapView
                        // provider= {PROVIDER_GOOGLE}
                        enableZoomControl={true}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        zoomControlEnabled={true}
                        autoFocus={true}
                        debounce={500}
                        fetchDetails={true}
                        listViewDisplayed={false}
                        style={{ flex: 1, flexDirection: 'column' }}
                        rotateEnabled={false}
                        region={region}
                        onRegionChangeComplete={onRegionChange}
                    >
                        {/* <TouchableOpacity>
                            <Text>Cek Lokasi</Text>
                            </TouchableOpacity> */}
                        {/* <Marker
                                coordinate={region}
                                onPress={handleCheckLokasi}
                            /> */}
                    </MapView>
                    <View style={styles.markerFixed}>
                        <TouchableOpacity onPress={handleCheckLokasi}>
                            <Text style={[style.row_center, style.font_14, style.T_semi_bold, style.px_3, style.py_2, { color: "white", alignItems: "center", backgroundColor: colors.BlueJaja, alignSelf: 'center', borderRadius: 10, marginBottom: 10 }]}>Cek Lokasi</Text>
                            <Image style={styles.marker} source={require('../../assets/icons/google-maps.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.markerCurrent}>
                        <TouchableOpacity style={{
                            backgroundColor: colors.White, borderRadius: 100, height: 48, width: 48, justifyContent: 'center', alignItems: 'center',
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.18,
                            shadowRadius: 1.00,

                            elevation: 1,
                        }} onPress={getOneTimeLocation}>
                            <Image style={[styles.iconCurrent]} source={require('../../assets/icons/precision.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {alamatGoogle !== "" ?
                    <View style={styles.bodyPicker}>
                        <View style={styles.textItem}>
                            <Text style={styles.alamatTitle}>{alamatGoogle}</Text>
                            <Text style={styles.alamatContent}>{alamatGoogleDetail}</Text>
                        </View>
                        <Button color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" onPress={() => handleSave()}>Pilih Lokasi</Button>
                        <View style={{ flex: 1 }}></View>
                    </View>
                    : null
                }
            </View>
            {/* </ScrollView> */}
            {/* <ActionSheet ref={actionSheetRef} containerStyle={{ flex: 1, backgroundColor: colors.BlueJaja }}> */}
            <Modal animationType="slide" transparent={true} visible={modal} onRequestClose={() => setModal(!modal)}>
                <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? '6x%' : '1%', height: Platform.OS === 'android' ? Hp('100%') : Hp('80%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 999 }}>
                    <View style={[style.row_between_center, style.py_2, style.px_4, { height: Hp('9%'), backgroundColor: colors.BlueJaja }]}>

                        <TouchableOpacity style={[style.searchBar, { width: '87%' }]}>
                            <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                            <TextInput keyboardType="default" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={[style.font_11, { width: '95%', marginBottom: Platform.OS === 'android' ? '-1%' : '0%', padding: 0 }]} placeholder='Nama Jalan/Perumahan/Gedung' onChangeText={text => handleSearch(text)} onSubmitEditing={(value) => handleSearch(value.nativeEvent.text)}></TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.row_center, { width: "11%" }]} onPress={() => actionSheetRef.current?.setModalVisible() & setModal(false)}>
                            <Image style={[style.appBarButton, { transform: [{ rotate: '270deg' }] }]} source={require('../../assets/icons/arrow.png')} />
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ flex: 0, paddingHorizontal: '4%', height: Hp('73%') }}>
                        <FlatList
                            data={dataSearch}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => String(index) + "AC"}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setalamatGoogle(item["structured_formatting"]["main_text"])
                                        setalamatGoogleDetail(item["description"])
                                        setplace_id(item["place_id"])
                                        actionSheetRef.current?.setModalVisible(false);
                                        cariLatlon(item);
                                        setModal(false)

                                    }}
                                    style={{
                                        borderBottomWidth: 0.5,
                                        marginVertical: 0,
                                        paddingVertical: '3%',
                                        flex: 0,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image style={styles.iconMaps} source={require('../../assets/icons/google-maps.png')} />
                                    <View style={{ flexDirection: "column", marginVertical: 15 }}>
                                        <Text numberOfLines={1} style={{
                                            color: colors.BlackGrayScale,
                                            fontSize: Hp("2%"),
                                            fontFamily: 'SignikaNegative-SemiBold',
                                            textAlign: "left",
                                            marginRight: '2%'
                                        }}>
                                            {item["structured_formatting"]["main_text"]}
                                        </Text>
                                        <Text numberOfLines={2} style={{
                                            width: Wp("75%"),
                                            fontSize: Hp("1.6%"),
                                            textAlign: "left",
                                            color: 'grey'
                                        }}>
                                            {item["structured_formatting"]["secondary_text"]}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                </View>
            </Modal>
            {/* </ActionSheet> */}

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    body: {
        width: Wp("100%"),
        height: Hp("100%"),
        backgroundColor: colors.White
    },
    bodyMaps: {
        width: Wp("100%"),
        height: '100%',
    },
    bodyPicker: {
        width: Wp("100%"),
        height: Hp("35%"),
        backgroundColor: colors.White,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.BlueJaja,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 0,
        flexDirection: 'column',
        padding: '5%',
        paddingBottom: '10%',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0
    },
    textItem: {
        flex: 2,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    alamatTitle: {
        fontSize: 18,
        fontFamily: 'SignikaNegative-Regular',
        color: colors.BlackGrayScale
    },
    alamatContent: {
        fontSize: 14,
        fontFamily: 'SignikaNegative-Regular',
        color: colors.BlackGrayScale
    },
    search: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.White, opacity: 0.3, paddingVertical: '1.75%', paddingHorizontal: '5%', marginBottom: '-1%', borderRadius: 3 },
    iconSearch: {
        width: 16, height: 16, tintColor: colors.White
    },
    iconMaps: {
        width: 22, height: 22, marginRight: '2%'
    },
    bodySearch: {
        // width: Wp("100%"),
        // height: Hp("100%"),
        backgroundColor: colors.BlueJaja,
        // elevation: 2,
        // flex: 0,
        // flexDirection: 'column',
        // paddingVertical: '5%',
        // paddingHorizontal: '3%',
        // justifyContent: 'space-between'
    },
    searchInput: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: colors.BlueJaja,

        borderRadius: 10,
        paddingHorizontal: '3%',
        flex: 0,
        flexDirection: 'row'
    },
    markerFixed: {
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        left: '50%',
        marginLeft: -51,
        marginTop: -100,
        position: 'absolute',
        top: '50%',
    },
    markerCurrent: {
        flex: 0,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        right: 10,
        // marginTop: -0,
        top: 10,
    },
    marker: {
        alignSelf: 'center',
        height: 48,
        width: 48,
    },
    iconCurrent: {
        alignSelf: 'center',
        height: 24,
        width: 24,
        tintColor: colors.BlueJaja,
    }
})


// import React, { useState, createRef, useEffect, useCallback } from 'react'
// import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, Dimensions, Modal, Platform } from 'react-native'
// import MapView from 'react-native-maps';
// import { Appbar, Button, TouchableRipple } from 'react-native-paper';
// import ActionSheet from 'react-native-actions-sheet';
// import { colors, styles as style, Wp, Hp, useFocusEffect } from '../../export';
// const { width, height } = Dimensions.get('screen')
// import Geolocation from '@react-native-community/geolocation';

// export default function map(props) {

//     const actionSheetRef = createRef();
//     const [showFooter, setshowFooter] = useState(false)
//     const [place_id, setplace_id] = useState("")
//     const [alamatGoogle, setalamatGoogle] = useState('')
//     const [alamatGoogleDetail, setalamatGoogleDetail] = useState('')
//     const [dataGoogle, setdataGoogle] = useState('')
//     const [address_components, setaddress_components] = useState('')
//     const [dataSearch, setdataSearch] = useState([])
//     const [modal, setModal] = useState(false)
//     const [region, setRegion] = useState({
//         latitude: -6.2617525,
//         longitude: 106.8407469,
//         latitudeDelta: 0.0922 * 0.025,
//         longitudeDelta: 0.0421 * 0.025,
//     })
//     const [count, setcount] = useState(0)

//     const ASPECT_RATIO = width / height;
//     const LATITUDE_DELTA = 0.0922;

//     const [
//         locationStatus,
//         setLocationStatus
//     ] = useState('');

//     useFocusEffect(
//         useCallback(() => {
//             handleCurrentLocation()
//             return () => {
//                 Geolocation.clearWatch(watchID);
//             };
//         }, []),
//     );



//     const getOneTimeLocation = () => {
//         Geolocation.getCurrentPosition(
//             (position) => {
//                 console.log("🚀 ~ file: Maps.js ~ line 49 ~ getOneTimeLocation ~ position", position)
//                 const currentLongitude =
//                     JSON.stringify(position.coords.longitude);
//                 const currentLatitude =
//                     JSON.stringify(position.coords.latitude);
//                 onRegionChange({
//                     latitude: currentLatitude,
//                     longitude: currentLongitude,
//                 })
//                 // setcount(count + 1)
//             },
//             (error) => {
//                 setLocationStatus(error.message);
//             },
//             {
//                 enableHighAccuracy: false,
//             },
//         );
//     };

//     const subscribeLocationLocation = () => {
//         watchID = Geolocation.watchPosition(
//             (position) => {
//                 const currentLongitude =
//                     JSON.stringify(position.coords.longitude);
//                 const currentLatitude =
//                     JSON.stringify(position.coords.latitude);
//                 onRegionChange({
//                     latitude: currentLatitude,
//                     longitude: currentLongitude,
//                 })
//             },
//             (error) => {
//                 setLocationStatus(error.message);
//             },
//             {
//                 enableHighAccuracy: false,
//                 maximumAge: 1000
//             },
//         );
//     };


//     const handleCurrentLocation = async () => {
//         if (Platform.OS === 'ios') {
//             getOneTimeLocation();
//             subscribeLocationLocation()
//         } else {
//             try {
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Location Access Required',
//                         message: 'This App needs to Access your location',
//                     },
//                 );
//                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                     getOneTimeLocation();
//                     subscribeLocationLocation();
//                 } else {
//                     Utils.alertPopUp('Permission Denied');
//                 }
//             } catch (err) {
//                 console.warn(err);
//             }
//         }
//     };


//     const onRegionChange = region => {
//         let data = region;
//         data.latitude = region.latitude;
//         data.longitude = region.longitude;
//         setRegion(data)
//     }

//     const handleCheckLokasi = () => {
//         fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + region.latitude + "," + region.longitude + "&sensor=false&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
//             .then((response) => response.json())
//             .then((responseJson) => {
//                 setalamatGoogle(responseJson.results[0].address_components[1].long_name + ' , ' + responseJson.results[0].address_components[0].short_name)
//                 setalamatGoogleDetail(responseJson.results[0].formatted_address)
//                 setdataGoogle(responseJson.results[0])
//                 setaddress_components(responseJson.results[0].address_components)
//                 handleShowData()
//                 setshowFooter(true)

//             })
//             .catch((error) => console.log("error", error));

//     }

//     const handleShowData = () => {
//         for (var i = 0; i < address_components.length; i++) {
//             const addr = address_components[i];

//             if (addr.types[0] == 'administrative_area_level_4') {
//                 const getLocality = addr.long_name;
//                 // this.setState({ kelurahan: getLocality })
//             }
//             if (addr.types[0] == 'administrative_area_level_3') {
//                 const getLocality = addr.long_name;
//                 // this.setState({ kecamatan: getLocality })
//             }
//             if (addr.types[0] == 'administrative_area_level_2') {
//                 const getAdministrative = addr.long_name;
//                 // this.setState({ kota: getAdministrative })
//             }
//             if (addr.types[0] == 'administrative_area_level_1') {
//                 const getAdministrative = addr.long_name;
//                 // this.setState({ provinsi: getAdministrative })
//             }
//             if (addr.types[0] == 'country') {
//                 const getCountry = addr.long_name;
//                 // this.setState({ negara: getCountry })
//             }
//             if (addr.types[0] == 'postal_code') {
//                 const getCountry = addr.long_name;
//             }
//         }
//     };

//     const cariLatlon = (item) => {
//         var value = item.place_id;
//         if (value) {
//             fetch("https://maps.googleapis.com/maps/api/geocode/json?place_id=" + value + "&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
//                 .then((response) => response.json())
//                 .then((responseJson) => {
//                     let geometry = responseJson.results[0].geometry
//                     setRegion({
//                         latitude: geometry.location.lat,
//                         longitude: geometry.location.lng,
//                         latitudeDelta: geometry.viewport.northeast.lat - geometry.viewport.southwest.lat,
//                         longitudeDelta: (geometry.viewport.northeast.lat - geometry.viewport.southwest.lat) * ASPECT_RATIO
//                     })
//                     setaddress_components(responseJson.results[0].address_components)
//                     setTimeout(() => handleShowData(), 500);

//                 })
//                 .catch((error) => console.log("error 117", error));
//         }

//     }

//     const handleSearch = (text) => {
//         if (String(text).length > 2) {
//             fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + text + "&key=AIzaSyC_O0-LKyAboQn0O5_clZnePHSpQQ5slQU")
//                 .then((response) => response.json())
//                 .then((responseJson) => {
//                     setdataSearch(responseJson.predictions)
//                     cariLatlon(responseJson.predictions[0])
//                 })
//                 .catch((error) => console.log("error", error));
//         }
//     }

//     const handleSave = () => {
//         let data = {
//             region: region,
//             alamatGoogle: alamatGoogleDetail
//         }

//         Alert.alert(
//             "Jaja.id",
//             "Anda akan menyimpan lokasi ini?",
//             [
//                 {
//                     text: "Cancel",
//                     onPress: () => console.log("Cancel Pressed"),
//                     style: "cancel"
//                 },
//                 {
//                     text: "OK", onPress: () => {
//                         props.status("edit")
//                         props.handleAlamat(data)
//                     }
//                 }
//             ],
//             { cancelable: false }
//         );
//     }
//     return (
//         <SafeAreaView style={style.container}>
//             <View style={style.appBar2}>
//                 <View style={[style.row_start_center, { flex: 1 }]}>
//                     <TouchableOpacity onPress={() => props.status("edit")}>
//                         <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
//                     </TouchableOpacity>
//                 </View>
//                 <TouchableRipple onPressIn={() => setModal(true)} onPress={() => actionSheetRef.current?.setModalVisible(true)} style={styles.search}>
//                     <>
//                         <Text onPress={() => actionSheetRef.current?.setModalVisible(true) & setModal(true)} style={[style.font_12, { color: Platform.OS === 'android' ? colors.White : null }]}>Cari lokasi...</Text>
//                         <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible(true)}>
//                             <Image style={styles.iconSearch} source={require('../../assets/icons/loupe.png')} />
//                         </TouchableOpacity>
//                     </>
//                 </TouchableRipple>

//             </View>
//             {/* <ScrollView> */}
//             <View style={styles.body}>
//                 <View style={styles.bodyMaps}>
//                     <MapView
//                         // provider= {PROVIDER_GOOGLE}
//                         enableZoomControl={true}
//                         showsUserLocation={true}
//                         showsMyLocationButton={true}
//                         zoomControlEnabled={true}
//                         autoFocus={true}
//                         debounce={500}
//                         fetchDetails={true}
//                         listViewDisplayed={false}
//                         style={{ flex: 1, flexDirection: 'column' }}
//                         rotateEnabled={false}
//                         region={region}
//                         onRegionChangeComplete={onRegionChange}
//                         showsUserLocation={true} >
//                         {/* <TouchableOpacity>
//                             <Text>Cek Lokasi</Text>
//                             </TouchableOpacity> */}
//                         {/* <Marker
//                                 coordinate={region}
//                                 onPress={handleCheckLokasi}
//                             /> */}
//                     </MapView>
//                     <View style={styles.markerFixed}>
//                         <TouchableOpacity onPress={handleCheckLokasi}>
//                             <Text style={[style.row_center, style.font_14, style.T_semi_bold, style.px_3, style.py_2, { color: "white", alignItems: "center", backgroundColor: colors.BlueJaja, alignSelf: 'center', borderRadius: 10, marginBottom: 10 }]}>Cek Lokasi</Text>
//                             <Image style={styles.marker} source={require('../../assets/icons/google-maps.png')} />
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.markerCurrent}>
//                         <TouchableOpacity style={{ backgroundColor: colors.White, borderRadius: 100, height: 48, width: 48, justifyContent: 'center', alignItems: 'center' }} onPress={getOneTimeLocation}>
//                             <Image style={[styles.iconCurrent]} source={require('../../assets/icons/precision.png')} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 {alamatGoogle !== "" ?
//                     <View style={styles.bodyPicker}>
//                         <View style={styles.textItem}>
//                             <Text style={styles.alamatTitle}>{alamatGoogle}</Text>
//                             <Text style={styles.alamatContent}>{alamatGoogleDetail}</Text>
//                         </View>
//                         <Button color={colors.BlueJaja} labelStyle={{ color: colors.White }} mode="contained" onPress={() => handleSave()}>Pilih Lokasi</Button>
//                         <View style={{ flex: 1 }}></View>
//                     </View>
//                     : null
//                 }
//             </View>
//             {/* </ScrollView> */}
//             {/* <ActionSheet ref={actionSheetRef} containerStyle={{ flex: 1, backgroundColor: colors.BlueJaja }}> */}
//             <Modal animationType="slide" transparent={true} visible={modal} onRequestClose={() => setModal(!modal)}>
//                 <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? '6x%' : '1%', height: Platform.OS === 'android' ? Hp('100%') : Hp('80%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 999 }}>
//                     <View style={[style.row_between_center, style.py_2, style.px_4, { height: Hp('9%'), backgroundColor: colors.BlueJaja }]}>

//                         <TouchableOpacity style={[style.searchBar, { width: '87%' }]}>
//                             <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
//                             <TextInput keyboardType="default" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={[style.font_11, { width: '95%', marginBottom: Platform.OS === 'android' ? '-1%' : '0%', padding: 0 }]} placeholder='Nama Jalan/Perumahan/Gedung' onChangeText={text => handleSearch(text)} onSubmitEditing={(value) => handleSearch(value.nativeEvent.text)}></TextInput>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={[style.row_center, { width: "11%" }]} onPress={() => actionSheetRef.current?.setModalVisible() & setModal(false)}>
//                             <Image style={[style.appBarButton, { transform: [{ rotate: '270deg' }] }]} source={require('../../assets/icons/arrow.png')} />
//                         </TouchableOpacity>

//                     </View>
//                     <ScrollView style={{ flex: 0, paddingHorizontal: '4%', height: Hp('73%') }}>
//                         <FlatList
//                             data={dataSearch}
//                             showsHorizontalScrollIndicator={false}
//                             keyExtractor={(item, index) => String(index) + "AC"}
//                             renderItem={({ item, index }) => (
//                                 <TouchableOpacity
//                                     key={index}
//                                     onPress={() => {
//                                         setalamatGoogle(item["structured_formatting"]["main_text"])
//                                         setalamatGoogleDetail(item["description"])
//                                         setplace_id(item["place_id"])
//                                         actionSheetRef.current?.setModalVisible(false);
//                                         cariLatlon(item);
//                                         setModal(false)

//                                     }}
//                                     style={{
//                                         borderBottomWidth: 0.5,
//                                         marginVertical: 0,
//                                         paddingVertical: '3%',
//                                         flex: 0,
//                                         flexDirection: 'row',
//                                         alignItems: 'center'
//                                     }}
//                                 >
//                                     <Image style={styles.iconMaps} source={require('../../assets/icons/google-maps.png')} />
//                                     <View style={{ flexDirection: "column", marginVertical: 15 }}>
//                                         <Text numberOfLines={1} style={{
//                                             color: colors.BlackGrayScale,
//                                             fontSize: Hp("2%"),
//                                             fontFamily: 'SignikaNegative-SemiBold',
//                                             textAlign: "left",
//                                             marginRight: '2%'
//                                         }}>
//                                             {item["structured_formatting"]["main_text"]}
//                                         </Text>
//                                         <Text numberOfLines={2} style={{
//                                             width: Wp("75%"),
//                                             fontSize: Hp("1.6%"),
//                                             textAlign: "left",
//                                             color: 'grey'
//                                         }}>
//                                             {item["structured_formatting"]["secondary_text"]}
//                                         </Text>
//                                     </View>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     </ScrollView>
//                 </View>
//             </Modal>
//             {/* </ActionSheet> */}

//         </SafeAreaView >
//     )
// }
// const styles = StyleSheet.create({
//     body: {
//         width: Wp("100%"),
//         height: Hp("100%"),
//         backgroundColor: colors.White
//     },
//     bodyMaps: {
//         width: Wp("100%"),
//         height: '100%',
//     },
//     bodyPicker: {
//         width: Wp("100%"),
//         height: Hp("35%"),
//         backgroundColor: colors.White,
//         elevation: 2,
//         borderWidth: 1,
//         borderColor: colors.BlueJaja,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         flex: 0,
//         flexDirection: 'column',
//         padding: '5%',
//         paddingBottom: '10%',
//         justifyContent: 'space-between',
//         position: 'absolute',
//         bottom: 0
//     },
//     textItem: {
//         flex: 2,
//         width: '100%',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//     },
//     alamatTitle: {
//         fontSize: 18,
//         fontFamily: 'SignikaNegative-Regular',
//         color: colors.BlackGrayScale
//     },
//     alamatContent: {
//         fontSize: 14,
//         fontFamily: 'SignikaNegative-Regular',
//         color: colors.BlackGrayScale
//     },
//     search: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.White, opacity: 0.3, paddingVertical: '1.75%', paddingHorizontal: '5%', marginBottom: '-1%', borderRadius: 3 },
//     iconSearch: {
//         width: 16, height: 16, tintColor: colors.White
//     },
//     iconMaps: {
//         width: 22, height: 22, marginRight: '2%'
//     },
//     bodySearch: {
//         // width: Wp("100%"),
//         // height: Hp("100%"),
//         backgroundColor: colors.BlueJaja,
//         // elevation: 2,
//         // flex: 0,
//         // flexDirection: 'column',
//         // paddingVertical: '5%',
//         // paddingHorizontal: '3%',
//         // justifyContent: 'space-between'
//     },
//     searchInput: {
//         width: '100%',
//         height: 48,
//         borderWidth: 1,
//         borderColor: colors.BlueJaja,

//         borderRadius: 10,
//         paddingHorizontal: '3%',
//         flex: 0,
//         flexDirection: 'row'
//     },
//     markerFixed: {
//         flex: 0,
//         justifyContent: 'center',
//         alignContent: 'center',
//         left: '50%',
//         marginLeft: -51,
//         marginTop: -142,
//         position: 'absolute',
//         top: '50%',
//     },
//     markerCurrent: {
//         flex: 0,
//         justifyContent: 'center',
//         alignContent: 'center',
//         position: 'absolute',
//         right: 0,
//         marginTop: -92,
//         top: '50%',
//     },
//     marker: {
//         alignSelf: 'center',
//         height: 48,
//         width: 48,
//     },
//     iconCurrent: {
//         alignSelf: 'center',
//         height: 30,
//         width: 30
//     }
// })
