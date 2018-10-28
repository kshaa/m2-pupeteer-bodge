# Magento 2 testing w/ Pupeteer
This is a quick-and-dirty script I wrote to check out what I can do with Puppeteer.

The goal was to simulate:  
- registration
- logging in
- adding a product to the cart
- go through checkout.  

I managed to simulate
- registration
- logging in  

And even that doesn't really count, because the registration was done through M2 API not through FE, because there's a CAPTCHA.

Doesn't matter though, learned a lot.

## Important note
This wasn't written for a vanilla/Luma theme, this was written for a specific E-commerce store.
So it quite likely won't work for you!

## Usage
```
* Install Node & NPM *
npm install
* Fill out .env, using .env.sample as a base *
node index.js
```