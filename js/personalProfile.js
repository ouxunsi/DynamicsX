function cancelbuble(e) {
    e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble = true
}
$('.radio label').on('click', function() {
    $("input[name=radio]").parent().removeClass().addClass('radio-1');
    $("input[name=radio]:checked").parent().removeClass().addClass('radio-0');
})
$('.more').on('click', function() {
    $('.other-personal-link').show();
    $(this).parents('tr').hide()
})
$('#set-domain-name').on('click', function() {
    showGlobalMaskLayer();
    $('.pop-domain-name').show();
})
$('.pop-domain-name .pop-cancel,.pop-domain-name .pop-close').on('click', function() {
    hideGlobalMaskLayer();
    $('.pop-domain-name').hide();
})
$('.pop-domain-name .pop-confirm').on('click', function() {



})
zCharCount_withExceedCount($("#signature"), {
    allowed: 40,
    exceed: 10
});
zCharCount_withExceedCount($("#workmark"), {
    allowed: 16,
    exceed: 10
});

$('.domain-name-text-box .text-style').charCount({
    allowed: 16,
    warning: 0,
    css: 'count'
});
zCharCount($("#brief-introduction"), {
    allowed: 2000
});
$('.text-style').on('blur', function() {
        //$(this).removeClass('borderred').next().removeClass('warning').removeClass('exceeded')
    })
    // 贴标签
function Labelling(obj) {
    this.labelling = obj.labelling;
    this.workmark = obj.workmark;
    this.workcon = obj.workcon;
    this.disbled = obj.disbled;
    this.close = this.workcon.find('span>i');
    this.textnum = this.workmark.siblings('.counter').html();
    this.tagNum;
    this.disabledBtnFn();
    this.clickAdd();
    this.tagClose();
}
Labelling.prototype = {
    fn1: function() {
        var me = this;
        var numberOfTag = this.workcon.find('span').length;
        this.tagNum = 5 - numberOfTag;
        this.labelling.val(messagesWeb.account_label + '(' + this.tagNum + ')')
            // this.textnum = ;

    },
    disabledBtnFn: function() {
        var me = this;
        this.workmark.on('keyup', function() {
            count = parseInt($(this).parent().find('.count').html());
            if(count < 0){
                me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
            }else if ($(this).val() != "") {
            me.labelling.removeAttr('disabled').removeClass('disabled-color');
            } else {
                me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
            }
        })
    },
    clickAdd: function() {
        var me = this,
            flag = true,
            tags = [];
        this.fn1()
        this.labelling.on('click', function() {
            // e.preventDefault()
            
            count = parseInt($(this).parent().find('.count').html());
            // var inputTag = me.workmark.val()
            var inputTag;
            if(me.workmark.val().trim() == ""){
                return;
            }else{
                inputTag = $('#workmark').val();

            }
            me.workmark.val('')
            me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
            if (!validateTag(inputTag)) {
                return;
            }
            for (var i = 0; i < $('.mark-con').find('span').length; i++) {
                    if (inputTag != $($('.mark-con').find('span')[i]).attr('title')) {
                        flag = true;
                        continue;
                    } else {
                        flag = false;
                        // 标签不能重复;
                        pageToastFail(messagesWeb.label.label_repeat);
                        break;
                    }
                }
            if (count < 0) {
                pageToastFail(messagesWeb.textFieldPrompt.character_limit);
            } else {

                if (flag) {
                    if (me.tagNum == 0) {
                        return;
                    }
                    submitTagData(me, inputTag);
                }
            }
        })
        $('#workmark').on('keydown', function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];

            if (e.keyCode == 13 || e.keyCode == 32) {
                e.preventDefault()
                count = parseInt($(this).parent().find('.count').html());
                var inputTag;
                if(me.workmark.val().trim() == ""){
                    return;
                }else{
                    inputTag = $('#workmark').val();
                }
                // var inputTag = me.workmark.val()
                me.workmark.val('')
                me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
                if (!validateTag(inputTag)) {
                    return;
                }
                if (count < 0) {
                    pageToastFail(messagesWeb.textFieldPrompt.character_limit);
                } else {

                    if (flag) {
                        if (me.tagNum == 0) {
                            return;
                        }
                        submitTagData(me, inputTag);
                    }
                }
            }
        })

        function submitTagData(me, tag) {
            $.ajax({
                    type: "post",
                    url: "http://" + zMyDomain + "/setting/addTag.json?tag=" + tag,
                    //                    data: { tag: inputTag },
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            AddTag(tag, me.workcon);
                            me.fn1()
                            if (me.tagNum == 0) {
                                    me.labelling.hide()
                                    me.disbled.show()
                                    return;
                                }
                                    
                            
                            
                            me.tagClose()
                        } else {
                            pageToastFail(data.msg)
                        }
                    },
                    error:function(){
                        pageToastFail(messagesWeb.comment_exception_hints)
                    }
                })
        }

        function validateTag(inputTag) {
            var flag = true
            for (var i = 0; i < $('.mark-con').find('span').length; i++) {
                if (inputTag != $($('.mark-con').find('span')[i]).attr('title')) {

                } else {
                    flag = false;
                    pageToastFail(messagesWeb.label.label_repeat);
                    break;
                }
            }
            return flag
        }
    },
    tagClose: function() {
        var me = this;
        this.workcon.on('click', this.close, function(event) {
            var tag = $(event.target).parents('.mark').text();
            $(event.target).parents('.mark').remove();
            if (me.tagNum == 0) {
                me.labelling.show()
                me.disbled.hide()
            }
            me.fn1()
            $.ajax({
                type: "post",
                url: "http://" + zMyDomain + "/setting/delTag?tag=" + tag,
                //                data: { tag: tag },
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                success: function(data) {
                    if (data.code == 0) {
                        console.log('delete4success')
                    }
                }
            })
        })
    }
}
new Labelling({
    labelling: $('.mark-btn'),
    workmark: $('#workmark'),
    workcon: $('.mark-con'),
    disbled: $('.mark-disabled')
})

