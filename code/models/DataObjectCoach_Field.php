<?php

/**
 * @file
 * A single field attached to a dataobject.
 */

class DataObjectCoach_Field extends DataObject {

	private static $db = array(
		'Relation'       => 'Text',
		'Type'           => 'Text',
		'RawName'        => 'Text',
		'PrettyName'     => 'Text',
		'RawClassName'   => 'Text',
		'RawArgs'        => 'Text',
		'RawDefault'     => 'Text',
		'Enabled'        => 'Boolean',
		'ValidEmpty'     => 'Boolean',
		'ValidUnique'    => 'Boolean',
		'IndexType'      => 'Text',
		'ExtraFieldName' => 'Text',
		'ExtraFieldType' => 'Text',
		'FieldType'      => 'Text',
		'SummaryField'   => 'Text',
		'Description'    => 'Text',
		'Sort'           => 'Int',
	);

	private static $has_one = array(
		'Container' => 'DataObjectCoach_Container',
		'Group'     => 'DataObjectCoach_Group',
	);

	private static $singular_name = 'Field';

	private static $db_types = array(
		'Boolean', 'Currency',
		'Date', 'Decimal',
		'Enum', 'HTMLText',
		'HTMLVarchar', 'Int',
		'Percentage', 'SS_Datetime',
		'Text', 'Time', 'Varchar',
	);

	private static $summary_fields = array(
		'Relation'         => 'Type',
		'RawName'          => 'Name',
		'Description'      => 'Description',
		'Group.PrettyName' => 'Group',
	);

	private static $default_sort = array(
		'Sort',
	);

	/**
	 * Layout for the fields in this dataobject.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();

		// Which group is it in?
		if ($this->Relation) {

			// Clone the existing one, and add in the parents.
			$inheritgroups = new ArrayList($this->Container()->Groups()->toArray());
			$class = $this->Container()->RawParent;
			while ($class) {
				$container = DataObjectCoach_Container::get()->filter('RawClassName', $class)->first();
				if ($container) {
					foreach ($container->Groups() as $group) {
						$inheritgroups->push($group);
					}
					$class = $container->RawParent;
				}
				else {
					break;
				}
			}

			// Get a list of the groups.
			$groups = $this->ContainerID ? $inheritgroups->map('ID', 'PrettyName') : array();

			// Add a key to the beginning.
			$groups[0] = '<none>';
			ksort($groups);

			// Add the field.
			$field = new DropdownField('GroupID', 'Field group', $groups);
			$field->setDescription('Does this field belong in a group?');
			$fields->addFieldToTab('Root.Main', $field);
		}
		else {
			$fields->removeByName('GroupID');
		}

		// Define the 'Name'.
		$field = new TextField('RawName', 'Field Name');
		$field->setDescription('What is the machine name for this field?');
		$fields->addFieldToTab('Root.Field', $field);

		// Define the 'Relation'.
		$field = new DropdownField('Relation', 'What sort of field is this?', array(
			'db'	=> 'db - A single defined value',
			'has_one'   => 'has_one - A 1-to-1 relationship with another dataobject',
			'has_many'  => 'has_many - A 1-to-many relationship with another dataobject',
			'many_many' => 'many_many - A many-to-many relationship with another dataobject',
		));
		$field->setDescription('What sort of relationship (if any) does this field have with others? (Save after editing this field)');
		$fields->removeByName('Relation');
		$fields->addFieldToTab('Root.Field', $field);

		// For the 'has_one', 'has_many', and 'many_many' relations.
		$fields->removeByName('RawClassName');
		if (in_array($this->Relation, array(
			'has_one', 'has_many', 'many_many',
		))) {
			// Define the 'RawClassName' field.
			$classlist = ClassInfo::subclassesFor('DataObject');
			$field = new DropdownField('RawClassName', 'The ClassName it is linking to', $classlist);
			$field->setDescription('Enter the dataobject name that this field links to');
			$fields->addFieldToTab('Root.Main', $field);
		}

		// For the 'db' relation.
		foreach (array(
			'Type', 'RawArgs', 'ValidEmpty', 'ValidUnique', 'RawDefault', 'IndexType', 'Description', 'ContainerID',
			'ExtraFieldName', 'ExtraFieldType', 'SummaryField', 'FieldType', 'Enabled', 'Sort', 'PrettyName',
		) as $fieldname) {
			$fields->removeByName($fieldname);
		}

		// Is the main field empty?
		if ($fields->fieldByName('Root.Main')->Fields()->count() == 0) {
			$fields->removeByName('Main');
		}

		if ($this->Relation == 'db') {

			$field = new TextField('PrettyName', 'What is the title of this field?');
			$field->setDescription('Used to display inside the CMS (defaults to using machine name)');
			$fields->addFieldToTab('Root.CMS', $field);

			// Define the 'Type'.
			$field = new DropdownField('Type', 'Type of field?', array_combine(self::$db_types, self::$db_types));
			$field->setDescription('Out of the core Silverstripe types, which sort of field is this? (Save after editing this field)');
			$fields->addFieldToTab('Root.Field', $field);

			// Enum fields have special args.
			if ($this->Type == 'Enum') {

				// Define a list of values.
				$field = new TextareaField('RawArgs', 'Enumerated values');
				$field->setDescription('List of the available values for this enumerated field. One per line');
				$fields->addFieldToTab('Root.Main', $field);
			}
			// Varchar and HTMLVarchar fields have special args.
			elseif (in_array($this->Type, array(
				'Varchar', 'HTMLVarchar',
			))) {

				// Define a list of values.
				$field = new NumericField('RawArgs', 'Character count');
				$field->setDescription('What is the size in characters of this field?');
				$fields->addFieldToTab('Root.Main', $field);
			}

			// Add in the default value.
			$field = new TextField('RawDefault', 'What is the default value of this field?');
			$field->setDescription('Unless this field is empty, it is the default value for this field for all new instances');
			$fields->addFieldToTab('Root.Field', $field);

			// Add some basic validation.
			foreach (array(
				'ValidEmpty'  => array('Can this be empty?', "Do you want this field validated to ensure it's not empty?"),
				'ValidUnique' => array('Can this field repeat?', "Should this field be unique across other entries?"),
			) as $type => $name_desc) {

				// Prepare field.
				list($name, $desc) = $name_desc;
				$field = new DropdownField($type, $name, array(
					TRUE  => 'Yes',
					FALSE => 'No',
				));
				$field->setDescription($desc);

				// Add it.
				$fields->addFieldToTab('Root.Attribute', $field);
			}

			// Should this field be indexed?
			$field = new DropdownField('IndexType', 'Index this field?', array(
				''	 => 'No index',
				'index'    => 'A standard index',
				'fulltext' => 'Fulltext index',
				'unique'   => 'Unique index',
			));
			$fields->addFieldToTab('Root.Attribute', $field);

			// Is this a summary field? (Show in tables)
			$field = new TextField('SummaryField', 'Summary Field name');
			$field->setDescription("Is this a summary field? Enter it's column name here (ignored if empty)");
			$fields->addFieldToTab('Root.Main', $field);
		}
		elseif ($this->Relation == 'many_many') {
			// Add the extra field's name.
			$field = new TextField('ExtraFieldName', 'Extra field name');
			$field->setDescription('Name a linking field on this many_many relationship (empty for none)');
			$fields->addFieldToTab('Root.Main', $field);

			// Add the extra field's type.
			$field = new TextField('ExtraFieldType', 'Extra field type');
			$field->setDescription('The type of the linking field on this relationship (empty for none)');
			$fields->addFieldToTab('Root.Main', $field);
		}

		// Choose a field to edit the form.
		if ($this->Relation) {
			$availablefields = $this->getFormFields();
			$field = new DropdownField('FieldType', 'What type of field to use?', $availablefields);
			$fields->addFieldToTab('Root.CMS', $field);

			$description = new TextField('Description', 'Description');
			$description->setDescription('What goes into this field?');
			$fields->addFieldToTab('Root.CMS', $description);
		}

		// Done.
		return $fields;
	}

	/**
	 * Is this a valid field?
	 */
	protected function validator() {

		return new DataObjectCoach_FieldValidator();
	}

