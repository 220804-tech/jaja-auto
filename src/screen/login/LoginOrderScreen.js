import React, { useState, useEffect, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, Alert, TouchableOpacity, ToastAndroid, StatusBar, TouchableHighlight, ScrollView } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import colors from '../../assets/colors'
import { styles } from '../../assets/styles/styles'
import { Button, TextInput } from 'react-native-paper'
import { Language, Loading, CheckSignal, Wp, ServiceOrder, useFocusEffect, ServiceUser, Appbar, Hp } from '../../export'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import database from '@react-native-firebase/database';

export default function LoginOrderScreen(props) {
    let navigation = useNavigation()
    const dispatch = useDispatch()

    let emailRef = createRef();
    let passwordRef = createRef();
    const [secure, setSecure] = useState(true)
    const [focus, setfocus] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alertPassword, setalertPassword] = useState("")
    const [alertText, setAlertText] = useState("")
    const [loading, setLoading] = useState(false)
    const [navigate, setNavigate] = useState("")


    useEffect(() => {
        setLoading(false)
        if (props.route && props.route.params && props.route.params.navigate) {
            setNavigate(props.route.params.navigate)
        }
        GoogleSignin.configure({
            webClientId: "284366139562-tnj3641sdb4ia9om7bcp25vh3qn5vvo8.apps.googleusercontent.com",
            offlineAccess: true
        });


    }, [props])

    useFocusEffect(
        useCallback(() => {
            if (GoogleSignin.isSignedIn()) {
                console.log("keluar");
                signOut()
            }
        }, []),
    );

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            // setUser("") // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (name, text) => {
        if (name == 'email') {
            setAlertText("")
            setEmail(text)
        } else if (name == 'password') {
            setAlertText("")
            setPassword(text)
        }
    }

    const handleSubmit = () => {
        if (!email) {
            setAlertText('Email tidak boleh kosong!')
        } else if (!password) {
            setAlertText('Password tidak boleh kosong')
        } else {
            setLoading(true)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=jra6dmodn5nc33rhbnpqg3qg2iujc2nd");

            var raw = JSON.stringify({ "email": email, "password": password });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/login", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: LoginScreen.js ~ line 58 ~ handleSubmit ~ result", result)
                    if (result.status.code === 200) {
                        EncryptedStorage.setItem("token", JSON.stringify(result.data))
                        handleUser(result.data)

                        console.log("🚀 ~ file: LoginScreen.js ~ line 82 ~ handleSubmit ~  props", props)
                    } else if (result.status.code === 400 || result.status.code === 404) {
                        if (result.status.message === "account has not been activated") {
                            ToastAndroid.show("Akun anda belum diverifikasi", ToastAndroid.LONG, ToastAndroid.CENTER)
                            navigation.navigate('VerifikasiEmail', { email: email })
                        } else if (result.status.message === "data not found") {
                            setAlertText('Email atau password anda salah!')
                        } else {
                            Alert.alert(
                                "Jaja.id",
                                String(result.status.message) + " => " + result.status.code,
                                [
                                    { text: "TUTUP", onPress: () => console.log("OK Pressed") }
                                ]
                            )
                            setLoading(false)
                            setAlertText('Email atau password anda salah!')
                        }
                    }
                })
                .catch(error => {
                    console.log("🚀 ~ file: LoginScreen.js ~ line 77 ~ handleSubmit ~ error", error.name)
                    CheckSignal().then(res => {
                        if (res.connect === false) {
                            ToastAndroid.show("Tidak dapat terhubung, periksa kembali koneksi internet anda", ToastAndroid.LONG, ToastAndroid.CENTER)
                        } else {
                            Alert.alert(
                                "Jaja.id",
                                String(error),
                                [
                                    { text: "OK", onPress: () => console.log("OK Pressed") }
                                ]
                            )
                        }

                    })
                });
        }
        setTimeout(() => {
            setLoading(false)
        }, 4000);

    }

    const handleUser = (data) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", data);
        myHeaders.append("Cookie", "ci_session=pjrml5k3rvvcg54esomu3vakagc10iu5");

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
                try {
                    EncryptedStorage.setItem('user', JSON.stringify(result.data))
                    dispatch({ type: 'SET_USER', payload: result.data })
                    dispatch({ type: 'SET_VERIFIKASI', payload: result.data.isVerified })
                    EncryptedStorage.getItem('deviceToken').then(res => {
                        if (res) {
                            let token = JSON.parse(res)
                            let user = result.data
                            database().ref("/people/" + user.uid).once('value').then(snapshot => {
                                let item = snapshot.val();
                                if (item) {
                                    database().ref(`/people/${user.uid}/`).update({ name: user.name, photo: user.image, token: token })
                                } else {
                                    database().ref(`/people/${user.uid}/`).set({ name: user.name, photo: user.image, token: token, notif: { home: 0, chat: 0, orders: 0 } })
                                    database().ref(`/friend/${user.uid}/null`).set({ chat: 'null' })
                                }
                            });
                        }
                    })
                    getOrders(data)
                    ServiceUser.getBadges(data).then(res => {
                        if (res) {
                            dispatch({ type: "SET_BADGES", payload: res })
                        } else {
                            dispatch({ type: "SET_BADGES", payload: {} })
                        }
                    })
                    if (navigate) {
                        navigation.setParams({ 'navigate': null });
                        navigation.goBack();
                        setNavigate("")
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Splash' }],
                        })
                    }
                    setTimeout(() => {
                        dispatch({ type: 'SET_AUTH', payload: data })
                        EncryptedStorage.setItem('token', JSON.stringify(data))
                    }, 500);

                } catch (error) {
                    ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                }

            })
            .catch(error => ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER));
    }
    const getOrders = (auth) => {
        if (auth) {
            ServiceOrder.getUnpaid(auth).then(resUnpaid => {
                if (resUnpaid) {
                    dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                    dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
            ServiceOrder.getWaitConfirm(auth).then(reswaitConfirm => {
                if (reswaitConfirm) {
                    dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
            ServiceOrder.getProcess(auth).then(resProcess => {
                if (resProcess) {
                    dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
            ServiceOrder.getSent(auth).then(resSent => {
                if (resSent) {
                    dispatch({ type: 'SET_SENT', payload: resSent.items })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
            ServiceOrder.getCompleted(auth).then(resCompleted => {
                if (resCompleted) {
                    dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
            ServiceOrder.getFailed(auth).then(resFailed => {
                if (resFailed) {
                    dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                }
            }).catch(err => {
                ToastAndroid.show(String(err), ToastAndroid.LONG, ToastAndroid.CENTER)
            })
        }
    }
    const onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn();
            setLoading(true)
            handleCheckUser(userInfo)
        } catch (error) {
            setLoading(false)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("Sign In Cancelled : " + error.code);
            } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                console.log("Sign In Required : " + error.code);
            } else if (error.code == 12502 || error.code === statusCodes.IN_PROGRESS) {
                // Alert.alert(
                //     "Sepertinya ada masalah!",
                //     "Error with status code " + String(error.code), [
                //     {
                //         text: "Reload",
                //         onPress: () => {
                //             navigation.reset({
                //                 index: 0,
                //                 routes: [{ name: 'Splash' }],
                //             })
                //         },
                //         style: "cancel"
                //     },
                // ],
                //     { cancelable: false }
                // );
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("Play Servie Not Available : " + error.code);
            } else {
                Alert.alert(
                    "Jaja.id",
                    String(error) + String(error.code),
                    [
                        {
                            text: "Ok",
                            onPress: () => console.log("Pressed"),
                            style: "cancel"
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    }

    const handleCheckUser = (data) => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": data.user.email,
            "fullName": data.user.name,
            "image": data.user.photo
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/google", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    handleUser(result.data)
                } else {
                    Alert.alert(
                        "Sepertinya ada masalah.",
                        "Get User : " + result.status.message + " " + result.status.code,
                        [
                            {
                                text: "RELOAD", onPress: () => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Splash' }],
                                    })
                                }
                            }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                Alert.alert(
                    "Error!",
                    String(error),
                    [
                        {
                            text: "RELOAD", onPress: () => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Splash' }],
                                })
                            }
                        }
                    ],
                    { cancelable: false }
                );
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            {/* <Appbar back={true} title="Kembali" /> */}
            {loading ? <Loading /> : null}

            <View style={[styles.column_around_center, { flex: 1 }]}>
                <ScrollView>
                    <View style={{ flex: 1, height: Hp('100%'), width: Wp('100%'), justifyContent: 'center', alignItems: 'center' }}>
                        <View style={[styles.row_center, { width: '100%', height: Hp('30%') }]}>
                            <Image style={{ flex: 0, height: Wp('35%'), width: Wp('70%'), resizeMode: 'center' }} source={require('../../assets/images/JajaId.png')} />
                        </View>
                        <View style={[styles.column_center, { flex: 1, justifyContent: 'flex-start', paddingTop: '7%' }]}>
                            <Text style={[styles.alertText, styles.mb_3, { alignSelf: 'center', width: Wp('85%') }]}>{alertText}</Text>
                            <TextInput
                                ref={emailRef}
                                returnKeyType="go"
                                selectionColor={colors.BlueJaja}
                                style={{ width: Wp('85%'), marginBottom: '2%' }}
                                label="Alamat Email"
                                keyboardType="email-address"
                                onChangeText={(text) => handleChange('email', text)}
                                // onSubmitEditing={() => passwordRef.current.show()}
                                mode="outlined"
                                theme={{
                                    colors: {
                                        primary: colors.BlueJaja,
                                    },
                                }}

                            />
                            <View style={{ flexDirection: 'row', width: Wp('85%'), justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                                <TextInput
                                    ref={passwordRef}
                                    // onSubmitEditing={() => this.login()}
                                    returnKeyType="go"
                                    style={{ width: Wp('85%') }}
                                    mode="outlined"
                                    selectionColor={colors.BlueJaja}
                                    label="Kata Sandi"
                                    // value={this.state.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    secureTextEntry={secure}
                                    theme={{
                                        colors: {
                                            primary: colors.BlueJaja,
                                        },
                                    }}
                                />
                                <TouchableHighlight style={{ position: 'absolute', right: 11, alignItems: 'center', height: 24, width: 24, zIndex: 100, backgroundColor: colors.White }} onPress={() => setSecure(!secure)}>
                                    <Image style={styles.icon_24} source={secure ? require('../../assets/icons/eye-active.png') : require('../../assets/icons/eye-visible.png')} />
                                </TouchableHighlight>

                            </View>
                            <Button mode="contained" color={colors.BlueJaja} labelStyle={{ color: colors.White }} style={{ width: Wp('85%'), padding: '1%', }} contentStyle={{ width: '100%' }} onPress={handleSubmit}>
                                {Language("Masuk")}
                            </Button>
                            <View style={{ width: Wp('87%'), justifyContent: 'center', marginBottom: '1%', marginTop: '3%' }}>
                                <GoogleSigninButton
                                    style={{ width: "100%", height: 48 }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={onGoogleButtonPress} />
                            </View>
                            <View style={[styles.row_between_center, styles.mt_5, { width: Wp('85%') }]}>
                                <TouchableOpacity onPress={() => navigation.navigate('Register', { navigate: 'Login' })}><Text style={[styles.font_12]}>Belum punya akun?  <Text style={[styles.font_12, { color: colors.BlueJaja }]}>{Language("Register")}</Text></Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={[styles.font_12, { color: colors.RedNotif }]}>{Language("Lupa password")}!</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}
