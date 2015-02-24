var gitTree = require('./git_log.js')();

function draw_handler(_finalObject) {/*, res*/
	var log_diff_cnt = 0;
	var origin_pos = _finalObject.origin_position;
	var my_pos = _finalObject. my_position;
	var res_html = "";
	var drawTreeArray = [];
	var arr_length = drawTreeArray.length - 1;
	
	console.log("draw_handler======================");
	//console.log(typeof(_finalObject));	//object
	console.log(_finalObject);
	console.log("origin:" + _finalObject.originLogTreeArray.length);
	console.log("user:" + _finalObject.userLogTreeArray.length);


	if(_finalObject.originLogTreeArray.length <= _finalObject.userLogTreeArray.length) 
	{	
		drawTreeArray = _finalObject.userLogTreeArray;
	}
	else
	{
		drawTreeArray = _finalObject.originLogTreeArray;
	}
	console.log("drawTree:" + drawTreeArray.length);
	console.log(drawTreeArray);


	//git log가 존재 안하면
	if(_finalObject.origin_no_commits_flag || _finalObject.user__no_commits_flag) 
	{
		if(_finalObject.origin_no_commits_flag) 
		{
			//console.log("origin no commit");
			//***************************
			//origin에 git log아무것도 없을 때의 동작
			//***************************
		}

		if(_finalObject.user_no_commits_flag) 
		{
			//console.log(_finalObject.my_name + " no commit");
			//***************************
			//_user_name folder에 git log아무것도 없을 때의 동작
			//***************************
		}
		
	}
	//git log가 존재하면
	else
	{	
		
		//_finalObject.originLogTreeArray 로 되어있는 부분 수정 필요
		//log_diff_cnt 동작  -- 일단 이건 무시함......
		for(idx in _finalObject.originLogTreeArray)
		{
			if(_finalObject.originLogTreeArray[idx].commit_hash !== _finalObject.my_position) 
			{
				log_diff_cnt++;
			}	
			else
			{
				break;
			}
		}		
		
		for(var i in _drawTreeArray){
			var com_msg = drawTreeArray[i].commit_msg;
			if(com_msg.length > 30){
				var temp = com_msg.slice(0, 30);
				com_msg = temp.concat("...");
			}
			if(origin_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_origin" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '"></div>';
			}else if(my_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_user" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '"></div>';
			}else if(origin_pos === drawTreeArray[i].commit_hash && my_pos === drawTreeArray[i].commit_hash){
				res_html += '<div class="git_tree_node node_origin_user" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '"></div>';
			}else{
				res_html += '<div class="git_tree_node node_normal" data-hash="' 
						  + drawTreeArray[i].commit_hash + '" data-name="' 
						  + drawTreeArray[i].committer_name + '" data-date="' 
						  + drawTreeArray[i].commit_date + '" data-msg="' 
						  + com_msg + '"></div>';
			}
			if(i != arr_length)
				res_html += "<div class='git_tree_edge'></div>";
		}
		
		console.log("&&&&&&&&&&&&&&&&&&&&&&&&&res_html = " +res_html);
	}
	//res.send(res_html);


}
gitTree.logTree('p_name', 'm', draw_handler/*, res*/);