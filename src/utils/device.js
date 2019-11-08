const platform = navigator.platform;
const isMac = ['Mac68K', 'MacPPC', 'Macintosh', 'MacIntel'].indexOf(platform) > -1;

let device = {
    isMac: isMac
}

export default device;