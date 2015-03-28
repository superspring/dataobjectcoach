<?php

/**
 * @file
 * Add the ability to add a Silverstripe form to a controller.
 */

class DataObjectCoach_Form extends DataObject {

	/**
	 * What're the details for this form?
	 */
	private static $db = array(

		// Use this name in the template.
		'MachineName' => 'Text',
		// The title of the form.
		'Heading'     => 'Text',
		// Overwrite the default template?
		'Template'    => 'Text',
	);

	/**
	 * Link back to the container.
	 */
	private static $has_one = array(
		'Parent2' => 'DataObjectCoach_Container',
	);

	/**
	 * What fields/actions are there?
	 */
	private static $has_many = array(
		'Fields' => 'DataObjectCoach_FormField',
	);

	/**
	 * What is the default template?
	 */
	private static $defaults = array(
		// Defined in the templates section.
		'Template' => 'dataobjectcoach_form_template',
	);

	private static $singular_name = 'Form';

	/**
	 * Show these fields in the CMS.
	 */
	public function getCMSFields() {

		// Prepare variables.
		$fields = parent::getCMSFields();
		$templates = array_keys(SS_TemplateLoader::instance()->getManifest()->getTemplates());
		$templates = array_combine($templates, $templates);

		// Provide the general fields.
		$machinename = new TextField('MachineName', 'Machine name');
		$machinename->setDescription('The variable used in the template files');
		$heading = new TextField('Heading', 'Title');
		$heading->setDescription('Title field of the form - rendered in the template');
		$template = new DropdownField('Template', 'Template?', $templates);
		$template->setDescription('Which template to use here?');

		// Remove these fields.
		foreach (array(
			'MachineName', 'Heading', 'Template', //'ParentID',
		) as $field) {
			$fields->removeByName($field);
		}

		// Add them back.
		$fields->addFieldsToTab('Root.Main', array(
			$machinename, $heading, $template,
		));

		// Create the fields list.
		$fieldlist = new FieldEditor('Fields', 'Fields', '', $this);
		$fields->addFieldToTab('Root.Fields', $fieldlist);

		// Done.
		return $fields;
	}
}

class DataObjectCoach_Form_Controller extends UserDefinedForm_Controller {
}
