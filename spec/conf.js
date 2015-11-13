exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8000',
    specs: ['*[sS]pec.js'],
    multiCapabilities: [{
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '45.0'
    }, {
        browserName: 'firefox',
        platform: 'Windows 7',
        version: '41.0'
    }, {
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9.0'
    }, {
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8.0';
    }]
}
