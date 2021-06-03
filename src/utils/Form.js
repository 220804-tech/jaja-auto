export function regexEmail(e) {
    console.log(e, ' email');
    let val = e.nativeEvent.text;
    let regex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    let rest = regex.test(e.nativeEvent.text);
    console.log("index -> handleEmail -> val.length", val.length)

    if (val.length > 4 && rest === true) {
        return true
    } else if (val.length === 0) {
        return false
    }
}