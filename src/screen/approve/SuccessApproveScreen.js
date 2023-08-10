import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuccessApproveScreen = () => {
    const [countdown, setCountdown] = useState(5);
    const navigation = useNavigation();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        } else {
            navigation.navigate('Car'); // Ganti 'Car' dengan nama layar tujuan yang diinginkan
        }
    }, [countdown, navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 25, width: '100%', height: 330, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/ilustrations/Success.png')} style={{ alignSelf: 'center', width: 270, height: 145.82 }} />
                </View>
                <Text style={{ color: 'black', fontSize: 16, textAlign: 'center', fontFamily: 'Poppins-SemiBold' }}>Pengajuan Berhasil</Text>
                <Text style={{ color: '#A0A0A0', fontSize: 12, textAlign: 'center', fontFamily: 'Poppins-Medium' }}>
                    Terima kasih pengajuan berhasil dan {"\n"}
                    admin akan menghubungi anda dalam 1 x 24 jam
                </Text>
                <View style={{ width: 35, height: 35, borderRadius: 100, borderWidth: 5, borderColor: '#3C78FC', marginTop: 10 }}>
                    <Text style={{ textAlign: 'center', color: '#3C78FC', fontFamily: 'Poppins-Bold', fontSize: 16, alignSelf: 'center' }}>{countdown}</Text>
                </View>
            </View>
        </View>
    );
}

export default SuccessApproveScreen;
