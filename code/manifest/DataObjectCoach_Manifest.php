<?php

/**
 * @file
 * Adds classes stored in the database to the manifest.
 */
class DataObjectCoach_Manifest extends SS_ClassManifest {
	const DUMMYCLASS_FILE = '../dataobjectcoach/code/manifest/DataObjectCoach_DummyClass.php';

	/**
	 * Replace the old manifest.
	 */
	public function __construct($base, $includeTests = false, $forceRegen = false, $cache = true) {
		// Ensure this class is the manifest class.
		$loader = SS_ClassLoader::instance();

		$loader->popManifest();
		$loader->pushManifest($this);

		parent::__construct($base, $includeTests, $forceRegen, $cache);
		$this->regenerate();
	}

	/**
	 * Ensure when regenerated that these classes are added again.
	 */
	public function regenerate($cache = true) {
		parent::regenerate($cache);

		// Any class that is Virtually defined, ensure it exists.
		try {
			set_error_handler(function() {
				throw new Exception('Carry on...');
			});

			$this->createVirtualClasses();

			// Update the loaded config for each class.
			$this->updateConfig();

			restore_error_handler();
		}
		catch (Exception $ex) {
			// Problem building these classes? Stop here then.
			restore_error_handler();
			// Don't tell the user, as we may be doing a dev/build.
			return;
		}

		// Store the cache again.
		if ($cache) {
			$data = array(
				'classes'      => $this->classes,
				'descendants'  => $this->descendants,
				'interfaces'   => $this->interfaces,
				'implementors' => $this->implementors,
				'configs'      => $this->configs,
				'configDirs'   => $this->configDirs,
			);
			$this->cache->save($data, $this->cacheKey);
		}
	}

	/**
	 * Get all virtual classes.
	 */
	protected function getVirtualClasses() {
		return DataObjectCoach_Container::get()->filter('Enabled', TRUE);
	}

	/**
	 * Generate all the Virtual classes.
	 */
	protected function createVirtualClasses() {
		// Go through all of the virtual classes.
		foreach ($this->getVirtualClasses() as $class) {

			// Is it enabled? Assume it's ok.
			if ($class->Enabled == '1') {

				// Prepare variables.
				$name   = $class->RawClassName;
				$parent = $class->RawParent;
				if (!$parent) {
					$parent = 'DataObject';
				}

				// Make it.
				if (!class_exists($name)) {
					$this->createClass($name, $parent);
				}

				// ...add to the class list.
				$this->updateManifestList($name, $parent);
			}
		}
	}

