<?php

/**
 * @file
 * Updates the CMS fields for a virtual DataObject.
 */

class DataObjectCoach_CMSUpdate extends DataExtension {

	/**
	 * Add some fields to this class' CMS.
	 */
	public function updateCMSFields(FieldList $cmsfields) {

		// Prepare variables.
		$groupfields = array(
			'coach' => array(),
		);

		// Which class does this belong to?
		$class     = get_class($this->owner);
		$container = DataObjectCoach_Container::get()->filter('RawClassName', $class)->first();
		$fields    = $container->getAllFields();

		// Update the CMS fields.
		foreach ($fields as $field) {

			// If the class doesn't exist yet...
			if (!class_exists($field->FieldType)) {
				continue;
			}

			// Generate the field.
			$nfield = $this->generateField($field);

			// Replacing doesn't count has_many relationships, so remove that too.
			$cmsfields->removeByName($field->RawName . 'ID');
			$cmsfields->removeByName($field->RawName);

			// Replace it.
			if ($nfield) {
				if ($field->GroupID) {
					$group = $field->Group();
					// @todo rewrite this sorting order to allow parents and children to be ordered together.
					$key = sprintf('%04d-%04d-%04d', 10000 - $group->ParentID, $group->Sort, $group->ID);
					if (!array_key_exists($key, $groupfields)) {
						$groupfields[$key] = array();
					}
					$groupfields[$key][] = $nfield;
				}
				else {
					$groupfields['coach'][] = $nfield;
				}
			}
		}

		// Sometimes there are empty fields, check for them.
		$this->cleanupFields($container, $cmsfields);

		// ...and rearrange a few other fields.
		$this->rearrangeFields($container, $cmsfields);

		// Sort the fields based on the group's order - 'coach' goes last.
		ksort($groupfields);

		// Add the fields to the form.
		foreach ($groupfields as $key => $fieldgroup) {

			// Is there anything in this group?
			if (empty($fieldgroup)) {
				// No? Skip it.
				continue;
			}

			if (strpos($key, '-') === false) {
				$parentid = $key;
			}
			else {
				list($parentid, $sort, $id) = explode('-', $key);
			}
			if ($parentid == 'coach') {
				$cmsfields->addFieldsToTab('Root.Coach', $fieldgroup);
			}
			else {
				$group = DataObjectCoach_Group::get()->byID($id);
				if ($group->Type == 'Tab') {
					$key = 'Root.' . $group->MachineName;
					$cmsfields->findOrMakeTab($key, $group->PrettyName);
					$cmsfields->addFieldsToTab($key, $fieldgroup);
				}
				elseif ($group->Type == 'ToggleComposite') {
					$groupfield = new ToggleCompositeField($group->MachineName, $group->PrettyName, $fieldgroup);
					$cmsfields->addFieldToTab('Root.Coach', $groupfield);
				}
				elseif ($group->Type = 'FieldGroup') {
					$groupfield = new FieldGroup($group->PrettyName, $fieldgroup);
					$cmsfields->addFieldToTab('Root.Coach', $groupfield);
				}
			}
		}

		// Done.
		return $cmsfields;
	}

	/**
	 * Get the pretty name from a DataObject.
	 *
	 * This is defined as the first summary field, if one exists.
	 */
	protected function getPrettyName($dataobject) {

		// Prepare variables.
		$summaries = Config::inst()->get($dataobject, 'summary_fields');

		// Get the first field, or otherwise, just it's ID.
		return empty($summaries) ? 'ID' : reset($summaries);
	}

	/**
	 * Create a dropdown field.
	 */
	protected function createDropdownField($field) {

		// Prepare variabless
		$name = $field->RawName;
		$title = $field->PrettyName ?: $name;

		// What values to put into this?
		if ($field->Relation == 'db' && $field->Type == 'Enum') {
			// Normal enum field.
			$list = $field->getEnumValues();
			$values = array_combine($list, $list);
		}
		elseif ($field->Relation == 'has_one') {
			// What is it's pretty field name?
			$class = $field->RawClassName;
			$prettyname = $this->getPrettyName($class);
			// Get a list of the fields directly from the parent class.
			$values = $class::get()->map('ID', $prettyname);
		}
		else {
			// um...?
			$values = array();
		}

		// Create the field.
		$nfield = new DropdownField($name, $title, $values);
		$nfield->setDescription($field->Description);

		// Done.
		return $nfield;
	}

