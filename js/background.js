// Only fire if we're onthe PR page
if(document.URL.match(/\/pulls/g))
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
                if (emoji.length > 0)
                {
                    var emojiString = '';
                    emoji.each(function(i){
                        // Try to get author avatar - all the way back up the tree
                        // @TODO: Handle multiple emojis in one thread better
                        // @TODO: Neater way of climbing back up the tree
                        var avatar = $(emoji[0]).parents().eq(7).find('img.js-avatar').attr('src');
                        emojiString += '<img src="' + avatar +
                            '" height="16" width="16" valign="top" /> <img src="' +
                            emoji[i].src +
                            '" height="16" width="16" valign="top" />&nbsp;';
                    });

                    // Get link from this page to figure out the parent
                    // we need to update
                    var parentLink = $(data).find('.tabnav-tab.selected.js-pull-request-tab').attr('href');
                    // Update the link on the /pulls/ page with a "Pr status" block
                    $('h4:has(> a) > a[href$="' + parentLink + '"]').parent().append('<br /><div class="approval-status"><i>Review status: ' + emojiString + '</i></div>');
                }
            });
    });
}