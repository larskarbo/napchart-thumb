const puppeteer = require("puppeteer");
const sharp = require("sharp");

const isDev = process.env.NODE_ENV == "development";
const WEB_BASE = isDev ? `http://localhost:8000` : `https://napchart.com`;
console.log("WEB_BASE: ", WEB_BASE);

let id = 40

module.exports = async function (req, res) {
  var chartid = req.query.chartid;
  var hr = req.query.hr;

  if (typeof chartid == "undefined") {
    return res.send("Invalid request");
  }

  (async () => {
    const idHere = (id++)%20
    const browser = await puppeteer.launch({ headless: isDev ? false : true });
    const page = await browser.newPage();
    await page.setViewport({
      width: 2500,
      height: 1500,
      deviceScaleFactor: 2,
    });
    await page.goto(`${WEB_BASE}/only-the-chart/${chartid}`);
    await page.waitForSelector("canvas"); // wait for the selector to load
    const element = await page.$("canvas"); // declare a variable with an ElementHandle

    await element.screenshot({ path: __dirname + `/output/${idHere}.png` });

    await browser.close();
    sharp(__dirname + `/output/${idHere}.png`)
      .resize(hr ? 2400 : 600, hr ? 2400 : 600, {
        fit: "cover",
        // position: 'right top',
      })
      .toFile(__dirname + `/output/${idHere}cropped.png`)
      .then((data) => {
        res.sendFile(__dirname + `/output/${idHere}cropped.png`);
      });
  })();
};
