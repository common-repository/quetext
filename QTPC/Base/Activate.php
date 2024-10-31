<?php

/**
 * @package  Quetext
 */

namespace QTPC\Base;

class Activate
{
	public static function qtpc_activate()
	{
		flush_rewrite_rules();
	}
}
