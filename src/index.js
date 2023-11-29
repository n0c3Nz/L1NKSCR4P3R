// Start server without Visual Studio: pm2 start index.js -i 4 | Stop: pm2 stop all | Monitoring in PowerShell: pm2 monit
const fastify = require('fastify')();
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});
console.log(path.join(__dirname, 'public'));

const opts = {
  points: 12, // 6 pointsGET
  duration: 4, // Per second
};
const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(opts);

const axios = require('axios');
const puppeteer = require('puppeteer');

let blacklistarda = ["127.0.0.1"];

async function normalRoutes(fastify) {

  fastify.get('/L1nKScr4p3r', async (req, reply) => {
	let web = req.query.web;
	let palabra = req.query.palabraclave;
	//console.log(req.query.web);
	let valores = [];
	let filteredValues = [];
	if (web != undefined) {
		valores = await scrapeUrls("https://" + web);
		filteredValues = valores.filter(url => url.includes(palabra) && url.trim() !== "");
	  }
/*	if (!blacklistarda.includes(ip)) {
      console.log("This IP is whitelisted: " + ip);
      return { code: 55, msg: "Access denied. You are in the blacklist.", ip: ip };
    }
    let puntos = await rateLimiter.consume(ip, 4).catch((rej) => {
      return { result: false, msg: "Wait " + (parseFloat(rej.msBeforeNext / 1000).toFixed(4)) + " seconds before trying again" };
    });
    if (puntos.result == false) {
      console.log(puntos);
      return { "Clave": puntos.msg };
    }
*/

	const htmlx = `
	<!DOCTYPE html>
	<html>
	<head>
	  <title>L1nKScr4p3r</title>
	  <link rel="icon" href="/public/favicon.ico" type="image/x-icon">
	  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
	  <link rel="stylesheet" href="/public/style.css">
	  <link rel="preconnect" href="https://fonts.googleapis.com">
	  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	  <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet">
	</head>
	<body>
	  <div class="container">
		<form method="get">
		  <div class="form-group">
		  <label for="search-input">Buscador web</label>
			<input type="text" autocomplete = "off" value="${web !== undefined ? web : ''}" class="form-control" name="web" placeholder="Enter searchs">
			<small class="form-text text-muted">Busca por web.</small>
		  </div>
		  <div class="form-group">
			<label for="search-input">Buscador de palabras</label>
			<input type="text" autocomplete = "off" value="${palabra !== undefined ? palabra : ''}" class="form-control" name="palabraclave" placeholder="Enter searchs">
			<small class="form-text text-muted">Busca por palabra clave.</small>
		  </div>
		  <button type="submit" class="btn btn-primary">Submit</button><span class="palabra_clave">Palabra clave: ${palabra !== undefined ? palabra : ''}</span></br></br> 
		  <h2>Resultados de busqueda</h2>
		  
		</form>
		<ul>${filteredValues.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}</ul>
		</div>
	</body>
	</html>
  `;
  
  
  
    reply
      .header('Content-Type', 'text/html')
      .send(htmlx);
  });
}
let browser;
let page;
cargaweb();
async function cargaweb(){
	browser = await puppeteer.launch({ headless: 'new' });
	page = await browser.newPage();
}

async function scrapeUrls(url) {
	
  await page.goto(url);

  const urls = new Set();

  async function crawl(pageUrl) {
    await page.goto(pageUrl);

    const pageUrls = await page.$$eval('a', links => {
      return links.map(link => link.href);
    });

    pageUrls.forEach(pageUrl => {
      urls.add(pageUrl);
    });

    for (const pageUrl of pageUrls) {
      if (!urls.has(pageUrl)) {
        await crawl(pageUrl);
      }
    }
  }

  await crawl(url);
//  await browser.close();
  return Array.from(urls);
}

function getRealIP(req) {
  var ip = req.headers['x-real-ip'] || req.headers['x-client-ip'] || req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || null;
  return ip;
}

async function startServer() {
  await fastify.ready();
  fastify.listen({ host: "localhost", port: 45000 }, async (err, address) => {
    if (err) {
      console.error(err);
      return false;
    }
    console.log(`Server ${fastify.server.address().port} and worker ${process.pid}`);
    process.on('SIGINT', function () {
      process.exit(0);
    })
  });
}

async function start() {
  fastify.register(normalRoutes);
  await startServer();
}

start();