	/**
	 * Before the object is written, check if it's valid or not.
	 */
	protected function onBeforeWrite() {

		// Let the other code run first.
		parent::onBeforeWrite();

		$this->Enabled = TRUE;
	}

	/**
	 * After the field is written, write the parent again so the validators are run.
	 */
	protected function onAfterWrite() {

		// Let the other code run first.
		parent::onAfterWrite();

		// Re-save the parent.
		if ($this->ContainerID) {
			$this->Container()->write();
		}
	}

	/**
	 * Get a list of available form fields.
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

	/**
	 * Get enumerable values list.
	 */
	public function getEnumValues() {
		return array_map('trim', preg_split('/[\n\r]+/', $this->RawArgs));
	}

	/**
	 * Renders this field as it would appear inside a code file.
	 */
	public function toCode() {

		// 'abc' => 'Text',
		if ($this->Relation == 'db') {
			$type = $this->Type;
		}
		else {
			$type = $this->RawClassName;
		}
		if ($this->Type == 'Enum') {
			// An enum field is made up of a comma seperated list of items.
			$items = $this->getEnumValues();
			// Escape any commas or quotes.
			foreach ($items as &$item) {
				$item = $this->quoteString($item, '', '', array("\\", ',', "'"));
			}
			// Create the list of allowed values.
			$allowed = implode(', ', $items);
			// What is the default value?
			$default = $this->quoteString($this->RawDefault, '', '', array("\\", ',', "'"));
			// Add them to the list.
			$type .= "('$allowed', '$default')";
		}
		elseif ($this->RawArgs) {
			// Add the optional arguments.
			$type .= '(' . $this->RawArgs . ')';
		}

		// Done.
		return $this->quoteString($this->RawName) . ' => ' . $this->quoteString($type);
	}

	/**
	 * Returns a quoted string.
	 */
	protected function quoteString($str, $wrapper1 = "'", $wrapper2 = '"', $escape = array("\\", "$")) {

		// Does it contain a '?
		if ($wrapper1 && strpos($str, $wrapper1) === false) {
			return "$wrapper1$str$wrapper1";
		}

		// Special chars
		foreach ($escape as $char) {
			if (strpos($str, $char) !== false) {
				// There is a special char? Don't double quote.
				return "'" . str_replace("$", "\\$", addslashes($str)) . "'";
			}
		}

		// No special chars? Just a '?
		return "$wrapper2$str$wrapper2";
	}

	/**
	 * Returns a unique name for the index.
	 *
	 * This is based on it's components.
	 */
	public function getIndexName() {

		// Create it.
		return sprintf(
			'DOC_%s_%s_idx', $this->RawName, $this->IndexType
		);
	}
}
