# diablo4.cc Crawler

scraping [diablo4.cc](https://diablo4.cc) pages and convert to json files

### Support page
- https://diablo4.cc/us/Affix
- https://diablo4.cc/us/Legendary

### Support i18n language
- en
- zh-TW

### Command

```sh
npm i
npm run fetch
```

### JSON Files structures

files/data/affixes.json
```json
[
    {
        "id": "1083127",
        "title": "+{0}% Total Armor",
        "valueRange": [
            "[3.1 – 7.3]"
        ],
        "requiredItemType": ["amulet", "chestarmor", "helm", "pants"],
        "tags": ["basic"]
    }
]
``` 

files/locales/[en.json|zh-TW.json]
```json
{
    "577013": "+{0} Maximum Mana",
    "577017": "+{0} Maximum Fury",
    "577021": "{0}% Cooldown Reduction",
    "577033": "{0}% Essence Cost Reduction",
    "577034": "{0}% Energy Cost Reduction",
    ...
}
```