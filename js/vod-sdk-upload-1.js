"use strict";(function(){var detectIEVersion=function(){var v=4,div=document.createElement("div"),all=div.getElementsByTagName("i");while(div.innerHTML="<!--[if gt IE "+v+"]><i></i><![endif]-->",all[0]){v++}return v>4?v:false};var _extend=function(dst,src){for(var i in src){if(Object.prototype.hasOwnProperty.call(src,i)&&src[i]){dst[i]=src[i]}}};function OssUpload(config){if(!config){return}this._config={chunkSize:1048576};_extend(this._config,config);if(!this._config.aliyunCredential&&!this._config.stsToken){return}if(!this._config.endpoint){return}var ALY=window.ALY;if(this._config.stsToken){this.oss=new ALY.OSS({accessKeyId:this._config.stsToken.Credentials.AccessKeyId,secretAccessKey:this._config.stsToken.Credentials.AccessKeySecret,securityToken:this._config.stsToken.Credentials.SecurityToken,endpoint:this._config.endpoint,apiVersion:"2013-10-15"})}else{this.oss=new ALY.OSS({accessKeyId:this._config.aliyunCredential.accessKeyId,secretAccessKey:this._config.aliyunCredential.secretAccessKey,endpoint:this._config.endpoint,apiVersion:"2013-10-15"})}this._uploadInfo={};this._uploadInfo.state=undefined;this._uploadInfo.step=undefined}OssUpload.UPLOADSTATE={INIT:"init",UPLOADING:"uploading",COMPLETE:"complete",INTERRUPT:"interrupt"};OssUpload.UPLOADSTEP={INIT:"init",PART:"part",COMPLETE:"complete"};OssUpload.prototype.init=function(options){var onerror=options.onerror;var errors=this._config.errors;if(!options){if(typeof onerror=="function"){onerror(errors.format(VODUploadError.CODE.EmptyValue,VODUploadError.MESSAGE.EmptyValue,"options"))}return}if(!options.file){if(typeof options.onerror=="function"){onerror(errors.format(VODUploadError.CODE.EmptyValue,VODUploadError.MESSAGE.EmptyValue,"file"))}return}if(!options.object){if(typeof options.onerror=="function"){onerror(errors.format(VODUploadError.CODE.EmptyValue,VODUploadError.MESSAGE.EmptyValue,"object"))}return}options.object=options.object.replace(new RegExp("^/"),"");this._callback={};this._callback.onerror=options.onerror;this._callback.oncomplete=options.oncomplete;this._callback.onprogress=options.onprogress;this._uploadInfo.file=options.file;this._uploadInfo.blobSlice=File.prototype.slice||File.prototype.mozSlice||File.prototype.webkitSlice;this._uploadInfo.chunksNum=Math.ceil(options.file.size/this._config.chunkSize);this._uploadInfo.currentChunk=0;this._uploadInfo.uploadId=undefined;this._uploadInfo.type=undefined;this._uploadInfo.multipartMap={Parts:[]};this._uploadInfo.connum=0;this._uploadInfo.object=options.object;this._uploadInfo.headers=options.headers;this._uploadInfo.state=OssUpload.UPLOADSTATE.INIT;this._uploadInfo.step=OssUpload.UPLOADSTEP.INIT};OssUpload.prototype.oncomplete=function(){if(typeof this._callback.oncomplete=="function"){this._callback.oncomplete(this._uploadInfo.uploadId)}};OssUpload.prototype.onprogress=function(){var self=this;var multipartMap=self._uploadInfo.multipartMap;if(typeof this._callback.onprogress=="function"){var loaded=0;for(var i=0;i<multipartMap.Parts.length;i++){loaded+=multipartMap.Parts[i].loaded}self._callback.onprogress({loaded:loaded,total:this._uploadInfo.file.size})}};OssUpload.prototype.cancelUpload=function(){this._uploadInfo.state=OssUpload.UPLOADSTATE.INTERRUPT};OssUpload.prototype.createMultipartUpload=function(){var self=this;var params={Bucket:self._config.bucket,Key:self._uploadInfo.object,ContentType:self._uploadInfo.file.type||""};self._uploadInfo.state=OssUpload.UPLOADSTATE.START;self.oss.createMultipartUpload(params,function(err,res){self.onCreateMultipartUpload(err,res)})};OssUpload.prototype.onCreateMultipartUpload=function(err,res){var self=this;if(this._uploadInfo.state==OssUpload.UPLOADSTATE.INTERRUPT){return}if(err){if(err.code=="NetworkingError"){setTimeout(function(){self.createMultipartUpload()},1e3*2)}else{self._callback.onerror(err)}return}self._uploadInfo.uploadId=res.UploadId;self._uploadInfo.step=OssUpload.UPLOADSTEP.PART;self.loadChunk()};OssUpload.prototype.uploadPart=function(partNum){var self=this;var multipartMap=self._uploadInfo.multipartMap;var partParams={Body:multipartMap.Parts[partNum].data,Bucket:self._config.bucket,Key:self._uploadInfo.object,PartNumber:String(partNum+1),UploadId:self._uploadInfo.uploadId};var req=self.oss.uploadPart(partParams,function(err,data){self.onUploadPart(partNum,err,data)});req.on("httpUploadProgress",function(p){multipartMap.Parts[partNum].loaded=p.loaded;self.onprogress()})};OssUpload.prototype.onUploadPart=function(partNum,err,data){var self=this;var _uploadInfo=this._uploadInfo;var multipartMap=self._uploadInfo.multipartMap;if(this._uploadInfo.state==OssUpload.UPLOADSTATE.INTERRUPT){return}if(err){if(err.code=="NetworkingError"){multipartMap.Parts[partNum].loaded=0;setTimeout(function(){self.uploadPart(partNum)},1e3*2)}else{if(self._uploadInfo.state==OssUpload.UPLOADSTATE.INTERRUPT){return}_uploadInfo.state=OssUpload.UPLOADSTATE.INTERRUPT;self._callback.onerror(err,data)}return}multipartMap.Parts[partNum].ETag=data.ETag;multipartMap.Parts[partNum].loaded=multipartMap.Parts[partNum].data.byteLength;delete multipartMap.Parts[partNum].data;if(_uploadInfo.currentChunk<_uploadInfo.chunksNum){self.loadChunk()}else{if(self._uploadInfo.connum==0&&multipartMap.Parts.length==_uploadInfo.chunksNum){self._uploadInfo.step=OssUpload.UPLOADSTEP.COMPLETE;self.completeMultipartUpload()}}};OssUpload.prototype.completeMultipartUpload=function(){var self=this;var multipartMap=self._uploadInfo.multipartMap;for(var i in multipartMap.Parts){if(multipartMap.Parts[i].loaded){delete multipartMap.Parts[i].loaded}}var doneParams={Bucket:self._config.bucket,Key:self._uploadInfo.object,CompleteMultipartUpload:multipartMap,UploadId:self._uploadInfo.uploadId};_extend(doneParams,self._uploadInfo.headers);this.oss.completeMultipartUpload(doneParams,function(err,res){self.onMultiUploadComplete(err,res)})};OssUpload.prototype.onMultiUploadComplete=function(err,res){var self=this;if(this._uploadInfo.state==OssUpload.UPLOADSTATE.INTERRUPT){return}if(err){if(typeof self._callback.onerror=="function"){if(err){if(err.code=="NetworkingError"){setTimeout(function(){self.completeMultipartUpload()},1e3*2)}else{self._callback.onerror(err)}}else{console.log("onMultiUploadComplete: error msg is null.")}return}return}if(typeof self._callback.oncomplete=="function"){self._uploadInfo.state=OssUpload.UPLOADSTATE.COMPLETE;self._callback.oncomplete(res)}};OssUpload.prototype.loadChunk=function(){var self=this;var _uploadInfo=self._uploadInfo;var config=self._config;var currentChunk=_uploadInfo.currentChunk;var fileReader=new FileReader;fileReader.onload=function(e){self.frOnload(currentChunk,e)};fileReader.onerror=function(e){self.frOnerror(currentChunk,e)};var start=currentChunk*config.chunkSize;var end=start+config.chunkSize>=_uploadInfo.file.size?_uploadInfo.file.size:start+config.chunkSize;var blobPacket=_uploadInfo.blobSlice.call(_uploadInfo.file,start,end);fileReader.readAsArrayBuffer(blobPacket);_uploadInfo.currentChunk++};OssUpload.prototype.frOnload=function(current,e){var self=this;var _uploadInfo=self._uploadInfo;_uploadInfo.multipartMap.Parts[current]={data:e.target.result,PartNumber:current+1,loaded:0};if(this._uploadInfo.state==OssUpload.UPLOADSTATE.INTERRUPT){return}self.uploadPart(current)};OssUpload.prototype.frOnerror=function(current,e){var self=this;var onerror=self._callback.onerror;var errors=self._config.errors;var _uploadInfo=self._uploadInfo;if(typeof onerror=="function"){onerror(errors.format(errors.CODE.ReadFileError,errors.MESSAGE.ReadFileError,_uploadInfo.file.name,current))}};OssUpload.prototype.resumeUploadWithToken=function(accessKeyId,accessKeySecret,securityToken){var self=this;var multipartMap=self._uploadInfo.multipartMap;if(self._uploadInfo.state!=OssUpload.UPLOADSTATE.INTERRUPT){return}self._config.stsToken.Credentials.AccessKeyId=accessKeyId;self._config.stsToken.Credentials.AccessKeySecret=accessKeySecret;self._config.stsToken.Credentials.SecurityToken=securityToken;var ALY=window.ALY;if(self._config.stsToken){self.oss=new ALY.OSS({accessKeyId:self._config.stsToken.Credentials.AccessKeyId,secretAccessKey:self._config.stsToken.Credentials.AccessKeySecret,securityToken:self._config.stsToken.Credentials.SecurityToken,endpoint:self._config.endpoint,apiVersion:"2013-10-15"})}else{self.oss=new ALY.OSS({accessKeyId:self._config.aliyunCredential.accessKeyId,secretAccessKey:self._config.aliyunCredential.secretAccessKey,endpoint:self._config.endpoint,apiVersion:"2013-10-15"})}self._uploadInfo.state=OssUpload.UPLOADSTATE.UPLOADING;if(self._uploadInfo.step==OssUpload.UPLOADSTEP.INIT){self.createMultipartUpload()}else if(self._uploadInfo.step==OssUpload.UPLOADSTEP.PART){for(var i in multipartMap.Parts){if(multipartMap.Parts[i].data){self.uploadPart(parseInt(i));break}}}else if(self._uploadInfo.step==OssUpload.UPLOADSTEP.COMPLETE){self.completeMultipartUpload()}};OssUpload.prototype.resumeUpload=function(){var self=this;var multipartMap=self._uploadInfo.multipartMap;if(self._uploadInfo.state!=OssUpload.UPLOADSTATE.INTERRUPT){return}self._uploadInfo.state=OssUpload.UPLOADSTATE.UPLOADING;if(self._uploadInfo.step==OssUpload.UPLOADSTEP.INIT){self.createMultipartUpload()}else if(self._uploadInfo.step==OssUpload.UPLOADSTEP.PART){for(var i in multipartMap.Parts){if(multipartMap.Parts[i].data){self.uploadPart(parseInt(i));break}}}else if(self._uploadInfo.step==OssUpload.UPLOADSTEP.COMPLETE){self.completeMultipartUpload()}};OssUpload.prototype.upload=function(){this._uploadInfo.state=OssUpload.UPLOADSTATE.START;this.createMultipartUpload()};var VODUpload=function(options){this.options=options;this.initialize()};VODUpload.UPLOADSTATE={INIT:"Ready",UPLOADING:"Uploading",SUCCESS:"Success",FAIlURE:"Failure",CANCELED:"Canceled",STOPED:"Stoped"};VODUpload.VODSTATE={INIT:"Init",START:"Start",STOP:"Stop",FAILURE:"Failure",EXPIRE:"Expire",END:"End"};VODUpload.prototype={constructor:VODUpload,initialize:function(){this.options.uploadList=[];this.options.oss=new Object;this.options.curIndex=null;this.options.state=VODUpload.VODSTATE.INIT},init:function(accessKeyId,accessKeySecret,securityToken,expireTime){if(securityToken&&!expireTime||!securityToken&&expireTime){return false}if(accessKeyId&&!accessKeySecret||!accessKeyId&&accessKeySecret){return false}var options=this.options;options.oss.accessKeyId=accessKeyId;options.oss.accessKeySecret=accessKeySecret;options.oss.securityToken=securityToken;options.oss.expireTime=expireTime;for(var i=0;i<options.uploadList.length;i++){if(options.uploadList[i].state==VODUpload.UPLOADSTATE.FAIlURE){options.uploadList[i].state=VODUpload.UPLOADSTATE.INIT}}return true},addFile:function(file,endpoint,bucket,object,userData){if(!file){return false}var options=this.options;for(var i=0;i<options.uploadList.length;i++){if(options.uploadList[i].file==file){return false}}var uploadObject=new Object;uploadObject.file=file;uploadObject.endpoint=endpoint;uploadObject.bucket=bucket;uploadObject.object=object;uploadObject.state=VODUpload.UPLOADSTATE.INIT;uploadObject.userData=ALY.util.base64.encode(userData);var self=this;uploadObject.reload=function(){if(this.state==VODUpload.UPLOADSTATE.CANCELED||this.state==VODUpload.UPLOADSTATE.FAIlURE){this.state=VODUpload.UPLOADSTATE.INIT}self.options.curIndex=undefined;self.nextUpload()};uploadObject.cancel=function(){self.cancelFile(uploadObject.file)};self.options.uploadList.push(uploadObject);return true},deleteFile:function(index){if(this.cancelFile(index)){this.options.uploadList.splice(index,1);return true}return false},cleanList:function(){this.stopUpload();this.options.uploadList.length=0},cancelFile:function(index){var options=this.options;if(index<0||index>=options.uploadList.length){return false}if(index==options.curIndex&&options.uploadList[index].state==VODUpload.UPLOADSTATE.UPLOADING){options.uploadList[index].state=VODUpload.UPLOADSTATE.CANCELED;this.options.ossUpload.cancelUpload();this.nextUpload()}else if(options.uploadList[index].state!=VODUpload.UPLOADSTATE.SUCCESS){options.uploadList[index].state=VODUpload.UPLOADSTATE.CANCELED}return true},resumeFile:function(index){var options=this.options;if(index<0||index>=options.uploadList.length){return false}if(options.uploadList[index].state!=VODUpload.UPLOADSTATE.CANCELED){return false}options.uploadList[index].state=VODUpload.UPLOADSTATE.INIT;return true},listFiles:function(){return this.options.uploadList},startUpload:function(){var options=this.options;if(this.options.state==VODUpload.VODSTATE.START||this.options.state==VODUpload.VODSTATE.EXPIRE){return}else if(this.options.state==VODUpload.VODSTATE.STOP){if(options&&options.ossUpload&&null!=options.curIndex&&options.uploadList[options.curIndex]&&options.uploadList[options.curIndex].state==VODUpload.UPLOADSTATE.STOPED){options.uploadList[options.curIndex].state=VODUpload.UPLOADSTATE.UPLOADING;options.ossUpload.resumeUpload();this.options.state=VODUpload.VODSTATE.START;return}}options.curIndex=null;for(var i=0;i<options.uploadList.length;i++){if(options.uploadList[i].state==VODUpload.UPLOADSTATE.INIT){options.curIndex=i;break}}if(null==options.curIndex){this.options.state=VODUpload.VODSTATE.END;return}var curObject=options.uploadList[options.curIndex];if(options.onUploadstarted){options.onUploadstarted(curObject)}curObject.state=VODUpload.UPLOADSTATE.UPLOADING;var endpoint=curObject.endpoint||"http://oss-cn-hangzhou.aliyuncs.com";var ossUpload;if(!options.oss.securityToken){ossUpload=new OssUpload({bucket:curObject.bucket,endpoint:endpoint,chunkSize:1048576,concurrency:1,aliyunCredential:{accessKeyId:options.oss.accessKeyId,secretAccessKey:options.oss.accessKeySecret}})}else{ossUpload=new OssUpload({bucket:curObject.bucket,endpoint:endpoint,chunkSize:1048576,concurrency:1,stsToken:{Credentials:{AccessKeyId:options.oss.accessKeyId,AccessKeySecret:options.oss.accessKeySecret,SecurityToken:options.oss.securityToken}}})}options.ossUpload=ossUpload;var self=this;ossUpload.init({file:curObject.file,object:curObject.object,maxRetry:3,onerror:function(evt){if(evt.code=="SecurityTokenExpired"||evt.code=="InvalidAccessKeyId"&&options.oss.secretToken&&options.oss.secretToken.length>0){options.state=VODUpload.VODSTATE.EXPIRE;if(options.onUploadTokenExpired){options.onUploadTokenExpired(self)}}else{if(curObject.state!=VODUpload.UPLOADSTATE.CANCELED){curObject.state=VODUpload.UPLOADSTATE.FAIlURE;if(options.onUploadFailed){if(evt&&evt.code&&evt.message){options.onUploadFailed(curObject,evt.code,evt.message)}}}options.state=VODUpload.VODSTATE.FAILURE}},oncomplete:function(res){curObject.state=VODUpload.UPLOADSTATE.SUCCESS;if(options.onUploadSucceed){options.onUploadSucceed(curObject)}setTimeout(function(){self.nextUpload()},100)},onprogress:function(option){if(options.onUploadProgress){options.onUploadProgress(curObject,option.total,option.loaded)}},headers:{Notification:curObject.userData}});ossUpload.upload();this.options.state=VODUpload.VODSTATE.START},nextUpload:function(){var options=this.options;if(this.options.state!=VODUpload.VODSTATE.START){return}options.curIndex=null;for(var i=0;i<options.uploadList.length;i++){if(options.uploadList[i].state==VODUpload.UPLOADSTATE.INIT){options.curIndex=i;break}}if(null==options.curIndex){this.options.state=VODUpload.VODSTATE.END;return}var curObject=options.uploadList[options.curIndex];if(options.onUploadstarted){options.onUploadstarted(curObject)}curObject.state=VODUpload.UPLOADSTATE.UPLOADING;var endpoint=curObject.endpoint||"http://oss-cn-hangzhou.aliyuncs.com";var ossUpload;if(!options.oss.securityToken){ossUpload=new OssUpload({bucket:curObject.bucket,endpoint:endpoint,chunkSize:1048576,concurrency:1,aliyunCredential:{accessKeyId:options.oss.accessKeyId,secretAccessKey:options.oss.accessKeySecret}})}else{ossUpload=new OssUpload({bucket:curObject.bucket,endpoint:endpoint,chunkSize:1048576,concurrency:1,stsToken:{Credentials:{AccessKeyId:options.oss.accessKeyId,AccessKeySecret:options.oss.accessKeySecret,SecurityToken:options.oss.securityToken}}})}options.ossUpload=ossUpload;var self=this;ossUpload.init({file:curObject.file,object:curObject.object,maxRetry:3,onerror:function(evt){if(evt.code=="SecurityTokenExpired"||evt.code=="InvalidAccessKeyId"&&options.oss.secretToken&&options.oss.secretToken.length>0){if(options.onUploadTokenExpired){options.state=VODUpload.VODSTATE.EXPIRE;options.onUploadTokenExpired(self)}}else{if(curObject.state!=VODUpload.UPLOADSTATE.CANCELED){curObject.state=VODUpload.UPLOADSTATE.FAIlURE;if(options.onUploadFailed){if(evt&&evt.code&&evt.message){options.onUploadFailed(curObject,evt.code,evt.message)}}}options.state=VODUpload.VODSTATE.FAILURE}},oncomplete:function(res){curObject.state=VODUpload.UPLOADSTATE.SUCCESS;if(options.onUploadSucceed){options.onUploadSucceed(curObject)}setTimeout(function(){self.nextUpload()},100)},onprogress:function(option){if(options.onUploadProgress){options.onUploadProgress(curObject,option.total,option.loaded)}},headers:{Notification:curObject.userData}});ossUpload.upload()},clear:function(state){var options=this.options;var num=0;for(var i=0;i<options.uploadList.length;i++){if(options.uploadList[i].state==VODUpload.UPLOADSTATE.SUCCESS){num++}if(options.uploadList[i].state==state){options.uploadList.splice(i,1);i--}}if(options.onClear){options.onClear(options.uploadList.length,num)}},stopUpload:function(){if(this.options.state!=VODUpload.VODSTATE.START&&this.options.state!=VODUpload.VODSTATE.FAILURE){return}this.options.ossUpload.cancelUpload();this.options.state=VODUpload.VODSTATE.STOP;this.options.uploadList[this.options.curIndex].state=VODUpload.UPLOADSTATE.STOPED},resumeUploadWithAuth:function(uploadAuth){var self=this;if(!uploadAuth){return false}var key=JSON.parse(ALY.util.base64.decode(uploadAuth));if(!key.AccessKeyId||!key.AccessKeySecret||!key.SecurityToken||!key.Expiration){return false}return self.resumeUploadWithToken(key.AccessKeyId,key.AccessKeySecret,key.SecurityToken,key.Expiration)},resumeUploadWithToken:function(accessKeyId,accessKeySecret,securityToken,expireTime){var options=this.options;if(!accessKeyId||!accessKeySecret||!securityToken||!expireTime){return false}if(this.options.state!=VODUpload.VODSTATE.EXPIRE){return false}this.init(accessKeyId,accessKeySecret,securityToken,expireTime);options.ossUpload.resumeUploadWithToken(accessKeyId,accessKeySecret,securityToken);this.options.state=VODUpload.VODSTATE.START;return true},setUploadAuthAndAddress:function(uploadInfo,uploadAuth,uploadAddress){if(!uploadInfo||!uploadAuth||!uploadAddress){return false}var authKey=JSON.parse(ALY.util.base64.decode(uploadAuth));if(!authKey.AccessKeyId||!authKey.AccessKeySecret||!authKey.SecurityToken||!authKey.Expiration){return false}var addressKey=JSON.parse(ALY.util.base64.decode(uploadAddress));if(!addressKey.Endpoint||!addressKey.Bucket||!addressKey.FileName){return false}var curObject=uploadInfo;this.options.oss.accessKeyId=authKey.AccessKeyId;this.options.oss.accessKeySecret=authKey.AccessKeySecret;this.options.oss.securityToken=authKey.SecurityToken;this.options.oss.expireTime=authKey.Expiration;curObject.endpoint=addressKey.Endpoint;curObject.bucket=addressKey.Bucket;curObject.object=addressKey.FileName}};window.VODUpload=VODUpload})();
