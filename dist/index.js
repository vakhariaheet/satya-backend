import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer'; // Importing puppeteer
import { writeFile, readFile } from 'fs/promises';
const __dirname = process.cwd();
export const MINIMAL_ARGS = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
];
const app = express();
app.use(express.json());
app.use(cors());
app.get('/', async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: MINIMAL_ARGS,
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    const html = new Date().toUTCString();
    await page.setContent(html);
    writeFile(`${__dirname}/example.pdf`, await page.pdf({
        format: 'A4',
        printBackground: true,
        path: `${__dirname}/example.pdf`,
    }));
    await browser.close();
    const file = `${__dirname}/example.pdf`;
    const data = await readFile(file);
    res.setHeader('Content-type', 'application/pdf');
    res.send(data);
});
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
