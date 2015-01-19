<?php

/**
 * @file
 * Provides the ability to edit the contents for virtual and real dataobjects.
 */
class DataObjectCoach_Content extends ModelAdmin {
	public static $managed_models = array();
	static $url_segment = 'dataobjectcoach';
	static $menu_title = 'DataObject Coach';

	// There is no point in an upload form for class structures.
	public $showImportForm = false;
}

