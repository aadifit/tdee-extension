# TDEE & Macro Calculator (browser extension)

A single-popup browser extension that calculates BMR, TDEE and macro targets.
No sign-up, no accounts, no network requests, no data collected — everything
runs client-side using the same formulas as the open-source
[`@aadifit/tdee-calc`](https://www.npmjs.com/package/@aadifit/tdee-calc)
package.

Formulas: Mifflin-St Jeor (default), Katch-McArdle (when body fat % is
provided), Harris-Benedict values available via the same calc functions.

## Install (development)

**Firefox:** `about:debugging` → *This Firefox* → *Load Temporary Add-on* →
select `manifest.json`.

**Chrome/Edge:** `chrome://extensions` → enable *Developer mode* → *Load
unpacked* → select this folder.

## Files

```
manifest.json    Manifest V3, zero permissions, zero host permissions
calc.js          BMR/TDEE/macro formulas (mirrors the npm package)
popup.html/.css/.js   The single-screen UI
icons/           16/48/128px icons
privacy-policy.html   No data is collected, stored, or transmitted
```

## Why

Most TDEE calculators are ad-walled web pages. This is the same
formulas as a real, tested, MIT-licensed npm package, in a one-click popup.
Full tracking — body composition, activity logging, an adaptive plan built
around your numbers — is at
[aadifit.com/tdee-calculator](https://aadifit.com/tdee-calculator/).

## License

MIT © [AadiFit](https://aadifit.com)
