import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { colors, Hp, Wp, styles as style, Loading, Appbar } from '../../export';
export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step1: true,
            step2: false,
            step3: false,
            code: '',
            timeOut: 0,
            button: false,
            password: '',
            confirmPassword: '',
            alertTextPssword: '',
            alertTextPssword1: '',
            accPassword: false,
            accPassword1: false,
            email: '',

            loading: false,
        };
    }

    // backAction = () => {
    //   this.props.navigation.navigate('Login')
    //   return true;
    // };

    componentDidMount() {
        // this.backHandler = BackHandler.addEventListener(
        //   "hardwareBackPress",
        //   this.backAction
        // );
    }

    componentWillUnmount() {
        // this.backHandler.remove();
    }


    handleKirim = () => {
        if (this.state.email.length >= 3 && this.state.email !== "") {
            this.setState({ loading: true })
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "email": this.state.email });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/forgot_password", requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log("🚀 ~ file: index.js ~ line 62 ~ index ~ result", result.status)
                    if (result.status.code === 200) {
                        this.setState({ loading: false })
                        setTimeout(() => {
                            this.setState({
                                step1: false,
                                step2: true,
                                timeOut: 60,
                                button: false,
                            });
                            this.timerID = setInterval(() => this.setTime(), 1000);
                            console.log(this.state.email, 'ini email lupa password');
                        }, 50);

                    } else if (result.status.code === 404) {
                        setTimeout(() => {
                            this.setState({ loading: false })
                        }, 500);
                        setTimeout(() => {
                            Alert.alert(
                                "Jaja.id",
                                "Email tidak terdaftar!", [
                                {
                                    text: "Ok",
                                    onPress: () => console.log("Pressed"),
                                    style: "cancel"
                                }
                            ],
                                { cancelable: false }
                            );
                        }, 600);
                    } else {
                        this.setState({ loading: false })
                        setTimeout(() => alert("Error with status code : " + result.status.code), 100);
                    }
                })
                .catch(error => {
                    this.setState({ loading: false })
                    setTimeout(() => alert("Code 4 : " + JSON.stringify(error)), 100);
                });
        }
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
        this.setState({ loading: true, code: code })

        console.log("🚀 ~ file: index.js ~ line 142 ~ index ~ code", code)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "email": this.state.email, "code": code });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://jaja.id/core/seller/auth/verification/forgot_password", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("🚀 ~ file: index.js ~ line 158 ~ index ~ result", result)
                if (result.status.code === 200) {
                    setTimeout(() => {
                        this.setState({ loading: false })
                    }, 500);
                    setTimeout(() => {
                        this.setState({
                            step1: false,
                            step2: false,
                            step3: true,
                        });
                    }, 550);
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
                            "Anda belum mengirim email verifikasi!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: true,
                                        step2: false,
                                        step3: false,
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
                            "Kode verifikasi tidak benar!", [
                            {
                                text: "Ok",
                                onPress: () => {
                                    this.setState({
                                        step1: false,
                                        step2: true,
                                        step3: false,
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
                                        step3: false,
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
                        error, [
                        {
                            text: "Ok",
                            onPress: () => {
                                this.setState({
                                    step1: false,
                                    step2: true,
                                    step3: false,
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

    render() {
        // step 1 kirim email
        let view = <View></View>;

        if (this.state.step1 === true) {
            view = (
                <>
                    <Text style={styles.text}>
                        Masukkan email anda, untuk atur ulang password
                    </Text>
                    <TextInput
                        selectionColor={colors.BlueJaja}
                        style={styles.textInput}
                        label="Email"
                        autoFocus
                        onChangeText={(text) => this.onChangeMail(text)}
                        keyboardType="name-phone-pad"
                        mode="outlined"
                        theme={{
                            colors: {
                                primary: colors.BlueJaja,
                            },
                        }}
                    />
                    <Button
                        style={styles.button}
                        mode="contained"
                        color={colors.BlueJaja}
                        labelStyle={{ color: colors.White }}
                        onPress={this.handleKirim}>
                        Kirim
          </Button>
                </>
            );
            // step 2 kirim otp ulang
        } else if (this.state.step2 === true) {
            let button = (
                <Button style={styles.button2} disabled mode="contained">
                    Kirim kode otp ulang ({this.state.timeOut})
                </Button>
            );
            if (this.state.button === true) {
                button = (
                    <Button
                        style={styles.button2}
                        color={colors.White}
                        labelStyle={{ color: colors.BlueJaja }}

                        mode="contained"
                        onPress={this.handleKirim}>
                        Kirim kode otp ulang ({this.state.timeOut})
                    </Button>
                );
            }
            view = (
                <>
                    <Text style={styles.text2}>
                        Buka email anda untuk melihat kode otp yang kami kirim, untuk
                        mereset ulang password anda, bila tidak terkirim anda bisa meminta
                        kode otp ulang
                    </Text>
                    <OTPInputView
                        style={styles.kodeOtp}
                        pinCount={6}
                        autoFocusOnLoad={true}
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) => {
                            this.handleOtp(code);
                        }}
                    />
                    {button}
                </>
            );
        } else if (this.state.step3 === true) {
            view = (
                <>
                    <Text style={styles.text2}>
                        Masukkan password baru anda yang mudah diingat, minimal password 6 digit!
                     </Text>
                    <TextInput
                        style={styles.inputBox} name="password"
                        type="password"
                        onChange={this.handlePassword}
                        mode="outlined"
                        selectionColor={colors.YellowJaja}
                        label="Password"
                        secureTextEntry
                        autoFocus
                        theme={{
                            colors: {
                                primary: colors.YellowJaja,
                            },
                        }}
                    />
                    <Text style={styles.text3, { color: 'red' }}>{this.state.alertTextPssword1}</Text>
                    <TextInput
                        style={styles.inputBox}
                        name="confirmPassword"
                        type="password"
                        onChange={this.confirmPassword}
                        mode="outlined"
                        selectionColor={colors.YellowJaja}
                        label="Konfirmasi Password"
                        secureTextEntry
                        on
                        theme={{
                            colors: {
                                primary: colors.YellowJaja,
                            },
                        }}
                    />
                    <Text style={[styles.text3, { color: 'red', marginBottom: '5%' }]}>{this.state.alertTextPssword}</Text>
                    {/* Tombol login */}
                    <Button
                        style={styles.button3}
                        labelStyle={colors.White}
                        color={colors.YellowJaja}
                        mode="contained"
                        onPress={this.handleSubmit}>
                        Ganti Password
                    </Button>
                </>
            );
        }
        return (
            <SafeAreaView style={style.container}>
                {this.state.loading ?
                    <Loading /> : null
                }
                <Appbar back={true} tite="Lupa Password" />
                {/* <Appbar.Header style={styles.appBar}>
                    <TouchableOpacity style={styles.iconHeader} onPress={() => this.props.navigation.navigate("Login")}>
                        <Image
                            source={require('../../assets/icons/arrow.png')}
                            style={styles.appBarIcon}
                        />
                    </TouchableOpacity>
                </Appbar.Header> */}
                <View style={styles.container}>{view}</View>

            </SafeAreaView>
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

            var raw = JSON.stringify({ "email": this.state.email, 'code': this.state.code, "new_password": this.state.password, "confirm_new_password": this.state.confirmPassword });
            console.log("🚀 ~ file: ForgotPasswordScreen.js ~ line 467 ~ ForgotPasswordScreen ~ raw", raw)

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://jaja.id/backend/user/change_password/forgot", requestOptions)
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
                                result.status.message, [
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
                            error, [
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

const styles = StyleSheet.create({
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
        flexDirection: "column",
        paddingTop: '3%',
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
        color: 'black',
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '500',
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
        backgroundColor: colors.YellowJaja,
        width: Wp('85%'),
        marginTop: '5%',
        alignSelf: 'center',

    },
    appBar: {
        backgroundColor: colors.YellowJaja,
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
        fontWeight: "bold",
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
        backgroundColor: colors.YellowJaja, width: Wp('85%'), alignSelf: "center",
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
        fontWeight: '500',
        fontStyle: 'italic',
        // backgroundColor: 'pink'
    }
});
