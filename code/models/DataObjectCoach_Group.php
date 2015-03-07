<?php

/**
 * @file
 * Provides the ability to organise items inside the CMS.
 */

class DataObjectCoach_Group extends DataObject {

	/**
	 * Details for this group.
	 */
	private static $db = array(
		'MachineName' => 'Varchar(128)',
		'PrettyName'  => 'Varchar(256)',
		'Type'        => 'Enum("Tab, ToggleComposite, FieldGroup")',
		'Sort'        => 'Int',
	);

	private static $has_one = array(
		'Parent' => 'DataObjectCoach_Container',
	);

	private static $singular_name = 'Group';

	private static $summary_fields = array(
		'PrettyName' => 'Name',
		'Type'       => 'Type',
	);

	private static $default_sort = array(
		'Sort',
	);

	/**
	 * Add CMS fields.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();

		// Remove the extra fields.
		$fields->removeByName('ParentID');
		$fields->removeByName('Sort');

		// Add descriptions to the other fields.
		foreach (array(
			'MachineName' => 'The unique machine name for the compositefield',
			'PrettyName'  => 'The nice name to show as the tab or field title',
			'Type'        => 'What type of group is this?',
		) as $name => $description) {
			$fields->fieldByName('Root.Main.' . $name)->setDescription($description);
		}

		// Done.
		return $fields;
	}
}
