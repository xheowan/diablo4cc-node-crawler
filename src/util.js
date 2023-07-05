import fs from 'fs';
import path from 'path';
import got from 'got';
import { JSDOM } from 'jsdom';

const getUrl = (path) => `https://diablo4.cc/${path}`;


const dicLanguage = {
    'tw': 'zh-TW',
    'us': 'en'
}

export const saveJsonFile = (json, filename) => {
    const jsonData = JSON.stringify(json);

    if (filename.includes('./')) {
        const folderPath = path.dirname(filename);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    }

    fs.writeFileSync(filename, jsonData);
}

export const fetchPageDom = async (path) => {
    try
    {
        const response = await got(getUrl(path));
        const dom = new JSDOM(response.body);

        return dom.window.document;
    } catch (error) {
        console.log('An error occurred while fetching the webpage: ', error);
    }
}