﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_UndoRedo = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_UndoRedo.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	
	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

    var SIMPLEMODE_KEY = "_";
	instanceProto.onCreate = function()
	{
	    this.handler = (this.properties[0] == 0)? new steps_handler(this):
                                                   new states_handler(this)
	    this.is_states_mode = (this.properties[0] == 0);
        this.max_record_length = this.properties[1];
        this.recorder = [];
        this.cur_step = null;
        this.tmp_dict = {};
        this.clean_all();
	};

	instanceProto.clean_all = function()
	{
        this.recorder.length = 0;
        this.current_index = (-1);
	};

	instanceProto.Push = function(data)
	{
	    if ((this.recorder.length-1) == this.current_index)
	    {
            this.current_index += 1;	        
            this.recorder.push(data);
        }
        else
        {
            this.current_index += 1;
            this.recorder[this.current_index] = data;
            this.recorder.length = this.current_index+1;
        }
            
        if ((this.max_record_length > 0) && 
            (this.recorder.length > this.max_record_length))  
        {      
            this.recorder.shift();
            this.current_index -= 1;
        }          
	};
	instanceProto.Undo = function (ret)
	{
	    this.cur_step = this.handler.Undo();
	    return this.cur_step;
	};
	
	instanceProto.Redo = function (ret)
	{
	    this.cur_step = this.handler.Redo()
	    return this.cur_step;	        
	};		
    
    
    var steps_handler = function(plugin)
    {
        this.plugin = plugin;
    };
    var steps_handlerProto = steps_handler.prototype;
    // undo
	steps_handlerProto.CanUndo = function()
	{
	    return (this.plugin.current_index >= 0);
	};
	steps_handlerProto.Undo = function()
	{	    
	    if (!this.CanUndo())
	        return 0;
	    
	    var plugin = this.plugin;
	    var val = plugin.recorder[plugin.current_index];
	    plugin.current_index -=1;
	    return val;
	};
	// redo
	steps_handlerProto.CanRedo = function()
	{
	    var plugin = this.plugin;
	    return (plugin.current_index < (plugin.recorder.length-1));
	};
	steps_handlerProto.Redo = function()
	{
	    if (!this.CanRedo())
	        return 0;
	    
	    var plugin = this.plugin;
        plugin.current_index +=1;
	    var val = plugin.recorder[plugin.current_index];
	    return val;
	};
    
    
    var states_handler = function(plugin)
    {
        this.plugin = plugin;
    };
    var states_handlerProto = states_handler.prototype;
    // undo
	states_handlerProto.CanUndo = function()
	{
	    return (this.plugin.current_index > 0);
	};
	states_handlerProto.Undo = function()
	{	    
	    if (!this.CanUndo())
	        return 0;
	    
	    var plugin = this.plugin;
	    plugin.current_index -=1;
	    return plugin.recorder[plugin.current_index];
	};
	// redo
	states_handlerProto.CanRedo = function()
	{
	    var plugin = this.plugin;
	    return (plugin.current_index < (plugin.recorder.length-1));
	};
	states_handlerProto.Redo = function()
	{
	    if (!this.CanRedo())
	        return 0;
	    
	    var plugin = this.plugin;
	    plugin.current_index +=1 ;
	    return plugin.recorder[plugin.current_index];
	};		
	
	// current step
	instanceProto.has_steps = function()
	{
	    return (this.current_index != -1);
	};


	// JSON
	instanceProto.steps2string = function()
	{
	    return JSON.stringify(this.saveToJSON());
	};
	instanceProto.string2steps = function(JSON_string)
	{
	    if (JSON_string == "")
	        return;
	    var o = JSON.parse(JSON_string);
	    this.loadFromJSON(o);
	};
	
	instanceProto.saveToJSON = function ()
	{
		return { "d": this.recorder,
                 "i": this.current_index };
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	    this.recorder = o["d"];
	    this.current_index = o["i"];
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds(); 
     
	Cnds.prototype.CanUndo = function ()
	{
		return this.handler.CanUndo();      
	};
     
	Cnds.prototype.CanRedo = function ()
	{
		return this.handler.CanRedo();        
	};
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
		
	Acts.prototype.CleanAll = function ()
	{        
	    this.clean_all();
	};	
		
	Acts.prototype.Push = function (data)
	{       	     
	    var d, is_simple_mode = (data != null);
	    if (is_simple_mode)
	    {
	        d = {};
	        d[SIMPLEMODE_KEY] = data;
	    }
	    else
	    {
	        d = this.tmp_dict;
	        this.tmp_dict = {};
	    }
	    
	    this.Push(d);
	};	
			
	Acts.prototype.StringToSteps = function (JSON_string)
	{
	    this.string2steps(JSON_string);
	};

	Acts.prototype.SetDate = function (k, d)
	{      
	    this.tmp_dict[k] = d;
	};	
		
	Acts.prototype.Undo = function ()
	{        
	    this.Undo();
	};	
		
	Acts.prototype.Redo = function ()
	{        
	    this.Redo();
	};		
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
	Exps.prototype.Undo = function (ret)
	{
	    var cur_step = this.Undo();
	    if (cur_step == null)
	        cur_step = 0;
	    else
	        cur_step = cur_step[SIMPLEMODE_KEY];
	    ret.set_any(cur_step);
	};
	
	Exps.prototype.Redo = function (ret)
	{   
	    var cur_step = this.Redo();
	    if (cur_step == null)
	        cur_step = 0;
	    else
	        cur_step = cur_step[SIMPLEMODE_KEY];
	    ret.set_any(cur_step);
	};	
	
	Exps.prototype.CurStep = function (ret, k)
	{
	    var d;
	    if (this.cur_step == null)
	    {
	        d = 0;
	    }
	    else
	    {
	        if (k == null)
	            k = SIMPLEMODE_KEY;
	        d = this.cur_step[k];
	    }
	    ret.set_any(d);
	};
		
	Exps.prototype.StepsCnt = function (ret)
	{
	    ret.set_int(this.recorder.length);
	};
		
	Exps.prototype.CurIndex = function (ret)
	{
	    ret.set_int(this.current_index);
	};		
	
	Exps.prototype.ToString = function (ret)
	{
	    ret.set_string(this.steps2string());
	};
}());