// JavaScript Document
function showlgn(){ 
		var iWidth = document.documentElement.clientWidth; 
		var iHeight = document.documentElement.clientHeight;
		var bgObj = document.createElement("div"); 
		bgObj.setAttribute("id","bgbox");
		bgObj.style.width = iWidth+"px"; 
		bgObj.style.height =Math.max(document.body.clientHeight, iHeight)+"px";
		document.body.appendChild(bgObj); 
		var oShow = document.getElementById('lgn'); 
		oShow.style.display = 'block'; 
		oShow.style.left = (iWidth-440)/2+"px"; oShow.style.top = 200+"px";
		function oClose(){ oShow.style.display = 'none'; document.body.removeChild(bgObj); } 
		var oClosebtn = document.getElementById('closebtn');
		oClosebtn.onclick = oClose;
	} 
