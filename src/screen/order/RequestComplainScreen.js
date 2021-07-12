import React, { useState, createRef } from 'react'
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, StatusBar, Image, ScrollView, Alert } from 'react-native'
import { styles, Appbar, colors, Wp, Loading, useNavigation } from '../../export'
import { Button, Checkbox } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import EncryptedStorage from 'react-native-encrypted-storage';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actions-sheet';
import VideoPlayer from 'react-native-video-player';
import RNFS from 'react-native-fs';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

export default function OrderComplain() {
    const navigation = useNavigation()
    const galeryRef = createRef()
    const [activeSections, setactiveSections] = useState(null)
    const [checked, setChecked] = useState(null);
    const [categoryCompalain, setcategoryCompalain] = useState('');
    const [titleComplain, settitleComplain] = useState('');
    const [textComplain, settextComplain] = useState('');
    const [alertText, setalertText] = useState('');
    const [loading, setLoading] = useState(false);

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState('');
    const [videoShow, setVideoShow] = useState('');
    const [index, setIndex] = useState(0);

    const data = [
        { id: '1CV', title: "A. Pengiriman Barang", content: [{ id: '1SX', title: 'Barang tidak diterima, namun status telah sampai.' }, { id: '2SX', title: 'Barang sudah melewati tanggal masksimal pengiriman.' }] },
        { id: '2CV', title: "B. Barang Tidak Sesuai", content: [{ id: '3SX', title: 'Barang rusak.' }, { id: '4SX', title: 'Ukuran barang tidak sesuai.' }, { id: '5SX', title: 'Warna barang tidak sesuai.' }, { id: '6SX', title: 'Barang tidak sesuai spesifikasi.' }] },
        { id: '3CV', title: "C. Lainnya", content: [] },
    ]

    const handleSendComplain = () => {
        if (!activeSections) {
            setalertText('Pilih salah satu alasan komplain!')
        } else if (!titleComplain || titleComplain == " " || titleComplain == "  ") {
            setalertText('Judul komplain tidak boleh kosong')
        } else if (titleComplain.length < 4) {
            setalertText('Judul komplain terlalu singkat')
        } else if (!textComplain || textComplain == " " || textComplain == "  ") {
            setalertText('Alasan komplain tidak boleh kosong!')
        } else if (textComplain.length < 10) {
            setalertText('Alasan komplain terlalu singkat!')
        } else if (activeSections !== "1CV" && !images.length) {
            setalertText('Bukti gambar tidak boleh kosong!')
        } else if (activeSections !== "1CV" && !video) {
            setalertText('Bukti video tidak boleh kosong')
        } else {
            setalertText('')
            Alert.alert(
                "Komplain Pesanan",
                `Kamu yakin akan mengajukan komplain?`,
                [

                    { text: "Batal", onPress: () => console.log("OK Pressed") },
                    {
                        text: "Ajukan", onPress: () => {
                            setLoading(true)
                            let requestComplain = {
                                category: categoryCompalain,
                                title: titleComplain,
                                body: textComplain,
                                image: activeSections !== "1CV" ? images.length : null,
                                video: activeSections !== "1CV" ? videoShow : null
                            }
                            EncryptedStorage.setItem('RequestComplain', JSON.stringify(requestComplain))
                            setTimeout(() => {
                                setLoading(false)
                                navigation.navigate('ResponseComplain')
                            }, 2500);
                        }
                    },

                ],
                { cancelable: false }
            );
        }
    }

    const handlePickImage = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            compressImageQuality: 0.8,
            includeBase64: true
        }).then(media => {
            let fileImage = JSON.parse(JSON.stringify(images))
            if (fileImage.length < 4) {
                fileImage.push(media)
                setImages(fileImage)
            }
            setIndex(index + 1)
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
        }).then(media => {
            let fileImage = JSON.parse(JSON.stringify(images))
            if (fileImage.length < 4) {
                fileImage.push(media)
                setImages(fileImage)
            }
            setIndex(index + 1)
        });
    }

    const handlePickVideo = () => {
        galeryRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            mediaType: "video",
            compressVideoPreset: '640x480',
            compressImageQuality: 0.8,
            maxFiles: 1,
            includeBase64: true,
        }).then(async media => {
            try {
                let base64data = await RNFS.readFile(media.path, 'base64').then();
                setVideoShow(media)
                setVideo(base64data)
                setalertText("")
            } catch (error) {
                console.log("🚀 ~ file: AddReview.js ~ line ss100 ~ handlePickVideo ~ error", error)
            }
        });
    }

    const handleRemoveMedia = (name, i) => {
        if (name === 'image') {
            let newData = images;
            newData.splice(i, 1)
            setImages(newData)
            setIndex(index + 1)
        } else {
            setVideo("")
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={colors.YellowJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <Appbar back={true} title="Komplain Pesanan" Bg={colors.YellowJaja} />
            {loading ? <Loading /> : null}
            <ScrollView>
                <View style={[styles.column_start, styles.p_4, { width: Wp('100%') }]}>
                    <Text numberOfLines={2} style={[styles.font_14, styles.T_semi_bold, styles.mb_5]}>Pilih salah satu komplain atau pilih lainnya : </Text>
                    <FlatList
                        style={{ width: '100%' }}
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <View style={[styles.column_center_start, styles.mb_5, styles.p_3, { backgroundColor: colors.White, elevation: 2, width: '100%', }]}>
                                    <TouchableOpacity onPress={() => setactiveSections(item.id) & setChecked(null) & setcategoryCompalain(item.title) & settitleComplain("") & setalertText("")}><Text style={[styles.font_14, styles.T_semi_bold]}>{item.title}</Text></TouchableOpacity>
                                    <Collapsible style={{ width: '100%', backgroundColor: '#FDFDFD' }} collapsed={activeSections !== item.id ? true : false}>
                                        {
                                            item.content.length ?
                                                <View style={[styles.column, styles.px_3]}>
                                                    <Text style={[styles.font_13, styles.T_medium, styles.my_2]}>1. Pilih judul komplain</Text>
                                                    {item.content.map((child, index) => {
                                                        return (
                                                            <View key={String(index) + 'KZ'} style={[styles.row_start_center, styles.mb_3, { width: '100%' }]}>
                                                                <Checkbox
                                                                    status={checked == index ? 'checked' : 'unchecked'}
                                                                    onPress={() => setChecked(index) & settitleComplain(child.title) & setalertText("")}
                                                                />
                                                                <Text numberOfLines={2} style={[styles.font_13, styles.ml_3, { width: '85%' }]}>{child.title}</Text>
                                                            </View>

                                                        )
                                                    })}
                                                    <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_2]}>2. Masukkan alasan komplain</Text>

                                                    <TextInput
                                                        value={textComplain}
                                                        onChangeText={(text) => settextComplain(text)}
                                                        style={{ borderBottomWidth: 0.5, borderBottomColor: colors.Silver, width: Wp('80%'), marginBottom: '3%' }}
                                                        numberOfLines={5}
                                                        multiline={true}
                                                        placeholder="Masukkan alasan komplain"

                                                        textAlignVertical='top'
                                                    />
                                                </View>
                                                :
                                                <View style={[styles.column, styles.px_3]}>
                                                    <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_2]}>1. Masukkan judul komplain</Text>
                                                    <TextInput
                                                        value={titleComplain}
                                                        onChangeText={(text) => settitleComplain(text)}
                                                        style={{ borderBottomWidth: 0.5, width: Wp('80%') }}
                                                        numberOfLines={1}
                                                        placeholder="Masukkan judul komplain"

                                                        textAlignVertical='top'
                                                    />
                                                    <Text style={[styles.font_13, styles.T_semi_bold, styles.mt_5,]}>2. Masukkan alasan komplain</Text>
                                                    <TextInput
                                                        value={textComplain}
                                                        onChangeText={(text) => settextComplain(text)}
                                                        style={{ borderBottomWidth: 0.5, width: Wp('80%'), minHeight: Wp('15%'), maxHeight: Wp('100%') }}
                                                        numberOfLines={11}
                                                        multiline={true}
                                                        placeholder="Masukkan alasan komplain"
                                                        textAlignVertical='top'
                                                    />
                                                </View>
                                        }
                                    </Collapsible>
                                </View>
                            )
                        }}
                    />
                    {activeSections !== "1CV" ?
                        <View style={[styles.column, { width: '100%' }]}>
                            <Text numberOfLines={2} style={[styles.font_14, styles.T_semi_bold, styles.mb_3]}>Lengkapi bukti komplain : </Text>

                            <View style={styles.row_start_center}>
                                <TouchableOpacity disabled={images.length < 3 ? false : true} onPress={() => galeryRef.current?.setModalVisible()} style={[styles.row, styles.py, styles.px_2, styles.m_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3, marginLeft: '0%' }]}>
                                    <FAIcon name="camera" size={16} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                                    <Text style={[styles.font_12, styles.ml_5]}>Unggah Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handlePickVideo()} style={[styles.row, styles.py, styles.px_2, styles.m_2, { borderWidth: 0.5, borderColor: colors.Silver, borderRadius: 3, marginLeft: '0%' }]}>
                                    <FAIcon name="video" size={16} color={colors.BlueJaja} style={{ alignSelf: 'center' }} />
                                    <Text style={[styles.font_12, styles.ml_5]}>Unggah Video</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                {images.map((val, indx) => {
                                    return (
                                        <View key={indx + "N"} style={styles.my_2}>
                                            <Image style={{ width: Wp('20%'), height: Wp('20%'), marginRight: 15, backgroundColor: 'pink' }} source={{ uri: val.path }} />
                                            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 15, width: Wp('4.3%'), height: Wp('4.3%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveMedia('image', indx)}>
                                                <Image style={{ width: Wp('3%'), height: Wp('3%'), tintColor: colors.Silver }} source={require('../../assets/icons/close.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </View>
                            {video ?
                                <View style={{ width: '100%', height: Wp('50%'), marginVertical: '2%' }}>
                                    <VideoPlayer
                                        video={{ uri: videoShow.path }}
                                        resizeMode="cover"
                                        style={{ height: Wp('50%'), width: '100%' }}
                                        // videoWidth={'100%'}
                                        // videoHeight={'100%'}
                                        disableFullscreen={false}
                                        fullScreenOnLongPress={true}

                                    />
                                    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, width: Wp('5%'), height: Wp('5%'), justifyContent: 'center', alignItems: 'center' }} onPress={() => handleRemoveMedia('video', null)}>
                                        <Image style={{ width: Wp('3.5%'), height: Wp('3.5%'), tintColor: colors.Silver }} source={require('../../assets/icons/close.png')} />
                                    </TouchableOpacity>
                                </View>
                                : null
                            }
                        </View>
                        : null
                    }

                    <Text style={[styles.font_13, styles.my_5, { color: colors.RedNotif }]}>{alertText}</Text>
                    <Button onPress={handleSendComplain} style={{ width: '100%' }} color={colors.YellowJaja} labelStyle={[styles.font_13, styles.T_semi_bold, { color: colors.White }]} mode="contained">Ajukan komplain</Button>

                </View>
            </ScrollView>
            <ActionSheet containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White }} ref={galeryRef}>
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