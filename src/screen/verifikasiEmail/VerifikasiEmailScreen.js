import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, BackHandler, Alert, StatusBar } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { colors, Loading, Wp, Hp, styles, Appbar, Utils } from '../../export';
import EncryptedStorage from 'react-native-encrypted-storage';

export default class VerifikasiEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step1: false,
            step2: true,
            code: '',
            timeOut: 90,
            button: false,
            password: '',
            confirmPassword: '',
            alertTextPssword: '',
            alertTextPssword1: '',
            accPassword: false,
            accPassword1: false,
            email: '',
            loading: false,

            emailRegist: '',
            passwordRegist: ''
        };
    }

    backAction = () => {
        this.props.navigation.navigate('Login')
        return true;
    };

    componentDidMount() {
        this.setState({
            email: this.props.route.params.email
        })

        EncryptedStorage.getItem('usrverif').then(res => {
            if (res) {
                let result = JSON.stringify(res)
                this.setState({
                    emailRegist: result.eml,
                    passwordRegist: result.pw
                })
            }
        })
        console.log("🚀 ~ file: index.js ~ line 43 ~ index ~ componentDidMount ~ this.props", this.props.route.params.email)
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.timerID = setInterval(() => this.setTime(), 1000);

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }


    handleKirim = () => {
        this.setState({ loading: true })
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log("🚀 ~ file: VerifikasiEmailScreen.js ~ line 55 ~ VerifikasiEmail ~ this.state.email", this.state.email)

        var raw = JSON.stringify({ "email": this.state.email });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/mailing/register", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    this.setState({ loading: false })
                    setTimeout(() => {
                        this.setState({
                            step1: false,
                            step2: true,
                            timeOut: 90,
                            button: false,
                        });
                        setTimeout(() =>
                            Utils.alertPopUp('Periksa email anda untuk melihat kode verifikasi!')
                            , 100);

                        this.timerID = setInterval(() => this.setTime(), 1000);
                    }, 50);
                } else {
                    this.setState({ loading: false })
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message + " => " + result.status.code, [
                            {
                                text: "TUTUP",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        )
                    }, 100);
                }
            })
            .catch(error => {
                this.setState({ loading: false })
                setTimeout(() => {
                    Utils.handleError(error, 'Error with status code : 17001')
                }, 100);
            });
    };


    setTime() {
        let time = this.state.timeOut - 1;
        this.setState({
            timeOut: time,
        });
        if (time < 0) {
            clearInterval(this.timerID);
            this.setState({
                timeOut: 0,
            });
            this.setState({
                button: true,
            });
        }
    }

    handleOtp = (code) => {
        this.setState({ loading: true })
        var formdata = new FormData();
        formdata.append("email", this.props.route.params.email);
        formdata.append("code", code);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/user/verification/register", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200) {
                    setTimeout(() => {
                        this.setState({ loading: false })
                    }, 500);
                    this.handleLogin()
                    setTimeout(() => {
                        this.setState({
                            step1: true,
                            step2: false,
                        });
                    }, 550);
                    EncryptedStorage.setItem('emailVerification', JSON.stringify('done'))

                } else if (result.status.code === 409) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Periksa email anda untuk melihat kode verifikasi!", [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 600);
                } else if (result.status.code === 404) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Anda belum mengirim email vertifikasi!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 300);
                } else if (result.status.code === 400) {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            "Kode vertifikasi tidak benar!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: false,
                                        step2: true,
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 200);
                } else {
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            result.status.message, [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: false,
                                        step2: true,
                                        loading: false
                                    });
                                },
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 200);
                }
            })
            .catch(error => {
                setTimeout(() => {
                    Alert.alert(
                        "Jaja.id",
                        `${String(error)}`, [
                        {
                            text: "Ok",
                            onPress: () => {
                                this.setState({
                                    step1: false,
                                    step2: true,
                                    loading: false
                                });
                            },
                            style: "cancel"
                        }
                    ],
                        { cancelable: false }
                    );
                }, 200);
            });

    };

    handleUser = (data) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", data);
        myHeaders.append("Cookie", "ci_session=pjrml5k3rvvcg54esomu3vakagc10iu5");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
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
    handleLogin = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "ci_session=jra6dmodn5nc33rhbnpqg3qg2iujc2nd");

        var raw = JSON.stringify({ "email": this.state.emailRegist, "password": this.state.passwordRegist });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://jaja.id/backend/user/login", requestOptions)
            .then(response => response.json())
            .then(result => {

                if (result.status.code === 200) {
                    EncryptedStorage.setItem("token", JSON.stringify(result.data))

                } else if (result.status.code === 400 || result.status.code === 404) {
                    if (result.status.message === "account has not been activated") {
                        Utils.alertPopUp('Akun anda belum diverifikasi')
                        this.props.navigation.navigate('VerifikasiEmail', { email: email })
                    } else if (result.status.message === "data not found") {
                        setAlertText('Email atau password anda salah!')
                    } else if (result.status.message === "incorrect email or password") {
                        setAlertText('Email atau password anda salah!')
                    } else {
                        setAlertText(String(result.status.message) + ' ' + String(result.status.code))
                    }
                    setLoading(false)
                }
            })
            .catch(error => {
                console.log("🚀 ~ file: LoginScreen.js ~ line 77 ~ handleSubmit ~ error", error.name)
                CheckSignal().then(res => {
                    if (res.connect === false) {
                        Utils.alertPopUp("Tidak dapat terhubung, periksa kembali koneksi internet anda")
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

    render() {

        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.White }]}>
                <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
                {this.state.loading ?
                    <Loading /> : null
                }
                <Appbar back={true} title="Verifikasi Email" />

                <View style={styles1.container}>
                    {this.state.step1 ?
                        <View style={styles1.containerVerfified}>
                            <Image style={styles1.iconMarket} source={require('../../assets/ilustrations/verified.png')} />
                            <Paragraph style={styles1.textJajakan}>Success<Text style={styles1.textCenter}>, email anda berhasil di verifikasi, kembali belanja</Text></Paragraph>
                            <Button
                                labelStyle={{ color: 'white' }}
                                onPress={() => {
                                    this.setState({ loading: true })
                                    setTimeout(() => this.setState({ loading: false }), 2000);
                                    this.props.navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Splash' }],
                                    })

                                }}
                                mode="contained"
                                contentStyle={styles1.contentButton}
                                color={colors.YellowJaja}
                                style={styles1.button}>
                                Kembali
                            </Button>
                        </View> :
                        <View style={styles.column}>
                            <Text style={styles1.text2}>
                                Buka email anda untuk melihat kode otp yang kami kirim
                            </Text>
                            <OTPInputView
                                style={styles1.kodeOtp}
                                pinCount={6}
                                autoFocusOnLoad={true}
                                codeInputFieldStyle={styles1.underlineStyleBase}
                                codeInputHighlightStyle={styles1.underlineStyleHighLighted}
                                onCodeFilled={(code) => {
                                    this.handleOtp(code);
                                }}
                            />
                            {this.state.button ?
                                <Button
                                    style={styles1.button2}
                                    color={colors.White}
                                    labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.White }]}
                                    mode="contained"
                                    onPress={this.handleKirim}>
                                    Kirim kode otp ulang
                                </Button>
                                :
                                <Button style={styles1.button2}
                                    labelStyle={[styles.font_12, styles.T_semi_bold, { color: colors.BlackGrayScale }]}

                                    disabled mode="contained">
                                    Kirim kode otp ulang ({this.state.timeOut})
                                </Button>
                            }
                        </View>
                    }
                </View>

            </SafeAreaView >
        );
    }
    onChangeMail = (text) => {
        this.setState({
            email: text,
        });
    };

    onChangePass = (pass) => {
        this.setState({ login: '' });
        console.log(pass, 'onchange');

        this.setState({
            password: pass,
        });
    };

    confirmPassword = (e) => {
        this.setState({ alertTextPssword: 'password tidak sama!' });
        console.log(e.nativeEvent.text, ' confirm password');
        if (e.nativeEvent.text === this.state.password) {
            this.setState({
                alertTextPssword: '',
                accPassword: true,
            });
        }
        this.setState({ confirmPassword: e.nativeEvent.text });
    };
    handlePassword = (e) => {
        console.log(e.nativeEvent.text, ' password');

        if (this.state.accPassword === true) {
            if (this.state.confirmPassword !== this.state.password) {
                this.setState({
                    alertTextPssword: 'password tidak sama!',
                    accPassword: false,
                });
            } else {
                this.setState({
                    alertTextPssword: '',
                    accPassword: true,
                });
            }
        }
        const str = e.nativeEvent.text;
        if (str.length < 6) {
            this.setState({
                alertTextPssword1: 'password terlalu pendek',
                accPassword1: false,
            });
        } else {
            this.setState({
                alertTextPssword1: '',
                accPassword1: true,
            });
        }
        console.log(e.nativeEvent.text, ' password', this.state.accPassword);
        this.setState({ password: e.nativeEvent.text });
    };

    handleSubmit = () => {
        if (this.state.password.length >= 6) {
            this.setState({ loading: true });
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Cookie", "ci_session=v7fluv5q2mcvpte0hu330c9nhna0q75v");

            var raw = JSON.stringify({ "email": this.state.email, "new_password": this.state.password, "confirm_new_password": this.state.confirmPassword });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/core/seller/auth/change_password/forgot", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: index.js ~ line 497 ~ index ~ result", result)

                    if (result.status.code === 200) {
                        setTimeout(() => this.setState({ loading: false }), 500);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                "Sandi anda berhasil diubah!", [
                                {
                                    text: "Login",
                                    onPress: () => {

                                        this.props.navigation.goBack()
                                    },
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 600);
                    } else if (result.status.code === 400) {
                        setTimeout(() => this.setState({ loading: false }), 100);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                `${String(error)}`, [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Pressed"),
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 150);
                    } else {
                        setTimeout(() => this.setState({ loading: false }), 100);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                result.status.message + " : " + result.status.code, [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Pressed"),
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 150);
                    }
                })
                .catch(error => {
                    setTimeout(() => this.setState({ loading: false }), 100);
                    setTimeout(() => {
                        Alert.alert(
                            "Jaja.id",
                            `${String(error)}`, [
                            {
                                text: "Ok",
                                onPress: () => console.log("Pressed"),
                                style: "cancel"
                            }
                        ],
                            { cancelable: false }
                        );
                    }, 150);
                });
        }
    };
}

