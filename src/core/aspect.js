import {
    removeSkipAffixIds,
    getDataId,
    cleanTitleAndValue,
    getAspectPrefix,
    cleanTypeTextArray,
    cleanTags
} from './index.js';

/*
[
    {
        "id": "1083127",
        "title": "+{0}% Total Armor",
        "valueRange": [
            "[3.1 – 7.3]"
        ],
        "requiredItemType": ["amulet", "chest_armor", "helm", "pants"],
        "tags": ["basic"]
    },
    ...
]
*/
export const ConvertToJSON = (document) => {    
    const dicAspectType = {
        '力量聖典': 'basic',
        '傳奇': 'class',
        'CodexofPower': 'codex',
        'Legendary': 'legendary'
    };

    let data = [];
    [...document.querySelectorAll('.tab-pane')].map(panel => {
        const aspectType = dicAspectType[panel.id];

        const list = [...panel.querySelectorAll('.table tbody tr')].map(elm => {
            const $root = elm.querySelectorAll('td')[1];

            // head
            const headElm = $root.querySelector('[data-hover], [data-hover2]');
            // id
            const id = getDataId(headElm);
            // prefix
            const prefix = getAspectPrefix(headElm.textContent);

            // tags
            const tags = cleanTags(
                $root.querySelector('div.text-white-50').textContent,
                [aspectType]
            );

            // title
            const {
                title,
                value: valueRange
            } = cleanTitleAndValue(
                $root.querySelector('li.c_legendary').textContent,
                id
            );
            
            let requiredItemType = [];
            const elmTypeText = $root.querySelector('div > div');
            if (elmTypeText) {
                const removeSpan = elmTypeText.querySelector('span');
                elmTypeText.removeChild(removeSpan);

                requiredItemType = cleanTypeTextArray(
                    "aspect",
                    elmTypeText.textContent.trim().split(', ') || []
                );
            }
            
            // const typeTextArray = $root.querySelector('div > div')?.textContent.replaceAll(' ', '').split(',') || [];
            // console.log(typeTextArray);
            // const requiredItemType = cleanTypeTextArray(
            //     $root.querySelector('div > div')?.textContent.replaceAll(' ', '').split(',') || []
            // );
            
            return {
                id,
                prefix,
                title,
                valueRange,
                requiredItemType,
                tags
            }
        });

        data = data.concat(list);
    });

    return removeSkipAffixIds(data);
}

/*
{
    "577013": "法力上限 +{0}",
    "577017": "怒氣上限 +{0}",
    "577021": "冷卻時間縮短 {0}%",
    "577033": "魂能消耗降低 {0}%",
    ....
}
*/
export const ConvertToI18n = (document) => {
    const data = [...document.querySelectorAll('.table tbody tr')].reduce((acc, elm) => {
        const $root = elm.querySelectorAll('td')[1];
        
        // id
        const id = getDataId($root);

        // title
        const {
            title
        } = cleanTitleAndValue(
            $root.querySelector('li.c_legendary').textContent,
            id
        );
        
        acc[id] = title;

        return acc;
    }, {});

    return removeSkipAffixIds(data);
}

export const ConvertToI18nPrefix = (document) => {
    const data = [...document.querySelectorAll('.table tbody tr')].reduce((acc, elm) => {
        const $root = elm.querySelectorAll('td')[1];

        // header
        const headElm = $root.querySelector('[data-hover], [data-hover2]');
        // id
        const id = getDataId(headElm);
        // prefix
        const prefix = getAspectPrefix(headElm.textContent);
        // title
        // const {
        //     title
        // } = cleanTitleAndValue(
        //     $root.querySelector('li.c_legendary').textContent,
        //     id
        // );
        
        acc[id] = prefix;

        return acc;
    }, {});

    return removeSkipAffixIds(data);
}



export default {
    ConvertToJSON,
    ConvertToI18n,
    ConvertToI18nPrefix
}