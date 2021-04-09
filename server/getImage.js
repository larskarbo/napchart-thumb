const puppeteer = require("puppeteer");
const sharp = require("sharp");
const { request } = require("./request");

const isDev = process.env.NODE_ENV == 'development'
const WEB_BASE = isDev ? `http://localhost:8000` : `https://napchart.com`
console.log('WEB_BASE: ', WEB_BASE);

let page = false;
let element = false;
(async () => {
  const browser = await puppeteer.launch({ headless: isDev ? false : true });
  const pageHere = await browser.newPage();
  await pageHere.setViewport({
    width: 2500,
    height: 1500,
    deviceScaleFactor: 2,
  });
  await pageHere.goto(`${WEB_BASE}/only-the-chart/uhJZRNUCN`);
  await pageHere.waitForSelector("canvas"); // wait for the selector to load
  const elementHere = await pageHere.$("canvas"); // declare a variable with an ElementHandle
  element = elementHere
  console.log("Pupp is ready");
  page = pageHere;
})();

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
  const data = await request("GET", "/getChart/" + chartid);

  (async () => {
    await page.evaluate((chartData) => {
      window.napchart.setDataCalcShapeAndDraw(chartData)
    }, data.chartDocument.chartData);
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
