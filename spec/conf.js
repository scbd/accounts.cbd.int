exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://selenium:4444/wd/hub',
    baseUrl: 'http://node:8000',
    specs: ['*[sS]pec.js']
}
