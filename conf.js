exports.config = {
    allScriptsTimeout: 150000,
    getPageTimeout: 150000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['app.js'],
    capabilities: {
        browserName: 'chrome',
        maxInstances: 5
    }
};