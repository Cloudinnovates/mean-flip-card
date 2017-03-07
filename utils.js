function findValue(object, value) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop) && object[prop] === value) {
            return prop;
        }
    }
    return null;
}

exports.findValue = findValue;