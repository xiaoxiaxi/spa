export function history() {
  var iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.visibility = 'hidden';
  iframe.style.zIndex = '-99999';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  document.body.appendChild(iframe);
  iframe.src = 'about:blank';

  let historyLocker = {};
  var lockKey = 'lock-' + (+new Date());

  function doPushHistory(hash) {
    if (!hash || historyLocker[lockKey]) {
      console.log('jump out');
      historyLocker[lockKey] = false;
      return;
    }
    try {
      var doc = iframe.contentWindow.document;
      console.log('更改URL');
      doc.write('<head><title>');
      doc.write(document.title);
      doc.write('</title>');
      doc.write(
        '<script>' +
        'parent.historyLocker[' + lockKey + '] = true;' +
        'parent.location.hash = decodeURIComponent(' + encodeURIComponent(hash) + ');' +
        '</script>'
      );
      doc.write('</head><body></body>');
      doc.close();
      historyLocker[lockKey] = false;
    } catch (e) {
      console.log(e);
    }
  }
  return function(context, next) {
    doPushHistory(context.request.hash);
    next();
  };
}