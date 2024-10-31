<?php
/**
 * @package  Quetext
 */

namespace QTPC\Pages;

use QTPC\Base\BaseController;
use QTPC\Api\SettingsApi;
use QTPC\Api\Callbacks\AdminCallbacks;

class Admin extends BaseController
{
	public $settings;

	public $callbacks;

	public $pages = array();

	public function register()
	{
		$this->callbacks = new AdminCallbacks();
		$this->settings = new SettingsApi();
		$this->setPages();
		add_action( 'admin_menu', array( $this, 'quetext_add_meta_box' ));
		$this->settings->addPages( $this->pages )->register();
	}

	public function setPages(){

		$this->pages = array(
			array(
				'page_title' => 'quetext',
				'menu_title' => 'Quetext',
				'capability' => 'manage_options',
				'menu_slug' => 'quetext',
				'callback' => array($this->callbacks,'qtpc_admin_settings'),
				'icon_url' => $this->plugin_url.'assets/images/app-icon.svg',
				'position' => 6
			)
		);

	}

	public function admin_index() {
		require_once $this->plugin_path . 'templates/settings.php';
	}

	function quetext_add_meta_box()
	{
		$post_types = get_post_types();
		foreach($post_types as $type){
			//add_meta_box( 'quetext-meta-box', '<b>Quetext</b>  Check for Plagiarism',array ($this, 'quetext_checker_design'), $type, 'normal', 'high' );
			add_meta_box( 'quetext-meta-box2', '<b>Quetext</b>',array ($this, 'quetext_checker_design2'), $type, 'normal', 'high' );
		}
	}

	function quetext_checker_design(){
		require_once $this->plugin_path . 'templates/report_box.php';
	}

	function quetext_checker_design2(){
		require_once $this->plugin_path . 'templates/features_box.php';
	}


}
