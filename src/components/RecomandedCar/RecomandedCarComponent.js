import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { styles, ShimmerCardProduct, Utils, Wp, CardProductAuto } from '../../export';

import { REACT_APP_BEARER_TOKEN } from '@env'


export default function RecomandedCarComponent(props) {
    const [page, setPage] = useState(1);
    const [storagedashRecommanded, setstoragedashRecommanded] = useState([]);

    const dispatch = useDispatch();
    const reduxLoadmore = useSelector(state => state.dashboard.loadmore);
    const reduxdashRecommandedAuto = useSelector(state => state.dashboard.recommandedauto);

    const getData = () => {
        if (reduxdashRecommandedAuto) {
            var myHeaders = new Headers();
            myHeaders.append("Cookie", "ci_session=82qc4iavke9nrrgpcrq6l1jf8109ep2e");
            myHeaders.append("Authorization", `Bearer ${REACT_APP_BEARER_TOKEN}`);


            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("https://api.jaja.id/jauto/produk/get", requestOptions)
                .then(response => response.json())
                .then(result => {
                    const newData = result.data.map(item => {
                        let types = item.grades.map(grade => ({ value: grade.type, key: grade.typeId }));
                        return {
                            productId: item.productId,
                            model: item.model,
                            images: item.images[0].imagePath,
                            slug: item.slug,
                            type: types,
                            price: item.price,
                            color: item.images[0].colorName,
                        };
                    });

                    dispatch({ type: 'SET_DASHRECOMMANDEDAUTO', payload: newData });
                })
                .catch(error => {
                    Utils.handleError(error.message, 'Error dengan kode status : 13009');
                });
        }
    };

    useEffect(() => {
        if (reduxLoadmore) {
            handleLoadMore();
        }
    }, [reduxLoadmore]);

    const handleLoadMore = () => {
        setTimeout(() => {
            getData();
        }, 500);
        setPage(page + 1);
    };

    return (
        <View style={[styles.column]}>
            {reduxdashRecommandedAuto && reduxdashRecommandedAuto.length || storagedashRecommanded && storagedashRecommanded.length ?
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <CardProductAuto refresh={props.refresh ? true : false} data={Array(reduxdashRecommandedAuto).length ? reduxdashRecommandedAuto.slice(0, 50) : Array(storagedashRecommanded).length ? storagedashRecommanded.slice(0, 50) : []} />
                </View>
                :
                <View style={[styles.column_center_start, { width: Wp('100%') }]}>
                    <ShimmerCardProduct />
                </View>
            }
        </View>
    );
}
