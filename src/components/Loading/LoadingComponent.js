import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Progress from 'react-native-progress';
import colors from '../../assets/colors';

export default function Loading() {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.loading}>
                    <Progress.CircleSnail duration={550} size={30} color={[colors.BlueJaja, colors.YellowJaja]} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    loading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: "#454545", elevation: 5, opacity: 0.2 },
    center: {
        zIndex: 1,

        elevation: 24,
    },
    background: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        elevation: 7,
    },
    container: {
        zIndex: 99999,
        backgroundColor: 'transparent',
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.10)',

    },
    loading: {
        padding: 8,
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    }
})