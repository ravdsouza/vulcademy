$(document).ready(function(){
    console.log("record.js is attached");
    // $("#switch").on('click', function(){
    //     var newStatus = "false";
    //     $("#switch").toggleClass('disabled');
    //     // Check what state the switch is in
    //     if (!($("#switch").hasClass('disabled'))){ // If changed to enabled
    //         newStatus = "true";
    //         console.log("Now enabled");
    //         $("#record-status").html("Stop Recording");
    //     } else{
    //         console.log("Now disabled");
    //         $("#record-status").html("Start Recording");
    //     }
    // });
    
    (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Recorder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
        "use strict";
    
        module.exports = require("./recorder").Recorder;
    
        },{"./recorder":2}],2:[function(require,module,exports){
        'use strict';
    
        var _createClass = (function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
                }
            }return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
            };
        })();
    
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.Recorder = undefined;
    
        var _inlineWorker = require('inline-worker');
    
        var _inlineWorker2 = _interopRequireDefault(_inlineWorker);
    
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }
    
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
    
        var Recorder = exports.Recorder = (function () {
            function Recorder(source, cfg) {
                var _this = this;
    
                _classCallCheck(this, Recorder);
    
                this.config = {
                    bufferLen: 4096,
                    numChannels: 2,
                    mimeType: 'audio/wav'
                };
                this.recording = false;
                this.callbacks = {
                    getBuffer: [],
                    exportWAV: []
                };
    
                Object.assign(this.config, cfg);
                this.context = source.context;
                this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);
    
                this.node.onaudioprocess = function (e) {
                    if (!_this.recording) return;
    
                    var buffer = [];
                    for (var channel = 0; channel < _this.config.numChannels; channel++) {
                        buffer.push(e.inputBuffer.getChannelData(channel));
                    }
                    _this.worker.postMessage({
                        command: 'record',
                        buffer: buffer
                    });
                };
    
                source.connect(this.node);
                this.node.connect(this.context.destination); //this should not be necessary
    
                var self = {};
                this.worker = new _inlineWorker2.default(function () {
                    var recLength = 0,
                        recBuffers = [],
                        sampleRate = undefined,
                        numChannels = undefined;
    
                    self.onmessage = function (e) {
                        switch (e.data.command) {
                            case 'init':
                                init(e.data.config);
                                break;
                            case 'record':
                                record(e.data.buffer);
                                break;
                            case 'exportWAV':
                                exportWAV(e.data.type);
                                break;
                            case 'getBuffer':
                                getBuffer();
                                break;
                            case 'clear':
                                clear();
                                break;
                        }
                    };
    
                    function init(config) {
                        sampleRate = config.sampleRate;
                        numChannels = config.numChannels;
                        initBuffers();
                    }
    
                    function record(inputBuffer) {
                        for (var channel = 0; channel < numChannels; channel++) {
                            recBuffers[channel].push(inputBuffer[channel]);
                        }
                        recLength += inputBuffer[0].length;
                    }
    
                    function exportWAV(type) {
                        var buffers = [];
                        for (var channel = 0; channel < numChannels; channel++) {
                            buffers.push(mergeBuffers(recBuffers[channel], recLength));
                        }
                        var interleaved = undefined;
                        if (numChannels === 2) {
                            interleaved = interleave(buffers[0], buffers[1]);
                        } else {
                            interleaved = buffers[0];
                        }
                        var dataview = encodeWAV(interleaved);
                        var audioBlob = new Blob([dataview], { type: type });
    
                        self.postMessage({ command: 'exportWAV', data: audioBlob });
    
                    }
    
                    function getBuffer() {
                        var buffers = [];
                        for (var channel = 0; channel < numChannels; channel++) {
                            buffers.push(mergeBuffers(recBuffers[channel], recLength));
                        }
                        self.postMessage({ command: 'getBuffer', data: buffers });
                    }
    
                    function clear() {
                        recLength = 0;
                        recBuffers = [];
                        initBuffers();
                    }
    
                    function initBuffers() {
                        for (var channel = 0; channel < numChannels; channel++) {
                            recBuffers[channel] = [];
                        }
                    }
    
                    function mergeBuffers(recBuffers, recLength) {
                        var result = new Float32Array(recLength);
                        var offset = 0;
                        for (var i = 0; i < recBuffers.length; i++) {
                            result.set(recBuffers[i], offset);
                            offset += recBuffers[i].length;
                        }
                        return result;
                    }
    
                    function interleave(inputL, inputR) {
                        var length = inputL.length + inputR.length;
                        var result = new Float32Array(length);
    
                        var index = 0,
                            inputIndex = 0;
    
                        while (index < length) {
                            result[index++] = inputL[inputIndex];
                            result[index++] = inputR[inputIndex];
                            inputIndex++;
                        }
                        return result;
                    }
    
                    function floatTo16BitPCM(output, offset, input) {
                        for (var i = 0; i < input.length; i++, offset += 2) {
                            var s = Math.max(-1, Math.min(1, input[i]));
                            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                        }
                    }
    
                    function writeString(view, offset, string) {
                        for (var i = 0; i < string.length; i++) {
                            view.setUint8(offset + i, string.charCodeAt(i));
                        }
                    }
    
                    function encodeWAV(samples) {
                        var buffer = new ArrayBuffer(44 + samples.length * 2);
                        var view = new DataView(buffer);
    
                        /* RIFF identifier */
                        writeString(view, 0, 'RIFF');
                        /* RIFF chunk length */
                        view.setUint32(4, 36 + samples.length * 2, true);
                        /* RIFF type */
                        writeString(view, 8, 'WAVE');
                        /* format chunk identifier */
                        writeString(view, 12, 'fmt ');
                        /* format chunk length */
                        view.setUint32(16, 16, true);
                        /* sample format (raw) */
                        view.setUint16(20, 1, true);
                        /* channel count */
                        view.setUint16(22, numChannels, true);
                        /* sample rate */
                        view.setUint32(24, sampleRate, true);
                        /* byte rate (sample rate * block align) */
                        view.setUint32(28, sampleRate * 4, true);
                        /* block align (channel count * bytes per sample) */
                        view.setUint16(32, numChannels * 2, true);
                        /* bits per sample */
                        view.setUint16(34, 16, true);
                        /* data chunk identifier */
                        writeString(view, 36, 'data');
                        /* data chunk length */
                        view.setUint32(40, samples.length * 2, true);
    
                        floatTo16BitPCM(view, 44, samples);
    
                        return view;
                    }
                }, self);
    
                this.worker.postMessage({
                    command: 'init',
                    config: {
                        sampleRate: this.context.sampleRate,
                        numChannels: this.config.numChannels
                    }
                });
    
                this.worker.onmessage = function (e) {
                    var cb = _this.callbacks[e.data.command].pop();
                    if (typeof cb == 'function') {
                        cb(e.data.data);
                    }
                };
            }
    
            _createClass(Recorder, [{
                key: 'record',
                value: function record() {
                    this.recording = true;
                }
            }, {
                key: 'stop',
                value: function stop() {
                    this.recording = false;
                }
            }, {
                key: 'clear',
                value: function clear() {
                    this.worker.postMessage({ command: 'clear' });
                }
            }, {
                key: 'getBuffer',
                value: function getBuffer(cb) {
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error('Callback not set');
    
                    this.callbacks.getBuffer.push(cb);
    
                    this.worker.postMessage({ command: 'getBuffer' });
                }
            }, {
                key: 'exportWAV',
                value: function exportWAV(cb, mimeType) {
                    mimeType = mimeType || this.config.mimeType;
                    cb = cb || this.config.callback;
                    if (!cb) throw new Error('Callback not set');
    
                    this.callbacks.exportWAV.push(cb);
    
                    this.worker.postMessage({
                        command: 'exportWAV',
                        type: mimeType
                    });
                }
            }], [{
                key: 'forceDownload',
                value: function forceDownload(blob, filename) {
                    var url = (window.URL || window.webkitURL).createObjectURL(blob);
                    var link = window.document.createElement('a');
                    link.href = url;
                    link.download = filename || 'output.wav';
                    var click = document.createEvent("Event");
                    click.initEvent("click", true, true);
                    link.dispatchEvent(click);
                }
            }]);
    
            return Recorder;
        })();
    
        exports.default = Recorder;
    
        },{"inline-worker":3}],3:[function(require,module,exports){
        "use strict";
    
        module.exports = require("./inline-worker");
        },{"./inline-worker":4}],4:[function(require,module,exports){
        (function (global){
        "use strict";
    
        var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
        var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
    
        var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);
    
        var InlineWorker = (function () {
        function InlineWorker(func, self) {
            var _this = this;
    
            _classCallCheck(this, InlineWorker);
    
            if (WORKER_ENABLED) {
            var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
            var url = global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" }));
    
            return new global.Worker(url);
            }
    
            this.self = self;
            this.self.postMessage = function (data) {
            setTimeout(function () {
                _this.onmessage({ data: data });
            }, 0);
            };
    
            setTimeout(function () {
            func.call(self);
            }, 0);
        }
    
        _createClass(InlineWorker, {
            postMessage: {
            value: function postMessage(data) {
                var _this = this;
    
                setTimeout(function () {
                _this.self.onmessage({ data: data });
                }, 0);
            }
            }
        });
    
        return InlineWorker;
        })();
    
        module.exports = InlineWorker;
        }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
        },{}]},{},[1])(1)
        });
   
        // Expose globally your audio_context, the recorder instance and audio_stream
        var audio_context;
        var recorder;
        var audio_stream;
    
        /**
         * Patch the APIs for every browser that supports them and check
         * if getUserMedia is supported on the browser. 
         * 
         */
        function Initialize() {
            try {
                // Monkeypatch for AudioContext, getUserMedia and URL
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                window.URL = window.URL || window.webkitURL;
    
                // Store the instance of AudioContext globally
                audio_context = new AudioContext;
                console.log('Audio context is ready !');
                console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            } catch (e) {
                alert('No web audio support in this browser!');
            }
        }
    
        /**
         * Starts the recording process by requesting the access to the microphone.
         * Then, if granted proceed to initialize the library and store the stream.
         *
         * It only stops when the method stopRecording is triggered.
         */
        function startRecording() {
            // Access the Microphone using the navigator.getUserMedia method to obtain a stream
            navigator.getUserMedia({ audio: true }, function (stream) {
                // Expose the stream to be accessible globally
                audio_stream = stream;
                // Create the MediaStreamSource for the Recorder library
                var input = audio_context.createMediaStreamSource(stream);
                console.log('Media stream succesfully created');
    
                // Initialize the Recorder Library
                recorder = new Recorder(input);
                console.log('Recorder initialised');
    
                // Start recording !
                recorder && recorder.record();
                console.log('Recording...');
    
                // Disable Record button and enable stop button !
                // document.getElementById("recordButtonStart").disabled = true;
                // document.getElementById("recordButtonStop").disabled = false;
                // document.getElementById("switch").disabled = false;
            }, function (e) {
                console.error('No live audio input: ' + e);
            });
        }
    
        /**
         * Stops the recording process. The method expects a callback as first
         * argument (function) executed once the AudioBlob is generated and it
         * receives the same Blob as first argument. The second argument is
         * optional and specifies the format to export the blob either wav or mp3
         */
        function stopRecording(callback, AudioFormat) {
            // Stop the recorder instance
            recorder && recorder.stop();
            console.log('Stopped recording.');
    
            // Stop the getUserMedia Audio Stream !
            audio_stream.getAudioTracks()[0].stop();
    
            // Disable Stop button and enable Record button !
            // document.getElementById("recordButtonStart").disabled = false;
            // document.getElementById("recordButtonStop").disabled = true;
            // document.getElementById("switch").disabled = false;
    
            // Use the Recorder Library to export the recorder Audio as a .wav file
            // The callback providen in the stop recording method receives the blob
            if(typeof(callback) == "function"){
    
                /**
                 * Export the AudioBLOB using the exportWAV method.
                 * Note that this method exports too with mp3 if
                 * you provide the second argument of the function
                 */
                recorder && recorder.exportWAV(function (blob) {
                    callback(blob);
    
                    // create WAV download link using audio data blob
                    // createDownloadLink();
    
                    // Clear the Recorder to start again !
                    recorder.clear();
                }, (AudioFormat || "audio/wav"));
            }
        }
    
        // Initialize everything once the window loads
        window.onload = function(){
            // Prepare and check if requirements are filled
            Initialize();
    
            // $("#switch").on('click', function(){
            document.getElementById('switch').addEventListener("click", function(){
                console.log("Clicked switch");
                $("#switch").toggleClass('disabled');
                if (!($("#switch").hasClass('disabled'))){ // Enabled
                    console.log("Enabled - Start");
                    startRecording();
                } else{
                    console.log("Disabled - Stop");
                    // Use wav format
                    var _AudioFormat = "audio/wav";
                    // You can use mp3 to using the correct mimetype
                    //var AudioFormat = "audio/mpeg";
        
                    stopRecording(function(AudioBLOB){
                        // Note:
                        // Use the AudioBLOB for whatever you need, to download
                        // directly in the browser, to upload to the server, you name it !
        
                        // In this case we are going to add an Audio item to the list so you
                        // can play every stored Audio
                        var url = URL.createObjectURL(AudioBLOB);
                        var li = document.createElement('li');
                        var au = document.createElement('audio');
                        var hf = document.createElement('a');
        
                        au.controls = true;
                        au.src = url;
                        hf.href = url;
                        // Important:
                        // Change the format of the file according to the mimetype
                        // e.g for audio/wav the extension is .wav 
                        //     for audio/mpeg (mp3) the extension is .mp3
                        hf.download = new Date().toISOString() + '.mp3';
                        hf.innerHTML = hf.download;
                        li.appendChild(au);
                        li.appendChild(hf);
                        recordingslist.appendChild(li);
                    }, _AudioFormat);
                }
            }, false);
            // Handle on start recording button
            // document.getElementById("recordButtonStart").addEventListener("click", function(){
            //     startRecording();
            // }, false);
    
            // // Handle on stop recording button
            // document.getElementById("recordButtonStop").addEventListener("click", function(){
            //     // Use wav format
            //     var _AudioFormat = "audio/wav";
            //     // You can use mp3 to using the correct mimetype
            //     //var AudioFormat = "audio/mpeg";
    
            //     stopRecording(function(AudioBLOB){
            //         // Note:
            //         // Use the AudioBLOB for whatever you need, to download
            //         // directly in the browser, to upload to the server, you name it !
    
            //         // In this case we are going to add an Audio item to the list so you
            //         // can play every stored Audio
            //         var url = URL.createObjectURL(AudioBLOB);
            //         var li = document.createElement('li');
            //         var au = document.createElement('audio');
            //         var hf = document.createElement('a');
    
            //         au.controls = true;
            //         au.src = url;
            //         hf.href = url;
            //         // Important:
            //         // Change the format of the file according to the mimetype
            //         // e.g for audio/wav the extension is .wav 
            //         //     for audio/mpeg (mp3) the extension is .mp3
            //         hf.download = new Date().toISOString() + '.mp3';
            //         hf.innerHTML = hf.download;
            //         li.appendChild(au);
            //         li.appendChild(hf);
            //         recordingslist.appendChild(li);
            //     }, _AudioFormat);
            // }, false);
        };
});
