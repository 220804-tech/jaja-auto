import React, { useState, createRef } from 'react'
import { SafeAreaView, View, Text, Image, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Button } from "react-native-paper";
import { styles, Appbar, Wp, colors } from '../../export'
import { useSelector, useDispatch } from 'react-redux'
import StarRating from 'react-native-star-rating';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import VideoPlayer from 'react-native-video-player';

export default function AddReview() {
    const dataTest = useSelector(state => state.order.unPaid)
    const galeryRef = createRef()

    const [starCount, setstarCount] = useState(5)
    const [textReview, settextReview] = useState("")
    const [idx, setIdx] = useState(null)
    const [img, setImg] = useState(null)

    const [items, setItems] = useState([
        {
            "id": "1545",
            "name": "Jika Tuhan Maha Kuasa, Kenapa Manusia Menderita?",
            "image": "https://seller.jaja.id/asset/images/products/2021051760a21dba1e5fc.jpeg",
            "rate": "4",
            "images": [],
            "video": ''
        },
        {
            "id": "364",
            "name": "Kura-Kura Berjanggut",
            "image": "https://seller.jaja.id/asset/images/products/202008255f4493b86c8da.jpeg",
            "rate": "4",
            "images": [],
            "video": ''

        }
    ])

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
            cropping: true
        }).then(image => {
            let newData = JSON.parse(JSON.stringify(items))
            newData[idx].images.push(image.path)
            setItems(newData)
            setIdx(null)
        });
    }

    const handleOpenCamera = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            let newData = JSON.parse(JSON.stringify(items))
            newData[idx].images.push(image.path)
            setItems(newData)
            setIdx(null)
        });
    }

    const handlePickVideo = (indx) => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            sortOrder: 'asc',
            compressVideoPreset: '960x540'
        }).then(video => {
            let newData = JSON.parse(JSON.stringify(items))
            newData[indx].video = video.path;
            setItems(newData)
            setIdx(null)
        });
    }
    const handleRemoveImage = (indexParent, indexChild) => {
        let newData = JSON.parse(JSON.stringify(items))
        if (indexChild !== null) {
            newData[indexParent].images.splice(indexChild, 1)

        } else {
            newData[indexParent].video = null
        }
        setItems(newData)
        setIdx(null)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title="Beri Penilaian" />
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[styles.column, styles.p_2, styles.mb_3]}>
                            <View style={styles.row}>
                                <Image style={{ width: Wp('15%'), height: Wp('15%'), marginRight: '2%' }} source={{ uri: item.image ? item.image : null }} />
                                <View style={[styles.column_between_center, { width: Wp('81%'), alignItems: 'flex-start' }]}>
                                    <Text numberOfLines={2} style={styles.font_14}>{item.name}</Text>
                                    <Text numberOfLines={2} style={styles.font_12}>Variant : Merah Toska</Text>
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
                                    rating={starCount}
                                    selectedStar={(rating) => setstarCount(rating)}
                                />
                            </View>
                            <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                {inputText.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => settextReview(textReview + item.text + ". ")} style={[styles.py, styles.px_2, styles.mr, styles.mb_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3 }]}><Text multiline={true} style={[styles.font_12, { color: item.pressed ? colors.White : colors.BlackGrayScale }]}>{item.text}</Text></TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={{ borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 5 }}>
                                <TextInput multiline={true} numberOfLines={3} textAlignVertical="top" maxLength={200}>
                                    {textReview}
                                </TextInput>
                            </View>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible() & setIdx(index)} style={[styles.row, styles.py, styles.px_2, styles.m_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3, marginLeft: '0%' }]}>
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
                                    {item.images.map((val, indx) => {
                                        console.log("🚀 ~ file: AddReview.js ~ line 12 ~ {item.images.map ~ val", indx)
                                        return (
                                            <View style={styles.my_2}>
                                                <Image style={{ width: Wp('20%'), height: Wp('20%'), marginRight: 15, backgroundColor: 'pink' }} source={{ uri: val }} />
                                                <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, width: Wp('4.3%'), height: Wp('4.3%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveImage(index, indx)}>
                                                    <Image style={{ width: Wp('3.7%'), height: Wp('3.7%'), tintColor: colors.Red }} source={require('../../assets/icons/close.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                                {item.video ?
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
                                            <Image style={{ width: Wp('4%'), height: Wp('4%'), tintColor: colors.Red }} source={require('../../assets/icons/close.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    : null}

                            </View>
                        </View>
                    )
                }}
            />
            <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White }} ref={galeryRef}>
                {/* <View style={styles.row_between_center}>
                    <Text style={styles.actionSheetTitle}>Pilih gambar</Text>
                    <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)}  >
                        <Image
                            style={styles.icon_16}
                            source={require('../../assets/icons/close.png')}
                        />
                    </TouchableOpacity>
                </View> */}
                <View style={[styles.column, { backgroundColor: '#ededed' }]}>
                    <TouchableOpacity onPress={handleOpenCamera} style={{ borderBottomWidth: 0.5, borderBottomColor: colors.Silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                        <Text style={[styles.font_16, { fontWeight: '900', alignSelf: 'center' }]}>Ambil Foto</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handlePickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
                        <Text style={[styles.font_16, { fontWeight: '900', alignSelf: 'center' }]}>Buka Galeri</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '2%' }}>
                        <Text style={[styles.font_16, { fontWeight: '900', alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
        </SafeAreaView >
    )
}
