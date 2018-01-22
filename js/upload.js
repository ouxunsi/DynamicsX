(function($) {
	// 当domReady的时候开始初始化
	$(function() {
		var $wrap = $('#uploader'),

			// 图片容器
			$queue = $('.filelist'),
			// 状态栏，包括进度和控制按钮
			$statusBar = $wrap.find('.statusBar'),

			// 文件总体选择信息。
			$info = $statusBar.find('.info'),

			// 上传按钮
			$upload = $wrap.find('.uploadBtn'),

			// 没选择文件之前的内容。
			$placeHolder = $wrap.find('.placeholder'),

			$progress = $statusBar.find('.progress').hide(),

			// 添加的文件数量
			fileCount = 0,

			// 添加的文件总大小
			fileSize = 0,

			// 优化retina, 在retina下这个值是2
			ratio = window.devicePixelRatio || 1,

			// 缩略图大小
			thumbnailWidth = 240 * ratio,
			thumbnailHeight = 180 * ratio,

			// 可能有pedding, ready, uploading, confirm, done.
			state = 'pedding',
			// 所有文件的进度信息，key为file id
			percentages = {},
			// 判断浏览器是否支持图片的base64
			isSupportBase64 = (function() {
				var data = new Image();
				var support = true;
				data.onload = data.onerror = function() {
					if (this.width != 1 || this.height != 1) {
						support = false;
					}
				}
				data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
				return support;
			})(),

			// WebUploader实例
			uploader;

		// 实例化
		uploader = WebUploader.create({
			pick: {
				id: '#filePicker',
				label: messagesWeb.upload_image + '<br><span class="format">' + messagesWeb.upload_image_format1 + '<br>' + messagesWeb.upload_image_format2 + '</span>'
			},
			formData: {

			},
			compress: false,
			auto: true,
			threads: 5,
			prepareNextFile: true,
			method: 'POST',
			// dnd: '#dndArea',
			// paste: '#uploader',
			chunked: false,
			duplicate: true,
			chunkSize: 50 * 1024 * 1024,
			server: 'http://' + zMyDomain + '/upload/imgReceiver?fileType=product_n&qqfile=01df51574bd2c36ac72525aee1c16e.png',
			duplicate: false,
			width: 2000,
			height: 8000,
			withCredentials: false,
			thumb: {
				// 图片质量，只有type为`image/jpeg`的时候才有效。
				quality: 90,

				// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
				allowMagnify: false,

				// 为空的话则保留原有图片格式。
				// 否则强制转换成指定的类型。
				// type: 'image/jpeg'
			},
			// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
			disableGlobalDnd: true,
			fileNumLimit: 100,
			fileSizeLimit: 1000 * 1024 * 1024, // 1000 M
			fileSingleSizeLimit: 100 * 1024 * 1024 // 10 M
		});

		// 拖拽时不接受 js, txt 文件。
		uploader.on('dndAccept', function(items) {
			var denied = false,
				len = items.length,
				i = 0,
				// 修改js类型
				unAllowed = 'text/plain;application/javascript ';

			for (; i < len; i++) {
				// 如果在列表里面
				if (~unAllowed.indexOf(items[i].type)) {
					denied = true;
					break;
				}
			}
			if (items[0].type == "image/png" || items[0].type == "image/jpg" || items[0].type == "image/jpeg" || items[0].type == "image/gif") {
				denied = false;
			} else {
				// 暂时不支持此格式，请使用png、jpg、gif等常用格式
				pageToastFail(messagesWeb.uploadPlugin.upload_format2);
				denied = true;
			}

			return !denied;
		});
		//图片要求不满足时重新上传
		uploader.reUpload = function(e) {
			var file = e.data;
			$(this).attr({
				'for': 'err',
				'id': 'replace'
			});
			$('#err').change(function() {
				uploader.removeFile(file);
			})

		}
		uploader.on('uploadFinished', function() {
			$('#form-data-productImages').sortable("destroy");
			$('#form-data-productImages').sortable({
				containment: ".filelist"
			});
		})
		uploader.on('uploadStart', function(file) {
			var count = 0;
			var queue = $('#form-data-productImages li');
			for (var i = 0, len = queue.length; i < len; i++) {
				if ($(queue[i]).hasClass('state-complete')) {
					count++;
					if (count == 100) {
						break;
					}
				}
			}
			if (count == 100) {
				uploader.removeFile(file);
				return;
			}
		});

		function cancel(ele, $btns) {
			ele.on('mousemove', function() {
				$btns.css({
					height: 20
				});
			});

			ele.on('mouseleave', function() {
				$btns.css({
					height: 0
				});
			});

			$btns.on('click', 'span', function() {
				ele.remove();
			});
		}

		uploader.on('dialogOpen', function() {
			window.toast = false;
		});

		uploader.on('ready', function() {
			window.uploader = uploader;
		});
		//加载图片及逆行转换便于读取图片信息
		function img(fileObj, file, size) {
			if ($('#' + file.id).find('.error').length) {
				return true;
			}
			if (fileObj.size > size) {
				var img = $('#' + file.id).find('.imgWrap');
				var X = $('#' + file.id).find('.file-panel')
				var li = $('<li></li>');
				li.append(img).append(X);
				$('#' + file.id).replaceWith(li);
				uploader.removeFile(file);
				$info = $('<p class="error"><label></label></p>');
				// 大小超限，上传失败
				$info.find('label').text(messagesWeb.uploadWorksOrArticles.upload_size_limit).addClass('noclick');
				$info.appendTo(li);
				cancel(li, li.find('.file-panel'));
				return true;
			}
		}
		// 当有文件添加进来时执行，负责view的创建
		function addFile(file) {
			var insert = true;
			var $li = $('<li id="' + file.id + '" >' +
					'<p class="imgWrap"></p>' +
					'<div class="progress"></div>' +
					'<span class="precent"></span>' +
					'</li>'),

				$btns = $('<div class="file-panel">' +
					'<span class="cancel closebtn"></span>' +
					'</div>'
				).appendTo($li),
				$prgress = $li.find('div.progress'),
				$wrap = $li.find('p.imgWrap'),
				$info = $('<p class="error"><span></span><label></label></p>'),

				showError = function(code) {
					switch (code) {
						case 'exceed_size':
						// 文件大小超出
							text = messagesWeb.uploadWorksOrArticles.upload_p_file_size;
							break;

						case 'interrupt':
						// 上传暂停
							text = messagesWeb.upload_p_stop;
							// 网络错误
							$info.find('span').text(messagesWeb.comment_network_rror);
							break;
						default:
							if($li.attr('data-error')){
								// 图片格式异常
								serverText = messagesWeb.uploadWorksOrArticles.upload_p_format_exception;
								text = '';
								$info.find('span').text(serverText);	
							}else{
								// 点击续传
								text = messagesWeb.uploadWorksOrArticles.upload_p_click_resume;
								serverText = '';
								// 网络错误
								$info.find('span').text(messagesWeb.comment_network_rror);
							}
							break;
					}
					if ($li.find('.error').length == 0) {
						// $info.find('span').text('网络错误');
						$info.find('label').text(text);
						$info.appendTo($li);
						$li.find('.precent').addClass('hide');
						$info.find('label').on("click", function() {
							uploader.upload(file);
							$('#' + file.id).find('.precent').removeClass('hide');
						})
					}
				};

			if (file.getStatus() === 'invalid') {
				showError(file.statusText);
			} else {
				// @todo lazyload
				$wrap.text('预览中');
				uploader.makeThumb(file, function(error, src) {
					var img;

					if (error) {
						$wrap.text('不能预览');
						return;
					}

					if (isSupportBase64) {
						img = $('<img src="' + src + '">');
						$wrap.empty().append(img);
					} else {
						$.ajax('http://172.16.4.124:8001/mock/ajax/addFollow.json.js', {
							method: 'GET',
							data: "src",
							dataType: 'json'
						}).done(function(response) {
							if (response.result) {
								img = $('<img src="' + response.result + '">');
								$wrap.empty().append(img);
							} else {
								$wrap.text("预览出错");
							}
						});
					}
				}, thumbnailWidth, thumbnailHeight);

				percentages[file.id] = [file.size, 0];
				file.rotation = 0;
			}
			file.on('statuschange', function(cur, prev) {
				if (prev === 'progress') {
					$prgress.hide().height(0);
				}
				// console.log(cur + ',' + prev)
					// 成功
				if (cur === 'error' || cur === 'invalid') {
					showError(file.statusText);
					if (percentages[file.id]) {
						percentages[file.id][1] = 1;
					}
				} else if (cur === 'interrupt') {
					showError('interrupt');
				} else if (cur === 'queued') {
					$info.remove();
					$prgress.css('display', 'block');
					percentages[file.id][1] = 0;
				} else if (cur === 'progress') {
					$info.remove();
					$prgress.css('display', 'block');
				} else if (cur === 'complete') {
					var note = '';
					$prgress.hide().height(0);
					addDes($li);
					
					$li.append('<div class="pic-success-tips">' + messagesWeb.uploadPlugin.upload_success_copy + '</div>');
					setInterTime = setInterval(function(){
						$('.pic-success-tips').fadeOut('fast',function(){
							$('.pic-success-tips').remove();
							clearInterval(setInterTime);
						});
					},500)
					$(document).click(function() {
						if ($('.addNote').length) {
							$('.addNote').remove();
						}
					});
					$(".success").click(function(event) {
						event.stopPropagation();
					});
				}
				//添加注释
				// function addDes() {
				// 	if ($li.find('.error').length == 0) {
				// 		$li.append('<div class="success">' +
				// 			'<span class="adddes">添加注释</span></div>');
				// 		$('.success').on('click', function() {
				// 			$li = $(this).parents('li');
				// 			$adds = $(this).parents('li');
				// 			$add = $('.workimg-con');
				// 			$left = $(this).parents('li').offset().left - $('.workimg-con').offset().left + 20;
				// 			if($('#container').width() - $(this).parents('li').width() - $(this).parents('li').position().left <= 240){
				// 				$left = $left - 163
				// 				self.temporaryOnOff = false;
				// 			}else{
				// 				self.temporaryOnOff = true;
				// 				}
				// 			$top = $(this).parents('li').offset().top - $('.workimg-con').offset().top + 195;
				// 			reDes($li);
				// 			var val = $('.addNote .text').val();
				// 			$('.addNote .text').val('').focus().val(val);
				// 		})
				// 	}

				// }
				// //是否修改注释
				// function reDes(li) {
				// 	var $li = li;
				// 	if ($('.addNote').length == 0) {
				// 		if ($adds.find('.adddes').html() == '修改注释') {
				// 			$add.append('<div class="addNote" style="position:absolute;top:' +
				// 				$top + 'px;left:' + $left + 'px"><br><div class="description-box"><textarea class="text textarea-style" cols="30" placeHolder="11111" oninput="MaxYou(this)">' +
				// 				$li.attr('data-description') + '</textarea></div>' + '<span class="btn-default-main submit">提交</span></div>');
				// 			$add.find('.text').css('height', $add.find('.text').scrollTop() + $add.find('.text')[0].scrollHeight + 'px');
				// 			if ($add.find('.text').scrollTop() + $add.find('.text')[0].scrollHeight < 85) {
				// 				$add.find('.text').css('overflow', 'hidden');
				// 			} else {
				// 				$add.find('.text').css('overflow', 'auto');
				// 			}
				// 		} else {
				// 			$add.append('<div class="addNote" style="position:absolute;top:' + $top + 'px;left:' +
				// 				$left + 'px"><br><div class="description-box"><textarea  class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)">' +
				// 				'</textarea></div>' + '<span class="btn-default-main submit">提交</span></div>');
				// 		}
				// 		backShow($li);
				// 		$(".addNote").click(function(event) {
				// 			event.stopPropagation();
				// 		});
				// 	} else {
				// 		$('.addNote').remove();
				// 		if ($adds.find('.adddes').html() == '修改注释') {
				// 			$add.append('<div class="addNote" style="position:absolute;top:' +
				// 				$top + 'px;left:' + $left + 'px"><br><div class="description-box"><textarea class="text textarea-style" cols="30" placeHolder="11111" oninput="MaxYou(this)" >' +
				// 				$li.attr('data-description') + '</textarea></div>' + '<span class="btn-default-main submit">提交</span></div>');
				// 		} else {
				// 			$add.append('<div class="addNote" style="position:absolute;top:' + $top + 'px;left:' +
				// 				$left + 'px"><br><div class="description-box"><textarea  class="text textarea-style" cols="30" placeHolder="请输入作品注释" oninput="MaxYou(this)">' +
				// 				'</textarea></div>' + '<span class="btn-default-main submit">提交</span></div>');
				// 		}
				// 		backShow($li);
				// 		$(".addNote").click(function(event) {
				// 			event.stopPropagation();
				// 		});
				// 	}
				// 	if(self.temporaryOnOff == false){
				// 		$('.workimg-con .addNote').addClass('triangle_style')
				// 	}
				// 	zCharCount_withExceedCount($(".addNote textarea"), {
				// 		allowed: 1000
				// 	});
				// }
				// //注释回显
				// function Explanatory() {
				// 	var addExplanatory = parseInt($('.workimg-con .addNote textarea').siblings('.count').html())

				// 	if (addExplanatory < 0) {
				// 		pageToastSuccess('作品注释最多1000个字符');
				// 		return false;
				// 	}
				// }

				// function backShow(li) {
				// 	var $li = li;
				// 	if ($('.submit').length) {
				// 		$('.submit').on('click', function() {
				// 			if ($('.text').val().replace(/\s+/g, "").length != 0 && Explanatory() != false) {
				// 				$adds.find('.adddes').html('修改注释');
				// 				$li.attr('data-description', $('.text').val());
				// 				$btns.stop().animate({
				// 					height: 0
				// 				});
				// 				$('.adddes').css('fontSize', '0');
				// 				$('.success').animate({
				// 					height: 0
				// 				});
				// 				$('.addNote').remove();
				// 			}
				// 		})
				// 	}
				// }

				$li.removeClass('state-' + prev).addClass('state-' + cur);

				if ($('.filelist .state-complete').length) {
					$('.work-imgbox .error-prompt').addClass('hide');
				}
			});

			$li.on('mousemove', function() {
				$btns.css({
					height: 30
				});
				$(this).find('.adddes').css('fontSize', '14px');
				$(this).children('.success').css({
					height: 40,
					opacity: 0.8
				});
			});

			$li.on('mouseleave', function() {
				$btns.css({
					height: 0
				});
				$(this).find('.adddes').css('fontSize', '0');
				$(this).children('.success').css({
					height: 0
				});
			});

			$btns.on('click', 'span', function() {
				var index = $(this).index();

				switch (index) {
					case 0:
						uploader.removeFile(file);
						return;
				}


			});


			if ($('#replace').length) {
				$('#replace').parent().parent().replaceWith($li);
			} else {
				if ($('.fileList li').find('.big').length) {
					$li.insertBefore($($('.fileList li').find('.big')[0]).parent());
				} else {
					$li.appendTo($queue);
				}
			}
			// $li.attr('data', JSON.stringify(file));
		}

		// 负责view的销毁
		function removeFile(file) {
			var $li = $('#' + file.id);

			delete percentages[file.id];
			// updateTotalProgress();
			$li.off().find('.file-panel').off().end().remove();
		}

		function uploadDes(text) {
			var xhr = new XMLHttpRequest();

			xhr.open(method, url, true);

			xhr.send(text);

		}

		function setState(val) {
			var file, stats;
			if (val === state) {
				return;
			}

			$upload.removeClass('state-' + state);
			$upload.addClass('state-' + val);
			state = val;

			switch (state) {
				case 'pedding':
					$placeHolder.removeClass('element-invisible');
					$queue.hide();
					$statusBar.addClass('element-invisible');
					uploader.refresh();
					break;

				case 'ready':
					$placeHolder.addClass('element-invisible');
					$('#filePicker2').removeClass('element-invisible');
					$queue.show();
					$statusBar.removeClass('element-invisible');
					uploader.refresh();
					break;

				case 'uploading':
					$('#filePicker2').addClass('element-invisible');
					$progress.show();
					// 上传暂停
					$upload.text(messagesWeb.uploadWorksOrArticles.upload_p_stop);
					break;

				case 'paused':
					$progress.show();
					// 继续上传
					$upload.text(messagesWeb.uploadWorksOrArticles.upload_p_continue_up);
					break;

				case 'confirm':
					$progress.hide();
					$('#filePicker2').removeClass('element-invisible');
					// 开始上传
					$upload.text(messagesWeb.uploadWorksOrArticles.upload_p_start_up);

					stats = uploader.getStats();
					if (stats.successNum && !stats.uploadFailNum) {
						setState('finish');
						return;
					}
					break;
				case 'finish':
					stats = uploader.getStats();
					if (stats.successNum) {
						// alert( '上传成功' );
					} else {
						// 没有成功的图片，重设
						state = 'done';
						location.reload();
					}
					break;
			}

			// updateStatus();
		}

		uploader.onUploadProgress = function(file, percentage) {
			var $li = $('#' + file.id),
				$percent = $li.find('div.progress '),
				$percentChild = $li.find('div.progress span');
			if (percentage < 3) {
				percentage = 3;
			} else if (percentage == 100) {
				percentage = 99;
			}
			$li.find('.precent').html(percentage + '%');
			$percent.css({
				'height': 100 - percentage + '%',
				'width': '241px'
			});
			$li.find('.precent').css({
				'color': '#fff',
				'position': 'absolute',
				'left': '45%',
				'top': '50%',
				'z-index': '55'
			});
			try {
				percentages[file.id][1] = percentage;
			} catch (err) {}
		};

		uploader.on('beforeFileQueued', function(file) {
			var successCount = 0;
			var queue = $('#form-data-productImages li:not(".sortable-placeholder")');
			for (var i = 0, len = queue.length; i < len; i++) {
				if ($(queue[i]).hasClass('state-complete')) {
					successCount++;
				}
			}
			if (successCount >= 100) {
				if (!window.toast) {
					// 上传文件不能超过100个
					pageToastFail(messagesWeb.uploadPlugin.upload_limit);
					window.toast = true;
				}
				return false;
			}
			var size = 10 * 1024 * 1024,
				f = file.source.source;
			if (img(f, file, size)) {
				uploader.makeThumb(file, function(error, src) {
					if (isSupportBase64) {
						// 大小超限，上传失败
						var li = $('<li draggable="true"><p class="imgWrap"><img src="' + src + '"></p><div class="file-panel" style="height: 0px;"><span class="cancel closebtn"></span></div><p class="error big"><label class="noclick">' + messagesWeb.uploadWorksOrArticles.upload_size_limit + '</label></p></li>')
						$('.filelist').append(li);
						cancel(li, li.find('.file-panel'));
					}
				}, thumbnailWidth, thumbnailHeight);
				return false;
			}
			var count = 0;
			var queue = $('#form-data-productImages li');
			for (var i = 0, len = queue.length; i < len; i++) {
				if ($(queue[i]).find('.error').length == 0) {
					count++;
					if (count == 100) {
						break;
					}
				}
			}
			if (count >= 100) {
				return false;
			}
			return true;
		});

		uploader.onFileQueued = function(file) {
			fileCount++;
			fileSize += file.size;

			if (fileCount === 1) {
				$placeHolder.addClass('element-invisible');
				$statusBar.show();
			}

			addFile(file);
			setState('ready');
			// updateTotalProgress();
		};

		uploader.onFileDequeued = function(file) {
			fileCount--;
			fileSize -= file.size;

			if (!fileCount) {
				setState('pedding');
			}

			removeFile(file);
			// updateTotalProgress();

		};
		uploader.on('all', function(type) {
			var stats;
			switch (type) {
				case 'uploadFinished':
					setState('confirm');
					break;

				case 'startUpload':
					setState('uploading');
					break;

				case 'stopUpload':
					setState('paused');
					break;

			}
		});

		uploader.onError = function(code) {
			console.log('Eroor: ' + code);
		};
	});
})(jQuery);