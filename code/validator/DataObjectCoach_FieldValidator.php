<?php

/**
 * @file
 * Contains the validator for the field class.
 */

class DataObjectCoach_FieldValidator extends Validator {

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

                // 2. Must be a valid Database table name.
                // 3. Must have an argument for Enum, HTMLVarchar, Varchar which is single line list of at least one or integer less than database limit.
                // 1. If this is linked to another class, does that class exist?
                // 2. The field args are valid for it's type.
		// @todo Finish this.
	}
}
