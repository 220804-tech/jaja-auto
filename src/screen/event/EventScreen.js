import React, { useState } from 'react'
import { colors, Hp, styles, Wp, FastImage, Appbar } from '../../export'
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native'
import CountDown from 'react-native-countdown-component';

export default function EventScreen() {
  const [indexPosition, setindexPosition] = useState(0)
  const [data, setdata] = useState([{ tab: 'week 1', product: 'JBL Clip 3 Portable Bluetooth Speaker', price: 'Rp719.000', image: 'https://id.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw3620fec7/JBL_Clip3_Front_Midnight-Black-1605x1605px.png?sw=537&sfrm=png', live: true, time: 604800 }, { tab: 'week 2', product: 'Nintendo Switch Console V2', price: 'Rp4.125.000', image: 'https://m.media-amazon.com/images/I/61i421VnFYL._AC_UY436_QL65_.jpg', live: false, time: 1209600 }, { tab: 'week 3', product: 'Roadbike Pacific Tractor 7.0', price: 'Rp4.750.000', image: 'https://pacific-bike.com/wp-content/uploads/2022/05/RB-Tractor-7-0-RD-01-1536x1152.png', live: false, time: 1814400 }])
  const renderItem = (({ item, index }) => {
    if (indexPosition == index) {
      return (
        <View style={[styles.column, styles.px_3, styles.py_5, { width: Wp('100%'), height: '100%' }]}>
          <CountDown
            style={{ padding: 0, margin: 0, alignSelf: 'center' }}
            until={data[indexPosition].time}
            onChange={number => {

              console.log("🚀 ~ file: EventScreen.js ~ line 19 ~ renderItem ~ number", number)
            }}
            size={13}
            onFinish={() => alert('Finished')}
            digitStyle={{ backgroundColor: colors.YellowJaja }}
            digitTxtStyle={{ color: colors.White }}
            timeLabelStyle={[styles.font_6]}
            timeToShow={['D', 'H', 'M', 'S']}
            timeLabels={{ d: 'Hari', h: 'Jam', m: 'Menit', s: 'Detik' }}
          />
          <View style={[styles.column_center_start, styles.mt_5]}>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>Syarat dan Ketentuan untuk mengikuti program ini sebagai berikut :</Text>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>1. Kamu akan otomatis terdaftar pada event ini ketika kamu belanja dengan minimum 299K.</Text>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>2. Event ini berlangsung selama 3 minggu, dan hadiah akan diundi setiap akir pekan (sesuai tanggal yang telah ditentukan)/</Text>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>3. Pemenang akan ditampilkan dihalaman ini setiap akhir pekan.</Text>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>4. Apabila kamu memenagkan hadiah pada pekan pertama, kamu sudah tidak bisa mengikuti dipekan selajutnya (selama event ini berlangsung)</Text>
            <Text style={[styles.font_12, styles.mb_2, { alignSelf: 'flex-start', textAlign: 'left' }]}>5. Apabila kamu tidak berutung pada pekan pertama, kamu akan otomatis terdaftar untuk mengikuti event ini di pekan selanjutnya.</Text>


          </View>
        </View>
      )
    }
  })

  return (
    <SafeAreaView style={styles.container}>
      <Appbar back={true} title="Big Rewards" />

      <View style={[[{ flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]]}>
        <View style={[styles.row_center, styles.px_4, { backgroundColor: colors.White, alignSelf: 'center', width: '100%', height: Hp('20%') }]} >
          <View style={[styles.column_center, styles.py_3, { alignSelf: 'center', width: '55%', height: '100%', }]} >
            <Text style={[styles.font_12, { alignSelf: 'flex-start', textAlign: 'left' }]}>Dapatkan {data[indexPosition].product} seharga {data[indexPosition].price} hanya dengan minimum belanja 299K.</Text>

          </View>
          <View style={[styles.column_center, { width: '45%', height: '100%' }]}>
            {data?.[indexPosition]?.image.includes('https') ?
              <FastImage
                style={{ width: '100%', height: '100%' }}
                source={{ uri: data?.[indexPosition]?.image }}
                resizeMode={FastImage.resizeMode.contain}
              />
              : null}

          </View>
        </View>
        <View style={[styles.row_center, { width: Wp('100%'), borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: colors.Silver }]}>
          <TouchableOpacity onPress={() => setindexPosition(0)} style={[styles.row_center, styles.py_2, { backgroundColor: indexPosition === 0 ? colors.BlueJaja : colors.White, width: Wp('33.3%') }]}>
            <Text style={[styles.font_13, styles.T_semi_bold, { color: indexPosition === 0 ? colors.White : colors.BlackGrayScale }]}>Week 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setindexPosition(1)} style={[styles.row_center, styles.py_2, { backgroundColor: indexPosition === 1 ? colors.BlueJaja : colors.White, width: Wp('33.3%'), borderRightWidth: 0.5, borderLeftWidth: 0.5, borderColor: indexPosition === 1 ? colors.BlueJaja : colors.Silver }]}>
            <Text style={[styles.font_13, styles.T_semi_bold, { color: indexPosition === 1 ? colors.White : colors.BlackGrayScale }]}>Week 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setindexPosition(2)} style={[styles.row_center, styles.py_2, { backgroundColor: indexPosition === 2 ? colors.BlueJaja : colors.White, width: Wp('33.3%') }]}>
            <Text style={[styles.font_13, styles.T_semi_bold, { color: indexPosition === 2 ? colors.White : colors.BlackGrayScale }]}>Week 3</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.column_center, { width: Wp('100%'), height: '100%', }]}>
          <FlatList
            data={data}
            style={{ height: '100%' }}
            contentContainerStyle={{ height: '100%' }}
            renderItem={renderItem}
            keyExtractor={(item) => item.tab}
          />
          <Text>Content</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}