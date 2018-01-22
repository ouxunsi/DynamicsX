
var QA = {
    addComment: function (row_id, type) {
        var url = '/api/v2/question-answers/' + row_id + '/comments';
        comment.support.row_id = row_id;
        comment.support.position = type;
        comment.support.editor = $('#J-editor'+row_id);
        comment.support.button = $('#J-button'+row_id);
        comment.support.top = false;
        comment.publish(url, function(res){
            $('.nums').text(comment.support.wordcount);
            $('.cs'+row_id).text(parseInt($('.cs'+row_id).text())+1);
        });
    },
    adoptions: function (question_id, answer_id, back_url) {
        var url = '/api/v2/questions/' + question_id + '/adoptions/' + answer_id;
        $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            success: function(res) {
                noticebox('采纳成功', 1, back_url);
            },
            error: function(xhr){
                showError(xhr.responseJSON);
            }
        });
    },
    delAnswer: function (question_id, answer_id, callUrl) {
        callUrl = callUrl ? callUrl : '';
        url = '/api/v2/question-answers/' + answer_id;
         $.ajax({
             url: url,
             type: 'DELETE',
             dataType: 'json',
             success: function(res, data, xml) {
                 if (xml.status == 204) {
                     if (callUrl == '') {
                         $('#answer' + answer_id).fadeOut();
                         $('.qs' + question_id).text(parseInt($('.qs' + question_id).text())-1);
                     } else {
                         noticebox('删除成功', 1, callUrl);
                     }
                 }
             },
             error: function(xhr){
                 showError(xhr.responseJSON);
             }
         });
    },
    share: function (answer_id) {
        var bdDesc = $('#answer' + answer_id).find('.answer-body').text();
        var reg = /<img src="(.*?)".*?/;
        var imgs = reg.exec($('.show-answer-body').html());
        var img = imgs != null ? imgs[1] : '';
        bdshare.addConfig('share', {
            "tag" : "share_answerlist",
            'bdText' : bdDesc,
            'bdDesc' : '',
            'bdUrl' : TS.SITE_URL + '/question/answer/' + answer_id,
            'bdPic': img
        });

        console.log(bdDesc);
    },
    look: function (answer_id, money, question_id, obj) {
        checkLogin();
        obj = obj ? obj : false;
        ly.confirm(formatConfirm('围观支付', '本次围观您需要支付' + money + TS.BOOT.site.gold_name.name + '，是否继续围观？'), '' , '', function(){
            var _this = this;
            if (_this.lockStatus == 1) {
                return;
            }
            _this.lockStatus = 1;
            var url ='/api/v2/question-answers/' + answer_id + '/onlookers';

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                success: function(res, data, xml) {
                    if (!obj) {
                        noticebox('围观成功', 1, '/question/' + question_id);
                    } else {
                        noticebox('围观成功', 1);
                        var txt = res.answer.body.replace(/\@*\!\[\w*\]\(([https]+\:\/\/[\w\/\.]+|[0-9]+)\)/g, "[图片]");
                        var body = txt.length > 130 ? txt.substr(0, 130) + '...' : txt;
                        $(obj).removeClass('fuzzy');
                        $(obj).removeAttr('onclick');
                        $(obj).text(body);
                        $(obj).after('<a href="/question/answer/' + answer_id + '" class="button button-plain button-more">查看详情</a>');
                        layer.closeAll();
                        _this.lockStatus = 0;
                    }
                },
                error: function(xhr){
                    _this.lockStatus = 0;
                    layer.closeAll();
                    showError(xhr.responseJSON);
                }
            });
        });
    }
};

