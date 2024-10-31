<?php

/**
 * @package Quetext
 * @version 1.0.0
 */

/*
 *	Plugin Name: Quetext
 *	Plugin URI: https://quetext.com/
 *	Description: Quetext’s Wordpress Plugin uses DeepSearch™ technology to identify any content throughout your work that might be plagiarized.
 *	Author: Quetext
 *	Version: 1.0.0
 *  License: GPLv2 or later
 *  License URI: http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *  Requires PHP: 7.0
*/

// If this file is called firectly, abort!!!
defined('ABSPATH') or die('Hey, what are you doing here? You silly human!');

// Require once the Composer Autoload
if (file_exists(dirname(__FILE__) . '/vendor/autoload.php')) {
	require_once dirname(__FILE__) . '/vendor/autoload.php';
}

/**
 * The code that runs during plugin activation
 */
function qtpc_activate_plugin()
{
    QTPC\Base\Activate::qtpc_activate();
}
register_activation_hook(__FILE__, 'qtpc_activate_plugin');

/**
 * The code that runs during plugin deactivation
 */
function qtpc_deactivate_plugin()
{
    QTPC\Base\Deactivate::qtpc_deactivate();
}

register_deactivation_hook(__FILE__, 'qtpc_deactivate_plugin');

/**
 * Initialize all the core classes of the plugin
 */
if (class_exists('QTPC\QTPC_Init')) {
    QTPC\QTPC_Init::qtpc_register_services();
}

function qtpc_attempt_user_login() {
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';
    $password = isset($_POST['password']) ? sanitize_text_field($_POST['password']) : '';
    $login_url = "https://www.quetext.com/api/auth/login";

    $params = [
        'email' => $email,
        'password' => $password,
    ];

    $response = wp_remote_post(
        $login_url,
        [
            'body' => json_encode($params),
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'timeout' => 30,
        ]
    );

    if (is_wp_error($response)) {
        // Handle the error
        $result = $response->get_error_message();
    } else {
        $result = wp_remote_retrieve_body($response);
    }

    // API Response is from our own QueText Server!
    // This response is used in search.js to get data from it

    echo wp_json_encode($result);
    wp_die();
}

add_action('wp_ajax_qtpc_attempt_user_login', 'qtpc_attempt_user_login');
