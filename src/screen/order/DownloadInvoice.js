import React from 'react'
import { SafeAreaView } from 'react-native';
import styles from 'react-native-parallax-scrollview/src/styles';
import { WebView } from 'react-native-webview';
import { Appbar } from '../../export';

export default function DownloadInvoice(props) {
    return (
        <SafeAreaView style={styles.container}>
            <Appbar back={true} title='Download Invoice' />
            <WebView
                // ref={(webView) => this.webView = webView}
                // javaScriptEnabled={true}
                // allowsFullscreenVideo={true}
                // scalesPageToFit={true}
                // allowsLinkPreview={true}
                // originWhitelist={['*']}
                source={{ uri: props.route.params.url }} />
        </SafeAreaView>
    )
}
