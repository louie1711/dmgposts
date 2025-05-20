<?php
// This file is generated. Do not modify it manually.
return array(
	'dmgposts' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/dmgposts',
		'version' => '0.1.0',
		'title' => 'Dmgposts',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'attributes' => array(
			'searchById' => array(
				'type' => 'integer'
			),
			'searchByTitle' => array(
				'type' => 'string'
			),
			'savedReadPostId' => array(
				'type' => 'integer'
			)
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'dmgposts',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	)
);
