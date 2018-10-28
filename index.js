const puppeteer = require('puppeteer');

// Helpers which I don't want to keep in this file (duh.)
const logHelper = require('./helpers/logs');
const clickHelper = require('./helpers/clicks');
const screenHelper = require('./helpers/screens');
const gtmHelper = require('./helpers/gtmBlank');
const magentoApiHelper = require('./helpers/magentoApi');

// Configurations
require('dotenv').config();

const baseUrl = process.env.BASE_URL; // URL may have slash at end or may not

const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

const testEmail = process.env.TEST_EMAIL;
const testPass = process.env.TEST_PASS;
const testFirstname = process.env.TEST_FIRSTNAME;
const testLastname = process.env.TEST_LASTNAME;

// Magento 2 "Register, login & purchase" test
var browser;
(async () => {
    // Info
    logHelper.success(`Magento 2 test - "Register, login & purchase" on page '${baseUrl}'.`);

    // Launch a browser & open the page
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Homepage
    logHelper.success(`Opening the homepage in a browser`);
    await page.goto(baseUrl);
    await gtmHelper.removeGtmBlank(page); // Seems impure
    await screenHelper.makeScreen(page, 'homepage');

    // M2 API - Register
    logHelper.success(`Registering an account through M2 API, before logging in`);
    const magentoApi = magentoApiHelper.create({
        adminUser,
        adminPass,
        baseUrl
    });

    logHelper.debug(`>> Removing the old test customer in case it still exists`);
    const customerRemoved = await magentoApi.removeCustomerByEmail(testEmail);
    if (customerRemoved === false) logHelper.debug('>> FYI - The customer didn\'t exist, anyway, continuing.');

    logHelper.debug(`>> Registering a new test customer`);
    await magentoApi.registerCustomer({
        firstname: testFirstname,
        lastname: testLastname,
        email: testEmail
    }, testPass);

    // Login page
    logHelper.success(`Navigating to the log in page`);
    await clickHelper.navigateByText(page, "Log in", '.header');
    await gtmHelper.removeGtmBlank(page);
    await screenHelper.makeScreen(page, 'login-initial');

    logHelper.debug(`>> Typing in email`);
    await page.focus('#email');
    page.type('#email', testEmail);
    await screenHelper.makeScreen(page, 'login-email-filled');

    logHelper.debug(`>> Typing in password`);
    await page.focus('#pass');
    page.type('#pass', testPass);

    await screenHelper.makeScreen(page, 'login-pass-filled');
    logHelper.debug(`>> Clicking log in`);

    // Customer page
    logHelper.success(`Navigating to the customer page`);
    await clickHelper.navigateByText(page, "Log In", '.page-main');
    await gtmHelper.removeGtmBlank(page);
    await screenHelper.makeScreen(page, 'customer-page');

    // Open women category page (or similiarly called header button)
    logHelper.success(`Navigating to the women's category page`);
    await clickHelper.navigateByText(page, "Women", '.page-header');
    await gtmHelper.removeGtmBlank(page);
    await screenHelper.makeScreen(page, 'womens-category');

    // Do the rest of the product selection and checkout flow
    // .... *Todo* :D 

    // That's all folks!
    logHelper.success(`!! The test was successful`);

    // Removing the test customer
    logHelper.success(`Removing test customer`);
    await magentoApi.removeCustomerByEmail(testEmail);

    // Closing the browser
    logHelper.success(`Closing browser`);
    await browser.close();
})().catch(async (error) => {
    // If something goes bonkers - close the browser, so the node process knows it can close too
    await browser.close();
    throw error;
});