	/**
	 * Create a gridfield field.
	 */
	protected function createGridField($field) {

		// Is this valid?
		if (!$this->owner->ID) {
			// No.
			throw new DataObjectCoach_BadOptionsException();
		}

		// What DataList to put into this?
		if ($field->Relation == 'has_many') {

			// Get the raw datalist from the owner object.
			$name = $field->RawName;
			$title = $field->PrettyName ?: $name;
			$list = $this->owner->$name();

			// Generate the default configuration for the field.
			$config = GridFieldConfig_RelationEditor::create();

			// Create the field.
			$nfield = new GridField($name, $title, $list, $config);
		}
		else {
			// um...?
			$nfield = new GridField();
		}

		// Add the description.
		$nfield->setDescription($field->Description);

		// Done.
		return $nfield;
	}

	/**
	 * Create a time field.
	 */
	protected function createTimeField($field) {

		// Prepare variables.
		$type = $field->FieldType;
		$name = $field->RawName;
		$title = $field->PrettyName ?: $name;

		// Create the field.
		$nfield = new $type($name, $title);
		$nfield->setDescription($field->Description);

		// Configure the field.
		switch ($type) {
			case 'DateField':
				$nfield->setConfig('datavalueformat', 'yyyy-MM-dd');
				$nfield->setConfig('showcalendar', 1);
				break;

			case 'DatetimeField':
				$nfield->setConfig('datavalueformat', 'yyyy-MM-dd HH:mm');
				$nfield->getDateField()->setConfig('showcalendar', 1);
				break;

			case 'TimeField':
				$nfield->setConfig('timeformat', 'HH:mm');
				break;
		}

		// Done.
		return $nfield;
	}

	/**
	 * Reorder some of the CMS fields.
	 */
	protected function rearrangeFields($container, $cmsfields) {

		// Which fields are being rearranged?
		$movemes = $container->Move()->filter('Action', 'Reorder');

		// Group these into a list of parents.
		$parents = array();
		foreach ($movemes as $moveme) {

			// Which tab are we working in?
			list($parent, $name) = $moveme->getParts($cmsfields);

			$parents[$parent->getName()][] = array($parent, $name, $moveme->Sort);
		}

		// Go through each composite set.
		foreach ($parents as $parentnamelist) {

			// Prepare variables.
			list($parent, ) = reset($parentnamelist);
			$names = array();
			foreach ($parentnamelist as $parentname) {
				list(, $name, $order) = $parentname;
				$names[$order] = $parent->fieldByName($name);
				$parent->removeByName($name);
			}

			// Preserve the original sort order.
			ksort($names);
			// Reset the keys to start from 0.
			$names = array_values($names);

			// Try and get a direct link to the items.
			if ($parent instanceof FieldList) {
				$items = &$parent->toArray();
			}
			elseif ($parent instanceof CompositeField) {
				$items = $parent->getChildren()->toArray();
			}
			else {
				// Oh noes! How did we get here?
				// Just move along like nothing happend...
				continue;
			}

			// Now add it back into it's right place.
			foreach ($names as $order => $item) {
				array_splice($items, $order, 0, array($item));
			}

			// Now force reorder all the items.
			foreach ($items as $item) {
				if ($item) {
					$parent->removeByName($item->getName());

					// ...and add them back in order.
					$parent->push($item);
				}
			}
		}
	}

	/**
	 * Clean up the extra CMS fields.
	 */
	protected function cleanupFields($container, $cmsfields) {

		// Are we removing any fields?
		$removemes = $container->Move()->filter('Action', 'Remove');
		foreach ($removemes as $removeme) {

			// Split this into parent and child.
			list($parent, $name) = $removeme->getParts($cmsfields);

			// Delete it.
 			$parent->removeByName($name);
		}

		// Go through each tab
		foreach ($cmsfields->toArray() as $tabset) {
			if (method_exists($tabset, 'Tabs')) {
				foreach ($tabset->Tabs() as $tab) {

					// ...and if any are empty
					if ($tab->Fields()->count() == 0) {

						// ...then remove them.
						$tabset->removeByName($tab->getName());
					}
				}
			}
		}
	}

	/**
	 * Create an appropriate field.
	 */
	protected function generateField($field) {

		// If there is an issue, catch the exception.
		try {
			switch ($field->FieldType) {
				case 'DropdownField':
					return $this->createDropdownField($field);
				case 'GridField':
					return $this->createGridField($field);
				case 'DateField':
				case 'TimeField':
				case 'DatetimeField':
					return $this->createTimeField($field);
				default:

					// Prepare variables.
					$type = $field->FieldType;
					$name = $field->RawName;
					$title = $field->PrettyName ?: $name;
					$default = $field->RawDefault ?: '';

					// Create the field.
					$nfield = new $type($name, $title, $default);
					$nfield->setDescription($field->Description);

					// Done.
					return $nfield;
			}
		}
		catch (DataObjectCoach_BadOptionsException $ex) {

			// Can't generate this field? Skip it.
			return null;
		}
	}
}
