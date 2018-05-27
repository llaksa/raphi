const puppeteer = require('puppeteer');

(async () => {
  //try {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
  await page.goto('http://192.168.1.37:8080');

    const valueContent = await page.evaluate(() => document.querySelector('#lux'));

    console.log(valueContent);

    browser.close();

  //} catch(error) {
  //  console.log(error);
  //}
})();
