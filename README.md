# Mautic Gmail Add-On

This is a proof of concept for a gmail add-on for Mautic.

The [original](https://github.com/mautic/mautic-helper-chrome-extension) was a chrome-extension,
but no longer functions (and never functioned on e.g. Android app).

This is not complete, but it does function. A couple of items to fix:

1. popping up a 'UI' when inserting the tracker. This has no point, just click the submit button.
2. Hardcoded 'from' address
3. Hardcoded 'secret'
4. Hardcoded mautic uri

comments on how to achieve these welcome. For now, change:
```
appsscript.json:    "https://MY_URL_HARDCODED/"
src/main.js:  const mautic_secret = `MYSECRETHARDCODED`;
src/main.js:  const from = encodeURIComponent(`FROMHARDCODED`);
src/main.js:  const base_url = `https://MY_URL_HARDCODED/plugin/Gmail/tracking.gif`;
```

To install this, run below (and then hit the run button in the web page that is opened):

```
npm i
npx @google/clasp login
npx @google/clasp create --type standalone --title "mautic-gmail-add-on"
npx @google/clasp push -f
npx @google/clasp open
```

## phpcrypt.js

The `phpcrypt.js` comes from:
https://stackoverflow.com/questions/16996030/php-function-crypt-in-javascript
http://pastebin.com/V4R5r9pi
