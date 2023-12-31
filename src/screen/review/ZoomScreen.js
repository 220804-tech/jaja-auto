import React, { useEffect, useState } from 'react'
import { View, Image, StatusBar, Dimensions } from 'react-native'
import { colors, Hp, Wp, Appbar } from '../../export'
import { useSelector } from "react-redux";
const screen = Dimensions.get('screen');
import VideoPlayer from 'react-native-video-player';
import Swiper from 'react-native-swiper'
import { SafeAreaView } from 'react-native';

export default function ZoomScreen(props) {
    const reduxReview = useSelector(state => state.product.productDetail.review)

    const [reviewPressed, setreviewPressed] = useState(null)
    const [review, setReview] = useState([])


    useEffect(() => {
        if (props.route.params) {
            console.log("🚀 ~ file: ZoomScreen.js ~ line 20 ~ useEffect ~ props.route.params.data", props.route.params.data)
            getItem()
        }
    }, [props])

    const getItem = () => {
        let arr = []
        reduxReview[props.route.params.data].image.map((item, index) => {
            return arr.push({
                type: 'image',
                url: item
            })
        })
        if (reduxReview[props.route.params.data].video) {
            arr.push({
                type: 'video',
                url: reduxReview[props.route.params.data].video
            })
        }
        setReview(arr)
    }
    return (
        <SafeAreaView style={[{ flex: 1, backgroundColor: colors.Black }]}>
            <StatusBar
                translucent={false}
                backgroundColor={colors.Black}
                barStyle='default'
                showHideTransition="fade"
            />
            {/* <View style={{ position: 'absolute', top: 100 }}> */}
            <Appbar back={true} Bg="transparent" bgTop={colors.Black} />
            {/* </View> */}
            {/* <View style={{ backgroundColor: colors.Black, justifyContent: 'center', alignItems: 'center', width: Wp('100%'), height: Hp('100%') }}> */}
            <Swiper showsButtons={false} showsPagination={review?.length > 1 ? true : false} >
                {review.map((item, index) => {
                    console.log("🚀 ~ file: ZoomScreen.js ~ line 73 ~ {reduxReview[props.route.params.data].image.map ~ item", item)
                    return (
                        <View key={String(index) + "x"} style={{ flex: 1, flexDirection: 'column' }}>
                            {
                                item.type == "image" ?
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', width: Wp('100%') }}>
                                        <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                    </View>
                                    :
                                    <View style={{ flex: 1, height: Hp('100%'), width: Wp('100%'), alignItems: "center" }}>
                                        <VideoPlayer
                                            video={{ uri: item.url }}
                                            style={{ marginTop: Wp('-2%'), width: Wp('95%'), height: Hp('95%') }}
                                            videoWidth={screen.width}
                                            videoHeight={screen.height}

                                        />
                                    </View>
                            }
                        </View>
                    )
                })
                }
            </Swiper>
        </SafeAreaView >
    )
}