function AddTag(inputc, workc) {
    inputc = html_encode(inputc)
    if (inputc != "") {
        var appendTag = '<span class="mark" title="' + inputc + '">' + inputc + ' <i></i></span>'
        workc.append(appendTag)
    }
}
// 贴标签  end



var MatchingPull = {
    keyboardSection: -1,
    MatchingPullDown: function(event,input, itembox) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var eq = [];
        itembox.show()
        $.ajax({
            type: "get",
            url: "http://" + zMyDomain + "/setting/school?name=" + input.val(),
            //                async:false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            success: function(data) {
                if (data.data.length > 0) {
                    itembox.find('ul').show();
                    itembox.find('.empty').hide();
                    for (var i = 0; i < data.data.length; i++) {
                        eq.push('<li title="' + data.data[i].name + '" data-id="' + data.data[i].id + '">' + data.data[i].name + '</li>')
                    }
                    itembox.find('ul').html(eq.join(''));
                } else {
                    itembox.find('ul').hide();
                    itembox.find('.empty').show();
                }
            }
        })
        if (input.val() == "") {
            itembox.hide();
            input.val('').removeAttr('data-id');
            MatchingPull.keyboardSection = -1;
        }

        if (e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault()
        }
    },
    matchingSelected: function(ipt, itembox) {
        itembox.on('click', $('.school-name-wrap .school-name-list').find('li'), function(event) {
            if (event.target.nodeName == 'LI') {
                $(event.target).addClass('active').siblings('li').removeClass('active')
                ipt.val($(event.target).html()).attr('data-id', $(event.target).attr('data-id'));
                itembox.hide()
                ipt.focus()
                MatchingPull.keyboardSection = -1;
            }else{
                cancelbuble(event)
            }
            
        })
    },
    keyboardSectionFn: function() {

        $(document).on('keyup', function(event) {
            if ($('.school-name-wrap .school-name-list').is(":visible") == true) {
                console.log('school')
                var derail = 1;
                var inputV = $('#school-name');
                var e = event || window.event || arguments.callee.caller.arguments[0];
                var listLi = $('.school-name-wrap .school-name-list ul').find('li');
                switch (e.keyCode) {
                    case 38: //上
                        MatchingPull.keyboardSection--
                            if (MatchingPull.keyboardSection == -1) {
                                MatchingPull.keyboardSection = listLi.length - 1;
                            }
                        if (MatchingPull.keyboardSection == -2) {
                            MatchingPull.keyboardSection = listLi.length - 1;
                        }

                        listLi.eq(MatchingPull.keyboardSection).addClass('active').siblings().removeClass('active');
                        // derail = 1;
                        break;
                    case 40:
                        MatchingPull.keyboardSection++
                            if (MatchingPull.keyboardSection == listLi.length) {
                                MatchingPull.keyboardSection = 0
                            }
                        console.log(listLi.eq(MatchingPull.keyboardSection).html())
                        console.log(MatchingPull.keyboardSection)
                        $('.school-name-wrap .school-name-list ul li').eq(MatchingPull.keyboardSection).addClass('active').siblings().removeClass('active');

                        // derail = 1;
                        break;

                }
                if (e.keyCode == 13) {

                    var mateListVal = listLi.eq(MatchingPull.keyboardSection).html();
                    inputV.val(mateListVal).attr('data-id', listLi.eq(MatchingPull.keyboardSection).attr('data-id'))
                    $('.school-name-wrap .school-name-list').hide()
                    MatchingPull.keyboardSection = -1;
                }
            }
        })
    },
    enterSelected: function() {
        $(document).on('keyup', function(event) {
            if ($('.school-name-wrap .school-name-list').is(":visible") == true) {
                if (e.keyCode == 13) {
                    var mateListVal = listLi.eq(MatchingPull.keyboardSection).html()
                    inputV.val(mateListVal)
                    $('.school-name-wrap .school-name-list').hide()
                    MatchingPull.keyboardSection = -1;
                }
            }
        })
    },
    itemHide: function() {
        $(document).on('click', function() {
            $('.school-name-wrap .school-name-list').hide()
            $('.school-name-wrap .school-name-list li').removeClass('active')
            MatchingPull.keyboardSection = -1;
        })
    }
}

