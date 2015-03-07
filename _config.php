<?php

/**
 * @file
 * The DataObject Coach allows you to make DataObjects on the fly.
 * See /admin/dataobjectcoach for more details.
 */

// Load the new manifest as soon as Silverstripe boots.
if (class_exists('DataObjectCoach_RequestProcessor')) {
	Config::inst()->update('Injector', 'RequestProcessor', 'DataObjectCoach_RequestProcessor');
}

// Add in the ability to add actions to DataObjects.
Object::add_extension('GridFieldDetailForm_ItemRequest', 'DataObjectCoach_EditForm');

// Add ability to export code to sakemore.
Object::add_extension('More', 'DataObjectCoach_Exporter');
