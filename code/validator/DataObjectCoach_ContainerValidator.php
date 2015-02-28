<?php

/**
 * @file
 * Contains the validator the container class.
 */

class DataObjectCoach_ContainerValidator extends Validator {

	/**
	 * No javascript validator currently.
	 */
	public function javascript() {
		return false;
	}

	/**
	 * Ensure the new class will not cause any issues.
	 */
	public function php($data) {

		// Prepare varaibles.
		$result = true;

		// 1. Raw class name must be non-empty.
		// 3. Raw class name must be a valid PHP class name.
		if (trim($data['RawClassName']) == '' ||
		    !preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $data['RawClassName'])) {

			// List the error.
			$this->validationError('RawClassName', 'Expecting a valid class name', 'required');
			$result = false;
		}

		// 2. Name must be non-empty.
		if (trim($data['Name']) == '') {

			// List the error.
			$this->validationError('Name', 'Expecting a pretty name for this class', 'required');
			$result = false;
		}

		// 4. RawParent cannot be filled if the class already exists with a different parent.
		// @todo - This is delayed as the Parent name will be ignored if it already exists.

		// 5. RawParent must eventually be a DataObject.
		if ($data['RawParent']) {

			if (!class_exists($data['RawParent'])) {

				// List the error.
				$this->validationError('RawParent', 'Unable to find parent class', 'required');
				$result = false;
			}
			else {

				// Search for the 'DataObject' class somewhere in the hierarchy.
				$class = $data['RawParent'];
				$found = false;
				while (get_parent_class($class)) {
					$found |= $class == 'DataObject';
					$class = get_parent_class($class);
				}

				if (!$found) {

					// List the error.
					$this->validationError('RawParent', 'All classes must extend DataObject', 'required');
					$result = false;
				}
			}
		}

		// 6. Ensure the DummyClass exists.
		if (!file_exists(DataObjectCoach_Manifest::DUMMYCLASS_FILE)) {
			
			$this->validationError('RawClassName', 'Has this module been installed correctly? Unable to find dummy class', 'required');
			$result = false;
		}

		// Done.
		return $result;
	}
}
