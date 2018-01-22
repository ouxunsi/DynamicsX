// JavaScript Document
var childCreate=false; 
var intFlag = 0;
var keyFlag = 0;
function Offset(e) 
//取标签的绝对位置 
{ 
	var t = e.offsetTop; 
	var l = e.offsetLeft; 
	var w = e.offsetWidth; 
	var h = e.offsetHeight-2; 
	
	while(e=e.offsetParent) 
	{ 
	t+=e.offsetTop; 
	l+=e.offsetLeft; 
	} 
	return { 
	top : t, 
	left : l, 
	width : w, 
	height : h 
	} 
} 

function loadSelect(obj,bg_color){
	//第一步：取得Select所在的位置 
	var offset=Offset(obj);
	
	//第二步：将真的select隐藏 
	obj.style.display="none"; 
	
	//第三步：虚拟一个div出来代替select 
	var iDiv = document.createElement("div"); 
	iDiv.id="selectof" + obj.name; 
	//iDiv.style.position = "absolute";
	//iDiv.style.top=offset.top + "px"; 
	//iDiv.style.left=offset.left + "px";
	iDiv.className= "selectbox";
	
	document.getElementById("select_" + obj.name).appendChild(iDiv); 
	
	//第四步：将select中默认的选项显示出来 
	var tValue=obj.options[obj.selectedIndex].innerHTML; 
	iDiv.innerHTML=tValue; 
	document.getElementById("selectof" + obj.name).innerHTML=tValue;
	
	 	document.onclick = function(evt){
		var evt = evt || window.event; 
		var target = evt.target || window.event.srcElement;
		var select = document.getElementsByTagName('select');
		if(target.id.indexOf("selectof")<0){
		  for (var i=0; i<select.length; i++) {
		if(!document.getElementById("selectchild" + select[i].name)) continue;
		document.getElementById("selectchild" + select[i].name).style.display="none";
		childCreate=false;
		  }
		   }
		}
		
	//第五步：模拟鼠标点击 
	iDiv.onclick=function(){//鼠标点击 
	//alert("点击开始");
		if (document.getElementById("selectchild" + obj.name)){ 
		//判断是否创建过div 
			if (childCreate){ 
				//判断当前的下拉是不是打开状态，如果是打开的就关闭掉。是关闭的就打开。 
				document.getElementById("selectchild" + obj.name).style.display="none"; 
				childCreate=false; 
			}else{ 
				document.getElementById("selectchild" + obj.name).style.display=""; 
				childCreate=true; 
			} 
		}else{ 
		    //初始一个div放在上一个div下边，当options的替身。 
			var cDiv = document.createElement("div"); 
			cDiv.id="selectchild" + obj.name; 
		//	cDiv.style.position = "absolute"; 
		//	cDiv.style.left=offset.left + "px";
		//	cDiv.style.top=offset.top + 24 + "px";
			cDiv.className= "selectchildbox";
			cDiv.style.background="#ffffff"; 
		
			var uUl = document.createElement("ul"); 
			uUl.id="uUlchild" + obj.name; 
			uUl.style.listStyle="none"; 
			uUl.style.margin="0"; 
			uUl.style.padding="0"; 
			cDiv.appendChild(uUl); 
			document.getElementById("select_" + obj.name).appendChild(cDiv); 
			childCreate=true; 
			for (var i=0;i<obj.options.length;i++){ 
			//将原始的select标签中的options添加到li中 
			var lLi=document.createElement("li"); 
			lLi.id=obj.options[i].value; 
			lLi.innerHTML=obj.options[i].innerHTML; 
			uUl.appendChild(lLi); 
		} 
		
	var liObj=document.getElementById("uUlchild" + obj.name).getElementsByTagName("li"); 
	for(var j=0;j<obj.options.length;j++){ 
	//为li标签添加鼠标事件 
		liObj[j].onmouseover=function(){ 
		this.style.background="#06a3f8"; 
		this.style.color="white"; 
		} 
		liObj[j].onmouseout=function(){ 
		this.style.background=bg_color; 
		this.style.color="black"; 
	} 
	liObj[j].onclick=function(){ 
	//做两件事情，一是将用户选择的保存到原始select标签中，要不做的再好看表单递交后也获取不到select的值了。 
	  obj.options.length=0; 
	  obj.options[0]=new Option(this.innerHTML,this.id); 
	  //同时我们把下拉的关闭掉。 
	  document.getElementById("selectchild" + obj.name).style.display="none"; 
	  childCreate=false; 
	  iDiv.innerHTML=this.innerHTML; 
	} 
	} 
	} 
	} 
} 