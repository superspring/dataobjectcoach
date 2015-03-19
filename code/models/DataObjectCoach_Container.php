<?php

/**
 * @file
 * Provides a wrapper for a single dataobject created with this module.
 */

class DataObjectCoach_Container extends DataObject {

	/**
	 * Define the table structure.
	 */
	private static $db = array(
		'Name'         => 'Text',
		'Editable'     => 'Boolean',
		'Description'  => 'Text',

		// Raw fields will be copied directly to code.
		'RawClassName' => 'Text',
		'RawParent'    => 'Text',

		// Does this model need a controller? For template reasons.
		'Controller'   => 'Boolean',
	);

	private static $has_many = array(
		'Fields'  => 'DataObjectCoach_Field',
		'Actions' => 'DataObjectCoach_Action',
		'Groups'  => 'DataObjectCoach_Group',
		'Move'    => 'DataObjectCoach_Move',
	);

	private static $singular_name = 'DataObject';

	private static $defaults = array(
		'Controller' => 1,
	);

	/**
	 * Layout the fields for this dataobject.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();
		$yesno = array(
			TRUE => 'Yes',
			FALSE => 'No',
		);

		// Change these fields to be single line text fields.
		foreach (array(
			'Name'         => 'A pretty name for this type of dataobject (used for the singular name).',
			'Description'  => 'A brief description of this dataobject',
			'RawClassName' => 'The class name for the DataObject',
			'RawParent'    => 'The parent of this class (empty for none).',
		) as $field_name => $desc) {

			// Create the new field.
			$field = new TextField($field_name);
			$field->setDescription($desc);

			// Remove the old one.
			$fields->removeByName($field_name);

			// Add it back.
			$fields->addFieldToTab('Root.Main', $field);
		}

		// Is this editable inside the CMS?
		$field = new DropdownField('Editable', 'Editable?', $yesno);
		$field->setDescription('Add the ability to edit this DataObject in the CMS?');
		$fields->removeByName('Editable');
		$fields->addFieldToTab('Root.Main', $field);

		// Does this model have a controller too?
		$field = new DropdownField('Controller', 'Add a controller for this model?', $yesno);
		$field->setDescription('Add the ability to add a layout to the theme?');
		$fields->addFieldToTab('Root.Main', $field);

		// Remove enabled field and fields tab.
		$fields->removeByName('Fields');
		$fields->removeByName('Actions');
		$fields->removeByName('Groups');
		$fields->removeByName('Move');

		// If the dataobject is already in the database, let fields be added.
		if ($this->ID) {

			// What fields are in this dataobject?
			$config = GridFieldConfig_RelationEditor::create()->addComponents(
				new GridFieldSortableRows('Sort')
			)->removeComponentsByType('GridFieldAddExistingAutocompleter');
			$config->getComponentByType('GridFieldPaginator')->setItemsPerPage(50);
			$field = new GridField('Fields', 'Fields for this dataobject', $this->Fields(), $config);
			$fields->addFieldToTab('Root.Fields', $field);

			// What actions are in this dataobject?
			$config = GridFieldConfig_RelationEditor::create()->addComponents(
				new GridFieldSortableRows('Sort')
			)->removeComponentsByType('GridFieldAddExistingAutocompleter');
			$field = new GridField('Actions', 'Additional actions for this dataobject', $this->Actions(), $config);
			$fields->addFieldToTab('Root.Actions', $field);

			// What groups are in this dataobject?
			$config = GridFieldConfig_RelationEditor::create()->addComponents(
				new GridFieldSortableRows('Sort')
			)->removeComponentsByType('GridFieldAddExistingAutocompleter');
			$field = new GridField('Groups', 'Groups of fields for the CMS of this dataobject', $this->Groups(), $config);
			$fields->addFieldToTab('Root.Groups', $field);

			// What fields shall we rearrange?
			$config = GridFieldConfig_RelationEditor::create()->addComponents(
				new GridFieldSortableRows('Sort')
			)->removeComponentsByType('GridFieldAddExistingAutocompleter');
			$field = new GridField('Move', 'Add the fields you want to rearrange', $this->Move(), $config);
			$fields->addFieldToTab('Root.Rearrange', $field);
		}

		// Done.
		return $fields;
	}

	/**
	 * Is this valid to create a dataobject?
	 */
	public function getCMSValidator() {
		return new DataObjectCoach_ContainerValidator();
	}

	/**
	 * Get all of the database fields, including inherited ones.
	 */
	public function getAllFields() {

		// Get a list of classes to get them from.
		$classes = array($class = $this);
		do {
			// Can the parent be loaded?
			$parent = DataObjectCoach_Container::get()->filter('RawClassName', $class->RawParent)->first();
			if ($parent) {
				$classes[] = $class = $parent;
			}
		} while ($parent);

		// Sort from parent to child.
		$classes = array_reverse($classes);

		// Go through all the classes and get their combined fields.
		$results = new ArrayList();
		foreach ($classes as $class) {
			foreach ($class->Fields() as $field) {
				$results->push($field);
			}
		}

		// Done.
		return $results;
	}
}
