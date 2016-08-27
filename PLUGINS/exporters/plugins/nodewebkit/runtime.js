// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.NodeWebkit = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var isNWjs = false;
	var path = null;
	var fs = null;
	var gui = null;
	var child_process = null;
	var nw_appfolder = "";
	var nw_userfolder = "";
	var slash = "\\";
	var filelist = [];
	var droppedfile = "";
	var chosenpath = "";
	
	var pluginProto = cr.plugins_.NodeWebkit.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
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

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		isNWjs = this.runtime.isNWjs;
		var self = this;
		
		if (isNWjs)
		{
			path = require("path");
			fs = require("fs");
			child_process = require("child_process");
			if (process["platform"] !== "win32")
				slash = "/";
			nw_appfolder = path["dirname"](process["execPath"]) + slash;
			nw_userfolder = (process["env"]["HOME"] || process["env"]["HOMEPATH"] || process["env"]["USERPROFILE"]) + slash;
			gui = require("nw.gui");
			
			window["ondrop"] = function (e)
			{
				e.preventDefault();

				for (var i = 0; i < e["dataTransfer"]["files"].length; ++i)
				{
					droppedfile = e["dataTransfer"]["files"][i]["path"];
					self.runtime.trigger(cr.plugins_.NodeWebkit.prototype.cnds.OnFileDrop, self);
				}
				return false;
			};
			
			jQuery("#c2nwOpenFileDialog").change(function (e) {
				chosenpath = jQuery(this).val();
				self.runtime.trigger(cr.plugins_.NodeWebkit.prototype.cnds.OnOpenDlg, self);
				
				// reset the chosen file to empty so choosing the same file twice in a row still fires a change
				try {
					document.getElementById("c2nwOpenFileDialog").value = null;
				}
				catch (e) {}
			});
			
			jQuery("#c2nwChooseFolderDialog").change(function (e) {
				chosenpath = jQuery(this).val();
				self.runtime.trigger(cr.plugins_.NodeWebkit.prototype.cnds.OnFolderDlg, self);
				
				try {
					document.getElementById("c2nwChooseFolderDialog").value = null;
				}
				catch (e) {}
			});
			
			jQuery("#c2nwSaveDialog").change(function (e) {
				chosenpath = jQuery(this).val();
				self.runtime.trigger(cr.plugins_.NodeWebkit.prototype.cnds.OnSaveDlg, self);
				
				try {
					document.getElementById("c2nwSaveDialog").value = null;
				}
				catch (e) {}
			});
		}
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "NW.js",
			"properties": [
				{"name": "App folder", "value": nw_appfolder, "readonly": true},
				{"name": "User folder", "value": nw_userfolder, "readonly": true}
			]
		});
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.PathExists = function (path_)
	{
		if (isNWjs)
			return fs["existsSync"](path_);
		else
			return false;
	};
	
	Cnds.prototype.OnFileDrop = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnOpenDlg = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnFolderDlg = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnSaveDlg = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.WriteFile = function (path_, contents_)
	{
		if (!isNWjs)
			return;
		
		try {
			fs["writeFileSync"](path_, contents_, {"encoding": "utf8"});
		}
		catch (e)
		{}
	};
	
	Acts.prototype.RenameFile = function (old_, new_)
	{
		if (!isNWjs)
			return;
		
		try {
			fs["renameSync"](old_, new_);
		}
		catch (e)
		{}
	};
	
	Acts.prototype.DeleteFile = function (path_)
	{
		if (!isNWjs)
			return;
		
		try {
			fs["unlinkSync"](path_);
		}
		catch (e)
		{}
	};
	
	Acts.prototype.CopyFile = function (path_, dest_)
	{
		if (!isNWjs || path_ === dest_)
			return;
		
		try {
			// Copy using binary mode
			var contents = fs["readFileSync"](path_, {"flags": "rb"});
			fs["writeFileSync"](dest_, contents, {"flags": "wb"});
		}
		catch (e)
		{}
	};
	
	Acts.prototype.MoveFile = function (path_, dest_)
	{
		if (!isNWjs || path_ === dest_)
			return;
		
		try {
			// Copy using binary mode
			var contents = fs["readFileSync"](path_, {"flags": "rb"});
			fs["writeFileSync"](dest_, contents, {"flags": "wb"});
			
			// Only delete source if the destination now exists - otherwise if there was an error
			// we might delete the only copy of the file!
			if (fs["existsSync"](dest_))
				fs["unlinkSync"](path_);
		}
		catch (e)
		{}
	};
	
	Acts.prototype.RunFile = function (path_)
	{
		if (!isNWjs)
			return;
		
		child_process["exec"](path_, function() {});
	};
	
	Acts.prototype.OpenBrowser = function (url_)
	{
		if (!isNWjs)
			return;
		
		var opener;
		
		switch (process.platform) {
		case "win32":
			opener = 'start ""';
			break;
		case "darwin":
			opener = 'open';
			break;
		default:
			opener = path["join"](__dirname, "../vendor/xdg-open");
			break;
		}
		
		child_process["exec"](opener + ' "' + url_.replace(/"/, '\\\"') + '"');
	};
	
	Acts.prototype.CreateFolder = function (path_)
	{
		if (!isNWjs)
			return;
		
		try {
			fs["mkdirSync"](path_);
		}
		catch (e)
		{}
	};
	
	Acts.prototype.AppendFile = function (path_, contents_)
	{
		if (!isNWjs)
			return;
		
		try {
			fs["appendFileSync"](path_, contents_, {"encoding": "utf8"});
		}
		catch (e)
		{}
	};
	
	Acts.prototype.ListFiles = function (path_)
	{
		if (!isNWjs)
			return;
		
		try {
			filelist = fs["readdirSync"](path_);
		}
		catch (e)
		{}
		
		if (!filelist)
			filelist = [];
	};
	
	Acts.prototype.ShowOpenDlg = function (accept_)
	{
		if (!isNWjs)
			return;
			
		var dlg = jQuery("#c2nwOpenFileDialog");
		dlg.attr("accept", accept_);
		dlg.trigger("click");
	};
	
	Acts.prototype.ShowFolderDlg = function (accept_)
	{
		if (!isNWjs)
			return;
			
		jQuery("#c2nwChooseFolderDialog").trigger("click");
	};
	
	Acts.prototype.ShowSaveDlg = function (accept_)
	{
		if (!isNWjs)
			return;
		
		var dlg = jQuery("#c2nwSaveDialog");
		dlg.attr("accept", accept_);
		dlg.trigger("click");
	};
	
	Acts.prototype.SetWindowX = function (x_)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["x"] = x_;
	};
	
	Acts.prototype.SetWindowY = function (y_)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["y"] = y_;
	};
	
	Acts.prototype.SetWindowWidth = function (w_)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["width"] = w_;
	};
	
	Acts.prototype.SetWindowHeight = function (h_)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["height"] = h_;
	};
	
	Acts.prototype.SetWindowTitle = function (str)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["title"] = str;
	};
	
	Acts.prototype.WindowMinimize = function ()
	{
		if (!isNWjs)
			return;
		
		// Note: needs 100ms delay to work around some kind of race condition bug in NW.js
		var win = gui["Window"]["get"]();
		
		setTimeout(function () {
			win["minimize"]();
		}, 100);
	};
	
	Acts.prototype.WindowMaximize = function ()
	{
		if (!isNWjs)
			return;
		
		var win = gui["Window"]["get"]();
		
		setTimeout(function () {
			win["maximize"]();
		}, 100);
	};
	
	Acts.prototype.WindowUnmaximize = function ()
	{
		if (!isNWjs)
			return;
		
		var win = gui["Window"]["get"]();
		
		setTimeout(function () {
			win["unmaximize"]();
		}, 100);
	};
	
	Acts.prototype.WindowRestore = function ()
	{
		if (!isNWjs)
			return;
		
		var win = gui["Window"]["get"]();
		
		setTimeout(function () {
			win["restore"]();
		}, 100);
	};
	
	Acts.prototype.WindowRequestAttention = function (request_)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["requestAttention"](request_ === 0);
	};
	
	Acts.prototype.WindowSetMaxSize = function (w, h)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["setMaximumSize"](w, h);
	};
	
	Acts.prototype.WindowSetMinSize = function (w, h)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["setMinimumSize"](w, h);
	};
	
	Acts.prototype.WindowSetResizable = function (x)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["setResizable"](x !== 0);
	};
	
	Acts.prototype.WindowSetAlwaysOnTop = function (x)
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["setAlwaysOnTop"](x !== 0);
	};
	
	Acts.prototype.ShowDevTools = function ()
	{
		if (!isNWjs)
			return;
		
		gui["Window"]["get"]()["showDevTools"]();
	};
	
	Acts.prototype.SetClipboardText = function (str)
	{
		if (!isNWjs)
			return;
		
		gui["Clipboard"]["get"]()["set"](str);
	};
	
	Acts.prototype.ClearClipboard = function ()
	{
		if (!isNWjs)
			return;
		
		gui["Clipboard"]["get"]()["clear"]();
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.AppFolder = function (ret)
	{
		ret.set_string(nw_appfolder);
	};
	
	Exps.prototype.UserFolder = function (ret)
	{
		ret.set_string(nw_userfolder);
	};
	
	Exps.prototype.ReadFile = function (ret, path_)
	{
		if (!isNWjs)
		{
			ret.set_string("");
			return;
		}
		
		var contents = "";
		
		try {
			contents = fs["readFileSync"](path_, {"encoding": "utf8"});
		}
		catch (e) {}
		
		ret.set_string(contents);
	};
	
	Exps.prototype.FileSize = function (ret, path_)
	{
		if (!isNWjs)
		{
			ret.set_int(0);
			return;
		}
		
		var size = 0;
		
		try {
			var stat = fs["statSync"](path_);
			if (stat)
				size = stat["size"] || 0;
		}
		catch (e) {}
		
		ret.set_int(size);
	};
	
	Exps.prototype.ListCount = function (ret)
	{
		ret.set_int(filelist.length);
	};
	
	Exps.prototype.ListAt = function (ret, index)
	{
		index = Math.floor(index);
		
		if (index < 0 || index >= filelist.length)
			ret.set_string("");
		else
			ret.set_string(filelist[index]);
	};
	
	Exps.prototype.DroppedFile = function (ret)
	{
		ret.set_string(droppedfile);
	};
	
	Exps.prototype.ChosenPath = function (ret)
	{
		ret.set_string(chosenpath);
	};
	
	Exps.prototype.WindowX = function (ret)
	{
		ret.set_int(isNWjs ? gui["Window"]["get"]()["x"] : 0);
	};
	
	Exps.prototype.WindowY = function (ret)
	{
		ret.set_int(isNWjs ? gui["Window"]["get"]()["y"] : 0);
	};
	
	Exps.prototype.WindowWidth = function (ret)
	{
		ret.set_int(isNWjs ? gui["Window"]["get"]()["width"] : 0);
	};
	
	Exps.prototype.WindowHeight = function (ret)
	{
		ret.set_int(isNWjs ? gui["Window"]["get"]()["height"] : 0);
	};
	
	Exps.prototype.WindowTitle = function (ret)
	{
		ret.set_string(isNWjs ? (gui["Window"]["get"]()["title"] || "") : 0);
	};
	
	Exps.prototype.ClipboardText = function (ret)
	{
		ret.set_string(isNWjs ? (gui["Clipboard"]["get"]()["get"]() || "") : 0);
	};
	
	pluginProto.exps = new Exps();

}());