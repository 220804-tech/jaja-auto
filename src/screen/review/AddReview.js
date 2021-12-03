import React, { useEffect, useState, createRef } from 'react'
import { SafeAreaView, View, Text, Image, FlatList, ScrollView, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'
import { Button } from "react-native-paper";
import { styles, Appbar, Wp, colors, Hp, useNavigation, Loading, Utils } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import StarRating from 'react-native-star-rating';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import VideoPlayer from 'react-native-video-player';
import RNFS from 'react-native-fs';

export default function AddReview(props) {
    const navigation = useNavigation();
    const reduxAuth = useSelector(state => state.auth.auth)
    const galeryRef = createRef()
    const reduxOrderInvoice = useSelector(state => state.order.invoice)

    const [loading, setLoading] = useState(false)

    const [starCount, setstarCount] = useState(5)
    const [textReview, settextReview] = useState("")
    const [idx, setIdx] = useState(null)
    const [img, setImg] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        try {
            if (props.route.params.data) {
                let arr = props.route.params.data
                let newArr = []
                arr.map(item => {
                    newArr.push({
                        "name": item.name,
                        "variant": item.variant,
                        "image": item.image,
                        "productId": item.productId,
                        "rate": 5,
                        "comment": "",
                        "imagesShow": [],
                        "images": [],
                        "videoShow": "",
                        "video": "",

                    })
                })
                setData(newArr)
            }
        } catch (error) {

        }
    }, [props])

    const inputText = [
        { id: "121", text: "Barang sesuai pesanan", },
        { id: "122", text: "Respon penjual cepat", },
        { id: "123", text: "Pengiriman cepat", }
    ]

    const handlePickImage = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
            includeBase64: true
        }).then(image => {
            let newData = JSON.parse(JSON.stringify(data))
            if (newData[idx].images.length < 4) {
                newData[idx].images.push(image.data)
                newData[idx].imagesShow.push(image.path)
                setData(newData)
                setIdx(null)
            }
        });
    }

    const handleOpenCamera = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
            includeBase64: true
        }).then(image => {
            let newData = JSON.parse(JSON.stringify(data))
            if (newData[idx].images.length < 4) {
                console.log("🚀 ~ file: AddReview.js ~ line 78 ~ handleOpenCamera ~ image", image)
                newData[idx].images.push(image.data)
                newData[idx].imagesShow.push(image.path)
                setData(newData)
                setIdx(null)
            }
        });
    }

    const handlePickVideo = (indx) => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            compressVideoPreset: '640x480',
            compressImageQuality: 0.8,
            maxFiles: 1,
            includeBase64: true,
        }).then(async video => {
            try {
                console.log("🚀 ~ file: AddReview.js ~ line 105 ~ handlePickVideo ~ video", video)
                let base64data = await RNFS.readFile(video.path, 'base64').then();
                let newData = JSON.parse(JSON.stringify(data))
                newData[indx].videoShow = video.path;
                newData[indx].video = base64data;
                setData(newData)
                setIdx(null)
            } catch (error) {
                console.log("🚀 ~ file: AddReview.js ~ line ss100 ~ handlePickVideo ~ error", error)
            }
        });
    }

    const handleBase64 = (file) => {
    }

    const handleRemoveImage = (indexParent, indexChild) => {
        let newData = JSON.parse(JSON.stringify(data))
        if (indexChild !== null) {
            newData[indexParent].images.splice(indexChild, 1)
            newData[indexParent].imagesShow.splice(indexChild, 1)
        } else {
            newData[indexParent].video = null
        }
        setData(newData)
        setIdx(null)
    }

    const handleChange = (value, index, name) => {
        if (name === "rate") {
            let newData = JSON.parse(JSON.stringify(data))
            newData[index].rate = value;
            setData(newData)
            setIdx(null)
        } else if (name === "comment") {
            let newData = JSON.parse(JSON.stringify(data))
            newData[index].comment += value + ". ";
            setData(newData)
            setIdx(null)
        }
    }

    const handleReview = () => {
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "invoice": reduxOrderInvoice,
            "rates": data
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        let res = ""

        fetch("https://jaja.id/backend/order/rate", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: AddReview.js ~ line 172 ~ handleReview ~ result", result)
                res = 'succes'
                setLoading(false)
                if (result.status.code === 200) {
                    Utils.alertPopUp("Pesanan berhasil di review")
                    navigation.goBack()
                } else {
                    Utils.handleErrorResponse(result, 'Error with status code : 12039')
                }
            })
            .catch(error => {
                Utils.handleError(JSON.stringify(error), 'Error with status code : 12040')
                setLoading(false)
                res = 'failed'
            });
        setTimeout(() => {
            if (!res) {
                Utils.alertPopUp('Koneksi lambat..')
            }
        }, 7000);
        setTimeout(() => {
            setLoading(false)
            if (!res) {
                Utils.alertPopUp('Periksa kembai koneksi anda!')
            }
        }, 12000);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Beri Penilaian" />
            {loading ? <Loading /> : null}
            <FlatList
                data={data}
                keyExtractor={item => item.productId}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[styles.column, styles.px_2, { paddingVertical: 5 }]}>
                            <View style={styles.row}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), marginRight: '2%' }} source={{ uri: item.image ? item.image : null }} />
                                <View style={[styles.column_between_center, { width: Wp('81%'), alignItems: 'flex-start' }]}>
                                    <Text numberOfLines={2} style={styles.font_14}>{item.name}</Text>
                                    {item.variant ? <Text numberOfLines={2} style={styles.font_12}>Variant : {item.variant}</Text> : null}
                                </View>
                            </View>
                            <View style={[styles.my_3, { width: Wp('80%') }]}>
                                <StarRating
                                    // disabled={false}
                                    maxStars={5}
                                    rating={4}
                                    starSize={30}
                                    fullStarColor={colors.YellowJaja}
                                    emptyStarColor={colors.YellowJaja}
                                    rating={item.rate}
                                    selectedStar={(rating) => handleChange(rating, index, "rate")}
                                />
                            </View>
                            <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                {inputText.map((input, indx) => {
                                    return (
                                        <TouchableOpacity key={indx + "C"} onPress={() => handleChange(input.text, index, "comment")} style={[styles.py, styles.px_2, styles.mr, styles.mb_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3 }]}><Text multiline={true} style={[styles.font_12, { color: input.pressed ? colors.White : colors.BlackGrayScale }]}>{input.text}</Text></TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 5 }}>
                                <TextInput style={{ color: colors.BlackGrayScale }} onChangeText={(text) => handleChange(text, index, "comment")} placeholder="Barang sesuai pesanan." multiline={true} numberOfLines={3} textAlignVertical="top" maxLength={200}>
                                    {item.comment}
                                </TextInput>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity disabled={data[index].images.length < 4 ? false : true} onPress={() => galeryRef.current?.setModalVisible() & setIdx(index)} style={[styles.row, styles.py, styles.px_2, styles.m_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3, marginLeft: '0%' }]}>
                                    <FAIcon name="camera" size={16} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                                    <Text style={[styles.font_12, styles.ml_5]}>Unggah Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handlePickVideo(index)} style={[styles.row, styles.py, styles.px_2, styles.m_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3, marginLeft: '0%' }]}>
                                    <FAIcon name="video" size={16} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                                    <Text style={[styles.font_12, styles.ml_5]}>Unggah Video</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.column}>
                                <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                    {item.imagesShow.map((val, indx) => {
                                        return (
                                            <View key={indx + "N"} style={styles.my_2}>
                                                <Image style={{ width: Wp('20%'), height: Wp('20%'), marginRight: 15, backgroundColor: 'pink' }} source={{ uri: val }} />
                                                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, width: Wp('4.3%'), height: Wp('4.3%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveImage(index, indx)}>
                                                    <Image style={{ width: Wp('3%'), height: Wp('3%'), tintColor: colors.Silver }} source={require('../../assets/icons/close.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                                {item.videoShow ?
                                    <View style={{ width: Wp('44%'), height: Wp('44%'), marginVertical: '2%' }}>
                                        <VideoPlayer
                                            video={{ uri: item.video }}
                                            resizeMode="cover"
                                            style={{ height: Wp('44%'), width: Wp('44%') }}
                                            videoWidth={Wp('44%')}
                                            videoHeight={Wp('44%')}
                                            disableFullscreen={false}
                                            fullScreenOnLongPress={true}

                                        />
                                        <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, width: Wp('5%'), height: Wp('5%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveImage(index, null)}>
                                            <Image style={{ width: Wp('3.5%'), height: Wp('3.5%'), tintColor: colors.Silver }} source={require('../../assets/icons/close.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    : null
                                }
                            </View>
                        </View>
                    )
                }}
            />
            <View style={{ flex: 0, width: Wp('100%'), height: Hp('6%'), position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', marginBottom: '3%' }}>
                <Button icon="star" mode="contained" color={colors.BlueJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} style={{ width: Wp('90%') }} contentStyle={{ width: Wp('90%') }} onPress={handleReview}>
                    Simpan
                </Button>
            </View>

            <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White }} ref={galeryRef}>
                <View style={[styles.column, { backgroundColor: '#ededed' }]}>
                    <TouchableOpacity onPress={handleOpenCamera} style={{ borderBottomWidth: 0.5, borderBottomColor: colors.Silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '2%' }}>
                        <Text style={[styles.font_16, { alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                    </TouchableOpacity>
                </View >
            </ActionSheet >
        </SafeAreaView >
    )
}
