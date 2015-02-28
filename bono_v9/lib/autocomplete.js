//////////////////////////////////////////////////////////////////////////////////////////
//
// 이 코드는 node.js 서버에게 {클래스명} 혹은 {클래스명.메소드명의일부}를 전달하고
//
// socket.io를 통해 전달되는 클래스의 메소드 목록을 출력합니다.
//
// ac (auto complete)
// ac.parseImports(code)			- imports 분석
// ac.getClass(code, current_line)	- 현재 커서가 있는 변수의 클래스 검색
// ac.requestMethods(className)		- 서버에 클래스명 전송 
// ac.nameStarts					- 커서가 {클래스명.}에 있다면 null, 아니라면 메소드의 시작이름
//
//////////////////////////////////////////////////////////////////////////////////////////


var socket = io();

var ac = {
    DATA: null,
    packages: [],
    parseImports: null,
    getClass: null,
    requestMethods: null,   
    nameStarts: null,
    list: null,
    cursor: null,
};

ac.DATA = null;                      	 // android sdk 클래스목록
ac.packages = [];                    	 // 코드에 포함된 패키지 목록
ac.parseImports = function(code) {       // 코드에 포함된 imports들을 ac.packages에 넣음
    
    var init_pos, end_pos;

    while (true)
    {
        init_pos = code.search("import");
     
        if (init_pos == -1)
        {
            break;
        }
        else
        {
            init_pos = init_pos + 6;
            code = code.substr(init_pos);
            
            end_pos = code.search(';');
            this.packages.push(code.substr(0, end_pos).trim());
            
            code = code.substr(end_pos + 1);
        }
    }
    console.log("imported packages : ", this.packages);
};

// 현재 커서가 위치한 라인에 해당하는 클래스를 구함
ac.getClass = function(code, current_line) {
    
    var split_dot = current_line.split('.');
    var split_space = split_dot[split_dot.length - 2].split(' ');

     // 메소드명을 전혀 작성하지 않았을 때,
    console.log(this)
    if (current_line.charAt(current_line.length - 1) == '.')
	    this.nameStarts = null;
    else
    	this.nameStarts = split_dot[split_dot.length - 1];
    
    console.log("THIS", this.nameStarts)
    console.log("AC", ac.nameStarts)
    // 앞에 불필요한 것 지우기 ex) fucntion(variable.
    var split_left = split_space[split_space.length - 1].split('(');
    lastItem = split_left[split_left.length -1].trim();

    console.log("lastItem", lastItem);
    
    var right_border = code.search(' ' + lastItem + ';');
    var code_arr = code.substr(0, right_border).split(' ');
    
    for (var i=code_arr.length-1; i>=0; i--)
    {
    	if (code_arr[i] != "")
    	{
    		console.log("found the class! : ", code_arr[i]);
    		return code_arr[i];
		}
    }
}


ac.requestMethods = function(className) {
    
    // 레퍼런스 주소로 서버에 메소드 목록 요청하기.
    for (var i=0; i<ac.DATA.length; i++)
    {
        var arr = ac.DATA[i].label.split('.');
        var target = arr[arr.length-1];

        if(className == target)
        {
            socket.emit("autocomplete", ac.DATA[i].link);
            console.log("methods request has been sent : ", ac.DATA[i].link);
            break;
        }
    }
}
