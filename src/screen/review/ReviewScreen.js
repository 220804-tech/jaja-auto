import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { styles, colors, useNavigation, Hp, Wp, Appbar } from '../../export'
import { useSelector } from "react-redux";
import StarRating from 'react-native-star-rating';
import VideoPlayer from 'react-native-video-player';

export default function ReviewScreen(props) {
    const navigation = useNavigation()

    const reduxReview = useSelector(state => state.search.productDetail.review)

    useEffect(() => {
        getItem();
        if (props.route.params) {
            console.log("🚀 ~ file: ReviewScreen.js ~ line 14 ~ useEffect ~ props.route.params", props.route.params.data)

        }
    }, [props.route.params])

    const getItem = () => {

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://jaja.id/backend/product/review/reuni?page=1&limit=10", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    console.log("🚀 ~ file: ReviewScreen.js ~ line 25 ~ getItem ~ result.status", result.status)
                    console.log("🚀 ~ file: ReviewScreen.js ~ line 25 ~ getItem ~ result.status", result.data)


                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <View style={[styles.column, { paddingBottom: Hp('7%') }]}>
                <Appbar title="Penilaian Produk" back={true} />
                <ScrollView>
                    {reduxReview && reduxReview.length ?
                        reduxReview.map((item, index) => {
                            return (
                                <View key={String(index)} style={[styles.column, styles.mb_3, styles.p_4, { backgroundColor: colors.White, }]}>
                                    <View style={styles.row}>
                                        <Image style={[styles.icon_23, styles.mr_2, { borderRadius: 100 }]} source={{ uri: 'https://jaja.id/asset/uplod/ulasan/dd3d4d73-9507-4a59-84ac-ef1b33a52908.jpg' }} />
                                        <View style={[styles.column_between_center, { alignItems: 'flex-start', marginTop: '-1%' }]}>
                                            <Text style={[styles.font_12]}>{item.customerName}</Text>
                                            <StarRating
                                                disabled={false}
                                                maxStars={5}
                                                rating={parseInt(item.rate)}
                                                starSize={14}
                                                fullStarColor={colors.YellowJaja}
                                                emptyStarColor={colors.YellowJaja}
                                            />
                                        </View>
                                    </View>
                                    {item.comment ?
                                        <Text style={[styles.font_12, styles.mt, styles.mb_2]}>
                                            {item.comment}
                                        </Text> : null
                                    }
                                    <View style={[styles.row, { flexWrap: 'wrap' }]}>
                                        {item.image.concat(item.image).map((itm, idx) => {
                                            return (
                                                <TouchableOpacity onPress={() => navigation.navigate('ZoomReview', { data: index })} style={{ width: Wp('17%'), height: Wp('17%'), justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BlackGrayScale, marginRight: '1%' }}>
                                                    <Image key={String(idx) + "i"} source={{ uri: itm }} style={{ width: '100%', height: '100%' }} />
                                                </TouchableOpacity>
                                            )
                                        })}
                                        {item.video ?
                                            <TouchableOpacity onPress={() => navigation.navigate('ZoomReview', { data: index })} style={[styles.mt_5, { width: Wp('92%'), height: Wp('50%') }]}>
                                                <VideoPlayer
                                                    video={{ uri: item.video }}
                                                    videoWidth={Wp('100%')}
                                                    videoHeight={Wp('50%')}
                                                    disableFullscreen={false}
                                                    fullScreenOnLongPress={true}
                                                />
                                            </TouchableOpacity>
                                            : null
                                        }
                                    </View>
                                </View>
                            )
                        })
                        : null}
                </ScrollView>
            </View>
        </SafeAreaView >
    )
}
