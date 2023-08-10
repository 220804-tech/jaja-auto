import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, FlatList, ColorPropType, Touchable, TouchableOpacity } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { colors, FastImage, styles, Wp, Hp, CardProduct, ServiceStore, useNavigation, Utils } from '../../../export'

export default function Etalase(props) {
    const [listetalase, setlistEtalase] = useState([])
    const dispatch = useDispatch();
    const dataAll = useSelector(state => state.store.storeProduct)
    const [count, setcount] = useState(0)
    const reduxStore = useSelector(state => state.store.store)
    const navigation = useNavigation();


    useEffect(() => {
        if (props?.data?.length) {
            setlistEtalase(props.data)
            setcount(count + 1)
        }
        return () => {

        }

    }, [props?.data?.length])


    const handleDetail = (etalase) => {
        try {
            if (etalase?.items?.length) {
                navigation.navigate('EtalaseProducts')
                let obj = {
                    toko: reduxStore.id,
                    page: 1,
                    keyword: '',
                    etalase: etalase.id
                }
                dispatch({ type: 'SET_ETALASE_SEARCH_LOADING', payload: true })

                ServiceStore.getEtalaseProducts(obj).then(res => {
                    dispatch({ type: 'SET_ETALASE_MAX_SEARCH', payload: !res?.canLoadMore })
                    dispatch({ type: 'SET_ETALASE_SEARCH', payload: res.items })
                    dispatch({ type: 'SET_ETALASE_SEARCH_LOADING', payload: false })
                    dispatch({ type: 'SET_ETALASE_ID', payload: etalase.id })

                }).catch(error => [
                    dispatch({ type: 'SET_ETALASE_SEARCH_LOADING', payload: false }),
                    console.log(error.message)
                ])
            } else {
                if (!etalase?.id) {
                    navigation.navigate('EtalaseProducts')
                    dispatch({ type: 'SET_ETALASE_SEARCH', payload: dataAll })
                } else {
                    Utils.alertPopUp('Tidak ada produk!')
                }
                dispatch({ type: 'SET_ETALASE_SEARCH_LOADING', payload: false })

            }
        } catch (error) {
            dispatch({ type: 'SET_ETALASE_SEARCH_LOADING', payload: false })
            console.log(error.message)
            
        }
    }

    const renderRow = ({ item }) => {
        return (
            <View style={styles.column}>
                <TouchableOpacity onPress={() => handleDetail(item)} style={[styles.row_between_center, styles.p_3, { marginBottom: '0.25%', backgroundColor: colors.White }]}>
                    <View style={[styles.row_start_center, { width: '70%' }]}>
                        <FastImage
                            style={[styles.mr_3, { width: Wp("11%"), height: Wp("11%") }]}
                            source={item.items?.[0]?.image ? require('../../../assets/images/JajaId.png') : require('../../../assets/icons/box.png')}
                            resizeMode={FastImage.resizeMode.contain}
                            tintColor={item.items?.[0]?.image ? colors.BlueJaja : colors.Silver}
                        />
                        <Text style={[styles.font_12]}>{item.name}</Text>
                    </View>
                    <View style={styles.row_center}>
                        <Text style={[styles.font_9, styles.T_light]}>{item?.totalProducts} Produk</Text>
                        <IconButton
                            icon="arrow-right"
                            style={{ padding: 0, margin: 0, backgroundColor: colors.White }}
                            color={colors.Silver}
                            size={19}
                        // onPress={() => setDatePickerVisibility(true)}
                        />
                    </View>

                </TouchableOpacity>
                {/* {item?.items?.length ?
                    <CardProduct data={item.items} />
                    : null
                } */}
            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={listetalase}
                renderItem={renderRow}
            />
        </SafeAreaView>
    )
}