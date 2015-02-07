//mysql 모듈 로딩
var mysql = require('mysql');

var connection;

module.exports = function() {

	connection = mysql.createConnection({
		host : 'localhost',	//**********이부분 체크 (V)
		port : 3306,		//mysql 통신포트
		user : 'root',
		password : 'mahabono',
		database : 'mainbono'
	});

	connection.connect(function(err) {
		if (err) {
			console.error('mysql connection error');
			console.error(err);
			throw err;
		} else {
			console.log("연결성공!");
		}
	});

	return {
		user: { 
			create: create_,
			login: login_,
			view: view_,
			create_project: create_project_,
			invite: invite_,
			join: join_  
		}
	};
}

/*************************
 CREATE
 : 회원가입 기능 
**************************/
function create_ (_id, _pw, _email) {
	var query = connection.query("INSERT INTO userinfo(user_id, pw, email) VALUES(?, ?, ?)"
						, [_id, _pw, _email], function(err, result) {
									if (err) {
										console.error(err);
										throw err;
									} else {
										console.log(query.sql);
										console.log("insert ok");
									}
									//res.send(200,'sucess');	//*********이부분 확인 (V)
								});
}

/*************************
 LOGIN
 : 사용자 login 기능 
**************************/
function login_ (_id, _pw) {
	var query = connection.query("SELECT user_id FROM userinfo WHERE user_id = ? AND pw = ?"
				, [_id,_pw], function(err,rows) {
		if(err) {
			console.log("login query error");
			console.error(err);
			//throw err;
			return;
		} else {
			console.log("LOGIN SUCCESS -------- 1. query ok");
			console.log(query.sql);
			if(rows == 0) {
				console.log("Nothing was found.");
			} else {
				console.log("LOGIN SUCCESS -------- 2. found id");
				console.log(rows);
				console.log(rows[0]['user_id']);	//가장 처음 찾아지는 아이디를 찍어라.
			}
		}
	});
}

/*************************
 VIEW
 : 사용자 project 조회 기능 
**************************/
function view_ (_id) {
	var query = connection.query("SELECT * FROM userproject WHERE user_id = ?", _id, function(err,rows) {
		if(err) {
			console.log("view query error");
			console.error(err);
			//throw err;
			return;
		} else {
			for(idx in rows) {
				console.log("User's project: "+ rows[idx]['project']);
			}
		}
	});
}

/*************************
 CREATE_PROJECT
 : project 추가 기능 
**************************/
function create_project_ (_projname, _desc) {
	var query = connection.query("INSERT INTO projectinfo(project_name, description) VALUES(?, ?)"
						, [_projname, _desc], function(err, result) {
		if (err) {
			console.log("create_project query error");
			console.error(err);
			throw err;
		} else {
			console.log("project insert ok");
		}
	});
}

/*************************
 INVITE
 : 타 사용자 초대 기능 
**************************/
function invite_ (_inviting_id, _invited_id, _inv_project, _inv_msg) {
	var query = connection.query("INSERT INTO invitation(inviting_user, invited_user, inv_project, inv_msg) VALUES (?, ?, ?, ?)"
		, [_inviting_id, _invited_id, _inv_project, _inv_msg], function(err, rows) {
		if(err) {
			console.log("invite query error");
			console.error(err);
			throw err;
		} else {
			console.log( _inviting_id + " invited " + _invited_id + " in " + _inv_project + " says " + _inv_msg);
			//사용자가 초대를 수락하면,
			//JOIN <== userproject 테이블에 record 추가
		}
	});
}

/***********************************
 JOIN
 : 초대 수락 => 프로젝트에 참여 기능 
************************************/
function join_ (_id, _projname) {
	var query = connection.query("INSERT INTO userproject (user_id, project) VALUES (?, ?)", [_id, _projname], 
		function(err,result) {
		if(err) {
			console.log("join query error");
			console.error(err);
			throw err;
		} else {
			console.log("join ok");
			//notification table 수정 필요
		}
	});
}
