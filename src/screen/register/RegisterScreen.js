import React, { Component } from 'react';
import { Button, Paragraph, TextInput } from 'react-native-paper'
import { Hp, Wp, colors, Loading, Appbar, styles as style, Utils } from '../../export'
import { Text, View, SafeAreaView, Image, StyleSheet, BackHandler, StatusBar, ScrollView, ToastAndroid, TouchableOpacity } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { connect } from 'react-redux'

class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            alertTextFirstName: '',
            accFirstName: false,
            lastName: '',
            email: '',
            referral: '',
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
        console.log(this.props.route.params);
        if (this.props.route.params && this.props.route.params.navigate) {
            console.log("masuk sini");
            this.props.navigation.goBack()
        } else {
            this.props.navigation.navigate('Login');
        }
        return true;
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.backAction,
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleFirstName = (e) => {
        this.setState({ firstName: e.nativeEvent.text });
        const str = e.nativeEvent.text;
        if (str.length < 3) {
            this.setState({ alertTextFirstName: 'Nama terlalu singkat', accFirstName: false });
        } else {
            this.setState({ alertTextFirstName: '', accFirstName: true });
        }
    };

    handleLastName = (e) => {
        this.setState({ lastName: e.nativeEvent.text });
        const str = e.nativeEvent.text;
        if (str.length < 3) {
            this.setState({ alertTextFirstName: 'Nama terlalu singkat' });
        } else {
            this.setState({ alertTextFirstName: '' });
        }
    };

    handlePassword = (e) => {
        if (this.state.accPassword === true) {
            if (this.state.confirmPassword !== this.state.password) {
                this.setState({ alertTextPssword: 'Password tidak sama!', accPassword: false });
            } else {
                this.setState({ alertTextPssword: '', accPassword: true });
            }
        }
        const str = e.nativeEvent.text;
        if (str.length < 6) {
            this.setState({ alertTextPssword1: 'Password terlalu pendek', accPassword1: false });
        } else {
            this.setState({ alertTextPssword1: '', accPassword1: true });
        }
        this.setState({ password: e.nativeEvent.text });
    };

    handleEmail = (e) => {
        this.setState({ email: e.nativeEvent.text });
        let val = e.nativeEvent.text;
        let re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
        let rest = re.test(e.nativeEvent.text);
        if (val.length > 4) {
            if (rest === false) {
                this.setState({ alertTextEmail: 'Email tidak valid', accEmail: false });
            } else {
                this.setState({ alertTextEmail: '', accEmail: true });
            }
        } else if (val.length === 0) {
            this.setState({ alertTextEmail: '', accEmail: false });
        }
    }
    confirmPassword = (e) => {
        this.setState({ alertTextPssword: 'Password tidak sama!' });
        if (e.nativeEvent.text === this.state.password) {
            this.setState({ alertTextPssword: '', accPassword: true });
        }
        this.setState({ confirmPassword: e.nativeEvent.text });
    };

    handleTelephone = (e) => {
        let number = Utils.regex('number', e.nativeEvent.text)
        this.setState({ telephone: number, alertTextTelephone: "" });
    }

    onRegistrasi = (e) => {
        const credentials = {
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email,
            "password": this.state.password,
            "phoneNumber": this.state.telephone,
            "referralCode": this.state.referral.toLocaleLowerCase()
        };
        if (this.state.firstName === '') {
            this.setState({ alertTextFirstName: 'Nama depan tidak boleh kosong!' });
        } else if (this.state.lastName === '')
            this.setState({ alertTextFirstName: 'Nama belakang tidak boleh kosong!' });
        if (this.state.password === '') this.setState({ alertTextPssword1: 'Password tidak boleh kosong!' });
        if (this.state.confirmPassword === '') this.setState({ alertTextPssword: 'Konfirmasi password tidak boleh kosong!' });
        if (this.state.telephone === '') this.setState({ alertTextTelephone: 'Nomor telephone tidak boleh kosong!' });
        if (this.state.email === '') this.setState({ alertTextEmail: 'Email tidak boleh kosong!' });
        if (this.state.accPassword && this.state.accPassword1 && this.state.accFirstName && this.state.telephone && this.state.email) {
            this.setState({ loading: true });
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
                    setTimeout(() => this.setState({ loading: false }), 2000);
                    if (res.status.code == 200) {
                        EncryptedStorage.setItem('user', JSON.stringify(res.data.customer))
                        this.props.dispatch({ type: 'SET_USER', payload: res.data.customer })
                        EncryptedStorage.setItem('token', JSON.stringify(res.data.token))
                        console.log("index -> onRegistrasi -> 201", res.status)
                        EncryptedStorage.setItem('emailVerification', JSON.stringify(credentials.email))
                        EncryptedStorage.setItem('usrverif', JSON.stringify({ eml: credentials.email, pw: credentials.password }))
                        this.props.navigation.navigate('VerifikasiEmail', { email: credentials.email })
                    } else if (res.status.code == 409) {
                        this.setState({ alertTextEmail: 'Email sudah pernah digunakan!' })
                    } else if (res.status.code === 400 && res.status.message == 'Referal code invalid') {
                        this.setState({ alertTextReferral: 'Kode undangan tidak sesuai!' })
                    } else {
                        Utils.cardAlert(res.status, "11001")
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

    };
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Appbar back={true} title="Kembali" Bg={colors.BlueJaja} />
                <StatusBar translucent={false} backgroundColor={colors.BlueJaja} barStyle="light-content" />
                {this.state.loading ? <Loading /> : null}
                <ScrollView style={styles.scrollView} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={styles.viewImage}>
                        <Image
                            source={require('../../assets/images/JajaId.png')}
                            style={styles.logoJaja}
                        />
                    </View> */}
                    <View style={[style.column, style.pt_5, { width: Wp('92%'), backgroundColor: colors.White }]}>
                        <View style={[style.row_between_center]}>
                            <View style={[styles.viewInput, style.mr_2, { width: Wp('45%') }]}>
                                <TextInput
                                    name="firstName"
                                    style={styles.inputBox}
                                    type="text"
                                    onChange={this.handleFirstName}
                                    outlineColor={colors.WhiteSilver}
                                    placeholderTextColor={colors.WhiteSilver}
                                    selectionColor={colors.BlueJaja}
                                    label="Nama Depan"
                                    keyboardType="default"
                                    mode="outlined"
                                    theme={{ colors: { primary: colors.BlueJaja } }}
                                />
                            </View>
                            <View style={[styles.viewInput, { width: Wp('45%') }]}>
                                <TextInput
                                    name="lastname"
                                    style={styles.inputBox}
                                    type="text"
                                    onChange={this.handleLastName}
                                    outlineColor={colors.WhiteSilver}
                                    placeholderTextColor={colors.WhiteSilver}
                                    selectionColor={colors.BlueJaja}
                                    label="Nama Belakang"
                                    keyboardType="default"
                                    mode="outlined"
                                    theme={{ colors: { primary: colors.BlueJaja } }}
                                />
                            </View>
                        </View>
                        <Text style={[style.font_13, { color: colors.RedNotif, alignSelf: 'flex-start', width: Wp('92%') }]}>{this.state.alertTextFirstName}</Text>
                    </View>

                    <View style={styles.viewInput}>
                        <TextInput
                            selectionColor={colors.BlueJaja}
                            label="Email"
                            type="text"
                            style={styles.inputBox}
                            outlineColor={colors.WhiteSilver}
                            placeholderTextColor={colors.WhiteSilver}
                            onChange={this.handleEmail}
                            keyboardType="email-address"
                            mode="outlined"
                            theme={{ colors: { primary: colors.BlueJaja } }}
                        />
                        <Text style={[style.font_13, { color: colors.RedNotif }]}>{this.state.alertTextEmail}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            selectionColor={colors.BlueJaja}
                            label="Nomor Telephone"
                            style={styles.inputBox}
                            outlineColor={colors.WhiteSilver}
                            placeholderTextColor={colors.WhiteSilver}
                            onChange={this.handleTelephone}
                            value={this.state.telephone}
                            maxLength={14}
                            keyboardType="numeric"
                            mode="outlined"
                            theme={{ colors: { primary: colors.BlueJaja } }}
                        />
                        <Text style={[style.font_13, { color: colors.RedNotif }]}>{this.state.alertTextTelephone}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            selectionColor={colors.BlueJaja}
                            label="Kode Undangan (Optional)"
                            style={styles.inputBox}
                            outlineColor={colors.WhiteSilver}
                            placeholderTextColor={colors.WhiteSilver}
                            onChange={text => this.setState({ referral: text.nativeEvent.text.toLocaleUpperCase() })}
                            keyboardType="default"
                            mode="outlined"
                            theme={{ colors: { primary: colors.BlueJaja } }}
                        />
                        <Text style={[style.font_13, { color: colors.RedNotif }]}>{this.state.alertTextReferral}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            style={styles.inputBox}
                            name="password"
                            type="password"
                            outlineColor={colors.WhiteSilver}
                            placeholderTextColor={colors.WhiteSilver}
                            onChange={this.handlePassword}
                            mode="outlined"
                            selectionColor={colors.BlueJaja}
                            label="Password"
                            secureTextEntry={true}
                            theme={{ colors: { primary: colors.BlueJaja } }}
                        />
                        <Text style={[style.font_13, { color: colors.RedNotif }]}>{this.state.alertTextPssword1}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <TextInput
                            style={styles.inputBox}
                            name="confirmPassword"
                            type="password"
                            outlineColor={colors.WhiteSilver}
                            placeholderTextColor={colors.WhiteSilver}
                            onChange={this.confirmPassword}
                            mode="outlined"
                            selectionColor={colors.BlueJaja}
                            label="Konfirmasi Password"
                            secureTextEntry
                            on
                            theme={{ colors: { primary: colors.BlueJaja } }}
                        />
                        <Text style={[style.font_13, { color: colors.RedNotif }]}>{this.state.alertTextPssword}</Text>
                    </View>
                    <View style={styles.viewInput}>
                        <Button
                            labelStyle={{ color: 'white' }}
                            onPress={this.onRegistrasi}
                            mode="contained"
                            contentStyle={styles.contentButton}
                            color={colors.BlueJaja}
                            style={styles.button}>
                            Daftar
                        </Button>
                    </View>
                    <TouchableOpacity style={[style.row_center, style.mt_4, style.py_2, { width: Wp('60%') }]}>
                        <Text style={[style.font_13]}>Sudah punya akun? </Text>
                        <Text style={[style.font_13, { color: colors.BlueLink }]} onPress={(e) => this.props.navigation.navigate('Login')}> Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView >
        );
    }
}
const mapDispatchToProps = (state) => ({
    dispatch: state,
})
export default connect(null, mapDispatchToProps)(RegisterScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff'
    },

    viewImage: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: "10%",
    },

    logoJaja: {
        flex: 0,
        width: Wp('55%'),
        height: Wp('30%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        alignItems: 'flex-start',
    },

    viewInput: {
        flex: 1,
        justifyContent: 'center',
        width: Wp('92%'),
        alignSelf: 'center',
    },
    spinnerTextStyle: {
        color: '#FFF',
    },
    inputBox: {
        height: Hp('5.7%'),
        backgroundColor: colors.White
    },
    iconMarket: { alignSelf: "center", width: Wp('80%'), height: Hp('40%') },
    textJajakan: { alignSelf: 'center', textAlign: 'center', width: Wp('80%'), fontSize: 18, fontFamily: 'Poppins-SemiBold', color: colors.black, fontFamily: 'Poppins-Regular', marginVertical: Hp('2%') },
    textCenter: { fontSize: 18, color: colors.black, fontFamily: 'Poppins-Regular' },

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
        paddingHorizontal: '2%',
        // backgroundColor: 'pink',
    }
});
