import React, { Component } from 'react';
import { Button, Paragraph, TextInput } from 'react-native-paper'
import { Hp, Wp, colors, Loading } from '../../export'
import { Text, View, SafeAreaView, Image, StyleSheet, BackHandler, StatusBar, ScrollView, ToastAndroid } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            alertTextUsername: '',
            accUsername: false,
            email: '',
            password: '',
            confirmPassword: '',
            alertTextPssword: '',
            alertTextPssword1: '',
            accPassword: false,
            accPassword1: false,
            telephone: '',
            alertTextTelephone: '',
            alertTextEmail: '',
            accEmail: false,
            spinner: false,
            verified: false,
            loading: false
        };
    }
    backAction = () => {
        this.props.navigation.navigate('Login');
        return true;
    };

    componentDidMount() {
        // this.props.navigation.navigate('VertifikasiEmail')
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.backAction,
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleUsername = (e) => {
        console.log(e.nativeEvent.text, ' username');
        this.setState({ username: e.nativeEvent.text });
        const str = e.nativeEvent.text;
        if (str.length < 3) {
            this.setState({
                alertTextUsername: 'terlalu singkat',
                accUsername: false,
            });
        } else {
            this.setState({
                alertTextUsername: '',
                accUsername: true,
            });
        }
    };
    handlePassword = (e) => {
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
        if (str.length < 8) {
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

    handleEmail = (e) => {
        console.log(e.nativeEvent.text, ' email');
        this.setState({ email: e.nativeEvent.text });
        let val = e.nativeEvent.text;
        let re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        let rest = re.test(e.nativeEvent.text);
        console.log("index -> handleEmail -> val.length", val.length)

        if (val.length > 4) {
            if (rest === false) {
                this.setState({ alertTextEmail: 'email tidak valid', accEmail: false });
            } else {
                this.setState({ alertTextEmail: '', accEmail: true });
            }
        } else if (val.length === 0) {
            this.setState({ alertTextEmail: '', accEmail: false });

        }
    }
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

    handleTelephone = (e) => {
        console.log(e.nativeEvent.text, ' telephone');

        this.setState({ telephone: e.nativeEvent.text, alertTextTelephone: "" });
    }

    onRegistrasi = (e) => {
        const credentials = {
            "fullName": this.state.username,
            "email": this.state.email,
            "password": this.state.password,
            "phoneNumber": this.state.telephone
        };
        if (this.state.username === '')
            this.setState({ alertTextUsername: 'username tidak boleh kosong!' });
        if (this.state.password === '')
            this.setState({ alertTextPssword1: 'password tidak boleh kosong!' });
        if (this.state.confirmPassword === '')
            this.setState({
                alertTextPssword: 'konfirmasi password tidak boleh kosong!',
            });
        if (this.state.telephone === '')
            this.setState({ alertTextTelephone: 'nomor telephone tidak boleh kosong!' });
        if (this.state.email === '') {
            this.setState({ alertTextEmail: 'email tidak boleh kosong!' });
        } else {
            if (this.state.accPassword === true && this.state.accPassword1 && this.state.accUsername) {
                this.setState({
                    loading: true,
                });
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Cookie", "ci_session=pcgo0ue0u1ctc99j2h0ocdhpdvbfqikh");

                var raw = JSON.stringify(credentials);

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                let json = ""
                fetch("https://jaja.id/backend/user/register", requestOptions)
                    .then(response => response.json())
                    .then(res => {
                        console.log("🚀 ~ file: RegisterScreen.js ~ line 169 ~ index ~ res", res)
                        json = res;
                        if (res.status.code == 200) {
                            EncryptedStorage.setItem('user', JSON.stringify(res.data.customer))
                            dispatch({ type: 'SET_USER', payload: result.data.customer })
                            EncryptedStorage.setItem('token', JSON.stringify(res.data.token))
                            setTimeout(() => this.setState({ loading: false }), 3000);
                            console.log("index -> onRegistrasi -> 201", res.status)
                            this.props.navigation.navigate('VerifikasiEmail', { email: credentials.email })
                        } else if (res.status.code == 409) {
                            setTimeout(() => this.setState({ loading: false }), 1000);
                            this.setState({ alertTextEmail: 'Email sudah pernah digunakan!' })
                        }
                    })
                    .catch(error => {
                        json = error
                        ToastAndroid.show(String(error), ToastAndroid.LONG, ToastAndroid.CENTER)
                        setTimeout(() => this.setState({ loading: false }), 1000);
                    });
                setTimeout(() => {
                    if (!json) {
                        ToastAndroid.show(String(json), ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
                    this.setState({ loading: false })
                }, 10000);
            } else {
                console.log('gagal');
            }
        }
        console.log("index -> onRegistrasi -> credentials", credentials)
    };
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={colors.YellowJaja} barStyle="light-content" />
                {this.state.loading ? <Loading /> : null}
                <ScrollView style={styles.scrollView} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.viewImage}>
                        <Image
                            source={require('../../assets/images/JajaId.png')}
                            style={styles.logoJaja}
                        />
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            name="username"
                            style={styles.inputBox}
                            type="text"
                            onChange={this.handleUsername}
                            selectionColor={colors.YellowJaja}
                            label="Nama Lengkap"
                            keyboardType="default"
                            mode="outlined"
                            theme={{
                                colors: {
                                    primary: colors.YellowJaja,
                                },
                            }}
                        />
                        <Text style={{ color: 'red' }}>{this.state.alertTextUsername}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            selectionColor={colors.YellowJaja}
                            label="Your@mail.example"
                            type="text"
                            style={styles.inputBox}
                            onChange={this.handleEmail}
                            keyboardType="email-address"
                            mode="outlined"
                            theme={{
                                colors: {
                                    primary: colors.YellowJaja,
                                },
                            }}
                        />
                        <Text style={{ color: 'red' }}>{this.state.alertTextEmail}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            selectionColor={colors.YellowJaja}
                            label="Nomor Telephone"
                            style={styles.inputBox}
                            onChange={this.handleTelephone}
                            keyboardType="numeric"
                            mode="outlined"
                            theme={{
                                colors: {
                                    primary: colors.YellowJaja,
                                },
                            }}
                        />
                        <Text style={{ color: 'red' }}>{this.state.alertTextTelephone}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            style={styles.inputBox}
                            name="password"
                            type="password"
                            onChange={this.handlePassword}
                            mode="outlined"
                            selectionColor={colors.YellowJaja}
                            label="Password"
                            secureTextEntry={true}
                            theme={{
                                colors: {
                                    primary: colors.YellowJaja,
                                },
                            }}
                        />
                        <Text style={{ color: 'red' }}>{this.state.alertTextPssword1}</Text>
                    </View>
                    <View style={styles.viewInput}>
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
                        <Text style={{ color: 'red' }}>{this.state.alertTextPssword}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <Button
                            labelStyle={{ color: 'white' }}
                            onPress={this.onRegistrasi}
                            mode="contained"
                            contentStyle={styles.contentButton}
                            color={colors.YellowJaja}
                            style={styles.button}>
                            Daftar
                        </Button>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            paddingHorizontal: '5%',
                        }}>
                        <View>
                            <Text style={{ color: 'black', padding: 5 }}>
                                Sudah punya akun?
                            </Text>
                        </View>
                        <View>
                            <Text
                                style={{ color: '#6495ED', padding: 5 }}
                                onPress={(e) => this.props.navigation.navigate('Login')}>
                                Login
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff'
    },

    viewImage: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "20%",
        marginTop: '10%'
    },

    logoJaja: {
        flex: 0,
        width: Wp('60%'),
        height: Hp('17%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        alignItems: 'flex-start'

    },

    viewInput: {
        flex: 1,
        justifyContent: 'center',
        width: Wp('90%'),
        alignSelf: 'center',
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
    inputBox: {
        height: Hp('5.7%'),
    },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontWeight: 'bold', color: colors.black, fontFamily: 'serif', marginVertical: Hp('2%') },
    textCenter: { fontSize: 18, fontWeight: '900', color: colors.black, fontFamily: 'serif' },

    button: {
        marginTop: Hp('1%'),
        alignSelf: 'center'
    },
    contentButton: {
        width: Wp('90%'),
        height: Hp('5.3%')
    },
    scrollView: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: Wp('5%'),
        // backgroundColor: 'pink',
    }
});
