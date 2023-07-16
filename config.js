
const muteConsole = () => {
    console.log = () => { };
    console.table = () => { };
    console.error = () => { };
    console.warn = () => { };
}

module.exports = { muteConsole }
