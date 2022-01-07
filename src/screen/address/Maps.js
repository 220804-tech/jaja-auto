import React, { useState, createRef, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert, Dimensions, Modal, Platform } from 'react-native'
import MapView from 'react-native-maps';
import { Appbar, Button, TouchableRipple } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import { colors, styles as style, Wp, Hp } from '../../export';
const { width, height } = Dimensions.get('screen')

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

    const [region, setRegion] = useState({})
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;

    useEffect(() => {
        try {
            console.log("file: Maps.js ~ line 27 ~ useEffect ~ props.region", props.region)
            if (props.region) {
                setRegion(props.region)
            } else {
                setRegion({
                    latitude: -6.2617525,
                    longitude: 106.8407469,
                    latitudeDelta: 0.0922 * 0.025,
                    longitudeDelta: 0.0421 * 0.025,
                })
            }
        } catch (error) {

        }
    }, [])

    const onRegionChange = region => {
        console.log("🚀 ~ file: Maps.js ~ line 41 ~ map ~ region", region)
        let data = region;
        data.latitude = region.latitude;
        data.longitude = region.longitude;
        setRegion(data)
    }

    const handleCheckLokasi = () => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + region.latitude + "," + region.longitude + "&sensor=false&key=AIzaSyB4C8a6rkM6BKu1W0owWvStPzGHoc4ZBXI")
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("🚀 ~ file: Maps.js ~ line 53 ~ .then ~ responseJson", responseJson)
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
                console.log("🚀 ~ file: map.js ~ line 58 ~ handleShowData ~ getLocality", getLocality)
                // this.setState({ kelurahan: getLocality })
            }
            if (addr.types[0] == 'administrative_area_level_3') {
                const getLocality = addr.long_name;
                console.log("🚀 ~ file: map.js ~ line 63 ~ handleShowData ~ getLocality", getLocality)
                // this.setState({ kecamatan: getLocality })
            }
            if (addr.types[0] == 'administrative_area_level_2') {
                const getAdministrative = addr.long_name;
                console.log("🚀 ~ file: map.js ~ line 67 ~ handleShowData ~ getAdministrative", getAdministrative)
                // this.setState({ kota: getAdministrative })
            }
            if (addr.types[0] == 'administrative_area_level_1') {
                const getAdministrative = addr.long_name;
                console.log("🚀 ~ file: map.js ~ line 72 ~ handleShowData ~ getAdministrative", getAdministrative)
                // this.setState({ provinsi: getAdministrative })
            }
            if (addr.types[0] == 'country') {
                const getCountry = addr.long_name;
                console.log("🚀 ~ file: map.js ~ line 77 ~ handleShowData ~ getCountry", getCountry)
                // this.setState({ negara: getCountry })
            }
            if (addr.types[0] == 'postal_code') {
                const getCountry = addr.long_name;
                console.log("🚀 ~ file: map.js ~ line 82 ~ handleShowData ~ getCountry", getCountry)
                // this.setState({ kodepos: getCountry })
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
            <View style={style.appBar2}>
                <View style={[style.row_start_center, { flex: 1 }]}>
                    <TouchableOpacity onPress={() => props.status("edit")}>
                        <Image style={style.appBarButton} source={require('../../assets/icons/arrow.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableRipple onPressIn={() => setModal(true)} onPress={() => actionSheetRef.current?.setModalVisible(true)} style={styles.search}>
                    <>
                        <Text onPress={() => actionSheetRef.current?.setModalVisible(true) & setModal(true)} style={{ color: colors.White, fontFamily: 'Poppins-Regular' }}>Cari lokasi...</Text>
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
                        showsUserLocation >
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
                            {/* <View style={{ backgroundColor: "red", padding: 10, borderRadius: 10, marginLeft: -30 }}> */}
                            <Text style={[style.row_center, style.font_14, style.T_semi_bold, style.px_3, style.py_2, { color: "white", alignItems: "center", backgroundColor: colors.BlueJaja, alignSelf: 'center', borderRadius: 10 }]}>Cek Lokasi</Text>
                            {/* </View> */}
                            <Image style={styles.marker} source={require('../../assets/icons/google-maps.png')} />
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
                <View style={{ flex: 1, height: Hp('100%'), width: Wp('100%'), backgroundColor: colors.White, opacity: 0.95, zIndex: 999 }}>
                    <View style={[style.row_between_center, style.py_2, style.px_4, { height: Hp('9%'), backgroundColor: colors.BlueJaja }]}>

                        <TouchableOpacity style={[style.searchBar, { width: '87%' }]}>
                            <Image source={require('../../assets/icons/loupe.png')} style={{ width: 19, height: 19, marginRight: '3%' }} />
                            <TextInput keyboardType="default" returnKeyType="search" autoFocus={true} adjustsFontSizeToFit style={[style.font_12, { width: '95%', marginBottom: Platform.OS === 'android' ? '-1%' : '0%' }]} placeholder='Nama Jalan/Perumahan/Gedung' onChangeText={text => handleSearch(text)} onSubmitEditing={(value) => handleSearch(value.nativeEvent.text)}></TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.row_center, { width: "11%" }]} onPress={() => actionSheetRef.current?.setModalVisible() & setModal(false)}>
                            <Image style={[style.appBarButton, { transform: [{ rotate: '270deg' }] }]} source={require('../../assets/icons/arrow.png')} />
                        </TouchableOpacity>

                    </View>
                    <ScrollView style={{ flex: 0, paddingHorizontal: '4%', height: Hp('93%') }}>
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
                                            fontFamily: 'Poppins-SemiBold',
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
        fontFamily: 'Poppins-Regular',
        color: colors.BlackGrayScale
    },
    alamatContent: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: colors.BlackGrayScale
    },
    search: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.White, opacity: 0.3, paddingVertical: '2%', paddingHorizontal: '5%', marginBottom: '-1.9%' },
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
        marginTop: -92,
        position: 'absolute',
        top: '50%',
    },
    marker: {
        alignSelf: 'center',
        height: 48,
        width: 48
    },
})
