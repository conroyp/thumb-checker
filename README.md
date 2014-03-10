Status Checker
=======

When viewing a list of pull requests on github, update the display on the `/pulls/`
page to show whether a PR has been approved or not. Our PRs are typically approved
by a <img src="https://github.global.ssl.fastly.net/images/icons/emoji/%2B1.png" height="20" width="20" valign="top" />
emoji. This extension will check each linked PR, and if any emoji are found, render
a "Review status" div under the PR title containing the emoji in question and
the avatar of the person who posted it.

Known issues
-----------
* If someone posts multiple emojis, their avatar is repeated before each one
* The traversal of the dom on the child pages is wildly inefficient
* Currently doesn't account for further text feedback after an emoji is posted (updates required, etc)

Installation
-----------
* Clone the repo locally
* In chrome, go to Tools -> Extensions -> Load unpacked extension...
