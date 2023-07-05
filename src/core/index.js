export const _di = (name, elm) => {
    console.log('$element: ' + name, {
        nodeName: elm.nodeName || undefined,
        id: elm.id,
        className: elm.className,
        outerHTML: elm.outerHTML
    });
}


export const uniqueStringArray = (array) => Array.from(new Set(array));


export const getDataId = ($context) => {
    let data = $context.getAttribute('data-hover') || $context.getAttribute('data-hover2');
    if (!data) {
        const elm = $context.querySelector('[data-hover], [data-hover2]');
        if (!elm) {
            

            _di('$context', $context);
            _di('elm', elm);

            return null;
        }
        
        data = elm.getAttribute('data-hover') || elm.getAttribute('data-hover2');
    }

    // id
    return data.split('/')[1];
}

const dicReplaceValue = {
    '[PowerTag.Barbarian_Earthquake."Script Formula 1"]': {
        '578764': '4',
        '1210305': '4'
    },
    '[PowerTag.Rogue_Grenades."Script Formula 2"|2|]': {
        '578885': '2',
        '1210341': '0.5',
        '1210321': '0.5'
    }
}

const dicInvalidValueArray = [
    'Affix_',
    '*',
    '%',
    '|'
]

export const cleanTitleAndValue = (text, id = null) => {
    // first clean
    let title = text.replace('  ', ' ');

    if (id) {
        title = Object.keys(dicReplaceValue).reduce((text, key) => {
            if (text.includes(key)) {
                text = text.replace(key, dicReplaceValue[key][id]);
            }

            return text;
        }, title);
    }
    
    // filter value range
    const regex1 = /\[((?:\[[^\]]+\]|[^\[\]])+)\]|Affix_Value_1\*\d+/g;
    let value = title.match(regex1) || [];

    // clean value array
    value = value.reduce((acc, val) => {
        val = val.replace('[[', '[').replace(']]', ']');

        if (!dicInvalidValueArray.some(key => val.includes(key))) {
            acc.push(val);
        }

        return acc;
    }, []);

    // add replace idx
    let idx = 0;
    title = title.replace(regex1, () => `{${idx++}}`);

    return {
        title,
        value
    }
}

export const getAspectPrefix = (text) => {
    if (text.includes(' Aspect'))
        text = '{0} ' + text.replace(' Aspect', '');
    else if (text.includes(' 精華'))
        text = text.replace(' 精華', '') + ' {0}';
    
    return text.trim();
}

// affix
const dicItemType = {
    'chest_armor': 'chestarmor',
    'two-handed_axe': 'axe2h',
    'hand_crossbow': 'crossbow',
    'daggeroffhand': 'dagger',
    'two-handed_mace': 'mace2h',
    'two-handed_scythe': 'scythe2h',
    'two-handed_sword': 'sword2h'
}

export const cleanTypeTextArray = (textArray) => {
    const list = textArray.reduce((acc, text) => {
        const type = text
            .toLocaleLowerCase()
            .replace('[+100%]', '')
            .replace('[+50%]', '');


        if (dicItemType.hasOwnProperty(type)) {
            // for affix
            acc.push(dicItemType[type]);
        } else {
            // for aspect
            if (type == 'offhand') {
                acc = acc.concat(['focus', 'totem']);
            } else if (type == '1h weapon') {
                acc = acc.concat(['axe', 'dagger', 'mace', 'scythe', 'sword', 'wand']);
            } else if (type == '2h weapon') {
                acc = acc.concat(['axe2h', 'bow', 'crossbow', 'mace2h', 'polearm', 'scythe2h', 'staff', 'sword2h']);
            } else if (type == 'chest armor') {
                acc.push('chestarmor');
            }
        }

        return acc;
    }, []);

    return uniqueStringArray(list);
}

const dicTags = {
    'codexofpower': 'codex'
}

export const cleanTags = (text, addTags) => {
    let list = text
        .replaceAll(' ', '')
        .split(',')
        .map(m => {
            const tag = m.toLowerCase();
            if (dicTags[tag])
                return dicTags[tag];
            else
                return tag;
        });
    
    if (Array.isArray(addTags)) {
        list = list.concat(addTags);
    }

    return uniqueStringArray(list);
}


const splitKey = ' – ';
export const getPowerIncrease = (keyValues) => {
    return keyValues.reduce((acc, { key, value }) => {
        if (value.includes(splitKey)) {
            value = value.slice(1, -1).split(splitKey).map(Number);

        } else {
            value = [Number(value)];
        }

        acc[key] = value;

        return acc;
    }, {});
}

export const dataReduceAndSort = (list) => {
    return list
        .reduce((acc, item) => {
            const exists = acc.find(f => f.id == item.id);
            if (!exists) {
                acc.push(item);
            } else {
                if (item.prefix) {
                    exists.prefix = item.prefix;
                }

                if (item.valueRange && Array.isArray(item.valueRange)) {
                    exists.valueRange = uniqueStringArray([...item.valueRange, ...exists.valueRange]);
                }

                if (item.tags && Array.isArray(item.tags)) {
                    exists.tags = uniqueStringArray([...item.tags, ...exists.tags]);
                }
            }

            return acc;
        }, [])
        .sort((a, b) => Number(a.id) - Number(b.id));
}