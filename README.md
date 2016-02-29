# FurkThat!
##*This page isnt complete right now and neither is the addon. Come back later.*

This is an userscript made for [furk.net] (https://www.furk.net/) users so they can add files to their furk accounts from other sites such as kat.cr etc. In case you dont know what furk is:
> Furk.net is your personal secure storage that fetches media files and lets you stream them immediately. You can use it to stream video or listen to your music from PC, smartphone, HTPC or even a game console (XBOX, PS3).

*From [furk.net] (https://www.furk.net/)*

You can use the script to:
- Add files to your furk.net account
- Get a link to the file on furk
- A direct download link for the file
- Directly play the file (If available)
- View screenshots of a file (If it is video)

Here is how it looks like:

![Example Image] (http://i.imgur.com/SfBlFkG.png)

![Added Image] (http://i.imgur.com/IXAxUkL.png) After a file is added

Currently supported sites (More will be added):
- [kat.cr] (https://kat.cr/)
- [torrentz.eu] (https://torrentz.eu/)

# Installation:
Currently the only way to install is to use a userscript manager, in the future I'll make it an addon that you can download for your browser.

__1.__ Install [Greasemonkey] (https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox __OR__ [Tampermonkey] (https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) for Chrome. __*You can use any userscript manager you want on any browser, however the script has only been tested on these browsers/managers.*__

__2.__ Install the script through [Greasy Fork] (https://greasyfork.org/en/scripts/17496-furkthat). Simply click install and then install again in your userscript manager.

# Support:
- If you've found a bug, make an [issue] (https://github.com/DjangoDuck/FurkThat/issues) and I'll try to fix it.
- If you want support for another site added, either ask for it or do it yourself using this template:
```javascript
else if (location.hostname == "Your site, i.e github.com") {
	var infoHash = Way to find the infohash, i.e $('#thnxLink').data('hash');
}
```
