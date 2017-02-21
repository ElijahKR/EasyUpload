# EasyUpload
Easy Upload provides an easy way to upload multifile asynchronously. 
<p>
A File object is a specific kind of a Blob, and can be used in any context that a Blob can. 
So we can use <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice">Blob.slice()</a> to cut a file into to individual slices, and post to server one by one. This makes it possible to upload large files.
<br />
Encapsulate this, and make multiple requests at the same time, we can upload multiple files simultaneously.
<p/>
<p>We provide the sample code for both <a href="https://github.com/ElijahKR/EasyUpload/blob/master/examples/Java_EasyUpload.rar">Java</a> and <a href="https://github.com/ElijahKR/EasyUpload/blob/master/examples/C%23_EasyUpload.rar">C#</a> as attached.</p>
<h2>Single</h2>
<strong><i>upload</i></strong> encapsulates the functionality to upload a large file. We can use key work <strong>new</strong> to instantiate it. 
<br />
For instance:
<code><pre>var up = new upload({
                url: 'upload',    // url
                file: file,       // uploading file
                chunksize: 1024   // the size of each slice, default value is 512 * 1024.
            });</pre></code>
<p>Following is the interfaces for <strong><i>upload</i></strong>.</p>
<p>
<strong>.start(callback)</strong>
<br />
<i>callback</i> will be triggered before starting. e.g.
<code><pre>up.start(function () {
                // do some stuff
            });</pre></code>
</p>

<p>
<strong>.cancel(callback)</strong>
<br />
<i>callback</i> will be triggered before canceling.
<code><pre>up.cancel(function () {
                // do some stuff
            });</pre></code>
</p>

<p>
<strong>.process(callback)</strong>
<br />
<i>callback</i> will be triggered while processing.
<code><pre>up.process(function (ev, data) {   // data: {percent: '', name: ''}
                // do some stuff
                var per = String(data.percent) + '%';
            });</pre></code>
</p>

<p>
<strong>.pause(callback)</strong>
<br />
<i>callback</i> will be triggered before pausing.
<code><pre>up.pause(function () {
                // do some stuff
            });</pre></code>
</p>

<p>
<strong>.continue(callback)</strong>
<br />
<i>callback</i> will be triggered before continuing.
<code><pre>up.continue(function () {
                // do some stuff
            });</pre></code>
</p>

<p>
<strong>.complete(callback)</strong>
<br />
<i>callback</i> will be triggered after all stuff done.
<code><pre>up.complete(function () {
                // do some stuff
            });</pre></code>
</p>

<p>
<strong>.error(callback)</strong>
<br />
<i>callback</i> will be triggered while errors occuring.
<code><pre>up.error(function (ev, data) {   // data: {percent: '', name: '', msg: ''}
                // do some stuff
                alert(data.msg);
            });</pre></code>
</p>
