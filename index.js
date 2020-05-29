/*
  setup: npm i puppeteer args-parser
  file: index.js
  usage: node index.js resume|pause --phpsessid="..."
*/
const puppeteer = require('puppeteer');
const args = require("args-parser")(process.argv)

var phpsessid = args.phpsessid || '';

(async () => {
    if (args.resume || args.pause)
    {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setCookie({
           'name': 'PHPSESSID',
           'value': phpsessid,
           'domain': 'simplemining.net',
           'path': '/',
           'secure': true,
           'httpOnly': true
        })
        
        await page.goto('https://simplemining.net/account/rigs');
        
        let logged = await page.click('.icon-show-rig').then(() => delay(1000)).then(() => true).catch(e => { console.error('can\'t click on info icon', e); return false; })
        
        if (logged)
        {
          await page.click('.modal-rig-actions .btn-group:nth-of-type(2) button').then(() => delay(200)).catch(e => console.error('can\'t click on Actions button', e))
          
          if (args.resume)
              await page.click('.modal-rig-actions .buttonActionRigsResume').then(() => console.log('rig resumed')).catch(e => console.error('can\'t click on resume button', e))
          if (args.pause)
              await page.click('.modal-rig-actions .buttonActionRigsPause').then(() => console.log('rig paused')).catch(e => console.error('can\'t click on pause button', e))
          await delay(2000)
        
        }
        await browser.close().then(() => console.log('done'));  
    
    }
    else
    {
        console.error('missing arguments, run node index.js resume|pause --phpsessid="..."');
    }
  
})();

function delay(time) {
   return new Promise(function(resolve) { 
       setTimeout(resolve, time)
   });
}