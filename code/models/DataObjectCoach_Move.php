<?php

/**
 * @file
 * Provides the user with the ability to rearrange/remove existing fields from
 * the parent's CMS structure.
 */

class DataObjectCoach_Move extends DataObject {

	/**
	 * Details for this group.
	 */
	private static $db = array(
		'MachineName' => 'Varchar(128)',
		'Action'      => 'Enum("Reorder, Remove")',
		'Sort'	      => 'Int',
	);

	private static $has_one = array(
		'Parent' => 'DataObjectCoach_Container',
	);

	private static $singular_name = 'Rearrange';

	private static $summary_fields = array(
		'Action'      => 'Action',
		'MachineName' => 'Item',
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
		$fields->removeByName('MachineName');

		// Create a list of machine names.
		$machinenames = array();
		if ($this->ParentID) {
			$container = $this->Parent();
			if (class_exists($container->RawParent)) {
				$fieldlist = singleton($container->RawParent)->getCMSFields()->toArray();
				$machinenames = $this->createNameList($fieldlist);
				$machinenames = array_combine($machinenames, $machinenames);
			}

			// Add this as a field.
			$fields->addFieldToTab('Root.Main', new DropdownField('MachineName', 'Element machine name', $machinenames));
		}

		// Add descriptions to the other fields.
		$fields->fieldByName('Root.Main.Action')->setDescription('What are we doing to this element?');

		// Done.
		return $fields;
	}

	/**
	 * Go through an array and extract all components.
	 */
	protected function createNameList($list) {

		// Prepare variables.
		$results = array();

		// Go through all the items in the list.
		foreach ($list as $item) {

			// What item is this?
			$name = $item->getName();

			// Do they have any children?
			if (get_class($item) == 'TabSet') {
				$items = $item->Tabs()->toArray();
			}
			elseif (get_class($item) == 'Tab') {
				$items = $item->Fields()->toArray();
			}
			else {
				// No special children? Just add the name then...
				$results[] = $name;
				continue;
			}

			// Add all the children to the list too.
			foreach ($this->createNameList($items) as $item) {
				$results[] = $name . '.' . $item;
			}
		}

		// Done.
		return $results;
	}

	/**
	 * Get the parent and child portions of the machine name.
	 */
	public function getParts($cmsfields) {

		// Split this into parent and child.
		if (preg_match('/^(.*)\.([^\.]+)$/', $this->MachineName, $matches)) {
			$parent = $cmsfields->fieldByName($matches[1]);
			$name = $matches[2];
		}
		else {
			$parent = $cmsfields;
			$name = $machinename;
		}

		// Done.
		return array($parent, $name);
	}
}
