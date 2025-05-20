<?php
/**
 * Plugin Name:       Dmgposts
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmgposts
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function create_block_dmgposts_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}


add_action( 'init', 'create_block_dmgposts_block_init' );

require_once 'wp-cli-custom.php';
/*
add_action('init', 'register_dmg_post_meta');

function register_dmg_post_meta() {
    register_post_meta('post', 'dmg_read_more_block', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}*/


// Add after your existing init actions

// Register the meta field
add_action('init', 'register_dmg_read_more_meta');
function register_dmg_read_more_meta() {
    register_post_meta('post', 'dmg_read_more_block_used', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}

// Hook into post save
add_action('save_post', 'check_for_read_more_block', 10, 3);
function check_for_read_more_block($post_id, $post, $update) {
    // If this is an autosave, don't do anything
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check if content contains savedReadPostId
    if (strpos($post->post_content, 'savedReadPostId') !== false) {
        update_post_meta($post_id, 'dmg_read_more_block_used', true);
    } else {
        delete_post_meta($post_id, 'dmg_read_more_block_used');
    }
}


