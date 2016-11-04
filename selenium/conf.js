exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['lbc.js'],
    defaultTimeoutInterval : 30000000,
    allScriptsTimeout: 30000000,
    jasmineNodeOpts: {defaultTimeoutInterval: 30000000}
};