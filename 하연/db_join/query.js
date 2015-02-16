/*
var query = connection.query("SELECT * FROM projectinfo WHERE project_name = ?", pn[0],
	function()
	{
		var query = connection.query("SELECT * FROM projectinfo WHERE project_name = ?", pn[1],
			function()
			{
				var query = connection.query("SELECT * FROM projectinfo WHERE project_name = ?", pn[2],

			}

	}
*/
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
			test: test_
		}
	};
}

function test_ (_id) {
	var query = connection.query("SELECT u.project AS \"name\", p.description AS \"desc\" FROM userproject AS u LEFT JOIN projectinfo AS p ON u.project = p.project_name WHERE u.user_id = ?", _id, function(err,rows) {
		if(err) {
			console.log("test query error");
			console.error(err);
			throw err;
		} else {
			console.log(rows);	//쏵다찍어봣던거 아조~
			if(rows == 0) {
				console.log("Nothing was found.");
			} else {
				/*
				for(idx in rows) {
					if(rows[idx]['user_id'] == _user_id) {

				}
				console.log(rows);
				console.log(rows[0]['user_id']);	//가장 처음 찾아지는 아이디를 찍어라.
				console.log(rows[0]['project']);
				console.log(rows[0]['description']);

				}
				*/
			}
	}
	});
}

//SELECT u.user_id, u.project, p.description  
//	FROM userproject AS u 
//		LEFT JOIN 
//			projectinfo AS p 
//					ON u.project = p.project_name;





//SELECT s.name, s.location_id, l.name AS address, l.distance  
//	FROM student AS s 
//		LEFT JOIN 
//			location AS l 
//					ON s.location_id = l.id;
