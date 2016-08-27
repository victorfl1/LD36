﻿function GetPluginSettings()
{
	return {
		"name":			"Pattern gen",
		"id":			"Rex_PatternGen",
		"version":		"0.1",   		
		"description":	"Generate patterns with shuffle or random mode.",
		"author":		"Rex.Rainbow",
		"help url":		"https://dl.dropboxusercontent.com/u/5779181/C2Repo/rex_patterngen.html",
		"category":		"Rex - Random",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		0
	};
};

//////////////////////////////////////////////////////////////
// Conditions

//////////////////////////////////////////////////////////////
// Actions  
AddComboParamOption("Shuffle");
AddComboParamOption("Random");
AddComboParam("Mode", "Mode of pattern generator.",0);
AddAction(1, 0, "Set mode", "Mode", "Set mode to <i>{0}</i>", 
          "Set mode of pattern generator.", "SetMode");  
AddStringParam("Pattern", "Pattern in gererator.", '""');
AddNumberParam("Count", "Pattern count.", 1);
AddAction(2, 0, "Set pattern", "Pattern", "Set pattern <i>{0}</i> with count to <i>{1}</i>", 
          "Set pattern.", "SetPattern");
AddStringParam("Pattern", "Pattern in gererator.", '""');
AddAction(3, 0, "Remove pattern", "Pattern", "Remove pattern <i>{0}</i>", 
          "Remove pattern.", "RemovePattern"); 
AddAction(4, 0, "Remove all patterns", "Pattern", "Remove all patterns", 
          "Remove all patterns.", "RemoveAllPatterns");  
AddAction(5, 0, "Start", "Generator", 
          "Start generator", 
          "Start generator.", "StartGenerator"); 
AddAction(6, 0, "Generate", "Generator", 
          "Generate a new pattern", 
          "Generate a new pattern.", "Generate");           

AddStringParam("JSON", "A string of the JSON data to load.");
AddAction(11, 0, "Load", "JSON", "Load from JSON string <i>{0}</i>", "Load from an object previously encoded in JSON format.", "JSONLoad");
                  
AddObjectParam("Random generator", "Random generator object");
AddAction(20, 0, "Set random generator", "Setup", 
          "Set random generator object to <i>{0}</i>", 
          "Set random generator object.", "SetRandomGenerator");                              
//////////////////////////////////////////////////////////////
// Expressions
AddExpression(2, ef_return_string, 
              "Get pattern", "Generator", "Pattern", 
              "Get pattern from generator.");
AddStringParam("Pattern", "Pattern in gererator.", '""');
AddExpression(3, ef_return_number, 
              "Get count of pattern", "Pattern", "TotalCount", "Get total count of pattern.");
AddStringParam("Pattern", "Pattern in gererator.", '""');
AddExpression(4, ef_return_number, 
              "Manual pick pattern", "Generator", "ManualPick", 'Manual pick pattern. Return pattern if success, else return ""');
AddExpression(5, ef_return_string, 
              "Get last pattern", "Generator", "LastPattern", 
              "Get last generated pattern.")
              
AddExpression(11, ef_return_string, "Get as JSON", "JSON", "AsJSON", "Return the contents of the patterngen in JSON format.");
              
ACESDone();

// Property grid properties for this plugin
var property_list = [
    new cr.Property(ept_combo, "Mode", "Shuffle", "Generater mode.", "Shuffle|Random"),
    new cr.Property(ept_text, "Patterns", "", 
                   'Set patterns. ex:"{"A":10,"B":20}".'),	
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
    if (this.properties["Patterns"] != "")
        var data = JSON.parse(this.properties["Patterns"]);    
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
