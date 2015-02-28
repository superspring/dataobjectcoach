<?php

/**
 * @file
 * Updates the CMS fields for a virtual DataObject.
 */

class DataObjectCoach_CMSUpdate extends DataExtension {

	public function updateCMSFields(FieldList $cmsfields) {

		// Which class does this belong to?
		$class     = get_class($this->owner);
		$container = DataObjectCoach_Container::get()->filter('RawClassName', $class)->first();
		$fields    = $container->Fields();

		// Update the CMS fields.
		foreach ($fields as $field) {
			// Get the field name and type.
			$name = $field->RawName;
			$type = $field->FieldType;
			$default = $field->RawDefault;

			if (!class_exists($type)) {
				continue;
			}

			// Generate the field.
			if (in_array($type, array(
				'DropdownField',
			))) {
				$list = $field->getEnumValues();
				$field = new $type($name, $name, array_combine($list, $list));
			}
			else {
				$field = new $type($name, $name);
			}

			// Replace it.
			$cmsfields->addFieldToTab('Root.Main', $field);
		}

		// Done.
		return $fields;
	}
}
