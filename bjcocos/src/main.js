"use strict"  // Use strict JavaScript mode

// Pull in the modules we're going to use
var cocos  = require('cocos2d')   // Import the cocos2d module
  , nodes  = cocos.nodes          // Convenient access to 'nodes'
  , events = require('events')    // Import the events module
  , geo    = require('geometry')  // Import the geometry module
  , ccp    = geo.ccp              // Short hand to create points
	, bjScene = require('/bjScene')
	
// Convenient access to some constructors
var Layer    = nodes.Layer
  , Scene    = nodes.Scene
  , Label    = nodes.Label
  , Director = cocos.Director
	

/**
 * Entry point for the application
 */
main.WIDTH	= 960;
main.HEIGHT = 640;
function main () {
    // Initialise application

    // Get director singleton
    var director = Director.sharedDirector
			director.backgroundColor = '#B4D565';
      director.displayFPS = true;
      
    // Wait for the director to finish preloading our assets
    events.addListener(director, 'ready', function (director) {
      
        //if (Director.sharedDirector.isTouchScreen)  document.write('<link rel="stylesheet" type="text/css" href="mobile.css">');      
        
        // Create a scene and layer
        var scene = new bjScene()
				
        // Run the scene
        director.replaceScene(scene)
    })

    // Preload our assets
    director.runPreloadScene()
}

exports.main = main

