<?php

/**
 * @package  Quetext
 */

namespace QTPC\Base;

class BaseController
{
	public $plugin_path;
	public $plugin_url;
	public $plugin;

	public function __construct()
	{
		$this->plugin_path = plugin_dir_path(dirname(__FILE__, 2));
		$this->plugin_url = plugin_dir_url(dirname(__FILE__, 2));
		$this->plugin = plugin_basename(dirname(__FILE__, 3)) . '/quetext.php';
		$this->api_url = "https://www.quetext.com/api/";
		$this->base_url = "https://www.quetext.com/";
		$this->wordpress_api_url = "https://quetext.free.beeceptor.com/";
	}
}
