
var editor;

var TryFileSystem = {

	_fs: {},

	_opened: 'index.php',

	get: function(path){
		if(typeof TryFileSystem._fs[path] != "undefined"){
			return TryFileSystem._fs[path];
		} else {
			return "";
		}
	},

	set: function(path){
		TryFileSystem._fs[path] = editor.getValue();
	},

	open: function(element, path){
		if(TryFileSystem._opened==path){
			return;
		};
		TryFileSystem.set(TryFileSystem._opened)
		editor.setValue(TryFileSystem.get(path));
		TryFileSystem._opened = path;
		editor.gotoPageDown();
		$('.file-tab').removeClass('active');
		$(element).parents("li").addClass("active");
	},

	save: function(){
		TryFileSystem.set(TryFileSystem._opened);
	}

};

var TryPhalcon = {

	_example: null,

	_step: 1,

	_theme: "chrome",

	showEditorTip: function(){
		$('#editor').popover('show');
		window.setTimeout(TryPhalcon.showBrowserTip, 6000);
	},

	showBrowserTip: function(){
		$('#editor').popover('hide');
		$('#chrome').popover('show');
		window.setTimeout(TryPhalcon.showRunTip, 5000);
	},

	showRunTip: function(){
		$('#chrome').popover('hide');
		$('#index-tab').popover('show');
		window.setTimeout(TryPhalcon.showFileTip, 5000);
	},

	showFileTip: function(){
		$('#pager').show();
		$('#run-code')[0].disabled = false;
		$('#index-tab').popover('hide');
		$('#run-code').popover('show');
		window.setTimeout(function(){TryPhalcon.showStep(1)}, 5000);
	},

	showStep: function(step){
		$('#run-code').popover('hide');
		$('.step').hide();
		$('#step-'+step).fadeIn();
		if(TryPhalcon._example===null){
			TryPhalcon._example = ace.edit("example");
    		TryPhalcon._example.setTheme("ace/theme/"+TryPhalcon._theme);
    		TryPhalcon._example.getSession().setMode("ace/mode/php");
    		TryPhalcon._example.setHighlightActiveLine(false);
    		TryPhalcon._example.setReadOnly(true);
		};
		switch(step){
			case 1:
				$('#example_embed').show();
				TryPhalcon._example.setValue("<?php\n\necho 5*2, \"\\n\";\necho str_shuffle('phalcon');");
				break;
			case 2:
				TryPhalcon._example.setValue("<?php\n\necho Phalcon\\Text::camelize('some_text');");
				break;
			case 3:
				$('#example_embed').show();
				editor.setValue("<?php\n\nclass MyText extends Phalcon\\Text\n{\n\n\tstatic function reverseCamel($str)\n\t{\n\t\t//Camelize the text\n\t\t$camelized = self::camelize($str);\n\n\t\t//Reverse it and return\n\t\treturn strrev($camelized);\n\t}\n\n}\n\n");
				TryPhalcon._example.setValue("echo MyText::reverseCamel(\"crazy_strings\");\n");
				break;
			case 4:
				$('#example_embed').show();
				TryPhalcon._example.setValue("<?php\n\n$request = new Phalcon\\Http\\Request();\necho $request->getUserAgent();");
				editor.setValue("<?php\n\n");
				break;
			case 5:
				$('#example_embed').hide();
				editor.setValue("<?php\n\n//Create a services container\n$di = new Phalcon\\DI();\n\n//Register the \"request\" service\n$di->set('request', function() {\n\treturn new Phalcon\\Http\\Request();\n});\n\n//Obtain the service from the bag\n$request = $di->get('request');\n\n//Show the client IP address\necho 'Your IP is: ', $request->getClientAddress();");
				TryPhalcon._example.setValue("echo 'Your IP address is: ', $request->getClientAddress();");
				break;
			case 6:
				$('#example_embed').show();
				editor.setValue("<?php\n\n//Create a connection\n$db = new Phalcon\\Db\\Adapter\\Pdo\\Sqlite(array(\n\t'dbname' => 'sample.db'\n));\n\n");
				TryPhalcon._example.setValue("//List tables\nprint_r($db->listTables());\n")
				break;
			case 7:
				$('#example_embed').show();
				editor.setValue("<?php\n\n//This class maps the \"robots\" table\nclass Robots extends Phalcon\\Mvc\\Model\n{\n\n}\n\n//Create a service container with most services\n//pre-registered\n$di = new Phalcon\\DI\\FactoryDefault();\n\n//Define the default database connection\n$di->set('db', function () {\n\treturn new Phalcon\\Db\\Adapter\\Pdo\\Sqlite(array(\n\t\t'dbname' => 'sample.db'\n\t));\n});");
				TryPhalcon._example.setValue("foreach (Robots::find() as $robot) {\n\techo $robot->name, \"<br>\";\n}\n");
				break;
			case 8:
				$('#robots-tabs-li').show();
				$('#robots-tab').popover('show');
				TryFileSystem._fs = {
					'models/Robots.php': "<?php\n//This class maps the \"robots\" table\nclass Robots extends Phalcon\\Mvc\\Model\n{\n\n}\n",
					'index.php': "<?php\n\nrequire \"models/Robots.php\";\n\n//Create a service container with most services\n//pre-registered\n$di = new Phalcon\\DI\\FactoryDefault();\n\n//Define the default database connection\n$di->set('db', function () {\n\treturn new Phalcon\\Db\\Adapter\\Pdo\\Sqlite(array(\n\t\t'dbname' => 'sample.db'\n\t));\n});"
				};
				editor.setValue(TryFileSystem._fs['index.php']);
				TryPhalcon._example.setValue("$result = Robots::count(array('group' => 'type'));\nforeach ($result as $row) {\n\techo $row->type, ' ', $row->rowcount, '<br>';\n}");
				window.setTimeout(function(){
					$('#robots-tab').popover('hide');
				}, 4500);
				break;
			case 9:
				$('#url')[0].disabled = true;
				editor.find('require "models/Robots.php";');
				TryPhalcon._example.setValue("$loader = new Phalcon\\Loader();\n$loader->registerDirs(array('models/'))->register();");
				break;
			case 10:
				$('#url')[0].disabled = false;
				TryPhalcon._example.setValue("$app = new Phalcon\\Mvc\\Micro();\n$app->setDI($di);\n$app->get('/say/hello/to/{name}', function ($name){\n\techo \"Hello $name!\";\n});\n$app->handle();\n");
				editor.setValue("<?php\n\n$loader = new Phalcon\\Loader();\n$loader->registerDirs(array('models/'))->register();\n\n//Create a service container with most services\n//pre-registered\n$di = new Phalcon\\DI\\FactoryDefault();\n\n//Define the default database connection\n$di->set('db', function () {\n\treturn new Phalcon\\Db\\Adapter\\Pdo\\Sqlite(array(\n\t\t'dbname' => 'sample.db'\n\t));\n});\n");
				$('#url').popover('show');
				window.setTimeout(function(){
					$('#url').popover('hide');
				}, 4500);
				break;
			case 11:
				$('#example_embed').show();
				TryPhalcon._example.setValue("$app->get('/robots/{type}', function($type) {\n\t$robots = Robots::find(array(\n\t\t'type like :type:',\n\t\t'bind' => array('type' => '%'.$type.'%')\n\t));\n\tforeach ($robots as $robot) {\n\t\techo $robot->name, '<br>';\n\t}\n});\n");
				break;
			case 12:
				$('#example_embed').hide();
				break;
		};
		if(step!=9){
			editor.gotoLine(1);
		};
		TryPhalcon._example.gotoPageUp();
		TryPhalcon.step = step;
		$('#current-step')[0].innerHTML = step;
		if(step==1){
			$('#prev-step').addClass('disabled');
		} else {
			$('#prev-step').removeClass('disabled');
		}
		if(($('.step').length-1)==step){
			$('#next-step').addClass('disabled');
		} else {
			$('#next-step').removeClass('disabled');
		}
	},

	prepareStart: function(){
		window.setTimeout(TryPhalcon.start, 1000);
	},

	start: function(){
		editor.setReadOnly(false);
		TryPhalcon.showEditorTip();
	},

	prevStep: function(){
		if(TryPhalcon.step>1){
			TryPhalcon.showStep(TryPhalcon.step-1);
		}
	},

	nextStep: function(){
		if(TryPhalcon.step<($('.step').length-1)){
			TryPhalcon.showStep(TryPhalcon.step+1);
		}
	},

	success: function(){
		$('#next-pop').popover('show');
		window.setTimeout(function(){
			$('#next-pop').popover('hide');
		}, 4000);
	},

	runCode: function(){
		TryFileSystem.save();
		editor.setReadOnly(true);
		$('#url').addClass('loader');
		$.ajax('execute.php', {
			'type': "POST",
			'data': {
				'url': $('#url')[0].value.replace('http://remotehost', ''),
				'index.php': TryFileSystem.get('index.php'),
				'models/Robots.php': TryFileSystem.get('models/Robots.php')
			}
		}).done(function(content){
			$('#url').removeClass('loader');
			editor.setReadOnly(false);
			$("#chrome")[0].innerHTML = content;

			if(typeof $("#chrome")[0].innerText == "undefined"){
				text = $("#chrome")[0].textContent;
			} else {
				text = $("#chrome")[0].innerText;
			};
			//window.text = $("#chrome")[0];
			switch(TryPhalcon.step){
				case 1:
					if(/[0-9]+[ \t\n]+[a-zA-Z0-9]+/.test(text)){
						TryPhalcon.success();
					}
					break;
				case 2:
					if(editor.getValue().indexOf('camelize')!=-1){
						if(/[A-Z][a-zA-Z0-9]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 3:
					if(editor.getValue().indexOf('::reverseCamel')!=-1){
						if(/[a-z][a-zA-Z0-9]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 4:
					if(editor.getValue().indexOf('getUserAgent')!=-1){
						if(/[a-zA-Z]+\/[0-9]/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 5:
					if(editor.getValue().indexOf('getClientAddress')!=-1){
						if(/Your IP is: .+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 6:
					if(editor.getValue().indexOf('listTables')!=-1){
						if(text.indexOf('[0] => robots')!=-1){
							TryPhalcon.success();
						}
					}
					break;
				case 7:
					if(editor.getValue().indexOf('find')!=-1){
						if(text.indexOf('Robotina')!=-1){
							TryPhalcon.success();
						}
					}
					break;
				case 8:
					if(editor.getValue().indexOf('count')!=-1){
						if(/[a-zA-Z0-9]+[ \t\n]+[0-9]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 9:
					if(editor.getValue().indexOf('Loader')!=-1){
						if(/[a-zA-Z0-9]+[ \t\n]+[0-9]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 10:
					if(editor.getValue().indexOf('Micro')!=-1){
						if(/Hello [a-zA-Z]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
				case 11:
					if(editor.getValue().indexOf('::find')!=-1){
						if(/[a-zA-Z]+/.test(text)){
							TryPhalcon.success();
						}
					}
					break;
			};
		});
	},

	setTheme: function(name){
		if(name=='Sublime'){
			if(TryPhalcon._example!=null){
				TryPhalcon._example.setTheme("ace/theme/monokai");
			};
			editor.setTheme("ace/theme/monokai");
			$(document.body).addClass('sublime');
			TryPhalcon._theme = "monokai"
		} else {
			if(TryPhalcon._example!=null){
				TryPhalcon._example.setTheme("ace/theme/chrome");
			};
			editor.setTheme("ace/theme/chrome");
			$(document.body).removeClass('sublime');
			TryPhalcon._theme = "chrome";
		}

	},

	browse: function(element){
		$('#url')[0].value = element.innerHTML;
		TryPhalcon.runCode();
	},

	play: function(){
		$('#instructions').hide();
		$('#browser').addClass('big');
		$('#url')[0].disabled = false;
		$('#run-code')[0].disabled = false;
		editor.setReadOnly(false);
	}

};

$(document).ready(function(){

	editor = ace.edit("editor");
	editor.setTheme("ace/theme/chrome");
	editor.getSession().setMode("ace/mode/php");
	editor.setReadOnly(true);
	editor.renderer.setHScrollBarAlwaysVisible(false);
	$('#step-count')[0].innerHTML = $('.step').length-1;

	$('#url').bind('keyup', function(event){
		if(event.keyCode==13){
			TryPhalcon.runCode();
		}
	});

	$(document.body).bind('keyup', function(event){
		if(event.keyCode == 13 && event.ctrlKey == true){
			if($('#run-code')[0].disabled===false){
				TryPhalcon.runCode();
			}
			event.stopPropagation();
		}
	});

	if(window.location.toString().indexOf('#')==-1){
		window.location = window.location+'#';
	}
});


!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");