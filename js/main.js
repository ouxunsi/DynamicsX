// JavaScript Document
//$(window).scroll(function(){
//var juantop=$(document).scrollTop();	
//if(juantop>0){
//$("#topNav").hide();		
//}
//else
//{
//$("#topNav").show();	
//}	
//});
$(function(){
    $(".dhpic").hover(function(){
        $(".dhpic ul").show();	
    },
	function(){
	    $(".dhpic ul").hide();	
	});

   
$(".workshare").hover(function(){
    $(".workshare #popshare").show();	
},
function(){
    $(".workshare #popshare").hide();	
});
      
$(".workshare1").hover(function () {
    $(".workshare1 #popshare1").show();
},
function () {
    $(".workshare1 #popshare1").hide();
});

$(".zxmod3 .zxmod3nav li").hover(function () {
    var n = $(".zxmod3 .zxmod3nav li").index(this);
    $(".zxmod3 .zxmod3nav li").removeClass("zxmod3navlicur");
    $(this).addClass("zxmod3navlicur");
    $(".zxmod3 .zxmod3con").hide();
    $(".zxmod3 .zxmod3con").eq(n).show();
});




$(".msgbtn1").click(function(){
    var n=$(".msgbtn1").index(this);	
    if($(".pinglunmod1").eq(n).is(":visible")){
        $(".pinglunmod1").eq(n).hide();
        $(".iconarrow").eq(n).hide();
        $(".wendaline2").eq(n).hide();
    }
    else{
        $(".pinglunmod1").eq(n).show();
        $(".iconarrow").eq(n).show();
        $(".wendaline2").eq(n).show();
    }
	
	
});
    $(".wendamod6tit2").click(function () {
        var n = $(".wendamod6tit2").index(this);
        if ($(".pinglunmod1").eq(n).is(":visible")) {
            $(".pinglunmod1").eq(n).hide();
            $(".wendamod6tit2 .iconarrow").eq(n).hide();
            $(".wendaline2").eq(n).hide();
        }
        else {
            $(".pinglunmod1").eq(n).show();
            $(".wendamod6tit2 .iconarrow").eq(n).show();
            $(".wendaline2").eq(n).show();
        }


    });
    $(".zxbtn1").hover(function(){
        $(this).parent().parent().find(".qiandaocon").show();
    },function(){
        $(this).parent().parent().find(".qiandaocon").hide();
    });
    $(".guanli").hover(function(){
        $(this).find(".guanlimod1").show();
    },function(){
        $(this).find(".guanlimod1").hide();
    });				

    $(".worksmodtit4_1").hover(function () {
        $(this).find(".layer-follow-list").show();
    }, function () {
        $(this).find(".layer-follow-list").hide();
    });



    $(".u-setting").hover(function(){
        $(".u-setting .dropdown").addClass("dropdown-open");	
        $(this).find(".panel").show();
    },function(){
        $(".u-setting .dropdown").removeClass("dropdown-open");	
        $(this).find(".panel").hide();
    });
    $(".u-record").hover(function () {
        $(".u-record .dropdown").addClass("dropdown-open");
        $(this).find(".panel").show();
    }, function () {
        $(".u-record .dropdown").removeClass("dropdown-open");
        $(this).find(".panel").hide();
    });
    $(".u-msg").hover(function(){
        $(".u-msg .dropdown").addClass("dropdown-open");	
        $(this).find(".panel").show();
    },function(){
        $(".u-msg .dropdown").removeClass("dropdown-open");	
        $(this).find(".panel").hide();
    });	
    $(".u-upload").hover(function(){
        $(".u-upload .dropdown").addClass("dropdown-open");	
        $(this).find(".panel").show();
    },function(){
        $(".u-upload .dropdown").removeClass("dropdown-open");	
        $(this).find(".panel").hide();
    });	
		
    $(".mod4tit2").hover(function(){
        $(this).find(".panel").show();
    },function(){
        $(this).find(".panel").hide();
    });
    $(".worksconmod1tit3").hover(function () {
        $(this).find(".panel").show();
    }, function () {
        $(this).find(".panel").hide();
    });
	
    $(".tiezimod3tit1").hover(function(){
        $(this).find(".panel").show();
    },function(){
        $(this).find(".panel").hide();
    });	
		
		
    $(".tjtzmod4tit3").hover(function () {
        $(this).parent().find(".poppanel").show();
    },function(){
        $(this).parent().find(".poppanel").hide();
    });

    $(".wendamod5tit3").hover(function () {
        $(this).parent().find(".poppanel").show();
    }, function () {
        $(this).parent().find(".poppanel").hide();
    });

    $(".weibacontit4").hover(function(){
        $(this).find(".poppanel").show();
    },function(){
        $(this).find(".poppanel").hide();
    });	
    $(".articlepopeditor").hover(function () {
        $(this).find(".poppanel").show();
    }, function () {
        $(this).find(".poppanel").hide();
    });
		
					
    $(".tiezimod6tit2").hover(function(){
        $(this).find(".panel").show();
    },function(){
        $(this).find(".panel").hide();
    });	
    //上传作品		
    $("#uploadpopbtn").click(function(){
        if($("#more-set-con").is(":visible"))
        {
            $("#more-set-con").hide();
            $("#uploadpopbtn").html("展开").removeClass("on");
        }
        else
        {
            $("#more-set-con").show();
            $("#uploadpopbtn").html("收起").addClass("on");
        }
    });
    //问答显示全部

    $(".wendaviewall").click(function(){
        var n = $(".wendaviewall").index(this);
        if ($(".wendamod5conall").eq(n).is(":visible")) {
            $(".wendamod5conall").hide();
            $(".wendaviewall a").html("查看全部");
        }
        else {
            $(".wendamod5conall").show();
            $(".wendaviewall a").html("收起");

        }
    });

    $(".wendamod6tit3").click(function () {
        var n = $(".wendamod6tit3").index(this);
        if ($(".bdsharebuttonbox.fenxiangbox").eq(n).is(":visible")) {
            $(".bdsharebuttonbox.fenxiangbox").eq(n).hide();
            $(".wendamod6tit3 .iconarrow").eq(n).hide();
            $(".wendaline2").eq(n).hide();
        } else {
            $(".bdsharebuttonbox.fenxiangbox").eq(n).show();
            $(".wendamod6tit3 .iconarrow").eq(n).show();
            $(".wendaline2").eq(n).show();
        }
    });



//微吧所有
	
	$(".allweibapopbtn").click(function(){
	var n=$(".allweibapopbtn").index(this);		
	if($(".allweibamod2").eq(n).is(":visible"))
	{
		$(".allweibamod2").eq(n).hide();
		$(".allweibapopbtn").eq(n).html("展开").removeClass("on");
		}
	else
	{
		$(".allweibamod2").eq(n).show();
		$(".allweibapopbtn").eq(n).html("收起").addClass("on");
		}
	});	
	//问答单击
		$(".wendapopbtn").click(function(){
			if($(".wendamod3").is(":visible"))
		{
			$(".wendapopbtn").removeClass("on");
			}
		else
		{
			$(".wendapopbtn").addClass("on");
		}
			
		$(".wendamod3").toggle();
			
			});					
		//内容页
	$(".blogmod2_3 a").hover(function(){
			$(this).find("img").attr({src:"images/addpicblue.gif"});
				},function(){
			$(this).find("img").attr({src:"images/addpic.jpg"});
			});	
	$(".blogmod2_4 a").hover(function(){
			$(this).find("img").attr({src:"images/jianpicblue.gif"});
				},function(){
			$(this).find("img").attr({src:"images/jianpic.jpg"});
			});	
		
	//滑上去效果
			$(".mod3").hover(function(){
			$(this).addClass("mod3hover");
				},function(){
			$(this).removeClass("mod3hover");
			});
	//滑上去效果
			$(".blogmod4").hover(function(){
			$(this).addClass("blogmod4hover");
				},function(){
			$(this).removeClass("blogmod4hover");
				});
    //滑上去效果
			$(".zxmod8").hover(function () {
			    $(this).addClass("zxmod8hover");
			}, function () {
			    $(this).removeClass("zxmod8hover");
			});
	$(".mod4tit4").hover(function(){
	    $(this).find("img").attr({ src: "images/zanpic1hong.png" });
				},function(){
				    $(this).find("img").attr({ src: "images/zanpic1.png" });
			});
	
	$(".nav2 ul.nav2dropdown li").hover(function(){
	$(this).addClass("lihover").find("ul").show();	
	$(this).find(".blankwhite").show();
	},function(){
	$(this).removeClass("lihover").find("ul").hide();	
	$(this).find(".blankwhite").hide();
		});
	
	//blog
		$(".headpicmod .headpicmod1").hover(function(){
			$(".headpicmod .popheadpic").show();
			$(".headpicmod .popheadpicblank").show();
				},function(){
			$(".headpicmod .popheadpic").hide();
			$(".headpicmod .popheadpicblank").hide();
			});
		$(".blogbtn").hover(function(){
		$(this).css({background:"#4eacef"});	
				},function(){
		$(this).css({background:"#f5f5f6"});				
			});	
    //留言框
		$(".pingluntextarea").focus(function () {
		    $(this).css({ background: "#ffffff" });
		})

		$(".pingluntextarea").blur(function () {
		    $(this).css({ background: "#f7f8fa" });
		})
		
		$(".pingluntextarea1").focus(function () {
		    $(this).css({ background: "#ffffff" });
		})

		$(".pingluntextarea1").blur(function () {
		    $(this).css({ background: "#f7f8fa" });
		})

		$(".fengmianinput").focus(function () {
		    $(this).css({ background: "#ffffff" });
		})

		$(".fengmianinput").blur(function () {
		    $(this).css({ background: "#f7f8fa" });
		})
	
	//注册页
	
	$(".reginput1").focus(function(){
	    $(this).css({ border: "1px #b7d1da solid" });
		})
	
	$(".reginput1").blur(function(){
	    $(this).css({ border: "1px #dfeaed solid" });
		})
		
	$(".lgninput1").focus(function () {
	    $(this).css({ border: "1px #b7d1da solid" });
	})

	$(".lgninput1").blur(function () {
	    $(this).css({ border: "1px #dfeaed solid" });
	})
	//个人中心
		$(".pinput").focus(function(){
	$(this).css({border:"1px #488ee7 solid"});
		})
	
	$(".pinput").blur(function(){
	$(this).css({border:"1px #dddddd solid"});
		})		
	$(".pbtn2").hover(function(){
		$(this).css({background:"#00aaff"});	
				},function(){
		$(this).css({background:"#0099e5"});				
			});	
	//分页
	$(".jumpinput").focus(function(){
	$(this).css({background:"#ffffff"});
		})
	
	$(".jumpinput").blur(function(){
	$(this).css({background:"#fafafa"});
		})			
	//popclose
	//$(".popclose").click(function() {
	//	 $(this).parent().parent().find(".popbox").hide();
	//	 $(this).parent().parent().parent().find(".boxshade").hide();
    // });	
	$(".layer-follow .group-name li").hover(function() {
	    $(".layer-follow .group-name li a").addClass("hover");
	}, function() {
	    $(".layer-follow .group-name li a").removeClass("hover");
	});
});

