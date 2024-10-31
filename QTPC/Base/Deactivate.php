<?php

/**
 * @package  Quetext
 */

namespace QTPC\Base;

class Deactivate
{
	public static function qtpc_deactivate()
	{
		flush_rewrite_rules();
	}
}
