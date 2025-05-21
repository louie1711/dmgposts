# dmgposts
A wordpress plugin for a custom gutenberg block and a custom wp cli command.

## Gutenberg block - The done bits

1. displays fields in InspectorControls to search for a post
2. paginates the results
3. on selecting a post , it alters in the left hand editor window, to show a post link
4. on save - it also saves a post meta (to indicate if this block is used 'dmg_read_more_block_used'). This is used for scalability in the wp cli command

## Gutenberg block - The not done bits (bits I would have liked todo)

1. render.php for front end
2. when saving the post it doesn't display the post link in the gutenberg editor

## WP cli command - all done
It runs the query using a post meta, that will allow the mysql query (WP_Query generates)to be indexed efficiently. Allows quick searches on a large number of rows.


