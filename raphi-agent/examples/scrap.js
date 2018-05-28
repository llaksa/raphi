const puppeteer = require('puppeteer');

let scrape = async () => {
  //const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  /*
  await page.goto('http://books.toscrape.com/');
  await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
  await page.waitFor(1000);
  */

  await page.goto('http://localhost:8080/');
  await page.waitFor(10000);

  const result = await page.evaluate(() => {
    let title = document.querySelector('#temp').value;
    let price = document.querySelector('div.the-class').textContent;

    return {
      title,
      price
    }

  });

  browser.close();
  return result;
};

scrape().then((value) => {
  console.log(value); // Success!
});
