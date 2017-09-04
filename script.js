const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const dpi = 300.0, dpcm = dpi/2.54;
  const widthCm = 21.0, heightCm = 29.7; // a4
  const viewPort = {width: Math.round(widthCm * dpcm), height: Math.round(heightCm * dpcm)};

  console.log('argv', argv);
  let filePath = argv['p'] || './' ;
  let fileName = argv['n'] || 'test';
  let outputId = argv['o'] || '147';
  let screenMode = argv['s'] || 'p';
  let url = argv['u'] || 'http://google.com';

  if (screenMode == 'p') {
    screenMode = 'print';
  } else {
    screenMode = 'screen';
  }

  await page.goto(`${url}${outputId}`, {waitUntil: 'load'});
  await page.setViewport(viewPort);

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });
  await page.emulateMedia(screenMode);

  await page.pdf({path: `${filePath}${fileName}.pdf`, format: 'A4', printBackground: true});
  console.log('Dimensions:', dimensions);
  browser.close();
})();
