<?php

/**
 * @package  Quetext
 */

namespace QTPC;

final class QTPC_Init
{
	/**
	 * Store all the classes inside an array
	 * @return array Full list of classes
	 */
	public static function qtpc_get_services()
	{
		return [
			Pages\Admin::class,
			Base\Enqueue::class
		];
	}

	/**
	 * Loop through the classes, initialize them,
	 * and call the register() method if it exists
	 * @return
	 */
	public static function qtpc_register_services()
	{
		foreach (self::qtpc_get_services() as $class) {
			$service = self::qtpc_instantiate($class);
			if (method_exists($service, 'register')) {
				$service->register();
			}
		}
	}

	/**
	 * Initialize the class
	 * @param  class $class    class from the services array
	 * @return class instance  new instance of the class
	 */
	private static function qtpc_instantiate($class)
	{
		$service = new $class();

		return $service;
	}
}
