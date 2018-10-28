// Remove the blank canvas that GTM puts up as a "UX" feature
// Otherwise screenshots right on page load will just be blank
// Seems sort of impure and hacky, I should probably wait until the class disappears
const removeGtmBlank = async (page) => {
    page.evaluate(() => {
        document.querySelectorAll('html')[0].classList.remove('async-hide');
    });
}

module.exports.removeGtmBlank = removeGtmBlank;