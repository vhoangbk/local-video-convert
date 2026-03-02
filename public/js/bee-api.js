/**
 * UI Interface to abstract UI operations and separate them from core API logic.
 */
const BeeUI = {
    _callback: null,

    /**
     * Register a callback to listen to UI events.
     * @param {Function} cb - Callback function receiving (eventName, data)
     */
    onEvent: (cb) => {
        BeeUI._callback = cb;
    },

    _notify: (eventName, data = {}) => {
        if (typeof BeeUI._callback === "function") {
            BeeUI._callback(eventName, data);
        }
    },

    showStart: (onCancel) => {
        if (typeof showProgressDialog === "function") {
            showProgressDialog(onCancel);
        }
    },
    updateProgress: (percent, remainingTime, title) => {
        BeeUI._notify(CMD_SDK_UPDATE_PROGRESS, { percent, remainingTime, title });
        if (typeof updateProgressDialog === "function") {
            updateProgressDialog(percent, remainingTime, title);
        }
    },
    hideProgress: () => {
        if (typeof hideProgressDialog === "function") {
            hideProgressDialog();
        }
    },
    showError: (message, onOk) => {
        // BeeUI._notify(CMD_SDK_ERROR, { message, onOk }); appnote
        if (typeof showAppError === "function") {
            showAppError(message, "error", onOk);
        }
    },
    showSuccess: (fileInfo, outputName, onSave) => {
        BeeUI._notify(CMD_SDK_COMPLETE, { fileInfo, outputName, onSave });
        const platform = detectPlatform();
        if (typeof showVideoDetailDialog === "function") {
            showVideoDetailDialog(
                fileInfo,
                outputName,
                onSave,
                async () => { },
                "Save",
                platform.isBeeConvertApp ? "muted" : ""
            );
        }
    },
    showLoading: () => {
        if (typeof showLoadingDialog === "function") {
            showLoadingDialog();
        }
    },
    hideLoading: () => {
        if (typeof hideLoadingDialog === "function") {
            hideLoadingDialog();
        }
    },
    showToast: (message) => {
        if (typeof showBeeToast === "function") {
            showBeeToast(message);
        }
    }
};


function isSafari() {
    const ua = navigator.userAgent;
    const isSafari = /Safari/.test(ua)
        && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPR|Opera|SamsungBrowser/.test(ua);

    const isIOS = /iPhone|iPad|iPod/.test(navigator.platform)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isWorker = typeof window === 'undefined';
    let isWKWebView = false;

    if (!isWorker) {
        isWKWebView = window.webkit?.messageHandlers !== undefined;
    } else {
        isWKWebView = isIOS;
    }

    return isSafari || (isIOS && isWKWebView);
}
var is_safari = isSafari();

self.fileInfoMap = {};


async function getFileInfo(fileUrl) {
    if (self.fileInfoMap[fileUrl]) {
        return self.fileInfoMap[fileUrl];
    }

    const thumbW = Math.round(screen.width / 2);
    let array_cmd = ['-fflags', '+genpts', '-avoid_negative_ts', '1', '-loglevel', 'info', '-threads', '4', '-i', fileUrl, '-vframes', '1', '-vf', `scale=${thumbW}:-1`, '-f', 'mjpeg', Date.now() + '.thumbnail.jpg'];

    var runResult = await run_cmd(CMD_SDK_START_CONVERT, array_cmd, null);


    var fileInfo = getFileInfoFromString(runResult.logcat.join('\n'));
    fileInfo.remainingBitrate = 0;

    if (runResult.outputFiles.length > 0) {
        fileInfo.thumbnail = runResult.outputFiles[0].blob_url;
    } else {
        return null;
    }
    if (fileInfo && fileInfo.videoBitRate == 0 && fileInfo.streams.filter(s => s.type === 'Audio').length > 0) {

        function getBestExtensionForCopy(fileInfo) {
            const videoCodec = fileInfo.videoCodec;
            const audioCodec = fileInfo.audioCodec;
            if (videoCodec === 'vp9' || videoCodec === 'vp8' || audioCodec === 'opus') return 'webm';
            if (videoCodec === 'av1') return 'mp4'; // hoặc 'webm'
            if (!videoCodec && audioCodec === 'mp3') return 'mp3';
            if (!videoCodec && audioCodec === 'flac') return 'flac';
            return 'mp4'; // default
        }
        let array_cmd = ['-fflags', '+genpts', '-avoid_negative_ts', '1', '-loglevel', 'info', '-threads', '4', '-i', fileUrl, '-t', '20', '-c', 'copy', '-vn', 'only_audio.' + getBestExtensionForCopy(fileInfo)];
        try {
            var runResult = await run_cmd(CMD_SDK_START_CONVERT, array_cmd, null);
            if (runResult.outputFiles && runResult.outputFiles.length > 0) {
                var outputFileLength = runResult.outputFiles[0].length;
                fileInfo.remainingBitrate = Math.round((outputFileLength * 8) / 20); //kbps
            }

        } catch (error) {
            console.error(error);
        }
    }

    fileInfo.input_url = fileUrl;
    self.fileInfoMap[fileUrl] = fileInfo;
    return fileInfo;
}

