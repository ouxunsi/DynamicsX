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
     var articleName = parseInt($('#form-data-title').siblings('.count').html());
     if (articleName < 0) {
        // 文章标题最多50个字符;
         pageToastSuccess(messagesWeb.uploadWorksOrArticles.article_name_restrictions);
         return false;
     }
     var articleDescription = parseInt($('#form-data-summary').siblings('.count').html())
     if (articleDescription < 0) {
         pageToastSuccess(messagesWeb.uploadWorksOrArticles.description_article);
         return false;
     }
     var sourceurl = parseInt($('#form-data-sourceurl').siblings('.count').html())
     if (sourceurl < 0) {
         pageToastSuccess(messagesWeb.uploadWorksOrArticles.article_link);
         return false;
     }
 }
 // 取消冒泡
 function cancelbuble(e) {
     e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble = true
 }
 $(function() {
     // 判断作品名称类。。。input
     function empy(obj, parentObj) {
         var workName = $.trim(obj.val());
         if (workName == "") {
			 alert("1111");
             obj.parents(parentObj).find('.error-prompt').removeClass('hide');

         } else {
			 alert("222");
             obj.parents(parentObj).find('.error-prompt').addClass('hide');
         }
     }

     $('.text-style').on('blur', function() {
         $(this).removeClass('borderred').next().removeClass('warning').removeClass('exceeded');
     })
     $('#form-data-title').on('blur', function() {
         empy($(this), '.work-title-box');
     })
     $('#form-data-summary').on('blur', function() {
         empy($(this), '.aricle-box')
     })
     $('#form-data-sourceurl').on('blur', function() {
         if ($('#form-data-type-container').attr('data-type') == 2 && $.trim($(this).val()) == "") {
             $(this).parents('.text-link').find('.error-prompt').removeClass('hide');
         } else {
             $(this).parents('.text-link').find('.error-prompt').addClass('hide');
         }
     })
     $('textarea[name=form-data-memo]').on('blur', function() {
         if ($('textarea[name=form-data-memo]').val() == '') {
             $('.articleWarn').removeClass('hide')
         } else {
             $('.articleWarn').addClass('hide')
         }
     })
     if ($('#form-data-type-container .radio-0 input').val() == 2) {
         $('.link-error-box .redwarn').removeClass('hide');
     } else {
         $('.link-error-box .redwarn').addClass('hide');
     }

     function inputCheck(inputParent, inputName) {
         $(inputParent + ' label').on('click', function() {
             $(this).siblings('label').removeClass('radio-0').addClass('radio-1');
             $(this).addClass('radio-0').removeClass('radio-1');
             $('.selected .type').html($(this).text());
             var type = $('#form-data-type-container .radio-0 input').val();
             if (type == 2) {
                 $('.link-error-box .redwarn').removeClass('hide');
             } else {
                 $('.link-error-box .redwarn').addClass('hide');
             }

             var id = $('#form-data-cate-container li[class="active"]').attr('data-id');
             var getTypeText = $('#form-data-type-container .radio-0').text();
             var oneCon = $('#form-data-cate-container li[class="active"]').html()
             $('#form-data-type-container').attr({
                 'data-type': type,
                 'data-cate': id,
                 'data-info': getTypeText + '-' + oneCon
             })
             $(".selectmenu > li .selected[data-validate='need']").attr('data-cate',id);
         })
     }

     inputCheck('.radio', 'name="radio"');
     inputCheck('.radio', 'name="forbidden-option"');
     inputCheck('.radio', 'name="original-copy"');

     

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
     // 所属领域
     function Trade(limit) {
         if ($('#up-field-data').find('input:checked').parents('label').length >= limit) {


             return 2;
         } else if ($('#up-field-data').find('input:checked').parents('label').length == 0) {


             return 0;
         } else {
             return 1;
         }
     }

     var validateTrade = function(limit, errorEle) {
         if (errorEle) {
             if (Trade(limit) == 2) {
                 $('#up-field-data').find('input:checkbox').not("input:checked").attr('disabled', true).parents('label').addClass('disabled');
                 errorEle.hide()
             } else if (Trade(limit) == 0) {
                 errorEle.show()
             } else {
                 $('#up-field-data').find('input:checkbox').not("input:checked").removeAttr('disabled').parents('label').removeClass('disabled');
                 errorEle.hide();
             }
         } else {
             if (Trade(limit) == 2) {
                 $('#up-field-data').find('input:checkbox').not("input:checked").attr('disabled', true).parents('label').addClass('disabled');
             } else {
                 $('#up-field-data').find('input:checkbox').not("input:checked").removeAttr('disabled').parents('label').removeClass('disabled');
             }
         }


     }
     validateTrade(3)
     $('#up-field-data label').on('click', function() {
             validateTrade(3)
             if ($('#up-field-data').find('input:checked').parents('label').length == 0) {
                 $('#form-data-articlecate-container').attr('data-articlecate', '');
                 $(".selectmenu > li .selected[data-validate='needx']").attr('data-articlecate', '');
             }
         })
         // 作品归类
     $('.moreset-text').on('click', function() {
         blockToggle($('#more-set-con'), $(this).find('i'))
     })
     $('label.label-checkbox').on('click', function() {
         $("input[type='checkbox']").parent().removeClass('check-cd').addClass('check-c')
         $("input[type='checkbox']:checked").parent().removeClass('check-c').addClass('check-cd')
         var type = $('#form-data-type-container .radio-0 input').val();
         var id = $('#form-data-cate-container li[class="active"]').attr('data-id');
         var getTypeText = $('#form-data-type-container .radio-0').text();
         var oneCon = $('#form-data-cate-container li[class="active"]').html()
         $('#form-data-type-container').attr({
             'data-type': type,
             'data-cate': id,
             'data-info': getTypeText + '-' + oneCon
         });
         $(".selectmenu > li .selected[data-validate='need']").attr('data-cate',id);
     })
     $(".selectmenu > li").on('click', function(e) {

         var _this = $(this);
         var seleCon = $(this).find('.selected');
         var selectBox = $(this).find('.select-con');
         var thisOneList = selectBox.find('.select-option li');
         var arrow = $(this).find('.select-arrowicon');

         var siblingsArrow = $(this).siblings('li').find('.select-arrowicon');
         var selectContent = $('.bigconbox');
         var validateSelect = $(".selectmenu > li .selected[data-validate='need']");
         var validateSelectX = $(".selectmenu > li .selected[data-validate='needx']");
         var selectContrim = selectBox.find('.select-confrim');
         var checkOption = $('.select-option-checkbox > li');
         var checkCon = ' ';
         var textLink = $('.text-link');
         // needx

         blockToggle(selectBox, arrow)

         siblingsArrow.removeClass('select-arrowicon-active')

         $(this).siblings('li').find('.select-con').hide().find('.select-two').hide();
         thisOneList.on('click', function(e) {
             // ////// 第二个 三个 文章3     文章1
             var oneCon = $(this).html()
             var id = $(this).attr('data-id')
             _this.addClass('active')
             $(this).addClass('active').siblings().removeClass('active')
             arrow.removeClass('select-arrowicon-active')

             if ($(this).parents('.select-option-label').hasClass('select-option-label')) {
                 console.log($('input[name="original-copy"]:checked').parent().text())
                 var getTypeText = $('#form-data-type-container .radio-0').text();

                 var selectedCon = "<span class='type'>" + getTypeText + "</span>" + "/" + oneCon;

                 var type = $('#form-data-type-container .radio-0 input').val();
                 seleCon.html(selectedCon);
                 $('#form-data-type-container').attr({
                     'data-type': type,
                     'data-cate': id,
                     'data-info': getTypeText + '-' + oneCon
                 })
                 $(".selectmenu > li .selected[data-validate='need']").attr('data-cate',id);
             } else {
                 seleCon.html($(this).text())
                 $(seleCon).attr('data-zteamId', id);
             }

             selectBox.hide()
             console.log('require ajax')
             submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
         })
         checkOption.on('click', function() {
             checkCon = " "
         })

         function selectFn() {
             // ;;;;;  文章2

             var selectCheckBox = checkOption.find('label');

             if (selectCheckBox.hasClass('check-cd')) {
                 var mycate = [];
                 $('.select-option-checkbox').parents('li').find('.selected').html("")
                 for (var i = 0; i < checkOption.length; i++) {
                     if (checkOption.eq(i).find('label').hasClass('check-cd')) {
                         if (checkCon == " ") {
                             checkCon = checkCon + checkOption.eq(i).find('label').text();
                         } else {
                             checkCon = checkCon + "/" + checkOption.eq(i).find('label').text();
                         }
                         mycate.push(checkOption.eq(i).find('label').attr('data-id'));
                     }
                 }
                 $('.select-option-checkbox').parents('li').find('.selected').html(checkCon);
                 if (checkOption.length > 1) {
                     $('#form-data-type-container').attr('data-msg', '多领域');
                 } else {
                     $('#form-data-type-container').attr('data-msg', checkCon);
                 }

                 $('#form-data-articlecate-container').attr('data-articlecate', mycate);
                 $(".selectmenu > li .selected[data-validate='needx']").attr('data-articlecate', mycate);
                 // $('.selectmenu').next('.error-prompt').addClass('hide');
                 arrow.removeClass('select-arrowicon-active')
                 console.log('require ajax')
                 if (selectBox.is(':visible')) {
                     submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
                 }
                 selectBox.hide()

             } else {

             }
         }

         selectContrim.on('click', function() {
             selectFn()
         })
         $(document).on('click', function() {
             if ($.trim(validateSelect.attr('data-cate')) == 0) {

                 $('.selectmenu').next('.error-prompt').removeClass('hide').html('<i class="error-icon">!</i>' + messagesWeb.uploadWorksOrArticles.select_article_type);
             } else if ($.trim(validateSelectX.attr('data-articlecate')) == "") {
                    // 请选择所属领域;
                 $('.selectmenu').next('.error-prompt').removeClass('hide').html('<i class="error-icon">!</i>' + messagesWeb.uploadWorksOrArticles.select_field);
                 $('#form-data-articlecate-container').attr('data-articlecate', '');
                 $(".selectmenu > li .selected[data-validate='needx']").attr('data-articlecate', '');
             } else {

                 $('.selectmenu').next('.error-prompt').addClass('hide');

             }
             var selectCheckBox = checkOption.find('label');
             if (!selectCheckBox.hasClass('check-cd')) {
                // 请选择所属领域;
                 selectContrim.parents('li').find('.selected').html(messagesWeb.uploadWorksOrArticles.select_field);
                 $('.selectmenu').next('.error-prompt').removeClass('hide').html('<i class="error-icon">!</i>' + messagesWeb.uploadWorksOrArticles.select_field);
                 $('#form-data-articlecate-container').attr('data-articlecate', '');
                 $(".selectmenu > li .selected[data-validate='needx']").attr('data-articlecate', '');

             } else {
                 checkCon = " "
                 selectFn()
             }

             selectBox.hide();
             $(".selectmenu > li").find('.select-arrowicon').removeClass('select-arrowicon-active');
         })
         if ($(this).parent().hasClass('selectmenu')) {
             cancelbuble(e)
         }

     })
     $('.pop-close').on('click', function() {
         hideGlobalMaskLayer();
         $('.pop-up').hide();
     });

     // 更多设置的新建分类
     // var oldType = null;
     $('#add-type-btn').on('click', function() {
         $('.classified-display').addClass('hide');
         $("#up-classify-add").removeClass('hide');
         addCateDiv($("#up-classify-add"), successFn, cancelFn);
     })

     ~ function classificationWorks() {
         // var newTypeVal = null;
         // var term = null;
         // var newTypeInput = $('#newtype-text');
         // var finishBtn = $('.text-complete');
         var customSelectCon = $('.custom-selectcon');
         var customUl = $('.custom-selectcon>ul');
         var customLi = $('.custom-select li');

         customLi.on('click', function(e) {
             if ($(this).parent().hasClass('custom-select')) {
                 e.stopPropagation();
             }
             if ($('.custom-select .select-con').css('display') == 'none') {
                 $('.custom-select .select-con').css('display', 'block');
                 if ($('.custom-select .select-con li').length > 5) {
                     $('.custom-select .select-con ul').addClass('scrollbar');
                 }
             } else {
                 $('.custom-select .select-con').css('display', 'none');
                 submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
             }
         })
         $(document).click(function() {
             $('.custom-select .select-con').css('display', 'none');
         });
         customUl.on('click', function(event) {
             var e = event || window.event || arguments.callee.caller.arguments[0];

             if (e.target.nodeName == 'LI') {
                 console.log($(e.target).attr('value'))
                 $('.custom-select li .custom-current-type').html($(e.target).html());
                 $('.custom-select li .custom-current-type').attr('data-id', $(e.target).attr('data-id'));
                 customSelectCon.hide();
                 submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
                 $(e.target).addClass('active').siblings('li').removeClass('active');
                 $('.custom-select>li .select-arrowicon').removeClass('select-arrowicon-active');
             }

         })
     }()

     $('.upcoverbtn').on('click', function() {
         $('.btn-submit .pop-confirm').removeAttr('disabled').val(messagesWeb.common_btn_confirm).removeClass('cursor-default');
         $('.editor-portrait').removeClass('hide');
         showGlobalMaskLayer();
         $('.editor-portrait').show();
         var hidden = $('#coverCard-data-hidden');
         var dataTitle = $("#form-data-title").val();
         $('.card-info-title a').css('width', '178px');
         // 标题
         $(".img-preview-wrap .data-title").html(dataTitle).attr("title", dataTitle);
         // 类别
         $(".img-preview-wrap .data-type-cate-subcate").html($('#form-data-type-container').attr('data-info') + '-' + $('#form-data-type-container').attr('data-msg'));
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

     $('.btn-reset').click(function() {
         $('#inputImage').click();
         console.log('aaa');
     })

     function verifyPublish(article) {
         return verifyPublishAndPreview(article);
     }

     function verifyPreview(article) {
         return verifyPublishAndPreview(article);
     }

     function verifyPublishAndPreview(article) {
         if (!article.title) {
             console.log("article.title ", article.title);
             return false;
         }
         if (!article.type) {
             console.log("article.type ", article.type);
             return false;
         }
         if (!article.cate) {
             console.log("article.cate ", article.cate);
             return false;
         }
         if (!article.articleCates || article.articleCates.length == 0) {
             console.log("article.articleCates ", article.articleCates);
             return false;
         }
         if (!article.summary) {
             console.log("article.summary ", article.summary);
             return false;
         }
         if (!article.memo || article.memo.replace(/[^\x20-\x7E]+/g, '').length <= 0) {
             console.log("article.memo ", article.memo);
             return false;
         }
         if (!article.coverPath || !article.coverName) {
             console.log("article.coverPath ", article.coverPath);
             console.log("article.coverName ", article.coverName);
             return false;
         }
         return true;
     }

     function collectFormData() {
         var article = {};
         article.id = $('#form-data-id').val();
         article.title = $('#form-data-title').val();
         article.type = $('#form-data-type-container').find('label.radio-0 input').val();
         article.cate = $('#form-data-cate-container').find('li.active').attr('data-id');
         var articleCates = [];
         var articlecateContainer = $('#form-data-articlecate-container').find('label.check-cd');
         articlecateContainer.each(function(index, field) {
             var articleCate = {};
             articleCate.id = $(field).attr('data-id');
             articleCates.push(articleCate);
         });
         article.articleCates = articleCates;
         article.zteamId = $('#form-data-zteamId').attr('data-id');
         article.sourceUrl = $('#form-data-sourceurl').val();
         article.summary = $('#form-data-summary').val();
         article.memo = $("textarea[name=form-data-memo]").val();
         article.coverPath = $('#form-data-cover').attr('data-coverpath');
         article.coverName = $('#form-data-cover').attr('data-covername');
         article.fileId = $('#form-data-fileId').attr('data-fileId');
         article.mycate = $('#form-data-mycate').attr('value');
         return article;
     }

        
     var appendixXhr;
     $('#file').change(function(e) {
         var fileName = $('#file')[0].files[0].name;
         var fileNum = $('#file')[0].files[0].name.lastIndexOf('.');
         var extend = fileName.substring(fileNum);
         console.log(extend);
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
                 appendixXhr = new XMLHttpRequest();

                 appendixXhr.onreadystatechange = function() {
                     if (appendixXhr.readyState == 4 && appendixXhr.status == 200) {
                         console.log(appendixXhr.responseText);
                         var res = JSON.parse(appendixXhr.responseText);
                         $('.percent').html('100%');
                         $('.statustext').attr('fileid', res.fileid)
                         $('.upattastatus .progress').css('display', 'none');
                         $('.upattastatus .percent').css('display', 'none');
                         $('.statustext').find('.name').css('width', '345px');
                         $('.statustext').find('.name').html('<span class="rar-icon"></span>' + fileName);
                         $('.statustext').find('.name').css('display', 'inline');
                         console.log($('.statustext label .tips'))
                         $('.statustext label .tips').html(messagesWeb.uploadWorksOrArticles.upload_sucess_text);
                         $('#file').val('');
                         submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
                     }
                 }

                 appendixXhr.upload.onprogress = function(event) {　　　　
                     if (event.lengthComputable) {　　　　　　
                         var complete = (event.loaded / event.total * 100 | 0) - 1;　　　　　　
                         $('.filling-progress').css('width', complete + '%');
                         $('.percent').html(complete + '%');
                         $('.statustext label').find('.tips').html(messagesWeb.uploadWorksOrArticles.uploading_text);　　　　
                     }　　
                 };

                 appendixXhr.open('POST', 'http://' + zMyDomain + '/upload/fileReceiver?fileType=file_n&qqfile=beijing-hyundai.rar', true);

                 appendixXhr.setRequestHeader("X-File-Name", encodeURIComponent(fileName));

                 appendixXhr.send(formData);

                 
             } else {
                 pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_size_limit);
                 $('#file').val('');
             }
         } else {
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
         $('#file').val('')
         $('#form-data-fileId').attr('fileid', 0);
     })
 })
 

 $('#form-data-fileId .tips').click(function() {
     $('#file').click();
     console.log('aaa');
 })

 function getArticleCates() {
     var cate = $('#form-data-articlecate-container').attr('data-articlecate').split(",");
     var articleCates = [];
     for (var i = 0; i < cate.length; i++) {
         var obj = {
             'id': parseInt(cate[i])
         }
         articleCates.push(obj);
     }

     return articleCates;
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
     required[0] = body.title = $('#form-data-title').val() == '' ? null : (/[^\s]+/.test($('.work-name').val())) ? $('.work-name').val() : null;
     required[1] = body.cate = $('#form-data-type-container').attr('data-cate') ? parseInt($('#form-data-type-container').attr('data-cate')) : 0;
     // required[6] = body.field = 
     required[2] = body.articleCates = $.trim($('#form-data-articlecate-container').attr('data-articlecate')) != "" ? getArticleCates() : [];
     required[3] = body.summary = $('#form-data-summary').val();
     required[4] = body.memo = ue.getContent();
     required[5] = body.coverName = $('#form-data-cover').attr('data-covername') ? $('.upcoverbtn').attr('data-covername') : null;
     required[6] = body.sourceUrl = $('#form-data-sourceurl').val();
     body.coverPath = $('#form-data-cover').attr('data-coverpath') ? $('.upcoverbtn').attr('data-coverpath') : null;
     body.type = $('#form-data-type-container').attr('data-type') ? parseInt($('#form-data-type-container').attr('data-type')) : 1;
     body.id = parseInt($('#form-data-id').attr('value'));
     // body.sourceUrl = $('#form-data-sourceurl').val();
     body.fileId = $('#form-data-fileId').attr('fileid') ? parseInt($('#form-data-fileId').attr('fileid')) : null;
     body.articleTags = addLabel();
     body.mycate = parseInt($('#form-data-mycate').attr('data-id'));
     body.zteamId = $('#form-data-zteamId').attr('data-zteamid') ? parseInt($('#form-data-zteamId').attr('data-zteamid')) : 0;

     if (ele[0] == $('.biz-draft-btn')[0]) {
         // ****************
         // 存草稿 title为必填项
         // if (!required[0] || required[0] == '') {
         // 	$('.work-title-box .work-nametips').removeClass('hide');
         // 	$(document).scrollTop($('.work-title-box .work-nametips').offset().top - 20);
         // 	return;
         // }
         // *********************
         ele.val(messagesWeb.uploadWorksOrArticles.draft_save)
         ajax(url, refTo, body, ele);
         $('.biz-draft-btn').attr('disabled', true);
     } else {
         $('.text-link .work-nametips').addClass('hide');
         if (!required[0] || required[0] == '') {
             $('.work-title-box .work-nametips').removeClass('hide');
             $(document).scrollTop($('.work-title-box .work-nametips').offset().top - 20);
             return;
         } else if (!required[1]) {
             $('.work-selectbox .error-prompt').removeClass('hide');
             $(document).scrollTop($('.work-selectbox .error-prompt').offset().top - 20);
             return;
         } else if (!required[2].length) {
             $('.work-selectbox .error-prompt').removeClass('hide');
             $(document).scrollTop($('.work-selectbox .error-prompt').offset().top - 20);
             return;
         } else if ($('#form-data-type-container').attr('data-type') == 2 && (!required[6] || required[6] == '')) {
             $('.text-link .work-nametips').removeClass('hide');
             $(document).scrollTop($('.text-link .error-prompt').offset().top - 20);
             return;
         } else if (!required[3] || required[3] == '') {
             $('.work-discriptionbox .error-prompt').removeClass('hide');
             $(document).scrollTop($('.work-discriptionbox .error-prompt').offset().top - 20);
             return;
         } else if (!required[4] || required[4].replace(/[^\x20-\x7E]+/g, '').length <= 0) {
             $('.article-edit-wrap').find('.articleWarn').removeClass('hide');
             $(document).scrollTop($('.article-edit-wrap').offset().top - 20);
             return;
         } else if (!required[5]) {
             $('.workup-con').find('.error-prompt').removeClass('hide');
             $(document).scrollTop($('.workup-con').find('.error-prompt').offset().top - 20);
             return;
         } else {
             if (ele[0] == $('.publishbtn')[0]) {
                 $('.publishbtn').off('click').addClass('btn-default-loading').attr('disabled', true).val(messagesWeb.uploadWorksOrArticles.btn_announcing);
             } else {
                 newWin = window.open('');
             }
             ajax(url, refTo, body, ele);
         }
     }
 }

 function ajax(url, refTo, body, ele) {
     $.ajax({
         type: "POST",
         url: url,
         data: JSON.stringify(body),
         dataType: "json",
         contentType: 'application/json',
         success: function(data) {
             if (ele) {
                 if (ele[0] == $('.biz-draft-btn')[0]) {
                     // location.href = refTo;
                     // 已保存草稿;
                     ele.val(messagesWeb.uploadWorksOrArticles.draft_been_save);
                     if (body.id == 0) {
                         $('#form-data-id').val(data.data.id);
                     }
                 } else {
                     if ((typeof data.data) == 'string') {
                         newWin.location.href = refTo + data.data;
                     } else {
                         location.href = refTo;
                     }

                 }
             } else {
                 if ((typeof data.data) == 'string') {
                     newWin.location.href = refTo + data.data;
                 } else {
                     location.href = refTo;
                 }
             }
         },
         error: function() {
            // 服务异常，请稍后重试;
             pageToastFail(messagesWeb.comment_exception_hints);
             // 草稿保存失败提示
             $('.biz-draft-btn').val(messagesWeb.uploadWorksOrArticles.save_failed)
         }

     });
 }

 function uploadProgressStatusTips() {
     if ($('#coverPicker').is('.status-progress') || $('.upattastatus .progress:visible').length) {
         return false;
     }
 }
 $('.publishbtn').on('click', function(e) {
     e.preventDefault();
     showRemindBindLayer(publishUnbindTis)
     function publishUnbindTis(){
        if (uploadProgressStatusTips() == false) {
            pageToastFail(messagesWeb.uploadWorksOrArticles.upload_a_hint)
        }
        if (!$('#form-data-fileId .tips').is('.status-progress')) {
            if (characterRestriction() != false && uploadProgressStatusTips() != false) {
                submit('http://' + zMyDomain + '/uploadArticle', 'http://' + zMyDomain + '/articles', $(this));
            }
        } else {
            pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_upload);
        }
     }

 });
 $('.previewbtn').on('click', function(e) {
     e.preventDefault();
     showRemindBindLayer(publishUnbindTis)
     function publishUnbindTis(){
        if (uploadProgressStatusTips() == false) {
            pageToastFail(messagesWeb.uploadWorksOrArticles.upload_in_preview)
        }
        if (!$('#form-data-fileId .tips').is('.status-progress')) {
            if (characterRestriction() != false && uploadProgressStatusTips() != false) {
                submit('http://' + zMyDomain + '/previewArticle', 'http://' + zMyDomain + '/preview/article/', $(this));
            }
        } else {
            pageToastFail(messagesWeb.uploadWorksOrArticles.attachment_upload);
        }
     }

 });

 // $('.biz-draft-btn').on('click', function(e) {
 // 	e.preventDefault();
 // 	if(uploadProgressStatusTips() == false){
 // 		pageToastFail('上传中，请稍后保存')
 // 	}
 // 	if ($('#form-data-fileId .tips').html() == "上传成功" || $('#form-data-fileId .tips').html() == "选择") {
 // 		if (characterRestriction() != false && uploadProgressStatusTips() != false) {
 // 			submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $(this));
 // 		}
 // 	} else {
 // 		pageToastFail('附件正在上传中');
 // 	}
 // });
 // 存草稿。。。。
 var storedDraftValues = {
     articleTitle: "",
     articleCate: "",
     articleCates: "",
     articleSourceurl: "",
     articleZteamId: "",
     articleSummary: "",
     articleMemo: "",
     articleCoverName: ""
 }

 function saveDraftMonitorInput(temporaryComparisonV, objI) {
     var _this = objI;
     clearTimeout(timmer)
     timmer = setTimeout(function() {
         if (temporaryComparisonV == _this.val()) {
             console.log('requrest ajax')
             submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
         }
     }, 500)
 }
 var timmer = null;
 $('#form-data-title').on('keyup', function() {
     saveDraftMonitorInput(storedDraftValues.articleTitle, $(this))
 })
 $('#form-data-sourceurl').on('keyup', function() {
     saveDraftMonitorInput(storedDraftValues.articleSourceurl, $(this))
 })
 $('#form-data-summary').on('keyup', function() {
     saveDraftMonitorInput(storedDraftValues.articleSummary, $(this))
 })
 $('#form-data-title').on('input', function() {
     storedDraftValues.articleTitle = $(this).val()
 })
 $('#form-data-sourceurl').on('input', function() {
     storedDraftValues.articleSourceurl = $(this).val()
 })
 $('#form-data-summary').on('input', function() {
     storedDraftValues.articleSummary = $(this).val()
 })

 zCharCount_withExceedCount($("#form-data-title"), {
     allowed: 80
 });
 zCharCount_withExceedCount($("#workmark"), {
     allowed: 16
 });
 // zCharCount_withExceedCount($("#newtype-text"), {
 // 	allowed: 24
 // });
 $("#note-text").charCount({
     allowed: 100,
     warning: 0,
 });
zCharCount_withExceedCount($("#form-data-summary"), {
     allowed: 120
 });

 zCharCount_withExceedCount($("#form-data-sourceurl"), {
     allowed: 100
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
             if (me.workmark.val().trim() == "") {
                 return;
             } else {
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
                     pageToastFail(messagesWeb.label.label_repeat);
                     break;
                 }
             }
             if (count < 0) {
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
                 if (me.workmark.val().trim() == "") {
                     return;
                 } else {
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

 function AddTag(inputc, workc) {
     inputc = html_encode(inputc)
     if (inputc != "") {
         var appendTag = '<span class="mark" title="' + inputc + '">' + inputc + ' <i></i></span>'
         workc.append(appendTag)
         submit('http://' + zMyDomain + '/draftArticle', 'http://' + zMyDomain + '/articles', $('.biz-draft-btn'));
     }
 }
 // 贴标签  end
