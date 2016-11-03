exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['lbc.js'],
    defaultTimeoutInterval : 3000000,
    allScriptsTimeout: 3000000,
    jasmineNodeOpts: {defaultTimeoutInterval: 3000000}
};