<?php

/**
 * @file
 * Provides a wrapper for a single dataobject created with this module.
 */

class DataObjectCoach_Container extends DataObject {
	private static $db = array(
		'Name'         => 'Text',
		'Editable'     => 'Boolean',
		'Enabled'      => 'Boolean',
		'Description'  => 'Text',

		// Raw fields will be copied directly to code.
		'RawClassName' => 'Text',
		'RawParent'    => 'Text',
	);

	private static $has_many = array(
		'Fields' => 'DataObjectCoach_Field',
	);

	private static $singular_name = 'DataObject';

	/**
	 * Layout the fields for this dataobject.
	 */
	public function getCMSFields() {
		// Prepare variables.
		$fields = parent::getCMSFields();

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
		$field = new DropdownField('Editable', 'Editable?', array(
			TRUE => 'Yes',
			FALSE => 'No',
		));
		$field->setDescription('Will this dataobject be editable inside the CMS?');
		$fields->removeByName('Editable');
		$fields->addFieldToTab('Root.Main', $field);

		// Remove enabled field and fields tab.
		$fields->removeByName('Enabled');
		$fields->removeByName('Fields');

		// If the dataobject is already in the database, let fields be added.
		if ($this->ID) {

			// What fields are in this dataobject?
			$config = GridFieldConfig_RelationEditor::create();
			$field = new GridField('Fields', 'Fields for this dataobject', $this->Fields(), $config);
			$fields->addFieldToTab('Root.Main', $field);
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
	 * Before the object is written, check if it's valid or not.
	 */
	protected function onBeforeWrite() {

		// Let the other code run first.
		parent::onBeforeWrite();

		// Count how many active fields there are.
		$count = 0;
		foreach ($this->Fields() as $field) {
			$count += $field->Enabled ? 1 : 0;
		}

		// If this dataobject has no fields, it cannot be created.
		$this->Enabled = $count > 0;
	}
}