MatchingPull.matchingSelected($('#school-name'), $('.school-name-wrap .school-name-list'))
$('#school-name').on('keyup', function(e) {
    MatchingPull.MatchingPullDown(e,$(this), $('.school-name-wrap .school-name-list'))
}).on('blur', function() {
    var schoolId = $("#school-name").attr("data-id");
    if (!schoolId) {
        $("#school-name").val("");
    }
});
MatchingPull.keyboardSectionFn()
MatchingPull.itemHide()

$('#educational-btn').on('click', function() {
    var body = {};
    body.school = parseInt($('input[name="school-name"]').attr('data-id'));
    if (!body.school) {
        $("input[name=school-name]").val("");
    }
    $.ajax({
        type: "post",
        url: "http://" + zMyDomain + "/setting/edu",
        data: JSON.stringify(body),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            if (data && data.code == 0) {
                pageTips(messagesWeb.comment_saved_success);
            } else {
                pageToastFail(data.msg);
            }
        }
    })
})



// 添加装备
function Equipment(obj) {
    this.addbtn = obj.addbtn;
    this.inputbox = obj.inputbox;
    this.tagcon = obj.tagcon;
    this.tagconlist = this.tagcon.find('.mark');
    this.disbled = obj.disbled;
    this.matecon = obj.matecon;
    this.matelist = obj.matecon.find('li');
    this.myeqcon = obj.myequipment;
    this.myeqlist = this.myeqcon.find('span');
    this.derail = 1;
    this.index = -1;
    this.ajax = 0;
    this.addnumber = 20;
    this.tagNum;

    return this;
}
Equipment.prototype = {
    addEquipmentPop: function() {
        $('.add-equipmentb').on('click', function() {
            showGlobalMaskLayer();
            $('.add-equipment-pop').show();
            $('#equipment').val('')
            if (me.inputbox.val() == "") {
                // me.addbtn.attr('disabled', 'disabled').addClass('disabled-color');
            } else {
                // me.addbtn.removeAttr('disabled').removeClass('disabled-color');
            }
            $('.add-equipment-pop').css({
                'top': $(document).scrollTop() + 100 + 'px'
            })
        })
    },
    keyUp: function() {
        me = this;
        this.inputbox.on('keydown', function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];


            this.index = -1;
            if (e.keyCode == 38 || e.keyCode == 40) {
                // $(this).blur()
                e.preventDefault()
            }
            // me.matelist.removeClass('active')
        })
        this.inputbox.on('keyup', function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            var eq = [];
            if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
                    e.preventDefault()
                 }else{
                    me.matecon.show()

                    $.ajax({
                        type: "get",
                        url: "http://" + zMyDomain + "/devices/search?name=" + $(me.inputbox).val(),
                        //                async:false,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        headers: {
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        success: function(data) {
                            if (data.data.length > 0) {
                                $('.eq-matebox ul').show();
                                $('.eq-matebox .empty').hide();
                                for (var i = 0; i < data.data.length; i++) {
                                    eq.push('<li data-id="' + data.data[i].id + '">' + data.data[i].name + '</li>')
                                }
                                $('.eq-matebox ul').html(eq.join(''));
                                for (var i = 0; i < $('.equipment-listcon span').length; i++) {
                                    for (var j = 0; j < $('.eq-matebox li').length; j++) {
                                        if ($($('.equipment-listcon span')[i]).attr('data-id') == $($('.eq-matebox li')[j]).attr('data-id')) {
                                            $($('.eq-matebox li')[j]).addClass('equipment-list-disabled');
                                        }
                                    }
                                }
                            } else {
                                $('.eq-matebox ul').hide();
                                $('.eq-matebox .empty').show();
                            }
                        }
                    })
                 }
                    
                    
               
            
            if (me.inputbox.val() == "") {
                me.matecon.hide()
                me.matelist.removeClass('equipment-list-disabled')
                me.index = -1;
                // me.addbtn.attr('disabled', 'disabled').addClass('disabled-color');
            } else {
                // me.addbtn.removeAttr('disabled').removeClass('disabled-color');
            }

            if (e.keyCode == 38 || e.keyCode == 40) {
                // $(this).blur()
                e.preventDefault()
            }

        })
        $(document).on('click', function() {
            me.matecon.hide()
            me.matelist.removeClass('active')
            me.index = -1;
        })


    },
    fn1: function() {
        var me = this;
        var numberOfTag = me.tagcon.find('.mark').length;
        me.tagNum = me.addnumber - numberOfTag;
        me.addbtn.val(messagesWeb.account_add + '(' + me.tagNum + ')')
        if (me.tagNum != 0) {
            me.addbtn.show()
            me.disbled.hide()
        }
    },
    nowEquipment: function() {
        var nowTagCon = this.tagcon.html();
        $('.now-equipment').html(nowTagCon)
        if ($('.now-equipment').find('.mark').length >= 5) {
            $('.add-equipmentb').addClass('disabled').attr('disabled', 'disabled');
        } else {
            $('.add-equipmentb').removeClass('disabled').removeAttr('disabled')
        }
    },
    clickAdd: function() {
        var me = this;
        this.fn1()

        function referTo() {
            var onoff = true;
            var tagconlist = me.tagcon.find('.mark');
            var inputValue = me.inputbox.val();
            var checkedDataId = me.inputbox.attr('data-id');
            $('.eq-matebox li').each(function(i, ele) {

                if (checkedDataId == $($('.eq-matebox li')[i]).attr('data-id')) {
                    var appendTag = '<span class="mark" title="' + inputValue + '" data-id="' + $($('.eq-matebox li')[i]).attr('data-id') + '"><span>' + inputValue + '</span> <i></i></span>'
                    var deviceId = $($('.eq-matebox li')[i]).attr('data-id');
                    for (var z = 0; z < tagconlist.length; z++) {
                        if (tagconlist.eq(z).attr('data-id') == checkedDataId) {
                            onoff = false;
                        }
                    }
                    $($('.matelist li')[i]).addClass('disabled').removeClass('active')

                    if (onoff == true) {
                        $.ajax({
                            type: "post",
                            url: "http://" + zMyDomain + "/setting/addDevice",
                            data: {
                                deviceId: deviceId
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            crossDomain: true,
                            headers: {
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            success: function(data) {
                                // console.log(data)
                                if (data.code == 0) {
                                    me.tagcon.append(appendTag)
                                        me.inputbox.val('')
                                    var numberOfTag = me.tagcon.find('.mark').length;
                                    me.tagNum = me.addnumber - numberOfTag;
                                    me.addbtn.val(messagesWeb.account_add + '(' + me.tagNum + ')')
                                    me.matecon.hide();
                                    for (var j = 0; j < $('.mymyequipment span').length; j++) {
                                        if ($($('.mymyequipment span')[i]).html() == inputValue) {

                                            $($('.mymyequipment span')[i]).addClass('disabled').removeClass('active')
                                        }
                                    }
                                    if (me.tagNum == 0) {
                                        me.addbtn.hide()
                                        me.disbled.show()
                                    }
                                }

                            }
                        })

                    }

                    me.matecon.hide()
                    

                }

            })
            // me.nowEquipment()
        }
        // this.addbtn.on('click', function(e) {

        //     referTo()
        //     cancelbuble(e)
        // })
        $('.eq-matebox').on('click', $('.eq-matebox li'), function(event) {
            if(event.target.nodeName == "LI"){
                if($(event.target).hasClass('equipment-list-disabled')){
                    cancelbuble(event)
                }else{
                    if($('.equipment-listcon .mark').length >= 20){

                        return false;
                    }
                    $(event.target).addClass('active').siblings('li').removeClass('active')
                    me.inputbox.val($(event.target).html()).attr('data-id',$(event.target).attr('data-id'))
                    me.matecon.hide()
                    me.inputbox.focus()
                    me.derail = 0;
                    referTo()
                }
                
            }else{
                cancelbuble(event)
            }
            
        })
         $('#equipment').on('click',function(e){
                cancelbuble(e)
            })
        $("#equipment").bind('keyup', function(event) {
            if ($('.eq-matebox').is(":visible") == true) {
                var tagLength = me.tagcon.find('.mark').length;
                var inputV = me.inputbox.val();
                var e = event || window.event || arguments.callee.caller.arguments[0];
                var listLi = $('.eq-matebox ul').find('li');
                switch (e.keyCode) {
                    case 38: //上
                        me.index--
                            if (me.index == -1) {
                                me.index = listLi.length - 1;
                            }
                        if (me.index == -2) {
                            me.index = listLi.length - 1;
                        }

                        listLi.eq(me.index).addClass('active').siblings().removeClass('active');
                        me.derail = 1;
                        break;
                    case 40:

                        me.index++
                            if (me.index == listLi.length) {
                                me.index = 0
                            }
                        listLi.eq(me.index).addClass('active').siblings().removeClass('active');

                        me.derail = 1;
                        break;
                }
                if (inputV != "") {
                    if (e.keyCode == 13) {
                        if (tagLength >= me.addnumber) {
                            me.matecon.hide()

                            e.keyCode = 0;
                            return false;
                        }
                        if (me.derail == 1) {
                            if (me.index > -1) {
                                var mateListVal = listLi.eq(me.index).html()
                                me.inputbox.val(mateListVal)
                                me.inputbox.attr('data-id',listLi.eq(me.index).attr('data-id'))
                                me.matecon.hide()
                                referTo()
                            }

                        } else {
                            referTo()
                        }
                        me.index = -1;
                    }
                }
            }



        })

    },
    clickList: function() {
        var me = this;
        // $('.eq-matebox').on('click', $('.eq-matebox li'), function(event) {
        //     if(event.target.nodeName == "LI"){
        //         if($(event.target).hasClass('equipment-list-disabled')){
        //             cancelbuble(event)
        //         }else{
        //             if($('.equipment-listcon .mark').length >= 20){

        //                 return false;
        //             }
        //             $(event.target).addClass('active').siblings('li').removeClass('active')
        //             me.inputbox.val($(event.target).html()).attr('data-id',$(event.target).attr('data-id'))
        //             me.matecon.hide()
        //             me.inputbox.focus()
        //             me.derail = 0;
        //             referTo()
        //         }
                
        //     }else{
        //         cancelbuble(event)
        //     }
            
        // })
    },
    cMyEquipment: function() {
        var me = this;
        bm = function(event) {
            if ($(event.target)[0] != $(this)[0]) {
                var onoff = true;
                var tagconlist = me.tagcon.find('.mark');
                var myVal = $(event.target).html()
                var myId = $(event.target).attr('data-id');
                if ($(event.target).hasClass('active')) {} else {
                    if (tagconlist.length >= me.addnumber) {
                        me.myeqlist.unbind('click')
                    } else {
                        for (var z = 0; z < tagconlist.length; z++) {
                            if (tagconlist.eq(z).find('span').html() == myVal) {
                                onoff = false;
                            }
                        }
                        $(event.target).addClass('disabled')
                            // tagconlist.eq(i).addClass('disabled')
                        if (onoff == true) {
                            var appendTag = '<span class="mark" title="' + myVal + '" data-id="' + myId + '"><span>' + myVal + '</span> <i></i></span>'
                            me.tagcon.append(appendTag)
                            var numberOfTag = me.tagcon.find('.mark').length;
                            num = numberOfTag
                            me.tagNum = me.addnumber - numberOfTag;
                            me.addbtn.val(messagesWeb.account_add + '(' + me.tagNum + ')')
                            if (me.tagNum == 0) {
                                me.addbtn.hide()
                                me.disbled.show()
                            }
                            for (var j = 0; j < me.matelist.length; j++) {
                                if (me.matelist.eq(j).html() == myVal) {

                                    me.matelist.eq(j).addClass('disabled')
                                }
                            }
                        }
                    }
                    // me.nowEquipment()
                }
            }
        }
        $('.mymyequipment').on('click', $('.mymyequipment .havemark'), bm)
    },
    closeTag: function() {
        var me = this;
        this.tagcon.on('click', this.tagconlist.find('i'), function(event) {
            var event = event || window.event || arguments.callee.caller.arguments[0];
            if (event.target.nodeName == 'I') {
                var currentTag = $(event.target).parents('.mark');
                var deviceId = currentTag.attr('data-id');
                $.ajax({
                    type: "post",
                    url: "http://" + zMyDomain + "/setting/delDevice",
                    data: {
                        deviceId: deviceId
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    success: function(data) {
                        // console.log(data)
                        if (data.code == 0) {
                            currentTag.remove()
                            for (var i = 0; i < $('.eq-matebox li').length; i++) {
                                if ($($('.eq-matebox li')[i]).html() == currentTag.find('span').html()) {
                                    $($('.eq-matebox li')[i]).removeClass('disabled');
                                }
                            }
                            for (var i = 0; i < $('.mymyequipment span').length; i++) {
                                if ($($('.mymyequipment span')[i]).html() == currentTag.find('span').html()) {
                                    $($('.mymyequipment span')[i]).removeClass('disabled');
                                }
                            }
                            if (me.tagNum == 0) {
                                me.addbtn.show()
                                me.disbled.hide()
                            }
                            me.fn1()
                            if (me.tagNum != 0) {
                                me.myeqlist.bind('click', bm)
                            }
                        }
                    }
                })


                // me.nowEquipment()
            }

            cancelbuble(event)
        })
    },
    nowEquipmentClose: function() {
        var me = this;
        $('.now-equipment').on('click', function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e.target.nodeName == 'I') {
                $(e.target).parents('.mark').remove()
                $('.equipment-listcon').html($('.now-equipment').html())
                // me.nowEquipment()
                me.fn1()
                for (var i = 0; i < me.matelist.length; i++) {
                    if (me.matelist.eq(i).html() == $(e.target).parents('.mark').find('span').html()) {
                        me.matelist.eq(i).removeClass('disabled');
                    }
                }
                for (var i = 0; i < me.myeqlist.length; i++) {
                    if (me.myeqlist.eq(i).html() == $(e.target).parents('.mark').find('span').html()) {
                        me.myeqlist.eq(i).removeClass('disabled');
                    }
                }
                $('.mymyequipment').on('click', $('.mymyequipment .havemark'), bm)
            }
        })
    },
    inputBoxCheck: function() {
        this.inputbox.onblur(function() {
            var a;
        })
    }
}
var equipment = new Equipment({
    addbtn: $('.add-equipmentbtn'),
    inputbox: $('#equipment'),
    tagcon: $('.equipment-listcon'),
    disbled: $('.equipment-disabled'),
    matecon: $('.add-equipment .eq-matebox'),
    myequipment: $('.mymyequipment')
})
equipment.keyUp();
equipment.clickAdd();
equipment.clickList()
equipment.cMyEquipment()
equipment.closeTag()
equipment.nowEquipmentClose()

