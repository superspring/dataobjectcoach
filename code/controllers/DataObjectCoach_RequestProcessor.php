<?php

/**
 * @file
 * Initialises the DataObject Coach's manifest as soon as the database is loaded.
 */
class DataObjectCoach_RequestProcessor extends RequestProcessor {

	/**
	 * Inject the manifest before the request begins.
	 */
	public function preRequest(SS_HTTPRequest $request, Session $session, DataModel $model) {
		// Run the standard prerequest.
		parent::preRequest($request, $session, $model);

		// Prepare variables.
		global $manifest, $flush;

		// Use a new Manifest class.
		$manifest = new DataObjectCoach_Manifest(BASE_PATH, FALSE, $flush);
	}
}
