exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8000',
    specs: ['*[sS]pec.js']
}