// 添加装备结束



var checkAll = {
    pattern: {
        qqAccount: /^[\s\S*]{20}$/g,
        personalizedDomainName: /^[a-zA-Z0-9]{5,16}$/,
        realmName: /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
        other: /^([\u4e00-\u9fa5]{2}|[\s\S*]{4})$/g
    },
    checkItem: function(value) {
        if (this.pattern.qqAccount.test(value)) {
            return 1;
        } else {
            return 0;
        }
    },
    checkItem2: function(value) {
        if (this.pattern.personalizedDomainName.test(value)) {
            return 1;
        } else {
            return 0;
        }
    },
    checkItem3: function(value) {
        if (this.pattern.realmName.test(value)) {

            return 1;
        } else {

            return 0;
        }
    }
}

$('input[name="qq-account"]').on('keyup', function() {

})
$('input[name="domain-name"]').on('keyup', function() {

})

$('#contact-way').on('click', function() {
    var body = {};
    body.qq = $('input[name="qq-account"]').val();
    body.qqPrivacy = $('#qq-privacy option:selected').data('id')
    body.wechat = $('input[name="wechat"]').val();
    body.wechatPrivacy = $('#wechat-privacy option:selected').data('id')
    $.ajax({
        type: "post",
        url: "http://" + zMyDomain + "/setting/contact",
        data: body,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        success: function(data) {
            if (data.code == 0) {
                console.log('success')
                pageToastSuccess(messagesWeb.comment_saved_success)
            } else {
                pageTips(data.msg)
            }
        }
    })
})

