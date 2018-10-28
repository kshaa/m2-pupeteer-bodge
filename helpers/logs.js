// Console log stuff with a local date
const datePrefix = () => {
    return (new Date().toLocaleTimeString()) + ": "
};

const error = (text) => {
    console.log("\x1b[31m%s\x1b[0m", datePrefix() + text)
}

const success = (text) => {
    console.log("\x1b[32m%s\x1b[0m", datePrefix() + text)
}

const info = (text) => {
    console.log("\x1b[0m%s\x1b[0m", datePrefix() + text)
}

const debug = (text) => {
    console.log("\x1b[2m%s\x1b[0m", datePrefix() + text)
}

module.exports = {
    error,
    success,
    info,
    debug
}