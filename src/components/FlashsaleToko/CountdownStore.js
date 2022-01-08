import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import { colors, ServiceCore, styles, Wp } from '../../export';
export default class CountdownComponent extends React.Component {
    constructor(props) {
        super();
        this.state = { time: {}, seconds: 0 };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    componentDidMount() {
        ServiceCore.getDateTime().then(res => {
            console.log("🚀 ~ file: CountdownStore.js ~ line 34 ~ CountdownComponent ~ ServiceCore.getDateTime ~ res", res)
            let hours = new Date().getHours()
            let minutes = new Date().getMinutes()
            if (String(minutes).length == 1) {
                minutes = '0' + minutes;
            }
            if (String(hours).length == 1) {
                hours = '0' + hours;
            }
            if (res && hours + "" + minutes == String(res.timeNow.replace(/:/g, "").slice(0, 4))) {
                if (String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") < "180000" && String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") <= "240000") {
                    this.timeToSeconds(res.timeNow, "first")
                } else if (String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") >= "180000" && String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") <= "240000") {
                    this.timeToSeconds(res.timeNow, "second")
                } else {
                    this.timeToSeconds(res.timeNow, "wait")
                }
            }
        })
    }

    timeToSeconds = (time, status) => {
        let hours = 0;
        let minutes = (60 - parseInt(time.slice(3, 5))) * 60;
        let secs = 60 - parseInt(time.slice(6, 8))
        if (status === "first") {
            hours = (18 - parseInt(time.slice(0, 2))) * 3600;
        } else if (status === "second") {
            hours = (24 - parseInt(time.slice(0, 2))) * 3600;
        }
        if (minutes < 3600) {
            hours = (hours - 3600) + minutes
        }
        if (secs > 0) {
            console.log("masuk secs")
            hours = (hours - 60) + secs
        }

        let timeLeftVar = this.secondsToTime(hours);
        this.setState({ time: timeLeftVar, seconds: hours });
        this.startTimer()
    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
            <View style={[styles.row_center, styles.m, { backgroundColor: this.props.home ? colors.RedFlashsale : colors.White }]}>
                <View style={[styles.row_center, styles.mx_3, { borderRadius: 5, width: Wp(`${this.props.wrap}+"%`), height: Wp(`${this.props.wrap}+"%`), backgroundColor: this.props.home ? colors.White : colors.RedFlashsale }]}>
                    <Text style={[{ fontSize: this.props.size, color: this.props.home ? colors.RedFlashsale : colors.White }]}>{String(this.state.time.h).length === 1 ? "0" + this.state.time.h : this.state.time.h}</Text>
                </View>
                <Text style={[styles.font_20, { color: this.props.home ? colors.White : colors.RedFlashsale, fontFamily: 'Poppins-SemiBold' }]}>:</Text>
                <View style={[styles.row_center, styles.mx_3, { borderRadius: 5, width: Wp(`${this.props.wrap}+"%`), height: Wp(`${this.props.wrap}+"%`), backgroundColor: this.props.home ? colors.White : colors.RedFlashsale }]}>
                    <Text style={[{ fontSize: this.props.size, color: this.props.home ? colors.RedFlashsale : colors.White }]}>{String(this.state.time.m).length === 1 ? "0" + this.state.time.m : this.state.time.m}</Text>
                </View>
                <Text style={[styles.font_20, { color: this.props.home ? colors.White : colors.RedFlashsale, fontFamily: 'Poppins-SemiBold' }]}>:</Text>
                <View style={[styles.row_center, styles.mx_3, { borderRadius: 5, width: Wp(`${this.props.wrap}+"%`), height: Wp(`${this.props.wrap}+"%`), backgroundColor: this.props.home ? colors.White : colors.RedFlashsale }]}>
                    <Text style={[{ fontSize: this.props.size, color: this.props.home ? colors.RedFlashsale : colors.White }]}>{String(this.state.time.s).length === 1 ? "0" + this.state.time.s : this.state.time.s}</Text>
                </View>
            </View>
        );
    }
}
