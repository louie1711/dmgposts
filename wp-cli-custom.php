<?php

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

/**
 * Custom DMG CLI commands for Read More functionality.
 */
class DMG_ReadMore_CLI_Command {
    /**
     * Search for posts with dmgreadmore meta key within a date range.
     *
     * ## OPTIONS
     *
     * [--date-after=<date>]
     * : Start date in Y-m-d format (e.g., 2024-05-20)
     *
     * [--date-before=<date>]
     * : End date in Y-m-d format (e.g., 2024-05-20)
     *
     * ## EXAMPLES
     *
     *     wp dmg-read-more search
     *     wp dmg-read-more search --date-after=2024-01-01 --date-before=2024-12-31
     *
     * @when after_wp_load
     */
    public function search($args, $assoc_args) {
        // Set default date range (last 30 days)
        $date_after = isset($assoc_args['date-after']) 
            ? $assoc_args['date-after'] 
            : date('Y-m-d', strtotime('-30 days'));
            
        $date_before = isset($assoc_args['date-before']) 
            ? $assoc_args['date-before'] 
            : date('Y-m-d');

        // Validate dates
        if (!$this->validate_date($date_after) || !$this->validate_date($date_before)) {
            WP_CLI::error('Invalid date format. Please use Y-m-d (e.g., 2024-05-20)');
            return;
        }

        // Setup WP_Query arguments
        $query_args = array(
            'post_type' => array('post','page'),
            'posts_per_page' => -1,
            'date_query' => array(
                array(
                    'after' => $date_after,
                    'before' => $date_before,
                    'inclusive' => true,
                ),
            ),
            'meta_query' => array(
                array(
                    'key' => 'dmg_read_more_block_used',
                    'compare' => 'EXISTS',
                ),
            ),
        );

        $query = new WP_Query($query_args);

        if ($query->have_posts()) {
            WP_CLI::log(sprintf('Found %d posts with dmgreadmore meta key:', $query->post_count));
            
            while ($query->have_posts()) {
                $query->the_post();
                WP_CLI::log(sprintf('Post ID: %d - %s', get_the_ID(), get_the_title()));
            }
            
            wp_reset_postdata();
        } else {
            WP_CLI::warning('No posts found matching the criteria.');
        }
    }

    /**
     * Validate date format
     */
    private function validate_date($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}

WP_CLI::add_command('dmg-read-more', 'DMG_ReadMore_CLI_Command');