$('#domain-name-btn').on('click', function() {
    var domainName = $('input[name="domain-name"]').val();
    if (checkAll.checkItem2(domainName) == 1) {
        $.ajax({
            type: "get",
            url: "http://" + zMyDomain + "/setting/checkDomain.json",
            data: {
                domain: domainName
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            success: function(data) {
                // console.log(data)
                if (data.code == 0) {
                    $.ajax({
                        type: "post",
                        url: "http://" + zMyDomain + "/setting/domain.json",
                        data: {
                            domain: domainName
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        headers: {
                            "X-Requested-With": "XMLHttpRequest"
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.code == 0) {
                                $('.domain-name-error').hide();
                                // 域名设置成功
                                pageToastSuccess(messagesWeb.personalInformation.domain_set_successfully);
                                $('.domain-style').removeClass('hide')
                                $('.personalized-domain').html(domainName);
                                $('#set-domain-name').hide();
                                hideGlobalMaskLayer();
                                $('.pop-domain-name').hide();
                                console.log("seting domain success")
                            }else {
                                pageToastFail(data.msg)
                            }

                        }
                    })
                } else {
                    $('.domain-name-error').show().find('.error-prompt').html('<i class="error-icon">!</i>' + data.msg);
                }
            }
        })
    } else {
        // 格式验证
        // 请输入5～16个英文/数字
        $('.domain-name-error').show().find('.error-prompt').html('<i class="error-icon">!</i>' + messagesWeb.personalInformation.domain_limit_format);
    }

})

$('#essential-information').on('click', function() {
    var body = {};
    // 头像没有
    body.gender = $('label[class="radio-0"] > input').val();
    body.homeCity = $('.hometown-box .city-picker-span > .title > span').attr('data-code');
    body.nowCity = $('.now-city-box .city-picker-span > .title > span').attr('data-code');
    body.profession = $('.job-select select option:selected').attr('data-id');
    body.description = $('#brief-introduction').val();
    body.signature = $('#signature').val();
    $.ajax({
        type: "post",
        url: "http://" + zMyDomain + "/setting/basic",
        data: JSON.stringify(body),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            if (data.code == 0) {
                pageToastSuccess(messagesWeb.comment_saved_success);
            } else {
                pageToastFail(data.msg);
            }
        }
    })
})

