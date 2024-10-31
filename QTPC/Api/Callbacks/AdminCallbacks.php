<?php

/**
 * @package  Quetext
 */

namespace QTPC\Api\Callbacks;

use \QTPC\Base\BaseController;

class AdminCallbacks extends BaseController
{
	public function qtpc_admin_settings()
	{
		require_once $this->plugin_path . 'templates/settings.php';
	}

}
