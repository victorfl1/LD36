﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_ListCtrl = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_ListCtrl.prototype;
		
	pluginProto.onCreate = function ()
	{
		pluginProto.acts.Destroy = function ()
		{
			this.runtime.DestroyInstance(this);
            this.set_lines_count(0);
		};        
	};
    
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
	    this.is_clamp_OY = (this.properties[3] == 1);
	    this.default_lineHeight = this.properties[1];
	    this.update_flag = true;
	    this.OY = 0;
	    
	    this.lines_mgr = new cr.plugins_.Rex_ListCtrl.LinesMgrKlass(this);
	    this.lines_mgr.SetLinesCount(this.properties[2]);
        this.visibleLineIndexes = {};
        this.pre_visibleLineIndexes = {};
        
        this.visible_start = 0;     
        this.visible_end = 0;
        
        // monitor ListCtrl changing
        this.pre_instX = this.x;
        this.pre_instY = this.y;
        this.pre_instHeight = this.height;
        
        this.exp_LineIndex = 0;
        this.exp_LineTLX = 0;
        this.exp_LineTLY = 0;
        this.exp_LastRemovedLines = "";
        
        this.runtime.tick2Me(this);
	};
    
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};  

    instanceProto.tick2 = function()
    {            
        var is_heightChanged = (this.pre_instHeight !== this.height);
        var is_XChanged = (this.pre_instX !== this.x);
        var is_YChanged = (this.pre_instY !== this.y);
        var is_areaChange = is_heightChanged || is_XChanged || is_YChanged;
        
        this.update_flag = this.update_flag || is_areaChange;
        
        if (!this.update_flag)
            return;
                
        this.update();
        this.update_flag = false;        
        
        this.pre_instX = this.x;
        this.pre_instY = this.y;        
        this.pre_instHeight = this.height;
    };
    
	instanceProto.onDestroy = function ()
	{		
        //this.set_lines_count(0);
	};
        
    	
    instanceProto.update = function(refresh)
    {     
        if (refresh)
        {
            this.prepare();
            this.hide_lines();   
        }
        
        this.prepare();
        this.show_lines();
        this.hide_lines();
        
        this.exp_LineIndex = -1;        
    };  
    
    instanceProto.prepare = function()
    {            
        var tmp = this.pre_visibleLineIndexes;
        this.pre_visibleLineIndexes = this.visibleLineIndexes;        
        this.visibleLineIndexes = tmp;
        
        clean_table(this.visibleLineIndexes);
        
    };    

    instanceProto.show_lines = function()
    {            
        this.update_bbox();
        // index
        var line_index = Math.floor( -this.OY / this.default_lineHeight );	            
        var line_tlx = this.bquad.tlx;       
        var line_tly = this.get_tlY(line_index);
        // end condition
        var bottom_bound = this.bquad.bly;    
        var last_index = this.lines_mgr.GetLinesCount() -1;
        
        var line;
        this.visible_start = null;
        this.visible_end = null;
        // visible lines
        while ((line_tly < bottom_bound) && (line_index <= last_index))
        {
            if (this.lines_mgr.IsInRange(line_index))
            {
                if (this.visible_start === null)            
                {
                    this.visible_start = line_index; 
                }                    
                this.visible_end = line_index;                    
                this.visibleLineIndexes[line_index] = true; 
                
                line = this.lines_mgr.GetLine(line_index);
                line_tly += line.offsety;
                line.SetTopLeftPXY(line_tlx, line_tly);
                
                if (this.pre_visibleLineIndexes.hasOwnProperty(line_index))
                {
                    line.PinInsts();
                }
                else
                {
                    // on line visible
                    this.show_line(line_index, line_tlx, line_tly);
                }
            }
            
            line_index += 1;
            line_tly += this.default_lineHeight;
        }
    }; 
    
    instanceProto.show_line = function(idx, tlx, tly)
    {          
        this.exp_LineIndex = idx;
        this.exp_LineTLX = tlx;
        this.exp_LineTLY = tly;
        this.runtime.trigger(cr.plugins_.Rex_ListCtrl.prototype.cnds.OnLineVisible, this);     
    };
    
    instanceProto.hide_lines = function()
    {          
        // invisible lines
        var i, insts;
        for (i in this.pre_visibleLineIndexes)
        {        
            if (this.visibleLineIndexes.hasOwnProperty(i))
                continue;            
                
            this.hide_line(i);              
        }
    };
    
    instanceProto.hide_line = function(idx)
    {          
        this.exp_LineIndex = parseInt(idx);
        this.runtime.trigger(cr.plugins_.Rex_ListCtrl.prototype.cnds.OnLineInvisible, this);
            
        // destroy instances in the line  
        this.lines_mgr.DestroyPinedInsts(idx);     
    };
    
    instanceProto.get_tlY = function(line_index)
    {            
        this.update_bbox();        
        var py = ( this.OY + (line_index * this.default_lineHeight) ) + this.bquad.tly;        
        return py;
    };
        
	instanceProto.set_OY = function(oy)
	{
	    if (this.is_clamp_OY)
	    {
	  
	        if (oy > 0)
	            oy = 0;
	        else 
	        {
	            var list_height = (this.lines_mgr.GetLinesCount() - this.get_fullLinesCnt()) * this.default_lineHeight;
	            if (oy < -list_height)
	                oy = -list_height;
	        }
	    }
	    this.update_flag = this.update_flag || (this.OY !== oy );
	    this.OY = oy;	    
	};

	instanceProto.is_visible = function(idx)
	{
	    if (this.visible_start == null)
	        return false;
	        
	    return (idx >= this.visible_start) && (idx <= this.visible_end);
	};

    instanceProto.get_fullLinesCnt = function()
    {            
        return (this.height/this.default_lineHeight);          
    };  
    
	var NEWLINES = [];	
	var get_content = function (content)
	{
	    if (content === "")
	        return null;
	        
	    if (typeof(content) === "string")
	    {
	        try {
		    	return JSON.parse(content);
		    }
		    catch(e) { return null; }
	    }
	    else if (typeof(content) === "number")
	    {
	        NEWLINES.length = content;
	        var i;
	        for (i=0; i<content; i++)
	            NEWLINES[i] = null;	 
	        return NEWLINES;       
	    }
	    else
	        return content;
	};

    instanceProto.set_lines_count = function (cnt)
	{
	    if (cnt < 0)
	        cnt = 0;

	    this.lines_mgr.SetLinesCount(cnt);
        this.update();
	};	
	
    instanceProto.insert_lines = function (idx, content)
	{
	    content = get_content(content);
	    if (content === null)
	        return;
	        
	    var cnt = content.length;
        if (this.is_visible(idx))
        {
            var i;
            for(i=0; i<cnt; i++)
            {
	            delete this.visibleLineIndexes[idx + i];
	            this.visibleLineIndexes[this.visible_end+1 + i] = true; 
	        }	        
        }	    
	    this.lines_mgr.InsertLines(idx, content);	    
	    this.update();
	};	
	
    instanceProto.remove_lines = function (idx, cnt)
	{   
	    var total_lines = this.lines_mgr.GetLinesCount();
	    if ( (idx + cnt) > total_lines)
	        cnt = total_lines - idx;
	        
        if (this.is_visible(idx))
        {
            var i;
            for(i=0; i<cnt; i++)
            {
                delete this.visibleLineIndexes[this.visible_end-i];
            }                        
        }	    
	    var removed_lines = this.lines_mgr.RemoveLines(idx, cnt);
	    this.exp_LastRemovedLines = JSON.stringify( removed_lines );
        this.update();
	};	    
			
    instanceProto.for_each_line = function (start_, end_, filter_fn)
	{   
	    var total_lines = this.lines_mgr.GetLinesCount();	    
	    var start = (start_ == null)? 0: Math.min(start_, end_);	    
	    var end = (end_ == null)? total_lines-1: Math.max(start_, end_);
	    if (start < 0)
	        start = 0;
	    if (end > total_lines)
	        end = total_lines-1;
	        
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
		         
		var i;
		for(i=start; i<=end; i++)
		{
            if (solModifierAfterCnds)
            {
                this.runtime.pushCopySol(current_event.solModifiers);
            }
            
            if ((!filter_fn) || filter_fn(i))
            {
                this.exp_LineIndex = i;
                current_event.retrigger();
            }
            
		    if (solModifierAfterCnds)
		    {
		        this.runtime.popSol(current_event.solModifiers);
		    }            
		}
    		
		return false;	        
	    
	};	 

    instanceProto.get_page_index = function (page)
	{
        var idx;
	    var full_lines_cnt = this.get_fullLinesCnt();  
        if (page == -1) // last full page      
            idx = this.lines_mgr.GetLinesCount() - full_lines_cnt;        
        else        
            idx = full_lines_cnt * page;
            
        if (idx < 0)
            idx = 0;            
        return idx;
	};
    
    var clean_table = function(o)
    {
        for(var k in o)
            delete o[k];
    };
	        
	instanceProto.saveToJSON = function ()
	{
        // monitor ListCtrl changing
        this.pre_instX = this.x;
        this.pre_instY = this.y;
        this.pre_instHeight = this.height;
        
		return { "line_height": this.default_lineHeight,
		         "update_flag": this.update_flag,
		         "OY": this.OY,
		         "lines_mgr": this.lines_mgr.saveToJSON(),
		         "visible_lines": this.visibleLineIndexes,
		         "pre_visible_lines": this.pre_visibleLineIndexes,
		         "visible_start": this.visible_start,
		         "visible_end": this.visible_end,
		         
		         "pre_instX": this.pre_instX,
		         "pre_instY": this.pre_instY,
		         "pre_instHeight": this.pre_instHeight,      
		       };
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	    this.default_lineHeight = o["line_height"];	    
	    this.update_flag = o["update_flag"];	   
	    this.OY = o["OY"];	    
	    this.lines_mgr.loadFromJSON( o["lines_mgr"] ); 
	    this.visibleLineIndexes = o["visible_lines"];
	    this.pre_visibleLineIndexes = o["pre_visible_lines"];
	    this.visible_start = o["visible_start"];
	    this.visible_end = o["visible_end"];
	    
	    this.pre_instX = o["pre_instX"];
	    this.pre_instY = o["pre_instY"];
	    this.pre_instHeight = o["pre_instHeight"];	    
	};		  

	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{	  
	    var idx = [];
	    for (var k in this.visibleLineIndexes)
	        idx.push(parseInt(k));
	        
	    idx.sort();
	    
		propsections.push({
			"title": this.type.name,
			"properties": [{"name": "Offset Y", "value": this.OY},	
			               {"name": "Visible line indexes", "value": JSON.stringify(idx)},		               			               
			               ]
		});
	};
	/**END-PREVIEWONLY**/	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();

	Cnds.prototype.OnLineVisible = function ()
	{
		return true;
	}; 

	Cnds.prototype.OnLineInvisible = function ()
	{
		return true;
	};

	Cnds.prototype.ForEachLine = function (start, end)
	{
		return this.for_each_line(start, end);
	};	

	Cnds.prototype.ForEachVisibleLine = function ()
	{
		return this.for_each_line(this.visible_start, this.visible_end);
	};	

	Cnds.prototype.ForEachMatchedLine = function (k_, cmp, v_)
	{
        var self = this;
        var filter_fn = function (idx)
        {
            var d = self.lines_mgr.GetCustomData(idx, k_);
            if (d == null)
                return false;
                
    		return cr.do_cmp(d, cmp, v_);
        }
		return this.for_each_line(null, null, filter_fn);
	};	
    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();

    Acts.prototype.SetOY = function (oy)
	{
	    this.set_OY(oy);
	};	
    Acts.prototype.AddOY = function (dy)
	{
	    this.set_OY(this.OY + dy);
	};		
    Acts.prototype.PinInstToLine = function (objs)
	{
        if ((!objs) || (this.exp_LineIndex == -1))
            return;
        
		var insts = objs.getCurrentSol().getObjects();
		var i, cnt=insts.length;
        for (i=0; i<cnt; i++)  
        {      
	        this.lines_mgr.AddInstToLine(this.exp_LineIndex, insts[i]);
	    }        
	};
    Acts.prototype.UnPinInst = function (objs)
	{
        if (!objs)
            return;
            
	    if (this.visible_start !== null)
	    {
		    var insts = objs.getCurrentSol().getObjects();
	        var i, j, cnt=insts.length, uid;
			for (i=0; i<cnt; i++)  
			{
			    uid = insts[i].uid;
	            for(j=this.visible_start; j<=this.visible_end; j++)
	                this.lines_mgr.RemoveInstFromLine(j, uid)
		    }
	    }  
	};    
    
    Acts.prototype.SetLinesCount = function (cnt)
	{
	    this.set_lines_count(cnt);
	};
    
    Acts.prototype.SetOYToLineIndex = function (idx)
	{
	    this.set_OY( this.get_tlY(idx) );
	};	
    
    Acts.prototype.SetOYByPercentage = function (percentage)
	{
		var last_line_index = this.get_page_index(-1);
        var p1 = (last_line_index * this.default_lineHeight)*percentage;
        this.set_OY( -p1 );
	};			
    Acts.prototype.SetValue = function (line_index, key_, value_)
	{
	    this.lines_mgr.SetCustomData(line_index, key_, value_);
	};	
    Acts.prototype.CleanKeyInAllLine = function (key_)
	{
	    this.lines_mgr.SetCustomData(null, key_, null);
	};		
    Acts.prototype.InsertNewLines = function (idx, cnt)
	{
	    this.insert_lines(idx, cnt);
	};
	
    Acts.prototype.RemoveLines = function (idx, cnt)
	{
	    this.remove_lines(idx, cnt);
	};	
	
    Acts.prototype.InsertLines = function (idx, content)
	{
	    this.insert_lines(idx, content);
	};

    Acts.prototype.PushNewLines = function (where, cnt)
	{
	    var idx = (where==1)? 0: this.lines_mgr.GetLinesCount();
	    this.insert_lines(idx, cnt);
	};	
	
    Acts.prototype.PushLines = function (where, content)
	{
	    var idx = (where==1)? 0: this.lines_mgr.GetLinesCount();
	    this.insert_lines(idx, content);
	};	
	
    Acts.prototype.SetLineHeight = function (height)
	{
	    if (height <= 0)
		    return;
        var is_changed = (this.default_lineHeight != height);        
	    this.default_lineHeight = height;        
        this.update_flag = this.update_flag || is_changed;
	};	
	
    Acts.prototype.SetLineOffsetY = function (line_index, offsety)
	{
        var line = this.lines_mgr.GetLine(line_index);
        if (!line)
            return;
        var is_changed = (line.offsety != offsety);        
	    line.offsety = offsety;        
        this.update_flag = this.update_flag || is_changed;
	};	
	
    Acts.prototype.RefreshVisibleLines = function ()
	{
        this.update(true);
	};			
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
    Exps.prototype.LineIndex = function (ret)
	{
		ret.set_int(this.exp_LineIndex);
	};	

    Exps.prototype.LineTLX = function (ret)
	{
		ret.set_float(this.exp_LineTLX);
	};	
    Exps.prototype.LineTLY = function (ret)
	{
		ret.set_float(this.exp_LineTLY);
	};
	
    Exps.prototype.UID2LineIndex = function (ret, uid)
	{   
	    var idx;
	    if (this.visible_start !== null)
	    {
	        var i;
	        for(i=this.visible_start; i<=this.visible_end; i++)
	        {
	            if (this.lines_mgr.LineHasInst(i, uid))
	            {
	                idx = i;
	                break;
	            }
	        }
	    }
	    if (idx == null)
	        idx = -1;
	        
		ret.set_int(idx);
	};			
	
    Exps.prototype.LineIndex2LineTLY = function (ret, line_index)
	{ 
		ret.set_float(this.get_tlY(line_index));
	};	
	
    Exps.prototype.TotalLinesCount = function (ret)
	{ 
		ret.set_int(this.lines_mgr.GetLinesCount());
	};	
	
    Exps.prototype.DefaultLineHeight = function (ret)
	{ 
		ret.set_float(this.default_lineHeight);
	};			
    
    Exps.prototype.At = function (ret, index_, key_, default_value)
	{
	    var v = this.lines_mgr.GetCustomData(index_, key_);   
        if (v == null)       
            v = default_value || 0;        
            
		ret.set_any(v);
	};
	
    Exps.prototype.LastRemovedLines = function (ret)
	{
		ret.set_string(this.exp_LastRemovedLines);
	};	
	
    Exps.prototype.CustomDataInLines = function (ret, idx, cnt)
	{	    
	    var dataInLines = this.lines_mgr.GetCustomDataInLines(idx, cnt);
		ret.set_string(JSON.stringify( dataInLines ));
	};		
	
}());


