<?php
/**
 * Plugin Name:       Custom Query Block
 * Description:       A block for displaying user-defined post queries.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Virgiliu Diaconu
 * Text Domain:       custom-query
 *
 * @package           create-block
 */

/**
 * Custom routes.
 */
require_once plugin_dir_path( __FILE__ ) . 'routes.php';

/**
 * Gutenberg block server side render.
 */
require_once plugin_dir_path( __FILE__ ) . 'block.php';
