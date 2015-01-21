<?php

/**
 * @file
 * Renders the classes which are available for editing.
 */

/**
 * Converts the current class diagram into a format viewable with UmlCanvas.
 */
class DataObjectCoach_GOAT extends LeftAndMain {

	/**
	 * Define it's placement in the admin section.
	 */
	private static $url_segment = 'dataobjectdisplay';
	private static $menu_title = 'DataObject Display';

	/**
	 * Show the classes available.
	 */
	public function getEditForm($id = null, $fields = null) {

		// Prepare varaibles.
		$fields = new FieldList(
			new TabSet('Root',
				new Tab('Main', _t('DataObjectCoach_GOAT.Main', 'Main'),
					new LiteralField('UML',
						$this->renderDiagram()
					)
				)
			),
			new HiddenField('ID', false, 0)
		);
		$actions = new FieldList();

		// Create the form.
		$form = CMSForm::create(
			$this, 'EditForm', $fields, $actions
		)->setHTMLID('Form_EditForm');

		// Done.
		return $form;
	}

	/**
	 * Render the template with the UmlCanvas code in it.
	 */
	protected function renderDiagram() {

		// Prepare path.
		$path = 'dataobjectcoach/thirdparty/UmlCanvas/';

		// Include the configuration.
		Requirements::javascript('dataobjectcoach/javascript/script.js');

		// Include the required CSS.
		Requirements::css('dataobjectcoach/css/form.css');
		Requirements::css($path . 'examples/examples.css');
		Requirements::css($path . 'build/UmlCanvas.css');

		// Include the required JS.
		foreach (array(
			'lib/Canvas2D/build/Canvas2D.standalone.js',
			'src/DepCheck.js',
			'src/UmlCanvas.js',
			'src/Common.js',
			'src/Manager.js',
			'src/Model.js',
			'src/Diagram.js',
			'src/Class.js',
			'src/Attribute.js',
			'src/Operation.js',
			'src/Parameter.js',
			'src/ConnectorHeads.js',
			'src/Association.js',
			'src/Role.js',
			'src/Dependency.js',
			'src/ClientSupplier.js',
			'src/Interface.js',
			'src/Inheritance.js',
			'src/Realization.js',
			'src/Enumeration.js',
			'src/Note.js',
			'src/NoteLink.js',
			'src/StateDiagrams.js',
			'src/Widget.js',
			'src/KickStart.js',
			'src/PluginManagerRepository.js',
			'src/plugins/Plugin.js',
			'src/plugins/Inspector.js',
			'src/plugins/Sheet.js',
			'src/plugins/HuC.js',
			'src/Defaults.js',
			'src/Config.js',
			'src/plugins/inspector.css.js'
		) as $jsfile) {
			Requirements::javascript($path . $jsfile);
		}

		// Render the page.
		return $this->renderWith('DataObjectCoach_GOAT_Main');
	}

	/**
	 * Get the UML language for this diagram.
	 */
	public function umlLanguage() {

		// Get a list of all the classes to render.
		$classes = $this->getClassList();

		// Prepare the language code.
		$code = $this->renderWith('DataObjectCoach_GOAT_UmlLang', array(
			'Classes' => $classes,
		));

		// Done.
		return $code;
	}

	/**
	 * Which class to show?
	 */
	protected function allClasses() {

		// Only show DataObjects.
		return ClassInfo::subclassesFor('DataObject');
	}

	/**
	 * Get a list of all the classes we care about.
	 */
	protected function getClassList() {

		// Prepare variables.
		$list = array();
		$parents = array();

		// Get a list of the classes.
		foreach ($this->allClasses() as $class => $file) {

			// Get the parent class.
			$parent = strtolower(get_parent_class($class));

			// Add it to the list.
			$list[$class] = array(
				'posLeft'   => 0,
				'posTop'    => 0,
				// Ensure all classes are lowercase.
				'className' => strtolower($class),
				'parent'    => $parent,
				'fields'    => $this->getFields($class),
			);

			// Get a list of the immediate parents.
			$parents[] = $parent;
		}

		// Ensure all parents exist in the tree.
		// This is to address a Silverstripe bug with ignoring abstract classes.
		foreach ($parents as $parent) {
			if ($parent && !array_key_exists($parent, $list)) {

				/**
				 * Some classes exist in thirdparty modules and including them _may_ cause
				 * large issues. Instead just add a class with the same name, since it is
				 * required to have something.
				 */
				$list[$parent] = array(
					'posLeft'   => 0,
					'posTop'    => 0,
					'className' => $parent,
					// If there is a parent, ignore this.
					'parent'    => '',
				);
			}
		}

		// Adjust the graph to make it look nicer.
		$list = $this->reorderGraph($list);
		$list = $this->positionGraph($list);

		// Done.
		return new ArrayList($list);
	}

