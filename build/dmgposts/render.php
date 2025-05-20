<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

 /**
  * lm - todo grab the post id from attributes and render out a 
  * nice link for the post
  */
?>
<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php esc_html_e( 'Dmgposts – hello from a dynamic block!', 'dmgposts' ); ?>
</p>
