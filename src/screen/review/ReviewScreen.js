import React, { useEffect, useState } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { styles, colors, useNavigation, Hp, Wp, Appbar, Utils } from '../../export'
import { useSelector, useDispatch } from "react-redux";
import StarRating from 'react-native-star-rating';
import VideoPlayer from 'react-native-video-player';

export default function ReviewScreen(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const reduxReview = useSelector(state => state.product.productDetail.review)
    // const reduxProduct = useSelector(state => state.product.productDetail)

    useEffect(() => {
        getItem();
        if (props.route.params) {
            // console.log("🚀 ~ file: ReviewScreen.js ~ line 14 ~ useEffect ~ props.route.params", props.route.params.data)

        }
    }, [props.route.params])

    const getItem = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`https://jaja.id/backend/product/review/${props.route.params.data}?page=1&limit=100`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status.code === 200 || result.status.code === 204) {
                    dispatch({ type: 'SET_REVIEW_PRODUCT', payload: result.data.items })
                }
            })
            .catch(error => Utils.handleError(error, 'Error with status codde : 12041'));
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: Platform.OS === 'ios' ? colors.BlueJaja : null }]}>
            <StatusBar
                translucent={false}
                animated={true}
                backgroundColor={colors.BlueJaja}
                barStyle='default'
                showHideTransition="fade"
            />
            <View style={[styles.column, { flex: 1, paddingBottom: Hp('7%'), backgroundColor: Platform.OS === 'ios' ? colors.WhiteGrey : null }]}>
                <Appbar title="Penilaian Produk" back={true} />
                <ScrollView>
                    {reduxReview && reduxReview.length ?
                        reduxReview.map((item, index) => {
                            return (
                                <View key={String(index)} style={[styles.column, styles.mb_3, styles.p_4, { backgroundColor: colors.White, }]}>
                                    <View style={styles.row_start_center}>
                                        <View style={[styles.row_center, { borderWidth: 0.2, borderRadius: 100, borderColor: colors.BlackGrey, marginRight: '2%', width: 24, height: 24 }]}>
                                            {item.customerImage ?
                                                <Image style={[styles.icon_24, styles.mr_2, { borderRadius: 100 }]} source={{ uri: item.customerImage }} />
                                                :
                                                <Text style={[styles.font_12, styles.T_semi_bold, { marginBottom: '-2%' }]}>{String(item.customerName).slice(0, 1)}</Text>
                                            }
                                        </View>
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
                                        {item.image.map((itm, idx) => {
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