function getFileInfoFromString(ffmpegOutput) {
    const info = {
        filename: '',
        size: 0, /** bytes */
        displaySize: '0 MB',
        duration: 0,
        bitrateTotal: 0,
        width: 0,
        height: 0,
        fps: 0,
        videoBitRate: 0,
        audioBitRate: 0,
        videoCodec: '',
        audioCodec: '',
        streams: []
    };
    ffmpegOutput = ffmpegOutput.split('Stream mapping:')[0];
    // Lấy filename
    const filenameMatch = ffmpegOutput.match(/from '([^']+)'/);
    if (filenameMatch) {
        info.filename = filenameMatch[1];
    }
    // Lấy duration và bitrate
    const durationMatch = ffmpegOutput.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d+),.*bitrate: (\d+) kb\/s/);
    if (durationMatch) {
        const hours = parseInt(durationMatch[1], 10);
        const minutes = parseInt(durationMatch[2], 10);
        const seconds = parseFloat(durationMatch[3]);
        info.duration = hours * 3600 + minutes * 60 + seconds;
        info.bitrateTotal = parseInt(durationMatch[4], 10);
        info.size = info.duration * info.bitrateTotal * 1024 / 8; // bytes
        if (info.size >= 1024 * 1024 * 1024) {
            info.displaySize = `${(info.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else if (info.size >= 1024 * 1024) {
            info.displaySize = `${(info.size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            info.displaySize = `${(info.size / 1024).toFixed(2)} KB`;
        }
    }

    const streamRegex = /Stream #(\d+):(\d+)(?:\[0x[0-9a-f]+\])?(?:\(([^)]*)\))?\s*:\s*(Video|Audio|Subtitle|Data|Attachment)\s*:\s*(\w+)([^\n]*)/gm;

    let match;
    while ((match = streamRegex.exec(ffmpegOutput)) !== null) {
        //debugger;
        const streamInfo = {
            file_index: parseInt(match[1]),
            stream_index: parseInt(match[2]),
            type: match[4],
            codec_name: match[5].toLowerCase(),
        };

        console.log('streamInfo:', streamInfo);
        if (streamInfo.codec_name == 'hevc') streamInfo.codec_name = 'h265';

        const attributes = match[0].split(',');
        attributes.forEach(attr => {
            attr = attr.trim();

            if (streamInfo.codec_name == 'jpeg' || streamInfo.codec_name == 'mjpeg' || streamInfo.codec_name == 'png' || streamInfo.codec_name == 'gif' || streamInfo.codec_name == 'webp') {
                streamInfo.type = 'Image';
            }

            streamInfo.file_index = streamInfo.file_index;
            streamInfo.stream_index = streamInfo.stream_index;

            // Bitrate cho từng stream
            const bitrateMatch = attr.match(/(\d+) kb\/s/);
            if (bitrateMatch) {
                streamInfo.bitrate = parseInt(bitrateMatch[1], 10);
            }
            if (streamInfo.type === 'Video') {
                info.videoCodec = streamInfo.codec_name || '';
                info.videoBitRate = streamInfo.bitrate || 0;
                const sizeMatch = attr.match(/(\d+)x(\d+)/);
                if (sizeMatch) {
                    streamInfo.width = parseInt(sizeMatch[1], 10);
                    streamInfo.height = parseInt(sizeMatch[2], 10);
                    const displayMatrixMatch = ffmpegOutput.match(/displaymatrix: rotation of ([\-\d\.]+) degrees/);
                    if (displayMatrixMatch) {
                        streamInfo.displaymatrix = parseInt(displayMatrixMatch[1]);
                        if (Math.abs(streamInfo.displaymatrix) === 90 || Math.abs(streamInfo.displaymatrix) === 270) {
                            // Đổi chiều width và height nếu xoay 90 hoặc 270 độ
                            const temp = streamInfo.width;
                            streamInfo.width = streamInfo.height;
                            streamInfo.height = temp;
                        }
                    }

                    info.width = streamInfo.width;
                    info.height = streamInfo.height;
                }
                const fpsMatch = attr.match(/(\d+(?:\.\d+)?) fps/);
                if (fpsMatch) {
                    streamInfo.fps = parseFloat(fpsMatch[1]);
                    info.fps = streamInfo.fps;
                }


            } else if (streamInfo.type === 'Audio') {
                //Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 128 kb/s (default)
                // Stream #0:1[0x2](eng): Audio: ac3 (ac-3 / 0x332D6361), 48000 Hz, 5.1(side), fltp, 320 kb/s (default)
                info.audioCodec = streamInfo.codec_name || '';
                info.audioBitRate = streamInfo.bitrate || 0;
                const hzMatch = attr.match(/(\d+) Hz/);
                if (hzMatch) {
                    streamInfo.hz = parseInt(hzMatch[1], 10);
                }
                //debugger;
                // ✅ Fix: Parse audio channels correctly
                if (attr.includes('stereo')) {
                    streamInfo.channels = 2;
                } else if (attr.includes('mono')) {
                    streamInfo.channels = 1;
                } else if (attr.includes('5.1')) {
                    streamInfo.channels = 6; // 5.1 = 6 channels (FL, FR, FC, LFE, BL, BR)
                } else if (attr.includes('7.1')) {
                    streamInfo.channels = 8; // 7.1 = 8 channels
                } else if (attr.includes('quad')) {
                    streamInfo.channels = 4; // Quadraphonic
                } else if (attr.includes('3.0')) {
                    streamInfo.channels = 3; // Left, Right, Center
                } else if (attr.includes('2.1')) {
                    streamInfo.channels = 3; // Stereo + LFE
                }


            }
        });
        info.streams.push(streamInfo);
    }
    //debugger;
    return info;
}

function removeExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

function dec(fl, d = 2) {
    var p = Math.pow(10, d);
    return Math.round(fl * p) / p;
}

function getStringTime() {

    const now = new Date();
    //thêm ngày-tháng-năm nếu cần
    const dd = now.getDate().toString().padStart(2, '0');
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = now.getFullYear().toString().slice(-4);// chỉ lấy 2 số cuối: .toString().slice(-2);

    const hh = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');
    //const dateStr = `${dd}d-${mm}m-${yy}y--${hh}h-${min}m-${ss}s`;

    //const dateStr = `${hh}.${min}.${ss}-${dd}.${mm}.${yyyy}`;
    const dateStr = `${dd}${mm}${yyyy}_${hh}${min}${ss}`;

    return dateStr;
}

function validateObj(obj) {
    const formatNames = ["h264", "h265", "vp9", "av1"];

    if (!(obj.input_url instanceof File) && !(typeof FileSystemFileHandle !== 'undefined' && obj.input_url instanceof FileSystemFileHandle) && typeof obj.input_url !== 'string' && !(obj.input_url instanceof String)) return 'input_url is invalid';
    if (!formatNames.includes(obj.format_name)) return 'Format is invalid';
    if (obj.trim !== undefined) {
        if (typeof obj.trim !== 'object' || typeof obj.trim.startTime !== 'number' || typeof obj.trim.endTime !== 'number') return 'trim is invalid';
        if (obj.trim.startTime < 0 || obj.trim.endTime <= obj.trim.startTime) return 'trim is invalid';
    }

    if (obj.crop !== undefined) {
        if (typeof obj.crop !== 'object' || typeof obj.crop.width !== 'number' || typeof obj.crop.height !== 'number' || typeof obj.crop.x !== 'number' || typeof obj.crop.y !== 'number') return 'crop is invalid';
        if (obj.crop.width % 2 !== 0 || obj.crop.height % 2 !== 0) return 'crop is invalid';
    }

    if (obj.target_size !== undefined) {
        if (typeof obj.target_size !== 'number' || obj.target_size < 1) return 'target is invalid';
    }

    if (obj.resolution !== undefined) {
        if (typeof obj.resolution !== 'object' || typeof obj.resolution.width !== 'number' || typeof obj.resolution.height !== 'number') return 'resolution is invalid';
        // if (obj.resolution.width % 2 !== 0 || obj.resolution.height % 2 !== 0) return 'resolution is invalid';
    }

    //cho phép các biến  hflip, vflip, volume_level, fps, quality có thể là undefined
    if (obj.hflip === undefined) obj.hflip = 0;
    if (obj.vflip === undefined) obj.vflip = 0;
    if (obj.volume_level === undefined) obj.volume_level = 1;
    if (obj.fps === undefined) obj.fps = -1;
    if (obj.rotate === undefined) obj.rotate = 0;
    if (obj.speed === undefined) obj.speed = 1;

    if (obj.hflip !== 0 && obj.hflip !== 1) return 'hflip is invalid';
    if (obj.vflip !== 0 && obj.vflip !== 1) return 'vflip is invalid';
    if (typeof obj.volume_level !== 'number' || obj.volume_level < 0 || obj.volume_level > 3) return 'volume is invalid';
    if (obj.fps !== -1 && (typeof obj.fps !== 'number' || obj.fps < 10 || obj.fps > 60)) return 'fps is invalid';
    if (![0, 90, 180, 270].includes(obj.rotate)) return 'rotate is invalid';
    if (typeof obj.speed !== 'number' || obj.speed < 0.25 || obj.speed > 4) return 'speed is invalid';

}

async function convertUserOptionsToCommand(userOptions) {

    //tính năng rotate video: userOptions.rotate = 0,90,180,270
    //tính năng speed video: userOptions.speed = 0.25..4
    userOptions = JSON.parse(JSON.stringify(userOptions || {}));
    function calculateOutputDimensions(iw, ih, targetW, targetH) {
        if (iw === targetW && ih === targetH) return { ow: iw, oh: ih };
        const ratio = targetW / targetH;
        const ow1 = iw, oh1 = iw / ratio;
        const ow2 = ih * ratio, oh2 = ih;
        let ow = oh1 >= ih ? ow1 : ow2;
        let oh = oh1 >= ih ? oh1 : oh2;
        ow = Math.ceil(ow) + (Math.ceil(ow) % 2);
        oh = Math.ceil(oh) + (Math.ceil(oh) % 2);
        return { ow, oh };
    }

    var fileInfo = await getFileInfo(userOptions.input_url);
    fileInfo = JSON.parse(JSON.stringify(fileInfo || {}));//copy
    var getStartTime = () => userOptions.trim?.startTime ?? -1;
    var getEndTime = () => userOptions.trim?.endTime ?? -1;
    var outputDuration = (getEndTime() > 0 ? getEndTime() : fileInfo.duration) - (getStartTime() >= 0 ? getStartTime() : 0);
    // Adjust duration if speed changed
    if (userOptions.speed && userOptions.speed !== 1) {
        outputDuration = outputDuration / userOptions.speed;
    }
    outputDuration = dec(outputDuration, 3);

    const libNameMap = { h264: 'libx264', h265: 'libx265', av1: 'libaom-av1', vp9: 'libvpx-vp9' };

    // Resize video từ (iw,ih) -> (ow,oh) mà không làm thay đổi tỷ lệ gốc:
    // 1. scale với force_original_aspect_ratio=decrease: co video vừa khung ow×oh, giữ tỉ lệ
    // 2. pad: thêm black bars để lấp đầy phần còn lại (letterbox/pillarbox)
    var getVideoFilters = () => {
        const filters = [];

        // Crop filter (nếu có)
        if (userOptions.crop) {
            filters.push(`crop=${userOptions.crop.width}:${userOptions.crop.height}:${userOptions.crop.x}:${userOptions.crop.y}`);
        }

        //nếu không có tuỳ chọn target_size
        if (!userOptions.target_size) {
            var { iw, ih } = { iw: userOptions.crop?.width || fileInfo.width, ih: userOptions.crop?.height || fileInfo.height };
            var { ow, oh } = { ow: userOptions.resolution?.width || userOptions.crop?.width || fileInfo.width, oh: userOptions.resolution?.height || userOptions.crop?.height || fileInfo.height };
            if (ow != iw || oh != ih) {
                // Tính scaleW/scaleH trong JS để giữ tỉ lệ gốc, không phụ thuộc option ít hỗ trợ
                const inputRatio = iw / ih;
                const outputRatio = ow / oh;
                let scaleW, scaleH;
                if (inputRatio > outputRatio) {
                    // video rộng hơn khung → letterbox (thanh đen trên/dưới)
                    scaleW = ow;
                    scaleH = Math.floor(ow / inputRatio / 2) * 2;
                } else {
                    // video cao hơn khung → pillarbox (thanh đen trái/phải)
                    scaleH = oh;
                    scaleW = Math.floor(oh * inputRatio / 2) * 2;
                }
                const padX = Math.floor((ow - scaleW) / 2);
                const padY = Math.floor((oh - scaleH) / 2);
                filters.push(`scale=${scaleW}:${scaleH}`);
                filters.push(`pad=${ow}:${oh}:${padX}:${padY}:black`);
            }
        }

        if (userOptions.vflip) filters.push('vflip');
        if (userOptions.hflip) filters.push('hflip');

        // Rotate: 90° CW = transpose=1, 90° CCW = transpose=2, 180° = transpose=1,transpose=1
        if (userOptions.rotate === 90) {
            filters.push('transpose=1'); // 90° clockwise
        } else if (userOptions.rotate === 180) {
            filters.push('transpose=1,transpose=1'); // 180°
        } else if (userOptions.rotate === 270) {
            filters.push('transpose=2'); // 90° counter-clockwise
        }

        // Speed: setpts=PTS/speed (speed > 1 = faster, speed < 1 = slower)
        if (userOptions.speed && userOptions.speed !== 1) {
            filters.push(`setpts=${(1 / userOptions.speed).toFixed(4)}*PTS`);
        }

        return filters.join(',');
    };

    userOptions.fps = userOptions.fps || fileInfo.fps;


    const extension = userOptions.format_name == 'vp9' ? 'webm' : 'mp4';
    var video_stream_index = 0;
    var remainingBitrate = 0;
    var subtitle_cmd_array = [];

    for (var i = 0; i < fileInfo.streams.length; i++) {
        if (fileInfo.streams[i].type == 'Video') {
            video_stream_index = fileInfo.streams[i].stream_index;
        } else if (fileInfo.streams[i].type == 'Subtitle') {

            var new_codec = getSubtitleCodecForContainer(extension, fileInfo.streams[i].codec_name);
            if (new_codec && subtitle_cmd_array.length == 0) {
                subtitle_cmd_array.push('-c:s', new_codec, '-t', outputDuration);
            }
        } else if (fileInfo.streams[i].type == 'Audio') {
            if (fileInfo.streams[i].bitrate && userOptions.volume_level > 0) {
                remainingBitrate += fileInfo.streams[i].bitrate;
            }

        } else if (fileInfo.streams[i].type != 'Video' && fileInfo.streams[i].type != 'Image' && fileInfo.streams[i].bitrate) {
            remainingBitrate += fileInfo.streams[i].bitrate;
        }
    }

    //trong trường hợp có subtitle mà không cần convert thì cần copy subtitle stream
    if (fileInfo.streams.filter(s => s.type === 'Subtitle').length > 0 && subtitle_cmd_array.length == 0) {
        subtitle_cmd_array.push('-c:s', 'copy', '-t', outputDuration);
    }

    if (remainingBitrate == 0 && userOptions.volume_level > 0 && fileInfo.remainingBitrate) {
        remainingBitrate = fileInfo.remainingBitrate; //mặc định 128kbps
    }

    if (userOptions.target_size) {

        //debugger;
        // Tính toán bitrate dựa trên kích thước mục tiêu (MB)
        const targetSizeBytes = userOptions.target_size * 1024 * 1024; // Chuyển MB sang bytes
        // const audioBitrate = 128 * 1024; // Giả sử bitrate audio là 128 kbps
        const bitrateTotalNew = (targetSizeBytes * 8) / outputDuration; // Bitrate video = (Tổng bitrate - Bitrate audio)

        if (remainingBitrate * 1024 >= 0.3 * bitrateTotalNew) {
            remainingBitrate = Math.floor(0.3 * bitrateTotalNew / 1024);
        }

        var videoBitRateNew = Math.max(bitrateTotalNew - remainingBitrate * 1024, 10);
        var maxBitrate = findMaxBitrate(2 * 3840, 2 * 2160, 30, userOptions.format_name);
        videoBitRateNew = Math.min(videoBitRateNew, maxBitrate);
        var targetConfig = await findBestVideoEncoderConfigForTargetSize(userOptions.format_name, userOptions.crop?.width || fileInfo.width, userOptions.crop?.height || fileInfo.height, 0.9 * videoBitRateNew, 25, true);

        if (!targetConfig || !targetConfig.width || !targetConfig.height) {
            console.error('❌ Failed to find suitable encoder config for target size conversion');
            return null;
        }
        userOptions.fps = targetConfig.framerate;
        userOptions.resolution = { width: targetConfig.width, height: targetConfig.height };
        userOptions.videoBitrate = (0.9 * videoBitRateNew) & ~0; // Giảm 10% để có khoảng trống cho audio và biến động bitrate		
        userOptions.videoBitrate = Math.max(10000, Math.min(userOptions.videoBitrate, targetConfig.max_bitrate || videoBitRateNew));
    }

    var flags_array = ['-fflags', '+genpts', '-avoid_negative_ts', '1', '-loglevel', 'info', '-stats_period', 2, '-progress', '-', '-nostats'];
    var input_component_array = [];
    var convert_videostream_cmd_array = [];
    var convert_audiostream_cmd_array = [];

    var numDecodeThread = 2;
    if ((fileInfo.videoCodec === 'av1' && isSafari) || !libNameMap[fileInfo.videoCodec]) {
        numDecodeThread = getNumThreadForDecoder();
    }
    //var cmd_array = [].concat(header_array, input_cmd_array);
    //----input_cmd_array------------------------------------------------------------------------------------------
    getStartTime() > 0 && input_component_array.push('-ss', getStartTime());
    getEndTime() > 0 && input_component_array.push('-to', getEndTime());
    input_component_array.push('-threads', numDecodeThread);//mặc định là 1 thread, khi nào cần decode = ffmpeg wasm thì tăng lên.
    input_component_array.push('-i', userOptions.input_url);

    //----convert_videostream_cmd_array------------------------------------------------------------------------------------------	
    var videoFilters = getVideoFilters();

    if (videoFilters.length > 0) {
        convert_videostream_cmd_array.push('-filter_complex', `[0:v]${videoFilters}[outv]`, '-map', '[outv]');
    }

    var outputWidth = userOptions.resolution?.width || userOptions.crop?.width || fileInfo.width;
    var outputHeight = userOptions.resolution?.height || userOptions.crop?.height || fileInfo.height;

    // Swap dimensions if rotate is 90° or 270°
    if (userOptions.rotate === 90 || userOptions.rotate === 270) {
        [outputWidth, outputHeight] = [outputHeight, outputWidth];
    }

    var needReencode = false;
    needReencode = needReencode || (userOptions.format_name && userOptions.format_name !== fileInfo.videoCodec);
    needReencode = needReencode || (userOptions.fps != -1 && userOptions.fps !== fileInfo.fps);
    needReencode = needReencode || (getVideoFilters().length > 0);
    needReencode = needReencode || (fileInfo.width !== outputWidth || fileInfo.height !== outputHeight);
    needReencode = needReencode || (userOptions.quality != null);
    needReencode = needReencode || (userOptions.rotate && userOptions.rotate !== 0);
    needReencode = needReencode || (userOptions.speed && userOptions.speed !== 1);

    convert_videostream_cmd_array.push('-c:v', needReencode == true ? libNameMap[userOptions.format_name] || 'libx264' : 'copy');

    if (needReencode && !userOptions.target_size) {
        userOptions.videoBitrate = selectBitrateByCodec(userOptions.format_name, outputWidth, outputHeight, userOptions.quality || 'medium', userOptions.fps > 0 ? userOptions.fps : fileInfo.fps);

        var outputConfig = await findBestVideoEncoderConfigForTargetSize(userOptions.format_name, outputWidth, outputHeight, userOptions.videoBitrate, userOptions.fps > 0 ? userOptions.fps : fileInfo.fps);

        if (outputConfig && outputConfig.width && outputConfig.height) {
            outputWidth = outputConfig.width;
            outputHeight = outputConfig.height;
        } else {
            // ✅ Nếu không tìm thấy config, kiểm tra lại với resolution gốc
            console.warn(`⚠️ Could not find optimal encoder config, checking support for original resolution: ${outputWidth}x${outputHeight}`);
            const isSupported = await isVideoEncoderConfigSupported(userOptions.format_name, outputWidth, outputHeight, userOptions.fps > 0 ? userOptions.fps : fileInfo.fps, userOptions.videoBitrate);
            if (!isSupported) {
                console.error(`❌ Codec ${userOptions.format_name} is not supported at resolution ${outputWidth}x${outputHeight}@${userOptions.fps > 0 ? userOptions.fps : fileInfo.fps}fps`);
                return null;
            }
        }
    }


    if (needReencode) {
        convert_videostream_cmd_array.push('-b:v', userOptions.videoBitrate);
    }

    // ← VPS/SPS/PPS mỗi keyframe
    if (needReencode) {
        // Chỉ thêm -s khi KHÔNG có scale/pad filter (tránh re-scale đè lên filter làm méo video)
        const hasResizeFilter = videoFilters.includes('scale=') || videoFilters.includes('pad=');
        if (!hasResizeFilter) {
            convert_videostream_cmd_array.push('-s', `${outputWidth}x${outputHeight}`);
        }
        //convert_videostream_cmd_array.push('-pix_fmt', fileInfo.fmt);//rgb0 = AV_PIX_FMT_RGB0, rgb0 nhanh hơn rgba một chút không được dùng cái này
        convert_videostream_cmd_array.push('-pix_fmt', 'yuv420p');
    }

    var tagVideo = [];
    if (userOptions.format_name === 'h265') {
        tagVideo.push('-tag:v');
        tagVideo.push('hvc1');
    } else if (userOptions.format_name === 'h264') {
        tagVideo.push('-tag:v');
        tagVideo.push('avc1');
    }

    //----audio_cmd_array------------------------------------------------------------------------------------------	
    const isVP9 = userOptions.format_name === 'vp9';
    const isOpusOutput = isVP9; // VP9 typically uses Opus audio
    const audioStreams = fileInfo.streams.filter(s => s.type === 'Audio');

    // ✅ Process audio streams
    if (audioStreams.length > 0) {
        let needAudioEncode = userOptions.volume_level != 1;

        // ✅ Check if any stream needs encoding (multi-channel or speed change)
        if (!needAudioEncode) {
            needAudioEncode = audioStreams.some(stream => stream.channels && stream.channels > 2);
        }
        if (!needAudioEncode) {
            needAudioEncode = userOptions.speed && userOptions.speed !== 1;
        }

        // ✅ Apply audio encoding if needed
        if (needAudioEncode) {
            // ✅ Build audio filter: volume + atempo (speed)
            const audioFilters = [];
            if (userOptions.volume_level != 1) {
                audioFilters.push(`volume=${userOptions.volume_level}`);
            }
            // atempo range: 0.5-2.0, chain if needed
            if (userOptions.speed && userOptions.speed !== 1) {
                let speed = userOptions.speed;
                while (speed > 2) {
                    audioFilters.push('atempo=2.0');
                    speed /= 2;
                }
                while (speed < 0.5) {
                    audioFilters.push('atempo=0.5');
                    speed *= 2;
                }
                if (speed !== 1) {
                    audioFilters.push(`atempo=${speed.toFixed(4)}`);
                }
            }
            if (audioFilters.length > 0) {
                convert_audiostream_cmd_array.push('-filter:a', audioFilters.join(','));
            }

            // Set audio codec
            convert_audiostream_cmd_array.push('-c:a', isOpusOutput ? 'libopus' : 'aac');
            if (audioStreams.some(stream => stream.channels && stream.channels > 2)) {
                convert_audiostream_cmd_array.push('-ac', '2');
            }
        }
    }

    //trong video có thể có nhiều audio stream
    if (userOptions.target_size && remainingBitrate > 0) {
        if (userOptions.format_name == 'vp9') {
            remainingBitrate = remainingBitrate * 0.9;
        }
        if (userOptions.volume_level > 0 && audioStreams.length > 0) {
            convert_audiostream_cmd_array.push('-b:a', dec(1024 * remainingBitrate / audioStreams.length, 0));
        }
    }

    //----output_cmd_array------------------------------------------------------------------------------------------
    var OUTPUT_MARKER = '.';
    if (userOptions.target_size) {
        OUTPUT_MARKER = `.${userOptions.target_size}MB.`;
    }
    var filename = removeExtension(fileInfo.name) + '_' + getStringTime() + (userOptions.format_name == 'vp9' ? `${OUTPUT_MARKER}webm` : `${OUTPUT_MARKER}mp4`);
    if (1 > 0) {
        const fps = userOptions.fps > 0 ? userOptions.fps : fileInfo.fps;

        var convert_cmd_array = [...flags_array, ...input_component_array];

        // ✅ FIX: Tăng/giảm FPS với external VideoEncoder/VideoDecoder delay
        const targetFps = userOptions.fps > 0 ? userOptions.fps : fileInfo.fps;
        const inputFps = fileInfo.fps;

        // Thêm fps filter nếu cần đổi FPS
        // setpts=N/(FPS*TB) → normalize timestamps thành constant interval
        // fps=fps → duplicate/drop frames dựa trên frame count, không phải timestamps
        if (needReencode) {
            const fpsFilter = `setpts=N/(${inputFps}*TB),fps=fps=${targetFps}`;
            videoFilters = videoFilters.length > 0 ? fpsFilter + ',' + videoFilters : fpsFilter;

            // Update -filter_complex trong video_cmd_array
            const filterIdx = convert_videostream_cmd_array.indexOf('-filter_complex');
            if (filterIdx !== -1) {
                // Có -filter_complex cũ → update với videoFilters mới
                convert_videostream_cmd_array[filterIdx + 1] = `[0:v]${videoFilters}[outv]`;
            } else {
                // Không có -filter_complex → thêm mới
                convert_videostream_cmd_array.unshift('-filter_complex', `[0:v]${videoFilters}[outv]`, '-map', '[outv]');
            }
        }

        convert_cmd_array = [
            ...convert_cmd_array,
            ...(videoFilters.length == 0 ? ['-map', '0:' + video_stream_index] : []),
            ...convert_videostream_cmd_array,
            '-vsync', '0'
        ];


        if (remainingBitrate > 0 || subtitle_cmd_array.length > 0) {
            convert_cmd_array = [...convert_cmd_array, ...['-map_metadata', '0', '-map', '0:a?', '-map', '0:s?'], ...convert_audiostream_cmd_array, ...subtitle_cmd_array];
        }

        convert_cmd_array = [...convert_cmd_array, ...['-metadata:s', 'handler_name="BeeConvert"', '-threads', '1',], ...tagVideo, filename];

        // if (APP_STATE.selectedFilters && APP_STATE.selectedFilters.length > 0) {
        //     convert_cmd_array.push('-filters', APP_STATE.selectedFilters);
        // }

        //tìm filter_complex và thêm '-filter_threads', '0', vào convert_cmd_array
        const filterComplexIndex = convert_cmd_array.indexOf('-filter_complex');
        if (filterComplexIndex !== -1) {
            convert_cmd_array.splice(filterComplexIndex, 0, '-filter_complex_threads', '8');
        }

    }

    return convert_cmd_array;
}

async function convertFileWithOptions_New(inputOptions) {

    await run_cmd(CMD_SDK_DELETE_FILES);
    var start_time = Date.now();
    const msg = validateObj(inputOptions);
    if (msg) {
        throw new Error(msg);
    }

    //const checkBitrate = inputOptions.target_size ? true : false;
    var cmd_array = await convertUserOptionsToCommand(inputOptions);

    // debugger;
    handleConvertStart();

    var callback = function (data) {
        if (data.type_cmd === CMD_SDK_UPDATE_PROGRESS) {
            BeeUI.updateProgress(data.percent_complete, data.remainingTime);
        }
    };
    BeeUI.updateProgress(0, 0, 'Converting...');
    var runResult = await run_cmd(CMD_SDK_START_CONVERT, cmd_array, callback);

    if (runResult.outputFiles && runResult.outputFiles.length > 0) {
        const outputFile = runResult.outputFiles[runResult.outputFiles.length - 1];
        console.log("time to convert:", Date.now() - start_time);

        if (outputFile.blob_url == null) {
            handleConversionError("Conversion failed, no generated url");
            return;
        }

        try {
            var newFileInfo = await getFileInfo(outputFile.blob_url);
            handleConversionSuccess(
                newFileInfo,
                outputFile.name,
            );
        } catch (error) {
            console.log(error);
            handleConversionError(error.message);
            return;
        }
    } else {
        const errMsg = "Conversion finished but no output file generated.";
        handleConversionError(errMsg);
    }
}

function handleConversionSuccess(fileInfo, outputName) {
    isConverting = false;
    BeeUI.hideProgress();

    if (typeof releaseWakeLock === "function") {
        releaseWakeLock();
    }

    const platform = detectPlatform();
    BeeUI.showSuccess(
        fileInfo,
        outputName,
        async function (url, name) {
            //khi người dùng bấm nút save.
            if (IS_MOBILE_APP) {
                BeeUI.showLoading();
                try {
                    let total = 0;
                    let size = 50 * 1024 * 1024; //50MB
                    let pos = 0;
                    let fileName = outputName || name;

                    do {
                        let { data, length, position, totalSize } = await fetchBlobInChunks(
                            url,
                            pos,
                            size,
                        );
                        total = totalSize;
                        pos += length;
                        await postDataToServer(data, position, fileName);
                    } while (pos < total);

                    let res = await postDataToServer([], total, fileName);
                    BeeUI.showToast(res.message);
                } catch (error) {
                    console.error(error);
                    BeeUI.showError("Failed to save video. Please try again");
                } finally {
                    BeeUI.hideLoading();
                }
            } else {
                const a = document.createElement("a");
                a.href = url;
                a.download = outputName || name;
                a.click();
            }
        }
    );
}

function convertErrorMessage(message) {
    if (message.includes('NetworkError') || message.includes('XMLHttpRequest')) {
        return "Video conversion failed. Please check your internet connection and try again.";
    }
    if (message.includes('ErrorEvent')) {
        return "An error occurred during conversion.";
    }
    return message || "An error occurred during conversion.";
}

function handleConversionError(msg, clearData = false) {
    isConverting = false;
    let errorMsg = convertErrorMessage(msg);
    BeeUI.hideProgress();
    BeeUI.hideLoading();
    BeeUI.showError(errorMsg, function () {
        if (clearData) {
            clearRecentFile();
        }
        location.reload();
    });
    if (typeof releaseWakeLock === "function") {
        releaseWakeLock();
    }
   // currentWorker.postMessage({ type_cmd: CMD_SDK_CANCEL_CONVERT });
}

function handleConvertStart() {
    BeeUI.showStart(async function () {
        handleConvertCancel();
    });
}

function handleConvertCancel() {
    BeeUI.hideProgress();
    run_cmd(CMD_SDK_CANCEL_CONVERT);
    if (typeof releaseWakeLock === "function") {
        releaseWakeLock();
    }
}

function getNumThreadForDecoder() {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
        return Math.max(4, Math.min(8, navigator.hardwareConcurrency));
    }
    return 2;
}

