function successFn(data) {
	$("#up-classify-add").addClass('hide');
	$('.classified-display').removeClass('hide');
	$('.custom-selectcon li').removeClass('active');
	var selectOption = '<li data-id="' + data.id + '" class="active">' + data.name + '</li>';
	$('.custom-selectcon>ul').append(selectOption)
	$(".custom-select li .custom-current-type").html(data.name)
	$('#up-classify-add .text-complete').addClass('disabled');
}

function cancelFn() {
	$("#up-classify-add").addClass('hide');
	$('.classified-display').removeClass('hide');
}

function characterRestriction() {
	var workName = parseInt($('#form-data-title').siblings('.count').html());
	if (workName < 0) {
		// 作品名称最多50个字符;
		pageToastFail(messagesWeb.uploadWorksOrArticles.work_name_restrictions);
		return false;
	}
	var workDescription = parseInt($('#form-data-description').siblings('.count').html())
	if (workDescription < 0) {
		// 作品说明最多2000个字符;
		pageToastFail(messagesWeb.uploadWorksOrArticles.description_work);
		return false;
	}
	if (parseInt($('input[name=addtype]').siblings('.count').html()) < 0) {
		// 请输入12个汉字或24个字符;
		pageToastFail(messagesWeb.addtype_common_tips);
		return false;
	}
}

// 添加作品注释******************
function addDes(li) {
	var $li = li;
	// if($li.find('.error').length ==0){
	if ($li.attr('data-description')) {
		$li.append('<div class="success">' +
			'<span class="adddes" data-modify="1">' + messagesWeb.uploadWorksOrArticles.annotations1 + '</span></div>');
	} else {
		$li.append('<div class="success">' +
			'<span class="adddes">' + messagesWeb.uploadWorksOrArticles.annotations2 + '</span></div>');
	}
	$('.success').on('click', function() {
			$li = $(this).parents('li');
			$_this = $(this).find('.adddes');
			$add = $('.workimg-con');
			$left = $(this).parents('li').offset().left - $('.workimg-con').offset().left + 20;
			if($('#container').width() - $(this).parents('li').width() - $(this).parents('li').position().left <= 240){
				$left = $left - 163
				self.temporaryOnOff = false;
			}else{
				self.temporaryOnOff = true;
				}
			$top = $(this).parents('li').offset().top - $('.workimg-con').offset().top + 195;
			reDes($li);
			var val = $('.addNote .text').val();
			$('.addNote .text').val('').focus().val(val);
		})
		// }

}
//是否修改注释
function reDes(li) {
	var $li = li;
	if ($('.addNote').length == 0) {
		if ($_this.attr('data-modify') == 1) {
			//如果是修改注释执行以下
			$add.append('<div class="addNote" style="position:absolute;top:' +
				$top + 'px;left:' + $left + 'px"><br><div class="description-box"><textarea class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)">' +
				$li.attr('data-description') + '</textarea></div>' + '<span class="btn-default-main submit">' + messagesWeb.common_submit + '</span></div>');
			$add.find('.text').css('height', $add.find('.text').scrollTop() + $add.find('.text')[0].scrollHeight + 'px');
			if ($add.find('.text').scrollTop() + $add.find('.text')[0].scrollHeight < 85) {
				$add.find('.text').css('overflow', 'hidden');
			} else {
				$add.find('.text').css('overflow', 'auto');
			}
		} else {
			$add.append('<div class="addNote" style="position:absolute;top:' + $top + 'px;left:' +
				$left + 'px"><br><div class="description-box"><textarea  class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)">' +
				'</textarea></div>' + '<span class="btn-default-main submit">' + messagesWeb.common_submit + '</span></div>');
		}
		backShow($li);
		$(".addNote").click(function(event) {
			event.stopPropagation();
		});
	} else {
		$('.addNote').remove();
		if ($_this.attr('data-modify') == 1) {
			//如果是修改注释执行以下
			$add.append('<div class="addNote" style="position:absolute;top:' +
				$top + 'px;left:' + $left + 'px"><br><div class="description-box"><textarea class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)" >' +
				$li.attr('data-description') + '</textarea></div>' + '<span class="btn-default-main submit">' + messagesWeb.common_submit + '</span></div>');
		} else {
			$add.append('<div class="addNote" style="position:absolute;top:' + $top + 'px;left:' +
				$left + 'px"><br><div class="description-box"><textarea  class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)">' +
				'</textarea></div>' + '<span class="btn-default-main submit">' + messagesWeb.common_submit + '</span></div>');
		}
		backShow($li);
		$(".addNote").click(function(event) {
			event.stopPropagation();
		});
		
	}
	if(self.temporaryOnOff == false){
		$('.workimg-con .addNote').addClass('triangle_style')
	}
	zCharCount_withExceedCount($(".addNote textarea"), {
		allowed: 1000
	});
}
//注释回显
function Explanatory() {
	var addExplanatory = parseInt($('.workimg-con .addNote textarea').siblings('.count').html())

	if (addExplanatory < 0) {
		// 作品注释最多1000个字符
		pageToastSuccess(messagesWeb.uploadWorksOrArticles.notes_on_works);
		return false;
	}
}

function backShow(li) {
	var $li = li;
	if ($('.addNote .submit').length) {
		$('.addNote .submit').on('click', function() {
			if ($('.text').val().replace(/\s+/g, "").length != 0 && Explanatory() != false) {
				$_this.html(messagesWeb.uploadWorksOrArticles.annotations1).attr('data-modify',1);

				$li.attr('data-description', $('.text').val());
				$li.find('.file-panel').stop().animate({
					height: 0
				});
				$('.adddes').css('fontSize', '0');
				$('.success').animate({
					height: 0
				});
				$('.addNote').remove();
			}

		})
	}
}

// 添加作品注释*********************end

