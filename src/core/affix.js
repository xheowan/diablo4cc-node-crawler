import { getDataId, cleanTitleAndValue, cleanTypeTextArray, getPowerIncrease } from './index.js';

/*
[
    {
        "id": "1083127",
        "title": "+{0}% Total Armor",
        "valueRange": [
            "[3.1 – 7.3]"
        ],
        "requiredItemType": ["amulet", "chestarmor", "helm", "pants"],
        "tags": ["basic"]
    },
    ...
]
*/
export const ConvertToJSON = (document) => {
    const dicAffixType = {
        'Basic屬性': 'basic',
        'Class屬性': 'class',
        'BasicAffix': 'basic',
        'ClassAffix': 'class'
    };

    let data = [];
    [...document.querySelectorAll('.tab-pane')].map(panel => {
        const affixType = dicAffixType[panel.id];

        const list = [...panel.querySelectorAll('.row .col')].map(elm => {
            // id
            const id = getDataId(elm);
            
            // title
            const {
                title,
                value: valueRange
            } = cleanTitleAndValue(
                elm.querySelector('.card-header').textContent,
                id
            );
            
            // const powerKeyValues = [...elm.querySelectorAll('.table tbody tr')].map(tr => ({
            //     key: tr.childNodes[0].textContent,
            //     value: childNodes[1].textContent
            // }));
            // const powerIncrease = getPowerIncrease(powerKeyValues);
    
            // item type
            const requiredItemType = cleanTypeTextArray(
                [...elm.querySelector('.card-body').querySelectorAll('a')]
                    .map(a => a.getAttribute('href'))
            );


            return {
                id,
                title,
                valueRange,
                // powerIncrease,
                requiredItemType,
                tags: [affixType]
            }
        });

        data = data.concat(list);
    });

    return data;
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
    const data = [...document.querySelectorAll('.row .col')].reduce((acc, elm) => {
        const id = getDataId(elm);

        // title
        const {
            title
        } = cleanTitleAndValue(
            elm.querySelector('.card-header').textContent,
            id,
        );
    
        acc[id] = title;
    
        return acc;
    }, {});

    return data;
}

export default {
    ConvertToJSON,
    ConvertToI18n
}