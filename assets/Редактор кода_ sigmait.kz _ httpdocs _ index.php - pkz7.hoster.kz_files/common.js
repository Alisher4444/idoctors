// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
function getForm(element)
{
	return getParentByTagName(element, 'FORM');
}

function getParentByTagName(element, tagName)
{
	while (element) {
		if (element.tagName == tagName) {
			return element;
		}
		element = element.parentNode;
	}
}

function getParentById(element, id)
{
	while (element) {
		if (element.id == id) {
			return element;
		}
		element = element.parentNode;
	}
}

function getParentByClass(element, className)
{
	while (element) {
		if (hasClass(element, className)) {
			return element;
		}
		element = element.parentNode;
	}
}

function set_focus(d, el)
{
	if (!el)	// if form element not set - do nothing
		return;

	if ((x = findObj(e, d)) != null) {
		if (x.focus)
			x.focus();
		if (x.select)
			x.select();
	}
}

function syn(s)
{
	if (!s || !s.options || !s.options.length)
		return false;

	if (s.options[s.options.length - 1].selected)
		s.options[s.options.length - 1].selected = false;
}

function plesk_scroll(w)
{
	var nav = navigator.appName;
	var ver = parseInt(navigator.appVersion);
	if ((nav.indexOf('Netscape') != -1) && (ver == 4) && w.document.location.hash) {
		var aname = w.document.location.hash.substr(1);
		var an = w.document.anchors[aname];
		if (an)
			w.scrollTo(an.x, an.y);
	}
}

function getButtonName(name)
{
    re = /^bname_([A-Za-z0-9-]+)$/;
    return name.replace(re,"$1");
}

function turnAutocompleteOff()
{
	try {
		var inputs = document.getElementsByTagName('INPUT');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].setAttribute('autocomplete', 'off');
		}
	} catch (e) {}
}

//---------------------------------- redirect

function go_to(href)
{
    try {
        window.location = href;
    } catch (e) {
    }
}

//---------------------------------- conhelp & help

function SetContext(context, default_conhelp)
{
	SetHelpModule('');

	try {
		if (context)
			top._context = context;
		if (default_conhelp)
			top._default_conhelp = default_conhelp;
		else if (context)
			top._default_conhelp = context;
	} catch (e) {
		return false;
	}

	return true;
}

function SetHelpPrefix(prefix)
{
	try {
		top._help_prefix = prefix;
	} catch (e) {
		return false;
	}

	return true;
}

function SetHelpModule(module)
{
	try {
		top._help_module = module;
	} catch (e) {
		return false;
	}

	return true;
}

function OpenHelpWindow(context, prefix, module)
{
	var url = getHelpUrl(context, prefix, module);

	try {
		var w = window.open(url, 'help',
			'toolbar=no,scrollbars=yes,resizable=yes');
		w.focus();
		return true;
	} catch (e) {
		return false;
	}
}

function getHelpUrl(context, prefix, module)
{
	if (context === undefined) {
		context = GetContext();
	}
	if (prefix === undefined) {
		prefix = GetHelpPrefix();
	}
	if (module === undefined) {
		module = GetHelpModule();
	}

	if (module !== '') {
		prefix = '';
	}

	var url = '/help.php?context=' + escape(context);
	if (prefix !== '') {
		url += '&prefix=' + escape(prefix);
	}
	if (module !== '') {
		url += '&module=' + escape(module);
	}

	return url;
}

function GetContext()
{
	try {
		return top._context;
	} catch (e) {
		return false;
	}
}

function GetHelpPrefix()
{
	try {
		if (top._help_prefix == undefined)
			return '';
		else
			return top._help_prefix;
	} catch (e) {
		return false;
	}
}

function GetHelpModule()
{
	try {
		if (top._help_module == undefined)
			return '';
		else
			return top._help_module;
	} catch (e) {
		return false;
	}
}

/**
 * @deprecated
 */
function lon(target)
{
	return true;
}

/**
 * @deprecated
 */
function loff(target)
{
	return true;
}

function lsubmit(f)
{
	try {
		if (f.lock.value == "true")
			return false;
		f.lock.value = "true";
	} catch (e) {
	}

	lon();

	try {
		f.submit();
	} catch (e) {
		loff();
		f.lock.value = "false";
		return false;
	}
	return true;
}

function getParentNodeByName(o, name)
{
	var parent = o.parentNode;
	if (!parent)
		return false;
	if (parent.nodeName != name)
		return getParentNodeByName(parent, name);
	return parent;
}

function errorfield(o, status)
{
	var tr = getParentNodeByName(o, 'TR');
	if (!tr)
		return false;
	tr.className = status ? 'error' : '';
	return true;
}