var question = {
    create:function (topic_id) {
        checkLogin();
        var url = '/question/create';
        if (topic_id) {
            url = '/question/create?topic_id=' + topic_id;
        }
        window.location.href = url;
    },
    addComment: function (row_id, type) {
        var url = '/api/v2/questions/' + row_id + '/comments';
        comment.support.row_id = row_id;
        comment.support.position = type;
        comment.support.editor = $('#J-editor'+row_id);
        comment.support.button = $('#J-button'+row_id);
        comment.support.top = false;
        comment.publish(url, function(res){
            $('.nums').text(comment.support.wordcount);
            $('.cs'+row_id).text(parseInt($('.cs'+row_id).text())+1);
        });
    },
    delQuestion: function(question_id) {
        ly.confirm(formatConfirm('提示', '确定删除这条信息？'), '' , '', function(){
            var url ='/api/v2/questions/' + question_id;
            $.ajax({
                url: url,
                type: 'DELETE',
                dataType: 'json',
                success: function(res) {
                    layer.close(index);
                    noticebox('删除成功', 1, '/question');
                },
                error: function(xhr){
                    layer.close(index);
                    showError(xhr.responseJSON);
                }
            });
        });
    },
    share: function (question_id) {
        var bdDesc = $('.richtext').text();
        var reg = /<img src="(.*?)".*?/;
        var imgs = reg.exec($('.show-body').html());
        var img = imgs != null ? imgs[1] : '';
        bdshare.addConfig('share', {
            "tag" : "share_questionlist",
            'bdText' : bdDesc,
            'bdDesc' : "",
            'bdUrl' : TS.SITE_URL + '/question/' + question_id,
            'bdPic': img
        });
    },
    selected: function (question_id, money) {
        var html = formatConfirm('精选问答支付', '<div class="confirm_money">' + money + '</div>本次申请精选您需要支付' + money + TS.BOOT.site.gold_name.name + '，是否继续申请？');

        ly.confirm(html, '' , '', function(){
            var _this = this;
            if (_this.lockStatus == 1) {
                return;
            }
            _this.lockStatus = 1;
            var url ='/api/v2/user/question-application/' + question_id;
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                success: function(res, data, xml) {
                    layer.closeAll();
                    if (xml.status == 201) {
                        noticebox('申请成功', 1);
                    } else {
                        _this.lockStatus = 0;
                    }
                },
                error: function(xhr){
                    _this.lockStatus = 0;
                    layer.closeAll();
                    showError(xhr.responseJSON);
                }
            });
        });
    },
    amount: function (question_id) {
        checkLogin();
        var html = '<div class="reward_box">'
            + '<div class="reward_title">公开悬赏</div>'
            + '<div class="reward_text">选择公开悬赏金额</div>'
            + '<div class="reward_spans">';

        $.each(TS.BOOT.site.reward.amounts.split(','), function (index, value) {
            if (value > 0) {
                html += '<span num="' + value / TS.BOOT['wallet:ratio'] + '">' + value + '</span>';
            }
        });
        html += '</div>'
            + '<div class="reward_input">'
            + '<input min="1" oninput="value=moneyLimit(value)" type="number" placeholder="自定义金额，必须为整数">'
            + '</div>'
            + '</div>';

        ly.confirm(html, '公开悬赏', '', function(){
            var _this = this;
            if (_this.lockStatus == 1) {
                return;
            }
            _this.lockStatus = 1;
            var num = $('.reward_spans .current').length > 0 ? $('.reward_spans .current').attr('num') : '';
            var amount = $('.reward_input input').val() / TS.BOOT['wallet:ratio'];

            if (!num && !amount) {
                return false;
            }
            var url = '/api/v2/questions/' + question_id + '/amount';
            $.ajax({
                url: url,
                type: 'PATCH',
                data: {amount: num ? num : amount},
                dataType: 'json',
                error: function(xml) {
                    _this.lockStatus = 0;
                    lyShowError(xml.responseJSON);
                },
                success: function(res, data, xml) {
                    layer.closeAll();
                    if (xml.status == 204) {
                        noticebox('操作成功', 1, 'refresh');
                    } else {
                        _this.lockStatus = 0;
                    }
                }
            });
        });
    }
};

var QT = {
    show : function () {
        checkLogin();
        var html = '<form class="topic-show" id="topic-create">'
            + '<p class="topic-title">建议创建话题</p>'
            + '<div class="topic-from-row">'
            + '<input type="text" name="name" placeholder="请输入话题名称">'
            + '</div>'
            + '<div class="topic-from-row">'
            + '<textarea name="description" placeholder="请输入话题相关描述信息"></textarea>'
            + '</div>'
            + '</form>';
        ly.alert(html, '提交', function(){
            var data = $('#topic-create').serializeArray();
            $.ajax({
                url: '/api/v2/user/question-topics/application',
                type: 'POST',
                data: data,
                dataType: 'json',
                error: function(xml) {
                    noticebox(xml.responseJSON.message, 0);
                },
                success: function(res, data, xml) {
                    if (xml.status == 201) {
                        noticebox('申请成功', 1);
                    } else {
                        noticebox(res.message, 0);
                    }
                }
            });
        });
    },
    follow: function (obj) {
        checkLogin();
        var _this = obj;
        var status = $(_this).attr('status');
        var topic_id = $(_this).attr('tid');
        var followCount = parseInt($('#tf-count-'+topic_id).text());
        topic(status, topic_id, function(){
            if (status == 1) {
                $(_this).text('+关注');
                $(_this).attr('status', 0);
                $(_this).removeClass('followed');
                $('#tf-count-'+topic_id).text(followCount - 1);
            } else {
                $(_this).text('已关注');
                $(_this).attr('status', 1);
                $(_this).addClass('followed');
                $('#tf-count-'+topic_id).text(followCount + 1);
            }
        });
    }
};