function popLayer(popid,height){
	var obj = $('#'+popid);
	if(obj.size()>0){
		obj.css("margin-top",$(window).scrollTop()-height).show();
	}else{
		var prprecommend = obj;
		prprecommend.show();
		$('body').append(prprecommend);
		obj.css("margin-top",$(window).scrollTop()-height);
	}
}

	
	 
//function popjubao(){
//	$(".boxshade").show();
	//$(".popbox.pop-rep").show();	
	//$("#popclosejubao").click(function() {
		// $(this).parent().parent().find(".popbox").hide();
		// $(this).parent().parent().parent().find(".boxshade").hide();
	// });
//}
function popjubao(id) {
    var id = id;
    $(".popbox.pop-rep").show();
    $(".boxy-modal-blackout").show();
    $("#popclosejubao").click(function () {
        $(".popbox").hide();
        $('.boxy-modal-blackout').hide();
    });
}



function popshoucang(){
	$(".boxshade").show();
	$(".popbox.pop-shoucang").show();
	$("#popcloseshoucang").click(function() {
		 $(this).parent().parent().find(".popbox").hide();
		 $(".boxshade").hide();
	 });	
}

function popaddnewcate(){
	$(".boxshade").show();
	$(".popbox.pop-shoucang").hide();
	$(".popbox.pop-addnewcate").show();	
	$("#popcloseaddnewcate").click(function() {
	    $(this).parent().parent().parent().find(".popbox.pop-addnewcate").hide();
	    $(this).parent().parent().parent().find(".popbox.pop-shoucang").show();
	 });
	
}



