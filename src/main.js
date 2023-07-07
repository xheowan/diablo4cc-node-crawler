import { fetchPageDom, saveJsonFile } from './util.js';
import pageAffix from './core/affix.js';
import pageAspect from './core/aspect.js';
import { dataReduceAndSort } from './core/index.js';


// create affix file data
console.log('# scraping page affix/aspect');
const domAffix = await fetchPageDom('us/Affix');
const affixJson = pageAffix.ConvertToJSON(domAffix);

const domAspect = await fetchPageDom('us/Legendary');
const aspectJson = pageAspect.ConvertToJSON(domAspect);

const fullAffixJson = dataReduceAndSort([...affixJson, ...aspectJson]);

console.log('# saving to affix.json', fullAffixJson.length);
saveJsonFile(
    fullAffixJson,
    './files/data/affixes.json'
);


// create i18n
console.log('# create affix/aspect i18n json');
// en.json
console.log('# convert to en.json');
const enI18nJson = fullAffixJson.reduce((acc, { id, title }) => {
    if (acc.hasOwnProperty(id)) {
        console.log('affix id exists: ', id);
    }
    
    acc[id] = title;
    return acc;
}, {});

console.log('# saving to affix.en.json', Object.keys(enI18nJson).length);
saveJsonFile(
    enI18nJson,
    './files/locales/affix.en.json'
);

console.log('# scraping page Affix/Aspect tw version');
const domAffixTW = await fetchPageDom('tw/Affix');
const domAspectTW = await fetchPageDom('tw/Legendary');

console.log('# convert to zh-TW.json');
const twI18nAffixJson = pageAffix.ConvertToI18n(domAffixTW);
const twI18nAspectJson = pageAspect.ConvertToI18n(domAspectTW);
const twI18nJson = { ...twI18nAffixJson, ...twI18nAspectJson };

console.log('# saving to affix.zh-TW.json', Object.keys(twI18nJson).length);
saveJsonFile(
    twI18nJson,
    './files/locales/affix.zh-TW.json'
);

const enI18nAspectPrefixJson = pageAspect.ConvertToI18nPrefix(domAspect);
const twI18nAspectPrefixJson = pageAspect.ConvertToI18nPrefix(domAspectTW);

console.log('# saving to affix-prefix.en.json', Object.keys(enI18nAspectPrefixJson).length);
saveJsonFile(
    enI18nAspectPrefixJson,
    './files/locales/affix-prefix.en.json'
);

console.log('# saving to affix-prefix.zh-TW.json', Object.keys(twI18nAspectPrefixJson).length);
saveJsonFile(
    twI18nAspectPrefixJson,
    './files/locales/affix-prefix.zh-TW.json'
);

console.log('# finish page scrape');