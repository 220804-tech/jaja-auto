import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, Dimensions, ToastAndroid, Alert } from 'react-native'
import { Button } from 'react-native-paper'
import { ServiceCore } from '../../export';
export default class CountdownComponent extends React.Component {
    constructor() {
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
            if (res) {
                if (String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") < "180000" && String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") <= "240000") {
                    this.timeToSeconds('17:30:00', "first")
                } else if (String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") >= "180000" && String(res.timeNow).replace(/:/g, "") >= "090000" && String(res.timeNow).replace(/:/g, "") <= "240000") {
                    this.timeToSeconds(res.timeNow, "second")
                }
            }
        })
    }

    timeToSeconds = (time, status) => {
        console.log("===================================")

        console.log("file: CountdownComponent.js ~ line 44 ~ CountdownComponent ~ time", time)
        let hours = 0;
        let minutes = (60 - parseInt(time.slice(3, 5))) * 60;
        let secs = 60 - parseInt(time.slice(6, 8))
        if (status === "first") {
            hours = (18 - parseInt(time.slice(0, 2))) * 3600;
        } else if (status === "second") {
            hours = (24 - parseInt(time.slice(0, 2))) * 3600;
        }
        console.log("file: CountdownComponent.js ~ line 55 ~ CountdownComponent ~ hours", hours)
        console.log("file: CountdownComponent.js ~ line 56 ~ CountdownComponent ~ minutes", minutes)
        console.log("file: CountdownComponent.js ~ line 57 ~ CountdownComponent ~ secs", secs)
        let timeLeftVar = this.secondsToTime(hours - minutes - secs);
        this.setState({ time: timeLeftVar, seconds: hours - minutes - secs });
        this.startTimer()
        console.log("file: CountdownComponent.js ~ line 62 ~ CountdownComponent ~ hours- minutes- secs", hours - minutes - secs)
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
            <View>
                <Text>h: {this.state.time.h} m: {this.state.time.m} s: {this.state.time.s}</Text>
            </View>
        );
    }
}