$('#essential-information-company').on('click', function() {

    var _trade = new Array()
    $('#industry').find('.check-cd').each(function() {
        _trade.push($(this).children().attr('industryids'))
    })
    var body = {};
    // 头像没有
    body.signature = $("#signature").val()
    body.industry = _trade

    body.nowProvince = $('.city-box .city-picker-span > .title > span[data-count="province"]').attr('data-code'),
        body.nowCity = $('.city-box .city-picker-span > .title > span[data-count="city"]').data('code'),
        body.nowDistrict = $('.city-box .city-picker-span > .title > span[data-count="district"]').data('code'),

        body.address = $('#details-address').val();
    body.description = $('#brief-introduction').val();
    body.website = $('#official-website').val();
    $.ajax({
        type: "post",
        url: "http://" + zMyDomain + "/setting/basic",
        data: JSON.stringify(body),
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        dataType: 'json',
        contentType: "application/json",
        success: function(data) {
            if (data.code == 0) {
                pageToastSuccess(messagesWeb.comment_saved_success);
            } else {
                pageToastFail(data.msg);
            }
        }
    })
})



$('#personal-links tr').each(function(i, item) {
    var personalLinks = $(item).find('td input');
    personalLinks.on('blur', function() {
        if (checkAll.checkItem3(personalLinks.val())) {
            $(item).find('.personal-link-icon').show();
        } else {
            $(item).find('.personal-link-icon').hide();
        }
    })


})

