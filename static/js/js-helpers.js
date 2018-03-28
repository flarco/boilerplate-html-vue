(function(){
  var cookies;

  function serializeArray(form) {
    var field, l, s = [];
    if (typeof form == 'object' && form.nodeName == "FORM") {
      var len = form.elements.length;
      for (var i=0; i<len; i++) {
        field = form.elements[i];
        if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
          if (field.type == 'select-multiple') {
            l = form.elements[i].options.length;
            for (j=0; j<l; j++) {
                if(field.options[j].selected)
                    s[s.length] = { name: field.name, value: field.options[j].value };
            }
          } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
            s[s.length] = { name: field.name, value: field.value };
          }
        }
      }
    }
    return s;
  }

  function readForm(form_name){
    var data1 = {};
    serializeArray(document.forms[form_name]).map(function(x){data1[x.name] = x.value || null;});
    return data1;
  };


  function readCookie(name,c,C,i){
    if(cookies){ return cookies[name]; }
    c = document.cookie.split('; ');
    cookies = {};
    for(i=c.length-1; i>=0; i--){
      C = c[i].split('=');
      cookies[C[0]] = C[1];
    }
    return cookies[name];
  };


  function notifyMe(mesg) {
    if (!Notification) {
      alert('Desktop notifications not available in your browser. Try Chromium.');
      return;
    }

    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('Notification title', {
        icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
        body: mesg,
      });

      // notification.onclick = function () {
      //   window.open("http://stackoverflow.com/a/13328397/1269037");
      // };
      
    }

  };
  
  window.notifyMe = notifyMe;
  window.readCookie = readCookie;
  window.readForm = readForm;
})();
