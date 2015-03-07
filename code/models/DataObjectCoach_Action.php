<?php

/**
 * @file
 * Provides additional actions to perform on a dataobject.
 */

class DataObjectCoach_Action extends DataObject {

	/**
	 * All of the details for this action.
	 */
	private static $db = array(
		'Name' => 'Varchar(64)',
		'Type' => 'Varchar(256)',
		'Sort' => 'Int',
	);

	/**
	 * Link it back to the container.
	 */
	private static $has_one = array(
		'Container' => 'DataObjectCoach_Container',
	);

	private static $singular_name = 'Action';
	private static $summary_fields = array(
		'Name',
	);

	/**
	 * Get a list of options.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();

		// Remove the existing fields.
		foreach (array(
			'Name', 'Type', 'Sort',
		) as $field) {
			$fields->removeByName($field);
		}

		// Add the fields back, but nicer.
		$name = new TextField('Name', 'Button name');
		$name->setDescription('The prettyname on the action button');
		$fields->addFieldToTab('Root.Main', $name);

		// What action will it take?
		$action = new DropdownField('Type', 'Action', $this->getTypes());
		$action->setDescription('What will happen when the button is clicked?');
		$fields->addFieldToTab('Root.Main', $action);

		// Done.
		return $fields;
	}

	/**
	 * Get a list of the action's available.
	 */
	protected function getTypes() {

		// Prepare variables.
		$classes = ClassInfo::implementorsOf('DataObjectCoach_MyAction');
		$results = array();

		// Go through anything which inherits 'DataObjectCoach_MyAction'
		foreach ($classes as $class) {
			$results[$class] = singleton($class)->getName();
		}

		// Done.
		return $results;
	}
}