(function ()
{
    var ObjCacheKlass = function ()
    {        
        this.lines = [];       
    };
    var ObjCacheKlassProto = ObjCacheKlass.prototype;       
	ObjCacheKlassProto.allocLine = function()
	{
		return (this.lines.length > 0)? this.lines.pop(): null;
	};
	ObjCacheKlassProto.freeLine = function (l)
	{
		this.lines.push(l);
	};	
    var lineCache = new ObjCacheKlass();
        
    // LinesMgr
    cr.plugins_.Rex_ListCtrl.LinesMgrKlass = function(plugin)
    {
        this.plugin = plugin; 
        this.lines = [];      
    };
    var LinesMgrKlassProto = cr.plugins_.Rex_ListCtrl.LinesMgrKlass.prototype;  

	LinesMgrKlassProto.SetLinesCount = function(cnt)
	{
        if (this.lines.length > cnt)
        {
            var i,end=this.lines.length, line;
            for(i=cnt; i<end; i++)
            {
                // release lines
                line = this.lines[i];
                if (!line)
                    continue;
                    
                line.Clean();
                lineCache.freeLine( line );                
            }
            this.lines.length = cnt;            
        }
        else if (this.lines.length < cnt)
        {
            var i,start=this.lines.length;
            this.lines.length = cnt
            for(i=start; i<cnt; i++)
            {
                this.lines[i] = null;
            }
        }
	};
    
    LinesMgrKlassProto.GetLinesCount = function()
    {
        return this.lines.length;
    };

    LinesMgrKlassProto.IsInRange = function(idx)
    {        
        return ((idx >= 0) && (idx < this.lines.length));
    };
         
    LinesMgrKlassProto.GetNewLine = function()
    {        
        // allocate line
        var line = lineCache.allocLine();
        if (line == null)
            line = new LineKlass(this.plugin);
        else
            line.Reset(this.plugin); 
                    
        return line;
    };
                
	LinesMgrKlassProto.GetLine = function(idx, dont_create_line_inst)
	{	   
        if ((idx >= this.lines.length) || (idx < 0))
            return;
            
        if ((this.lines[idx] == null) && (!dont_create_line_inst))
        {
            // TODO: allocate a line
            this.lines[idx] = this.GetNewLine();
        }
        
        return this.lines[idx];
	};
		
	LinesMgrKlassProto.AddInstToLine = function(idx, inst)
	{	   
	    if (inst == null)
	        return;
        var line = this.GetLine(idx);
        if (line == null)
            return;
        
        line.AddInst(inst);
	};
	LinesMgrKlassProto.RemoveInstFromLine = function(idx, uid)
	{	   
	    if (inst == null)
	        return;
        var line = this.GetLine(idx, true);
        if (line == null)
            return;
        
        line.RemoveInst(uid);
	};    
	LinesMgrKlassProto.LineHasInst = function(idx, uid)
	{
        var line = this.GetLine(idx, true);
        if (line == null)
            return;
        
        return line.HasInst(uid);
	};		
				     
	LinesMgrKlassProto.DestroyPinedInsts = function(idx)
	{
	    var line = this.GetLine(idx, true);
        if (line == null)
            return;
        
        line.DestroyPinedInsts();    	    
	};
	
	LinesMgrKlassProto.SetCustomData = function(idx, k, v)
	{
	    if (idx != null)  // set custom data in a line
		{
            var line = this.GetLine(idx);
            if (line == null)
                return;
        
            line.SetCustomData(k, v);
	    }
        else    // set custom data in all lines
		{
		    var i, cnt= this.lines.length, line;
			var is_clean_key = (v == null);
			for(i=0; i<cnt; i++)
			{
			    line = this.GetLine(i, is_clean_key);
				if (line == null)
				    continue;
					
			    line.SetCustomData(k, v);
	        }
		}
	}; 
	
	LinesMgrKlassProto.GetCustomData = function(idx, k)
	{
	    var line = this.GetLine(idx, true);
        if (line == null)
            return;
        
        return line.GetCustomData(k);
	};	
	
	LinesMgrKlassProto.InsertLines = function(idx, content)
	{
	    var cnt = content.length;
	    
	    if (idx < 0)
	        idx = 0;
	    else if (idx > this.lines.length)
	        idx = this.lines.length;
	        	    
	    this.lines.length += cnt;
	    var start = this.lines.length - 1;
	    var end = idx + cnt;
	    var i, insert_line, new_line;
	    for (i=start; i>=idx; i--)
	    {
	        if (i>=end)  // shift line down
	            this.lines[i] = this.lines[i-cnt];
	        else        // empty space
	        {
	            insert_line = content[i-idx];
	            if (insert_line == null)
	                this.lines[i] = null;
	            else
	            {
	                new_line = this.GetNewLine();
	                new_line.SetCustomData( insert_line );
	                this.lines[i] = new_line;
	            }
	        }
	    }
	};	
	
	LinesMgrKlassProto.RemoveLines = function(idx, cnt)
	{
	    var i, line, removed_lines=[];
	    removed_lines.length = cnt;
	    for (i=0; i<cnt; i++)
	    {
	        line = this.GetLine(idx+i, true);
	        if (line)
	        {
	            // save custom data
	            removed_lines[i] = line.GetCustomData();
	            
	            // clean line and recycle
                line.Clean();
                lineCache.freeLine( line );  
	        }
	        else
	        {
	            removed_lines[i] = null;
	        }
	    }
	    var start = idx+cnt;
	    var end = this.lines.length -1;
	    for (i=start; i<=end; i++)
	    {
	        this.lines[i-cnt] = this.lines[i];
	    }
	    this.lines.length -= cnt;
	    
	    return removed_lines;
	};
	
	LinesMgrKlassProto.GetCustomDataInLines = function(idx, cnt)
	{
	    var i, line, dataInLines=[];
	    dataInLines.length = cnt;
	    for (i=0; i<cnt; i++)
	    {
	        line = this.GetLine(idx+i, true);
	        if (line)
	            dataInLines[i] = line.GetCustomData();
	        else
	            dataInLines[i] = null;
	    }

	    return dataInLines;
	};	
			
	LinesMgrKlassProto.saveToJSON = function ()
	{
	    var i,cnt=this.lines.length;
	    var save_lines = [], line, save_line;
	    for(i=0; i<cnt; i++)
	    {
	        line = this.lines[i];
	        save_line = (!line)? null : line.saveToJSON()
	        save_lines.push( save_line );
	    }

		return { "lines": save_lines,		         
		       };
	};
	
	LinesMgrKlassProto.loadFromJSON = function (o)
	{	    
	    var save_lines = o["lines"];
	    var i,cnt=save_lines.length;
	    var save_lines = [], save_line;
	    for(i=0; i<cnt; i++)
	    {
	        save_line = save_lines[i];
	        if (!save_line)
	            this.lines.push( null );
	        else
	        {
	            var new_line = this.GetNewLine();
	            new_line.loadFromJSON(save_line);
	            this.lines.push( new_line );
	        }
	    }
	};	
	// LinesMgr

    // Line
    var LineKlass = function(plugin)
    {     
        this.plugin = plugin; 
        this.pined_insts = {};      
        this.custom_data = {};
        
        this.tlx = 0;
        this.tly = 0;
        this.offsety = 0;           
    };
    var LineKlassProto = LineKlass.prototype;  

	LineKlassProto.Reset = function(plugin)
	{	   
        this.plugin = plugin;         
        this.tlx = 0;
        this.tly = 0;
        this.offsety = 0; 
	};	
    
	LineKlassProto.SetTopLeftPXY = function(tlx, tly)
	{	   
        this.tlx = tlx;
        this.tly = tly;  
	};	
	LineKlassProto.AddInst = function(inst)
	{	   
	    var uid = inst.uid;
	    if (!this.pined_insts.hasOwnProperty(uid))
	        this.pined_insts[uid] = {};
	    
	    var pin_info = this.pined_insts[uid];	   
	    pin_info["dx"] = inst.x - this.tlx;
	    pin_info["dy"] = inst.y - this.tly;	    
	};
	LineKlassProto.RemoveInst = function(uid)
	{	   
	    if (uid != null)
	    {
	        if (!this.pined_insts.hasOwnProperty(uid))
	            return;	    
            delete this.pined_insts[uid];   
        }
        else
        {
            for(var uid in this.pined_insts)
                delete this.pined_insts[uid];
        }
	};
    
	LineKlassProto.HasInst = function(uid)
	{
	    return this.pined_insts.hasOwnProperty(uid);
	};	
	
	LineKlassProto.PinInsts = function()
	{
	    var uid, inst, pin_info, runtime = this.plugin.runtime;	   
	    for (uid in this.pined_insts)	   
	    {
	        inst = runtime.getObjectByUID(uid);
	        if (!inst)
	        {
	            delete this.pined_insts[uid]; 
	            continue;
	        }
	        pin_info = this.pined_insts[uid];
	        pin_inst(inst, pin_info, this.tlx, this.tly);
	    }	
	};	
	
	var pin_inst = function(inst, pin_info, ref_x, ref_y)
	{
        var new_x = ref_x + pin_info["dx"];
        var new_y = ref_y + pin_info["dy"];
        
        if ((new_x != inst.x) || (new_y != inst.y))
        {                
            inst.x = new_x;
            inst.y = new_y;
            inst.set_bbox_changed();			    
        }
	};		
	
	LineKlassProto.DestroyPinedInsts = function()
	{
	    var uid, inst, runtime = this.plugin.runtime;	   
	    for (uid in this.pined_insts)	   
	    {
	        inst = runtime.getObjectByUID(uid);
	        if (!inst)
	            continue;
	            
            Object.getPrototypeOf(inst.type.plugin).acts.Destroy.call(inst);
	        //runtime.DestroyInstance(inst);
	        
	        delete this.pined_insts[uid]; 
	    }	    	    
	};
	
	LineKlassProto.SetCustomData = function(k,v)
	{
	    if (typeof(k) != "object")    // single key
		{
		    if (v != null)
	            this.custom_data[k] = v;	    
		    else if (this.custom_data.hasOwnProperty(k))  // v == null: clean key
			    delete this.custom_data[k];
	    }
	    else                          // copy all
	    {
	        var d = k;
	        for (var k in d)
	            this.custom_data[k] = d[k];
	    }
	};
	
	LineKlassProto.GetCustomData = function(k)
	{
	    if (k != null)    // single key
	        return this.custom_data[k];
	    else             // copy all
	    {
	        var d = {};
	        for (k in this.custom_data)
	            d[k] = this.custom_data[k];
	            	    
	        return d;
	    }
	};	
	
	LineKlassProto.Clean = function()
	{
	    this.DestroyPinedInsts();
	    for(var k in this.custom_data)
	        delete this.custom_data[k];	              	        
	};	
	
	LineKlassProto.saveToJSON = function ()
	{
		return { "insts": this.pined_insts,
		         "data": this.custom_data,
		         "tlx": this.tlx,
		         "tly": this.tly,
		         "offsety": this.offsety,		         
		       };
	};
	
	LineKlassProto.loadFromJSON = function (o)
	{
		this.pined_insts = o["insts"];
		this.custom_data = o["data"];
		this.tlx = o["tlx"];
		this.tly = o["tly"];	
		this.offsety = o["offsety"];
	};	
	// Line
}());