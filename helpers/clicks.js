// Find an element by text in the page, click it and wait
// Warning - If the text matches multiple elements, the first will be clicked

// This seems extremely dumb
// Essentially there are cases of <a href="link"><span>Awesome link</span></a>
// In these cases the click on the 'span' does nothing, but on the 'a' - the click works
const exposeClickHandler = async (page) => {
    return await page.evaluate(() => {
        window.clickNode = function(node) {
            // Let's suppose only anchors and buttons can be clicked
            var tag = node.tagName;
            var parentNode = node.parentNode;

            if (tag == 'A' || tag == 'BUTTON') {
                // Is clickable, click
                node.click();
            } else if (parentNode !== null) {
                // Is not clickable, try to click parent
                clickNode(node.parentNode);                
            } else {
                // Is not clickable, has no parent to try to click, fail!
                return false;
            }
        }
    })
} 

const navigateByText = async (page, text, contextQuery, wait = true) => {
    await exposeClickHandler(page);  
    await page.evaluate((text, contextQuery) => {
        var xpath = "//*[contains(text(),'" + text + "')]";
        var contextNode = contextQuery ? document.querySelector(contextQuery) : document;
        var clickableNode = document.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        
        clickNode(clickableNode);
    }, text, contextQuery);

    // We want to wait until the next page loads
    if (wait) {
        await page.waitForNavigation();
    }
};

module.exports.navigateByText = navigateByText;
