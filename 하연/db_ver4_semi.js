//mysql 모듈 로딩
var mysql = require('mysql');

var connection;

module.exports = function() {

	connection = mysql.createConnection({
		host : 'localhost',	//**********이부분 체크 (V)
		port : 3306,		//mysql 통신포트
		user : 'root',
		password : 'bonomaha',		//멤섹션: bonomaha, 집: mahabono, 창규오빠: bonobono
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
		userinfo: { 	//사용자 정보 테이블
			create: create_,	//회원가입   <======= 아이디 중복 확인 추가
			login: login_,		//로그인
			notification: invite_notification_,		//초대 알람 관리(수락, 거부)
			notification_flag: invite_notification_flag_	//초대 플래그 관리
		},

		userproject: {	//사용자 프로젝트 정보 테이블(어떤사용자가 어떤프로젝트에 참여하고있나)
			view: view_,		//참여하고있는 프로젝트 열람
			join: join_			//초대에 수락하면 프로젝트에 join 
		},

		projectinfo: {	//프로젝트 정보 테이블
			create: create_project_		//프로젝트 생성
		},

		invitation: {	//초대 정보 테이블
			invite: invite_, 		// 초대정보 추가
			delete_invitation: delete_invitation_ 
		}
	};
}

/*************************
 CREATE
 : 회원가입 기능 
**************************/
function create_ (_id, _pw, _email) {
	//var query = 
	if(1) {
		var query = connection.query("INSERT INTO userinfo(user_id, pw, email) VALUES(?, ?, ?)"
								, [_id, _pw, _email], function(err, result) {
				if (err) {
					console.log("userinfo.create query error");
					console.error(err);
					throw err;
				} else {
					console.log(query.sql);
					console.log("insert ok");
				}
			});
	} else {
		console.log("아이디 중복: 다른 아이디를 사용하세요");
	}


	
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
			//console.log(rows);		//rows는 값을 JSON 객체로 그대로 가지고있다. JSON.stringify해주면 string으로.
			//console.log(rows.length);	//2개나옴 (있는 개수대로 제대로 나옴. V)
			//console.log(colms);
			//console.log(colms.length);	//column이 머머가 있는지 알랴줌
			
			for(idx in rows) {
				console.log("User's project: "+ rows[idx]['project']);

			}
		}
	});
}

/*************************
 NOTIFICATION_FLAG
 : 사용자 inv_noti_flag 조작 
**************************/
function invite_notification_flag_(_id, _change) {
	var query = connection.query("UPDATE userinfo invite_notification = ? WHERE user_id = ?"
		, [_change,_id], function(err,rows) {
	if(err) {
		console.log("invite_notification_flag query error");
		console.error(err);
		throw err;
	} else {
		console.log(_id + " :userinfo's invite_notification is changed: " + _change);
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
//invitation 테이블에 기록 추가
function invite_ (_inviting_id, _invited_id, _inv_project, _inv_msg) {
	var query = connection.query("INSERT INTO invitation(inviting_user, invited_user, inv_project, inv_msg) VALUES (?, ?, ?, ?)"
		, [_inviting_id, _invited_id, _inv_project, _inv_msg], function(err, rows) {
		if(err) {
			console.log("invite query error");
			console.error(err);
			throw err;
		} else {
			console.log( _inviting_id + " invited " + _invited_id + " in " + _inv_project + " says " + _inv_msg);			
		}
	});
}
//invitation 테이블에서 기록 삭제
function delete_invitation_(_invited_id, _invited_project) {
	var query = connection.query("DELETE FROM invitation WHERE invited_user= ? AND inv_project= ?" 
		, [_invited_id, _invited_project], function(err,rows) {
		if(err) {
			console.log("delete_invitation query error");
			console.error(err);
			throw err;
		} else {
			console.log("delete invitation ok");
		}
	});
}

//사용자가 받을 초대알람 관리
//사용자가 초대를 수락하면, JOIN <== userproject 테이블에 record 추가
function invite_notification_ (_id) {
	var invite_flag;
	var query = connection.query("SELECT * FROM invitation WHERE invited_user = ?", _id, function(err, rows) {
		if(err) {
			console.log("invite_notification_ query error");
			console.error(err);
			throw err;
		} else {
			if(rows.length == 0) {
				console.log(_id + " has no invitations.");
				invite_notification_flag_(_id,0);
				//invite_flag = 0;
				// 여기서 return 해줘버리는 방법있으면 초대 수락,거부 관련 부분 밖으로 뺄수있음.
			} else {
				console.log(_id + " has " + rows.length + " invitations.");
				invite_notification_flag_(_id,1);
				//사용자 화면에 invitation noti 띄워주기
				//invite_flag = 1;

				/****************
				 초대 수락
				 ****************/
				//↓***********조건문 수정 요함: invite_flag && 사용가 수락버튼 클릭시 조건문 돌게.
				if(invite_flag) {	
					var selected_project = rows[0]['inv_project'];  
					//↑*****선택된 프로젝트로 변수 설정해주는 수정 요함.rows[///이부분 조작해야할듯][]
					join_(_id, selected_project);
					delete_invitation_(_id, selected_project);
				}
				/****************
				 초대 거부
				 ****************/
				else {
					var selected_project = rows[0]['inv_project'];
					delete_invitation_(_id, selected_project);
				}	


			}
			/*
			//사용자가 초대를 수락하면, JOIN <== userproject 테이블에 record 추가
			//↓***********조건문 수정 요함: invite_flag && 사용가 수락버튼 클릭시 조건문 돌게.
			if(invite_flag) {	
				var selected_project = rows[0]['inv_project'];  
				//↑*****선택된프로젝트로 변수 설정해주는 수정 요함.rows[///이부분 조작해야할듯][]
				join_(_id, selected_project);
				delete_invitation_(_id, selected_project);
			} else {
				var selected_project = rows[0]['inv_project'];
				delete_invitation_(_id, selected_project);
			}
			*/
		}
	});
	//여기에다가 뭔가 쓸경우 왜 안되는건지 확인 (callback관련동기화 체크)
}

/***********************************
 JOIN
 : 초대 수락 => 프로젝트에 참여 기능 
************************************/
//userproject 테이블에 기록 추가
function join_ (_id, _projname) {
	var query = connection.query("INSERT INTO userproject (user_id, project) VALUES (?, ?)", [_id, _projname], 
		function(err,result) {
		if(err) {
			console.log("join query error");
			console.error(err);
			throw err;
		} else {
			console.log("join ok");
			//notification table 수정 논의 (V:20150209)
		}
	});
}




