//mysql 모듈 로딩

//mysql password : bonobono
var mysql = require('mysql');
var async = require('async');
var git = require('./git.js');

var connection;

module.exports = function() {

	connection = mysql.createConnection({
		host : 'localhost',	//**********이부분 체크
		port : 3306,		//mysql 통신포트
		user : 'root',
		password : 'bonobono',
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
			join_project: join_project_
		}
	};
}

/*************************
 LOGIN
 : 사용자 login 기능
**************************/
function login_ (_id, _pw, login_handler, socket) {
	var query = connection.query("SELECT user_id FROM userinfo WHERE user_id = ? AND pw = ?"
				, [_id,_pw], function(err,rows) {
		if(err) {
			console.log("[login] : DB ERROR");
			console.error(err);
			//throw err;
			return;
		} else {
			console.log("[login] : ", query.sql);

			if(rows.length == 0) {
				console.log("[login] : login failed.")
				login_handler(false, socket);
			} else {
				console.log("[login] : login successful.")
				login_handler(true, socket);
			}
		}
	});
}

/*************************
 CREATE
 : 회원가입 기능
**************************/
function create_ (_id, _pw, _email, join_handler, socket) {

	// 1. check if id is duplicate.

	var query = connection.query("SELECT user_id FROM userinfo WHERE user_id = ?"
				, [_id], function(err,rows) {

					if (err) {
						console.log("[join, " + _id + "] : error");
						console.error(err);
						return;

					} else {
//						console.log("[login] : ", query.sql);

						if (rows.length != 0) {
							console.log("[join, " + _id + "] : error");
							join_handler(false, socket);

						} else {

							var query = connection.query("INSERT INTO userinfo(user_id, pw, email) VALUES(?, ?, ?)"
								, [_id, _pw, _email], function(err, result) {
									if (err) {
										console.error(err);
										throw err;

									} else {
										console.log(query.sql);
										console.log("[join, " + _id + "] : successful");
										join_handler(true, socket);
									}
								});
						}
					}

				});
			}

/*************************
 VIEW
 : 사용자 project 조회 기능
**************************/
function view_ (_id, pview_handler, socket) {

	var projectList = [];
	var query = connection.query("SELECT * FROM userproject WHERE user_id = ?", _id, function(err,rows) {

		if (err) {
    		console.log("[project view] : project list error");
			console.error(err);
			pview_handler(false, socket, null);

			return;
		} else {
			var projectList = [];

			for(idx in rows) {
				projectList.push(rows[idx]['project']);
			}

			console.log("[project view] : project list", projectList);
			pview_handler(true, socket, JSON.stringify(projectList));
		}
	});

	return projectList;
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
function join_project_ (obj, pjoin_handler, socket) {

	// 0. db : 프로젝트가 존재하는지 검사
	// 1. db : 사용자의 이메일주소 받아오기
	// 2. git : 폴더생성 & git clone
	// 3. db : insert into userproject

	// 0. db : 프로젝트가 존재하는지 검사
	var query = connection.query("SELECT project_name FROM projectinfo WHERE project_name=?", obj.project_name,
		function(err, rows) {
			if(err) {
				console.log("[join project] 0.db.project_existence_check.error");
				console.error(err);
				pjoin_handler(false, socket);

			} else {

				if (rows.length == 0)
				{
					console.log("[join project] 0.db.project_existence_check.no_project");
					pjoin_handler(false, socket);

				}
				else
				{
					console.log("[join project] 0.db.project_existence_check.successful");

					// 1. db : 사용자의 이메일주소 받아오기
					var query = connection.query("SELECT email FROM userinfo WHERE user_id=?", obj.user_name,
						function(err, rows) {
							if(err) {
								console.log("[join project] 0.db.get_user_email.error");
								console.error(err);
								pjoin_handler(false, socket);

							} else {
								obj.user_email = rows[0]['email'];
								console.log("[join project] 0.db.get_user_email.successful");

								// 2. git : 폴더생성 & git clone
								git.join(obj.project_name, obj.user_name, obj.user_email, handler);

								function handler()
								{
									// 3. db : insert into userproject
									var query = connection.query("INSERT INTO userproject(user_id, project) VALUES (?, ?)", [obj.user_name, obj.project_name],
										function(err, result) {
											if(err) {
												console.log("[join project] 0.db.insert_userproject.error");
												console.error(err);
												pjoin_handler(false, socket);

											} else {
												console.log("[join project] 0.db.insert_userproject.successful");
												pjoin_handler(true, socket);

											}
									});
								}
							}
						});
					}
				}
			});
		}	


/*************************
 CREATE_PROJECT
 : project 추가 기능
**************************/
function create_project__ (_projname, _desc) {
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

// obj.user_name, obj.project_name, obj.project_desc
function create_project_ (obj, pcreate_handler, socket) {

	// 0. db : check project name duplicate
	var query = connection.query("SELECT * FROM projectinfo WHERE project_name = ?",
		obj.project_name,
		function(err, rows) {

			if (err) {
				console.log("[create project] 0.db.project_name_check.error");
				console.error(err);
				pcreate_handler(false, socket);

			} else {
				if (rows.length != 0)
				{
					// 동일한 이름의 프로젝트가 존재
					console.log("[create project] 0.db.project_name_check.same_name_exist");
					pcreate_handler(false, socket);
				}
				else
				{
					console.log("[create project] 0.db.project_name_check.successful");

					// 1. db : get user email
					var query = connection.query("SELECT email FROM userinfo WHERE user_id=?",
						obj.user_name,
						function(err, rows) {
							if (err) {
								console.log("[create project] 0.db.get_user_email.error");
								console.error(err);
//								pcreate_handler(false, socket);

							} else {
								if (rows.length == 0)
								{
									console.log("[create project] 0.db.get_user_email.not_exist");
									// 아이디가 존재하지 않음
									pcreate_handler(false, socket);
								}
								else
								{
									console.log("[create project] 0.db.get_user_email.successful");
									obj.user_email = rows[0]['email'];

									// 2. git : new project (create origin folder and git init)
									// 3. git : join project (create folder and git clone)
									git.create(obj.project_name, obj.user_name, obj.user_email, handler);

									// 핸들러 추가

									function handler()
									{
										// 4. db : add new project
										var query = connection.query("INSERT INTO projectinfo(project_name, description) VALUES(?, ?)",
											[obj.project_name, obj.project_desc],
											function(err, result) {
												if (err) {
													console.log("[create project] 0.db.isnert_projectinfo.error");
													console.error(err);
													pcreate_handler(false, socket);

												} else {

													console.log("[create project] 0.db.isnert_projectinfo.successful");

													// 5. db : add userproject
													var query = connection.query("INSERT INTO userproject(user_id, project) VALUES(?, ?)",
														[obj.user_name, obj.project_name],
														function(err, result) {
															if (err) {
																console.log("[create project] 0.db.insert_userproject.error");
																console.error(err);
																pcreate_handler(false, socket);

															} else {
																pcreate_handler(true, socket);
																console.log("[create project] all process successful.");

															}
														});
													}
											});
									}
								}
							}
						});
					}
				}
		});
	}
