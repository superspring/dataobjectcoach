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
		$fields = $form->Fields();
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

		// Is this a many to many? What is the relationship?
		$control = $form->getController();
		$gridfield = $control->getGridField();
		// What field is being used?
		$field = $gridfield->getName();
		$parentform = $gridfield->getForm();
		$parentrecord = $parentform->getRecord();

		// Does this match against anything DataObjectCoach is managing?
		$container = DataObjectCoach_Container::get()->filter(
			'RawClassName', get_class($parentrecord)
		)->first();
		if ($container) {
			$field = $container->Fields()->filter(
				'RawName', $field
			)->first();
			$obj = singleton('DataObjectCoach_CMSUpdate');
			foreach ($field->ManyManyFields() as $mfield) {
				$nfield = $obj->generateField($mfield);
				$fields->addFieldToTab('Root.Coach', $nfield);
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
		if ($container) {
			foreach ($container->Actions() as $action) {
				if (strtolower($action->Type) == $method) {

					// Yes! Do something!
					list($data, $form, $etc) = $args;
					return singleton($action->Type)->action($data);
				}
			}
		}

		// Otherwise? Do whatever else was going to happen.
		return $record->__call($method, $args);
	}
}
