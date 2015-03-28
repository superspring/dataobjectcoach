<?php

/**
 * @file
 * Adds a field to a given form.
 */

class DataObjectCoach_FormField extends EditableFormField {

	private static $has_one = array(
		'Parent2' => 'DataObjectCoach_Form',
	);
}
