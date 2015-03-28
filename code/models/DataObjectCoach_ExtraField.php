<?php

/**
 * @file
 * Provides many_many extra fields.
 */

class DataObjectCoach_ExtraField extends DataObject {

	/**
	 * Provides the name and type of the field.
	 */
	private static $db = array(
		'RawName'     => 'Varchar(1024)',
		'Type'        => 'Varchar(1024)',
		'FieldType'   => 'Text',
		'Description' => 'Text',
		'PrettyName'  => 'Text',
		'RawDefault'  => 'Text',
	);

	/**
	 * Link back to the parent.
	 */
	private static $has_one = array(
		'Parent' => 'DataObjectCoach_Field',
	);

	private static $singular_name = 'Extra Field';

	private static $summary_fields = array(
		'RawName'     => 'Name',
		'Description' => 'Description',
	);

	/**
	 * Allow the user to edit these.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();

		// Remove extra fields.
		foreach (array(
			'ParentID', 'RawName', 'PrettyName', 'RawDefault',
		) as $fieldname) {
			$fields->removeByName($fieldname);
		}

		// What is the raw name?
		$field = new TextField('RawName', 'Name');
		$field->setDescription('What is the raw field name?');
		$fields->addFieldToTab('Root.Main', $field);

		// Define the 'Type'.
		$dbtypes = Config::inst()->get('DataObjectCoach_Field', 'db_types');
		$field = new DropdownField('Type', 'Type of field?', array_combine($dbtypes, $dbtypes));
		$field->setDescription('Out of the core Silverstripe types, which sort of field is this? (Save after editing this field)');
		$fields->addFieldToTab('Root.Main', $field);

		// CMS name.
		$field = new TextField('pRettyName', 'Name');
		$field->setDescription('What is the CMS field title?');
		$fields->addFieldToTab('Root.CMS', $field);

		$availablefields = $this->getFormFields();
		$field = new DropdownField('FieldType', 'What type of field to use?', $availablefields);
		$fields->addFieldToTab('Root.CMS', $field);

		$description = new TextField('Description', 'Description');
		$description->setDescription('What goes into this field?');
		$fields->addFieldToTab('Root.CMS', $description);

		// Done.
		return $fields;
	}

	/**
	 * Get a list of available form fields.
	 *
	 * @todo This code is repeated in DataObjectCoach_Field, remove one.
	 */
	protected function getFormFields() {

		// Prepare variables.
		global $manifest;
		$allfields       = $manifest->getDescendantsOf('FormField');
		$datalessfields  = $manifest->getDescendantsOf('DatalessField');
		$compositefields = $manifest->getDescendantsOf('CompositeField');
		$hiddenfields    = $manifest->getDescendantsOf('HiddenField');

		// Exclude a few other fields.
		$exclude = array(
			'DatalessField', 'CompositeField', 'HiddenField',
			'ConfirmedPasswordField', 'AjaxUniqueTextField',
		);

		// Get a list of useable fields.
		$fields = array_diff($allfields, $datalessfields, $compositefields, $hiddenfields, $exclude);

		// Exclude readonly fields.
		$fields = array_filter($fields, function($name) {
			return !preg_match('/(Readonly|Disabled|Action)$/i', $name);
		});

		// Done.
		return array_combine($fields, $fields);
	}
}
