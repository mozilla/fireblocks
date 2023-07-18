# Fireblocks

Does this ever happen to you?
> "I hate seeing particular words and phrases during my time on the world wide web. Oh how I wish there was some sort of addition to my favourite browser, Firefox, that would allow me to block these words and phrases from my view. And oh how I wish the aforementioned addition would have features that allow me to customize the logic in which a word or phrase gets replaced, and perhaps even special replacement phrases built in! And if only my favourite browser, Firefox, the one which would host said addition, was owned by a non-profit organization that would make such a product and never sell my data to advertisers or other nefarious entities!"

If so, you might be interested in Fireblocks! Fireblocks is a Firefox extension that allows you to block words and phrases from your view on the world wide web. It also allows you to customize the logic in which a word or phrase gets replaced, and even has special replacement phrases built in! And it's made by a non-profit organization that will never sell your data to advertisers or other nefarious entities!

## Setup

### Installation

Install Node. In the root directory, run `npm install`.

### Running

Run `npm start` in the root directory of this repository. This will run the extension in a new Firefox window. This allows for hot reloading of the extension when you make changes to the code.

### Building

Run `npm run build` in the root directory of this repository. This will create a zip file in the `web-ext-artifacts/` directory.

## Debugging
There are two aspects to debug.

1. The content scripts (when things are being replaced). All logging statements show up in the webpages console.
2. The options page and browserAction scripts. Navigate to `about:debugging` and click "Inspect" on the extension. The log statements from these scripts show up in the console of the devtools window that opens.

## Tests

There are no tests as of yet. Content scripts are locked down pretty tight, so it's harder than usual to test them functionally. It may be worth looking into having tests as content scripts, activated by a different manifest.json file (so that they are not deployed).

## Notes

1. To save space, the necessary files from the npm packages are copied over in the `dist` script. The non-minified versions exist in `node_modules`.