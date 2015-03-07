<?php

/**
 * @file
 * Provides an interface for any user defined action.
 */

interface DataObjectCoach_MyAction {

	/**
	 * Give the class a pretty name.
	 */
	public function getName();

	/**
	 * This method is called when the user selects this action in the CMS.
	 *
	 * @param array $data
	 *   The fields in the (unpopulated) dataobject.
	 *   This may contains IDs instead of object references.
	 *
	 * @return string
	 *   Whatever will be displayed the user.
	 *   This may even be a redirectBack.
	 */
	public function action(array $data);
}
