# Bootstrap Tagsinput
A BS3 JS component based on field-group construction, designed for handling input of tags in a simple but very user-friendly way. It supports:
 * Selecting multiple tags by key or label
 * Dynamically adding new tags (depended on your `addnew.bs.tagsinput.data-api` event listener, see a very basic implementation in the Demo, at the bottom of JS code)
 * New tags can be added on-type (by pressing `[enter]` key) or by button
 * On-type filtering (searching) of tags by label
 * On-type selecting (by pressing `[enter]` key when filtering resulted in only one tag)

My usability thoughts were that most tag input solutions are hard to maintain by look, users are cursed to browse dozens of tags to select from a drop-down control, even if filtering is not supported; possible solutions I found are too simple to be used or too complex to not to have several breaking bugs, the only one I found for Bootstrap3 had a bug which breaks removing tags added previously to the list. My solution is easy for the eyes, you can see all the tags below the search field, you can select as many as you want by clicking the checkboxes of desired ones, those will be listed left to the search field and each one can be removed (which will unchecks the tags checkbox too). It's free for you to add a `max-width` and `overflow: auto` CSS values to class `.tagsinput-tags` avoiding problems on too long lists, etc.

While most solutions are hard to be customized, this component is extremely customizable, this was my primary point when designed it. I think that this point fits better to the main concepts behind of Bootstrap.

## Working demo
As this JS component is very light-weight I don't want to add more than a simple demo, you can find the sources and try it in work on Bootply: http://www.bootply.com/dnoeu8peAL

## Contribution and Legal info
Please, feel free to contribute!

Choosed licence for this project is <a href="http://www.wtfpl.net/"><img
       src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png"
       width="80" height="15" alt="WTFPL" /></a>, therefore see it to know the conditions. Thank you!
