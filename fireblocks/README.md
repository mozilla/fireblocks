# Fireblocks

Does this ever happen to you?
> "I hate seeing particular words and phrases during my time on the world wide web. Oh how I wish there was some sort of addition to my favourite browser, Firefox, that would allow me to block these words and phrases from my view. And oh how I wish the aforementioned addition would have features that allow me to customize the logic in which a word or phrase gets replaced, and perhaps even special replacement phrases built in! And if only my favourite browser, Firefox, the one which would host said addition, was owned by a non-profit organization that would make such a product and never sell my data to advertisers or other nefarious entities!"

If so, you might be interested in Fireblocks! Fireblocks is a Firefox extension that allows you to block words and phrases from your view on the world wide web. It also allows you to customize the logic in which a word or phrase gets replaced, and even has special replacement phrases built in! And it's made by a non-profit organization that will never sell your data to advertisers or other nefarious entities!

## Pre-Alpha Notes

1. Currently, the browserAction scripts are in progress with the new UI. Both the browserAction and options page use the options scripts.
2. pageAction is empty for now. It may be used for an easily accessible whitelist, disabling, or other features.
3. The content scripts are located in `scripts/` where `main.js` is the entry point.