	/**
	 * Attempt to reorder the graph to make it easier to read.
	 */
	protected function reorderGraph($list) {

		// Prepare variables.
		$tree = array();
		$order = array();
		$index = 1;

		// Build a class tree of all listed classes.
		foreach ($list as $item) {

			// Prepare variables.
			$parents = array();
			$class = $item['parent'];

			// Get all the parents.
			do {
				$parents[] = strtolower($class);
			} while ($class = get_parent_class($class));

			// Create the tree structure.
			$ref = &$tree;
			foreach (array_reverse($parents) as $parent) {

				// Does the structure exist?
				if (!array_key_exists($parent, $ref)) {
					$ref[$parent] = array();
				}

				// Add it to the structure.
				$ref = &$ref[$parent];
			}

			// Remove all parents with no children.
			unset($tree['']);

			// Add it to the tree.
			if (!array_key_exists($item['className'], $ref)) {
				$ref[$item['className']] = array();
			}
		}

		// Place items closer together based on how close they are in the tree.
		$query = array($tree);
		while ($next = array_shift($query)) {
			foreach ($next as $class => $children) {
				if (!empty($children)) {
					$query[] = $children;
				}
				$order[$class] = $index;
				$index += 1;
			}
		}

		// Reorder the list.
		usort($list, function($a, $b) use ($order) {

			// First by hierarchy order.
			$order1 = $order[$a['className']] - $order[$b['className']];

			$order2 = +strcmp($a['className'], $b['className']);

			// With priority on the first, return the order.
			return (($order1 > 0) - ($order1 < 0)) * 2 + $order2;
		});

		// Done.
		return $list;
	}

	/**
	 * Get a list of the fields that are part of this class.
	 */
	protected function getFields($class) {

		// Prepare variables.
		$config = Config::inst();
		$types = array(
			'db', 'has_one', 'has_many', 'many_many',
		);
		$results = array();

		// Go through each type.
		foreach ($types as $type) {

			// ...and get all those fields.
			$datatypes = $config->get($class, $type);
			if ($datatypes && is_array($datatypes)) {
				foreach ($datatypes as $fieldname => $fieldtype) {

					// Remove brackets.
					$fieldtype = preg_replace('/\(.*\)/', '', $fieldtype);

					// ...and add it to the list.
					$results[] = array(
						'DataType' => $type,
						'FieldName' => $fieldname,
						'FieldType' => $fieldtype,
					);
				}
			}
		}

		// Done.
		return new ArrayList($results);
	}

	/**
	 * Reposition the items to seperate them sufficiently.
	 */
	protected function positionGraph($list) {

		// Prepare variables.
		$maxwidth = 750;
		$countx = 0;
		$county = 0;

		// Figure out how big an item is to position it.
		foreach ($list as &$item) {

			// Calculate it's width.
			list($width, $height) = $this->calculateDimension($item);

			// Spread it out a bit.
			$height *= 2;
			$width *= 2;

			if ($countx + $width > $maxwidth) {
				$county += $height;
				$countx = 0;
			}

			$item['posLeft'] = $countx;
			$item['posTop']  = $county;

			$countx += $width;
		}

		// Done.
		return $list;
	}

	/**
	 * Calculate the item of a item dataobject graph item.
	 */
	protected function calculateDimension($item) {

		// How many characters is the name?
		$length = strlen($item['className']);

		// Approximate the width.
		$width = (int) (($length * 35 + 270) / 7.0);

		// Approximate the height.
		$height = 40;

		// Done.
		return array($width, $height);
	}
}