const styles1 = StyleSheet.create({
    iconHeader: {
        width: 50
    },
    backIncon: {
        width: '40%',
        height: 250,
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        paddingTop: Hp('7%'),
        backgroundColor: 'white',
        flexDirection: "column",
        width: Wp('85%'),
        alignSelf: 'center'
    },
    text: {
        color: 'black',
        width: Wp('85%'),
        marginTop: '10%',
        alignSelf: "center",
        fontSize: 14
    },
    textInput: {
        alignSelf: "center",
        width: Wp('85%'),
        marginVertical: Wp('3%'),
    },
    flex: {
        flex: 1,
    },
    flex2: {
        flex: 2,
    },
    button: {
        alignSelf: "center",
    },
    header: {
        backgroundColor: 'blue',
        marginTop: '0',
    },

    // step2
    text2: {
        marginVertical: '3%',
        width: Wp('85%'),
        color: colors.BlackGrayScale,
        alignSelf: 'center',
        fontSize: 14,

        fontStyle: 'italic'
    },
    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: '#03DAC6',
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        color: 'black',
    },
    kodeOtp: {
        width: Wp('85%'),
        height: Hp('20%'),
        alignSelf: 'center',
        color: 'red',
    },
    underlineStyleHighLighted: {
        borderColor: '#03DAC6',
    },
    button2: {
        backgroundColor: colors.BlueJaja,
        width: Wp('85%'),
        marginTop: '5%',
        alignSelf: 'center',

    },
    appBar: {
        backgroundColor: colors.BlueJaja,
        height: Hp('5%'),
        color: 'white',
        paddingHorizontal: Wp('5%')
    },
    appBarIcon: {
        tintColor: colors.White,
        width: 27,
        height: 27
    },
    appBarText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
    },
    backIcon: {
        tintColor: 'white',
        height: 23,
        width: 23,
        marginRight: "-5%"
    },
    // step 3
    inputBox: {
        alignSelf: "center",
        width: Wp('85%'),
    },
    button3: {
        backgroundColor: colors.BlueJaja, width: Wp('85%'), alignSelf: "center",
    },
    text3: {
        // color: 'black',
        // width: Wp('85%'),
        // marginTop: '10%',
        // alignSelf: "center",
        // fontSize: 14
        width: Wp('85%'),
        color: 'black',
        alignSelf: 'center',
        fontSize: 14,

        fontStyle: 'italic',
        backgroundColor: 'pink'
    },
    containerVerfified: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.BlackGrayScale, fontFamily: 'Poppins-Regular', marginVertical: Hp("2%") },
    textCenter: { fontSize: 18, color: colors.BlackGrayScale, fontFamily: 'Poppins-Regular' },

});
