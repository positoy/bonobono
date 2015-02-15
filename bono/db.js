// 모듈 로딩
var mysql = require('mysql');
var git = require('./git.js');

module.exports = function() {

    connection = mysql.createConnection({
        host : 'localhost',	//**********이부분 체크 (V)
        port : 3306,		//mysql 통신포트
        user : 'root',
        password : 'bonobono',		//멤섹션: bonomaha, 집: mahabono, 창규오빠: bonobono
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
        userinfo: { 	        //사용자 정보 테이블
            login: userinfo_login_,		//로그인
            join: userinfo_join_,	//회원가입   <======= 아이디 중복 확인 추가
            notification: invite_notification_,		        //초대 알람 관리(수락, 거부)
            notification_flag: invite_notification_flag_	//초대 플래그 관리
        },

        userproject: {          //사용자 프로젝트 정보 테이블
            list: userproject_list_,		//참여하고있는 프로젝트 열람
            join: join_project_			//초대에 수락하면 프로젝트에 join
        },

        projectinfo: {                  //프로젝트 정보 테이블
            create: projectinfo_create_		//프로젝트 생성
        },

        invitation: {	                            // 초대 정보 테이블
            invite: invitation_invite_, 		                // 초대정보 추가
            delete: invitation_decline,
            list : invitation_list,
        }
    };
}

/*    userinfo    */
/*************************
 LOGIN
 : 사용자 login 기능
 **************************/
function userinfo_login_ (_id, _pw, login_handler, res) {

    var context = "[/login, DB] : ";

    var query = connection.query("SELECT user_id FROM userinfo WHERE user_id = ? AND pw = ?", [_id,_pw],

        function(err,rows)
        {
            if (err)
            {
                console.log(context, "db error");
                console.error(err);
                return;
            }
            else
            {
                console.log(context, query.sql);

                // id, pw 일치하는 계정이 없으면
                if(rows.length == 0)
                {
                    console.log(context, "login failed")
                    login_handler(false, res);

                // id, pw 일치하는 계정 발견
                }
                else
                {
                    console.log(context, "login successful")
                    login_handler(true, res);
                }
            }
        });
}

/*********************************************
 JOIN
 : 회원가입 기능

 // 동일한 아이디가 존재하는지 확인
 // 존재하지 않으면 userinfo에 새로운 row 추가
 *********************************************/
function userinfo_join_ (_id, _pw, _email, join_handler, res) {

    var context = "[/join, DB]";

    // 동일한 아이디가 이미 존재하는지 확인
    var query = connection.query("SELECT user_id FROM userinfo WHERE user_id = ?", [_id],

        function(err, rows)
        {
            if (err)
            {
                console.log(context, "db error");
                console.error(err);
                return;
            }
            else
            {
                if (rows.length != 0)
                {
                    // 가입하려는 것과 동일한 아이디가 존재
                    console.log(context, "same id exists");
                    join_handler(false, res);
                }
                else
                {
                    // 가입하려는 것과 동일한 아이디가 존재하지 않음
                    // 회원가입
                    var query = connection.query("INSERT INTO userinfo(user_id, pw, email) VALUES(?, ?, ?)", [_id, _pw, _email],

                        function(err, result)
                        {
                            console.log(context, query.sql);

                            if (err)
                            {
                                console.log(context, "db error2");
                                console.log(err);
                                throw err;
                            }
                            else
                            {
                                console.log(context, "join successful");
                                join_handler(true, res);
                            }
                        });
                }
            }
        });
}

/*********************************************************************
 NOTIFICATION
 : 사용자에게 온 초대목록 보내주기

 // userproject의 invite 플래그 조회
 // 플래그가 1이면 invitation에서 초대목록을 받아서 json array로 전송해주기
 *********************************************************************/
//사용자가 받을 초대알람 관리
//사용자가 초대를 수락하면, JOIN <== userproject 테이블에 record 추가
function invite_notification_ (_id) {
    var invite_flag;
    var query = connection.query("SELECT * FROM invitation WHERE invited_user = ?", _id,

        function(err, rows) {
        if(err) {
            console.log("invite_notification_ query error");
            console.error(err);
            throw err;
        } else {
            if(rows.length == 0) {
                console.log(_id + " has no invitations.");
                invite_notification_flag_(_id,0);
            } else {
                console.log(_id + " has " + rows.length + " invitations.");
                invite_notification_flag_(_id,1);
                //사용자 화면에 invitation noti 띄워주기

                /****************
                 초대 수락
                 ****************/
                //↓***********조건문 수정 요함: invite_flag && 사용가 수락버튼 클릭시 조건문 돌게.
                if(invite_flag) {
                    var selected_project = rows[0]['inv_project'];
                    //↑*****선택된 프로젝트로 변수 설정해주는 수정 요함.rows[///이부분 조작해야할듯][]
                    join_(_id, selected_project);
                    invitation_decline(_id, selected_project);
                }
                /****************
                 초대 거부
                 ****************/
                else {
                    var selected_project = rows[0]['inv_project'];
                    invitation_decline(_id, selected_project);
                }


            }
        }
    });
}

/**********************************
 NOTIFICATION_FLAG
 : 사용자 inv_noti_flag 토글 (0, 1)
 **********************************/
function invite_notification_flag_(_id, _change) {

  var context = "[NOTIFLAG, DB] : ";

  var query = connection.query("UPDATE userinfo SET invite_notification = '?' WHERE user_id = ? ", [_change,_id],

      function(err,rows) {

        console.log(context, query.sql);

        if (err)
        {
          console.log(context, "db error");
          console.error(err);
          throw err;
        }
        else
        {
          console.log(context, "flag set to ", _change, "successfully");
        }
      });
    }

/*    userproject    */
/***********************************************************************
 LIST
 : 사용자 project 조회 기능

 // userproject를 조회해서 사용자가 참여중인 프로젝트를 json array로 보내주기
 ***********************************************************************/
function userproject_list_(user_id, project_list_handler, socket) {

  var context = "[/project_list, DB] : ";
  var projectList = [];

  // 참여중인 프로젝트 목록 가져오기
  var query = connection.query("SELECT * FROM userproject WHERE user_id = ?", _id,

    function(err, rows) {

      console.log(context, query.sql);
      if (err)
      {
        console.log(context, "db error");
        console.log(err);
        project_list_handler(projectList, socket);
      }
      else
      {
        for (idx in rows)
          projectList.push(rows[idx]['project']);
          // 이렇게 안하고 통째로 json으로 만들어서 전송할 수도 있을 것
          // 나중에 테스트해보기 JSON.stringify(rows)

        project_list_handler(projectList, socket);
        console.log(context, "project list sent successfully")
      }
    });
}

/*******************************************************************************
 JOIN
 : 초대 수락 => 프로젝트에 참여 기능

 // 시나리오A.  사용자가 원하는 프로젝트명을 직접 입력해서 참여 요청.
 // 시나리오B.  사용자가 초대에 수락해서 프로젝트에 참여.
 //            1. 프로젝트가 존재하는지 검사
 //            2. 사용자의 이메일주소 받아오기
 //            3. REMOTE. 폴더생성, git clone
 //            4. userproject에 프로젝트 추가하기
 //            5. invitation 테이블에서 동일한 이름의 프로젝트 제거하기
 //               (user.invitation.delete_invitation 사용하면 userproject 자동토글
 *******************************************************************************/
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

/*    projectinfo    */
/*********************************************************
 CREATE_PROJECT
 : project 추가 기능

 // 동일한 이름의 프로젝트가 이미 존재하는지 확인
 // 존재하지 않으면 사용자 이메일 얻어오기
 // ORIGIN. 새로운 폴더 생성, git init
 // REMOTE. 새로운 폴더 생성, git clone
 // projectinfo 에 새로운 프로젝트 추가
 // userproject 에 새로운 프로젝트 추가
 // invitation  에 동일 프로젝트에 초대한된 기록이 있으면 모두 제거
 *********************************************************/
function projectinfo_create_ (user_id, project_name, project_desc, project_create_handler, res) {

    var context = "[/project_create, DB]";

    // 1. 동일한 이름의 프로젝트가 이미 존재하는지 확
    var query = connection.query("SELECT * FROM projectinfo WHERE project_name = ?", project_name,

        function(err, rows) {

            if (err)
            {
                console.log(context, "db error");
                console.error(err);
                project_create_handler(false, res);

            }
            else
            {
                if (rows.length != 0)
                {
                    // 동일한 이름의 프로젝트가 존재
                    console.log(context, "same project exists");
                    pcreate_handler(false, res);
                }
                else
                {
                    // 동일한 프로젝트가 존재하지 않으면,
                    // 2. 사용자 이메일 얻어오기
                    var query = connection.query("SELECT email FROM userinfo WHERE user_id=?", user_id,

                        function(err, rows) {

                            if (err)
                            {
                                console.log(context, "db error2");
                                console.error(err);
                                project_create_handler(false, res);
                            }
                            else
                            {
                                if (rows.length == 0)
                                {
                                    // 아이디가 존재하지 않음
                                    console.log(context, "id does not exist");
                                    project_create_handler(false, res);
                                }
                                else
                                {
                                    // 사용자 이메일을 얻어 왔으면,
                                    var user_email = rows[0]['email'];

                                    // 3. ORIGIN. 새로운 폴더 생성, git init
                                    // 4. REMOTE. 새로운 폴더 생성, git clone
                                    git.create(project_name, user_id, user_email, git_create_handler);

                                    // 성공적으로 git 작업을 완료하며,
                                    function git_create_handler()
                                    {
                                        // 5. projectinfo 에 새로운 프로젝트 추가
                                        var query = connection.query("INSERT INTO projectinfo(project_name, description) VALUES(?, ?)", [project_name, project_desc],

                                            function(err, result) {

                                                if (err)
                                                {
                                                    console.log(context, "db error3");
                                                    console.error(err);
                                                    project_create_handler(false, res);
                                                }
                                                else
                                                {
                                                    // 6. userproject에 새로운 프로젝트 추가
                                                    var query = connection.query("INSERT INTO userproject(user_id, project) VALUES(?, ?)", [user_id, project_name],

                                                        function(err, result) {

                                                            console.log(context, query.sql);

                                                            if (err)
                                                            {
                                                                console.log(context, "db error4");
                                                                console.error(err);
                                                                project_create_handler(false, res);
                                                            }
                                                            else
                                                            {
                                                                // 7. invitation에서 동일한 프로젝트 삭
                                                                project_create_handler(true, res);
                                                                console.log(context, "project creation successful");
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

/*    invitation    */
/**********************************************************************************
 INVITE
 : 타 사용자 초대 기능

 // 초대된 사용자가 존재하는 사용자인지 확인
 // 초대하는 프로젝트가 존재하는 프로젝트인지 확인
 // 초대된 사용자가 초대하는 프로젝트에 참여중인지 확인
 // 참여중이지 않으면 invitation 테이블에 새 초대 추가
 // invitation 테이블에 새 row를 추가했다면 userproject 테이블에 invite 플래그 1로 토글
 **********************************************************************************/
//invitation 테이블에 기록 추가
function invitation_invite_ (user_id, inv_id, inv_project, inv_msg, project_invite_handler, res) {

    var context = "[/project_invite, DB] : ";

    // 1. 초대된 사용자가 존재하는 사용자인지 확인
    var query = connection.query("SELECT * FROM userinfo WHERE user_id=?", inv_id,

        function(err, rows) {

            if (err)
            {
                console.log(context, "db error");
                console.log(err)
                throw err;
            }
            else if (rows.length == 0)
            {
                // 아이디가 존재하지 않음
                console.log(context, "id not exist");
                project_invite_handler(false, res);
            }
            else
            {
              // 2. 초대하는 프로젝트가 존재하는 프로젝트인지 확인
              var query = connection.query("SELECT * FROM projectinfo WHERE project_name=?", inv_project,

                function(err, rows) {

                  if (err)
                  {
                    console.log(context, "db error2");
                    console.log(err);
                    throw err;
                  }
                  else if (rows.length == 0)
                  {
                    // 프로젝트가 존재하지 않음
                    console.log(context, "project not exist");
                    project_invite_handler(false, res);
                  }
                  else
                  {
                    // 3. 초대된 사용자가 초대하는 프로젝트에 참여중인지 확인
                    var query = connection.query("SELECT * FROM userproject WHERE user_id=? AND project=?", [inv_id, inv_project],

                      function(err, rows) {

                        if (err)
                        {
                          console.log(context, "db error3");
                          console.log(err);
                          throw err;
                        }
                        else if (rows.length != 0)
                        {
                          // 이미 해당 프로젝트에 사용자가 참여 중
                          console.log(context, "user already joining the project");
                          project_invite_handler(false, res);
                        }
                        else
                        {
                          // 4. 참여중이지 않으면 invitation 테이블에 새 초대 추가
                          var query = connection.query("INSERT INTO invitation(inviting_user, invited_user, inv_project, inv_msg) VALUES (?, ?, ?, ?)", [user_id, inv_id, inv_project, inv_msg],

                            function(err, result) {

                              if (err)
                              {
                                console.log(context, "db error4");
                                console.log(err);
                                project_invite_handler(false, res);
                                throw err;
                              }
                              else
                              {
                                // 5. invitation 테이블에 새 row를 추가했다면 userproject 테이블에 invite 플래그 1로 토글
                                // result.affectedRows == 1
                                invite_notification_flag_(inv_id, 1);
                                project_invite_handler(true, res);
                                console.log(context, "user invitation successful")
                              }
                            });
                          }
                      });
                  }
                });
              }
            });
          }



/************************************************************
 LIST
 : 초대목록 전송

 // invitation 테이블에 모든 초대 목록 전송

 // 결과전송 [list1, list2, ...]
 // list : {pname: project_name, pdesc: project_desc, pmember: null, pdate: null, powner: null}
 ************************************************************/
function invitation_list(user_id, invitelist_request_handler, socket) {

  var context = "[/project_invitelist, DB] : ";
  var query = connection.query('SELECT projectinfo.project_name AS "name", projectinfo.description AS "desc" FROM projectinfo LEFT JOIN userproject on projectinfo.project_name = userproject.project WHERE userproject.user_id = ?', user_id,

    function(err,rows) {

      console.log(context, query.sql);
      if(err)
      {
        console.log(context, "db error");
        console.error(err);
        invitelist_request_handler([], socket);
        throw err;
      }
      else
      {
        console.log(context, "db result", rows);
        invitelist_request_handler(JSON.stringify(rows), socket);
        console.log(context, "invite list sent successfully");
      }
    });
}


/************************************************************
 ACCEPT
 : 초대수락

 // userproject 테이블에 동일한 프로젝트가 존재하지 않으면 project 추가
 // invitation 테이블에서 project_name 일치하는 모든 아이템 삭제
 // invitation 테이블에서 더 이상 초대가 없으면 userproject 테이블의 notification 0으로 토글

 // 결과전송 {msg:"successful" or "failure", reason: "reason"}
 ************************************************************/
function invitation_accept(_invited_id, _invited_project) {


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


/************************************************************
 DECLINE
 : 초대삭제

 // invitation 테이블에서 id, project 일치하는 '모든' 아이템 삭제
 // invitation 테이블에 더 이상 초대가 없으면
 // uerproject 테이블에서 notification 0으로 토글

 // 결과전송 {msg:"successful" or "failure", reason: "reason"}
 ************************************************************/
function invitation_decline(_invited_id, _invited_project) {


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
