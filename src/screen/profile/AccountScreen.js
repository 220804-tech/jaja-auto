import React, { useState, useEffect, useCallback, createRef } from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, TouchableWithoutFeedback, TextInput, Alert, StyleSheet, Linking, ScrollView, Platform } from "react-native";
import { RadioButton, Button } from "react-native-paper";
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ActionSheet from 'react-native-actions-sheet';
import ActionSheetCamera from 'react-native-actions-sheet';
import EncryptedStorage from "react-native-encrypted-storage";
import { useSelector, useDispatch } from 'react-redux'
import { colors, styles as style, Wp, useNavigation, Loading, Hp, Appbar, Utils } from "../../export";
import { WebView } from 'react-native-webview';

export default function Lainnya() {
    const reduxAuth = useSelector(state => state.auth.auth)
    const reduxUser = useSelector(state => state.user.user)

    const dispatch = useDispatch()
    const navigation = useNavigation();
    const actionSheetRef = createRef();
    const [showWebView, setShowWebView] = useState(false);

    const passwordRef = createRef();
    const imageRef = createRef();
    const [profile, setProfile] = useState([]);
    const [accountBank, setAccountBank] = useState("");
    const [accountShow, setAccountShow] = useState(true);

    const [email, setemail] = useState("");
    const [name, setname] = useState("");
    const [date, setdate] = useState("");
    const [gender, setgender] = useState("");
    const [photo, setphoto] = useState(null);
    const [telephone, settelephone] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [checked, setChecked] = useState('');
    const [showButton, setshowButton] = useState(false);
    const [loading, setloading] = useState(true);
    const [view, setview] = useState(false);
    const [open, setOpen] = useState("Nama Lengkap");
    const [textInputColor, settextInputColor] = useState("#C0C0C0");
    const [oldcolor, setoldcolor] = useState("#C0C0C0");
    const [passwordcolor, setpasswordcolor] = useState("#C0C0C0");
    const [confirmcolor, setconfrimcolor] = useState("#C0C0C0");


    const [oldpassword, setoldpassword] = useState("");
    const [alertOldPassword, setalertOldPassword] = useState("");
    const [confirmPasswordState, setconfirmPasswordState] = useState("");
    const [password, setpassword] = useState("");
    const [alertTextPassword, setalertTextPassword] = useState("");
    const [accPassword, setaccPassword] = useState(false);
    const [alertTextPassword1, setalertTextPassword1] = useState("");
    const [accPassword1, setaccPassword1] = useState(false);

    const getItem = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", reduxAuth);
            myHeaders.append("Cookie", "ci_session=6jh2d2a8uvcvitvneaa2t81phf3lrs3c");

            var raw = "";

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/user/profile", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result?.status.code === 200) {
                        dispatch({ type: 'SET_USER', payload: result.data })
                        dispatch({ type: 'SET_VERIFIKASI', payload: result.data.isVerified })
                        let image = { "path": result.data.image }
                        setProfile(result.data)
                        settelephone(result.data.phoneNumber)
                        setname(result.data.name)
                        setdate(result.data.birthDate)
                        setgender(result.data.gender ? result.data.gender : null)
                        setphoto(image)
                        setemail(result.data.email)
                        setview(result.data.havePassword)
                        EncryptedStorage.setItem('user', JSON.stringify(result.data))
                    } else {
                        Utils.handleErrorResponse(result, 'Error with status code : 12044')
                    }
                    setloading(false)

                })
                .catch(error => {
                    setloading(false)
                    Utils.handleError(error, "Error with status code : 12045")
                });
        } catch (error) {
            setloading(false)
        }
    }

    // const onRefresh = useCallback(() => {
    //     AsyncStorage.getItem("xxTwo").then(toko => {
    //         getItem();
    //     });
    // }, []);

    useEffect(() => {
        getItem();
        getData();
        getAccount()
    }, []);

    useEffect(() => {

        return () => {
            setloading(true)
        }
    }, [])


    const getAccount = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Cookie", "ci_session=71o6pecall1g4dt83l7a6vhl4igak0ms");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/order/ListRekening?id_customer=${reduxUser.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result && Object.keys(result).length && result.status.code == 200) {
                    setAccountShow(true)
                    setAccountBank(String(result.data.items[0].name).slice(0, 4).toLocaleUpperCase() + "-" + String(result.data.items[0].account).slice(0, 4) + "XXXXXX")
                } else {
                    setAccountShow(false)
                    setAccountBank('')
                }
            })
            .catch(error => {
                setAccountBank('')
                setAccountShow(false)
                Utils.handleError(error, "Error with status code : 12042")
            });
    }

    const getData = async () => {
        // try {
        //     let result = await Storage.getpw()
        //     result === true ? setview(true) : setview(false)
        // } catch (error) {
        // }
    }

    const handleEdit = (e) => {
        if (e === "Nama Lengkap") {
            setOpen("Nama Lengkap")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        } else if (e === "Nomor Telephone") {
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
            setOpen("Nomor Telephone")
        } else if (e === "Jenis Kelamin") {
            setOpen("Jenis Kelamin")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);
        } else if (e === "Password") {
            setOpen("Password")
            setTimeout(() => passwordRef.current?.setModalVisible(true), 50);
        } else if (e === "Account Bank") {
            setOpen("Account Bank")
            setTimeout(() => actionSheetRef.current?.setModalVisible(true), 50);

        }
    }
    const showDatePicker = (text) => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date) => {
        let str = JSON.stringify(date);
        setdate(str.slice(1, 11))
        hideDatePicker();
        handleUpdate(str.slice(1, 11), photo)
    };
    const goToPicFromCameras = () => {
        imageRef.current?.setModalVisible(false)
        ImagePicker.openCamera({
            width: 450,
            height: 450,
            cropping: true,
            includeBase64: true,
        }).then((image) => {
            // console.log("🚀 ~ file: AccountScreen.js ~ line 208 ~ goToPicFromCameras ~ image", image)
            setphoto(image)
            handleUpdate(date, image)
        });
    }
    const goToPickImage = () => {
        imageRef.current?.setModalVisible(false)
        ImagePicker.openPicker({
            width: 450,
            height: 450,
            cropping: true,
            includeBase64: true,
        }).then((image) => {
            setphoto(image)
            handleUpdate(date, image)
        });
    }
    const handleUpdate = (date, image) => {
        console.log("🚀 ~ file: AccountScreen.js ~ line 195 ~ handleUpdate ~ date", date.split("-").reverse().join("-"))
        console.log("🚀 ~ file: AccountScreen.js ~ line 195 ~ handleUpdate ~ date", date.split("-").reverse().join("-") === profile.birthDate)

        console.log("🚀 ~ file: AccountScreen.js ~ line 195 ~ handleUpdate ~ date", profile.birthDate)

        if (name !== profile.name || telephone !== profile.phoneNumber || image.path !== profile.image || gender !== profile.gender || date.split("-").reverse().join("-") !== profile.birthDate) {
            setshowButton(true)
            console.log(true, "handleUpdate");
        } else {
            console.log(false, "close");
            setshowButton(false)
        }
    }

    const handleSimpan = async () => {
        setloading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", reduxAuth);
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=6r791k9ainrf0grr1nns27gosmdt75i5");

        var raw = JSON.stringify({
            "name": name,
            "phoneNumber": telephone,
            "email": profile.email,
            "gender": gender === "pria" ? "pria" : "wanita",
            "birthDate": date ? date : profile.birthDate,
            "photo": photo.data ? "data:image/jpeg;base64," + photo.data : profile.imageFile
        })
        // console.log("🚀 ~ file: AccountScreen.js ~ line 208 ~ handleSimpan ~ photo && photo.data ? photo.data : profile.imageFile", photo && photo.data ? photo.data : profile.imageFile)
        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setTimeout(() => setloading(false), 500);
                setshowButton(false)
                if (result.status.code === 200) {
                    getItem()
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Profile anda berhasil diubah!", [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            },
                        ],
                            { cancelable: false }
                        );
                    }, 600);
                } else {
                    Utils.handleErrorResponse(result, "Error with status code: 12028")
                }
            })
            .catch(error => {
                Utils.handleError(error, "Error with status code : 12029")
                console.log("🚀 ~ file: AccountScreen.js ~ line 259 ~ handleSimpan ~ error", error)
                setloading(false)
            });
    }
    const confirmPassword = (e) => {
        setalertTextPassword('Password tidak sama!');
        console.log(e.nativeEvent.text, ' confirm password');
        if (e.nativeEvent.text === password) {
            setaccPassword(true)
            setalertTextPassword("")
        }
        setconfirmPasswordState(e.nativeEvent.text)
    };
    const handlePassword = (e) => {
        if (accPassword === true) {
            if (confirmPasswordState !== password) {
                setalertTextPassword("Password tidak sama!")
                setaccPassword(false)
            } else {
                setalertTextPassword("")
                setaccPassword(true)
            }
        }
        const str = e.nativeEvent.text;
        if (str.length < 6) {
            setalertTextPassword1("Password terlalu pendek")
            setaccPassword1(false)
        } else {
            setalertTextPassword1("")
            setaccPassword1(true)
        }
        setpassword(e.nativeEvent.text)
    };

    const handleReset = () => {
        if (password === '') setalertTextPassword1('Password tidak boleh kosong!');
        if (confirmPasswordState === '') {
            setalertTextPassword('Konfirmasi password tidak boleh kosong!')
        } else {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => setloading(true), 100);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=jsa5vc624ko4lhupcms2jg6iba1p573f");

            var raw = JSON.stringify({ "email": email, "old_password": oldpassword, "new_password": password, "confirm_new_password": confirmPasswordState });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/change_password/new", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setTimeout(() => {
                            setloading(false)
                            Alert.alert(
                                "Jaja.id",
                                "Kata sandi anda berhasil diubah!", [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("pressed"),
                                    style: "cancel"
                                },
                            ],
                                { cancelable: false }
                            );
                        }, 100);
                    } else if (result.status.code === 400) {
                        setTimeout(() => {
                            setloading(false)
                        }, 300);
                        if (result.status.message === "confirm password not same") {
                            setTimeout(() => {
                                setalertTextPssword("Konfirmasi password tidak sama!")
                                Alert.alert(
                                    "Jaja.id",
                                    "Konfirmasi password tidak sama!", [
                                    {
                                        text: "Ok",
                                        onPress: () => actionSheetRef.current?.setModalVisible(true),
                                    },
                                ],
                                    { cancelable: false }
                                );
                            }, 500);
                        } else if (result.status.message === "password old not same") {
                            setTimeout(() => {
                                setalertOldPassword("Password lama anda salah!")
                                Alert.alert(
                                    "Jaja.id",
                                    "Password lama anda salah!", [
                                    {
                                        text: "Ok",
                                        onPress: () => actionSheetRef.current?.setModalVisible(true),
                                    },
                                ],
                                    { cancelable: false }
                                );
                                console.log("tidak sama");
                            }, 500);
                        }
                    } else {
                        setloading(false)
                        Utils.handleErrorResponse(result, "Error with status code : 12046")
                    }
                })
                .catch(error => {
                    setloading(false)
                    Utils.handleError(error, "Error with status code : 12047")
                });
        }
    }

    const handleAdd = () => {
        if (password === '') setalertTextPassword1('Password tidak boleh kosong!');
        if (confirmPasswordState === '') {
            setalertTextPssword('Konfirmasi password tidak boleh kosong!')
        } else {
            actionSheetRef.current?.setModalVisible(false)
            setTimeout(() => setloading(true), 100);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "email": email, "new_password": password, "confirm_new_password": confirmPasswordState });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/change_password/add", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status.code === 200) {
                        setTimeout(() => {
                            setloading(false)
                            Alert.alert(
                                "Jaja.id",
                                "Kata sandi anda berhasil diubah!", [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("pressed"),
                                    style: "cancel"
                                },
                            ],
                                { cancelable: false }
                            );
                        }, 100);
                    } else {
                        setloading(false)
                        Utils.handleErrorResponse(result, 'Error with status code : 12038')
                    }
                })
                .catch(error => {
                    setloading(false)
                    Utils.handleError(error, "Error with status code : 12039")
                });
        }
    }
    return (
        <SafeAreaView style={style.containerFix}>
            {loading ? <Loading /> : null}
            {/* <View style={styles.header}> */}
            <Appbar back={true} title="Pengaturan Akun" />
            {/* <Image style={styles.imageHeader} source={require('../../icon/head2.png')} /> */}
            {/* </View> */}
            {/* </View> */}
            {/* <Image loadingIndicatorSource={<ActivityIndicator />} style={styles.avatar} source={{ uri: photo.path === null ? 'https://bootdey.com/img/Content/avatar/avatar6.png' : photo.path }} /> */}
            <View style={style.containerIn}>
                {showWebView ?
                    <WebView
                        source={{ uri: 'market://details?id=com.seller.jaja' }}
                        // onLoadEnd={() => { setIsLoading(false) }}
                        style={{ flex: 1 }}
                    /> :
                    <ScrollView>
                        <View style={styles.card}>
                            {/* <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', marginBottom: '11%' }}>
                            <View style={{ width: Wp('32%'), height: Wp('32%'), borderRadius: 100, backgroundColor: colors.Silver, borderWidth: 0.5, borderColor: colors.White }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 100 }} source={{ uri: photo && photo.path ? photo.path : null }} />
                                <TouchableOpacity onPress={() => imageRef.current?.setModalVisible()} style={{ position: 'absolute', bottom: 10, right: 0, backgroundColor: colors.BlueJaja, height: Wp('8%'), width: Wp('8%'), borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: '50%', height: '50%', tintColor: colors.White }} source={require('../../assets/icons/camera.png')} />
                                </TouchableOpacity>
                            </View>
                        </View> */}
                            {
                                Platform.OS == 'android' ?
                                    <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', marginBottom: '11%' }}>
                                        <View style={{ width: Wp('32%'), height: Wp('32%'), borderRadius: 100, backgroundColor: colors.Silver, borderWidth: 0.5, borderColor: colors.White }}>
                                            <Image style={{ width: '100%', height: '100%', borderRadius: 100 }} source={{ uri: photo && photo.path ? photo.path : null }} />
                                            <TouchableOpacity onPress={() => imageRef.current?.setModalVisible()} style={{ position: 'absolute', bottom: 10, right: 0, backgroundColor: colors.BlueJaja, height: Wp('8%'), width: Wp('8%'), borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                                <Image style={{ width: '50%', height: '50%', tintColor: colors.White }} source={require('../../assets/icons/camera.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View />
                            }
                            {/* onPress={() => handleEdit("Nama Lengkap")} */}
                            <TouchableWithoutFeedback >
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Nama Lengkap</Text>
                                    <View style={styles.formItem}>
                                        {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{name ? name : ""}</Text> */}
                                        {/* <TouchableOpacity onPress={() => handleEdit("Nama Lengkap")} style={[styles.btnUbah,style.shadow_3]}>
                                            <Text adjustsFontSizeToFit style={styles.ubah}>{name ? "Ubah" : "Tambah"}</Text>
                                        </TouchableOpacity> */}
                                        <TextInput
                                            value={name}
                                            onChangeText={(text) => setname(text)}
                                            style={[styles.textInput, style.font_13]}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Email</Text>
                                    <View style={styles.formItem}>
                                        <TextInput
                                            value={email}
                                            editable={false}
                                            style={[styles.textInput, style.font_13]}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Tanggal Lahir</Text>
                                    <View style={styles.formItem}>
                                        <TextInput
                                            value={date ? date : "Pilih Tanggal Lahir"}
                                            editable={false}
                                            style={[styles.textInput, style.font_13, { color: date ? colors.BlackGrayScale : colors.Silver }]}
                                        />
                                        {!date || String(date).includes('1970') ?
                                            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={[styles.btnUbah, style.shadow_3]}>

                                                <Text adjustsFontSizeToFit style={styles.ubah}>{!date ? 'Tambah' : 'Edit'}</Text>
                                            </TouchableOpacity>
                                            : null}
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={[styles.form, style.mt, { flexDirection: 'column' }]}>
                                <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>{gender ? gender == "pria" ? "Laki - Laki" : "Perempuan" : "Pilih Jenis Kelamin"}</Text>
                                <View style={[style.row_between_center, style.mt_2]}>
                                    <View style={[style.row_center]}>
                                        <RadioButton
                                            color={colors.YellowJaja}
                                            value="first"
                                            status={gender === "pria" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setgender("pria")
                                                setshowButton(true)
                                            }}
                                        />
                                        <Text adjustsFontSizeToFit style={[styles.formPlaceholder, { textAlignVertical: 'center' }]}>Laki - Laki</Text>
                                    </View>
                                    <View style={[style.row_center]}>
                                        <RadioButton

                                            color={colors.YellowJaja}
                                            value="second"
                                            status={gender === "wanita" ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setgender("wanita")
                                                setshowButton(true)

                                            }}
                                        />
                                        <Text adjustsFontSizeToFit style={style.font_14}>Perempuan</Text>
                                    </View>
                                </View>
                                {/* <Text adjustsFontSizeToFit style={[style.font_14]}>Jenis Kelamin</Text>
                            <View style={styles.formItem}>
                                <Text adjustsFontSizeToFit style={styles.formPlaceholder}>{gender ? gender == "pria" ? "Laki - Laki" : "Perempuan" : "Pilih Jenis Kelamin"}</Text>
                                {!gender ? <Text adjustsFontSizeToFit style={styles.ubah}>Tambah</Text> : null}
                            </View> */}
                            </View>
                            {/* onPress={() => handleEdit("Nomor Telephone")} */}
                            <TouchableWithoutFeedback >
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Telephone</Text>
                                    <View style={styles.formItem}>
                                        <TextInput
                                            placeholderTextColor={colors.Silver}
                                            placeholder="Nomor telephone"
                                            value={telephone && telephone !== 'undefined' ? telephone : ''}
                                            onChangeText={(text) => settelephone(text)}
                                            style={[styles.textInput, style.font_13]}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback>
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Password</Text>
                                    <View style={styles.formItem}>
                                        <TextInput
                                            value={view ? '********' : '-'}
                                            editable={false}
                                            onChangeText={(text) => setname(text)}
                                            style={[styles.textInput, style.font_13]}
                                        />
                                        <TouchableOpacity onPress={() => passwordRef.current?.setModalVisible(true)} style={[styles.btnUbah, style.shadow_3]}>
                                            <Text adjustsFontSizeToFit style={styles.ubah}>{view ? "Ubah" : "Tambah"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback >
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_13, style.T_semi_bold, { color: colors.BlueJaja }]}>Rekening</Text>
                                    <View style={[styles.formItem]}>
                                        <TextInput
                                            value={accountShow ? accountBank : 'Tambah Rekening'}
                                            editable={false}
                                            placeholder="ASDA"
                                            style={[styles.textInput, style.font_13, { color: accountShow ? colors.BlackGrayScale : colors.Silver, }]}
                                        />
                                        <TouchableOpacity onPress={() => navigation.navigate('AddAccount')} style={[styles.btnUbah, style.shadow_3]}>
                                            <Text adjustsFontSizeToFit style={styles.ubah}>{accountShow ? 'Edit' : 'Tambah'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <Button onPress={handleSimpan} color={colors.BlueJaja} mode="contained" labelStyle={[style.font_13, style.T_semi_bold, { color: colors.White }]} style={style.mb_5}>Simpan</Button>
                            {/* 
                        <TouchableWithoutFeedback onPress={() => Linking.openURL("market://details?id=com.seller.jaja")}>
                            <Text adjustsFontSizeToFit style={[style.font_14, style.my_5, { alignSelf: 'center', color: colors.BlueJaja }]}>Mulai Berjualan?</Text>
                        </TouchableWithoutFeedback> */}
                        </View>
                    </ScrollView>

                }
                <ActionSheet onClose={() => handleUpdate(date, photo)} footerHeight={80} containerStyle={{ paddingHorizontal: '4%', paddingTop: '1%' }}
                    ref={actionSheetRef}>
                    <View style={[style.row_between_center, style.my_2]}>
                        <Text adjustsFontSizeToFit style={style.actionSheetTitle}>Atur Profile</Text>
                        <TouchableOpacity style={[style.row_center, style.py, style.px_3, { backgroundColor: colors.YellowJaja, borderRadius: 3 }]} onPress={() => actionSheetRef.current?.setModalVisible(false)}  >
                            <Text adjustsFontSizeToFit style={[style.font_11, style.T_semi_bold, { color: colors.White }]}>Simpan</Text>

                        </TouchableOpacity>
                    </View>
                    <View style={[style.column, style.pb_5, style.mb_5]}>
                        {open === "Nama Lengkap" ?
                            <View style={styles.form}>
                                <Text adjustsFontSizeToFit style={[style.font_14]}>{open}</Text>
                                <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                                    {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>Testing toko</Text> */}
                                    <TextInput
                                        style={styles.inputbox}
                                        placeholder=""
                                        value={name}
                                        onFocus={() => settextInputColor(colors.BlueJaja)}
                                        onBlur={() => settextInputColor('#C0C0C0')}
                                        keyboardType="default"
                                        maxLength={25}
                                        onChangeText={(text) => setname(text)}
                                        theme={{
                                            colors: {
                                                primary: colors.BlueJaja,
                                            },
                                        }}
                                    />
                                    {/* <Image /> */}
                                </View>
                            </View>
                            : open === "Nomor Telephone" ?
                                <View style={styles.form}>
                                    <Text adjustsFontSizeToFit style={[style.font_14]}>{open}</Text>
                                    <View style={[styles.formItem, { paddingBottom: '1%', borderBottomColor: textInputColor, borderBottomWidth: 1 }]}>
                                        {/* <Text adjustsFontSizeToFit style={styles.formPlaceholder}>Testing toko</Text> */}
                                        <TextInput
                                            style={styles.inputbox}
                                            placeholder="Input nomor telephone"
                                            placeholderTextColor={colors.Silver}

                                            value={telephone}
                                            onFocus={() => settextInputColor(colors.BlueJaja)}
                                            onBlur={() => settextInputColor('#C0C0C0')}
                                            keyboardType="numeric"
                                            maxLength={13}
                                            onChangeText={(text) => settelephone(text)}
                                            theme={{
                                                colors: {
                                                    primary: colors.BlueJaja,
                                                },
                                            }}
                                        />
                                    </View>
                                </View>
                                : open === "Jenis Kelamin" ?
                                    <View style={{ flex: 0, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                                        < View style={{ flex: 0, alignItems: 'center', flexDirection: 'row' }}>
                                            <RadioButton
                                                value="first"
                                                status={checked === 'pria' ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    setgender("pria")
                                                }}
                                            />
                                            <Text adjustsFontSizeToFit style={style.font_14}>Laki - Laki</Text>
                                        </View>
                                        <View style={{ flex: 0, alignItems: 'center', flexDirection: 'row' }}>
                                            <RadioButton
                                                value="second"
                                                status={gender === 'wanita' ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    setgender("wanita")
                                                }}
                                            />
                                            <Text adjustsFontSizeToFit style={style.font_14}>Perempuan</Text>
                                        </View>
                                    </View>
                                    : null
                        }

                    </View>
                </ActionSheet >
                <ActionSheet onClose={() => handleUpdate(date, photo)} footerHeight={80} containerStyle={{ paddingHorizontal: '4%', paddingTop: '1%' }}
                    ref={passwordRef}>
                    <View style={[style.row_between_center, style.my_2]}>
                        <Text adjustsFontSizeToFit style={[style.font_16, style.T_bold, { color: colors.BlueJaja }]}>Atur Pofile</Text>
                        <TouchableOpacity onPress={() => passwordRef.current?.setModalVisible(false)}  >
                            <Image
                                style={[style.icon_16, { tintColor: colors.BlackGrey }]}
                                source={require('../../assets/icons/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.actionSheetBody}> */}
                    {!view ?
                        <View style={[styles.form]}>
                            <Text adjustsFontSizeToFit style={[style.font_14]}>Kata sandi lama</Text>
                            <View style={[styles.formItem, style.mb_3]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Input kata sandi lama"
                                    onChangeText={(text) => setoldpassword(text)}
                                    onFocus={() => setoldcolor(colors.BlueJaja)}
                                    onBlur={() => setoldcolor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={20}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                            </View>
                            <Text adjustsFontSizeToFit style={[style.font_14]}>Kata sandi baru</Text>
                            <View style={[styles.formItem]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Input kata sandi baru"
                                    secureTextEntry
                                    onFocus={() => setpasswordcolor(colors.BlueJaja)}
                                    onBlur={() => setpasswordcolor('#C0C0C0')}
                                    keyboardType="default"
                                    onChange={handlePassword}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                                {/* <Image /> */}
                            </View>
                            <Text adjustsFontSizeToFit style={[style.font_10, style.T_light, { color: 'red', marginBottom: alertTextPassword1 ? '2%' : '0%' }]}>{alertTextPassword1}</Text>
                            <Text adjustsFontSizeToFit style={[style.font_14]}>Konfirmasi kata sandi baru</Text>
                            <View style={[styles.formItem, style.mb_2,]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Konfirmasi kata sandi baru"
                                    secureTextEntry
                                    onFocus={() => setconfrimcolor(colors.BlueJaja)}
                                    onBlur={() => setconfrimcolor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={13}
                                    onChange={confirmPassword}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                                {/* <Image /> */}
                            </View>
                            <Text adjustsFontSizeToFit style={{ color: 'red', marginBottom: '5%', fontSize: 12 }}>{alertTextPassword}</Text>

                            <Button color={colors.BlueJaja} mode="contained" onPress={handleReset}>
                                Simpan
                            </Button>
                        </View> :
                        <View style={styles.form}>
                            <Text adjustsFontSizeToFit style={[style.font_14]}>Kata sandi baru</Text>
                            <View style={[styles.formItem]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Input kata sandi baru"
                                    secureTextEntry
                                    onFocus={() => setpasswordcolor(colors.BlueJaja)}
                                    onBlur={() => setpasswordcolor('#C0C0C0')}
                                    keyboardType="default"
                                    onChange={handlePassword}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                                {/* <Image /> */}
                            </View>
                            <Text adjustsFontSizeToFit style={[style.font_11, style.T_light, { color: colors.RedNotif, marginBottom: alertTextPassword1 ? '2%' : '0%' }]}>{alertTextPassword1}</Text>
                            <Text adjustsFontSizeToFit style={[style.font_14]}>Konfirmasi kata sandi baru</Text>
                            <View style={[styles.formItem]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Konfirmasi kata sandi baru"
                                    secureTextEntry
                                    onFocus={() => setconfrimcolor(colors.BlueJaja)}
                                    onBlur={() => setconfrimcolor('#C0C0C0')}
                                    keyboardType="default"
                                    maxLength={13}
                                    onChange={confirmPassword}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                                {/* <Image /> */}
                            </View>
                            <Text adjustsFontSizeToFit style={[style.font_11, style.T_light, { color: colors.RedNotif, marginBottom: '3%' }]}>{alertTextPassword}</Text>

                            <Button color={colors.BlueJaja} labelStyle={[style.font_13, style.T_bold, { color: colors.White }]} mode="contained" onPress={handleAdd}>
                                Simpan
                            </Button>
                        </View>

                    }
                    {/* </View> */}
                </ActionSheet>
                <ActionSheetCamera containerStyle={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: colors.White }} ref={imageRef}>
                    <View style={[styles.column, { backgroundColor: '#ededed' }]}>
                        <TouchableOpacity onPress={goToPicFromCameras} style={{ borderBottomWidth: 0.5, borderBottomColor: colors.Silver, alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Ambil Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goToPickImage} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '3%', marginBottom: '1%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center' }]}>Buka Galeri</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => galeryRef.current?.setModalVisible(false)} style={{ alignSelf: 'center', width: Wp('100%'), backgroundColor: colors.White, paddingVertical: '2%' }}>
                            <Text style={[styles.font_16, { alignSelf: 'center', color: colors.RedNotif }]}>Batal</Text>
                        </TouchableOpacity>
                    </View >
                </ActionSheetCamera >
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(text) => handleConfirmDate(text)}
                    onCancel={() => hideDatePicker()}
                />
            </View >
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    textInput: { width: '80%', padding: '1%' },
    inputbox: {
        width: '100%',
        backgroundColor: 'transparent',
        color: 'black'
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
    form: {
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '0.5%',
        marginBottom: '1.5%'
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingVertical: '1%'
    },
    formTitle: {
        fontSize: 14, color: 'grey', fontFamily: 'SignikaNegative-Regular'
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
    card: { flex: 1, flexDirection: 'column', padding: '4%', marginBottom: '2%', backgroundColor: colors.White },
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
        fontSize: 12,
        color: colors.White,
        fontFamily: 'SignikaNegative-SemiBold',
        width: '100%',
        textAlign: 'center',
        marginTop: Platform.OS === 'android' ? '-2%' : 0
    },
    btnUbah: {
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: colors.YellowJaja, width: '17%',
        borderRadius: 5,
        paddingVertical: '0%'
    },
    body: { flex: 1, flexDirection: 'column', padding: '4%', },
    banner: { width: Wp('50%'), height: '100%', borderRadius: 7 },
    bannerPromo: { width: Wp('25%'), height: '100%', borderRadius: 7 },
    formPlaceholder: {
        flex: 0, fontSize: 14, color: colors.BlackGrayScale, fontFamily: 'SignikaNegative-Regular', marginTop: Platform.OS === 'android' ? '-0.2%' : 0
    },
    formItemImage: {
        flex: 1, width: Wp('50%'), height: Wp('50%'), borderRadius: 7
    },
    formItemPromo: {
        flex: 0, width: Wp('25%'), height: Wp('23%'), borderRadius: 7, marginRight: '5%', marginBottom: "5 %",
    },
    formPromo: {
        flex: 0, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%', paddingBottom: '2%', paddingTop: '1%'
    },
    iconDelete: { position: 'absolute', right: -5, top: -5, width: 25, height: 25, backgroundColor: '#CC0000', borderRadius: 100 },
    iconDeleteImage: { alignSelf: "center", width: 10, height: 10, resizeMode: 'contain', flex: 1, borderRadius: 25, tintColor: colors.White },


    image: {
        width: Wp('33%'),
        height: Wp('33%'),
        borderRadius: 5,
    },
    btn: { marginRight: '3%', marginBottom: '3%' },
    iconCalendar: {
        position: 'absolute',
        tintColor: colors.BlueJaja,
        width: 25,
        height: 25,
        right: 10,
        bottom: 15,
    },
    flexRow: {
        flex: 0,
        flexDirection: 'row',
        borderBottomWidth: 0.2
    },
    label: {
        fontSize: 14,
        fontFamily: 'SignikaNegative-SemiBold',
        marginTop: '3%',
        color: colors.BlackGrayScale,
    },
})
