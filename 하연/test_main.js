var git = require('./git_ver4.js');

// git module final check

//**************개발 이슈**************************//
////////0.
// git config 건드리는 부분 추가 및 보완 필요
////////1.
// git.create_new_bare랑 git.our_join 가
// 동시에 수행되면 안됨. 폴더 생성되는 텀이 있어야됨.
// sleep같은거 줘야하나 논의 ()
////////2.
// git.our_commit이랑 git.our_push 가
// 동시에 수행되면 안됨. commit되는 텀이 있어야됨.
// sleep같은거 줘야하나 논의 ()
//*************************************************//

//======================================================0215-0216

// 최초 생성시에는,
// 0_1. 해당 project  폴더 안에 origin 폴더를 생성, origin폴더는 bare repository. (V)
// 0_2. origin을 사용자 이름의 폴더로 clone (V)
//git.create_new_bare('p_name', 'user1'/*, handler*/); 

// 생성되있는 프로젝트에,
// 0_3. 다른사용자도 join (V)
//git.our_join('p_name', 'user2'/*, handler*/);

//********** 
// git.create_new_bare랑 git.our_join 가
// 동시에 수행되면 안됨. 폴더 생성되는 텀이 있어야됨.
// sleep같은거 줘야하나 논의 ()
//**********//

// 1. commit(add+commit)한 다음, (V)
//     --- 커밋 할게 없는데 커밋하면 오류남.(add는 없어도, 그냥 됨.오류는 안남) 주의.
//git.our_commit('p_name','user1','14_1th commit. congratulations!'/*, handler*/);
//git.our_commit('p_name','user2','15th commit. congratulations!'/*, handler*/);
//git.our_commit('p_name','user1','16th commit. congratulations!'/*, handler*/);
///git.our_commit('p_name','user1','17th commit. congratulations!'/*, handler*/);

//********** 
// git.our_commit이랑 git.our_push 가
// 동시에 수행되면 안됨. commit되는 텀이 있어야됨.
// sleep같은거 줘야하나 논의 ()
//**********//


// 2. pull해주고 (X) <-- 이거는 origin에 뭔가 쌓였을 때 해줘야함. 아무것도 없을때하면 에러.
// <Error> fatal: Couldn't find remote ref master
// 2. push해주고 (V) <-- 제일 처음 origin에 아무것도 없는 상태에서는, 일단 뭔가 넣어줘야함.
//git.our_push('p_name','user1'/*, handler*/);

// 3. 그다음 pull 해준다. (V)
git.our_pull('p_name','user2'/*, handler*/);







//======================================================0213-0214

//git.directory_move ('p_name', 'mahabono'/*, handler*/);
//git.our_commit('p_name','mahabono','first commit. congratulations!'/*, */);
//git.our_commit('p_name','mahabono','third commit. congratulations!'/*, */);


// 0. remote repository 추가하고, (V,X) - 필요없음
//git.our_commit_config("https://github.com/p22ju/bonotest.git"/*, handler*/);

// 1. commit(add+commit)한 다음, (V)
//git.our_commit('p_name','mahabono2','12th commit. congratulations!'/*, handler*/);
// 2. pull해주고 (V)
//git.our_pull('p_name','mahabono2'/*, handler*/);

//    사용자가 pull을 해서 local도 최신일 경우에만, 
// 3. push해줘야 겟다.   //************콘솔에 아이디, 비번 넣어주는 부분 수정 요.
//	팀원들이 허락해줘야 push할 수 있도록 하는 부분 논의 ()
//git.our_push('p_name','mahabono2'/*, handler*/);

//디렉토리 문제 생기면 쓸듯한데 안생길듯.
//git.directory_issue();