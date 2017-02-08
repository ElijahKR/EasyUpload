var fileInfo = function () {
    return {
        index: '',
        tag: {},
        upload: [],
        total: ''
    };
}

var multiupload = function (args) {
    var current = $(this);

    var uniqueNo = 0;
    var uploads = [];
    var fileTagTemplate = '<input type="file" multiple="multiple" style="display:none;" />';

    /*intefaces*/
    current.upload = function () {
        //append to stack
        var currFileInfo = new fileInfo();
        currFileInfo.index = uniqueNo++;

        //append file tag
        var currFileTag = $(fileTagTemplate);
        currFileTag.attr('unique', currFileInfo.index);
        $('body').append(currFileTag);

        currFileInfo.tag = currFileTag;
        uploads.push(currFileInfo);

        //initialize file event
        currFileTag.change(function () {
            var files = currFileTag.get(0).files;

            var currIndex = 0;
            var filecount = files.length;
            currFileInfo.total = filecount;

            (function execute() {
                initupload(currFileInfo.index, files[currIndex++]);
                setTimeout(function () {
                    if (currIndex < filecount) {
                        execute();
                    }
                }, 100);
            })();
        });

        currFileTag.click();
    }
    current.cancel = function (index, key) {
        loop(uploads, function (up) {
            loop(up.upload, function (currUpload) {
                if (currUpload.key == key) {
                    currUpload.cancel();
                }
            });
        });
    }
    current.pause = function (index, key) {
        loop(uploads, function (up) {
            loop(up.upload, function (currUpload) {
                if (currUpload.key == key) {
                    currUpload.pause();
                }
            });
        });
    }
    current.continue = function (index, key) {
        loop(uploads, function (up) {
            loop(up.upload, function (currUpload) {
                if (currUpload.key == key) {
                    currUpload.continue();
                }
            });
        });
    }
    current.dispose = function () {
        loop(uploads, function (up) {
            loop(up.upload, function (currUpload) {
                currUpload.cancel();
            });
            up.tag.remove();
        });
    }

    /*auxiliary*/
    function initupload(index, file) {
        var currUpload = new upload({
            url: args.url,
            file: file
        });
        currUpload.key = Math.random();

        //append
        appendUpload(index, currUpload);

        //events
        currUpload.start(function () {
            execute(args.start, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        currUpload.cancel(function () {
            execute(args.cancel, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        currUpload.process(function (ev, data) {
            execute(args.process, { index: index, key: currUpload.key, name: file.name, upload: currUpload, data: data });
        });

        currUpload.success(function () {
            execute(args.success, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        currUpload.error(function (ev, data) {
            execute(args.error, { index: index, key: currUpload.key, name: file.name, upload: currUpload, msg: data.msg });
        });

        currUpload.complete(function () {
            removeUpload(index);
            execute(args.complete, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        currUpload.pause(function () {
            execute(args.pause, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        currUpload.continue(function () {
            execute(args.contine, { index: index, key: currUpload.key, name: file.name, upload: currUpload });
        });

        //start
        currUpload.start();
    }

    function findUpload(index) {
        var currUp = undefined;
        loop(uploads, function (up) {
            if (up.index == index) {
                currUp = up;
            }
        });
        return currUp;
    }

    function appendUpload(index, upload) {
        loop(uploads, function (up) {
            if (up.index == index) {
                up.upload.push(upload);
            }
        });
    }

    function removeUpload(index) {
        var up = findUpload(index);
        if (up) {
            up.total--;
            if (up.total <= 0) {
                if (up.tag.remove) {
                    up.tag.remove();
                }
            }
        }
    }

    function execute(callback, params) {
        if (callback && typeof (callback) == 'function') {
            callback(params);
        }
    }

    function loop(array, callback) {
        for (var i = 0; i < array.length; i++) {
            var curr = array[i];
            execute(callback, curr);
        }
    }

    return current;
}