(function($) {
    // 当domReady的时候开始初始化
    $(function() {
        var fileCount = 0,
            fileSize = 0,
            uploaded = []; 
            //percentages = {};
        
        window.onload = new function() {
            aliyunUploader = new VODUpload({
                // 文件上传失败
                'onUploadFailed': function (uploadInfo, code, message) {
                    $('#files').val(null)
                },
                // 文件上传完成
                'onUploadSucceed': function (uploadInfo) {
                   console.log(aliyunUploader.listFiles()) 
                    // if($('#form-data-productVideos li').length >= 3){
                    //     aliyunUploader.stopUpload();
                    // }
                    $('#files').val(null);
                    var videoId = getCurrentVideoId();
                    // 上传成功
                    $('#' + videoId).find('.result').html(messagesWeb.uploadWorksOrArticles.upload_sucess_text);
                    $('#' + videoId).find('.progress').css('opacity', '0');
                    $('#' + videoId).find('.per').css('opacity', '0');
                    $('#' + videoId).find('.cancel').on('click', function(file) {
                        $(this).parent().remove();
                        videoBtnLightHightControl()
                    });
                    $('#' + videoId).find('.result').off('click');
                    uploadComplete()
                    // console.log(uploadInfo)
                },
                // 文件上传进度
                'onUploadProgress': function (uploadInfo, totalSize, uploadedSize) {
                    var videoId = getCurrentVideoId();
                    var percentage = Math.ceil(uploadedSize * 100 / totalSize);
                    var $li = $('#' + videoId),
                    $percent = $li.find('.filling-progress');
                    $percent.css('width', percentage + '%');
                    $percent.parent().next().html(percentage + '%');
                    
                    //percentages[file.id][1] = percentage;
                    if (percentage < 100 && percentage > 1) {
                        // 上传中
                        $percent.parent().prev().html(messagesWeb.uploadWorksOrArticles.uploading_text);
                        $li.attr('data-status','progress');
                    }else{
                        $li.removeAttr('data-status');
                    }
                },
                // STS临时账号会过期，过期时触发函数
                'onUploadTokenExpired': function () {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        url: "http://" + zMainDomain + "/my/upload/video/videoUploadResumeInfo?fileName=abc.mp4",
                        async: false,
                        success: function(result) {
                            aliyunUploader.resumeUploadWithAuth(result.data.uploadAuth);
                        },
                        error: function() {
                            stop();
                        }
                    });
                },
                // 开始上传
                'onUploadstarted': function (uploadInfo) {
                    var ext = uploadInfo.file.name.substr(uploadInfo.file.name.lastIndexOf('.') + 1);
                    if (video(ext)) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            xhrFields: {
                                withCredentials: true
                            },
                            url: "http://" + zMainDomain + "/my/upload/video/videoUploadInfo?fileName=" + uploadInfo.file.name,
                            async: false,
                            success: function(result) {
                                setCurrentVideoId(result.data.videoId)
                                aliyunUploader.setUploadAuthAndAddress(uploadInfo, result.data.uploadAuth, result.data.uploadAddress);
                                // addFile($.extend({}, uploadInfo.file, {
                                //     videoId: result.data.videoId
                                // }));
                                upProcess($.extend({}, uploadInfo.file, {
                                    videoId: result.data.videoId
                                }))
                                /*$('#' + file.id).attr('data-url', 'http://yuntv.letv.com/bcloud.swf?uu=' + result.user_unique + '&vu=' + result.video_unique + '&vid=' + result.video_id);
                                uploader.options.server = result.upload_url;
                                if($('#form-data-productVideos li').length >= 3){
                                    $('.webuploader-element-invisible').attr('disabled',true);
                                    $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main');
                                    $('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled',true);
                                    $('#moviePicker').find(' label').css({'cursor':'default'})
                                }*/
                            },
                            error: function() {
                                stop();
                            }
                        });
                    } else {
                        // 上传视频格式不支持！
                        pageToastFail(messagesWeb.uploadWorksOrArticles.vedio_format_plus);
                    }
                }
            });
            

            $('.upload-vedio').on('click', function() {
                if ($('#form-data-productVideos li').length >= 3) {
                    return;
                }
                if (!$('.aliyun-vod').length) {
                    $('<form action="" class="aliyun-vod" style="display:none">' +
                        '<input type="file" name="file" id="files" multiple/>' +
                        '</form>').appendTo("body");
                }
                 $('#files').click();
                $('#files').on('change', function (event) {
                    for(var i = 0; i < event.target.files.length; i++) {
                        var ext = event.target.files[i].name.substr(event.target.files[i].name.lastIndexOf('.') + 1);
                        if (video(ext)) {
                            var userData = '{"Vod":{"UserData":"{"IsShowWaterMark":"false","Priority":"7"}"}}';
                            aliyunUploader.addFile(event.target.files[i], null, null, null, userData);
                            if($('#form-data-productVideos li').length >= 3){
                                $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main').attr('disabled',true);
                                $('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled',true);
                                $('#moviePicker').find(' label').css({'cursor':'default'})
                            } else {
                                
                                
                                var list = aliyunUploader.listFiles();
                                console.log(list)
                                    var vedioListHtml = '<li id="" data-videoid="" data-name="' + event.target.files[i].name + '" class="js-video-list">' +
                                    '<div class="filer-name-box">' + '<span class="filer-name" title="' + event.target.files[i].name + '">' + event.target.files[i].name.substring(0, event.target.files[i].name.lastIndexOf(".")) + '</span>' + event.target.files[i].name.substring(event.target.files[i].name.lastIndexOf(".")) + '</div>' +
                                    '<i class="cancel closebtn vedio-close"></i><div class="upstatusbox">' +
                                    '<span class="result">' + '等待上传' + '</span><span class="progress"><i class="filling-progress"></i></span><span class="per">0%</span></div>' +
                                    '</li>'
                                    $('#form-data-productVideos').append(vedioListHtml);
                                videoBtnLightHightControl();
                                start()
                                $('#files').off('change')
                                
                            }
                        } else {
                            pageToastFail(messagesWeb.uploadWorksOrArticles.vedio_format_plus);
                        }
                    }
                });
            });
        }
        function start() {
            aliyunUploader.startUpload();
            //aliyunProgress(0);
            
            }
    
        function stop() {
            aliyunUploader.stopUpload();
        }
        // 实例化
        /*var uploader = WebUploader.create({
            pick: {
                id: '#moviePicker',
                label: '<input type="button" name="" class="btn-default-main upload-vedio" value="上传视频">'
            },
            formData: {
                uid: 123
            },
            auto: true,
            swf: '../../dist/Uploader.swf',
            chunked: false,
            threads: 3,
            chunkSize: 512 * 1024,
            server: '',
            disableGlobalDnd: true,
            fileNumLimit: 3,
            fileSizeLimit: 20000 * 1024 * 1024, // 2000 M
            fileSingleSizeLimit: 500 * 1024 * 1024 // 500 M
        });

        //上传开始时执行的任务（同步请求返回视频上传地址）
        uploader.on('uploadStart', function(file) {
            var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
            if (video(ext)) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "http://" + zMyDomain + "/videoUploadInfo?videoName=test&objectType=3",
                    async: false,
                    success: function(result) {
                        console.log(result);
                        $('#' + file.id).attr('data-url', 'http://yuntv.letv.com/bcloud.swf?uu=' + result.user_unique + '&vu=' + result.video_unique + '&vid=' + result.video_id);
                        uploader.options.server = result.upload_url;
                        if($('#form-data-productVideos li').length >= 3){
                            $('.webuploader-element-invisible').attr('disabled',true);
                            $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main');
                            $('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled',true);
                            $('#moviePicker').find(' label').css({'cursor':'default'})
                        }
                    },
                    error: function() {
                        uploader.stop(file);
                        console.log(file);
                    }
                });
            } else {
                pageToastFail('上传视频格式不支持！');
            }
        })
        uploader.on('dialogOpen', function() {
            console.log('here');
        });

        uploader.on('ready', function() {
            window.uploader = uploader;
            $('#remo').remove();
            $('#moviePicker').find(' label').on('mouseover', function() {
                $('#moviePicker').find('.upload-vedio').addClass('hover');
            });
            $('#moviePicker').find(' label').on('mouseleave', function() {
                $('#moviePicker').find('.upload-vedio').removeClass('hover');
            })
        });*/

        function getCurrentVideoId() {
            if (!uploaded[2] && !uploaded[1]) {
                return uploaded[0]
            } else {
                if (!uploaded[2]) {
                    return uploaded[1]
                } else {
                    return uploaded[2]
                }
            }
        }

        function setCurrentVideoId(videoId) {
            if (!uploaded[0]) {
                uploaded[0] = videoId;
            } else if (!uploaded[1]) {
                uploaded[1] = videoId;
            } else {
                uploaded[2] = videoId;
            }
        }

        //判断上传允许的格式
        function video(type) {
            var group = ['mp4', 'wmv', 'dat', 'asf', 'rm', 'rmvb', 'ram', 'meg', 'mpeg', '3gp', 'mov', 'mp4', 'm4v', 'dvix', 'dv', 'mkv', 'flv', 'vob', 'qt', 'divx', 'cpk', 'fli', 'flc', 'mod', 'avi'];
            var flag = false;
            for (var i = 0; i < group.length; i++) {
                if (type.toLowerCase() == group[i].toLowerCase()) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                return true;
            } else {
                return false;
            }
        }
        // 上传视频成功后的。。。
        function uploadComplete(){
            if($('.upvedio-status ul li').length){
                $('.twoleveltitle .error-prompt').addClass('hide');
            }
        }
        function upProcess(file){
            $movieList = $('.movieList'),
            $li = $movieList.find('li')
            for(var i=0;i<$li.length;i++){
                if($li.eq(i).attr('data-videoid') == ""){
                    $li.eq(i).attr({
                        'id':file.videoId,
                        'data-videoid':file.videoId,
                        'data-name':file.name,
                    })
                    break;
                }
            }
        }
         $('.movieList').on('click','.vedio-close', function() {
            var $li = $(this).parents('li');
            var $vedioLi = $(this).parents('.js-video-list');
            if($li.attr('data-status') == "progress"){
                pageToastFail('上传中')
            }else{
                aliyunUploader.cancelFile($vedioLi.index());
                $li.remove();
                
            }
            if($('#form-data-productVideos li').length < 3){
                $('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main').removeAttr('disabled');
                $('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
                $('#moviePicker').find(' label').removeAttr('style');
            }
        })
        // 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            // alert(file.name.substring(0,file.name.lastIndexOf(".")))
            // 等待上传
            var $li = $('<li id="' + file.videoId + '" data-videoid="' + file.videoId + '" data-name="' + file.name + '" class="js-video-list">' +
                    '<div class="filer-name-box">' + '<span class="filer-name" title="' + file.name + '">' + file.name.substring(0, file.name.lastIndexOf(".")) + '</span>' + file.name.substring(file.name.lastIndexOf(".")) + '</div>' +
                    '<i class="cancel closebtn vedio-close"></i><div class="upstatusbox">' +
                    '<span class="result">' + messagesWeb.uploadWorksOrArticles.vedio_wait_uplod + '</span><span class="progress"><i class="filling-progress"></i></span><span class="per">0%</span></div>' +
                    '</li>'),
                
                $movieList = $('.movieList'),

                showError = function(code) {
                    switch (code) {
                        case 'exceed_size':
                            // 文件大小超出
                            text = messagesWeb.uploadWorksOrArticles.upload_p_file_size;
                            break;

                        case 'interrupt':
                        // 上传暂停
                            text = messagesWeb.uploadWorksOrArticles.upload_p_stop;
                            break;

                        default:
                        // 上传失败，请重新上传
                            text = messagesWeb.uploadWorksOrArticles.vedio_error_plus;
                            // 上传失败，重新上传
                            $li.find('.result').html(messagesWeb.uploadWorksOrArticles.vedio_error_plus)
                            $li.find('.progress').css('opacity', '0');
                            $li.find('.per').css('opacity', '0');
                            $li.find('.result').css('cursor', 'pointer').on("click", function() {
                                //uploader.upload(file);
                                $li.find('.progress').css('opacity', '1');
                                $li.find('.per').css('opacity', '1');
                            })
                            break;
                    }
                };
                console.log(file)
                console.log($movieList.find('li'))
            /*if (file.getStatus() === 'invalid') {
                showError(file.statusText);
                console.log('invalid');
            }*/

            $li.appendTo($movieList);

            $li.find('.cancel').on('click', function() {
                $(this).parent().remove();
                //uploader.removeFile(file);
                if($('#form-data-productVideos li').length < 3){
                    $('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main').removeAttr('disabled');
                    $('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
                    $('#moviePicker').find(' label').removeAttr('style');
                }
            })
            /*file.on('statuschange', function(cur, prev) {
                if (prev === 'progress') {
                    // $prgress.hide().height(0);
                }
                // console.log(cur + ',' + prev)
                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    showError(file.statusText);
                    // percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    // $info.remove();
                    // $prgress.css('display', 'block');
                    // percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    // $info.remove();
                    // $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    uploadComplete()
                }
            });*/
        }

        function videoBtnLightHightControl(){
            if($('#form-data-productVideos li').length < 3){
                $('.upload-vedio').removeClass('btn-disabled').addClass('btn-default-main').removeAttr('disabled');
                $('.leading-vedio').removeClass('btn-disabled').addClass('btn-default-secondary').removeAttr('disabled');
                $('#moviePicker').find(' label').removeAttr('style');
            }else{
                $('.upload-vedio').addClass('btn-disabled').removeClass('btn-default-main').attr('disabled',true);
                $('.leading-vedio').addClass('btn-disabled').removeClass('btn-default-secondary').attr('disabled',true);
                $('#moviePicker').find(' label').css({'cursor':'default'})
            }
        }

        // 负责view的销毁
        /*function removeFile(file) {
            var $li = $('#' + file.id);
            //delete percentages[file.id];
            $li.off().find('.file-panel').off().end().remove();
        }*/

        /*uploader.onUploadProgress = function(file, percentage) {
            percentages[file.id] = [file.size, 0];
            var $li = $('#' + file.id),
                $percent = $li.find('.filling-progress');
            $percent.css('width', percentage + '%');
            $percent.parent().next().html(percentage + '%');
            percentages[file.id][1] = percentage;
            if (percentage < 100 && percentage > 1) {
                $percent.parent().prev().html('上传中');
            }
        };

        uploader.onFileQueued = function(file) {
            fileCount++;
            fileSize += file.size;
            addFile(file);
        };

        uploader.onFileDequeued = function(file) {
            fileCount--;
            fileSize -= file.size;
            removeFile(file);

        };

        uploader.onError = function(code) {
            alert('Eroor: ' + code);
        };*/

    });

})(jQuery);