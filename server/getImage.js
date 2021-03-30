const puppeteer = require("puppeteer");
const sharp = require("sharp");

let page = false;
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const pageHere = await browser.newPage();
  await pageHere.setViewport({
    width: 2500,
    height: 1500,
    deviceScaleFactor: 2,
  });
  await pageHere.goto(`https://napchart.com/app`);
  console.log("Pupp is ready");
  page = pageHere;
})();

const isDev = process.env.NODE_ENV == 'development'
const WEB_BASE = isDev ? `http://localhost:8000` : `https://napchart.com`
console.log('WEB_BASE: ', WEB_BASE);

module.exports = async function (req, res) {
  var chartid = req.query.chartid;
  var hr = req.query.hr;

  if (typeof chartid == "undefined") {
    return res.send("Invalid request");
  }

  if (!page) {
    return res.send(500);
  }

  // const size = hr ? 2400 : 600

  (async () => {
    await page.goto(`${WEB_BASE}/random/${chartid}`);
    await page.waitForSelector("canvas"); // wait for the selector to load
    const element = await page.$("canvas"); // declare a variable with an ElementHandle
    await element.screenshot({ path: __dirname + "chart.png" });

    // await browser.close();
    sharp(__dirname + "chart.png")
      .resize(hr ? 2400 : 600, hr ? 2400 : 600, {
        fit: 'cover',
        // position: 'right top',
      })
      .toFile(__dirname + "chartcropped.png")
      .then((data) => {
        res.sendFile(__dirname + "chartcropped.png");
      });
  })();
};
