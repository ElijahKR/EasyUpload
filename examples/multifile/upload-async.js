/*variables*/
var eventsDefination = {
    start: 'start',
    cancel: 'cancel',
    process: 'process',
    success: 'success',
    error: 'error',
    complete: 'complete',
    pause: 'pause',
    continue: 'continue'
}

var upload = function (args) {
    var current = $(this);
    var processing = true;
    var pausing = false;
    var cacheInfo = {
        file: [],
        obj: []
    };

    /*chunk size*/
    current.chunksize = 512 * 1024;
    if (args.chunksize) {
        chunksize = args.chunksize;
    }

    /*events*/
    current.start = function (callback) {
        eventsBind(eventsDefination.start, callback, function () {
            processing = true;
            if (args.file) {
                uploadasync(args.file, 0);
            }
        });
    }
    current.cancel = function (callback) {
        eventsBind(eventsDefination.cancel, callback, function () {
            processing = false;
        });
    }
    current.process = function (callback) {
        eventsBind(eventsDefination.process, callback);
    }
    current.success = function (callback) {
        eventsBind(eventsDefination.success, callback);
    }
    current.error = function (callback) {
        eventsBind(eventsDefination.error, callback);
    }
    current.complete = function (callback) {
        eventsBind(eventsDefination.complete, callback);
    }
    current.pause = function (callback) {
        eventsBind(eventsDefination.pause, callback, function () {
            pausing = true;
        });
    }
    current.continue = function (callback) {
        eventsBind(eventsDefination.continue, callback, function () {
            if (pausing) {
                pausing = false;
                if (cacheInfo.file && cacheInfo.obj) {
                    uploadasync(cacheInfo.file, cacheInfo.obj.start, cacheInfo.obj.name);
                }
            }
        });
    }

    /*auxiliary methods*/
    function uploadasync(file, start, name) {
        var totlelength = file.size;

        var percent = 100 * start / totlelength;
        current.trigger(eventsDefination.process, { percent: percent.toFixed(2), name: file.name });

        if (start < totlelength) {
            var formdata = new FormData();
            var currChunkSize = current.chunksize;
            var end = start;

            if (start == 0) {
                name = file.name;
            }

            if (start < file.size) {
                if (currChunkSize > totlelength) {
                    currChunkSize = totlelength;
                }
                end = start + currChunkSize;
                if (end >= totlelength) {
                    end = totlelength
                }

                formdata.append('file', file.slice(start, end));
                formdata.append('total', totlelength);
                formdata.append('name', name);
                formdata.append('filename', file.name);
                formdata.append('start', start);
                formdata.append('end', end);
            }

            $.ajax({
                url: args.url,
                type: 'post',
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: formdata,
                error: function (response, status, error) {
                    current.trigger(eventsDefination.error, { percent: percent.toFixed(2), name: file.name, msg: error });
                    current.trigger(eventsDefination.complete);
                },
                success: function (data) {
                    if (data.flag) {
                        if (processing) {
                            if (!pausing) {
                                uploadasync(file, data.obj.start, data.obj.name);
                            }
                            else {
                                cacheInfo.file = file;
                                cacheInfo.obj = data.obj;
                            }
                        }
                        else {
                            current.trigger(eventsDefination.cancel);
                            current.trigger(eventsDefination.complete);
                        }
                    }
                    else {
                        current.trigger(eventsDefination.error, { percent: percent.toFixed(2), name: file.name, msg: data.msg });
                        current.trigger(eventsDefination.complete);
                    }
                },
                complete: function () {
                    
                }
            });
        }
        else {
            cacheInfo = { file: [], obj: [] };
            current.trigger(eventsDefination.success);
            current.trigger(eventsDefination.complete);
        }
    }

    function execute(callback, params) {
        if (callback && typeof (callback) == 'function') {
            callback(params);
        }
    }

    function eventsBind(eventName, callback, triggerExecution) {
        if (callback && typeof (callback) == 'function') {
            current.on(eventName, callback);
        }
        else {
            current.trigger(eventName)
            execute(triggerExecution);
        }
    };

    return current;
}