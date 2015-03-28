/**
 * @file
 * All classes must have a file defined to them.
 *
 * This is the template file for all VirtualClasses.
 */

class %s extends %s {
        public static $VIRTUALCLASS = TRUE;

	/**
	 * Ensure that generic methods can still be used.
	 */

	/**
	 * Gets all DataObjects which fit a filter.
	 */
	public function getDataObjects($class, $filter = null) {

		// Prepare variables.
		$results = DataObject::get($class);

		// Apply filter?
		if ($filter) {
			$results = $results->filter($filter);
		}

		// Done.
		return $results;
	}
}