//检测是否存在
function checkWendaTit()
{
email=document.form1.wendatext1.value;
var xmlhttp;
	try
	{
	xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e)
	{
		try
		{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e)
		{ 
			try
			{
			xmlhttp=new XMLHttpRequest();
			}
			catch (e)
			{
			}
		}
	}
	if (email=="")
	{
	msg="必填项";
	var ch=document.getElementById("wemdatext1tishi");
	ch.innerHTML="<i class='erroricon'></i>"+msg; 
	return false;
	}
	
//创建请求，并使用escape对email编码，以避免乱码
		xmlhttp.open("get","Regdisposal.asp?Action=checkregmsg&email="+escape(email)+ "&t=" + new Date().getTime());
		xmlhttp.onreadystatechange=function()
		{
			if(4==xmlhttp.readyState)
			{
				if(200==xmlhttp.status)
				{
					msg=xmlhttp.responseText;
				}
				else
				{
				msg="网络链接失败";
				}
			var ch=document.getElementById("emails");
			ch.innerHTML=msg; 
			}
		}
		xmlhttp.send(null); 
return false;
}

//创建分组
function createFenzu() {
    $('#tsbox').removeClass('close_box');
    $('#tsbox').addClass('show_box');
    $('.boxy-modal-blackout').show();
};
var ui = {
    removeblackout: function() {
        if($('#tsbox').length > 0) {
            if(document.getElementById('tsbox').style.display == 'none'){
                $('.boxy-modal-blackout').hide();
            }	
        } else {
            $('.boxy-modal-blackout').hide(); 	
        }
    },
    box: {
        close: function (fn) {
            $('#tsbox').removeClass('show_box');
            $('#tsbox').addClass('close_box');
            $('.boxy-modal-blackout').hide();
        }
    }
};
//管理分组
function manageFenzu() {
    $('#tsbox1').removeClass('close_box');
    $('#tsbox1').addClass('show_box');
    $('.boxy-modal-blackout').show();
};
function closebox1() {
    $('#tsbox1').removeClass('show_box');
    $('#tsbox1').addClass('close_box');
    $('.boxy-modal-blackout').hide();
}
function editGroup(id) {
    var id = id;
    $("#Fenzumod_"+id).hide();
    $("#edit_"+id).show();
}
function closeGroup(id) {
    var id = id;
    $("#edit_" + id).hide();
    $("#Fenzumod_" + id).show();
}
function delGroup(id) {
    var id = id;
    $('#tsbox1').removeClass('show_box');
    $('#tsbox1').addClass('close_box');
    $('#tsbox2').removeClass('close_box');
    $('#tsbox2').addClass('show_box');
}
function closebox2() {
    $('#tsbox2').removeClass('show_box');
    $('#tsbox2').addClass('close_box');
    $('.boxy-modal-blackout').hide();
}
function createFollowGroupTab() {
    $(".createbox").show();
}
function closecreatebox() {
    $(".createbox").hide();
}

function popEditbox(id) {
    var id = id;
    $('#editbox').removeClass('close_box');
    $('#editbox').addClass('show_box');
    $('.boxy-modal-blackout').show();
};
function closeEditbox() {
    $('#editbox').removeClass('show_box');
    $('#editbox').addClass('close_box');
    $('.boxy-modal-blackout').hide();
};

