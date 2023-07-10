# Fireblocks

Does this ever happen to you?
> "I hate seeing particular words and phrases during my time on the world wide web. Oh how I wish there was some sort of addition to my favourite browser, Firefox, that would allow me to block these words and phrases from my view. And oh how I wish the aforementioned addition would have features that allow me to customize the logic in which a word or phrase gets replaced, and perhaps even special replacement phrases built in! And if only my favourite browser, Firefox, the one which would host said addition, was owned by a non-profit organization that would make such a product and never sell my data to advertisers or other nefarious entities!"

If so, you might be interested in Fireblocks! Fireblocks is a Firefox extension that allows you to block words and phrases from your view on the world wide web. It also allows you to customize the logic in which a word or phrase gets replaced, and even has special replacement phrases built in! And it's made by a non-profit organization that will never sell your data to advertisers or other nefarious entities!

## Setup
To run this extension, you can either:
1. In Firefox, navigate to `about:debugging` and click "Load Temporary Add-on...". Then, select the `manifest.json` file in the `root/fireblocks` directory of this repository.
2. Download the web-ext tool from Mozilla (`npm install --global web-ext`) and run `web-ext run` in the `root/fireblocks` directory of this repository. This allows for hot reloading of the extension.

## Debugging
There are two aspects to debug.

1. The content scripts (when things are being replaced). All logging statements show up in the webpages console.
2. The options page and browserAction scripts. Navigate to `about:debugging` and click "Inspect" on the extension. The log statements from these scripts show up in the console of the devtools window that opens.

## Tests

There are no tests as of yet. Content scripts are locked down pretty tight, so it's harder than usual to test them functionally. It may be worth looking into having tests as content scripts, activated by a different manifest.json file (so that they are not deployed).

## Pre-Alpha Notes

1. Currently, the browserAction scripts are in progress with the new UI. Both the browserAction and options page use the options scripts.
2. pageAction is empty for now. It may be used for an easily accessible whitelist, disabling, or other features.
3. The content scripts are located in `scripts/` where `main.js` is the entry point.
4. The "Obliterate Entire Page" option will break a few pages, especially ones with lots of dynamic content, like google. Other search engines work fine, and pages like wikipedia too.