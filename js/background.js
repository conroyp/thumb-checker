// Only fire if we're onthe PR page
if(document.URL.match(/\/pulls(\/?)/g))
{
    processEmoji();
}

// Clicking the "My Pull Requests" links
$('.filter-item').click(function(){
    // Slight delay to allow ajax request to complete
    // @TODO: Piggy-back on ajax request to make this a bit less flaky, or use
    // mutation observers, as ajax call doesn't seem to fire when you
    // click back and forth repeatedly between user links
    setTimeout(processEmoji, 1000);
});


/**
 * Check all PRs on the page and see if emojis have been posted on the PR
 * pages linked.
 *
 * @return null
 */
function processEmoji()
{
    var links = $('h4:has(> a) > a');
    links.each(function(i){
        // Fetch the page
        // Scan it for any emoji
        // Dump the emoji back here
        $.ajax("https://github.com" + $(links[i]).attr('href'))
            .done(function(data){
                // Parse the data for emoji
                var emoji = $(data).find('img.emoji');
                // If we find emoji, update status
                // @TODO: Now that we're looping up from the bottom also, tidy
                // the whole thing up to do one consolidated loop
                if (emoji.length > 0)
                {
                    var emojiString = '';
                    var lastAvatar = '';
                    emoji.each(function(i){
                        // Try to get author avatar - all the way back up the tree
                        // @TODO: Neater way of climbing back up the tree
                        var avatar = $(emoji[i]).parents().eq(6).find('img.js-avatar').attr('src');

                        // Batch avatars so we only show it if it's different from
                        // last shown, so we're not showing the same avatar multiple
                        // times in a row if the same user has entered a stream
                        // of emoji
                        if (lastAvatar != avatar)
                        {
                            emojiString += '<img src="' + avatar +
                            '" height="16" width="16" valign="top" /> ';
                            lastAvatar = avatar;
                        }
                        emojiString += '<img src="' + emoji[i].src +
                            '" height="16" width="16" valign="top" />&nbsp;';
                    });

                    // Possible that there was a further update after the last emoji
                    // Check if the last significant entry didn't have an emoji
                    var comments = $(data).find('.js-discussion > div');
                    var comments = comments.slice(0, comments.length-1);

                    // We're going to walk back up the tree to find the last emoji
                    // and along the way keep track of any comment or commit we've
                    // seen
                    var lastAvatar = '';
                    var postEmoji = '';
                    for (var i = comments.length - 1; i >= 1; i--)
                    {
                        var lastEmoji = $(comments[i]).find('img.emoji');
                        // Emoji found? We're at ground zero. Bail out
                        if (lastEmoji.length > 0)
                        {
                            break;
                        }
                        else
                        {
                            // Was this a commit or comment?
                            var emojiIcon = '';
                            if ($(comments[i]).hasClass('discussion-commits'))
                            {
                                emojiIcon = 'https://github.global.ssl.fastly.net/images/icons/emoji/computer.png';
                            }
                            else
                            {
                                emojiIcon = 'https://github.global.ssl.fastly.net/images/icons/emoji/speech_balloon.png';
                            }

                            // Add in a "speech bubble" emoticon to indicate further
                            // conversation (may have been commit or comment - key
                            // thing being it's a change)
                            postEmoji = '<img src="' + emojiIcon +
                                '" height="16" width="16" valign="top" />&nbsp;' +
                                postEmoji;
                            var avatar = $(comments[i]).find('img.js-avatar').attr('src');
                            if (avatar != lastAvatar)
                            {
                                // Add some spacing pre-avatar to stop summary line
                                // getting too jumbled
                                postEmoji = '&nbsp;&nbsp;<img src="' + avatar +
                                    '" height="16" width="16" valign="top" /> ' +
                                    postEmoji;
                            }
                        }
                    }

                    // If we've any post-emoji interaction, list it
                    if (postEmoji.length)
                    {
                        emojiString += postEmoji;
                    }

                    // Get link from this page to figure out the parent
                    // we need to update
                    var parentLink = $(data).find('.tabnav-tab.selected.js-pull-request-tab').attr('href');

                    // Update the link on the /pulls/ page with a "Pr status" block
                    $('h4:has(> a) > a[href$="' + parentLink + '"]').parent()
                        .append('<br /><div class="approval-status"><i>Review status: ' + emojiString + '</i></div>');
                }
            });
    });
}