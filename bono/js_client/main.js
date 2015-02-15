// global variables
var isShownBtmMenu = false;			// boolean for bottom menu
// var tree_root = "/home/positoy/Documents/bono/";
var tree_root = "";

var user_id = "";
var currentProject = "";
var fileTreePath = "";

function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function() {

	// Ace Editor Object
	var editor;
	var prv_contents;
	var file_cnt = 0;

	// flag : is selected fileTree or top bar?
	function make_editor(data, file, flag){
		editor = null;
		ace.require("ace/ext/language_tools");
		// create Ace Editor
		editor = ace.edit("right_editor");
		// settings for Ace Editor
		editor.setOptions({
			enableBasicAutocompletion : true,
			enableSnippets : true,
			enableLiveAutocompletion : false
		});
		editor.setTheme('ace/theme/tomorrow_night_eighties');
		editor.setShowPrintMargin(false);
		editor.getSession().setMode("ace/mode/java");
		document.getElementById("right_editor").style.fontSize = "15px";
		editor.commands.addCommand({
			name : 'save',
			bindKey : {
				win : 'Ctrl-S',
				mac : 'Command-S'
			},
			exec : function(editor) {
				var cur_contents = editor.getValue();
				if (prv_contents == cur_contents)
					alert("Nothing Changed");
				else {
					prv_contents = cur_contents;
					$.post('/file_save', {
						fileName : file,
						contents : editor.getValue()
					}, function() {
						alert("Save Complete!");
					});
				}
			},
			readOnly : false
		});
		// Change Values when choosing other file
		prv_contents = data;
		editor.setValue(prv_contents, 1);

		if(flag){
			// Make right_topbar li
			if(file_cnt > 0){
				var pre_sel = $("#right_topbar_sortable").children(".file_selected");
				//alert($(pre_sel).children("a").text());
				$(pre_sel).removeClass("file_selected");
				$(pre_sel).addClass("file_notSelected");
			}

			var filePathArr = file.split('/');
			var isOpened = false;
			var li_index;

			$("#right_topbar_sortable > li").each(function(index){
				//console.log(filePathArr[filePathArr.length - 1] + "/" + $(this).text().slice(1, $(this).text().length));
				if(filePathArr[filePathArr.length - 1] == $(this).text().slice(1, $(this).text().length)){
					isOpened = true;
					li_index = index;
				}
			});

			if(!isOpened){
				$("#right_topbar_sortable").append('<li class="file_selected"><span></span>&nbsp;<a data-path="'+ file +'">'+ filePathArr[filePathArr.length - 1] +'</a></li>');
				file_cnt++;
			}else{
				$("#right_topbar_sortable > li:eq("+ li_index +")").removeClass("file_notSelected");
				$("#right_topbar_sortable > li:eq("+ li_index +")").addClass("file_selected");
			}
		}
	}

	// Using jQuery File Tree - fileTree({root : root dir, script : serverside file}, callback func when chosing file})
	function make_fileTree(folder_path){
		$('#left_tree').fileTree({root : folder_path, script : 'req_filetree'}, function(file) {
		// When file opening...send data to server with 'post'
		console.log("of1")
		$.post('openFile', {path : file}, function(data) {
			make_editor(data, file, 1);
			});
		});
	}

	// Draggable settings...
	$("#left_drag").css("left", "288px");
	$("#left_drag").draggable({
		axis : "x",
		drag : function(event, ui) {
			$("#left").width(ui.position.left + 12);
			$("#right").css('margin-left', ui.position.left + 12 + "px");
		}
	});

	// Sortable settings...
	$("#right_topbar_sortable").on("click", "span", function(){
		$(this).parent().remove();
		if(file_cnt > 0){
			file_cnt--;
			prv_contents = "";
			editor.setValue(prv_contents, 0);
		}
	});

	$("#right_topbar_sortable").on("click", "li", function(e){

		//var temp = $(e.target).children("a").text();
		//var fullPath = tree_root.concat(temp);
		var file_path = $(e.target).children("a").attr("data-path");

		var pre_sel = $("#right_topbar_sortable").children(".file_selected");
		$(pre_sel).removeClass("file_selected");
		$(pre_sel).addClass("file_notSelected");

		$(e.target).removeClass("file_notSelected");
		$(e.target).addClass("file_selected");

		$.post('openFile', {path : file_path}, function(data){
			make_editor(data, file_path, 0);
		});
	});

	$("#right_topbar_sortable").sortable({
		axis : "x"
	});
	$("#right_topbar_sortable").disableSelection();
	$("#li_dummy").remove();

	// Bottom Menu
	$("#left_bottom_menu").click(function(){
		if(isShownBtmMenu == false){
			$("#btm_menu").animate({top : "90%"}, {duration: 1000, easing: 'easeInOutBack'});
			isShownBtmMenu = true;
		}

		else{
			$("#btm_menu").animate({top : "130%"}, {duration: 1000, easing: 'easeInOutBack'});
			isShownBtmMenu = false;
		}
	});

	// Bottom Menu - Select Project
	$("#btm_menu_sel_project").click(function(){
		$("#btm_menu").animate({top : "130%"}, {duration: 1000, easing: 'easeInOutBack'});
		isShownBtmMenu = false;

		$.get("/select_project?id=" + getParameterByName('id'), function(data, status){

			if (data != null){
				var temp = "<br>";
				for(var i in data){
					temp += "<a>" + data[i] + "</a><br><br>";
				}
				$("#dialog_select_project_proj").html(temp);
			}
			$("#dialog_select_project").dialog({
				dialogClass : "bottom_dialog",
				modal : true,
				resizable : true,
				width : 800,
				height : 770,
				show : {
					effect : "fade",
					duration : 500
				},
				hide : {
					effect : "fade",
					duration : 500
				},
				beforeClose : function() {
					$("#dialog_select_project_info_contents").html("");
					$("#dialog_selected_project").val("");
				}
			});
		});
	});

	$("#dialog_select_project_proj").scroll();

	// project 리스트 항목에서 프로젝트 선택했을 때 오른쪽에 정보 나오기
	$("#dialog_select_project_proj").on("click", "a", function(){
		var proj_name = $(this).text();

		$("#dialog_selected_project").val(proj_name);


		// 서버에서 프로젝트 정보 받기
		$.get("/project_info?project=" + proj_name, function(data, status){

			// 과연 get 메세지는 객체를 수신할 수 있을 것인가?!
			console.log(data);
			if (data != null){
				// 프로젝트 정보 붙여주기
				$("#dialog_select_project_info_contents").html("<p>Project Name : " + data.name + "</p><p>Description : " + data.desc + "</p><p>Project Owner : " + data.owner + "</p><p>Date : " + data.date + "</p><p>Members : " + data.member + "</p>");
			}
		});
	});

	// 프로젝트 불러오기
	$("#dialog_select_project_select").click(function() {
		var target = $("#dialog_selected_project").val();

		if (target) {
			currentProject = target;
			user_id = getParameterByName('id');
			fileTreePath = currentProject + "/_" + user_id + "/";
			console.log(fileTreePath);

			make_fileTree(fileTreePath);
			$("#dialog_select_project").dialog("close");
		} else {
			alert("Please Select a Project to open..");
		}
	});

	// Context Menu
	$(function(){
		$.contextMenu({
			selector: "#left_tree",
			items: {
			          "edit": {name: "Edit", icon: "edit", callback: function(){
			         	alert("Edit Clicked");
			}},
			"cut": {name: "Cut", icon: "cut"},
			"copy": {name: "Copy", icon: "copy"},
			"paste": {name: "Paste", icon: "paste"},
			"delete": {name: "Delete", icon: "delete"},
			"sep1": "---------",
			"quit": {name: "Quit", icon: "quit"}
	        }
		});
	});

});
