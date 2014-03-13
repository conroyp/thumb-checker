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
* The traversal of the dom on the child pages is wildly inefficient

Installation
-----------
* Clone the repo locally
* In chrome, go to Tools -> Extensions
* Ensure that the Developer mode checkbox in the top right-hand corner is checked
* Select "Load unpacked extension..." and navigate to the directory of the cloned repo
