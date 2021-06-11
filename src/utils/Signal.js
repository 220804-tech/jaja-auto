import NetInfo from "@react-native-community/netinfo";

export default async function CheckSignal() {
    let signalInfo = {}
    await NetInfo.fetch().then(state => {
        signalInfo.type = state.type
        signalInfo.connect = state.isConnected
    });
    return signalInfo
}