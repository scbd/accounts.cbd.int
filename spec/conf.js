exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    framework: 'jasmine2',
    sauceSeleniumAddress: 'localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8000',
    rootElement: 'html',
    specs: ['*[sS]pec.js'],
    maxSessions: 5,
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 40000,
        isVerbose: true,
        includeStackTrace: true,
    },
    multiCapabilities: [
        {   browserName: 'chrome',            platform:     'Windows 10',         version: '52.0'                                  },
        {   browserName: 'chrome',            platform:     'OS X 10.11',         version: '52.0'                                  },
        {   browserName: 'chrome',            platform:     'Windows 10',         version: '51.0'                                  },    // CURRENT - 1
        {   browserName: 'chrome',            platform:     'Windows XP',         version: '49.0'                                  },    // LATEST XP
        {   browserName: 'firefox',           platform:     'Windows 10',         version: '48.0'                                  },
        {   browserName: 'firefox',           platform:     'OS X 10.11',         version: '48.0'                                  },    //
        {   browserName: 'firefox',           platform:     'Windows 10',         version: '47.0'                                  },    // CURRENT - 1
        {   browserName: 'firefox',           platform:     'Windows XP',         version: '45.0'                                  },    // LATEST XP
        {   browserName: 'MicrosoftEdge',     platform:     'Windows 10',         version: '13.10586'                              },
        {   browserName: 'internet explorer', platform:     'Windows 7',          version: '11.0'                                  },
        {   browserName: 'internet explorer', platform:     'Windows 7',          version: '10.0'                                  },    // CURRENT - 1
        {   browserName: 'safari',            platform:     'OS X 10.11',         version: '9.0'                                   },
        {   browserName: 'safari',            platform:     'OS X 10.10',         version: '8.0'                                   },    // CURRENT - 1
        {   browserName: 'Safari',            platformName: 'iOS',        platformVersion: '9.0',   deviceName: 'iPhone Simulator' },
        {   browserName: 'Safari',            platformName: 'iOS',        platformVersion: '8.1',   deviceName: 'iPhone Simulator' },
        {   browserName: 'Safari',            platformName: 'iOS',        platformVersion: '7.0',   deviceName: 'iPhone Simulator' },
        {   browserName: 'Browser',           platformName: 'Android',    platformVersion: '4.4',   deviceName: 'Android Emulator' },
        {   browserName: 'Browser',           platformName: 'Android',    platformVersion: '5.0',   deviceName: 'Android Emulator' },
        {   browserName: 'Browser',           platformName: 'Android',    platformVersion: '5.1',   deviceName: 'Android Emulator' }
    ]
};
