import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView, View, Text, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { useDispatch, useSelector } from "react-redux";
import { Appbar, colors, styles, Utils, Wp, Hp, useNavigation, useFocusEffect, ServiceCheckout, Loading } from "../../export";

export default function TrolleyMultiDrop() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const reduxAuth = useSelector((state) => state.auth.auth);

  const [data, setdata] = useState('');
  const [items, setitems] = useState([]);
  const [loading, setloading] = useState(false);

  // useAndroidBackHandler(() => { 
  //   navigation.replace('Checkout')
  //   return false;
  // });



  useFocusEffect(
    useCallback(() => {
      setloading(true)
      getItem();
      handleShipping()
    }, []),
  );


  const handleShipping = () => {
    ServiceCheckout.getShipping(reduxAuth, 0).then(res => {
      if (res) {
        dispatch({ type: 'SET_SHIPPING', payload: res })
      }
    })
  }

  const addAddress = (item) => {
    navigation.navigate("Address", {
      data: "multidrop",
      address: item.address,
      cartId: item.cartId
    })
  }

  const getItem = () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", reduxAuth);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch("https://jaja.id/backend/cart/cart_mulitple?page=1&limit=10", requestOptions)
        .then((response) => response.text())
        .then((res) => {
          console.log("🚀 ~ file: TrolleyMultiDrop.js ~ line 64 ~ .then ~ res", res)
          setloading(false)
          try {
            let result = JSON.parse(res);
            if (result.status.code == 200) {
              setdata(result.data)
              setitems(result.data.items);


              if (!result?.data?.isHasAddress) {
                navigation.navigate('Address', { data: "checkout" })
              }
            } else if (result.status.code === 204) {
              navigation.goBack()
            } else if (result?.status?.code === 404 && result?.status?.message === "Data tidak ditemukan") {
              // Utils.alertPopUp("Silahkan tambah alamat terlebih dahulu!");
              // navigation.replace('Trolley')
            }
            else {
              Utils.handleErrorResponse(result, "Error with status code : 41001");
            }
          } catch (error) {
            setloading(false)
            Utils.handleError(error + res, "Error with status code : 410010")
          }
        })
        .catch((error) => {
          setloading(false)
          Utils.handleError(
            JSON.stringify(error),
            "Error with status code : 41002"
          );
        });
    } catch (error) {
      setloading(false)

    }
  };

  const renderProduct = ({ item, index }) => {
    return (
      <View style={[styles.column, styles.mb_2, styles.px_2, styles.py_3, { width: '100%' }]}>
        <View style={[styles.row_center, styles.mb_3]}>
          <Image
            style={{
              width: Wp("24%"),
              height: Wp("24%"),
              marginHorizontal: "3%",
              borderRadius: 5,
              backgroundColor: colors.White,
              borderWidth: 0.2,
              borderColor: colors.Silver,
              alignSelf: "center",
              resizeMode: "contain",
            }}
            resizeMethod={"scale"}
            // resizeMode={item.image ? "cover" : "center"}
            source={{ uri: item.image }}
          />
          <View style={[styles.column_between_center, { width: '70%', height: Wp("24%"), alignItems: 'flex-start' }]}>
            <Text numberOfLines={2} style={[styles.font_12, { flex: 0, width: '90%' }]}>{item.name}</Text>
            <Text numberOfLines={1} style={[styles.font_12, styles.T_medium, { flex: 0, color: colors.BlueJaja, width: '70%' }]}>+{item.qty}</Text>

          </View>
        </View>
        {item.address.map(address => {
          return (
            <Text numberOfLines={2} style={[styles.font_12, styles.mb_3, { width: '95%' }]}><Text style={styles.T_semi_bold}>{address.receiverName}</Text>{" - " + address.address}</Text>
          )
        })}
        <TouchableRipple rippleColor={colors.BlueJaja} onPress={() => addAddress(item)} style={[styles.row_center, styles.p_3, {
          shadowColor: colors.BlueJaja,
          borderRadius: 1,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.00,

          elevation: 1,
        }]}>
          <Text style={[styles.font_12, styles.T_medium, { marginBottom: '-0.5%', color: colors.BlueJaja }]}>Tambah Alamat</Text>
        </TouchableRipple>

      </View >
    )
  }

  const renderItem = ({ item, index }) => {
    console.log("🚀 ~ file: TrolleyMultiDrop.js ~ line 159 ~ renderItem ~ item", item)
    return (
      <View
        style={[
          styles.column_center,
          styles.mb_3,
          { backgroundColor: colors.White, width: Wp('100%'), borderBottomColor: colors.Silver, borderBottomWidth: 0.2 },
        ]}
      >
        {/* <Text style={[styles.font_13, styles.T_medium, styles.p_2, { alignSelf: 'flex-start', borderBottomColor: colors.Silver, borderBottomWidth: 0.2 }]}>{item.store.name}</Text> */}
        <FlatList
          data={item.products}
          style={{ width: '100%' }}
          renderItem={renderProduct}
          keyExtractor={(x, i) => String(i) + "CO"}
        />

      </View>
    );
  };

  const handleBack = () => {
    navigation.goBack()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", reduxAuth);
    myHeaders.append("Cookie", "ci_session=r59c24ad1race70f8lc0h1v5lniiuhei");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`https://jaja.id/backend/checkout?fromCart=1&is_gift=0&isCoin=0&reset_multidrop=1`, requestOptions)
      .then((response) => response.text())
      .then((res) => {
        try {
          let result = JSON.parse(res);
          if (result.status.code === 200) {
            dispatch({ type: "SET_CHECKOUT", payload: result.data });
          } else if (result.status.code == 404 && result.status.message == "alamat belum ditambahkan, silahkan menambahkan alamat terlebih dahulu") {
            Utils.alertPopUp("Silahkan tambah alamat terlebih dahulu!");
            // navigation.navigate("Address", { data: "checkout" });
          } else {
            Utils.handleErrorResponse(result, "Error with status code : 121567");
            return null;
          }
        } catch (error) {
          Utils.alertPopUp(JSON.stringify(res) + " : 121578\n\n" + res);
        }
      })
      .catch((error) =>
        Utils.handleError(error, "Error with status code : 121589")
      );
  }

  return (
    <SafeAreaView style={styles.containerFix}>
      {loading ? <Loading /> : null}
      {/* <Appbar back={true} title="Multi Penerima" /> */}
      <View style={[styles.appBar, { flexDirection: 'row', backgroundColor: colors.BlueJaja, width: '100%', paddingBottom: '3%' }]}>
        <View style={[styles.row_start_center, { flex: 2, width: 100 }]}>
          <TouchableOpacity onPress={handleBack}>
            <Image style={styles.appBarButton} source={require('../../assets/icons/arrow.png')} />
          </TouchableOpacity>
          <Text style={[styles.font_16, styles.T_semi_bold, styles.ml_2, { color: colors.White, marginBottom: '-1%' }]}>Multi Penerima</Text>
        </View>
      </View>
      <View style={[styles.column, { flex: 1, backgroundColor: colors.White }]}>
        <FlatList
          data={data.items}
          renderItem={renderItem}
          keyExtractor={(x, i) => String(i) + "CQ"}
        />
        <View style={[styles.row, { height: Hp('7%') }]}>
          <View style={{ width: '50%', justifyContent: 'center', paddingHorizontal: '2%', paddingLeft: '4%', paddingVertical: '1%' }}>
            <Text style={[styles.font_12, styles.T_medium, { color: colors.BlueJaja, marginBottom: '-2%' }]}>Total Harga :</Text>
            <Text numberOfLines={1} style={[styles.font_17, styles.T_semi_bold, { color: colors.BlueJaja }]}>{data?.totalCartCurrencyFormat}</Text>
          </View>
          <TouchableRipple onPress={() => navigation.navigate('CheckoutMultiDrop')} style={{ backgroundColor: colors.BlueJaja, width: "50%", height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Text numberOfLines={1} style={[styles.font_13, styles.T_semi_bold, { color: colors.White }]}>Checkout</Text>
          </TouchableRipple>
        </View>
      </View>
    </SafeAreaView>
  );
}
