﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_gInstGroup = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_gInstGroup.prototype;
		
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
	    this.check_name = "INSTGROUP";
	    this.groups = {};
        this.randomGen = null;
        this.randomGenUid = -1;    // for loading
	    this._cmp_uidA = 0;
	    this._cmp_uidB = 0;
	    this._sort_fn_name = "";	    
	    this._compared_result = 0;
	    this._foreach_item = {};
	    this._foreach_index = {};
	    this._inst_private_group_name = {};
	    
		// Need to know if pinned object gets destroyed
		this.myDestroyCallback = (function (self) {
											return function(inst) {
												self.onInstanceDestroyed(inst);
											};
										})(this);
										
		this.runtime.addDestroyCallback(this.myDestroyCallback); 
		
		
		/**BEGIN-PREVIEWONLY**/
		this.propsections = [];
		/**END-PREVIEWONLY**/	    	    
	};
    
	instanceProto.onDestroy = function ()
	{
        this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};   
    
    instanceProto.onInstanceDestroyed = function(inst)
    {
        // auto remove uid from groups
        var uid = inst.uid;
        var name;
        var groups = this.groups;
        for (name in groups)
            groups[name].RemoveUID(uid);
            
        this._remove_pg(uid);
    };
    
    var _pg_prefix = "@";
    var _pg_postfix = "$";
    var _get_pg_uid = function (name)
    {
        if (name.charAt(0) != _pg_prefix)
            return (-1);
            
        var index = name.indexOf(_pg_postfix);
        if (index == (-1))
            return (-1);
            
        var uid = parseInt(name.substring(1,index));
        return uid;
    };
    
    instanceProto._append_pg = function (name)
    {
        var uid = _get_pg_uid(name);
        if (uid == (-1))
            return;
            
        var name_list = this._inst_private_group_name[uid];
        if (name_list == null)
        {
            name_list = [name];	            
            this._inst_private_group_name[uid] = name_list;
        }
        else
            name_list.push(name);
    };
    
    instanceProto._remove_pg = function (uid)
    {
        var name_list = this._inst_private_group_name[uid];
        if (name_list == null)
            return;

        var list_len = name_list.length;
        var i;
        for (i=0; i<list_len; i++)
            this.DestroyGroup(name_list[i]);          
        delete this._inst_private_group_name[uid];
    };    

	instanceProto.GetGroup = function(name)
	{
	    var group = this.groups[name];
	    if (group == null)
	    {
	        group = new window.RexC2GroupKlass();
	        this.groups[name] = group;
	        this._append_pg(name);
	    }
	    return group;
	};
	
    instanceProto.DestroyGroup = function (name)
	{
	    if (this.groups[name] != null)
	        delete this.groups[name];
	}; 	
	
	instanceProto.all2string = function()
	{
		var strings = {};
	    var name;
	    var groups = this.groups;
	    for (name in groups)
	        strings[name] = groups[name].ToString();
	    return JSON.stringify(strings);
	};
	
    
    instanceProto._sets_operation_target_get = function (group_a, group_b, group_result)
    {
	    if ((group_a != group_result) && (group_b != group_result))
	    {
	        this.GetGroup(group_result).Copy(this.GetGroup(group_a));
            group_a = group_result;   
	    }
	    else if (group_result == group_b)
	    {
	        group_b = group_a;
	        group_a = group_result;
        }
        return {"a":group_a, "b":group_b};
    };
    
    instanceProto._uid2inst = function(uid, objtype)
    {
        var inst = this.runtime.getObjectByUID(uid);
        if (inst == null)
			return null;

        if ((objtype == null) || (inst.type == objtype))
            return inst;        
        else if (objtype.is_family)
        {
            var families = inst.type.families;
            var cnt=families.length, i;
            for (i=0; i<cnt; i++)
            {
                if (objtype == families[i])
                    return inst;
            }
        }
        // objtype mismatch
        return null;
    };
    
    instanceProto._pick_insts = function (name, objtype, is_pop)
	{
        var group = this.GetGroup(name);
        var uid_list = group.GetList();
        var sol = objtype.getCurrentSol();  
        sol.select_all = false;
        sol.instances.length = 0;   // clear contents
        var cnt=uid_list.length, i, inst;
        for(i=0; i<cnt; i++)
        {
            inst = this._uid2inst(uid_list[i], objtype);
            if (inst != null)
                sol.instances.push(inst);
        }
        if (is_pop==1)
        {
            cnt=sol.instances.length;
            for(i=0; i<cnt; i++)
                group.RemoveUID(sol.instances[i].uid);        
        }
        objtype.applySolToContainer(); 
        return  (sol.instances.length >0);       
	};  
    
    instanceProto._pop_one_instance = function (name, index, objtype, is_pop)
	{
        var group = this.GetGroup(name);
        var uid_list = group.GetList();
        var is_valid_index = (uid_list.length > index);   
        var sol = objtype.getCurrentSol();
        sol.select_all = false;            
        sol.instances.length = 0;   // clear contents
        var inst=null;
        if (is_valid_index)
        {
            inst = this._uid2inst(uid_list[index], objtype);
            if (inst != null)
                 sol.instances.push(inst);
        }
        if ((is_pop==1) && (inst != null))
            group.RemoveUID(inst.uid);
        return  (sol.instances.length >0);              
	};	    

    var _thisArg  = null;
	var _sort_fn = function(uid_a, uid_b)
	{   
	    _thisArg._cmp_uidA = parseInt(uid_a);
	    _thisArg._cmp_uidB = parseInt(uid_b);
	    _thisArg.runtime.trigger(cr.plugins_.Rex_gInstGroup.prototype.cnds.OnSortingFn, _thisArg);
	    return _thisArg._compared_result;	    
	};		
	
	instanceProto.saveToJSON = function ()
	{
		var info = {};
	    var name;
	    var groups = this.groups;
	    for (name in groups)
	        info[name] = groups[name].GetList();
        
        var randomGenUid = (this.randomGen != null)? this.randomGen.uid:(-1);
		return { "d": info,
                 "randomuid":randomGenUid};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
        var info = o["d"];
		var name, group;
	    for (name in info)
            this.GetGroup(name).SetByUIDList(info[name]);
            
        this.randomGenUid = o["randomuid"];	
	};
    
	instanceProto.afterLoad = function ()
	{
		if (this.randomGenUid === -1)
			this.randomGen = null;
		else
		{
			this.randomGen = this.runtime.getObjectByUID(this.randomGenUid);
			assert2(this.randomGen, "Instance group: Failed to find random gen object by UID");
		}		
		this.randomGenUid = -1;
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	    this.propsections.length = 0;	
		var groups = this.groups, group_name;
		var uid, uids, inst;
		var types = {}, type_name, s;
	    for (group_name in groups)
	    {
	        // clean types
            for (type_name in types) 
	        {
	            delete types[type_name];
	        }
	        uids = groups[group_name].GetSet();
	        for (uid in uids)
	        {
	            inst = this.runtime.getObjectByUID(uid);
	            if (inst == null)
	                continue;
	            type_name = inst.type.name;
	            if (type_name in types)
	                types[type_name] += 1;
	            else
	                types[type_name] = 1;
	        }
	        s = "";	   
	        for (type_name in types) 	        
	            s += type_name.toString() + ":" + types[type_name].toString() + "  ";
	        this.propsections.push({"name": group_name, "value": s});
	    }
		        	
		propsections.push({
			"title": this.type.name,
			"properties": this.propsections
		});
	};
	/**END-PREVIEWONLY**/	
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds(); 
	  
	Cnds.prototype.OnSortingFn = function (name)
	{
		return (this._sort_fn_name == name);
	};	 
	
	Cnds.prototype.ForEachUID = function (var_name, name)
	{
	    var uids = this.GetGroup(name).GetList();
	    var uids_len = uids.length;
	    var i;
        var current_event = this.runtime.getCurrentEventStack().current_event;		
		for (i=0; i<uids_len; i++)
	    {
	        this._foreach_item[var_name] = uids[i];
	        this._foreach_index[var_name] = i;
		    this.runtime.pushCopySol(current_event.solModifiers);
			current_event.retrigger();
			this.runtime.popSol(current_event.solModifiers);
		}
		
        return false;
	};
	  
	Cnds.prototype.PickInsts = function (name, objtype, is_pop)
	{
        if (!objtype)
            return;	    
		return this._pick_insts(name, objtype, is_pop);   
	};  
	  
	Cnds.prototype.IsInGroup = function (uid, name)
	{
		return this.GetGroup(name).IsInGroup(uid);        
	}; 
	  
	Cnds.prototype.IsEmpty = function (name)
	{
		return (this.GetGroup(name).GetList().length == 0);        
	}; 	
	  
	Cnds.prototype.PopOneInstance = function (name, index, objtype, is_pop)
	{
        if (!objtype)
            return;	    
		return this._pop_one_instance(name, index, objtype, is_pop);     
	};	 
	  
	Cnds.prototype.IsSubset = function (subset_name, main_name)
	{
        var main_group = this.GetGroup(main_name);
        var subset_group = this.GetGroup(subset_name);
		return main_group.IsSubset(subset_group);     
	};			
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts(); 
	
    Acts.prototype.DestroyAll = function ()
	{
	    var name;
	    for (name in this.groups)
	        delete this.groups[name];
	};  	
	
    Acts.prototype.Clean = function (name)
	{
	    this.GetGroup(name).Clean();
	};  	
	
    Acts.prototype.DestroyGroup = function (name)
	{
	    this.DestroyGroup(name);
	}; 	
	
    Acts.prototype.Copy = function (source, target)
	{
        if (source == target)
            return;
	    this.GetGroup(target).Copy(this.GetGroup(source));
	};	
	
    Acts.prototype.String2Group = function (JSON_string, name)
	{
	    this.GetGroup(name).JSONString2Group(JSON_string);
	};		
	
    Acts.prototype.String2All = function (JSON_string)
	{
	    var groups = JSON.parse(JSON_string);
	    var name;
	    for (name in groups)
	        this.GetGroup(name).JSONString2Group(groups[name]);
	};	
	
    Acts.prototype.AddInsts = function (objtype, name)
	{
        if (!objtype)
            return;
             	    
	    var insts = objtype.getCurrentSol().getObjects();
	    var insts_length=insts.length;
	    if (insts_length==1)
	        this.GetGroup(name).AddUID(insts[0].uid);
	    else
	    {
	        var i, uids=[];
            uids.length = insts.length;
            for (i=0; i<insts_length; i++)
                uids[i] = insts[i].uid;
                
            this.GetGroup(name).AddUID(uids);
        }
	};		
	
    Acts.prototype.AddInstByUID = function (uid, name)
	{
	    this.GetGroup(name).AddUID(uid);	    
	};		
	
    Acts.prototype.RemoveInsts = function (objtype, name)
	{
        if (!objtype)
            return;
             	    
	    var insts = objtype.getCurrentSol().getObjects();
	    var insts_length=insts.length;
	    if (insts_length==1)
	        this.GetGroup(name).RemoveUID(insts[0].uid);
	    else
	    {
	        var i, uids=[];
            uids.length = insts.length;
            for (i=0; i<insts_length; i++)
                uids[i] = insts[i].uid;
                
            this.GetGroup(name).RemoveUID(uids);
        }	         
	};		
	
    Acts.prototype.RemoveInst = function (uid, name)
	{
	    this.GetGroup(name).RemoveUID(uid);		    
	};		
	
    Acts.prototype.Union = function (group_a, group_b, group_result)
	{
	    var groups = this._sets_operation_target_get(group_a, group_b, group_result);
	    this.GetGroup(groups["a"]).Union(this.GetGroup(groups["b"]));
	};
	
    Acts.prototype.Complement = function (group_a, group_b, group_result)
	{
	    var groups = this._sets_operation_target_get(group_a, group_b, group_result);
	    this.GetGroup(groups["a"]).Complement(this.GetGroup(groups["b"]));	    
	};	
	
    Acts.prototype.Intersection = function (group_a, group_b, group_result)
	{
	    var groups = this._sets_operation_target_get(group_a, group_b, group_result);	
	    this.GetGroup(groups["a"]).Intersection(this.GetGroup(groups["b"]));	      
	};		
	
    Acts.prototype.Shuffle = function (name)
	{
	    this.GetGroup(name).Shuffle(this.randomGen);
	};	
	
    Acts.prototype.SortByFn = function (name, fn_name)
	{
        _thisArg  = this;
	    this._sort_fn_name = fn_name;
	    this.GetGroup(name).GetList().sort(_sort_fn);
	};		
	
    Acts.prototype.SetCmpResultDirectly = function (result)
	{
	    this._compared_result = result;
	};		
	
    Acts.prototype.SetCmpResultCombo = function (result)
	{
	    this._compared_result = result -1;
	};
	
    Acts.prototype.PickInsts = function (name, objtype, is_pop)
	{
        if (!objtype)
            return;
            	    
	    this._pick_insts(name, objtype, is_pop);
	};
	
    Acts.prototype.SortByUIDInc = function (name)
	{
	    this.GetGroup(name).GetList().sort();
	};	
	
    Acts.prototype.SortByUIDDec = function (name)
	{
	    this.GetGroup(name).GetList().sort().reverse();
	};		
	
    Acts.prototype.Reverse = function (name)
	{
	    this.GetGroup(name).GetList().reverse();
	};
	
    Acts.prototype.Slice = function (source, start, end, target, is_pop)
	{
        var source_group = this.GetGroup(source);
        var target_group = this.GetGroup(target);
	    var _list = source_group.GetList().slice(start, end);
        target_group.SetByUIDList(_list);
        if (is_pop==1)
            source_group.Complement(target_group);
	};	
	
    Acts.prototype.PopInstance = function (name, index, objtype, is_pop)
	{	    
        if (!objtype)
            return;
        this._pop_one_instance(name, index, objtype, is_pop);  
	};		
	
    Acts.prototype.SetRandomGenerator = function (randomGen_objs)
	{
        var randomGen = randomGen_objs.instances[0];
        if (randomGen.check_name == "RANDOM")
            this.randomGen = randomGen;        
        else
            alert ("[Instance group] This object is not a random generator object.");
	};  
    
    Acts.prototype.PushInsts = function (is_front, objtype, name)
	{
        if (!objtype)
            return;
             	    
	    var insts = objtype.getCurrentSol().getObjects();
	    var insts_length=insts.length;
	    if (insts_length==1)
	        this.GetGroup(name).PushUID(is_front, insts[0].uid);
	    else
	    {
	        var i, uids=[];
            uids.length = insts.length;
            for (i=0; i<insts_length; i++)
                uids[i] = insts[i].uid;
                
            this.GetGroup(name).PushUID(uids, is_front);
        }
	};		
	
    Acts.prototype.PushInstByUID = function (is_front, uid, name)
	{
	    this.GetGroup(name).PushUID(uid, is_front);	    
	};	    
	
    Acts.prototype.InsertInsts = function (objtype, name, index)
	{
        if (!objtype)
            return;
             	    
	    var insts = objtype.getCurrentSol().getObjects();
	    var insts_length=insts.length;
	    if (insts_length==1)
	        this.GetGroup(name).InsertUID(insts[0].uid, index);
	    else
	    {
	        var i, uids=[];
            uids.length = insts.length;
            for (i=0; i<insts_length; i++)
                uids[i] = insts[i].uid;
	                      
            this.GetGroup(name).InsertUID(uids, index);
        }
	};		
	
    Acts.prototype.InsertInstByUID = function (uid, name, index)
	{
	    this.GetGroup(name).InsertUID(uid, index);    
	};	
    
    Acts.prototype.CleanAdddInsts = function (objtype, name)
	{
        cr.plugins_.Rex_gInstGroup.prototype.acts.Clean.call(this, name);
        cr.plugins_.Rex_gInstGroup.prototype.acts.AddInsts.call(this, objtype, name);
	};
	
    Acts.prototype.CleanAdddInstByUID = function (uid, name)
	{
        cr.plugins_.Rex_gInstGroup.prototype.acts.Clean.call(this, name);  
        cr.plugins_.Rex_gInstGroup.prototype.acts.AddInstByUID.call(this, uid, name);        
	};    
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
	Exps.prototype.CmpUIDA = function (ret)
	{   
	    ret.set_int(this._cmp_uidA);
	};    
	
	Exps.prototype.CmpUIDB = function (ret)
	{   
	    ret.set_int(this._cmp_uidB);
	};    	
    
	Exps.prototype.InstCnt = function (ret, name)
	{   
	    ret.set_int(this.GetGroup(name).GetList().length);
	};
	
	Exps.prototype.UID2Index = function (ret, name, uid)
	{
	    ret.set_int(this.GetGroup(name).UID2Index(uid));
	};   	
	
	Exps.prototype.Index2UID = function (ret, name, index)
	{
	    ret.set_int(this.GetGroup(name).Index2UID(index));
	}; 
    
	Exps.prototype.Item = function (ret, var_name)
	{   
	    var item = this._foreach_item[var_name];
	    if (item == null)
	        item = (-1);
	    ret.set_int(item);
	};	
    
	Exps.prototype.Index = function (ret, var_name)
	{   
	    var index = this._foreach_index[var_name];
	    if (index == null)
	        index = (-1);	    
	    ret.set_int(index);
	};	  
    
	Exps.prototype.GroupToString = function (ret, name)
	{
	    ret.set_string(this.GetGroup(name).ToString());
	};
    
	Exps.prototype.AllToString = function (ret)
	{
	    ret.set_string(this.all2string());
	};		
    
	Exps.prototype.PrivateGroup = function (ret, uid, name)
	{
	    ret.set_string(_pg_prefix+uid.toString()+_pg_postfix+name);
	};	
    
	Exps.prototype.Pop = function (ret, name, index)
	{
	    var group = this.GetGroup(name);
	    var uid_list = group.GetList();
	    if (index == -1)
	        index = uid_list.length -1;
	    var uid = uid_list[index];
	    if (uid == null)
	        uid = -1;
	    else
	        group.RemoveUID(uid);	
	    ret.set_int(uid);
	};
	  
}());

