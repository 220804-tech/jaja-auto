import React, { useState, useEffect, createRef, useCallback } from 'react'
import { SafeAreaView, View, Text, Image, Alert, TouchableOpacity, ToastAndroid, StatusBar, TouchableHighlight, ScrollView, Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import colors from '../../assets/colors'
import { styles } from '../../assets/styles/styles'
import { Button, TextInput } from 'react-native-paper'
import { Language, Loading, CheckSignal, Wp, ServiceOrder, useFocusEffect, ServiceUser, Appbar, Hp, Utils, AppleType } from '../../export'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { appleAuthAndroid, AppleButton, appleAuth, } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

export default function LoginScreen(props) {
    let navigation = useNavigation()
    const dispatch = useDispatch()

    let emailRef = createRef();
    let passwordRef = createRef();
    const [secure, setSecure] = useState(true)
    const [focus, setfocus] = useState("")
    const [user, setUser] = useState("")

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alertPassword, setalertPassword] = useState("")
    const [alertText, setAlertText] = useState("")
    const [loading, setLoading] = useState(false)
    const [navigate, setNavigate] = useState("")
    const [loginGoogle, setLoginGoogle] = useState(true)
    const [loginApple, setloginAplle] = useState('')

    useEffect(() => {
        setLoading(false)
        if (props.route && props.route.params && props.route.params.navigate) {
            setNavigate(props.route.params.navigate)
        } else {
            setNavigate('')
        }
        GoogleSignin.configure({
            webClientId: "284366139562-tnj3641sdb4ia9om7bcp25vh3qn5vvo8.apps.googleusercontent.com",
            offlineAccess: true
        });
    }, [props])

    useFocusEffect(
        useCallback(() => {
            if (GoogleSignin.isSignedIn()) {
                signOut()
            }
        }, []),
    );

    useEffect(() => {
        EncryptedStorage.getItem('emailVerification').then(res => {
            if (res) {
                let result = JSON.parse(res)
                if (result && result !== 'done') {
                    navigation.navigate('VerifikasiEmail', { email: result })
                }
            }
        })

    }, [])


    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setUser("") // Remember to remove the user from your app's state as well
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
            setAlertText('Password tidak boleh kosong!')
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
                    console.log("🚀 ~ file: LoginScreen.js ~ line 106 ~ handleSubmit ~ result", result)
                    if (result.status.code === 200) {
                        AsyncStorage.setItem('token', JSON.stringify(result.data))
                        handleUser(result.data)
                        EncryptedStorage.setItem("token", JSON.stringify(result.data))
                    } else if (result.status.code === 400 || result.status.code === 404) {
                        if (String(result.status.message).includes("belum di verifikasi")) {
                            Utils.alertPopUp("Akun anda belum diverifikasi")
                            navigation.navigate('VerifikasiEmail', { email: email })
                        } else if (String(result.status.message).includes("data not found")) {
                            setAlertText('Email atau password anda salah!')
                        } else if (result.status.message.includes("incorrect email or password")) {
                            setAlertText('Email atau password anda salah!')
                        } else {
                            setAlertText(String(result.status.message))
                        }
                        setLoading(false)
                    } else {
                        setAlertText(String(result.status.message) + ' ' + String(result.status.code))
                        setLoading(false)
                    }
                })
                .catch(error => {
                    setLoading(false)
                    Utils.handleError(String(error), 'Error with status code : 12111')
                })
        }
        setTimeout(() => {
            setLoading(false)
        }, 4000);

    }

    const handleUser = (data) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", data);
        myHeaders.append("Cookie", "ci_session=pjrml5k3rvvcg54esomu3vakagc10iu5");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/profile", requestOptions)
            .then(response => response.text())
            .then(resp => {
                try {
                    let result = JSON.parse(resp)
                    if (result.status.code === 200) {
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


                    } else {
                        Utils.alertPopUp('Error ' + result.status.message + ' with status code =>' + result.status.code)
                    }
                } catch (error) {
                    Utils.handleError(String(error), 'Error with status code : 12113')
                }

            })
            .catch(error => Utils.alertPopUp(String(error)));
    }

    const getOrders = (auth) => {
        if (auth) {
            ServiceOrder.getUnpaid(auth).then(resUnpaid => {
                if (resUnpaid) {
                    dispatch({ type: 'SET_UNPAID', payload: resUnpaid.items })
                    dispatch({ type: 'SET_ORDER_FILTER', payload: resUnpaid.filters })
                }
            }).catch(err => {
                Utils.alertPopUp(String(err), 'Error with status code : 12112')
            })
            ServiceOrder.getWaitConfirm(auth).then(reswaitConfirm => {
                if (reswaitConfirm) {
                    dispatch({ type: 'SET_WAITCONFIRM', payload: reswaitConfirm.items })
                }
            }).catch(err => {

            })
            ServiceOrder.getProcess(auth).then(resProcess => {
                if (resProcess) {
                    dispatch({ type: 'SET_PROCESS', payload: resProcess.items })
                }
            }).catch(err => {

            })
            ServiceOrder.getSent(auth).then(resSent => {
                if (resSent) {
                    dispatch({ type: 'SET_SENT', payload: resSent.items })
                }
            }).catch(err => {

            })
            ServiceOrder.getCompleted(auth).then(resCompleted => {
                if (resCompleted) {
                    dispatch({ type: 'SET_COMPLETED', payload: resCompleted.items })
                }
            }).catch(err => {

            })
            ServiceOrder.getFailed(auth).then(resFailed => {
                if (resFailed) {
                    dispatch({ type: 'SET_FAILED', payload: resFailed.items })
                }
            }).catch(err => {

            })
        }
    }
    const onGoogleButtonPress = async () => {
        signOut()
        if (loginGoogle) {
            setLoginGoogle(false)
            try {
                await GoogleSignin.hasPlayServices()
                const userInfo = await GoogleSignin.signIn();
                console.log("🚀 ~ file: LoginScreen.js ~ line 252 ~ onGoogleButtonPress ~ userInfo", userInfo)
                setLoading(true)
                handleCheckUser(userInfo)
                setLoginGoogle(true)
            } catch (error) {
                console.log("🚀 ~ file: LoginScreen.js ~ line 256 ~ onGoogleButtonPress ~ error", String(error))
                setLoading(false)
                if (String(error).includes === 'Sign-in in progress') {
                    signOut()
                }
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
                setLoginGoogle(true)

            }
        }
    }

    const handleCheckUser = (data) => {
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
                    AsyncStorage.setItem('token', JSON.stringify(result.data))
                    handleUser(result.data)
                    EncryptedStorage.setItem("token", JSON.stringify(result.data))
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

    const handleCheckUserApple = (data) => {
        try {
            setLoading(true)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let emailApple = data.email?.split('@')[0]

            var raw = JSON.stringify({
                "email": data.email,
                "fullName": data?.fullName?.givenName ? data.fullName.givenName : emailApple,
                "image": ''
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://jaja.id/backend/user/apple", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setloginAplle(result.data)
                    if (result.status.code === 200) {
                        handleUser(result.data)
                        AsyncStorage.setItem('token', JSON.stringify(result.data))
                        EncryptedStorage.setItem("token", JSON.stringify(result.data))
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
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false)
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
        } catch (error) {
            setLoading(false)
            console.log("🚀 ~ file: LoginScreen.js ~ line 457 ~ handleCheckUserApple ~ error", error)
        }
    };

    const onAppleButtonPress = async () => {
        try {
            // Start the sign-in request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            // Create a Firebase credential from the response
            const { identityToken, nonce } = appleAuthRequestResponse;
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
            if (!appleAuthRequestResponse.identityToken) {
                Utils.alertPopUp('Apple Sign-In failed - no identify token returned')
            }
            try {
                if (appleAuthRequestResponse?.email) {
                    handleCheckUserApple(appleAuthRequestResponse)
                    EncryptedStorage.setItem('appleAccount', JSON.stringify({
                        email: appleAuthRequestResponse.email,
                        fullName: { givenName: appleAuthRequestResponse.fullName.givenName },
                    }))
                } else {
                    EncryptedStorage.getItem('appleAccount').then(res => {
                        if (res) {
                            let appleAccountSave = JSON.parse(res)
                            handleCheckUserApple(appleAccountSave)
                        }
                    }).catch(err => {
                        console.log("🚀 ~ file: LoginScreen.js ~ line 494 ~ EncryptedStorage.setItem ~ err", err.code + ' => ' + err.message)
                    })
                }
            } catch (error) {
                console.log("🚀 ~ file: LoginScreen.js ~ line 485 ~ onAppleButtonPress ~ error", error)
            }
        } catch (error) {
            console.log("🚀 ~ file: LoginScreen.js ~ line 488 ~ onAppleButtonPress ~ error", error)
        }
    }


    return (
        <SafeAreaView style={[props?.appbar ? { flex: 1, backgroundColor: colors.White } : styles.containerFix]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            {props?.appbar ?
                null :
                <Appbar back={true} title="Masuk" />}
            {loading ? <Loading /> : null}

            <View style={[styles.column_around_center, styles.containerIn, styles.mb_5]}>
                <View style={[styles.containerIn, { flexDirection: 'column', height: Hp('100%'), width: Wp('100%'), justifyContent: 'center', alignItems: 'center', }]}>
                    <View style={[styles.row_center, styles.mb_5, { width: Wp('70%'), height: Wp('30%'), marginTop: '-11%' }]}>
                        <Image style={{ flex: 0, height: '100%', width: '100%', resizeMode: 'contain' }} source={require('../../assets/images/JajaId.png')} />
                    </View>
                    <View style={[styles.column_center, { justifyContent: 'flex-start', paddingTop: '7%' }]}>
                        <Text style={[styles.alertText, styles.mb_3, { alignSelf: 'center', width: Wp('85%') }]}>{alertText}</Text>
                        <TextInput
                            ref={emailRef}
                            returnKeyType="next"
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
                                    background: colors.White
                                },
                            }}

                        />
                        <View style={{ flexDirection: 'row', width: Wp('85%'), justifyContent: 'center', alignItems: 'center', marginBottom: '5%' }}>
                            <TouchableHighlight underlayColor={colors.WhiteBack} style={{
                                position: "absolute",
                                right: 11,
                                bottom: 17,
                                justifyContent: "center",
                                alignItems: "center", height: 24, width: 24, zIndex: 100, backgroundColor: colors.White,
                            }}

                                onPress={() => setSecure(!secure)}>
                                <Image style={[{ width: AppleType === 'ipad' ? 34 : 24, height: AppleType === 'ipad' ? 34 : 24, tintColor: colors.BlackGrayScale }]} source={secure ? require('../../assets/icons/eye-active.png') : require('../../assets/icons/eye-visible.png')} />
                            </TouchableHighlight>
                            <TextInput
                                ref={passwordRef}
                                onSubmitEditing={() => this.login()}
                                returnKeyType="done"
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
                                        background: colors.White

                                    },
                                }}

                            />
                        </View>
                        <Button mode="contained" color={colors.BlueJaja} labelStyle={{ color: colors.White }} style={{ width: Wp('85%'), padding: '1%', marginBottom: '3%' }} contentStyle={{ width: '100%' }} onPress={handleSubmit}>
                            {Language("Masuk")}
                        </Button>
                        {/* {appleAuth.isSupported ?
                            <AppleButton
                                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                                buttonType={AppleButton.Type.SIGN_IN}
                                style={{ width: Wp('84.5%'), height: 45 }}
                                onPress={() => onAppleButtonPress()}
                            />
                            : null
                        } */}


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
            </View>
        </SafeAreaView >
    )
}