function hasClass(element, className)
{
    var classes = element.className.split(' ');
    var len = classes.length;
	for (var i=0; i<len; i++) {
		if (classes[i] == className)
			return true;
	}
	return false;
}

function addClass(element, className)
{
	if (!hasClass(element, className))
		element.className = (element.className == '' ? className : element.className + ' ' + className);
}

function removeClass(element, className)
{
	var newValue = '';
    var classes = element.className.split(' ');
    var len = classes.length;
	for (var i=0; i<len; i++) {
		if (classes[i] != className)
			newValue += newValue.length ? ' ' + classes[i] : classes[i];
	}
	element.className = newValue;
}

function disableObjects(arr, value)
{
	var item;

	if (value == undefined)
		value = true;

    var len = arr.length;
	for (var k=0; k<len; k++) {
		item = document.getElementById(arr[k]);
		if (item) {
			item.disabled = value;
		}
	}
}

// global actions and behaviors
('undefined' !== typeof Jsw) && Jsw.onReady(function() {

    $$('textarea.js-auto-resize').each(function (element) {
        var resizeHandler = function () {
            var lines = element.value.split('\n').length;
            if (lines < originalSize) {
                element.rows = originalSize;
            } else {
                element.rows = lines + 2;
            }
        };

        var originalSize = element.rows;
        resizeHandler();

        if (!Prototype.Browser.IE) {
            // IE incorrectly displays textarea after programmatic change of number of rows
            element.observe('keyup', resizeHandler);
        }
    });

    // disable autofill for forms with disabled autocomplete fields (Chrome issue)
    $$('form input[autocomplete="off"]').each(function (element) {
        $(element).up('form').writeAttribute('autocomplete', 'off');
    });
});

// use POST method for links with data-method="post"
("undefined" !== typeof Jsw) && (function() {

    $(document).observe('click', function (event) {
        var element = event.findElement('a[data-method="post"]');
        if (element) {
            event.preventDefault();
            Jsw.redirectPost(element.href);
        }
    });

}());

// cross-site request forgery protection for legacy forms in 3d-party extensions
("undefined" !== typeof Prototype) && (function() {

    function appendForgeryProtection(form) {
        if (!form || (form.method && form.method.toUpperCase() === "GET") || form.forgery_protection_token) {
            return;
        }
        var forgeryToken = $('forgery_protection_token');
        if (!forgeryToken) {
            return;
        }
        form.appendChild(new Element('input', {
            'type': 'hidden',
            'name': 'forgery_protection_token',
            'value': forgeryToken.content
        }));
    }

    $(document).observe('submit', function (e) {
        var form = e.findElement('form');
        appendForgeryProtection(form);
    });

    HTMLFormElement.prototype.submit = HTMLFormElement.prototype.submit.wrap(function ($super) {
        appendForgeryProtection(this);
        return $super();
    });

    XMLHttpRequest.prototype.send = XMLHttpRequest.prototype.send.wrap(function ($super, data) {
        var forgeryToken = $('forgery_protection_token');
        if (forgeryToken) {
            this.setRequestHeader('X-Forgery-Protection-Token', forgeryToken.content);
        }
        return $super(data);
    });
}());

// resize iframe in case of embedding Plesk screens into other product, e.g. POA
// other product should contain resizePleskFrame function in the parent frame, but the function not called anymore
("undefined" !== typeof Prototype) && (function() {

    function updateFrameHeight() {
        var page = $('page');
        var height = page
            ? page.getHeight()
            : $('pageLayout').getHeight();
        setFrameHeight(height);
    }

    function setFrameHeight(height) {
        var frame = parent;
        frame.$('#pleskframe').height(height);
    }

    function setupResizeHandlers() {
        if (parent.resizePleskFrame) {  // detect that we're embedded
            setInterval(updateFrameHeight, 300);
            var wrapperBottomPadding = 50;
            var frame = parent;
            var height = frame.$(frame.document.body).height() - frame.$('#main').position().top - wrapperBottomPadding;
            setFrameHeight(height);
        }
    }

    try {
        setupResizeHandlers();
    } catch (e) {
        // foreign frame is inaccessible
    }

}());

(function() {
    var htmlTag = document.documentElement;
    if (-1 < navigator.userAgent.indexOf("MSIE 9")) {
        addClass(htmlTag, "ie9 lte9 lte10");
    } else if (-1 < navigator.userAgent.indexOf("MSIE 10")) {
        addClass(htmlTag, "ie10 lte10");
    }
}());

// testing mode support
("undefined" !== typeof Jsw) && Jsw.onReady(function() {
    if ('true' !== Jsw.Cookie.get('debug-testing-mode')) {
        return;
    }

    var bottomAnchor = $('bottomAnchor');
    if (bottomAnchor) {
        var date = new Date();
        bottomAnchor.innerHTML = date.getTime();
    }
});
