﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_PatternGen = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_PatternGen.prototype;
		
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
	
	instanceProto.onCreate = function()
	{
	    this.mode = this.properties[0];
        var init_patterns = this.properties[1];
        if (init_patterns != "")        
            this.patterns = JSON.parse(init_patterns);        
        else
            this.patterns = {};	   	                 
	    this._pat_rank = [];
        this._shadow_patterns = {};
        this.start_gen(); 	
        
        this.exp_LastPattern = "";
        
        this.randomGenUid = -1;    // for loading
        
        /**BEGIN-PREVIEWONLY**/
        this.propsections = [];      
        /**END-PREVIEWONLY**/           
	};
	cr.plugins_.Rex_PatternGen._random_gen = null;  // random generator for Shuffing

	instanceProto._reset_pat_rank = function(patterns)
	{
	    var pat;
	    // clean this._pat_rank
	    this._pat_rank.length = 0;
	    var pat, count, total_count=0;
	    // get total count
	    for (pat in patterns)
	    {
	        count = patterns[pat];
	        if (count > 0)
	            total_count += count;
	    }
	    // set rate
	    for (pat in patterns)
	    {
	        count = patterns[pat];
	        if (count > 0)
	        {
	            this._pat_rank.push({"rate":count/total_count,
	                                 "pattern":pat});
	        }
	    }
	};
	
	instanceProto._get_random_value = function()
	{
	    var gen = cr.plugins_.Rex_PatternGen._random_gen;
	    var value = (gen == null)?
			        Math.random(): gen.random();
        return value;
	};	
	
	instanceProto._get_rand_pattern = function(pat_rank)
	{
	    var value = this._get_random_value();
	    var pattern="", i, cnt=pat_rank.length;
	    for (i=0; i<cnt; i++)
	    {
	        value -= pat_rank[i]["rate"];
	        if (value < 0)
	        {
	            pattern = pat_rank[i]["pattern"];
	            break;
	        }
	    }
	    return pattern;
	};
		
	instanceProto.start_gen = function()
	{
	    var pat,count;
	    // clean shadow patterns
	    for (pat in this._shadow_patterns)
	        delete this._shadow_patterns[pat];
	    // set shadow patterns
	    for (pat in this.patterns)
	    {
	        count = this.patterns[pat];
	        if (count > 0)
	            this._shadow_patterns[pat] = this.patterns[pat];	        
	    }
	    if (this.mode == 1) // random mode
	        this._reset_pat_rank(this._shadow_patterns);
	    this.restart_gen_flg = false; 
	};
	
	var is_hash_empty = function(hash_obj)
	{
	    var is_empty=true;
	    var pat;
	    for (pat in hash_obj)
	    {
	        is_empty = false;
	        break;
	    }
	    return is_empty;
	};
		
	instanceProto.get_pattern = function(pattern)
	{
	    if (this.restart_gen_flg)
	        this.start_gen();	
	    if (pattern == null)
		{
	        if (this.mode == 0) // shuffle mode
	        {
	            this._reset_pat_rank(this._shadow_patterns);
	            pattern = this._get_rand_pattern(this._pat_rank);
	            if (pattern != null)
	            {
	                var count = this._shadow_patterns[pattern] - 1;	            
	                if (count <= 0)
	                    delete this._shadow_patterns[pattern];
	                else
	                    this._shadow_patterns[pattern] = count;
	            }
	            if (is_hash_empty(this._shadow_patterns))
	                this.restart_gen_flg = true;	        
	        }
	        else  // random mode
	        {
	            pattern = this._get_rand_pattern(this._pat_rank);
	        }
		}
		else  // force pick
		{
			if (!this._shadow_patterns.hasOwnProperty(pattern))
				pattern = "";	
            else
            {
			    if (this.mode == 0) // shuffle mode
	            {			    
	                var count = this._shadow_patterns[pattern] - 1;	            
	                if (count <= 0)
	                    delete this._shadow_patterns[pattern];
	                else
	                    this._shadow_patterns[pattern] = count;
			    }
			}
		}
	    return pattern;
	};

	instanceProto.saveToJSON = function ()
	{       	 
        var randomGen = cr.plugins_.Rex_PatternGen._random_gen;
        var randomGenUid = (randomGen != null)? randomGen.uid:(-1);    
		return { "m": this.mode,
		         "pats": this.patterns,
		         "pr": this._pat_rank,
		         "spats": this._shadow_patterns,
		         "rstf": this.restart_gen_flg,
                 "randomuid":randomGenUid,
                 "lp" : this.exp_LastPattern,
                 };
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	    this.mode = o["m"];
	    this.patterns = o["pats"];
	    this._pat_rank = o["pr"];
	    this._shadow_patterns = o["spats"];
	    this.restart_gen_flg = o["rstf"];        
        this.randomGenUid = o["randomuid"];	
        this.exp_LastPattern = o["lp"];	
	};	
    
	instanceProto.afterLoad = function ()
	{
        var randomGen;
		if (this.randomGenUid === -1)
			randomGen = null;
		else
		{
			randomGen = this.runtime.getObjectByUID(this.randomGenUid);
			assert2(randomGen, "Pattern gen: Failed to find random gen object by UID");
		}		
		this.randomGenUid = -1;			
		cr.plugins_.Rex_PatternGen._random_gen = randomGen;
	};
    
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	    this.propsections.length = 0;
        var pat;
        var pat_list = (this.restart_gen_flg)? this.patterns : this._shadow_patterns
        for (pat in pat_list)
        {
	        this.propsections.push({"name": pat, "value": pat_list[pat]});
        }
		propsections.push({
			"title": this.type.name,
			"properties": this.propsections
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
	};
	/**END-PREVIEWONLY**/    
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();    
    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();

    Acts.prototype.SetMode = function (m)
	{
	    this.mode = m;
	    this.restart_gen_flg = true;   
	};
		
    Acts.prototype.SetPattern = function (pattern, count)
	{
	    if (pattern == "")
	        return;
        this.patterns[pattern] = count;
        this.restart_gen_flg = true;       
	};
	
    Acts.prototype.RemovePattern = function (pattern)
	{  
	    if (pattern in this.patterns)
	        delete this.patterns[pattern];   
        this.restart_gen_flg = true;	          
	};	
	
    Acts.prototype.RemoveAllPatterns = function ()
	{  
	    var pattern;
	    for (pattern in this.patterns)
	        delete this.patterns[pattern];   
	    this.restart_gen_flg = true;  
	};	
	
    Acts.prototype.StartGenerator = function ()
	{  
	    this.restart_gen_flg = true; 
	};
	
    Acts.prototype.Generate = function ()
	{  
        this.exp_LastPattern = this.get_pattern();
	};	
	Acts.prototype.JSONLoad = function (json_)
	{
		var o;
		
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		
		this.loadFromJSON(o);		
	};
		
    Acts.prototype.SetRandomGenerator = function (random_gen_objs)
	{
        var random_gen = random_gen_objs.instances[0];
        if (random_gen.check_name == "RANDOM")
            cr.plugins_.Rex_PatternGen._random_gen = random_gen;        
        else
            alert ("[Pattern generator] This object is not a random generator object.");
	}; 	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
	Exps.prototype.Pattern = function (ret)
	{
        this.exp_LastPattern = this.get_pattern();
		ret.set_string(this.exp_LastPattern);
	};	
	
	Exps.prototype.TotalCount = function (ret, pattern)
	{
	    var count = this.patterns[pattern];
	    if (count == null)
	        count = 0;
		ret.set_float(count);
	};
	
	Exps.prototype.ManualPick = function (ret, pattern)
	{
		ret.set_string(this.get_pattern(pattern));
	};
	
	Exps.prototype.LastPattern = function (ret)
	{
		ret.set_string(this.exp_LastPattern);
	};		
	Exps.prototype.AsJSON = function (ret)
	{
		ret.set_string(JSON.stringify(this.saveToJSON()));
	};
}());