$('#personal-link-btn').on('click', function() {
    var body = {};

    function link() {
        for (var i = 0, len = $('#personal-links tr').find('.long-text-box').length; i < len; i++) {
            var url = $('#personal-links tr').find('td input').eq(i).val()
            if (url.length > 0 && checkAll.checkItem3(url) == 0) {
                return 0;
                break;
            }
        }
        return 1;
    }
    body.link2 = $('input[name="micro-blog-sina"]').val();
    body.link4 = $('input[name="everyone"]').val();
    body.link6 = $('input[name="deviantart"]').val();
    body.link7 = $('input[name="dribbble"]').val();
    body.link8 = $('input[name="facebook"]').val();
    body.link9 = $('input[name="twitter"]').val();
    body.link10 = $('input[name="behance"]').val();
    body.link11 = $('input[name="flickr"]').val();
    body.link12 = $('input[name="personal-website"]').val();
    if (link() == 1) {
        $.ajax({
            type: "post",
            url: "http://" + zMyDomain + "/setting/link",
            data: body,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            success: function(data) {
                if (data.code == 0) {
                    pageToastSuccess(messagesWeb.comment_saved_success);
                } else {
                    pageToastFail(data.msg)
                }
            }
        })
    } else {
        // 链接校验失败
        pageToastFail(messagesWeb.personalInformation.link_validation_failed)
    }

})

