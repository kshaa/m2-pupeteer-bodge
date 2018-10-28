const logHelper = require('./logs');

// Create a screenshot of the page, add an incremental prefix
const screensPrefix = './screens/';
let screenCounter = 1;
const makeScreen = async (page, label) => {
    const directory = screensPrefix;
    const fileName = screenCounter + '_' + label + '.png';
    const path = directory + fileName;

    logHelper.debug(`* screenshot: '${path}' *`);

    await page.screenshot({path})
    screenCounter++;
}

module.exports.makeScreen = makeScreen;
