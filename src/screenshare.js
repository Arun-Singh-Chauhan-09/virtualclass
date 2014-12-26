/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
    function (window){
        
    function callback(error){
        vApp.vutil.initInstallChromeExt(error);
    }
//    window.postMessage({ type: 'isInstalled', id: 1 }, '*');
    var screenShare = function (config){
         vApp.getSceenFirefox = function (){
               
        //if(window.navigator.userAgent.match('Firefox')){

            var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
            if (ffver >= 33) {
                    //constraints = (hasConstraints && constraints) || {
                    constraints = {
                        video: {
                            mozMediaSource: 'window',
                            mediaSource: 'window'
                        }
                    }

                    vApp.adpt = new vApp.adapter();
                    navigator2 =  vApp.adpt.init(navigator)

                    navigator2.getUserMedia(constraints, function (stream, err) {
                        //callback(err, stream);
                        vApp.ss._init();   
                        vApp.ss.initializeRecorder.call(vApp.ss, stream); 

                        // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
                        if (typeof err == 'undefined') {
                            var lastTime = stream.currentTime;
                            var polly = window.setInterval(function () {
                                if (!stream) window.clearInterval(polly);
                                if (stream.currentTime == lastTime) {
                                    window.clearInterval(polly);
                                    if (stream.onended) {
                                        stream.onended();
                                    }
                                }
                                lastTime = stream.currentTime;
                            }, 500);
                        }
                    },
                    
                    function (error){
                        if(typeof error == 'string'){
                            //PERMISSION_DENIED
                            if(error === 'PERMISSION_DENIED'){
                                //this url is need to be changed
                                window.open("https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/").focus();
                            }
                        }
                    }
                );
            } else {
                alert("Not supported screen sharing");
                
//                error = new Error('NavigatorUserMediaError');
//                error.name = 'EXTENSION_UNAVAILABLE'; // does not make much sense but...
            }

        //}
     }
        
        //vApp.gObj.cExt = true;
        
//         var pending = window.setTimeout(function () {
//                    error = new Error('NavigatorUserMediaError');
//                    error.name = 'EXTENSION_UNAVAILABLE';
//                    vApp.gObj.cExt = false;
//                }, 500);
//
//         window.postMessage({ type: 'getScreen', id: pending }, '*');
        //vApp.gObj.ext = false;
                //alert('suman bogati');
        return {
            
            prevStream : false,
            init : function (screen){
                
                this.type = screen.type;
                this.ssByClick =  true;
                this.manualStop = false; 
                //if(vApp.gObj.uRole == 't' && !vApp.hasOwnProperty('repType')){
                if(vApp.gObj.uRole == 't' && !vApp.recorder.recImgPlay){
                    //if(!vApp.hasOwnProperty('repType')){
                    this.readyTostart(screen.app);
                    //}
                }else{
                    this._init();
                }
                
                
//                var pending = window.setTimeout(function () {
//                    error = new Error('NavigatorUserMediaError');
//                    error.name = 'EXTENSION_UNAVAILABLE';
//                    vApp.gObj.cExt = false;
//                }, 500);
//
//                window.postMessage({ type: 'getScreen', id: pending }, '*');
//                
            },
            
            //called when user select the screencall
            _init : function (){
//                alert('screen share init');
                if(vApp.previous != config.id){
                    document.getElementById(vApp.previous).style.display = 'none';    
                    vApp.previous = config.id;
                }
                
                var ss = document.getElementById(config.id);
                if(ss != null){
                    ss.style.display = 'block';
                }
                
                if(!this.hasOwnProperty('id')){
                    //this.dc = window.dirtyCorner;
                    //
                    //this.sutil = window.sutil;
                    
                    this.dc = vApp.dirtyCorner;
                    
                    this.postFix = "Cont";
                    this.id =  config.hasOwnProperty('id') ? config.id  : "vAppScreenShare";
                    this.className = "vmApp";
                    this.label = "Local",

                    this.local = this.id + this.label;
                    this.localTemp = this.id + this.label + "Temp";

                    this.classes =  config.hasOwnProperty('class') ? config.classes : "";

                    this.prevImageSlices = [];
                    
                    var ssUI = document.getElementById(this.id);
                    
//                    if(ssUI == null){
//                        ssUI = this.html.UI.call(this, vApp.gObj.uRole);
//                    }

                      if(ssUI != null){
                          ssUI.parentNode.removeChild(ssUI);
                      }
                      ssUI = this.html.UI.call(this, vApp.gObj.uRole);
                    
                     //ssUI = this.html.UI.call(this, vApp.gObj.uRole);
                     //alert(ssUI.id);
                    //critical
                    
                    var beforeAppend = document.getElementById(vApp.rWidgetConfig.id);
                    
//                    if(vApp.gObj.uRole == 't'){
//                        var beforeAppend = document.getElementById(vApp.rWidgetConfig.id);
//                    }else{
//                        var beforeAppend = document.getElementById("speakerStudent");
//                    }
                    
                    
                    document.getElementById(vApp.html.id).insertBefore(ssUI, beforeAppend);
                    
                   // if(vApp.gObj.uRole == 't' && !vApp.hasOwnProperty('repType')){
                    if(vApp.gObj.uRole == 't' && !vApp.recorder.recImgPlay){
//                        this.localtempCanvas = document.getElementById(this.localTemp+"Video");
//                        this.localtempCont =  this.localtempCanvas.getContext('2d');
                          vApp.vutil.initLocCanvasCont(this.localTemp+"Video");
                    }
                }
            },

            readyTostart : function (app){
                if(app == vApp.apps[1]){
                    //this.getScreen(callback);
                    
                    this.getScreen();
                }else if(app == vApp.apps[2]){
                    this.wholeScreen(); 
                }
            },
            
            onError : function (e){
                console.log("Error " +  e);
            },

            getScreen : function (callback){
                if(vApp.system.mybrowser.name == 'Chrome'){
//                    alert(vApp.gObj.ext);
                    if(vApp.gObj.hasOwnProperty('ext') && vApp.gObj.ext){
                        window.postMessage({ type: 'getScreen', id: 1 }, '*');
                    }else{
                        var url  = 'https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl';   
                        chrome.webstore.install(url, function (){
                           // window.postMessage({ type: 'getScreen', id: 1 }, '*');
                            
                            //window.location.reload();
                        });
                    }
                }else if(vApp.system.mybrowser.name == 'Firefox'){
                    vApp.getSceenFirefox();
                }
            },    
            
            wholeScreen : function (){
                var  constraints = constraints || {audio: false, video: {
                    mandatory: {
                        chromeMediaSource: 'screen',
                        maxWidth: 1440,
                        maxHeight: 9999
                    },

                    optional: [
//                        {maxWidth: window.screen.width},
//                        {maxHeight: window.screen.height},
                        {maxFrameRate: 3}
                    ]
                
                    }
                };
                
                if(typeof vApp.adpt != 'object'){
                    vApp.adpt = new vApp.adapter();
                }
                
                navigator2 =  vApp.adpt.init(navigator);
                navigator2.getUserMedia(constraints, function (stream){
                    vApp.wss._init();   
                    vApp.wss.initializeRecorder.call(vApp.wss, stream);   
                }, function (e){
                    alert(e);
                    debugger;
                    vApp.wss.onError.call(vApp.ss, e);   
                });
            
            },
            
            
            unShareScreen : function (){    
                this.video.src = "";
                this.localtempCont.clearRect(0, 0, this.localtempCanvas.width, this.localtempCanvas.height);
                clearInterval(vApp.clear);
                this.prevImageSlices = [];
                
                if(this.hasOwnProperty('currentStream')){
                    this.currentStream.stop(); 
                }
                
                vApp.wb.utility.beforeSend({'unshareScreen' : true, st : this.type});
            },
            
            removeStream : function(){
                this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
            },

            initializeRecorder : function (stream){
                changeonresize = 0;

                if(this.prevStream){
                    this.ssByClick = false;
                }
                
                if(typeof vApp.prevScreen != 'undefined'){
                    if(vApp.prevScreen.hasOwnProperty('currentStream')){
                       vApp.prevScreen.unShareScreen();
                    }
                }
                
                this.video = document.getElementById(this.local+"Video");
                
                if(this.video.tagName != "VIDEO"){
                    var earlierVideo = this.video;
                    var video = document.createElement('video');
                    video.id = earlierVideo.id;
                    this.video.parentNode.replaceChild(video,  this.video);
                    
                    this.video = document.getElementById(this.local+"Video");
                    this.video.autoplay = true;
                    vApp.vutil.createLocalTempVideo("vAppScreenShare", this.local + "Temp");
                    vApp.vutil.initLocCanvasCont(this.local + "Temp" + "Video");
                }
                
                
//                if(this.video.tagName !=  "VIDEO"){
//                    
//                } 

                this.currentStream = stream;
                var that = this;
                
                console.log("video changed");
                
                vApp.adpt.attachMediaStream(this.video, stream);
                this.prevStream = true;
                
                this.currentStream.onended = function (name){
                    if(that.ssByClick){
                        that.video.src = "";
                        that.localtempCont.clearRect(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                        clearInterval(vApp.clear);
                        that.prevImageSlices = [];
                        vApp.wb.utility.beforeSend({'unshareScreen' : true, st : that.type});
                        that.prevStream = false;
                        that.prevScreen = "";
                    }else{
                        that.ssByClick = true;
                    }
                }
                
                var container = {};
                container.width = window.innerWidth;
                container.height = window.innerHeight - 140;
                
                var vidContainer = document.getElementById(this.local);
                var dimension =  this.html.getDimension(container);
                
                
                
                //dimension.width = dimension.width - 100;
                //dimension.width = dimension.width;
                
                vidContainer.style.width = Math.round(dimension.width) + "px";
                vidContainer.style.height = Math.round(dimension.height) + "px";

                //setStyleToElement(vidContainer, width, height);
                var that = this;
                var video;
                this.video.onloadedmetadata = function (){
                   /* if(dimension.width < that.video.offsetWidth){
                        that.width = dimension.width;
                        that.height = dimension.height;
                        
//                        that.video.style.maxWidth = (that.width - 5)  + "px";
                        
                    }else{
                        var  video = document.getElementById(that.local+"Video");
                        that.width = video.clientWidth;
                        that.height = video.clientHeight;
                    }*/
                    
//                    that.localtempCanvas.width = that.width;
//                    that.localtempCanvas.height = that.height;
                    
                    
                    that.width = dimension.width;
                    that.height = dimension.height;
                    
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                                        
                    
                    //that.localtempCanvas.width = 1000;
                    //that.localtempCanvas.height = 500;   
                    vApp.prevScreen = that;
                    
                    var res = vApp.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
                    
                    //that.initAfterImg();
                    that.sharing();
                    vApp.vutil.setContainerWidth(res);
                    
                    if(vApp.gObj.uRole == 't'){
						vApp.vutil.makeActiveApp(that.id, vApp.prevApp);
					}
                    
                    vApp.prevApp = that.id;
                    
                }
                
                
            },
            
            sharing : function (){
//                alert('hi brother');
//                debugger;
                
                //alert('it should be share everytime');
                var tempObj, encodedData, stringData, d, matched, imgData;
                this.latestScreen = [];
                //this.localtempCanvas = [];
                var resA = Math.round(this.localtempCanvas.height/12);
                var resB = Math.round(this.localtempCanvas.width/12);
		var masterSlice = null;

//                this.imageSlices = this.dc.getImageSlices(resA, resB, this);
                var that = this;
                var uniqcount = 0;
                var uniqmax = (resA * resB)/5;
                var sendObj;
                //var changeonresize=1;
                randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                if(vApp.hasOwnProperty('wholeImage')){
                    clearInterval(vApp.wholeImage);
                }
                //*TODO this should be handle according to screen
                // should create different instance for each screen
                vApp.wholeImage = setInterval(
                     function (){
                         if(typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined'){
                             if(prvVWidth != that.video.offsetWidth || prvVHeight != that.video.offsetHeight){
                                 changeonresize=1;
                             }
                         }
                        prvVWidth = that.video.offsetWidth;
                        prvVHeight = that.video.offsetHeight;

                        //prvCWidth = that.localtempCont.width;
                        //prvCHeight = that.localtempCont.height;
                     },
                     2000
                   //  1000
                );
                
                if(vApp.hasOwnProperty('clear')){
                    clearInterval(vApp.clear);
                }
                
                var screenIntervalTime=1000;
                var pscreenIntervalTime=1000;
                
                //function getDataFullScreen(type){
                vApp.getDataFullScreen = function (type){
                    //clearInterval(vApp.clear);
                    
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
                    
                    //if(typeof firstTimeDisp == 'undefined'){
                    var imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                    
                    var encodedData = that.dc.encodeRGB(imgData.data);
                    var h = breakintobytes(that.localtempCanvas.height,4);
                    var w = breakintobytes(that.localtempCanvas.width,4);
                    
                    if(type == 'ss'){
                        var statusCode = 102;
                    }else{
                        var statusCode = 202;
                    }
                    
                    
                    var scode = new Uint8ClampedArray( [statusCode, w[0], w[1], h[0], h[1] ] );
                        
                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(encodedData, scode.length); 
                   // io.sendBinary(sendmsg); 
                   
                   return sendmsg;
                }

                function getDataFullScreenResize(stype){
                    //clearInterval(vApp.clear);
                    
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
                    
                    //if(typeof firstTimeDisp == 'undefined'){
                    var imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                    
                    var encodedData = that.dc.encodeRGB(imgData.data);
                    
                    var contDimension = that.getContainerDimension();
                    if(typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined'){
                        var dw =  breakintobytes(prvVWidth,4); 
                        var dh =  breakintobytes(prvVHeight,4);

                        var vcw =  breakintobytes(contDimension.width,4); 
                        var vch =  breakintobytes(contDimension.height,4);

                    }else{
                        var dw =  breakintobytes(that.video.offsetWidth,4); 
                        var dh =  breakintobytes(that.video.offsetHeight,4);

                        var vcw =  breakintobytes(contDimension.width,4); 
                        var vch =  breakintobytes(contDimension.height,4);
                    }         
                    
                    var appCode = (stype == 'ss' ) ? 104 : 204;
                    
                    var scode = new Uint8ClampedArray( [appCode, dw[0], dw[1], dh[0], dh[1], vcw[0], vcw[1], vch[0], vch[1]]);
                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(encodedData, scode.length); 
                    
                    return sendmsg;
                }
                
                function sendSliceData(encodedData, d, stype){
                    var x = breakintobytes(d.x,4);
                    var y = breakintobytes(d.y,4);
                    
                    var appCode = (stype == 'ss') ? 103 : 203;
                    
                    var scode = new Uint8ClampedArray( [ appCode, x[0], x[1], y[0], y[1] , d.h, d.w ] );
                        
                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(encodedData, scode.length); 
                   
                   return sendmsg;
                }
                
                function sendScreen(){
                    clearInterval(vApp.clear);
                    
//                    clearInterval(vApp.clear);
//                    
//                    that.localtempCanvas.width = that.video.offsetWidth;
//                    that.localtempCanvas.height = that.video.offsetHeight;
//                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
//                    
//                    //if(typeof firstTimeDisp == 'undefined'){
//                    var imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
//                    var encodedData = that.dc.encodeRGB(imgData.data);
//                    var h = breakintobytes(that.localtempCanvas.height);
//                    var w = breakintobytes(that.localtempCanvas.width);
//                    var scode = new Uint8ClampedArray( [ 102, w[0], w[1], h[0], h[1] ] );
//                        
//                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
//                    sendmsg.set(scode);
//                    sendmsg.set(encodedData, scode.length); 
                        
                    //var createdImg =  getDataFullScreen();
                    //io.sendBinary(createdImg);
                    
                       // firstTimeDisp = true;
                    //}
                   
                    if (changeonresize == 1) {
                        
//                        resA = Math.round(that.localtempCanvas.height/12);
//                        resB = Math.round(that.localtempCanvas.width/12);
//                        that.imageSlices = that.dc.getImageSlices(resA, resB, that);
//                        var createdImg =  getDataFullScreenResize(that.type);
//                        io.sendBinary(createdImg);
//                        changeonresize = 0;
                        
                        vApp.sendResizeWindow();
                        
                    } else {
                        sendDataImageSlices(that.type);
                    }
                   vApp.clear = setInterval(sendScreen, screenIntervalTime);

                    
                }
                
                vApp.sendResizeWindow = function(){
                    resA = Math.round(that.localtempCanvas.height/12);
                    resB = Math.round(that.localtempCanvas.width/12);
//                    that.imageSlices = that.dc.getImageSlices(resA, resB, that);
                    var createdImg =  getDataFullScreenResize(that.type);
                    io.sendBinary(createdImg);
                    changeonresize = 0;
                }
                
                function breakintobytes (val,l) {
                    var numstring = val.toString();
                    for (var i=numstring.length; i < l; i++) {
                        numstring = '0'+numstring;
                    }
                    var parts = numstring.match(/[\S]{1,2}/g) || [];
                    return parts;
                }
                
            function addSliceToSingle (encodedData) {
                if (masterSlice == null) {
                    masterSlice = encodedData;
                } else {
                    var tempslice = new Uint8ClampedArray(masterSlice.length + encodedData.length);
                    tempslice.set(masterSlice);
                    tempslice.set(encodedData, masterSlice.length); 
                    masterSlice = tempslice;
                    tempslice = null;
                }

               //return maserSlice;

            }
            /*
             * https://github.com/youbastard/getImageData
             */

            var getImageDataCache = function (x, y, w, h, W, H, d) {
                var arr = new Uint8ClampedArray(w*h), i=0;
                for (var r=y; r<(h)+y; r+=1) {
                    for (var c=x; c<(w)+x; c+=1) {
                        var O = ((r*W) + c); 
                            arr[i++] = d[O];
                    }
                }
                return arr;
            };

            function sendDataImageSlices (type){
		//return true;
                var localBandwidth = 0;
                var dw =  Math.round( (that.localtempCanvas.width) / resB);
                var dh = Math.round( (that.localtempCanvas.height) / resA);
                var x, y, cx, cy = 0;
                
                that.localtempCanvas.width = that.video.offsetWidth;
                that.localtempCanvas.height = that.video.offsetHeight;
                that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
                var needFullScreen = 0;
                
                masterImgData = that.localtempCont.getImageData(0,0, that.video.offsetWidth, that.video.offsetHeight);
                masterImgData = that.dc.encodeRGB(masterImgData.data);

                
                for (sl=0; sl<(resA * resB); sl++) {
                    if(sl==0){
                        x = 0;
                        y = 0;
                    }else{
                        cx = sl  % resB; // for x
                        cy = Math.floor(sl / resB); // for y
                        x = cx * dw;
                        y = cy * dh;
                    }
                    var d = {'x' : x, 'y' : y, 'w' : dw, 'h' : dh};
                    
                    
                    imgData = getImageDataCache(d.x, d.y, d.w, d.h, that.video.offsetWidth, that.video.offsetHeight, masterImgData);
                    

                    if(typeof that.prevImageSlices[sl] != 'undefined'){
                        matched = that.dc.matchWithPrevious(imgData, that.prevImageSlices[sl], d.w);
                        if(!matched){
                            that.prevImageSlices[sl] = imgData;
                              encodedData = imgData;
                            tempObj = {'si' : stringData, 'd' : d};
                            addSliceToSingle(sendSliceData(encodedData, d, that.type));
                            that.latestScreen[sl] = tempObj; 
                        }

                    }else{
                        that.prevImageSlices[sl] = imgData;
                        encodedData = imgData;
                        needFullScreen= 1;
                        tempObj = {'si' : stringData, 'd' : d};
                        that.latestScreen[sl] = tempObj; 
                    }
                }

                if (needFullScreen == 1) { //sending full screen here
                    //alert(that.type);
                    var createdImg =  vApp.getDataFullScreen(that.type);
                    io.sendBinary(createdImg);

                    var localBandwidth = (createdImg.length/128); // In Kbps
                    needFullScreen = 0;
                } else if (masterSlice != null) {
                    io.sendBinary(masterSlice);
                    var localBandwidth = (masterSlice.length/128); // In Kbps
                    masterSlice=null;

                }
                // Calculate Bandwidth in Kbps
                // Shape Bandwidth
                if (localBandwidth <= 300) {
                    screenIntervalTime = 300;
                }else if (localBandwidth >= 10000) {
                    screenIntervalTime=localBandwidth/2;
                } 
                else{
                    screenIntervalTime=localBandwidth;
                }
                // Avoid Sharp Curve
                if ((pscreenIntervalTime * 4) < screenIntervalTime ) {
                    screenIntervalTime = pscreenIntervalTime * 4;
                }
                //console.log ('Bandwidth '+ localBandwidth+'Kbps' + 'New Time ' + localBandwidth)
                pscreenIntervalTime = screenIntervalTime;
            }
                vApp.clear = setInterval(sendScreen, screenIntervalTime);
                
            },
            
            getContainerDimension : function (){
                var vidCont = document.getElementById(this.id + "Local");
                return {width : vidCont.offsetWidth, height:vidCont.offsetHeight};
            },
            
            drawImages : function (rec, d){
//                this.drawSingleImage(rec);
                if(typeof d != 'undefined'){
                    var imgData = this.dc.decodeRGBSlice(rec, this.localCont,  d);
                    this.localCont.putImageData(imgData, d.x, d.y);
                }else{
                    var imgData = this.dc.decodeRGB(rec, this.localCont,  this.localCanvas);
                    this.localCont.putImageData(imgData, 0, 0);
                }
                
            },
            
            drawSingleImage : function(rec){
                var imgData = this.dc.decodeRGB(rec, this.localCont,  this.localCanvas);
                this.localCont.putImageData(imgData, 0, 0);
            },
            
            
            old_drawImages : function (rec, local){
                
//                if(typeof local != 'undefined'){
//                    this.localCanvas = document.getElementById('canvas3');
//                    this.localCont = this.localCanvas.getContext('2d');
//                }
                
                //var imgDataArr = LZString.decompressFromBase64(rec);
                var imgDataArr = rec;
                imgDataArr = JSON.parse(imgDataArr);
                for (i=0;i<imgDataArr.length;i++){
                     this.drawSingleImage(imgDataArr[i].si, imgDataArr[i].d);
                }
            },
            

            old_drawSingleImage : function(imgDataArr, d){
                var imgData = this.dc.decodeRGB(vApp.vutil.str2ab(imgDataArr), this.localCont, d);
                this.localCont.putImageData(imgData, d.x, d.y);
            },
            
            dimensionStudentScreen : function (cWidth, cHeight){
//                if(!this.hasOwnProperty('vac')){
//                    this.vac = true;
//                    this.localCanvas = document.getElementById(vApp[app].local+"Video");
//                    this.localCont = vApp[app].localCanvas.getContext('2d');
//                }
                
                this.localCanvas = document.getElementById(vApp[app].local+"Video");
                this.localCont = vApp[app].localCanvas.getContext('2d');
                
              //  this.localCont.clearRect(0, 0, cWidth, cHeight);
                    
                this.localCanvas.width = cWidth;
                this.localCanvas.height = cHeight;
            },
            
            dimensionStudentScreenResize : function (msg, vtype){
                    // alert(this.vac);
                  //  if(typeof this.vac == 'undefined'){
                if(!this.hasOwnProperty('vac')){
                    this.vac = true;
                    this.localCanvas = document.getElementById(vApp[app].local+"Video");
                    this.localCont = vApp[app].localCanvas.getContext('2d');
                }
                
                if (msg.hasOwnProperty('d')) {
                    this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
                    
                    this.localCanvas.width = msg.d.w;
                    this.localCanvas.height = msg.d.h;
                }
                
                
                if(msg.hasOwnProperty('vc')){
                    var vc  = document.getElementById(vApp[app].local);
                    vc.style.width = msg.vc.w + "px";
                    vc.style.height = msg.vc.h + "px";
                }
                
                if(vApp.previous != 'vAppWhiteboard'){
                    vApp.vutil.setScreenInnerTagsWidth(vApp.previous);
                }
            },

            
            old_dimensionStudentScreen : function (msg, vtype){
                    // alert(this.vac);
                  //  if(typeof this.vac == 'undefined'){
                if(!this.hasOwnProperty('vac')){
                    this.vac = true;
                    this.localCanvas = document.getElementById(vApp[app].local+"Video");
                    this.localCont = vApp[app].localCanvas.getContext('2d');
                }
                
                if (msg.hasOwnProperty('d')) {
                    this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
                    
                    this.localCanvas.width = msg.d.w;
                    this.localCanvas.height = msg.d.h;
                }
                
                
                if(msg.hasOwnProperty('vc')){
                    var vc  = document.getElementById(vApp[app].local);
                    vc.style.width = msg.vc.w + "px";
                    vc.style.height = msg.vc.h + "px";
                }
                
                if(vApp.previous != 'vAppWhiteboard'){
                    vApp.vutil.setScreenInnerTagsWidth(vApp.previous);
                }
            },
           
            html : {
                
               UI : function (user){
                   var mainCont =  vApp.vutil.createDOM("div", this.id, [this.className]);
                   var locVidCont =  vApp.vutil.createDOM("div", this.local, [this.label]);
                   if((user == 't')){
                       
                       //if(vApp.hasOwnProperty('repType')){
                       if(vApp.recorder.recImgPlay){
                           var vidCont =  vApp.vutil.createDOM("canvas", this.local+"Video");
                           //vidCont.setAttribute("autoplay", true);
                       }else{
                           var vidCont =  vApp.vutil.createDOM("video", this.local+"Video");
                           vidCont.setAttribute("autoplay", true);
                       }
                       
                       css(locVidCont, "position:relative");
                       
                       //css(vidCont, "position : absolute; height : 99%");
                       //css(vidCont, "position : absolute; height : 99%");
                       
                   }else{
                       var vidCont =  vApp.vutil.createDOM("canvas", this.local+"Video");
                   }
                   
                   //var vidCont =  vApp.vutil.createDOM("canvas", this.id+label+"Video");

                   locVidCont.appendChild(vidCont);
                   mainCont.appendChild(locVidCont);

                //   if(user == 't' && !vApp.hasOwnProperty('repType')){
                   if(user == 't' && !vApp.recorder.recImgPlay){ 
                        //alert(mainCont.id);
                        vApp.vutil.createLocalTempVideo(mainCont, this.localTemp);
                       
//                       var locVidContTemp =  vApp.vutil.createDOM("div", this.localTemp);
//                       var vidContTemp =  vApp.vutil.createDOM("canvas", this.localTemp+"Video");
//                       locVidContTemp.appendChild(vidContTemp);
//                       mainCont.appendChild(locVidContTemp);
                   }
                   
                   function css(element, styles){
                        if(typeof styles == 'string'){
                            element.style.cssText += ';' + styles;
                        }
                   }
                   return mainCont;
               },
               
               getDimension : function (container, aspectRatio){
                   var aspectRatio = aspectRatio || (3 / 4),
                        height = (container.width * aspectRatio),
                        res = {};
                
                    return {
                        height: container.height,
                        width: container.width
                    };
                }
            },
            
            
            //send the latest packet on request of user
            sendPackets : function (user){
            //    var encodedString = LZString.compressToBase64(JSON.stringify(this.latestScreen));
                var encodedString =JSON.stringify(this.latestScreen);
                var contDimension = this.getContainerDimension();
                
                
                vApp.wb.utility.beforeSend({'resimg' : true, 'si' : encodedString, 'st' : this.type, d : {w:this.width, h:this.height}, vc : {w:contDimension.width, h:contDimension.height}, 'byRequest' : user });                                      
            }
        }
        
              
        

    }
    window.screenShare  = screenShare;
})(window);