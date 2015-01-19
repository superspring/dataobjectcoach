DataObject Coach
================

Allows editing of DataObjects structure and content in the CMS.

This module provides an admin section which allows the creation of new DataObjects and the modification of existing ones without any code.

 * Create a DataObject via the CMS by filling in fields such as Class Name, and fields.
 * Fields can use any of the available Silverstripe data types, these can be customised in any of the standard ways.
 * A field can be given a specific fieldtype to allow easy editing (eg TextField, CheckboxField, etc)
 * DataObjects already defined (in code or core) can be extended via the CMS, eg adding an 'Address' field to the 'Member' class.
 * After creating/editing a DataObject, always run /dev/build?flush=1 - feedback will be given there.

Example usage
-------------

The entire admin interface is accessible at /admin/dataobjectcoach

To create a new DataObject

 * Add a new DataObject
 * Fill in the details, at least class name - This must be an unused classname
 * Click create

To edit an existing DataObject (defined in code)

 * Add a new DataObject
 * Fill in the details, at least class name - This must be the class you wish to edit
 * Click create

You can now add fields to your DataObject

 * Add a new Field
 * Fill in as many details as you can, defaults will be used otherwise
 * Click create
 * This may now show additional information which can be filled in.
 * Click save

In order to edit your new DataObject in the CMS, make it editable

 * Edit your DatObject
 * Set 'Editable?' to be 'Yes'
 * Click save

Before you start using your new DataObject

 * Run /dev/build?flush=1

In order to edit it via the CMS

 * All classes defined as editable in the CMS are shown as tabs in the DataObject coach section
 * Click the tab for the DataObject you wish to edit
 * Add or edit via the standard GridField interface

Installation
------------

 * Install your site with composer - http://doc.silverstripe.org/framework/en/installation/composer
 * Set up your database, etc
 * Run: "composer require stripelabs/dataobjectcoach dev-master"
 * Go to: /dev/build?flush=1
 * Go to: /admin/dataobjectcoach