	/**
	 * Create a Virtual DataObject.
	 */
	protected function createClass($name, $parent) {

		// Using eval *shudder* create a new DataObject.
		$codetemplate = file_get_contents(self::DUMMYCLASS_FILE);

		// First ensure the class names are valid (contain no code, etc).
		if (!preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $name) ||
		    !preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $parent)) {

			// One of the classes is bad? Don't run it!
			throw new Exception('Unable to validate classname - ' . $name);
		}

		// Create the code.
		$code = sprintf($codetemplate, $name, $parent);

		// Create the class.
		eval($code);
		// Please forgive me for this command.

		// Add a dataextension to it.
		$name::add_extension('DataObjectCoach_CMSUpdate');
	}

	/**
	 * Update the manfiest's list of classes.
	 */
	protected function updateManifestList($name, $parent) {
		// ...and add it to the class list.
		$namelower = strtolower($name);
		$parentlower = strtolower($parent);
		if (!array_key_exists($namelower, $this->classes)) {
			$this->classes[$namelower] = self::DUMMYCLASS_FILE;
		}
		if (!array_key_exists($parent, $this->children) || !in_array($name, $this->children[$parent])) {
			$this->children[$parent][] = $name;
		}
		if (!in_array($name, $this->descendants['dataobject'])) {
			$parent = $name;
			while ($parent = get_parent_class($parent)) {
				$parentlower = strtolower($parent);
				$this->descendants[$parentlower][] = $name;
			}
		}
	}

	/**
	 * Regenerates the config on-the-fly.
	 */
	protected function updateConfig() {
		// Prepare variables.
		$config = Config::inst();

		// For each class, add it's fields.
		foreach ($this->getVirtualClasses() as $class) {

			// Prepare a summary field list.
			$summary = array();
			$defaults = $config->get($class->RawClassName, 'defaults') ?: array();
			$index = $config->get($class->RawClassName, 'indexes') ?: array();

			// Add all the individual fields.
			foreach ($class->Fields()->filter('Enabled', TRUE) as $field) {
				$this->createField($config, $class->RawClassName, $field);

				if ($field->SummaryField) {
					$summary[$field->RawName] = $field->SummaryField;
				}
				if ($field->RawDefault) {
					$defaults[$field->RawName] = $field->RawDefault;
				}
				if ($field->IndexType) {

					// Uniquely name the index.
					// @todo - security flaw - escape these characters.
					$index[$field->getIndexName()] = array(
						'type' => $field->IndexType,
						'value' => '"' . $field->RawName . '"',
					);
				}
			}

			// Set it's name.
			$config->update($class->RawClassName, 'singular_name', $class->Name);

			// Set it's description.
			$config->update($class->RawClassName, 'description', $class->Description);

			// Does it have a summary field?
			$config->update($class->RawClassName, 'summary_fields', array_keys($summary));
			$config->update($class->RawClassName, 'field_labels', array_values($summary));

			// Does it have a default?
			$config->update($class->RawClassName, 'defaults', $defaults);

			// What index is it using?
			$config->update($class->RawClassName, 'indexes', $index);
		}

		// For each class, add it to the managed models.
		$managed_models = $config->get('DataObjectCoach_Content', 'managed_models');
		$managed_models[] = 'DataObjectCoach_Container';
		foreach ($this->getVirtualClasses() as $class) {
			if ($class->Editable) {
				$managed_models[] = $class->RawClassName;
			}
		}
		$config->update('DataObjectCoach_Content', 'managed_models', $managed_models);
	}

	/**
	 * Generate config for a field.
	 */
	protected function createField($config, $name, $field) {
		switch ($field->Relation) {
			case 'db':
				$this->createDBField($config, $name, $field);
				break;

			case 'has_one':
				$this->createHasOneField($config, $name, $field);
				break;

			case 'has_many':
				$this->createHasManyField($config, $name, $field);
				break;

			case 'many_many':
				$this->createManyManyField($config, $name, $field);
				break;
		}
	}

	/**
	 * Generate config for a db field.
	 */
	protected function createDBField($config, $name, $field) {
		// Prepare variables.
		$db = $config->get($name, 'db');
		$fieldname    = $field->RawName;
		$fieldtype    = $field->Type;
		$fieldarg     = $field->RawArgs;
		$fielddefault = $field->RawDefault;

		// Does this parameter have args?
		$rawvalue = $fieldtype;
		switch ($fieldtype) {
			case 'Enum':
				// @todo Escape these values.
				$list = $field->getEnumValues();
				if ($fielddefault == '') {
					$fielddefault = reset($list);
				}
				$rawvalue = sprintf("Enum('%s', '%s')", implode(',', $list), $fielddefault);
				break;

			case 'Varchar':
			case 'HTMLVarchar':
				// @todo add this size.
				break;
		}

		// Add it to the list, or update.
		if ($fieldname && $rawvalue) {
			$db[$fieldname] = $rawvalue;
		}

		// Update configuration.
		$config->update($name, 'db', $db);
	}

	/**
	 * Generic config for has_one field.
	 */
	protected function createHasOneField($config, $name, $field) {
		// Prepare variables.
		$hasone = $config->get($name, 'has_one');
		$fieldname  = $field->RawName;
		$fieldclass = $field->RawClassName;

		// Add it to the list, or update.
		if ($fieldname && $fieldclass) {
			$hasone[$fieldname] = $fieldclass;
		}

		// Update configuration.
		$config->update($name, 'has_one', $hasone);
	}

	/**
	 * Generic config for a has_many field.
	 */
	protected function createHasManyField($config, $name, $field) {
		// Prepare variables.
		$hasmany = $config->get($name, 'has_many');
		$fieldname  = $field->RawName;
		$fieldclass = $field->RawClassName;

		// Add it to the list, or update.
		if ($fieldname && $fieldclass) {
			$hasmany[$fieldname] = $fieldclass;
		}

		// Update configuration.
		$config->update($name, 'has_many', $hasmany);
	}

	/**
	 * Generate config for a many_many field.
	 */
	protected function createManyManyField($config, $name, $field) {
		// Prepare variables.
		$manymany = $config->get($name, 'many_many');
		$manymanyextra = $config->get($name, 'many_many_extraFields');
		$fieldname  = $field->RawName;
		$fieldclass = $field->RawClassName;
		$extraname  = $field->ExtraFieldName;
		$extratype  = $field->ExtraFieldType;

		// Add it to the list, or update.
		if ($fieldname && $fieldclass) {
			$manymany[$fieldname] = $fieldclass;
		}
		if ($extraname && $extratype) {
			$manymanyextra[$extraname] = $extratype;
		}

		// Update configuration.
		$config->update($name, 'many_many', $manymany);
		$config->update($name, 'many_many_extraFields', $manymanyextra);
	}
}
