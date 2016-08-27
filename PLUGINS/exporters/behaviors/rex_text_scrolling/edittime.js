﻿function GetBehaviorSettings()
{
	return {
		"name":			"Scrolling",
		"id":			"Rex_text_scrolling",
		"description":	"Scroll text on text object.",
		"author":		"Rex.Rainbow",
		"help url":		"https://dl.dropboxusercontent.com/u/5779181/C2Repo/rex_text_scrolling.html",
		"category":		"Rex - Text",
		"flags":		bf_onlyone
	};
};

//////////////////////////////////////////////////////////////
// Conditions
AddCondition(1, 0, "Last page", "Page", 
             "{my} at last page", "Return true if current page is last page.", "IsLastPage");
             
//////////////////////////////////////////////////////////////
// Actions
AddAnyTypeParam("Text", "Enter the text to set the object's content to.", "\"\"");
AddAction(1, 0, "Set content", "Content", 
          "{my} Set content to <i>{0}</i>", 
          "Set content.", "SetContent");
AddNumberParam("Percentage", "Scroll content, 0 is top, 1 is bottom.", 1);
AddAction(2, 0, "Scroll by percentage", "Scrolling", 
          "{my} Scroll content by percentage to <i>{0}</i>", 
          "Scroll content by percentage. 0 is top, 1 is bottom.", "ScrollByPercent");
AddAnyTypeParam("Text", "Enter the text to append to the object's content.", "\"\"");
AddAction(3, 0, "Append content", "Content", 
          "{my} Append <i>{0}</i>", 
          "Add text to the end of the existing content.", "AppendContent");          
AddNumberParam("Line index", "Scroll the first line to index (0-based).", 0);
AddAction(4, 0, "Scroll by line index", "Line scrolling", 
          "{my} Scroll content by line index to <i>{0}</i>", 
          "Scroll content by line index.", "ScrollByIndex");
AddAction(6, 0, "Next line", "Line scrolling", 
          "{my} Scroll content to next line", 
          "Scroll content to next line.", "NextLine");     
AddAction(7, 0, "Previous line", "Line scrolling", 
          "{my} Scroll content to previous line", 
          "Scroll content to previous line.", "PreviousLine"); 
AddAction(8, 0, "Next page", "Page scrolling", 
          "{my} Scroll content to next page", 
          "Scroll content to next page.", "NextPage");     
AddAction(9, 0, "Previous page", "Page scrolling", 
          "{my} Scroll content to previous page", 
          "Scroll content to previous page.", "PreviousPage");            
//////////////////////////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Get text", "Text", "Text", "Get text.");
AddExpression(1, ef_return_number, "Get total lines count", "Lines count", "TotalCnt", "Get total lines count of content.");
AddExpression(2, ef_return_number, "Get visible lines count", "Lines count", "VisibleCnt", "Get visible lines count of content.");
AddExpression(3, ef_return_number, "Get current lines index", "Lines index", "CurrIndex", "Get current lines index.");
AddExpression(4, ef_return_number, "Get current last lines index", "Lines index", "CurrLastIndex", "Get current last lines index.");
AddNumberParam("Line index", "Start line index (0-based).", 0);
AddNumberParam("Line index", "End line index (0-based).", 0);
AddExpression(5, ef_return_string, "Get text by line index", "Text", "Lines", "Get text by line index.");


ACESDone();

// Property grid properties for this plugin
var property_list = [                  
	];
	
// Called by IDE when a new behavior type is to be created
function CreateIDEBehaviorType()
{
	return new IDEBehaviorType();
}

// Class representing a behavior type in the IDE
function IDEBehaviorType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new behavior instance of this type is to be created
IDEBehaviorType.prototype.CreateInstance = function(instance)
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
	if (this.properties["Pixels per step"] < 1)
		this.properties["Pixels per step"] = 1;
}
