const puppeteer = require("puppeteer");
const sharp = require("sharp");

let page = false;
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const pageHere = await browser.newPage();
  await pageHere.setViewport({
    width: 1500,
    height: 800,
    deviceScaleFactor: 2,
  });
  await pageHere.goto(`https://napchart.com/app`);
  console.log("Pupp is ready");
  page = pageHere;
})();

module.exports = async function (req, res) {
  var chartid = req.query.chartid;

  if (typeof chartid == "undefined") {
    return res.send("Invalid request");
  }

  if (!page) {
    return res.send(500);
  }

  (async () => {
    await page.goto(`https://napchart.com/${chartid}`);
    await page.waitForSelector("canvas"); // wait for the selector to load
    const element = await page.$("canvas"); // declare a variable with an ElementHandle
    await element.screenshot({ path: __dirname + "chart.png" });

    // await browser.close();
    sharp(__dirname + "chart.png")
      .resize(600, 600, {
        fit: 'cover',
        // position: 'right top',
      })
      .toFile(__dirname + "chartcropped.png")
      .then((data) => {
        res.sendFile(__dirname + "chartcropped.png");
      });
  })();
};