// 认证
function Trade() {
    if ($('#industry').find('input:checked').parents('label').length >= 2) {

        $('.error-prompt').hide()
        return 2;
    } else if ($('#industry').find('input:checked').parents('label').length == 0) {

        $('.error-prompt').show()
        return 0;
    } else {

        $('.error-prompt').hide()
        return 1;
    }
}

var validateTrade = function () {
    if (Trade() == 2) {
        $('#industry').find('input:checkbox').not("input:checked").attr('disabled', true).parents('label').addClass('disabled');
    } else {
        $('#industry').find('input:checkbox').not("input:checked").removeAttr('disabled').parents('label').removeClass('disabled');
    }
}
validateTrade()

$('#industry label').on('click', function() {
    validateTrade()
})

$('#basic-authentication').on('click', function() {
    var industryList = $('#industry').find('label');
    var body = {};
    body.address = $('#details-address').val();
    city = ['nowProvince', 'nowCity', 'nowDistrict']
    $('.authentication-city-box .city-picker-span .title').find('.select-item').each(function(i, item) {
        body[city[i]] = $(item).attr('data-code');
        console.log(city[i] + $(item).attr('data-code'))
    })
    body.industryIds = [];
    industryList.each(function(i, item) {
        if ($(item).find('input:checked').attr('industryIds')) {
            body.industryIds.push(parseInt($(item).find('input:checked').attr('industryIds')));
        }

    })
    Trade()
    if (Trade() == 1 || Trade() == 2) {
        $.ajax({
            type: "post",
            url: "http:/" + zMyDomain + "/setting/authBasic",
            data: JSON.stringify(body),
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            success: function(data) {
                console.log(data)
                if (data.code != 0) {
                    console.log(data.msg)
                }
            }
        })
    }
})


//认证-轮播图
$('.carouselFigurePhoto').on('click', function() {
    var num = $('.queueList > ul > li').length
    if (num <= 0) {
        // 请上传轮播图
        pageToastFail(messagesWeb.personalInformation.upload_carousel)
        return;
    }

    var body = new Array()
    $('.queueList > ul > li').each(function(i, item) {
        if (!$(this).find('.error').length) {
            var data = {}
            data.id = $(this).data('id')
            data.path = $(this).data('path')
            data.name = $(this).data('name')
                // data.sort = i
            body.push(data)
        }
    })
    $.ajax({
        type: "post",
        url: "http://" + zMyDomain + "/setting/authHomePicture",
        data: JSON.stringify(body),
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        dataType: "json",
        success: function(data) {
            console.log(data)
            if (data.code != 0) {
                console.log(data.msg)
                pageToastFail(data.msg)
            } else {
                pageToastSuccess(messagesWeb.comment_saved_success);
            }
        }
    })
})

$(function() {
    function setCityDefault(nowProvince, nowCity) {
        if (nowProvince.val() == 0 || nowProvince.val() == 'undefined') {
            nowProvince.val('1')
            nowCity.attr('value', '47')
        } else if (nowCity.attr('value') == 0 || nowProvince.attr('value') == 'undefined') {
            nowProvince.val('1')
            nowCity.attr('value', '47')
        }
        nowProvince.parents('.city-box').find("a[data-code=" + nowProvince.val() + "]").click();
        nowCity.parents('.city-box').find("a[data-code=" + nowCity.attr('value') + "]").click();
    }
    setCityDefault($('#province-picker-home'), $('#city-picker-home'));
    setCityDefault($('#province-picker-now'), $('#city-picker-now'));

})