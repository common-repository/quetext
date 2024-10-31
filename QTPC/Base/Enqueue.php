<?php
/**
 * @package  Quetext
 */
namespace QTPC\Base;

use \QTPC\Base\BaseController;

class Enqueue extends BaseController
{
    public function register() {
		add_action( 'admin_enqueue_scripts', array( $this, 'qtpc_enqueue' ) );
	}

	function qtpc_enqueue() {
		// enqueue all our scripts
        wp_enqueue_style( 'quetext_style', $this->plugin_url .'assets/css/style.css' );
		wp_enqueue_script( 'quetext_search_script', $this->plugin_url .'assets/js/search.js' ,"",time(),true);
	}
}