$(function() {
	// 判断作品名称类。。。input
	function empy(obj, parentObj) {
		var workName = $.trim(obj.val());
		if (workName == "") {
			obj.parents(parentObj).find('.error-prompt').show();

		} else {
			obj.parents(parentObj).find('.error-prompt').hide();
		}
	}
	$('.text-style').on('blur', function() {
		$(this).removeClass('borderred').next().removeClass('warning').removeClass('exceeded')
	})
	$('#form-data-title').on('blur', function() {
		empy($(this), '.work-namebox')
	})
	$('#aricle-brief').on('blur', function() {
		empy($(this), '.aricle-box')
	})
     $('#form-data-summary').on('blur', function() {
         empy($(this), '.aricle-box')
     })
	function inputCheckType() {
		$('#form-data-type-cate-subcate').attr('data-type', $(this).find('input').val());
		$(this).siblings('label').removeClass('radio-0').addClass('radio-1');
		$(this).addClass('radio-0').removeClass('radio-1');
		$('#form-data-type-cate-subcate .type').html($(this).text());
	}

	function inputCheckColor() {
		$('#form-data-colorTheme').attr('data-colorTheme', $(this).find('input').val());
		$(this).siblings('label').removeClass('radio-0').addClass('radio-1');
		$(this).addClass('radio-0').removeClass('radio-1');
	}

	function inputCheckRight() {
		$('#form-data-allowrightclick').attr('data-allowrightclick', $(this).find('input').val());
		$(this).siblings('label').removeClass('radio-0').addClass('radio-1');
		$(this).addClass('radio-0').removeClass('radio-1');
	}

	$('.select-contype label').on('click', inputCheckType);
	$('.colorTheme label').on('click', inputCheckColor);
	$('.allowrightclick label').on('click', inputCheckRight);
	// 取消冒泡
	function cancelbuble(e) {
		e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble = true
	}
	// 取消冒泡
	$('.select-con').on('click', function(e) {
		cancelbuble(e)
	})

	function blockToggle(a, b) {
		if (a.css('display') == 'block') {
			b.removeClass('select-arrowicon-active')
			a.hide();
		} else {

			b.addClass('select-arrowicon-active')
			a.show();
		}
	}
	// 作品归类
	//$('.moreset-text').on('click', function() {
	//	blockToggle($('#more-set-con'), $(this).find('i'));
	//})

	function ellipsis() {
		if ($('.selectmenu > li').length <= 2) {
			$('.selectmenu > li .selected').css('max-width', 'none');
			$('.selectmenu > li .select-copyright').css('width', 'auto');
		}
	}
	ellipsis()
	$(".selectmenu > li").on('click', function(e) {
		ellipsis()
		var _this = $(this);
		var seleCon = $(this).find('.selected');
		var selectBox = $(this).find('.select-con');
		var thisOneList = selectBox.find('.select-option li');
		var arrow = $(this).find('.select-arrowicon');

		var siblingsArrow = $(this).siblings('li').find('.select-arrowicon');
		var oneSelect = selectBox.find('.select-one');
		var oneSelectList = selectBox.find('.select-one .item-list-ul > li');
		var selectContent = $('.bigconbox');
		var twoSelect = selectContent.find('.select-two');
		var optionOriginal = seleCon.html();
		var validateSelect = $(".selectmenu > li .selected[data-validate='need']");
		var validateSelectX = $(".selectmenu > li .selected[data-validate='needx']");
		// var selectCheck = $('.select-option-checkbox');
		// var checkOption = $('.select-option-checkbox > li');
		var checkCon = ' ';
		// needx

		blockToggle(selectBox, arrow)

		siblingsArrow.removeClass('select-arrowicon-active')

		$(this).siblings('li').find('.select-con').hide().find('.select-two').hide();
		thisOneList.on('click', function(e) {
			// ////// 第二个 三个 文章3     文章1
			var oneCon = $(this).html();
			var id = $(this).attr('data-id');
			_this.addClass('active');
			$(this).addClass('active').siblings().removeClass('active');
			arrow.removeClass('select-arrowicon-active');

			if ($(this).parents('.select-option-label').hasClass('select-option-label')) {
				var getTypeText = $('input[name="original-copy"]:checked').parent().text();

				var selectedCon = getTypeText + "/" + oneCon;

				seleCon.html(selectedCon);
			} else {
				seleCon.html($(this).text());
				$(seleCon).attr('data-id', id);
			}

			selectBox.hide();
			// selectSpace()
			cancelbuble(e);
		})
		if (twoSelect.length > 0) {
			twoSelect.hide()
			selectBox.css({
				"width": oneSelect.width()
			})
			oneSelectList.on('click', function(e) {
				//    //第一
				var oneCon = $(this).html();
				var oneId = $(this).attr('data-id');
				var index = $(this).index();

				$(this).addClass('active').siblings().removeClass('active')

				twoSelect.eq(index).show().siblings().hide();
				oneSelect.siblings('.bigconbox').show();
				selectBox.css({
					"width": oneSelect.width() + parseInt(oneSelect.siblings('.bigconbox').width()) + 1
				})
				if($('.bigconbox ul:visible').height() < selectBox.find('.menu-item-box').height()){
                    $('.special-pull-down').css({
                        'height':selectBox.find('.select-one').height()
                    })
                    $('.bigconbox').css({
                        'height':selectBox.find('.menu-item-box').height()
                    })
                }else{
                    $('.bigconbox').css({
                        'height':'auto'
                    })
                    $('.special-pull-down').css({
                        'height':'auto'
                    })
                }
				var twoSelectList = twoSelect.eq(index).find('li')

				twoSelectList.on('click', function(e) {
					// 第一个的二级
					$('.bigconbox .active').removeClass('active');
					$(this).addClass('active').siblings().removeClass('active')
					var twoCon = $(this).html();
					var twoId = $(this).attr('data-id');
					arrow.removeClass('select-arrowicon-active');
					_this.addClass('active');

					var getTypeText = $('.select-contype .radio-0').text();

					var selectedCon = "<span class='type'>" + getTypeText + "</span>" + "/" + oneCon + "/" + twoCon;
					seleCon.html(selectedCon);
					$('#form-data-type-cate-subcate').attr({
						'data-cate': oneId,
						'data-subcate': twoId
					})
					$('.selectmenu').next('.error-prompt').hide();
					$(this).parents('.select-con').hide();
					oneSelect.siblings('.bigconbox').hide();

					cancelbuble(e);

				})
				cancelbuble(e);


			})
		}
		// checkOption.on('click', function() {
		// 	checkCon = " "
		// })

		// function selectFn() {
		// 	// ;;;;;  文章2

		// 	var selectCheckBox = checkOption.find('label');

		// 	if (selectCheckBox.hasClass('check-cd')) {
		// 		$('.select-option-checkbox').parents('li').find('.selected').html("")
		// 		for (var i = 0; i < checkOption.length; i++) {
		// 			if (checkOption.eq(i).find('label').hasClass('check-cd')) {
		// 				if (checkCon == " ") {
		// 					checkCon = checkCon + checkOption.eq(i).find('label').text();
		// 				} else {
		// 					checkCon = checkCon + "/" + checkOption.eq(i).find('label').text();
		// 				}
		// 			}
		// 		}
		// 		$('.select-option-checkbox').parents('li').find('.selected').html(checkCon)
		// 		arrow.removeClass('select-arrowicon-active')
		// 		selectBox.hide()
		// 	} else {

		// 	}
		// }
		// selectContrim.on('click', function() {
		// 	selectFn()
		// })
		$(document).on('click', function() {
			if (validateSelect.attr('data-subcate') == 0) {

				$('.selectmenu').next('.error-prompt').show()
			} 
			// else if (validateSelect.html() == "选择文章类型" || validateSelectX.html() == "选择所属领域") {

			// 	$('.selectmenu').next('.error-prompt').show()
			// } 
			else {

				$('.selectmenu').next('.error-prompt').hide()
			}
			// var selectCheckBox = checkOption.find('label');
			// if (!selectCheckBox.hasClass('check-cd')) {

			// 	selectContrim.parents('li').find('.selected').html('选择所属领域')

			// } else {
			// 	checkCon = " "
			// 	selectFn()
			// }

			selectBox.hide();
			oneSelect.siblings('.bigconbox').hide();

		})
		cancelbuble(e)

	})
	zCharCount_withExceedCount($("#form-data-title"), {
		allowed: 50
	});
	zCharCount_withExceedCount($("#form-data-sourceurl"), {
		allowed: 100
	});
	zCharCount_withExceedCount($("#workmark"), {
		allowed: 16
	});
	// zCharCount_withExceedCount($("#newtype-text"), {
	// 	allowed: 12
	// });
	zCharCount_withExceedCount($("#note-text"), {
		allowed: 100
	});
	zCharCount_withExceedCount($(".work-discriptionbox textarea:first"), {
		allowed: 2000
	});
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
			this.labelling.val(messagesWeb.upload_label + '(' + this.tagNum + ')')
				// this.textnum = ;

		},
		disabledBtnFn: function() {
			var me = this;
			this.workmark.on('keyup', function() {
				count = parseInt($(this).parent().find('.count').html());
				if (count < 0) {
					me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
				} else if ($(this).val() != "") {
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
				count = parseInt($(this).parent().find('.count').html());
				// me.workmark.siblings('.counter').html(me.textnum)
				// var inputTag = me.workmark.val()
				var inputTag;
                if(me.workmark.val().trim() == ""){
                    return;
                }else{
                    inputTag = $('#workmark').val();

                }
				tags.push(inputTag)
				localStorage.setItem('tag', JSON.stringify(tags));
				me.workmark.val('')
				me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
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
					// 超出允许字符数限制
					pageToastFail(messagesWeb.textFieldPrompt.character_limit);
				} else {
					if (flag) {
						AddTag(inputTag, me.workcon);
					}
				}

				me.fn1()
				if (me.tagNum == 0) {
					me.labelling.hide()
					me.disbled.show()
				}
				me.tagClose()
			})
			$('#workmark').on('keydown', function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];

				if (e.keyCode == 13 || e.keyCode == 32) {
					e.preventDefault()

					count = parseInt($(this).parent().find('.count').html());
					// var inputTag = me.workmark.val()
					var inputTag;
					if(me.workmark.val().trim() == ""){
					    return;
					}else{
					    inputTag = $('#workmark').val();
					}
					tags.push(inputTag)
					localStorage.setItem('tag', JSON.stringify(tags));
					me.workmark.val('')
					me.labelling.attr('disabled', 'disabled').addClass('disabled-color');
					if (!validateTag(inputTag)) {
						return;
					}
					if (me.tagNum == 0) {
						return;
					}
					if (count < 0) {
						// 超出允许字符数限制
						pageToastFail(messagesWeb.textFieldPrompt.character_limit);
					} else {
						if (flag) {
							AddTag(inputTag, me.workcon);
							me.fn1()
							if (me.tagNum == 0) {
								me.labelling.hide()
								me.disbled.show()
								return;
							}
						}
					}
					me.tagClose()
				}
			})

			function validateTag(inputTag) {
				var flag = true
				for (var i = 0; i < $('.mark-con').find('span').length; i++) {
					if (inputTag != $($('.mark-con').find('span')[i]).attr('title')) {
						// flag = true;
						// continue;
					} else {
						flag = false;
						// 标签不能重复;
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
				event.target
				$(event.target).parents('.mark').remove();
				if (me.tagNum == 0) {
					me.labelling.show()
					me.disbled.hide()
				}
				me.fn1()
			})
		}
	}
	new Labelling({
			labelling: $('.mark-btn'),
			workmark: $('#workmark'),
			workcon: $('.mark-con'),
			disbled: $('.work-markbox .mark-disabled')
		})
		// 贴标签  end

	function AddTag(inputc, workc) {
		inputc = html_encode(inputc)
		if (inputc != "") {
			var appendTag = '<span class="mark" title="' + inputc + '">' + inputc + ' <i></i></span>'
			workc.append(appendTag)
		}
	}



	function searchEquipmentAndShowSelect(nameStr) {
		var eq = [];
		$.get('http://' + zMyDomain + '/devices/search?name=' + nameStr, function(data) {
			if (data.data.length > 0) {
				$('.eq-matebox ul').show();
				$('.eq-matebox .empty').hide();
				for (var i = 0; i < data.data.length; i++) {
					eq.push('<li data-id="' + data.data[i].id + '">' + data.data[i].name + '</li>')
				}
				$('.eq-matebox ul').html(eq.join(''));
				for (var i = 0; i < $('.equipment-listcon .mark').length; i++) {
					for (var j = 0; j < $('.eq-matebox li').length; j++) {
						if ($($('.equipment-listcon .mark')[i]).attr('data-id') == $($('.eq-matebox li')[j]).attr('data-id')) {
							$($('.eq-matebox li')[j]).addClass('equipment-list-disabled');
						}
					}
				}
			} else {
				$('.eq-matebox ul').hide();
				$('.eq-matebox .empty').show();
			}

		})
	}

	function fillEquipmentToInput(eventEle) {
		$(eventEle).addClass('active').siblings('li').removeClass('active')
		$('#equipment').val($(eventEle).html());
		$('#equipment').attr('data-id', $(eventEle).attr('data-id'));
		$('.add-equipment .eq-matebox').hide()
		$('#equipment').focus()
		zcEquipment.derail = 0;
	}

	function addEquipment(dataId, dataName) {
		var appendTag = '<span class="mark" title="' + dataName + '" data-id="' + dataId + '"><span>' + dataName + '</span> <i></i></span>'
		$('.equipment-listcon').append(appendTag);
		nowEquipment();
		updateEquipmentNumber();
	}

	function addSelectedEquipment(event) {
		if ($(event.target)[0] != $(this)[0]) {
			var onoff = true;
			var tagconlist = $('.equipment-listcon').find('.mark');
			var myVal = $(event.target).html();
			var myId = $(event.target).attr('data-id');
			if (!$(event.target).hasClass('disabled')) {
				if (tagconlist.length >= 5) {
					$('.mymyequipment span').unbind('click');
				} else {
					for (var z = 0; z < tagconlist.length; z++) {
						if (tagconlist.eq(z).attr('data-id') == myId) {
							onoff = false;
						}
					}

					if (onoff == true) {
						addEquipment(myId, myVal)
						$(event.target).addClass('disabled')
						for (var j = 0; j < $('.add-equipment .eq-matebox').find('li').length; j++) {
							if ($('.add-equipment .eq-matebox').find('li').eq(j).attr('data-id') == myId) {

								$('.add-equipment .eq-matebox').find('li').eq(j).addClass('equipment-list-disabled');
							}
						}
					}
				}
			}
		}
	}

	function updateEquipmentNumber() {
		var nowEquipment = $('#form-data-software').find('.mark').length;
		var numberOfTag = $('.equipment-listcon').find('.mark').length;
		zcEquipment.tagNum = 5 - numberOfTag;
		if (numberOfTag == 0) {
			zcEquipment.tagNum = 5 - nowEquipment;
		}
		$('.add-equipmentbtn').val(messagesWeb.upload_add + '(' + zcEquipment.tagNum + ')');
		$('#show-now-equipment').val(messagesWeb.upload_also_add + zcEquipment.tagNum + messagesWeb.upload_also_add2);
		if (zcEquipment.tagNum != 0) {
			$('.add-equipmentbtn').show()
			$('.equipment-disabled').hide()
		} else {
			$('.add-equipmentbtn').hide()
			$('.equipment-disabled').show()
		}
	}

	function btnAddEquipment() {
		var onoff = true;
		var tagconlist = $('.equipment-listcon').find('.mark');
		var inputValue = $('#equipment').val();

		$('.eq-matebox li').each(function(i, ele) {

			if (inputValue == $($('.eq-matebox li')[i]).html()) {
				$('#equipment').attr('data-id', $($('.eq-matebox li')[i]).attr('data-id'))
				var dataId = $('#equipment').attr('data-id');

				for (var z = 0; z < tagconlist.length; z++) {
					if (tagconlist.eq(z).attr('data-id') == dataId) {
						onoff = false;
					}
				}

				if (onoff == true) {
					$('#equipment').val('').focus();
					addEquipment(dataId, inputValue);
					$($('.eq-matebox li')[i]).addClass('equipment-list-disabled').removeClass('active');
					$('.add-equipment .eq-matebox').hide();

					for (var j = 0; j < $('.mymyequipment span').length; j++) {
						if ($($('.mymyequipment span')[i]).attr('data-id') == dataId) {

							$($('.mymyequipment span')[i]).addClass('disabled')
						}
					}
				}

			}

		})

	}
	// 添加按钮点击
	// $('.add-equipmentbtn').on('click', function(e) {

	// 	btnAddEquipment()
	// 	cancelbuble(e)
	// })

	function removeEquipment(eventEle, pendingUpdateEqm, deletingEqm, id, name) {
		if (eventEle.nodeName == 'I') {
			var currentTag = $(eventEle).parents('.mark');
			currentTag.remove();
			$(pendingUpdateEqm).html(deletingEqm.html())
			if ($('.now-equipment').find('.mark').length >= 5) {
				$('.add-equipmentb').addClass('disabled').attr('disabled', 'disabled');
			} else {
				$('.add-equipmentb').removeClass('disabled').removeAttr('disabled')
			}
			updateEquipmentNumber()
			for (var i = 0; i < $('.eq-matebox li').length; i++) {
				if ($($('.eq-matebox li')[i]).attr('data-id') == currentTag.attr('data-id')) {
					$($('.eq-matebox li')[i]).removeClass('equipment-list-disabled');
				}
			}
			for (var i = 0; i < $('.mymyequipment span').length; i++) {
				if ($($('.mymyequipment span')[i]).attr('data-id') == currentTag.attr('data-id')) {
					$($('.mymyequipment span')[i]).removeClass('disabled');
				}
			}
			if (zcEquipment.tagNum != 0) {
				$('.mymyequipment>span').bind('click', addSelectedEquipment)
			}

		}
	}

	function nowEquipment(pendingUpdateEqm, deletingEqm) {
		var nowTagCon = $('.equipment-listcon').html();
		$('.now-equipment').html(nowTagCon)
		if ($('.now-equipment').find('.mark').length >= 5) {
			$('.add-equipmentb').addClass('disabled').attr('disabled', 'disabled');
		} else {
			$('.add-equipmentb').removeClass('disabled').removeAttr('disabled')
		}
	}

	// 删除按钮点击
	$('.now-equipment').on('click', function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			var eventEle = e.target;
			removeEquipment(eventEle, $('.equipment-listcon'), $('.now-equipment'));
		})
		// 删除按钮点击
	$('.equipment-listcon').on('click', ' .mark i', function(event) {
			var event = event || window.event || arguments.callee.caller.arguments[0];
			var eventEle = event.target;
			removeEquipment(eventEle, $('.now-equipment'), $('.equipment-listcon'));
			cancelbuble(event);
		})
		// 下拉点击
	$('.eq-matebox').on('click', $('.eq-matebox li'), function(event) {
			var eventEle = event.target;
			if (eventEle.nodeName == "LI") {
				if ($(eventEle).hasClass('equipment-list-disabled')) {
					cancelbuble(event);
				} else {
					
					if($('.equipment-listcon').find('.mark').length >= 5){

						return false;
					}
					fillEquipmentToInput(eventEle);
					btnAddEquipment()
				}
			} else {
				cancelbuble(event);
			}
		})
		//输入框输入内容 —> searchEquipmentAndShowSelect
		//输入框上下键 —> fillEquipmentToInput
		//输入框回车 —> addEquipment
		//添加按钮点击 —> addEquipment
		//下拉点击 —> fillEquipmentToInput
		//待选区点击 —> addEquipment
		//删除按钮点击 —> removeEquipment

	var zcEquipment = {
		tagNum: null,
		derail: 1,
		keyboardControlIndex: -1
	}



	$('.mymyequipment').on('click', $('.mymyequipment .havemark'), addSelectedEquipment)
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
		this.tagNum;
		this.keyUp();
		this.clickAdd();
		return this;
	}
	Equipment.prototype = {
		addEquipmentPop: function() {
			$('.add-equipmentb').on('click', function() {
				showGlobalMaskLayer();
				$('.add-equipment-pop').show();
				var soft = $('.now-equipment').html();
				$('.equipment-listcon').html(soft)
				$('#equipment').val('')
				$('.add-equipment-pop').css('margin-top', -$('.add-equipment-pop').height() / 2)
				if (me.inputbox.val() == "") {
					// me.addbtn.attr('disabled', 'disabled').addClass('disabled-color');
				} else {
					// me.addbtn.removeAttr('disabled').removeClass('disabled-color');
				}
			})
		},
		keyUp: function() {
			me = this;
			this.inputbox.on('keydown', function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];


				// zcEquipment.keyboardControlIndex = -1;
				if (e.keyCode == 38 || e.keyCode == 40) {
					e.preventDefault()
				}
			})
			this.inputbox.on('keyup', function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];


				if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
					e.preventDefault()
				} else {
					me.matecon.show()
					searchEquipmentAndShowSelect($(me.inputbox).val());
					if (me.inputbox.val() == "") {
						me.inputbox.removeAttr('data-id');
						me.matecon.hide()
						me.matelist.removeClass('equipment-list-disabled')
						zcEquipment.keyboardControlIndex = -1;
						// me.addbtn.attr('disabled', 'disabled').addClass('disabled-color');
					} else {
						// me.addbtn.removeAttr('disabled').removeClass('disabled-color');
					}
				}

			})
			$(document).on('click', function() {
				me.matecon.hide();
				me.matelist.removeClass('active');
				$(".selectmenu > li").find('.select-arrowicon').removeClass('select-arrowicon-active');
				zcEquipment.keyboardControlIndex = -1;
			})
		},
		clickAdd: function() {
			var me = this;

			$('#equipment').on('click', function(e) {
					cancelbuble(e)
				})
				// 键盘事件
			$('#equipment').on('keydown', function(event) {
				if($('.eq-matebox .empty').is(':visible') == false){
				var tagLength = $('.equipment-listcon').find('.mark').length;
				var inputV = $('#equipment').val();
				var e = event || window.event || arguments.callee.caller.arguments[0];
				switch (e.keyCode) {
					case 38: //上
						zcEquipment.keyboardControlIndex--
						if (zcEquipment.keyboardControlIndex == -1) {
							zcEquipment.keyboardControlIndex = me.matelist.length - 1;
						}
						if (zcEquipment.keyboardControlIndex == -2) {
							zcEquipment.keyboardControlIndex = me.matelist.length - 1;
						}
						$('#equipment').val($('.eq-matebox li').eq(zcEquipment.keyboardControlIndex).html())
						$('.eq-matebox li').eq(zcEquipment.keyboardControlIndex).addClass('active').siblings().removeClass('active');
						zcEquipment.derail = 1;
						break;
					case 40:

						zcEquipment.keyboardControlIndex++
							if (zcEquipment.keyboardControlIndex == $('.eq-matebox li').length) {
								zcEquipment.keyboardControlIndex = 0
							}
						$('#equipment').val($('.eq-matebox li').eq(zcEquipment.keyboardControlIndex).html())
						$('.eq-matebox li').eq(zcEquipment.keyboardControlIndex).addClass('active').siblings().removeClass('active');

						zcEquipment.derail = 1;
						break;
				}
				if (inputV != "") {
					if (e.keyCode == 13) {
						if (tagLength >= 5) {
							me.matecon.hide()

							e.keyCode = 0;
							return false;
						}
						if (zcEquipment.derail == 1) {
							if (zcEquipment.keyboardControlIndex > -1) {
								var mateListVal = $('.eq-matebox li').eq(zcEquipment.keyboardControlIndex).html()
								me.inputbox.val(mateListVal)
								me.matecon.hide()
								btnAddEquipment()
							}

						} else {
							btnAddEquipment()
						}
						zcEquipment.keyboardControlIndex = -1;
					}
				}
			}


			})

		}
	}
	new Equipment({
			addbtn: $('.add-equipmentbtn'),
			inputbox: $('#equipment'),
			tagcon: $('.equipment-listcon'),
			disbled: $('.equipment-disabled'),
			matecon: $('.add-equipment .eq-matebox'),
			myequipment: $('.mymyequipment')
		}).addEquipmentPop()
		// 添加装备结束
	$('.pop-close').on('click', function() {
			hideGlobalMaskLayer();
			$('.pop-up').hide();
		})
		// end
		
		// 导入视频
		if($('#form-data-productVideos li').length >= 3){
			$('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled');
			 $('.webuploader-element-invisible').attr('disabled',true);
             $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main');
             $('#moviePicker').find(' label').css({'cursor':'default'})
		}else{
			$('.webuploader-element-invisible').removeAttr('disabled');
            $('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main');
			$('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
			$('#moviePicker').find(' label').removeAttr('style');
		}
	$('.leading-vedio').on('click', function() {
		if ($('.movieList li').length < 3) {
			showGlobalMaskLayer();
			$('.import-vedio').show();
		} else {
			// 视频上传限制数量为3
			pageToastFail(messagesWeb.uploadWorksOrArticles.vedio_limit_num);
			
		}
	});
		
	
	$('.import-vedio .pop-cancel').on('click', function() {
		hideGlobalMaskLayer();
		$('.import-vedio').hide();
	});
	$('.import-vedio .pop-confirm').on('click', function() {
		var importvedioadress = $('#importvedio').val()
		var reg = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		if (reg.test($('#importvedio').val()) && $.trim(importvedioadress) != "") {
			var $li = $('<li id="" data-url="' + importvedioadress + '">' +
				'<div class="filer-name-box">' + '<span class="filer-name">' + importvedioadress + '</span>' + '</div>' +
				'<i class="cancel closebtn vedio-close"></i><div class="upstatusbox">' +
				'<span class="result"></span><span class="progress" style="opacity: 0;"></span><span class="per"></span></div>' +
				'</li>')
			$('.upvedio-status ul').append($li);
			// 导入成功
			$li.find('.result').html(messagesWeb.uploadWorksOrArticles.import_vedio_status);
			if($('.upvedio-status ul li').length){
				// $('.twoleveltitle .error-prompt').addClass('hide');
			}
			if($('#form-data-productVideos li').length >= 3){
				 $('.webuploader-element-invisible').attr('disabled',true);
                 $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main');
				$('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled',true);
				$('#moviePicker').find(' label').css({'cursor':'default'})
			}
			hideGlobalMaskLayer();
			$li.find('.cancel').on('click', function() {
				$(this).parent().remove();
				if($('#form-data-productVideos li').length < 3){
					$('.webuploader-element-invisible').removeAttr('disabled');
                    $('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main');
					$('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
					$('#moviePicker').find(' label').removeAttr('style');
				}
			})
			$('.import-vedio').hide();
			$('#importvedio').val('');
		} else {
			$('.import-vedio').find('.error').removeClass('hide');
		}
	});
	$('.import-status ul').on('click', 'li .cancel', function(file) {
		$(this).parent().remove();
	});
	// 更多设置的新建分类
	// var oldType = null;
	$('#add-type-btn').on('click', function() {
		$('.classified-display').addClass('hide');
		$("#up-classify-add").removeClass('hide');
		addCateDiv($("#up-classify-add"), successFn, cancelFn);
	})

	~ function classificationWorks() {
		var customSelectCon = $('.custom-selectcon');
		var customUl = $('.custom-selectcon>ul');
		var customLi = $('.custom-select li');

		customLi.on('click', function(e) {
			if ($(this).parent().hasClass('custom-select')) {
				e.stopPropagation();
			}
			if ($('.custom-select .select-con').css('display') == 'none') {
				$('.custom-select .select-con').css('display', 'block');
				if($('.custom-select .select-con li').length > 5){
                    $('.custom-select .select-con ul').addClass('scrollbar');
                }
			} else {
				$('.custom-select .select-con').css('display', 'none');
			}
		})
		$(document).click(function() {
			$('.custom-select .select-con').css('display', 'none');
		});

		customUl.on('click', function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];

			if (e.target.nodeName == 'LI') {
				$('.custom-select li .custom-current-type').html($(e.target).html());
				$('#form-data-mycate').attr('data-id', $(e.target).attr('data-id'));
				customSelectCon.hide();
				$(e.target).addClass('active').siblings('li').removeClass('active');
				$('.custom-select>li .select-arrowicon').removeClass('select-arrowicon-active');
			}

		})
	}();


	function uploadProgressStatusTips(){
			if($('#form-data-productImages li.state-progress').length != 0 || $('#form-data-productVideos .progress[style!="opacity: 0;"]').length != 0 || $('#coverPicker').is('.status-progress') || $('.upattastatus .progress:visible').length){
				return false;
			}
		}
	$('.upcoverbtn').on('click', function() {
		$('.btn-submit .pop-confirm').removeAttr('disabled').val(messagesWeb.common_btn_confirm).removeClass('cursor-default');
		$('.editor-portrait').removeClass('hide');
		showGlobalMaskLayer();
		$('.editor-portrait').show();
		var hidden = $('#upload-card-data-hidden');
		var dataTitle = $("#form-data-title").val();
		// 标题
		$(".img-preview-wrap .data-title").html(dataTitle).attr("title", dataTitle).css('width', '178px');
		// 类别
		$(".img-preview-wrap .data-type-cate-subcate").html($("#form-data-type-cate-subcate").html());
		// 数量
		$(".img-preview-wrap .data-viewCount").html(hidden.attr('data-viewcount')).attr("title", hidden.attr('data-viewcountstr'));
		$(".img-preview-wrap .data-commentCount").html(hidden.attr('data-commentcount')).attr("title", hidden.attr('data-commentcountstr'));
		$(".img-preview-wrap .data-recommendCount").html(hidden.attr('data-recommendcount')).attr("title", hidden.attr('data-recommendcountstr'));
		// 作者
		$(".img-preview-wrap .data-member").contents().filter(function() {
			return (this.nodeType == 3);
		}).remove();
		$(".img-preview-wrap .data-member").append(hidden.attr('data-member-username'))
			.attr("title", hidden.attr('data-member-username')).attr("href", hidden.attr('data-member-pageurl'));
		$(".img-preview-wrap .data-member-avatar").attr("src", hidden.attr('data-member-avatar'));
		// 发布时间
		$(".img-preview-wrap .data-publishTime").html(hidden.attr('data-publishtimediffstr')).attr("title", hidden.attr('data-publishtime'));
	})

	function productImages() {
		var productImages = [];
		var queue = $('#form-data-productImages li:not(".sortable-placeholder")')
		for (var i = 0, len = queue.length; i < len; i++) {
			if ($(queue[i]).attr('data-id') && !$(queue[i]).find('.error').length) {
				var obj = {
					'id': $(queue[i]).attr('data-id'),
					'description': $(queue[i]).attr('data-description')
				};
				productImages.push(obj);
			}
		}
		return productImages;
	}

	function productVideos() {
		var productVideo = [];
		var qeue = $('#form-data-productVideos li');
		for (var i = 0; i < qeue.length; i++) {
			var obj = {};
			obj.id = $(qeue[i]).attr('data-id');
			obj.videoId = $(qeue[i]).attr('data-videoid');
			obj.url = $(qeue[i]).attr('data-url');
			obj.name = $(qeue[i]).attr('data-name');
			productVideo.push(obj)
		}
		return productVideo;
	}

	function softId() {
		var soft = []
		$('#form-data-software span').each(function(i, j) {
			if ($(j).attr('data-id')) {
				soft.push($(j).attr('data-id'));
			}
		})
		return soft.join(',');
	}

	function addLabel() {
		var labels = []
		$('#form-data-productTags span').each(function(i, j) {
			var obj = {
				"id": $(j).attr('data-id'),
				"name": $(j).attr('title')
			}
			labels.push(obj);
		})
		return labels;
	}

	function submit(url, refTo, ele) {
		var body = {},
			required = [],
			btn = $(this);
		required[0] = body.title = $('#form-data-title').val() == '' ? null : (/[^\s]+/.test($('#form-data-title').val())) ? $('#form-data-title').val() : null;
		required[1] = body.productImages = productImages();
		required[2] = body.type = parseInt($('#form-data-type-cate-subcate').attr('data-type'));
		required[3] = body.cate = $('#form-data-type-cate-subcate').attr('data-cate') ? parseInt($('#form-data-type-cate-subcate').attr('data-cate')) : null;
		required[4] = body.copyright = parseInt($('#form-data-copyright').attr('data-id'));
		required[5] = body.coverName = $('#form-data-cover').attr('data-coverName') ? $('#form-data-cover').attr('data-coverName') : null;
		required[6] = body.coverPath = $('#form-data-cover').attr('data-coverPath') ? $('#form-data-cover').attr('data-coverPath') : null;
		body.id = parseInt($('#form-data-id').attr('value'));
		body.allowrightclick = parseInt($("#form-data-allowrightclick").attr('data-allowrightclick'));
		body.colorTheme = parseInt($("#form-data-colorTheme").attr('data-colorTheme'));
		body.description = $('#form-data-description').val();
		body.designTime = $("#form-data-designTime").val() ? parseInt(new Date($("#form-data-designTime").val()).getTime()) : null;
		body.fileId = $('#form-data-fileId').attr('fileid') ? parseInt($('#form-data-fileId').attr('fileid')) : null;
		body.mycate = parseInt($('#form-data-mycate').attr('data-id'));
		body.productVideos = productVideos();
		body.relObjectId = parseInt($('#form-data-relObjectId').attr('value'));
		body.zteamId = $('#form-data-zteamId').attr('data-id') ? parseInt($('#form-data-zteamId').attr('data-id')) : null;
		body.productTags = addLabel();
		body.software = softId();
		body.subcate = $('#form-data-type-cate-subcate').attr('data-subcate') ? parseInt($('#form-data-type-cate-subcate').attr('data-subcate')) : null;

		if (!required[0] || required[0] == '') {
			$('.work-namebox .work-nametips').removeClass('hide');
			$(document).scrollTop($('.work-namebox .work-nametips').offset().top - 20);
			return;
		} else if (!required[2] || !required[3]) {
			$('.work-selectbox .error-prompt').removeClass('hide');
			// pageToastFail('请选择作品类型');
			$(document).scrollTop($('.work-selectbox .error-prompt').offset().top - 20);
			
			return;
		} else if (!required[1].length) {
			$('.work-imgbox .error-prompt').removeClass('hide');
			$(document).scrollTop($('.work-imgbox .error-prompt').offset().top - 20);
			return;
		} else if (!required[5]) {
			$('.workup-con').find('.error-prompt').removeClass('hide');
			// console.log($($('.work-verify')[5]).find('.error-prompt').offset());
			$(document).scrollTop($('.workup-con').find('.error-prompt').offset().top - 20);
			return;
		} else {
			if (ele[0] == $('.publishbtn')[0]) {
				$('.publishbtn').off('click').addClass('btn-default-loading').attr('disabled', true).val(messagesWeb.uploadWorksOrArticles.btn_announcing);
			} else {
				newWin = window.open('');
			}
			ajax(url, refTo, body);
		}
	}

	function ajax(url, refTo, body) {
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(body),
			dataType: "json",
			contentType: 'application/json',
			success: function(data) {
				// console.log(typeof data.data)
				if ((typeof data.data) == 'string') {
					newWin.location.href = refTo + data.data;
				} else {
					location.href = refTo;
				}
			}
		});
	}
	$('.publishbtn').on('click', function(e) {
		e.preventDefault();
		showRemindBindLayer(publishUnbindTis)
		function publishUnbindTis(){
			if(uploadProgressStatusTips() == false){
				// 上传中，请稍后发布
				pageToastFail(messagesWeb.uploadWorksOrArticles.upload_a_hint);
			}
			if (!$('#form-data-fileId .tips').is('.status-progress')) {
				if (characterRestriction() != false && uploadProgressStatusTips() != false) {
					submit('http://' + zMyDomain + '/uploadProduct', 'http://' + zMyDomain + '/works', $(this));
				}
			} else {
				// 附件正在上传中
				pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_upload);
			}
		}
	});
	$('.previewbtn').on('click', function(e) {
		e.preventDefault();
		showRemindBindLayer(publishUnbindTis)
		function publishUnbindTis(){
			if(uploadProgressStatusTips() == false){
				// 上传中，请稍后预览
				pageToastFail(messagesWeb.uploadWorksOrArticles.upload_in_preview)
			}
			if (!$('#form-data-fileId .tips').is('.status-progress')) {
				if (characterRestriction() != false && uploadProgressStatusTips() != false) {
					submit('http://' + zMyDomain + '/previewProduct', 'http://' + zMyDomain + '/preview/product/', $(this));
				}
			} else {
				// 附件正在上传中
				pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_upload);
			}
		}
	});
	$('.movieList li').find('.cancel').on('click', function() {
		$(this).parent().remove();
		if($('#form-data-productVideos li').length < 3){
			$('.webuploader-element-invisible').removeAttr('disabled');
			$('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main');
			$('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
			$('#moviePicker').find(' label').removeAttr('style');
		}
	});
	addDes($('.filelist li'));
	$(document).click(function() {
		if ($('.addNote').length) {
			$('.addNote').remove();
		}
	});
	$(".success").click(function(event) {
		event.stopPropagation();
	});

	$('.btn-reset').click(function() {
		if(!$('.editor-portrait .pop-confirm').prop('disabled')){
			$('#inputImage').click();
		}else{
			pageToastFail(messagesWeb.uploadWorksOrArticles.uploading_text)
		}
	})


	$('.filelist li').on('mousemove', function() {
		$(this).find('.file-panel').css({
			height: 30
		});
		$(this).find('.adddes').css('fontSize', '14px');
		$(this).children('.success').css({
			height: 40,
			opacity: 0.8
		});
	});

	$('.filelist li').on('mouseleave', function() {
		$(this).find('.file-panel').css({
			height: 0
		});
		$(this).find('.adddes').css('fontSize', '0');
		$(this).children('.success').css({
			height: 0
		});
	});

	$('.filelist li').find('.file-panel').on('click', 'span', function() {
		$(this).parent().parent().remove();
	});

	$(document).ready(function(e) {



		$("#form-data-designTime").jeDate({
			isinitVal: false,
			ishmsVal: false,
			festival: false, //节日
			isToday: true,
			minDate: '',
			maxDate: $.nowDate(0),
			format: "YYYY-MM-DD",
			zIndex: 3000,
			choosefun: function(elem, val) {
				elem.css({
					'opacity': '1',
					'width': 'auto'
				})
			},
		});
		if ($('.textarea-style')[0].scrollHeight > 135) {
			$('.textarea-style').css({
				'overflow': 'auto',
				'height': '135px'
			});
		} else if ($('.textarea-style')[0].scrollHeight < 135 && $('.textarea-style')[0].scrollHeight > 48) {
			$('.textarea-style').css('height', $('.textarea-style')[0].scrollHeight + 'px');
		} else {
			$('.textarea-style').css('height', '44px');
		}
	});
	var appendixXhr;
	$('#file').change(function(e) {
		var fileName = $('#file')[0].files[0].name;
		var fileNum = $('#file')[0].files[0].name.lastIndexOf('.');
		var extend = fileName.substring(fileNum);
		if (extend == '.rar' || extend == '.zip') {
			var size = $('#file')[0].files[0].size / 1024 / 1024;
			if (size < 20) {
				$('.upattastatus .progress').css('display', 'inline-block');
				$('.upattastatus .percent').css('display', 'inline-block');
				$('.upattastatus .closebtn').parent().css('display', 'inline-block');
				$('.upattastatus .closebtn').css('display', 'inline-block');
				$('.statustext label').find('.name').css('width', '0');
				var formData = new FormData();
				formData.append('file', $('#file')[0].files[0]);
				var appendixXhr = new XMLHttpRequest();

				appendixXhr.onreadystatechange = function() {
					if (appendixXhr.readyState == 4 && appendixXhr.status == 200) {
						// console.log(appendixXhr.responseText);
						var res = JSON.parse(appendixXhr.responseText);
						$('.percent').html('100%');
						$('.statustext').attr('fileid', res.fileid)
						$('.upattastatus .progress').css('display', 'none');
						$('.upattastatus .percent').css('display', 'none');
						$('.statustext').find('.name').css('width', '345px');
						$('.statustext').find('.name').html('<span class="rar-icon"></span>' + fileName);
						$('.statustext').find('.name').css('display', 'inline');
						$('.statustext label .tips').html(messagesWeb.uploadWorksOrArticles.upload_sucess_text);
						$('#file').val('');
					}
				}

				appendixXhr.upload.onprogress = function(event) {　　　　
					if (event.lengthComputable) {　　　　　　
						var complete = (event.loaded / event.total * 100 | 0) - 1;　　　　　　
						$('.filling-progress').css('width', complete + '%');
						$('.percent').html(complete + '%');
						$('.statustext label').find('.tips').html(messagesWeb.uploadWorksOrArticles.uploading_text);
						$('#form-data-fileId').addClass('status-progress');　　　
					}　　
				};

				appendixXhr.open('POST', 'http://' + zMyDomain + '/upload/fileReceiver?fileType=file_n&qqfile=beijing-hyundai.rar', true);

				appendixXhr.setRequestHeader("X-File-Name", encodeURIComponent(fileName));

				appendixXhr.send(formData);

				
			} else {
				// 附件上传超过大小限制
				pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_size_limit);
				$('#file').val('');
			}
		} else {
			// 附件上传仅支持RAR/ZIP格式
			pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_format);
			$('#file').val('');
		}
	})
	$('.upattastatus .closebtn').on('click', function() {
		appendixXhr&&appendixXhr.abort();
		$('.upattastatus .progress').css('display', 'none');
		$('.upattastatus .percent').css('display', 'none');
		$('.upattastatus .closebtn').css('display', 'none');
		$('.statustext label').find('span').html(' ');
		$('.statustext label .tips').html(messagesWeb.uploadWorksOrArticles.attachment_copy);
		$('.filling-progress').css('width', 0 + '%');
		$('.percent').html('');
		$('.upattastatus .name').css('display', 'none');
		$('.upattastatus .closebtn').parent().css('display', 'none');
		$('#file').val('');
		$('#form-data-fileId').attr('fileid', 0);
		
	})
})

$('#form-data-fileId .tips').click(function() {
	$('#file').click();
})

$('#form-data-productImages').sortable("destroy");
$('#form-data-productImages').sortable({
	containment: ".filelist"
});