function getFileInfoFromString(ffmpegOutput) {
    const info = {
        filename: '',
        size: 0, /** bytes */
        displaySize: '0 MB',
        duration: 0,
        bitrateTotal: 0,
        width: 0,
        height: 0,
        fps: 0,
        videoBitRate: 0,
        audioBitRate: 0,
        videoCodec: '',
        audioCodec: '',
        streams: []
    };
    ffmpegOutput = ffmpegOutput.split('Stream mapping:')[0];
    const filenameMatch = ffmpegOutput.match(/from '([^']+)'/);
    if (filenameMatch) {
        info.filename = filenameMatch[1];
    }
    const durationMatch = ffmpegOutput.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d+),.*bitrate: (\d+) kb\/s/);
    if (durationMatch) {
        const hours = parseInt(durationMatch[1], 10);
        const minutes = parseInt(durationMatch[2], 10);
        const seconds = parseFloat(durationMatch[3]);
        info.duration = hours * 3600 + minutes * 60 + seconds;
        info.bitrateTotal = parseInt(durationMatch[4], 10);
        info.size = info.duration * info.bitrateTotal * 1024 / 8;
        if (info.size >= 1024 * 1024 * 1024) {
            info.displaySize = `${(info.size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else if (info.size >= 1024 * 1024) {
            info.displaySize = `${(info.size / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            info.displaySize = `${(info.size / 1024).toFixed(2)} KB`;
        }
    }
    const streamRegex = /Stream #(\d+):(\d+)(?:\[0x[0-9a-f]+\])?(?:\(([^)]*)\))?\s*:\s*(Video|Audio|Subtitle|Data|Attachment)\s*:\s*(\w+)([^\n]*)/gm;
    let match;
    while ((match = streamRegex.exec(ffmpegOutput)) !== null) {
        const streamInfo = {
            file_index: parseInt(match[1]),
            stream_index: parseInt(match[2]),
            type: match[4],
            codec_name: match[5].toLowerCase(),
        };
        console.log('streamInfo:', streamInfo);
        if (streamInfo.codec_name == 'hevc') streamInfo.codec_name = 'h265';
        const attributes = match[0].split(',');
        attributes.forEach(attr => {
            attr = attr.trim();
            if (streamInfo.codec_name == 'jpeg' || streamInfo.codec_name == 'mjpeg' || streamInfo.codec_name == 'png' || streamInfo.codec_name == 'gif' || streamInfo.codec_name == 'webp') {
                streamInfo.type = 'Image';
            }
            streamInfo.file_index = streamInfo.file_index;
            streamInfo.stream_index = streamInfo.stream_index;
            const bitrateMatch = attr.match(/(\d+) kb\/s/);
            if (bitrateMatch) {
                streamInfo.bitrate = parseInt(bitrateMatch[1], 10);
            }
            if (streamInfo.type === 'Video') {
                info.videoCodec = streamInfo.codec_name || '';
                info.videoBitRate = streamInfo.bitrate || 0;
                const sizeMatch = attr.match(/(\d+)x(\d+)/);
                if (sizeMatch) {
                    streamInfo.width = parseInt(sizeMatch[1], 10);
                    streamInfo.height = parseInt(sizeMatch[2], 10);
                    const displayMatrixMatch = ffmpegOutput.match(/displaymatrix: rotation of ([\-\d\.]+) degrees/);
                    if (displayMatrixMatch) {
                        streamInfo.displaymatrix = parseInt(displayMatrixMatch[1]);
                        if (Math.abs(streamInfo.displaymatrix) === 90 || Math.abs(streamInfo.displaymatrix) === 270) {
                            const temp = streamInfo.width;
                            streamInfo.width = streamInfo.height;
                            streamInfo.height = temp;
                        }
                    }
                    info.width = streamInfo.width;
                    info.height = streamInfo.height;
                }
                const fpsMatch = attr.match(/(\d+(?:\.\d+)?) fps/);
                if (fpsMatch) {
                    streamInfo.fps = parseFloat(fpsMatch[1]);
                    info.fps = streamInfo.fps;
                }
            } else if (streamInfo.type === 'Audio') {
                info.audioCodec = streamInfo.codec_name || '';
                info.audioBitRate = streamInfo.bitrate || 0;
                const hzMatch = attr.match(/(\d+) Hz/);
                if (hzMatch) {
                    streamInfo.hz = parseInt(hzMatch[1], 10);
                }
                if (attr.includes('stereo')) {
                    streamInfo.channels = 2;
                } else if (attr.includes('mono')) {
                    streamInfo.channels = 1;
                } else if (attr.includes('5.1')) {
                    streamInfo.channels = 6;
                } else if (attr.includes('7.1')) {
                    streamInfo.channels = 8;
                } else if (attr.includes('quad')) {
                    streamInfo.channels = 4;
                } else if (attr.includes('3.0')) {
                    streamInfo.channels = 3;
                } else if (attr.includes('2.1')) {
                    streamInfo.channels = 3;
                }
            }
        });
        info.streams.push(streamInfo);
    }
    return info;
}


//hungnote, cần xem lại với step = +/- 2;
async function findBestVideoEncoderConfigForTargetSize(format, originalWidth, originalHeight, targetBitrate, fps, isTargetSize = false) {

    const formatToCodecId = { h264: 27, h265: 173, av1: 226, vp9: 167 };
    var codecId = formatToCodecId[format];

    var islandscape = originalWidth >= originalHeight;
    var min_supported_resolutions = islandscape ? self.browser_settings[format].supported_resolution.min_landscape :
        self.browser_settings[format].supported_resolution.min_portrait;
    var max_supported_resolutions = islandscape ? self.browser_settings[format].supported_resolution.max_landscape :
        self.browser_settings[format].supported_resolution.max_portrait;

    const minWidth = min_supported_resolutions[0], maxWidth = max_supported_resolutions[0];
    const minHeight = min_supported_resolutions[1], maxHeight = max_supported_resolutions[1];
    const targetFps = fps || 25; // Fixed FPS
    const targetBpp = self.browser_settings[format].bpp;

    const aspectRatio = originalWidth / originalHeight;

    if (isTargetSize === true) {

        const totalPixels = targetBitrate / (targetFps * targetBpp);
        var baseWidth = Math.sqrt(totalPixels * aspectRatio);
        var baseHeight = Math.sqrt(totalPixels / aspectRatio);
        if (baseWidth < 40) {
            baseWidth = 40;
            baseHeight = 40 / aspectRatio;
        }

        if (baseHeight < 40) {
            baseHeight = 40;
            baseWidth = 40 * aspectRatio;
        }
        baseWidth = baseWidth & ~3;
        baseHeight = baseHeight & ~3;

    } else {
        var baseWidth = originalWidth;
        var baseHeight = originalHeight;
    }

    var t = Date.now();
    var step = baseWidth <= 360 ? 4 : -4;
    // debugger;
    var count = 0;
    while (1 > 0) {
        count++;
        if (count > 2000) {
            break;
        }

        if ((baseWidth > maxWidth || baseHeight > maxHeight)) {
            if (step > 0) {
                break;
            } else {
                baseWidth = baseWidth + step;
                baseHeight = Math.round(baseWidth / aspectRatio) & ~3;
                continue;
            }
        }
        if (baseWidth < minWidth || baseHeight < minHeight) {
            if (step > 0) {
                baseWidth = baseWidth + step;
                baseHeight = Math.round(baseWidth / aspectRatio) & ~3;
                continue;
            } else {
                break;
            }
        }

        try {
            var maxBitrate = 2 * findMaxBitrate(baseWidth, baseHeight, targetFps, codecId);
            var br = Math.min(maxBitrate, targetBitrate) & ~0;

            const support = await isVideoEncoderConfigSupported(codecId, baseWidth, baseHeight, targetFps, br);
            if (support === true) {

                console.log('findBestVideoEncoderConfigForTargetBitrate done in ms:', Date.now() - t, 'iterations:', count);
                return {
                    width: baseWidth,
                    height: baseHeight,
                    framerate: targetFps,
                    max_bitrate: br
                };
            } else {
                console.log('not support config:', { codecId, baseWidth, baseHeight, targetFps, br });
            }
        } catch (e) { }
        baseWidth = baseWidth + step;
        baseHeight = Math.round(baseWidth / aspectRatio) & ~3;
    }


}


/**
 * Tìm max bitrate tối đa theo width, height và fps
 * ✅ Tự động tính toán dựa trên độ phân giải và frame rate
 * ✅ Hỗ trợ từ 360p đến 8K với fps từ 15-120
 * ✅ Tối ưu theo chuẩn streaming và hardware limits
 * 
 * @param {number} width - Video width (pixels)
 * @param {number} height - Video height (pixels)
 * @param {number} fps - Frame rate (fps)
 * @param {number} [codecId=27] - Codec ID (27: H.264, 173: H.265, 226: AV1, 167: VP9)
 * @returns {number} Maximum bitrate in bps
 */
function findMaxBitrate(width, height, fps, codecId = 27) {
    // ✅ Validate inputs
    if (!width || !height || !fps || width <= 0 || height <= 0 || fps <= 0) {
        console.error('❌ Invalid input parameters:', { width, height, fps });
        return 1000000; // 1Mbps fallback
    }

    const pixels = width * height;
    const pixelsPerSecond = pixels * fps;

    // ✅ Max bits per pixel based on resolution tiers
    let maxBitsPerPixel = 0.3; // Default high quality

    if (pixels >= 7680 * 4320) { // 8K
        maxBitsPerPixel = 0.4;
    } else if (pixels >= 3840 * 2160) { // 4K
        maxBitsPerPixel = 0.35;
    } else if (pixels >= 2560 * 1440) { // 1440p
        maxBitsPerPixel = 0.3;
    } else if (pixels >= 1920 * 1080) { // 1080p
        maxBitsPerPixel = 0.25;
    } else if (pixels >= 1280 * 720) { // 720p
        maxBitsPerPixel = 0.2;
    } else if (pixels >= 854 * 480) { // 480p
        maxBitsPerPixel = 0.18;
    } else { // 360p and below
        maxBitsPerPixel = 0.15;
    }

    // ✅ FPS scaling factor
    let fpsMultiplier = 1.0;
    if (fps >= 120) {
        fpsMultiplier = 1.8;
    } else if (fps >= 60) {
        fpsMultiplier = 1.5;
    } else if (fps >= 50) {
        fpsMultiplier = 1.3;
    } else if (fps >= 30) {
        fpsMultiplier = 1.1;
    } else if (fps <= 15) {
        fpsMultiplier = 0.8;
    }

    // ✅ Codec efficiency factors
    const codecEfficiency = {
        27: 1.0,    // H.264 baseline
        173: 0.75,  // H.265 more efficient
        226: 0.6,   // AV1 most efficient  
        167: 0.8    // VP9 good efficiency
    };

    const codecFactor = codecEfficiency[codecId] || 1.0;

    // ✅ Calculate max bitrate
    let maxBitrate = pixelsPerSecond * maxBitsPerPixel * fpsMultiplier * codecFactor;

    // ✅ Hardware and streaming limits
    const hardwareLimits = [
        [35389440, 500000000],   // 8K: 500Mbps max (8192*4320)
        [33177600, 400000000],   // 8K: 400Mbps max (7680*4320)  
        [8294400, 150000000],    // 4K: 150Mbps max (3840*2160)
        [3686400, 80000000],     // 1440p: 80Mbps max (2560*1440)
        [2073600, 50000000],     // 1080p: 50Mbps max (1920*1080)
        [921600, 25000000],      // 720p: 25Mbps max (1280*720)
        [409920, 10000000],      // 480p: 10Mbps max (854*480)
        [230400, 5000000]        // 360p: 5Mbps max (640*360)
    ];

    // ✅ Apply hardware limits
    for (const [resolutionPixels, limit] of hardwareLimits) {
        if (pixels >= resolutionPixels) {
            maxBitrate = Math.min(maxBitrate, limit);
            break;
        }
    }

    // ✅ Absolute min/max bounds
    const absoluteMin = 500000;    // 500kbps minimum
    const absoluteMax = 1000000000; // 1Gbps maximum

    const result = Math.max(absoluteMin, Math.min(absoluteMax, Math.round(maxBitrate)));

    //  console.log(`🚀 Max bitrate for ${width}x${height}@${fps}fps (codec ${codecId}): ${(result / 1000000).toFixed(2)}Mbps`);

    return result;
}

/**
 * ✅ Enhanced bitrate selection cho video encoding
 * Chọn bitrate tối ưu dựa vào codec, resolution, quality và framerate
 * @param {string} codec - 'av1', 'vp9', 'h264', 'h265'
 * @param {number} width - Video width
 * @param {number} height - Video height 
 * @param {string} quality - 'low', 'medium', 'high', 'ultra'
 * @param {number} fps - Frame rate (optional, default: 30)
 * @param {string} usage - 'streaming', 'storage', 'broadcast' (optional)
 * @returns {number} bitrate in bps (bits per second)
 */
function selectBitrateByCodec(codec, width, height, quality = 'medium', fps = 30, usage = 'streaming') {

    quality = quality.toLowerCase();

    var bpp = 1.0;
    if (quality === 'low') {
        return 60000;
    } else if (quality === 'medium') {
        bpp = self.browser_settings[codec].bpp;
    } else if (quality === 'high') {
        bpp = 2 * self.browser_settings[codec].bpp;
    }

    var bitrateInBps = calculateBitrateFromBpp(bpp, width, height, fps);
    return bitrateInBps;
}

function calculateBitrateFromBpp(bpp, width, height, fps = 30) {
    const pixels = width * height;
    const pixelsPerSecond = pixels * fps;
    const bitrate = pixelsPerSecond * bpp;

    console.log(`💰 Bitrate: ${(bitrate / 1000000).toFixed(2)} Mbps (${bpp} bpp × ${width}×${height}@${fps}fps)`);

    return Math.round(bitrate);
}