(function ()
{   
    // general group class
    if (window.RexC2GroupKlass != null)
        return;
        
    var GroupKlass = function()
    {
		this._set = {};
        this._list = [];    
    };
    var GroupKlassProto = GroupKlass.prototype;
    
	GroupKlassProto.Clean = function()
	{
        var key;
        for (key in this._set)
            delete this._set[key];
        this._list.length = 0;
	};
    
	GroupKlassProto.Copy = function(group)
	{
        var key, hash_obj;
        hash_obj = this._set;
        for (key in hash_obj)
            delete this._set[key];
        hash_obj = group._set;
        for (key in hash_obj)
            this._set[key] = hash_obj[key];
		cr.shallowAssignArray(this._list, group._list);
	};   
	
	GroupKlassProto.SetByUIDList = function(uid_list, can_repeat)
	{
	    if (can_repeat)    // special case
	    {
	        cr.shallowAssignArray(this._list, uid_list);
	        var list_len = uid_list.length;
	        var i, key, hash_obj;
            hash_obj = this._set;
            for (key in hash_obj)
                delete this._set[key];
	        for (i=0; i<list_len; i++)
	            this._set[uid_list[i]] = true;	        
	    }
	    else
	    {
	        this.Clean();
	        this.AddUID(uid_list);
	    }
	};
	
	GroupKlassProto.AddUID = function(_uid)  // single number, number list
	{
	    if (typeof(_uid) == "number")    // single number
	    {
	        if (this._set[_uid] == null)    // not in group
	        {
	            this._set[_uid] = true;
	            this._list.push(_uid);      // push back
	        }
            // else ingored 
	    }
	    else                            // uid list
	    {
	        var i, uid, cnt=_uid.length;
	        for (i=0; i<cnt; i++)
	        {
	            uid = _uid[i];
	            if (this._set[uid] == null)    // not in group
	            {
	                this._set[uid] = true;
	                this._list.push(uid);      // push back
	            }
                // else ingored 
	        }
	    }
	};
    
   	GroupKlassProto.PushUID = function(_uid, is_front)  // single number, number list
	{	    
	    
	    if (typeof(_uid) == "number")    // single number
	    {
	        if (this._set[_uid] == null)
	            this._set[_uid] = true;
	        else    // remove existed item in this._list
	            cr.arrayRemove(this._list, this._list.indexOf(_uid));
	            
	        
	        // add uid
	        if (is_front)	            
	            this._list.unshift(_uid);      // push front
	        else
	            this._list.push(_uid);         // push back	        
	    }
	    else                           // uid list, no repeating
	    {
	        var i, uid, cnt=_uid.length;
	        for (i=0; i<cnt; i++)
	        {
	            uid = _uid[i];
	            if (this._set[uid] == null)
	                this._set[uid] = true;
	            else    // remove existed item in this._list
	                cr.arrayRemove(this._list, this._list.indexOf(uid));
	        }
	        
	        // add uid ( no repeating check )
	        if (is_front)	            
	            this._list.unshift.apply(this._list, _uid); // push front
	        else
	            this._list.push.apply(this._list, _uid);    // push back	  
	        
	    }
	};
	
   	GroupKlassProto.InsertUID = function(_uid, index)  // single number, number list
	{	    	        
	    if (typeof(_uid) == "number")    // single number
	    {
	        if (this._set[_uid] == null)
	            this._set[_uid] = true;
	        else    // remove existed item in this._list
	            cr.arrayRemove(this._list, this._list.indexOf(_uid));
	            
	        arrayInsert(this._list, _uid, index)      
	    }
	    else                           // uid list, no repeating
	    {
	        var i, uid, cnt=_uid.length;
	        for (i=0; i<cnt; i++)
	        {
	            uid = _uid[i];
	            if (this._set[uid] == null)
	                this._set[uid] = true;
	            else    // remove existed item in this._list
	                cr.arrayRemove(this._list, this._list.indexOf(uid));
	        }
	        
	        // add uid ( no repeating check )
	        arrayInsert(this._list, _uid, index)     
	        
	    }
	};
		
	GroupKlassProto.RemoveUID = function(_uid)  // single number, number list
	{
	    if (typeof(_uid) == "number")    // single number
	    {
	        if (this._set[_uid] != null)
	        {
	            delete this._set[_uid];
	            cr.arrayRemove(this._list, this._list.indexOf(_uid));     
	        }
	    }
	    else                            // uid list
	    {
	        var i, uid, cnt=_uid.length;
	        for (i=0; i<cnt; i++)
	        {
	            uid = _uid[i];
	            if (this._set[uid] != null)
	            {
	                delete this._set[uid];
	                cr.arrayRemove(this._list, this._list.indexOf(uid));    
	            }
                // else ingored 
	        }
	    }
	};
	
	GroupKlassProto.UID2Index = function(uid)
	{
	    return this._list.indexOf(uid);    
	};
	
	GroupKlassProto.Index2UID = function(index)
	{
        var _list = this._list;
        var uid = (index < _list.length)? _list[index]:(-1);
        return uid;
	};		
		
	GroupKlassProto.Union = function(group)
	{
	    var uids = group._set;
        var uid;        
        for (uid in uids)        
            this.AddUID(parseInt(uid));    
	};	
		
	GroupKlassProto.Complement = function(group)
	{	  
	    this.RemoveUID(group._list);            
	};
		
	GroupKlassProto.Intersection = function(group)
	{	    
	    // copy this._set
	    var uid, hash_uid=this._set;	    
	    var set_copy={};
	    for (uid in hash_uid)
	        set_copy[uid] = true;
	        
	    // clean all
	    this.Clean();
	    
	    // add intersection itme
	    hash_uid = group._set;
	    for (uid in hash_uid)
	    {
	        if (set_copy[uid] != null)
	            this.AddUID(parseInt(uid));
	    }
	};	
    
	GroupKlassProto.IsSubset = function(subset_group)
	{
        var subset_uids = subset_group._set;
        var uid;     
        var is_subset = true;        
        for (uid in subset_uids)        
        {
            if (!(uid in this._set))
            {
                is_subset = false;
                break;
            }
        }
        return is_subset;
	};    
	
	GroupKlassProto.GetSet = function()
	{
	    return this._set;
	};
	
	GroupKlassProto.GetList = function()
	{
	    return this._list;
	};
	
	GroupKlassProto.IsInGroup = function(uid)
	{
	    return (this._set[uid] != null);
	};
		
	GroupKlassProto.ToString = function()
	{
	    return JSON.stringify(this._list);
	};
	
	GroupKlassProto.JSONString2Group = function(JSON_string)
	{
	    this.SetByUIDList(JSON.parse(JSON_string));
	};	
	
	GroupKlassProto.Shuffle = function(random_gen)
	{
	    _shuffle(this._list, random_gen);
	};
	
	var _shuffle = function (arr, random_gen)
	{
        var i = arr.length, j, temp, random_value;
        if ( i == 0 ) return;
        while ( --i ) 
        {
		    random_value = (random_gen == null)?
			               Math.random(): random_gen.random();
            j = Math.floor( random_value * (i+1) );
            temp = arr[i]; 
            arr[i] = arr[j]; 
            arr[j] = temp;
        }
    };	
    
    var arrayInsert = function (arr, _value, index)
    {       
        var arr_len=arr.length;
        if (index > arr_len)
            index = arr_len;
        if (typeof(_value) != "object")
        {
            if (index == 0)
                arr.unshift(_value);
            else if (index == arr_len)
                arr.push(_value);
            else
            {
                var i, last_index=arr.length;
                arr.length += 1;
                for (i=last_index; i>index; i--)
                    arr[i] = arr[i-1];
                arr[index] = _value;
            }
        }
        else
        {
            if (index == 0)
                arr.unshift.apply(arr, _value);
            else if (index == arr_len)
                arr.push.apply(arr, _value);
            else
            {
                var start_index=arr.length-1;
                var end_index=index;
                var cnt=_value.length;   
                arr.length += cnt;
                var i;
                for (i=start_index; i>=end_index; i--)
                    arr[i+cnt] = arr[i];
                for (i=0; i<cnt; i++)
                    arr[i+index] = _value[i];
            }
        }
    };
    
    window.RexC2GroupKlass = GroupKlass;    
}());    
    