<?php

/**
 * @file
 * Adds actions to gridfield's form.
 */

class DataObjectCoach_EditForm extends DataExtension {

	/**
	 * After the form has been constructed, intercept it and add in the actions.
	 */
	public function updateItemEditForm($form) {

		// Prepare variables.
		$actions = $form->Actions();
		$record = $form->getRecord();
		$container = DataObjectCoach_Container::get()->filter(
			'RawClassName', get_class($record)
		)->first();

		// Go through the actions we want to add.
		if ($container) {
			foreach ($container->Actions() as $action) {

				// Create the action and add it.
				$naction = new FormAction($action->Type, $action->Name);
				$actions->push($naction);
			}
		}
	}

	/**
	 * Create a list of all the possible actions we could make.
	 */
	public function allMethodNames($custom = false) {

		// Prepare variables.
		$actions = DataObjectCoach_Action::get();
		$methods = $this->owner ? $this->owner->allMethodNames($custom) : array();

		// Add them to the list.
		foreach ($actions as $action) {
			$methods[] = strtolower($action->Type);
		}

		// Done.
		return $methods;
	}

	/**
	 * React when these actions are called.
	 */
	public function __call($method, $args) {

		// Prepare variables.
		$record = $this->owner->record;
		$container = DataObjectCoach_Container::get()->filter(
			'RawClassName', get_class($record)
		)->first();

		// Is this one of the Coach's actions?
		foreach ($container->Actions() as $action) {
			if (strtolower($action->Type) == $method) {

				// Yes! Do something!
				list($data, $form, $etc) = $args;
				return singleton($action->Type)->action($data);
			}
		}

		// Otherwise? Do whatever else was going to happen.
		return parent::__call($method, $args);
	}
}
