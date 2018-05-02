// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw
 * The Jsw namespace (global object) encapsulates all classes, singletons, and
 * utility methods provided by Jsw's library.
 * @singleton
 */
var Jsw = {

    version: '1.0',
    baseUrl: '',
    ctxIdName: '',
    ctxId: '',
    uiContext: $H(),

    _registeredComponents: {},
    _firedOnReady: false,
    _onReadyEvents: null,

    priority: {
        high: 'high',
        normal: 'normal',
        low: 'low'
    },

    isRtl: function() {
        return document.documentElement.dir === 'rtl';
    },

    registerComponent: function(identity, component) {
        Jsw._registeredComponents[identity] = component;
    },

    /**
     * Returns an component by identity.
     * @param {String} identity The identity of the component.
     * @returns {Object} The component, undefined if not found.
     */
    getComponent: function(identity) {
        return Jsw._registeredComponents[identity];
    },

    /**
     * Creates a new Component from the specified config object using the config object's
     * `componentType` to determine the class to instantiate.
     * @param {Object} config A configuration object for the Component you wish to create.
     * @returns {Jsw.Component} The newly instantiated Component.
     */
    createComponent: function (config) {
        if (!config.componentType || config instanceof Jsw.Component) {
            return config;
        }

        var cls = Jsw.namespace(config.componentType, false);
        if (!cls) {
            throw new Error("Unrecognized class name: " + config.componentType);
        }
        return new cls(config);
    },

    clearStatusMessages: function() {
        var contentElement = $('main');
        if (!contentElement) {
            return;
        }
        ['.msg-error', '.msg-info', '.msg-warning'].each(function(msgClass) {
            contentElement.select(msgClass).each(function(messageElement) {
                messageElement.remove();
            });
        });
    },

    addStatusMessage: function(type, message, params) {
        params = ('undefined' !== typeof params) ? params : {};

        var elementParams = { 'class': 'msg-box msg-'  + type };
        if (params['id']) {
            elementParams['id'] = params['id'];
        }

        if (params['title']) {
            message = '<b>' + params['title'] + ':</b> ' + message;
        }

        var statusElement = new Element('div', elementParams);
        statusElement.update(
            '<div><div><div><div><div>' +
            '<div class="msg-content">' + message + '</div>' +
            '</div></div></div></div></div>'
        );

        if (params['closable']) {
            var closeElement = new Element('span', { 'class': 'close' });
            closeElement.observe('click', params['onClose']);
            statusElement.down('.msg-content').insert({top: closeElement});
        }

        try {
            var target;
            if (params['renderTo']) {
                target = params['renderTo'];
            } else {
                target = 'main';
            }
            var mode = 'top';
            if (params['renderMode']) {
                mode = params['renderMode'];
            }
            var insertion = {};
            insertion[mode] = statusElement;

            $(target).insert(insertion);
        } catch (e) {
            alert(type + ' | ' + message);
        }
    },

    /**
     * Adds a listener to be notified when the document is ready (before onload and before images are loaded).
     * @param {String} [priority]
     * @param {Function} callback The method to call.
     */
    onReady: function(priority, callback) {
        if ('function' === typeof priority) {
            callback = priority;
            priority = Jsw.priority.normal;
        }

        if (Jsw._firedOnReady) {
            callback();
            return;
        }

        if (!Jsw._onReadyEvents) {
            Event.observe(window, 'load', Jsw._fireOnReady);
            Jsw._onReadyEvents = {};
        }

        if (!Jsw._onReadyEvents[priority]) {
            Jsw._onReadyEvents[priority] = [];
        }

        Jsw._onReadyEvents[priority].push(callback);
    },

    _fireOnReady: function() {
        var predefinedPriorities = [Jsw.priority.low, Jsw.priority.normal, Jsw.priority.high];
        Object.keys(Jsw._onReadyEvents).sort(function (a, b) {
            return predefinedPriorities.indexOf(b) - predefinedPriorities.indexOf(a);
        }).forEach(function (priority) {
            Jsw._onReadyEvents[priority].forEach(Function.prototype.call, Function.prototype.call);
        });

        Jsw._firedOnReady = true;
    },

    /**
     * Creates namespaces to be used for scoping variables and classes so that they are not global.
     * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
     *
     *     Jsw.namespace('Jsw.list');
     *
     * @param {String} ns
     * @param {Boolean} autoCreate=true
     * @return {Object} The object that is the namespace or class name.
     */
    namespace: function(ns, autoCreate) {
        autoCreate = Object.isUndefined(autoCreate) || autoCreate;
        var nsParts = ns.split('.');
        var root = window;

        for (var partIndex = 0; partIndex < nsParts.length; partIndex++) {
            if (Object.isUndefined(root[nsParts[partIndex]])) {
                if (autoCreate) {
                    root[nsParts[partIndex]] = {};
                } else {
                    return undefined;
                }
            }

            root = root[nsParts[partIndex]];
        }

        return root;
    },

    prepareUrl: function(url) {
        if ('undefined' === typeof url || null === url) {
            return null;
        }

        if (
                url.startsWith('/services/') ||
                url.startsWith('/server/spamassassin') ||
                url.startsWith('/server/mail_') ||
                url.startsWith('/plesk/') ||
                url.startsWith('/admin/') ||
                url.startsWith('/smb/') ||
                (Jsw.baseUrl !== '' && url.startsWith(Jsw.baseUrl + '/')) ||
                (!url.startsWith('/') && (url.substr(0, 2) !== '^/')) ||
                url.startsWith('/modules/')
        ) {
            return url;
        }
        if (url.substr(0, 2) === '^/') {
            return url.toString().substr(1);
        }

        return Jsw.baseUrl + url;
    },

    addUrlParams: function(url, params) {
        if ('string' === typeof params) {
            var splitUrl = url.split('?', 2);
            params = params.startsWith('/') || params.startsWith('?') ? params : '?' + params;
            var splitParams = params.split('?', 2);
            url = splitUrl[0].concat(splitParams[0]);
            params = Object.extend(
                (splitUrl[1] || '').toQueryParams(),
                (splitParams[1] || '').toQueryParams()
            );
        }

        if (Object.prototype.toString.call(params) === "[object Object]") {
            params = Object.keys(params).map(function (name) {
                if ('undefined' === typeof params[name]) {
                    return name;
                }
                return name + '=' + encodeURIComponent(params[name]);
            }).join('&');
        }

        if (!params) {
            return url;
        }
        return url + (url.include('?') ? '&' : '?') + params;
    },

    showInternalError: function(message) {
        Jsw.clearStatusMessages();
        Jsw.addStatusMessage('error', 'Internal error ;-P<pre>' + message.escapeHTML() + '</pre>');
    },

    /**
     * Helper for render components/elements/strings
     * @experimental Be careful with this method, its implementation is not yet complete.
     *
     * @param {Element} parentElement
     * @param {Jsw.Component|Element|Object|String} element
     * @param {String} [renderMode=bottom"] above|below|top|bottom|inner
     */
    render: function (parentElement, element, renderMode) {
        if (renderMode === 'inner') {
            parentElement.update('');
            renderMode = undefined;
        }

        if (Object.isArray(element)) {
            element.forEach(function (element) {
                Jsw.render(parentElement, element, renderMode);
            });
            return;
        }

        if (element instanceof Jsw.Component) {
            element.setRenderTarget(parentElement);
            if (renderMode) {
                element._renderMode = renderMode;
            }
            element.render();
            return;
        }

        if (Object.prototype.toString.call(element) === "[object Object]") {
            var attrs = Object.extend({}, element.attrs);
            var renderFn = Object.isFunction(attrs.onrender) ? attrs.onrender : Jsw.emptyFn;
            delete attrs.onrender;

            var events = {};
            Object.keys(attrs).forEach(function (attr) {
                if (Object.isFunction(attrs[attr]) && attr.indexOf("on") === 0) {
                    events[attr.slice(2)] = attrs[attr];
                    delete attrs[attr];
                }
            });

            var el = new Element(element.tag, attrs);
            Object.keys(events).forEach(function (eventName) {
                el.observe(eventName, events[eventName]);
            });

            Jsw.render(el, element.children);

            element = el;
            renderFn(element);
        }

        var insertion = {};
        insertion[renderMode || 'bottom'] = element;
        parentElement.insert(insertion);
    },

    /**
     * Helper for create elements
     * @experimental Be careful with this method, its implementation is not yet complete.
     *
     * @param {String} selector
     * @param {Object} [attrs]
     * @param {String[]|String...|Object[]|Object...} [children]
     * @returns {Object}
     */
    createElement: function (selector, attrs, children) {
        var args = [].slice.call(arguments);
        var hasAttrs = Object.prototype.toString.call(args[1]) === "[object Object]"
            && !("tag" in args[1])
            && !(args[1] instanceof Jsw.Component);
        var tag = 'div';
        var classes = [];
        var selectorRe = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g;
        var attrRe = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
        var match;
        attrs = hasAttrs ? args[1] : {};

        while (match = selectorRe.exec(selector)) {
            if (match[1] === "" && match[2]) {
                tag = match[2];
            } else if (match[1] === "#") {
                attrs.id = match[2];
            } else if (match[1] === ".") {
                classes.push(match[2]);
            } else if (match[3][0] === "[") {
                var pair = attrRe.exec(match[3]);
                attrs[pair[1]] = pair[3] || (pair[2] ? "" : true);
            }
        }

        if (Object.isString(attrs.class) && attrs.class !== '') {
            classes.push(attrs.class);
        }
        if (classes.length) {
            attrs.class = classes.join(' ');
        }

        children = args.slice(hasAttrs ? 2 : 1);
        if (children.length === 1 && Object.isArray(children[0])) {
            children = children[0];
        }

        return {
            tag: tag,
            attrs: attrs,
            children: children
        };
    },

    /**
     * Escape element attributes for html concatenation
     *
     * @param {String} value
     * @returns {String}
     */
    escapeAttribute: function(value) {
        return value.toString().escapeHTML().replace(/"/g,'&quot;');
    },

    emptyFn: function() {
    }
};

Jsw.keyCode = {
    ESC: 27,
    ENTER: 13,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
};

// Monkey patching Prototype for proper handling of session expiration
Ajax.PatchedRequest = Class.create(Ajax.Request, {
    initialize: function($super, url, options) {
        options = Object.extend({
            onException: function (transport, exception) {
                throw exception;
            },
            on400: function() {
                top.window.location.reload();
            },
            on500: function(transport) {
                Jsw.showInternalError(transport.responseText);
            },
            on0: function() {
                // do nothing in case of internal/network error
                return false;
            }
        }, options || {});

        $super(url, options);
    },
    abort: function() {
        this.transport.abort();
    }
});

Ajax.Request.prototype = Ajax.PatchedRequest.prototype;

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.BrowserFeatures
 * @singleton
 */
Jsw.BrowserFeatures = (function() {
    var style = document.documentElement.style;
    var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];

    function checkProp(prop) {
        if ('undefined' != typeof style[prop]) {
            return true;
        }

        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (var i = 0; i < domPrefixes.length; i++) {
            if ('undefined' != typeof style[domPrefixes[i] + prop]) {
                return true;
            }
        }

        return false;
    }

    return {
        /**
         * @property {Boolean} transition
         */
        transition: checkProp('transition')
    };
})();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Locale
 */
Jsw.Locale = Class.create({
    initialize: function (messages) {
        this.messages = messages || {};
    },

    /**
     * Get locale message by key.
     * @param {String} key
     * @param {Object} [params]
     * @returns {String}
     */
    lmsg: function (key, params) {
        var value =  this.messages[key];
        if ('undefined' === typeof value)  {
            return '[' + key + ']';
        }

        if ('undefined' === typeof params)  {
            return value;
        }

        Object.keys(params).forEach(function (paramKey) {
            value = value.replace('%%' + paramKey + '%%', params[paramKey]);
        });
        return value;
    }
});

Jsw.Locale.sections = {};

/**
 * Register new locale section
 * @param {String} name
 * @param {Object} [messages]
 * @static
 */
Jsw.Locale.addSection = function (name, messages) {
    this.sections[name] = new Jsw.Locale(messages);
};

/**
 * Returns registered locale section or created empty section
 * @param {String} name
 * @returns {Jsw.Locale}
 * @static
 */
Jsw.Locale.getSection = function (name) {
    if (!this.sections[name]) {
        this.sections[name] = new Jsw.Locale()
    }
    return this.sections[name];
};

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Component
 * The base class for all Jsw components.
 */
Jsw.Component = Class.create({

    _tag: 'div',

    /**
     * @cfg {String} id The unique id of this component instance.
     */
    /**
     * @cfg {String} cls CSS class names to apply for root element.
     */
    /**
     * @cfg {Object} attrs HTML attributes to apply for root element.
     */
    /**
     * @cfg {String} wrapperClass
     */
    /**
     * @cfg {Element|String} renderTo
     */
    /**
     * @cfg {String} renderMode=bottom
     */
    /**
     * @cfg {Element|String} applyTo
     */
    /**
     * @cfg {Object} locale
     */
    /**
     * @cfg {Boolean} hidden=false Hide component. See methods {@link #hide}/{@link #show}
     */

    initialize: function(config) {
        this._initConfiguration(config);
        this._registerComponent();

        this._initComponentElement();

        if (this._autoRender && ((null !== this._renderTarget) || (null !== $(this._applyTargetId)))) {
            this.render();
        }

        if (this._getConfigParam('hidden', false)) {
            this.hide();
        }
    },

    _initConfiguration: function(config) {
        this.initialConfig = config;
        this._config = this.initialConfig;

        this._cls = this._getConfigParam('cls', '');
        this._attrs = this._getConfigParam('attrs', {});
        this._wrapperClass = this._getConfigParam('wrapperClass', '');
        this._autoRender = this._getConfigParam('autoRender', true);
        this._renderTarget = $(this._getConfigParam('renderTo', null));
        this._renderMode = this._getConfigParam('renderMode', 'bottom');
        this._applyTargetId = this._getConfigParam('applyTo', null);
        this.setLocale(this._getConfigParam('locale'));

        this._id = (this._applyTargetId)
            ? this._applyTargetId
            : this._getConfigParam('id', null);

        if (null === this._id) {
            this._id = this._getRandomId();
            this._idIsRandom = true;
        }

        this._tag = (this._applyTargetId)
            ? $(this._applyTargetId).tagName
            : this._getConfigParam('tag', this._tag);
    },

    _registerComponent: function() {
        Jsw.registerComponent(this._id, this);
    },

    _initComponentElement: function() {
        if (this._applyTargetId) {
            this._componentElement = $(this._applyTargetId);
            return ;
        }

        var attrs = Object.extend(this._attrs, {
            'id': this._id,
            'class': this._cls
        });

        this._componentElement = new Element(this._tag, attrs);
    },

    _initDisablerOverlay: function() {
        this._disablerOverlay = new Element('div');

        this._disablerOverlay.setStyle({
            display: 'none',
            zIndex: this._componentElement.style.zIndex + 1000
        });

        this._disablerOverlay.addClassName('content-blocker');
        this._componentElement.appendChild(this._disablerOverlay);
    },

    addEventObserver: function(eventName, handler) {
        if ('undefined' !== typeof handler) {
            this._componentElement.observe(eventName, handler);
        }
    },

    removeEventObserver: function(eventName, handler) {
        if ('undefined' !== typeof handler) {
            this._componentElement.stopObserving(eventName, handler);
        }
    },

    _hasConfigParam: function(name) {
        return 'undefined' !== typeof this._config[name];
    },

    _getConfigParam: function(name, defaultValue) {
        return this._hasConfigParam(name)
            ? this._config[name]
            : defaultValue;
    },

    _getRandomId: function() {
        var id = 'gen-id-' + this._getRandomNumber();

        while (null !== $(id)) {
            id = 'gen-id-' + this._getRandomNumber();
        }

        return id;
    },

    _getRandomNumber: function() {
        return Math.floor(1000000 * Math.random());
    },

    _addEvents: function() {
    },

    _addTooltips: function() {
        var description = this._getConfigParam('description');
        if  (description) {
            this._tooltip = Jsw.Tooltip.init(this._componentElement, {text: description});
        }
    },

    _updateComponentElement: function(content) {
        if (this._componentElement.empty()) {
            this._componentElement.update(content);
            return ;
        }

        var oldElements = this._componentElement.childElements();

        Element.insert(this._componentElement.firstChild, {before: content});

        oldElements.each(function(oldElement) {
            if ('undefined' === typeof oldElement.id || '' == oldElement.id) {
                return ;
            }

            var newElement = this._componentElement.select('#' + oldElement.id).first();

            if (newElement) {
                newElement.replace(oldElement);
            }
        }, this);
    },

    /**
     * See {@link Jsw.Component}.{@link Jsw.Component#wrapperClass wrapperClass} for details.
     * @returns {String}
     */
    getWrapperClass: function() {
        return this._wrapperClass;
    },

    /**
     * Returns id of this component instance.
     * @returns {String}
     */
    getId: function() {
        return this._id;
    },

    /**
     * Set render target element.
     * @param {Element} target
     */
    setRenderTarget: function(target) {
        this._renderTarget = target;
    },

    /**
     * Get render target element.
     * @returns {Element}
     */
    getRenderTarget: function() {
        return this._renderTarget;
    },

    /**
     * Show component.
     */
    show: function() {
        this._componentElement.show();
    },

    /**
     * Hide component.
     */
    hide: function() {
        this._componentElement.hide();
    },

    /**
     * Render component.
     */
    render: function() {
        if (this._renderTarget) {
            Jsw.render(this._renderTarget, this._componentElement, this._renderMode);
        }

        this._addEvents();
        this._addTooltips();
    },

    setLocale: function (locale) {
        if (!(locale instanceof Jsw.Locale)) {
            locale = new Jsw.Locale(locale);
        }
        this.lmsg = locale.lmsg.bind(locale);
        this._locale = locale;
    },

    getLocale: function () {
        return this._locale;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Hint
 * @extends Jsw.Component
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Hint({
 *         renderTo: document.body,
 *         hint: 'This is where you manage accounts of your hosting service customers: ' +
 *             'create accounts along with service subscriptions, manage existing customers, ' +
 *             'and remove accounts. To administer websites, mail or any other services provided ' +
 *             'to a customer, go to their Customer Panel by clicking the link in the right column of the list.',
 *         expandable: true
 *     });
 */
Jsw.Hint = Class.create(Jsw.Component, {
    _tag: 'p',

    /**
     * @cfg {String} hint
     */
    /**
     * @cfg {Boolean} [expandable=false]
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', '');
    },

    _initComponentElement: function($super) {
        $super();

        this.setHint(
            this._getConfigParam('hint', '')
        );

        if (this._getConfigParam('expandable', false)) {
            var contentElement = this._componentElement;
            var componentElement = new Element('div', {'class': 'screen-description'});
            var wrapElement = new Element('div', {'class': 'screen-description-wrap'});
            var btnShowMore = new Element('span', {'class': 'screen-description-control'});
            btnShowMore.observe('click', function() { this.up('.screen-description').addClassName('expanded'); });
            wrapElement.insert(contentElement);
            wrapElement.insert(btnShowMore);
            this._componentElement = componentElement.update(wrapElement);
            this._screenControl = function() {
                if (componentElement.getWidth() > wrapElement.getWidth()) {
                    btnShowMore.addClassName('off');
                } else {
                    btnShowMore.removeClassName('off');
                }
            };
        }
    },

    _addEvents: function($super) {
        $super();

        if (this._screenControl) {
            Event.observe(window, 'resize', this._screenControl);
            this._screenControl();
        }
    },

    /**
     * Update hint text.
     * @param {String} hint
     */
    setHint: function(hint) {
        this._componentElement.update(hint);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Button
 * @extends Jsw.Component
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Button({
 *         renderTo: document.body,
 *         title: 'Add a Customer',
 *         cls: 's-btn sb-add-new-customer',
 *         isNew: true,
 *         newTitle: 'New',
 *         handler: function () {
 *             alert('You clicked the button!');
 *         }
 *     });
 */
Jsw.Button = Class.create(Jsw.Component, {

    _tag: 'a',

    /**
     * @cfg {String} title=""
     */
    /**
     * @cfg {String|Function} handler
     */
    /**
     * @cfg {String} href
     */
    /**
     * @cfg {String} target
     */
    /**
     * @cfg {String} disabledClass=btn-disabled
     */
    /**
     * @cfg {Boolean} isNew=false
     */
    /**
     * @cfg {String} newTitle=""
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._handler = this._getConfigParam('handler', false);
        if (Object.isString(this._handler)) {
            eval('this._handler = ' + this._handler);
        }
        this._title = this._getConfigParam('title', '');
        this._cls = this._getConfigParam('cls', 'b-btn' + (!this._title ? ' btn-icon-only' : ''));
        this._disabledClass = this._getConfigParam('disabledClass', 'btn-disabled');
        this._isNew = this._getConfigParam('isNew', false);
        this._newTitle = this._getConfigParam('newTitle', '');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.update(
            '<i><i><i><span>'
            + this._title
            + (this._isNew ? ' <span class="badge-new">' + this._newTitle + '</span>' : '')
            + '</span></i></i></i>'
        );

        this._initVisibility();
    },

    _initVisibility: function() {
        this._disabled = this._getConfigParam('disabled', false);

        if (this._disabled) {
            this._disabled = false;
            this.disable();
        } else {
            this._disabled = true;
            this.enable();
        }
    },

    _addAttribute: function(name, value) {
        if ('undefined' != typeof value) {
            this._componentElement.writeAttribute(name, value);
        }
    },

    setTooltip : function(tooltipText) {
        if (this._tooltip) {
            this._tooltip.setText(tooltipText);
        } else {
            this._tooltip = Jsw.Tooltip.init(this._componentElement, {text: tooltipText});
        }
    },

    enable: function() {
        if (!this._disabled) {
            return ;
        }
        this._disabled = false;

        var classNames = this._config['addCls'] || '';
        if (!Object.isArray(classNames)) {
            classNames = [classNames];
        }
        classNames.each(function(item) {
            this._componentElement.addClassName(item);
        }, this);
        classNames.each(function(item) {
            this._componentElement.removeClassName(item + '-disabled');
        }, this);
        this._componentElement.removeClassName(this._disabledClass);

        this._addAttribute('href', Jsw.prepareUrl(this._getConfigParam('href', 'javascript:;')));
        this._addAttribute('target', this._getConfigParam('target', null));

        this._addProgressHandler();
        if (this._handler) {
            this.addEventObserver('click', this._handler);
        }
    },

    disable: function() {
        if (this._disabled) {
            return ;
        }
        this._disabled = true;

        this._componentElement.addClassName(this._disabledClass);

        var classNames = this._config['addCls'];
        if (!Object.isArray(classNames)) {
            classNames = [classNames];
        }
        classNames.each(function(item) {
            this._componentElement.addClassName(item + '-disabled');
        }, this);
        classNames.each(function(item) {
            this._componentElement.removeClassName(item);
        }, this);
        this._componentElement.writeAttribute('href', null);
        this._componentElement.writeAttribute('target', null);

        if (this._handler) {
            this.removeEventObserver('click', this._handler);
        }
    },

    _addProgressHandler: function() {
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.SmallButton
 * @extends Jsw.Button
 */
Jsw.SmallButton = Class.create(Jsw.Button, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = this._getConfigParam('cls', 's-btn' + (!this._title ? ' btn-icon-only' : ''));
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.BigButton
 * @extends Jsw.Button
 */
Jsw.BigButton = Class.create(Jsw.Button, {

    _initConfiguration: function($super, config) {
        config = Object.extend({
            cls: 'tool-block',
            disabledClass: 'tool-block-disabled'
        }, config || {});
        $super(config);
    },

    _initComponentElement: function($super) {
        $super();

        var button = '';
        if (this._getConfigParam('title')) {
            button += '<span class="tool-name">' + this._getConfigParam('title').escapeHTML() + '</span>';
        }

        var description = '';
        if (Object.isArray(this._getConfigParam('additionalComments'))) {
            this._getConfigParam('additionalComments').each(function(comment) {
                description += comment.escapeHTML() + '<br/>';
            });
            description = '<span>' + description + '</span>';
        }
        if (this._getConfigParam('comment')) {
            description += this._getConfigParam('comment').escapeHTML();
        }
        if (description.length) {
            button += '<span class="tool-info">' + description + '</span>';
        }
        if (this._getConfigParam('icon')) {
            button = '<span class="tool-icon">' +
                '<img src="' + this._getConfigParam('icon') + '">' +
                '</span>' + button;
        }
        this._componentElement.update(button);

        this._initVisibility();
    },

    _addProgressHandler: function() {
        if (this._getConfigParam('indicateProgress', false)) {
            this.addEventObserver('click', function() {
                this._componentElement.up().update('<div class="ajax-loading">' + this._config['waitMessage'] + '</div>');
            }.bind(this));
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.SplitButton
 * @extends Jsw.Component
 */
Jsw.SplitButton = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        config = Object.extend({
            "cls": "btn-group"
        }, config || {});
        $super(config);

        this.title = this._getConfigParam("title", "");
        this.isAction = this._getConfigParam("isAction", false);
        this.isDefault = this._getConfigParam("isDefault", false);
        this.isMenuFlip = this._getConfigParam("isMenuFlip", false);
        this.onclick = this._getConfigParam("onclick", Jsw.emptyFn);
        this.items = this._getConfigParam("items", []);
        this.isScrollable = this._getConfigParam("isScrollable");
    },

    _initComponentElement: function($super) {
        $super();

        Jsw.render(this._componentElement, [
            Jsw.createElement("button.btn" + (this.isAction ? ".btn-primary" : ""), {
                    "type": this.isDefault ? "submit" : "button",
                    "onclick": this.onclick
                },
                this.title.escapeHTML()
            ),
            Jsw.createElement("button.btn.dropdown-toggle", {
                    "type": "button",
                    "onclick": this.openDropdown.bind(this)
                },
                Jsw.createElement("em.caret")
            ),
            Jsw.createElement("ul.dropdown-menu" +
                (this.isMenuFlip ? ".dropdown-menu-flip" : "") + (this.isScrollable ? ".dropdown-scrollable" : ""))
        ]);

        if (Object.isArray(this.items)) {
            this._initItems();
        }
    },

    _initItems: function () {
        this.items.each(function (item) {
            var link = new Element('a', {
                'id': item.id || null,
                'href': item.href || null,
                'target': item.newWindow ? '_blank' : null
            }).update(item.title.escapeHTML());

            var listItem = new Element('li', {
                'class': (item.submenu ? 'dropdown-submenu' : '') + (this.isMenuFlip ? ' to-left' : '')
            }).insert(link);

            if (item.submenu) {
                listItem.insert('<ul class="dropdown-menu"></ul>');
            }

            this._componentElement.down('.dropdown-menu').insert(listItem);

            link.observe('click', item.onclick || Jsw.emptyFn);

            if (item.tooltip) {
                Jsw.Tooltip.init(link, {text: item.tooltip.escapeHTML()});
            }
        }, this);
    },

    _addTooltips: function() {
        var description = this._getConfigParam('description');
        if (description) {
            this._tooltip = Jsw.Tooltip.init(this._componentElement.down('button'), {text: description});
        }
    },

    openDropdown: function (event) {
        Event.stop(event);

        if (Object.isFunction(this.items)) {
            var dropdownMenu = this._componentElement.down('.dropdown-menu');
            dropdownMenu.update('<div class="ajax-loading">' + this.lmsg('loading') + '</div>');

            var items = this.items;
            this.items = [];

            items().then(function (items) {
                dropdownMenu.update('');
                this.items = items;
                this._initItems();
            }.bind(this));
        }

        if (!this._componentElement.hasClassName('open')) {
            $$('.btn-group').each(function(item){
                item.removeClassName('open');
            });
        }
        this._componentElement.toggleClassName('open');
    },

    _addEvents: function() {
        var context = this;

        var openSubmenu = function (menuItem) {
            var submenu = menuItem.select('.dropdown-menu').first();
            if (!menuItem.hasClassName('open') && 'undefined' != typeof submenu && submenu.empty()) {
                context.items.last().submenu ? context.items.last().submenu(menuItem.down('a').next('ul')) : '';
            }
            closeSubmenu(menuItem);
            menuItem.addClassName('open');
            clearTimeout(menuItem._menuTimeout);
        };

        var closeSubmenu = function (menuItem) {
            menuItem.removeClassName('open');
            clearTimeout(menuItem._menuTimeout);
        };

        this._componentElement.select('.dropdown-menu > li').invoke('observe', 'mouseover', function(){
            if (this.hasClassName('dropdown-submenu open')) {
                return;
            }
            this.siblings('.dropdown-submenu.open').each(function(menuItem) {
                closeSubmenu(menuItem);
            });
        });

        var submenu = this._componentElement.select('.dropdown-submenu');
        submenu.invoke('observe', 'mouseover', function(e){
            openSubmenu(this);
        });
        submenu.each(function(item){
            item.down('a').observe('touchend', function(e){
                if (item.hasClassName('open')) {
                    closeSubmenu(item);
                } else {
                    openSubmenu(item);
                }
            }).observe('click', function(e){
                Event.stop(e);
            });
        });

        this._componentElement.select('.dropdown-submenu').invoke('observe', 'mouseleave', function(){
            var menuItem = this;
            clearTimeout(menuItem._menuTimeout);
            menuItem._menuTimeout = setTimeout(function() {
                closeSubmenu(menuItem);
            }, 500);
        });

        $(document.body).observe('click', function() {
            this._componentElement.removeClassName('open');
        }.bind(this));
    },

    disable: function() {
        this._componentElement.down("button").disable().addClassName("disabled");
        this._componentElement.down(".dropdown-toggle").disable().addClassName("disabled");
        if (Jsw.Tooltip.current === this._tooltip) {
            Jsw.Tooltip.hide();
        }
    },

    enable: function() {
        this._componentElement.down("button").enable().removeClassName("disabled");
        this._componentElement.down(".dropdown-toggle").enable().removeClassName("disabled");
    },

    setText: function(text) {
        this._componentElement.down("button").update(text);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * Submit form.
 * @param {Element|String} element Form element or form child element or it id.
 * @param {Boolean} [noRedirect]
 * @member Jsw
 */
Jsw.submit = function(element, noRedirect) {
    element = $(element);
    if (element.tagName.toLowerCase() != 'form') {
        element = element.up("form");
    }
    element.noRedirect = noRedirect;
    element.submit();
};

/**
 * Go to url with get method.
 * @param {String|Object} action
 * @param {Object} [data]
 * @param {String} [target]
 * @member Jsw
 */
Jsw.redirect = function(action, data, target) {
    var url = action;
    var method = 'get';
    if (Object.prototype.toString.call(action) === "[object Object]") {
        method = action.method || method;
        data = action.data;
        target = action.target;
        url = action.url;
    }
    if (/^javascript:/i.test(url)) {
        throw new Error("The redirect to this url can not be performed: " + url);
    }
    url = Jsw.prepareUrl(url);
    method = method.toLowerCase();
    if ('post' === method || data || target) {
        Jsw.FormRedirect.redirect(url, method, data, target);
    } else {
        $(document).location.href = url;
    }
};

/**
 * Go to url with post method.
 * @param {String} action
 * @param {Object} [data]
 * @param {String} [target]
 * @member Jsw
 */
Jsw.redirectPost = function(action, data, target) {
    Jsw.FormRedirect.redirect(Jsw.prepareUrl(action), 'post', data, target);
};

/**
 * @class Jsw.FormRedirect
 * @singleton
 */
Jsw.FormRedirect = {
    /**
     * @param {String} action
     * @param {String} method
     * @param {Object} [data]
     * @param {String} [target]
     */
    redirect: function(action, method, data, target) {

    // workaround for http://code.google.com/p/chromium/issues/detail?id=10671
    var randomId = Math.floor(1000000*Math.random());
    action = Jsw.addUrlParams(action, '_randomId=' + randomId);

        var form = new Element(
            'form',
            {
                method: method,
                action: action
            }
        );
        if (target) {
            form.target = target;
        }
        if (data) {
            var elements = Jsw.FormRedirect.subToElements(data);
            $A(elements).each(function (element) {
                form.insert(element);
            });
        }

        if ($('forgery_protection_token')) {
            form.insert(new Element('input', {
                type: 'hidden',
                name: 'forgery_protection_token',
                value: $('forgery_protection_token').content
            }));
        }

        $(document.body).insert(form);
        form.submit();
    },

    /**
     * @param {String} value
     * @param {String} prefix
     * @returns {Element[]}
     */
    stringToElements: function(value, prefix)
    {
        return [new Element('input', {
            type: 'hidden',
            name: prefix,
            value: value
        })];
    },

    /**
     * @param {Boolean} value
     * @param {String} prefix
     * @returns {Element[]}
     */
    booleanToElements: function(value, prefix)
    {
        return [new Element('input', {
            type: 'hidden',
            name: prefix,
            value: value ? 1 : 0
        })];
    },

    /**
     * @param {Array} data
     * @param {String} prefix
     * @returns {Element[]}
     */
    arrayToElements: function(data, prefix)
    {
        var elements = [];
        $A(data).each(function(item) {
            elements = elements.concat(Jsw.FormRedirect.subToElements(item, '', prefix));
        });
        return elements;
    },

    /**
     * @param {Object} data
     * @param {String} prefix
     * @returns {Element[]}
     */
    hashToElements: function(data, prefix)
    {
        var elements = [];
        $H(data).each(function(pair) {
            elements = elements.concat(Jsw.FormRedirect.subToElements(pair.value, pair.key, prefix));
        });
        return elements;
    },

    /**
     * @param {String} value
     * @param {String} key
     * @param {String} prefix
     * @returns {Element[]}
     */
    subToElements: function(value, key, prefix)
    {
        var elements = [];
        var name = prefix
            ? prefix + '[' + key + ']'
            : key;
        if (Object.isString(value) || Object.isNumber(value)) {
            elements = elements.concat(Jsw.FormRedirect.stringToElements(value, name));
        } else
        if ('boolean' == typeof value) {
            elements = elements.concat(Jsw.FormRedirect.booleanToElements(value, name));
        } else
        if(Object.isArray(value)) {
            elements = elements.concat(Jsw.FormRedirect.arrayToElements(value, name));
        } else {
            elements = elements.concat(Jsw.FormRedirect.hashToElements(value, name));
        }
        return elements;
    }
};

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.CommandButton
 * @extends Jsw.Component
 */
Jsw.CommandButton = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._handler = this._getConfigParam('handler', false);
        if (Object.isString(this._handler)) {
            eval('this._handler = ' + this._handler);
        }

        this._value = this._config['value'] || ''
        this._tabIndex = this._getConfigParam('tabIndex', null);
    },

    _initComponentElement: function($super) {
        $super();

        var buttonElement = new Element('button', {
            type: 'button',
            value: this._value,
            name: this._config['name']
        }).update(this._config['title']);

        if (null != this._tabIndex) {
            buttonElement.writeAttribute('tabindex', this._tabIndex);
        }

        this._updateComponentElement(buttonElement);

        this._initVisibility();
    },

    _initVisibility: function() {
        this._disabled = this._getConfigParam('disabled', false);

        if (this._disabled) {
            this._disabled = false;
            this.disable();
        } else {
            this._disabled = true;
            this.enable();
        }
    },

    enable: function() {
        if (!this._disabled) {
            return ;
        }

        this._disabled = false;
        if ('send' == this._config['name'] || 'apply' == this._config['name']) {
            this._componentElement.addClassName('action');
        }
        this._componentElement.removeClassName('disabled');
        this._componentElement.disabled = false;
        if (this._handler) {
            this.addEventObserver('click', this._handler);
        }
    },

    disable: function() {
        if (this._disabled) {
            return ;
        }

        this._disabled = true;
        this._componentElement.disabled = true;
        if ('send' == this._config['name'] || 'apply' == this._config['name']) {
            this._componentElement.removeClassName('action');
        }
        this._componentElement.addClassName('disabled');
        if (this._handler) {
            this.removeEventObserver('click', this._handler);
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.form');

/**
 * @class Jsw.form.DisplayField
 * @extends Jsw.Component
 */
Jsw.form.DisplayField = Class.create(Jsw.Component, {
    _tag: 'div',

    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', 'form-row');
        this._valueRenderer = this._getConfigParam('valueRenderer', null);
    },

    _initComponentElement: function($super) {
        $super();

        var values = ('function' == typeof this._valueRenderer)
            ? this._valueRenderer()
            : this._getConfigParam('value', '');

        values = (typeof values == 'string') ? [values] : values;

        var valuesElements = '';
        values.each(function(value) {
            valuesElements += '<div class="text-value">' + value + '</div>';
        });

        if (this._getConfigParam('singleRow', false)) {
            if (1 == values.length) {
                valuesElements = values.valueOf();
            }
            this._componentElement.update('<div class="single-row">' + valuesElements + '</div>');
        } else {
            this._componentElement.update(
                '<div class="field-name">' + this._getConfigParam('fieldLabel', '') + '</div>' +
                '<div class="field-value">' + valuesElements + '</div>'
            );
        }
    }
});

/**
 * @class Jsw.form.Values
 */
Jsw.form.Values = new Class.create({
    /**
     * @cfg {String} selector CSS selector
     */

    initialize: function(config) {
        this.selector = config.selector;
        this.formValues = {};
        $$(this.selector).each(function(input){
            this.formValues[this._getStorageName(input)] = input.getValue();
        }, this);
    },

    /**
     * @returns {Boolean}
     */
    isChanged: function() {
        var changed = false;
        $$(this.selector).each(function(input){
            if (this.formValues[this._getStorageName(input)] != input.getValue()) {
                changed = true;
            }
        }, this);
        return changed;
    },

    _getStorageName: function(input) {
        return input.getAttribute('type') + '/' + input.getAttribute('name');
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.FormAjax
 * @extends Jsw.Component
 */
Jsw.FormAjax = Class.create(Jsw.Component, {
    _actionButtonTitle: '',

    _initConfiguration: function($super, config) {
        $super(config);
        this._sendButtonId = this._getConfigParam('sendButtonId', 'btn-send');
        this._applyButtonId = this._getConfigParam('applyButtonId', 'btn-apply');
        this._cancelButtonId = this._getConfigParam('cancelButtonId', 'btn-cancel');
        this._submitHandler = this._getConfigParam('submitHandler', function() { return true; });
    },

    disable: function() {
        [this._sendButtonId, this._applyButtonId, this._cancelButtonId].each(function(buttonId){
            this._toggleButton(buttonId, true);
        }, this);

        var actionButton = this._getActionButton();
        if (actionButton) {
            this._actionButtonTitle = actionButton.innerHTML;
            actionButton.update('<span class="wait">' + this._config['waitButtonTitle'] + '</span>');
        }
    },

    enable: function() {
        [this._sendButtonId, this._applyButtonId, this._cancelButtonId].each(function(buttonId){
            this._toggleButton(buttonId, false);
        }, this);

        var actionButton = this._getActionButton();
        if (actionButton) {
            actionButton.update(this._actionButtonTitle);
        }
    },

    _toggleButton: function(buttonId, disable) {
        var buttonWrapper = $(buttonId);
        if (buttonWrapper) {
            buttonWrapper.down('button').disabled = disable;
            disable ? buttonWrapper.addClassName('disabled') : buttonWrapper.removeClassName('disabled');
        }
    },

    _getActionButton: function() {
        var actionButtonWrapper = $(this._componentElement.noRedirect ? this._applyButtonId : this._sendButtonId);
        if (actionButtonWrapper) {
            return actionButtonWrapper.down('button');
        }

        return null;
    },

    _initComponentElement: function() {
        this._componentElement = $(this._id);
        this._initDisablerOverlay();

        var firstElement = this._componentElement.findFirstElement();

        if ('undefined' !== typeof firstElement) {
            try {
                firstElement.focus();
            } catch (e) {}
        }

        this._submitInProgress = false;
    },

    _addEvents: function() {
        this._componentElement._formSubmit = this._componentElement.submit;
        this._componentElement.submit = this._onSubmit.bind(this);
        this._componentElement.observe('submit', this._onSubmitEvent.bind(this));
        this._addChoiceRadioButtonsOnClickEvent();
    },

    _addChoiceRadioButtonsOnClickEvent: function() {
        $$('input[type="radio"]').each(function(element) {
            if (!element.up('div.choice-block')) {
                return;
            }
            element.observe('click', function() {
                element.up('div.choice-block').select('span').each(function(element) {
                    element.removeClassName('selected');

                    if ('0' === element.value) {
                        element.removeClassName('no');
                    }
                });

                element.up('span').addClassName('selected');

                if ('0' === element.value) {
                    element.up('span').addClassName('no');
                }
            });
        });
    },

    _onSubmitEvent: function(event) {
        this._onSubmit();
        Event.stop(event);
        return false;
    },

    _onSubmit: function() {
        if (false === this._submitHandler()) {
            return false;
        }

        if (this._submitInProgress) {
            return false;
        } else {
            this._submitInProgress = true;
        }

        this.disable();

        if (this._componentElement.enctype === "multipart/form-data") {
            this._componentElement._formSubmit();
            return true;
        }

        var actionUrl = this._componentElement.getAttribute('action');

        if (!actionUrl) {
            actionUrl = $(document).location.href;
        }

        // remove hash symbol (and the following) cause this will encoded and lead to problems
        actionUrl = actionUrl.replace(/#.*$/, "");

        var params = this._componentElement.serialize();
        new Ajax.Request(actionUrl, {
            method:'post',
            parameters: params,
            onSuccess: this._onSuccess.bind(this),
            onFailure: this._onFailure.bind(this)
        });
        return true;
    },

    _onFailure: function(req) {
        this._submitInProgress = false;
        this._clearMessages();

        if (504 === req.status) {
            Jsw.addStatusMessage('error', this._config['timeoutMessage']);
        } else {
            Jsw.showInternalError(req.responseText);
        }

        this.enable();
    },

    _onSuccess: function(req) {
        this._submitInProgress = false;
        Jsw.clearStatusMessages();

        try {
            var response = req.responseText.evalJSON();
            this._processForm(response);
        } catch (e) {
            this._clearMessages();
            this.enable();

            // show error, if request wasn't aborted by user
            if (0 != req.status) {
                Jsw.showInternalError(req.responseText);
            }
        }
    },

    _processForm: function(response) {
        if (response.componentType === 'Jsw.Task.ProgressBar.Item') {
            Jsw.getComponent('asyncProgressBarWrapper').progressDialog(response);
            return;
        }

        if (response.redirect) {
            this._processResponseRedirect(response);
            return;
        }

        this._clearMessages();
        this._processResponseStatus(response.status);
        this._processResponseStatusMessages(response.statusMessages);
        this._processResponseFormMessages(response.formMessages);

        if (this._hasFieldErrors) {
            this._showFieldErrorArea();
        }
        this.enable();
    },

    _showFieldErrorArea: function() {
        var errorsElements = this._componentElement.select('.field-errors');
        var firstError = null;

        errorsElements.each(function(errorElement) {
            if (errorElement.visible()) {
                firstError = errorElement;
            }
        });

        var hiddenContainerId = null;

        firstError.ancestors().each(function(element) {
            if (!element.visible()) {
                hiddenContainerId = element.id;
            }
        });

        if (!hiddenContainerId) {
            return ;
        }

        // in case of tabbed form we must switch to corresponding tab
        var tabsBar = Jsw.getComponent('form-tab-buttons');

        if (tabsBar) {
            tabsBar.switchTab(hiddenContainerId);
        }
    },

    _processResponseStatus: function (status) {
        if ('success' !== status) {
            this._hasErrors = true;
        }
    },

    _clearMessages: function() {
        //clear field messages
        try {
            this._componentElement.select('.field-errors').each(function(errors){
                errors.hide();
                var rowElement = errors.up('.form-row');
                if (rowElement) {
                    rowElement.removeClassName('error');
                }
                errors.select('.error-hint').each(function(error) {
                    error.remove();
                });
            });
        } catch (e) {
        }

        this._hasErrors = false;
        this._hasFieldErrors = false;
    },

    _processResponseStatusMessages: function (messages) {
        $A(messages).each(function(value) {
            this._addFormMessage(value.status, value.content, value.title);
        }, this);
    },

    _processResponseFormMessages: function (messages) {
        this._processFieldMessages(messages, []);
    },

    _addFieldMessage: function(errors, message) {
        errors.up('.form-row').addClassName('error');
        errors.insert({bottom: '<span class="error-hint">' + message.escapeHTML() + '</span>' });
        errors.show();
    },

    _processFieldMessage: function(prefix, name, message) {
        var fieldErrors;
        var formElement = this._componentElement.down('#' + prefix.join('-'));
        fieldErrors = formElement ? formElement.next('.field-errors') : null;
        if (!fieldErrors) {
            fieldErrors = formElement ? formElement.up('.form-row').down('.field-errors') : null;
        }
        if (!fieldErrors) {
            fieldErrors = this._componentElement.down('#' + prefix.join('-') + '-form-row').select('.field-errors').last();
        }
        this._addFieldMessage(fieldErrors, message);
        this._hasFieldErrors = true;
    },

    _processFieldMessages: function(messages, prefix) {
        if (Object.isArray(messages)) {
            $A(messages).each(function(message) {
                if (Object.isString(message)) {
                    this._processFieldMessage(prefix, 'error', message);
                } else {
                    prefix.push(name);
                    this._processFieldMessages(message, prefix);
                    prefix.pop();
                }
            }, this);
        } else {
            $H(messages).each(function(pair) {
                if (Object.isString(pair.value)) {
                    this._processFieldMessage(prefix, pair.key, pair.value);
                } else {
                    prefix.push(pair.key);
                    this._processFieldMessages(pair.value, prefix);
                    prefix.pop();
                }
            }, this);
        }
    },

    _addFormMessage: function (type, message, title) {
        Jsw.addStatusMessage(type, message, { 'title': title });
    },

    _processResponseRedirect: function (response) {
        if (this._componentElement.noRedirect) {
            document.location.reload();
        } else if (response.postData) {
            Jsw.redirectPost(response.redirect, response.postData, response.target);
        } else {
            Jsw.redirect(response.redirect, null, response.target);
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Container
 * @extends Jsw.Component
 */
Jsw.Container = Class.create(Jsw.Component, {

    /**
     * @cfg {Array} items
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._contentAreaId = this._id;

        this._initItems();
    },

    _initItems: function(items) {
        items = items || this._getConfigParam('items') || [];

        this._items = items.filter(function (item) {
            return !!item;
        }).map(Jsw.createComponent);
    },

    _renderItems: function() {
        this._items.forEach(this._renderItem, this);
    },

    _renderItem: function(item) {
        Jsw.render($(this._contentAreaId), item);
    },

    render: function($super) {
        $super();

        this._renderItems();
    },

    getItems: function() {
        return this._items;
    },

    getItem: function (id) {
        return this.getItems().find(function (item) {
            return item.getId() === id;
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ListContainer
 * @extends Jsw.Container
 */
Jsw.ListContainer = Class.create(Jsw.Container, {

    _tag: 'ul',

    _renderItem: function(item) {
        var renderTargetId = null;
        var isEmptyItem = Object.isArray(item) && !item.size();

        if (!isEmptyItem) {
            renderTargetId = this._id + '-item-' + item.getId();
        }

        var cls = this._getConfigParam('itemClass', '');

        if (this._getConfigParam('renderLastItemClass', '') && this._items.last() == item) {
            cls = 'last';
        }

        if (isEmptyItem) {
            cls += ' ' + this._getConfigParam('emptyItemClass', '');
        }

        if (cls) {
            cls = ' class="' + cls + '"';
        }

        $(this._contentAreaId).insert('<li ' + (renderTargetId ? 'id="' + renderTargetId + '"' : '') + cls + '></li>');

        if (!isEmptyItem) {
            Jsw.render($(renderTargetId), item);
        }
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.layout');

/**
 * @class Jsw.layout.TwoColumns
 * @extends Jsw.Container
 */
Jsw.layout.TwoColumns = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', 'two-cols-block clearfix');
        this._columnCls = 'first-col';
    },

    _initComponentElement: function() {
        this._componentElement = new Element('div', {
                'class': this._cls
            }).update(
                '<div id="' + this._contentAreaId + '" class="columns-wrapper">' +
                '</div>'
            );
    },

    _renderItem: function(item) {
        var renderTargetId = this._id + '-item-' + item.getId();
        $(this._contentAreaId).insert(
            '<div class="' + this._columnCls + '"><div class="column-box" id="' + renderTargetId +'"></div></div>'
        );
        Jsw.render($(renderTargetId), item);

        this._columnCls = 'second-col';
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Panel
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Panel({
 *         renderTo: document.body,
 *         title: 'Panel title',
 *         items: [
 *             new Jsw.Box({
 *                 html: 'Panel content'
 *             })
 *         ]
 *     });
 */
Jsw.Panel = Class.create(Jsw.Container, {

    /**
     * @cfg {String} title
     */
    /**
     * @cfg {String} titleClass
     */
    /**
     * @cfg {Boolean} hideContentTitle
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._title = this._getConfigParam('title', '');
        this._titleClass = this._getConfigParam('titleClass', '');
        this._hideContentTitle = this._getConfigParam('hideContentTitle', this._title);
        this._titleAreaId = this._id + '-title-area';
        this._contentAreaId = this._id + '-content-area';
        this._boxItemsAreaId = this._id + '-box-area';
        this._initBoxItems();
    },

    _initBoxItems: function() {
        this._boxItems = this._getConfigParam('boxItems', null);

        if (null != this._boxItems) {
            this._boxItems = this._boxItems.map(Jsw.createComponent);
        }
    },

    _initComponentElement: function($super) {
        $super();

        this._updateComponentElement(
            '<div class="box-area">' +
            this._getTitleHtml() +
            this._getSubTitleHtml() +
                '<div id="' + this._boxItemsAreaId + '"></div>' +
                '<div class="content">' +
                    '<div class="content-area">' +
                        '<div class="content-wrapper" id="' + this._contentAreaId + '">' +
                            this._getConfigParam('html', '') +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    },

    _getTitleHtml: function() {
        return this._title
            ?   '<div class="title ' + (this._titleClass ? this._titleClass : '') + '">' +
                    '<div class="title-area" id="' + this._titleAreaId + '">' +
                        (('-' == this._title) ? '' : '<h3><span>' + this._title + '</span></h3>') +
                    '</div>' +
                '</div>'
            : '';
    },

    _getSubTitleHtml: function() {
        return '';
    },

    render: function($super) {
        $super();

        this._renderBoxItems();
    },

    _renderBoxItems: function() {
        if (null != this._boxItems) {
            this._boxItems.each(function(item) {
                this._renderBoxItem(item);
            }, this);
        }
    },

    _renderBoxItem: function(item) {
        Jsw.render($(this._boxItemsAreaId), item);
    },

    _isHidden: function()
    {
        var rememberedStatus = Jsw.Cookie.get(this._id + '-hidden');
        if (this._idIsRandom || null === rememberedStatus) {
            return this._getConfigParam('collapsed', false);
        }
        return 1 == rememberedStatus;
    },

    _setHidden: function(hidden)
    {
        if (this._getConfigParam('collapsed', false) == hidden) {
            Jsw.Cookie.remove(this._id + '-hidden');
        } else {
            Jsw.Cookie.set(this._id + '-hidden', hidden ? 1 : 0);
        }
    },

    _addEvents: function($super) {
        $super();
        if (this._isHidden()) {
            this.hideContent();
        } else {
            this.showContent();
        }
        this._componentElement.select('#' + this._titleAreaId).each(function(titleAreaElement) {
            Event.observe(titleAreaElement, 'click', this.toggleContent.bindAsEventListener(this));
        }, this);
    },

    _updateTitle: function(title) {
        if (title && ('-' != title)) {
            this._componentElement.down('div.title-area > h3 > span').update(title);
        }
    },

    showContent: function() {
        this._componentElement.removeClassName('hide');
        this._updateTitle(this._hideContentTitle);
        if (!this._idIsRandom) {
            this._setHidden(false);
        }
    },

    hideContent: function() {
        this._componentElement.addClassName('hide');
        this._updateTitle(this._title);
        if (!this._idIsRandom) {
            this._setHidden(true);
        }
    },

    toggleContent: function() {
        this._componentElement.hasClassName('hide')
            ? this.showContent()
            : this.hideContent();
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.SmallTools
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.SmallTools({
 *         renderTo: document.body,
 *         operations: [{
 *             componentType: 'Jsw.SmallButton',
 *             title: 'Button 1',
 *             handler: function() {
 *                 alert('You clicked the Button 1!');
 *             }
 *         }, {
 *             componentType: 'Jsw.bar.Separator',
 *         }, {
 *             componentType: 'Jsw.SmallButton',
 *             title: 'Button 2',
 *             handler: function() {
 *                 alert('You clicked the Button 2!');
 *             }
 *         }]
 *     });
 */
Jsw.SmallTools = Class.create(Jsw.Container, {

    /**
     * @cfg {Object[]} operations
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._operations = this._getConfigParam('operations', null);
        this._operationsId = this._getConfigParam('operationsId', this._id + '-operations');
        this._cls = this._getConfigParam('cls', 'actions-box');

        if (Object.isArray(this._operations) && (0 == this._operations.size())) {
            this._operations = null;
        }

        this.searchFilters = $H(this._getConfigParam("searchFilters", {}));
        this.searchFiltersState = this._getConfigParam("searchFiltersState", {});
        this.searchHandler = this._getConfigParam("searchHandler", Jsw.emptyFn);
        this.resetSearchHandler = this._getConfigParam("resetSearchHandler", Jsw.emptyFn);
        this.listId = this._getConfigParam("listId");

        this.searchOveral = this._getConfigParam("searchOveral", null);
        if (null === this.searchOveral) {
            this.searchFilters.each(function (pair){
                if (pair.value.overal) {
                    this.searchOverall = pair.key;
                }
            }, this);
            if (null === this.searchOveral && 1 === this.searchFilters.size()) {
                this.searchOveral = this.searchFilters.keys().first();
            }
            if (null === this.searchOveral) {
                this.searchOveral = false;
            }
        }

        this.quickSearchWide = this._getConfigParam("quickSearchWide", false);
        this.quickSearchInputId = this._getConfigParam("quickSearchInputId");
        this.searchCollapsed = this._getConfigParam('searchCollapsed', false);
        this.onToggleSearch = this._getConfigParam("onToggleSearch", Jsw.emptyFn);
    },

    render: function($super) {
        $super();

        Jsw.render(this._componentElement, [
            Jsw.createElement("#" + this._operationsId + ".objects-toolbar.clearfix",
                this._operations ? this._operations.map(Jsw.createComponent) : "",
                this.quickSearchBoxView()
            ),
            this.searchBoxView()
        ]);

        this._componentElement.toggleClassName("actions-box-search-show", !this.searchCollapsed);

        if (this._operations) {
            this.addResponsiveButton('toolbar')
        }

        if (this.searchFilters.size()) {
            this.addResponsiveButton('search');
        }

        Jsw.Tooltip.initData(this._componentElement);
    },

    quickSearchBoxView: function () {
        if (!this.searchFilters.size()) {
            return '';
        }

        return Jsw.createElement(".quick-search-box" + (this.quickSearchWide ? ".quick-search-box-wide" : ""), {
                "onclick": function (event) {
                    event.stopPropagation();
                }
            },
            this.searchOveralView(),
            this.searchFilters.size() > 1 ? Jsw.createElement("span.search-control",
                Jsw.createElement("a.s-btn.sb-search-show", {"onclick": this.toggleSearch.bind(this)}, this.lmsg('showSearch')),
                Jsw.createElement("a.s-btn.sb-search-hide", {"onclick": this.toggleSearch.bind(this)}, this.lmsg('hideSearch'))
            ) : ''
        );
    },

    searchOveralView: function () {
        if (!this.searchOveral) {
            return '';
        }

        var filterState = this.searchFiltersState[this.searchOveral];
        var currentValue = this.searchFilters.get(this.searchOveral).value || filterState && filterState.searchText || "";

        return Jsw.createElement(".search-field",
            Jsw.createElement("form", {
                    "onsubmit": function (event) {
                        Event.stop(event);
                        this.searchHandler(event.element());
                    }.bind(this)
                },
                Jsw.createElement("input" + (this.quickSearchInputId ? "#" + this.quickSearchInputId : ""), {
                    "type": "text",
                    "value": currentValue,
                    "name": "searchFilter[" + this.searchOveral + "][searchText]"}
                ),
                Jsw.createElement("em", {
                        "onclick": function (event) {
                            this.searchHandler(event.element().up('form'));
                        }.bind(this)
                    },
                    Jsw.createElement("span")
                )
            )
        );
    },

    searchBoxView: function () {
        if (this.searchFilters.size() < 2) {
            return;
        }

        return Jsw.createElement('.search-box', {"onclick": function (event) { event.stopPropagation(); }},
            Jsw.createElement('form', {"onsubmit": function (event) { this.searchHandler(event.element()); event.stop();}.bind(this)},
                Jsw.createElement('ul',
                    this.searchFiltersView()
                ),
                Jsw.createElement('a.s-btn.sb-search', {"onclick": function (event) { this.searchHandler(event.element().up('form')); }.bind(this)},
                    this.lmsg('buttonSearch')
                ),
                Jsw.createElement('a.s-btn.sb-show-all', {"onclick": function () { this.resetSearchHandler(); }.bind(this)},
                    this.lmsg('buttonResetSearch')
                ),
                Jsw.createElement('input[type="image"][style="border: 0pt none ; height: 0pt; width: 0pt; position: absolute; left: -9999px;"][src="' + Jsw.skinUrl + '/images/blank.gif"]')
            )
        );
    },

    searchFiltersView: function () {
        var filters = [];

        this.searchFilters.each(function (pair) {
            var name = pair.key;
            var config = pair.value;

            filters.push(
                Jsw.createElement('li',
                    Jsw.createElement('div',
                        config.title ? Jsw.createElement('span', config.title) : '',
                        Jsw.List.Filters.create(Object.extend({
                            idPrefix: this.listId,
                            name: name,
                            value: this.searchFiltersState[name] && this.searchFiltersState[name].searchText
                        }, config), function (event) {
                            this.searchHandler(event.element().up('form'));
                        }.bind(this))
                    )
                )
            );
        }, this);

        return filters;
    },

    toggleSearch: function () {
        this._componentElement.toggleClassName('actions-box-search-show');
        this.onToggleSearch(!this._componentElement.hasClassName('actions-box-search-show'));
    },

    _addEvents: function($super) {
        $super();

        $(document).observe('click', function() {
            this._hideResponsiveButtonBlocks();
        }.bind(this));
    },

    addResponsiveButton: function(name) {
        if (!this._rActionsElement) {
            this._rActionsElement = new Element('div', {"class": "r-actions"}).update('<ul class="r-actions-list"></ul>');
            this._componentElement.insert({top: this._rActionsElement});
        }

        if (this._rActionsElement.down('.r-actions-' + name)) {
            return;
        }

        this._rActionsElement.down('.r-actions-list').insert(
            '<li class="r-actions-item r-actions-' + name + '" onclick="Jsw.getComponent(\'' + this._id +
                '\').onResponsiveButtonClick(event, \'' + name + '\');"><span></span></li>'
        );
    },

    onResponsiveButtonClick: function(event, name) {
        var button = this._componentElement.down('.r-actions-' + name);
        var show = !button.hasClassName('r-actions-item-active');
        this._hideResponsiveButtonBlocks();
        if (show) {
            this._showResponsiveButtonBlocks(name);
        }
        event.stopPropagation();
    },

    _hideResponsiveButtonBlocks: function() {
        $w(this._componentElement.className).each(function(className) {
            if (className.indexOf('r-actions-active') === 0) {
                this._componentElement.removeClassName(className);
            }
        }.bind(this));
        this._componentElement.select('.r-actions-item-active').each(function(item) {
            if (item.hasClassName('r-actions-select')) {
                return;
            }
            item.removeClassName('r-actions-item-active');
        });
    },

    _showResponsiveButtonBlocks: function(name) {
        this._componentElement.down('.r-actions-' + name).addClassName('r-actions-item-active');
        this._componentElement.addClassName('r-actions-active');
        this._componentElement.addClassName('r-actions-active-' + name);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.CollapsibleBlock
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.CollapsibleBlock({
 *         renderTo: document.body,
 *         cls: 'example',
 *         title: 'Collapsible block',
 *         items: [
 *             new Jsw.Box({
 *                 html: 'Content of collapsible block.'
 *             })
 *         ]
 *     });
 */
Jsw.CollapsibleBlock = Class.create(Jsw.Container, {

    /**
     * @cfg {Boolean} collapsed=true
     */
    /**
     * @cfg {String} title
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._blockAreaId = this._id + '-block';
        this._titleAreaId = this._id + '-title-area';
        this._contentAreaId = this._id + '-content-area';
    },

    _initComponentElement: function($super) {
        $super();

        var containerContentChilds = this._componentElement.childElements();

        this._updateComponentElement(
            '<div class="' + this._cls +  '-block' + (this._getConfigParam('collapsed', true) ? ' hide' : '') + '" id="' + this._blockAreaId + '">' +
                '<div class="' + this._cls +  '-title" id="' + this._titleAreaId + '">' +
                    '<span>' + this._getConfigParam('title', '') +  '</span>' +
                '</div>' +
                '<div class="' + this._cls +  '-content" id="' + this._contentAreaId + '"></div>' +
            '</div>'
        );
    },

    _addEvents: function($super) {
        $super();
        $(this._titleAreaId).down('span').observe('click', this._onTitleClickEvent.bind(this));
    },

    _onTitleClickEvent: function(event) {
        Event.stop(event);
        $(this._blockAreaId).toggleClassName('hide');
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Collapsible
 * @extends Jsw.Container
 */
Jsw.Collapsible = Class.create(Jsw.Container, {

    /**
     * @cfg {String} html Inner html.
     */
    /**
     * @cfg {Boolean} collapsed=true
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._contentAreaId = this._id + '-content-area';
        this._anchorAreaId = this._id + '-anchor-area';
    },

    _initComponentElement: function($super) {
        $super();

        var containerContentChilds = this._componentElement.childElements();

        this._updateComponentElement(
            '<div class="collapsible-box collapsed">' +
                '<div class="collapsible-anchor" id="' + this._anchorAreaId + '"></div>' +
                '<div class="collapsible-area">' +
                    '<div class="tl"><div class="br"><div class="bl"><div class="tr">' +
                        '<div class="collapsible-content" id="' + this._contentAreaId + '">' +
                            this._getConfigParam('html', '') +
                            //...collapsible elements
                        '</div>' +
                    '</div></div></div></div>' +
                '</div>' +
             '</div>'
        );
    },

    _addEvents: function($super) {
        $super();

        //init collapsed status
        if (this._getConfigParam('collapsed', true)) {
            this.collapse();
        } else {
            this.expand();
        }
        //handle click event on anchor
        this._componentElement.select('.collapsible-anchor').each(function(anchorElement) {
            Event.observe(anchorElement, 'click', this._onAnchorClickEvent.bind(this));
        }, this);
    },

    _onAnchorClickEvent: function(event) {
        if (this._collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
        Event.stop(event);
    },

    _getCollapseBinding: function() {
        if (!this._collapseBinding) {
            this._collapseBinding = this.collapse.bind(this);
        }
        return this._collapseBinding;
    },

    /**
     * Collapse component.
     */
    collapse: function() {
        if (this._collapsed) {
            return;
        }
        this._collapsed = true;
        Event.stopObserving(document, 'click', this._getCollapseBinding());
        var content = $(this._contentAreaId).up('.collapsible-box');
        content.removeClassName('expanded');
        content.addClassName('collapsed');
    },

    /**
     * Expand component.
     */
    expand: function() {
        if (!this._collapsed) {
            return;
        }
        this._collapsed = false;
        var content = $(this._contentAreaId).up('.collapsible-box');
        content.removeClassName('collapsed');
        content.addClassName('expanded');
        Event.observe(document, 'click', this._getCollapseBinding());
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DropdownArea
 * @extends Jsw.Collapsible
 */
Jsw.DropdownArea = Class.create(Jsw.Collapsible, {
    _initComponentElement: function($super) {
        $super();
        this._componentElement.down('#' + this._anchorAreaId).update(
            '<h4><span>' + this._getConfigParam('title', '') + '</span></h4>'
        );
    }
});

/**
 * @class Jsw.DropdownSplit
 * @extends Jsw.Component
 */
Jsw.DropdownSplit = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', 'split');
    }
});

/**
 * @class Jsw.Dropdown
 * @extends Jsw.Collapsible
 */
Jsw.Dropdown = Class.create(Jsw.Collapsible, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._valuesAreaId = this._id + '-values-area';
        this.onChange = this._getConfigParam('onChange', this.onChange);
    },

    _initComponentElement: function($super) {
        $super();
        this._componentElement.down('#' + this._contentAreaId).update(
            '<h4><span>' + this._getConfigParam('title', '') + '</span></h4>' +
            '<ul id="' + this._valuesAreaId + '"></ul>'
        );
    },

    _renderItem: function(item) {
        var dropdownItem = new Jsw.DropdownItem(item);

        var valueItem = new Element('a').update(dropdownItem.title.escapeHTML());

        $(this._valuesAreaId).insert(
            new Element('li').update(valueItem)
        );

        valueItem.observe('click', this._onClick.bindAsEventListener(this, dropdownItem));
    },

    _onClick: function(event, item)
    {
        this.onChange(item);
    },

    onChange: function(item) {
        this.setValue(item.value);
    },

    setValue: function(value) {
        this._value = value;
    },

    getValue: function() {
        return this._value;
    }

});

/**
 * @class Jsw.DropdownItem
 */
Jsw.DropdownItem = Class.create({

    initialize: function(item) {
        if (Object.isString(item)) {
            this.value = item;
            this.title = item;
        } else {
            Object.extend(this, item);
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Pathbar
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Pathbar({
 *         renderTo: document.body,
 *         cls: "pathbar",
 *         items: [{
 *             componentType: "Jsw.Pathbar.Item",
 *             title: "Home"
 *         }, {
 *             componentType: "Jsw.Pathbar.Item",
 *             title: "Domains"
 *         }, {
 *             componentType: "Jsw.Pathbar.Item",
 *             title: "plesk.com"
 *         }, {
 *             componentType: "Jsw.Pathbar.Item",
 *             title: "PHP Settings"
 *         }]
 *     });
 */

Jsw.Pathbar = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._contentAreaId = this._id + '-content-area';
    },

    _initComponentElement: function($super) {
        if ($(this._id)) {
            this._applyTargetId = this._id;
            $super();

            return;
        }

        $super();

        this._updateComponentElement(
            '<ul id="' + this._contentAreaId + '">' +
            '</ul>'
        );
    },

    _renderItem: function(item) {
        var renderTargetId = this._id + '-item-' + item.getId();
        $(this._contentAreaId).insert('<li id="' + renderTargetId +'"></li>');
        Jsw.render($(renderTargetId), item);
        this._renderItemSuffix(item);
    },

    _renderItemSuffix: function(item) {
        var renderTargetId = this._id + '-item-' + item.getId();
        $(renderTargetId).insert("<b>&gt;</b>");
    }

});

/**
 * @class Jsw.Pathbar.Item
 * @extends Jsw.Component
 */
Jsw.Pathbar.Item = Class.create(Jsw.Component, {

    /**
     * @cfg {String} title
     */
    /**
     * @cfg {String} href
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._title = this._getConfigParam('title', '');
        this._href = this._getConfigParam('href', '');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement = new Element('a', {
            'href': this._href
        }).update('<span>' + this._title + '</span>');
    },

    getHref: function() {
        return this._href;
    }
});

/**
 * @class Jsw.Pathbar.SimpleItem
 * @extends Jsw.Component
 */
Jsw.Pathbar.SimpleItem = Class.create(Jsw.Component, {

    /**
     * @cfg {String} title
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._title = this._getConfigParam('title', '');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement = new Element('span');
        this._componentElement.update(this._title);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Bar
 * @extends Jsw.Container
 */
Jsw.Bar = Class.create(Jsw.Container, {

    /**
     * @cfg {String} type=static Type of tabs (static or dynamic)
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._contentAreaId = this._id + '-content-area';
        this._type = this._getConfigParam('type', 'static');
    },

    _initComponentElement: function($super) {
        $super();

        var content = '<ul id="' + this._contentAreaId + '"></ul>';
        if ('navbar' !== this._id) {
            content = '<div class="tabs-area">' + content + '</div>';
        }

        this._updateComponentElement(content);
    },

    _renderItem: function(item) {
        var renderTargetId = this._id + '-item-' + item.getId();
        var containerCls = item.getContainerClass();

        $(this._contentAreaId).insert('<li class="' + containerCls + '" id="' + renderTargetId + '"></li>');
        Jsw.render($(renderTargetId), item);

        if ('dynamic' === this._type) {
            item.addEventObserver('click', item.switchTab.bindAsEventListener(item));
        }

        if ($('main')) {
            if (!$('main').hasClassName('tabed') && 'navbar' !== this._id) {
                $('main').addClassName('tabed');
            }
        }
    }
});

Jsw.namespace('Jsw.bar');

/**
 * @class Jsw.bar.Tabs
 * @extends Jsw.Bar
 *
 * The following example demonstrates how to use static tabs:
 *
 *     @example
 *     new Jsw.bar.Tabs({
 *         renderTo: document.body,
 *         cls: 'tabs',
 *         items: [{
 *             componentType: 'Jsw.bar.Button',
 *             title: 'Tab 1',
 *             active: true,
 *             href: 'http://example1.com'
 *         }, {
 *             componentType: 'Jsw.bar.Button',
 *             title: 'Tab 2',
 *             href: 'http://example2.com'
 *         }]
 *     });
 *
 * The following example demonstrates how to use dynamic tabs:
 *
 *     @example
 *     new Jsw.bar.Tabs({
 *         renderTo: document.body,
 *         cls: 'tabs',
 *         type: 'dynamic',
 *         items: [{
 *             componentType: 'Jsw.bar.Button',
 *             tabId: 'tab-1',
 *             title: 'Tab 1',
 *             active: true,
 *             content: 'Content of Tab 1'
 *         }, {
 *             componentType: 'Jsw.bar.Button',
 *             tabId: 'tab-2',
 *             title: 'Tab 2',
 *             content: new Jsw.Box({
 *                 html: 'Content of Tab 2'
 *             })
 *         }]
 *     });

 */
Jsw.bar.Tabs = Class.create(Jsw.Bar, {

    /**
     * @cfg {Boolean} responsive=true
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._isResponsive = this._getConfigParam('responsive', true);
    },

    _renderItems: function($super) {
        $super();

        if (this._isResponsive) {
            this._addResponsiveTabs();
        }
    },

    _addResponsiveTabs: function() {
        var element = $(this._id);
        element.select('li a').each(function(el) {
            el.observe('click', function(event) {
                var listItem = el.up('li');
                if (listItem.hasClassName('active') || listItem.id === 'current') {
                    Event.stop(event);
                }
                element.toggleClassName('responsive-tabs-visible');
            });
        });
    },

    switchTab: function(tabId) {
        var activeTab = null;

        this.getItems().each(function(item) {
            if (tabId === item.getTabId()) {
                activeTab = item;
            }

            $(item.getTabId()).hide();
            item.getRenderTarget().removeClassName('active');
        });

        $(tabId).show();
        activeTab.getRenderTarget().addClassName('active');
    },

    _renderItem: function($super, item, i, size) {
        $super(item, i, size);

        var content = item.getTabContent();

        if (content) {
            var tabContentElement = new Element('div', {
                'id': item.getTabId()
            });

            if (!item.isActive()) {
                tabContentElement.setStyle({ 'display': 'none' });
            }

            this._componentElement.up().insert({ bottom: tabContentElement });

            if (Object.isString(content)) {
                tabContentElement.update(content);
            } else {
                Jsw.render($(item.getTabId()), content);
            }
        }
    }
});

/**
 * @class Jsw.bar.Button
 * @extends Jsw.Button
 */
Jsw.bar.Button = Class.create(Jsw.Button, {

    /**
     * @cfg {Boolean} active=false
     */
    /**
     * @cfg {String} containerCls
     */
    /**
     * @cfg {String} tabId
     */
    /**
     * @cfg {Boolean} navigationTab=false
     */
    /**
     * @cfg {String|Jsw.Component} content
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._isActive = this._getConfigParam('active', false);
        this._cls = this._getConfigParam('cls', '');
        this._containerCls = this._getConfigParam('containerCls', this._isActive ? 'active' : '');
        this._tabId = this._getConfigParam('tabId', null);
        if (this._tabId) {
            this._id = this._tabId + '-button';
        }
        this.navigationTab = this._getConfigParam('navigationTab', false);
        this._content = this._getConfigParam('content', null);
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.update('<span>' + this._title + '</span>');
    },

    getContainerClass: function() {
        return this._containerCls;
    },

    getTabId: function() {
        return this._tabId;
    },

    switchTab: function(event) {
        var bar = Jsw.getComponent(Event.element(event).up('ul').up('div').up('div').id);
        bar.switchTab(this._tabId);
        Event.stop(event);
    },

    getTabContent: function() {
        return this._content;
    },

    isActive: function() {
        return this._isActive;
    }

});

/**
 * @class Jsw.bar.Separator
 * @extends Jsw.Component
 */
Jsw.bar.Separator = Class.create(Jsw.Component, {
    _tag: 'span',

    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', 'separator');
    },

    _initComponentElement: function($super) {
        $super();
        this._componentElement.update('<span></span>');
    }
});

/**
 * @class Jsw.bar.HorizontalSeparator
 * @extends Jsw.Component
 */
Jsw.bar.HorizontalSeparator = Class.create(Jsw.Component, {
    _tag: 'span',

    _initConfiguration: function($super, config) {
        $super(config);
        this._wrapperClass = this._getConfigParam('wrapperClass', 'separator');
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.list
 * @singleton
 */
Jsw.list = {

    /**
     * @property {Object} COLUMN_SELECTION
     */
    COLUMN_SELECTION: {
        cls: 'select',
        headerCls: 'select',
        hideDisabled: false,
        headerRenderer: function(column) {
            return '<input type="checkbox" class="checkbox" name="listGlobalCheckbox"/>';
        },
        renderer: function(item, isDisabled) {
            if (!isDisabled) {
                return '<input type="checkbox" class="checkbox" name="listCheckbox[]" value="' + Jsw.escapeAttribute(item.id) + '"/>';
            }

            var html =
                '<div>' +
                    '<span class="checkbox-disabled-wrapper"></span>' +
                    '<input style="z-index: 1;" disabled="disabled" type="checkbox" class="checkbox"/>' +
                '</div>';

            return html;
        }
    },

    /**
     * @property {Object} COLUMN_ACTIONS
     */
    COLUMN_ACTIONS: {
        header: '',
        cls: 'min',
        sortable: false,
        renderer: function(item) {
            if (!item.actions || !item.actions.length) {
                return '';
            }
            var rowId = item.id ? Jsw.escapeAttribute(item.id) : '';
            return '<span class="btn-group list-menu">' +
                '<span class="btn btn-list-menu dropdown-toggle" data-row-id="' + rowId + '">' +
                    '<button type="button">' +
                        '<i class="icon">' +
                            '<img src="' + Jsw.skinUrl + '/icons/16/plesk/menu.png" alt="">' +
                        '</i> ' +
                        '<em class="caret"></em>' +
                    '</button>' +
                '</span>' +
            '</span>';
        }
    },

    /**
     * @property {Object} ITEMS_UNLIMITED
     */
    ITEMS_UNLIMITED: 100000

};

/**
 * @class Jsw.list.AdditionalActions
 * @extends Jsw.Component
 */
Jsw.list.AdditionalActions = Class.create(Jsw.Component, {

    _tag: 'div',

    _initConfiguration: function($super, config) {
        $super(config);

        this._operations = this._getConfigParam('operations', null);
        this._cls = this._getConfigParam('cls', 'actions-menu');
        this._titleAddCls = this._getConfigParam('titleAddCls', 'sb-more-actions');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.insert({
            bottom:
                '<div class="popup-box collapsed">' +
                    '<table class="popup-wrapper" cellspacing="0"><tbody><tr>' +
                        '<td class="popup-container">' +
                            '<div class="c1"><div class="c2"><div class="c3"><div class="c4"><div class="c5">' +
                                '<div class="popup-heading">' +
                                    '<div class="heading-area">' +
                                        '<span class="close"></span>' +
                                        '<h4>' +
                                            '<span>' +
                                                this._getConfigParam('title', '') +
                                            '</span>' +
                                        '</h4>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="popup-content">'+
                                    '<div class="popup-content-area">' +
                                        '<ul id="' + this._id + '-operations">' +
                                        '</ul>' +
                                    '</div>' +
                                '</div>' +
                            '</div></div></div></div></div>' +
                        '</td>' +
                    '</tr></tbody></table>' +
                '</div>'
        });
    },

    _addEvents: function($super) {
        $super();

        var context = this;
        $(document.body).observe('click', function() {
            context.collapse();
        });
    },

    enable: function() {
        this._titleButton.enable();
    },

    disable: function() {
        this._titleButton.disable();
    },

    toggle: function() {
        var popup = this._componentElement.down('.popup-box');

        if (popup) {
            popup.toggleClassName('collapsed');
        }

        var button = this._componentElement.down('.' + this._titleAddCls);

        if (button) {
            button.toggleClassName('active');
        }
    },

    collapse: function() {
        var popup = this._componentElement.down('.popup-box');

        if (popup) {
            popup.addClassName('collapsed');
        }

        var button = this._componentElement.down('.' + this._titleAddCls);

        if (button) {
            button.removeClassName('active');
        }
    },

    render: function($super) {
        $super();

        this._titleButton = new Jsw.SmallButton({
            title: this._getConfigParam('title', ''),
            cls: 's-btn',
            addCls: this._titleAddCls,
            handler: (function(event) {
                Event.stop(event);
                this.toggle();
            }).bind(this)
        });
        Jsw.render(this._componentElement, this._titleButton);

        if (!this._operations) {
            return;
        }

        var operationsArea = this._componentElement.down('#' + this._id + '-operations');
        this._operations.each(function(config) {
            var liElement = new Element('li');
            operationsArea.insert(liElement);

            var operation = Jsw.createComponent(config);
            var wrapperClass = operation.getWrapperClass();
            if (wrapperClass) {
                liElement.addClassName(wrapperClass);
            }

            Jsw.render(liElement, operation);
        }, this);

        if (this._getConfigParam('disabled', false)) {
            this.disable();
        } else {
            this.enable();
        }
    }

});

/**
 * @class Jsw.List
 * The class for the implementation of the widget "List". In addition to displaying the data,
 * it is possible to change the sorting, search, perform group operations.
 * @extends Jsw.Component
  */
Jsw.List = Class.create(Jsw.Component, {

    /**
     * @cfg {String} listCls=list
     */
    /**
     * @cfg {String} dataUrl=""
     */
    /**
     * @cfg {Object[]} operations List operations.
     * See {@link Jsw.SmallTools}.{@link Jsw.SmallTools#operations operations} for details.
     */
    /**
     * @cfg {Object[]} columns
     */
    /**
     * @cfg {Object[]} itemActions
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls += ' js-list';
        this._listCls = this._getConfigParam('listCls', 'list');
        this._tableId = this._id + '-table';
        this._dataUrl = this._getConfigParam('dataUrl', '');
        this._operations = this._getConfigParam('operations', null);
        this._itemActions = this._getConfigParam('itemActions', {});
        this._columns = this._getConfigParam('columns', []);
        this._limitValues = this._getConfigParam('limitValues', [10, 25, 100, Jsw.list.ITEMS_UNLIMITED]);
        this._splitListData(this._getConfigParam('data', { data: null, pathbar: null, state: null, pager: null, locale: null, additional: null }));
        this._searchFilters = $H(this._getConfigParam('searchFilters', {}));
        this._searchOveral = this._getConfigParam('searchOveral', null);
        this._pageable = this._getConfigParam('pageable', true);
        this._disabledSelectHint = this._getConfigParam('disabledSelectHint', '');
        this._clearStatusOnReload = this._getConfigParam('clearStatusOnReload', true);
        this.isDisabledItem = this._getConfigParam('isDisabledItem', function() {
            return false;
        });
        this._onRedraw = this._getConfigParam('onRedraw', function() {});
        this._getTotalInfo = this._getConfigParam('getTotalInfo', function() {
            return this.lmsg('recordsTotal', {'total': this._pager.totalItemCount});
        });
        this._getRowClass = this._getConfigParam('getRowClass', function() {
            return '';
        });

        if (Object.isArray(this._operations)) {
            this._operations = this._operations.compact();
            if (!this._operations.length) {
                this._operations = null;
            }
        }
    },

    _getSearchOveralField: function()
    {
        if (null === this._searchOveral) {
            this._searchFilters.each(function (pair){
                if(pair.value.overal) {
                    this._searchOveral = pair.key;
                }
            }, this);
            if (null === this._searchOveral && 1 === this._searchFilters.size()) {
                this._searchOveral = this._searchFilters.keys().first();
            }
            if (null === this._searchOveral) {
                this._searchOveral = false;
            }
        }

        return this._searchOveral;
    },

    _initComponentElement: function($super) {
        $super();

        this._updateComponentElement('<div id="' + this._id + '-container"></div>');
        this._initDisablerOverlay();
    },

    _splitListData: function(listData, place) {
        if (!listData || !listData.data) {
            return false;
        }

        var dataLen = listData.data.length;
        if ('before' === place) {
            this._data = listData.data.concat(this._data);
        } else if ('after' === place) {
            this._data = this._data.concat(listData.data);
        } else {
            this._data = listData.data;
        }
        this._state = listData.state || {};
        this._pager = listData.pager || {};
        if (listData.locale) {
            Object.extend(this._locale.messages, listData.locale);
        }
        if (listData.pathbar) {
            this._pathbar = listData.pathbar;
        }
        if (listData.additional) {
            this._additionalData = this._additionalData || {};
            this._additionalData = Object.extend(this._additionalData, listData.additional);
        }
        return dataLen;
    },

    _isColumnSelectionPresent: function() {
        return this._getColumns().any(function (column) {
            return column === Jsw.list.COLUMN_SELECTION;
        });
    },

    /**
     * @param {String} dataIndex
     */
    onHeaderClick: function(dataIndex) {
        this._state.sortField = dataIndex;
        this._state.sortDirection = ('down' === this._state.sortDirection)
            ? 'up'
            : 'down';

        this.reload('/sort-field/' + dataIndex + '/sort-dir/' + this._state.sortDirection);
    },

    /**
     * @param {Boolean} [force]
     */
    updateFilter: function(force) {
        if (!$(this._tableId)) {
            this.checkEmptyList();
            return;
        }
        var filterChanged = false;
        var hasFilter = false;
        this._getColumns().filter(function (column) {
            return 'function' !== typeof column.isVisible || column.isVisible();
        }).forEach(function (column) {
            if (!column.filter || !column.filter.type) {
                return;
            }

            var input;
            if (column.filter.options) {
                if (column.filter.multi) {
                    input = this._componentElement.down('th[data-index="' + column.dataIndex + '"]').select('input[type=checkbox]:checked');
                } else {
                    input = this._componentElement.down('th[data-index="' + column.dataIndex + '"] select');
                }
            } else {
                input = this._componentElement.down('th[data-index="' + column.dataIndex + '"] input');
            }
            if (!input) {
                column.filter.value = '';
                return;
            }

            hasFilter = true;

            var value;
            if (column.filter.multi) {
                value = [];
                input.each(function(el) {
                    value.push(el.value.toLowerCase());
                });
                if (value.length === column.filter.options.length) {
                    value = [];
                }
            } else {
                value = input.value.toLowerCase();
            }
            if (value === column.filter.value) {
                return;
            }

            column.filter.value = value;
            filterChanged = true;
        }, this);

        if (!hasFilter || !force && !filterChanged) {
            this.checkEmptyList();
            return;
        }
        var oddEvenRowClass = 'even';
        $(this._tableId).select('tr.odd, tr.even').each(function(row, rowIndex) {
            var cells = row.childElements(),
                match = true;

            this._getColumns().filter(function (column) {
                return 'function' !== typeof column.isVisible || column.isVisible();
            }).forEach(function (column, columnIndex) {
                var value = this._data[rowIndex][column.dataIndex];
                if (cells[columnIndex]._filtered) {
                    if (column.noEscape) {
                        cells[columnIndex].innerHTML = value;
                    } else {
                        cells[columnIndex].innerHTML = value.escapeHTML();
                    }
                    delete cells[columnIndex]._filtered;
                }

                if (!match || !column.filter || !column.filter.type || 0 === column.filter.value.length) {
                    return;
                }

                if (column.filter.type === 'date') {
                    if (new Date(value.replace(/ /g,'T')) < new Date(column.filter.value.replace(/ /g,'T'))) {
                        match = false;
                    }
                    return;
                }

                if (column.filter.options) {
                    if (column.filter.multi) {
                        if (column.filter.value.indexOf(value.toLowerCase()) === -1) {
                            match = false;
                        }
                    } else {
                        if (value.toLowerCase() !== column.filter.value) {
                            match = false;
                        }
                    }
                    return;
                }

                var pos = value.toLowerCase().indexOf(column.filter.value);

                if (pos === -1 || column.filter.startsWith && pos !== 0) {
                    match = false;
                    return;
                }

                if (column.noEscape) {
                    cells[columnIndex].innerHTML = value.substr(0, pos)
                        + '<b class="search-result-label">'
                        + value.substr(pos, column.filter.value.length)
                        + '</b>'
                        + value.substr(pos + column.filter.value.length);
                } else {
                    cells[columnIndex].innerHTML = value.substr(0, pos).escapeHTML()
                        + '<b class="search-result-label">'
                        + value.substr(pos, column.filter.value.length).escapeHTML()
                        + '</b>'
                        + value.substr(pos + column.filter.value.length).escapeHTML();
                }
                cells[columnIndex]._filtered = true;
            }, this);

            if (match) {
                row.removeClassName(oddEvenRowClass);
                oddEvenRowClass = oddEvenRowClass === 'odd' ? 'even' : 'odd';
                row.addClassName(oddEvenRowClass);
                row.show();
            } else {
                row.hide();
            }
        }, this);
        this.checkEmptyList();
    },

    /**
     * @param {String} value
     */
    onLimitClick: function(value) {
        this.reload({'items-per-page': value});
    },

    /**
     * @param {String} page
     */
    onPagerClick: function(page) {
        this.reload({'page': page});
    },

    onSelectButtonClick: function(event) {
        var globalCheckbox = this._componentElement.select('input[name="listGlobalCheckbox"]').first();
        globalCheckbox.checked = !globalCheckbox.checked;
        this.onListGlobalCheckboxClick(event);
        event.stopPropagation();
    },

    onListGlobalCheckboxClick: function(event) {
        var actionsBox = this._componentElement.select('.actions-box').first();
        var globalCheckbox = this._componentElement.select('input[name="listGlobalCheckbox"]').first();

        if (actionsBox) {
            var selectButton = actionsBox.select('.r-actions-select').first();
            if (globalCheckbox.checked) {
                selectButton.addClassName('r-actions-item-active');
            } else {
                selectButton.removeClassName('r-actions-item-active');
            }
        }

        this._componentElement.select('input[name="listCheckbox[]"]').each(function(checkbox) {
            if (globalCheckbox.checked) {
                checkbox.up('tr').addClassName('selected');
            } else {
                checkbox.up('tr').removeClassName('selected');
            }
            checkbox.checked = globalCheckbox.checked;
        });
    },

    onPagerButtonClick: function(event) {
        var paging = this._componentElement.select('.paging').first();
        var show = !paging.hasClassName('r-paging-visible');
        if (this._actionBox) {
            this._actionBox._hideResponsiveButtonBlocks();
        }
        if (show) {
            paging.addClassName('r-paging-visible');
        }
        event.stopPropagation();
    },

    listHeadersView: function() {
        var headers = [],
            filters = [],
            hasFilter = false,
            colspan = 0;

        this._getColumns().forEach(function (column) {
            if (colspan) {
                colspan--;
                return;
            }

            if ('function' === typeof column.isVisible) {
                if (!column.isVisible()) {
                    return;
                }
            }

            if (column.headerColspan) {
                colspan = column.headerColspan;
            }

            var header ='';

            var headerCls = column.headerCls ? '.' + column.headerCls : '';

            if ('undefined' !== typeof column.headerRenderer) {
                header = column.headerRenderer(column);
            } else {
                var sortCssClass = '';
                if (this._state.sortField === column.dataIndex) {
                    sortCssClass = 'down' === this._state.sortDirection ? '' : '.sort-up';
                    headerCls += '.sort';
                }

                header = column.header;
                if (column.sortable) {
                    header = Jsw.createElement('a' + sortCssClass, {"onclick": this.onHeaderClick.bind(this, column.dataIndex)}, header);
                }
            }
            headers.push(Jsw.createElement('th' + headerCls + (colspan ? '[colspan="' + colspan + '"]' : ''), column.headerParams, header));

            var filter = '';
            if (column.filter) {
                hasFilter = true;
                filter = Jsw.List.Filters.create(Object.extend({
                    name: column.dataIndex,
                    locale: this.getLocale()
                }, column.filter), this.updateFilter.bind(this, false));
            }
            filters.push(Jsw.createElement('th', {"data-index": column.dataIndex}, filter));
        }, this);

        return Jsw.createElement('thead',
            hasFilter ? Jsw.createElement('tr.list-search-filter', filters) : '',
            Jsw.createElement('tr', headers)
        );
    },

    _getListDataHtml: function(listData, indexOffset) {
        if ('undefined' === typeof listData) {
            listData = this._data;
        }

        if (!listData) {
            return ;
        }

        indexOffset = indexOffset || 0;

        return Object.keys(listData).map(function (index) {
            return this._getRowHtml(listData[index], index, indexOffset);
        }.bind(this)).join('');
    },

    //One data row as html
    _getRowHtml: function(item, index, indexOffset) {
        var html = '';
        var rowClass = this._getRowClass(item);
        var oddEvenRowClass = (index + indexOffset) % 2 ? 'even' : 'odd';
        var rowId = item.id ? Jsw.escapeAttribute(item.id) : '';
        html += '<tr class="' + rowClass + ' ' + oddEvenRowClass + '" data-row-id="' + rowId + '">';

        this._getColumns().filter(function (column) {
            return 'function' !== typeof column.isVisible || column.isVisible();
        }).forEach(function(column) {
            var data = '';

            if (Object.isFunction(column.renderer)) {
                var isDisabled = this.isDisabledItem(item);

                if (isDisabled && ('undefined' !== typeof column.hideDisabled) && column.hideDisabled) {
                    data = '';
                } else {
                    data = column.renderer.call(this, item, isDisabled);
                }
            } else if ('undefined' !== typeof column.dataIndex && 'undefined' !== typeof item[column.dataIndex]) {
                if (column.noEscape || !item[column.dataIndex].escapeHTML) {
                    data = item[column.dataIndex];
                } else {
                    data = item[column.dataIndex].escapeHTML();
                }
            }

            var itemCls = '';

            if ('undefined' !== typeof column.cls) {
                itemCls = column.cls;
            }

            html += '<td class="' + itemCls + '">' + data + '</td>';
        }, this);

        html += '</tr>';
        return html;
    },

    listView: function() {
        return Jsw.createElement('.' + this._listCls,
            Jsw.createElement('table#' + this._tableId + '[width="100%"][cellspacing="0"]',
                this.listHeadersView(),
                this._getListDataHtml()
            )
        );
    },

    containerView: function() {
        return Jsw.createElement('#' + this._id + '-container',
            this._getPathbarHtml(),
            this._getPagerHtml(),
            this.listView(),
            this._getPagerHtml(),
            this._getEmptyHtml()
        );
    },

    checkEmptyList: function() {
        var isEmpty = this.isListEmpty();
        this._componentElement.select('.js-empty-list').invoke('toggle', isEmpty);
        this._componentElement.select('.paging').invoke('toggle', !isEmpty);
        var listSelector = this._listCls.split(' ').reduce(function(previousValue, currentValue) {
            if (currentValue !== '') {
                previousValue += '.' + currentValue;
            }
            return previousValue;
        }, '');
        this._componentElement.select(listSelector).invoke('toggle', !isEmpty);
    },

    isListEmpty: function() {
        if (!$(this._tableId)) {
            return !this._data.length;
        }
        return !$(this._tableId).select('tr.odd,tr.even').filter(Element.visible).length;
    },

    _getPathbarHtml: function() {
        if (!this._pathbar) {
            return '';
        }

        return '<div id="' + this._id + '-pathbar"></div>';
    },

    _getPagerHtml: function() {
        if (!this._pageable) {
            return '';
        }
        var totalRecords = this._getTotalInfo();

        var html =
            '<div class="paging">' +
                '<div class="paging-area">' +
                    '<span class="paging-info"  onclick="Jsw.getComponent(\'' + this._id +
                        '\').onPagerButtonClick(event);">' + totalRecords + '</span>' +
                    '<span class="paging-view">' + this.lmsg('numberOfItemPerPage') + ': ' +
                        this._getLimitValuesHtml() +
                    '</span>';

        if (this._pager.pageCount > 1) {
            html += '<span class="paging-nav">' + this.lmsg('pages') + ': ' + this._getPagesItemsHtml() + '</span>';
        }

        html += '</div></div>';

        return html;
    },

    _getLimitValuesHtml: function() {
        var html = '';

        this._limitValues.each(function(limitValue) {
            var limitValueTitle = (Jsw.list.ITEMS_UNLIMITED === limitValue)
                ? this.lmsg('allItems')
                : limitValue;

            if (this._pager.itemCountPerPage !== limitValue) {
                html += '<a href="#" onclick="Jsw.getComponent(\'' + this._id +
                    '\').onLimitClick(' + limitValue + ');">' + limitValueTitle + '</a> ';
            } else {
                html += '<span>' + limitValueTitle + '</span> ';
            }
        }, this);

        return html;
    },

    _getPagesItemsHtml: function() {
        var html = '';

        if (this._pager.first !== this._pager.current) {
            html += '<a href="#" onclick="' + this._getPageItemLink(this._pager.first) + '">'
                + this.lmsg('firstPage') + '</a> ';
        } else {
            html += '<span>' + this.lmsg('firstPage') + '</span> ';
        }

        if (this._pager.previous) {
            html += '<a href="#" onclick="' + this._getPageItemLink(this._pager.previous) + '">&lt;&lt;</a> ';
        } else {
            html += '<span>&lt;&lt;</span> ';
        }

        $H(this._pager.pagesInRange).values().each(function(page) {
            if (page !== this._pager.current) {
                html += '<a href="#" onclick="' + this._getPageItemLink(page) + '">' + page + '</a> ';
            } else {
                html += page + ' ';
            }
        }, this);

        if (this._pager.next) {
            html += '<a href="#" onclick="' + this._getPageItemLink(this._pager.next) + '">&gt;&gt;</a> ';
        } else {
            html += '<span>&gt;&gt;</span> ';
        }

        if (this._pager.last !== this._pager.current) {
            html += '<a href="#" onclick="' + this._getPageItemLink(this._pager.last) + '">'
                + this.lmsg('lastPage') + '</a> ';
        } else {
            html += '<span>' + this.lmsg('lastPage') + '</span> ';
        }

        return html;
    },

    _getPageItemLink: function(page) {
        return "Jsw.getComponent('" + this._id + "').onPagerClick(" + page + ");";
    },

    _getEmptyHtml: function() {
        return '<p class="js-empty-list empty-list text-muted">' + this.lmsg('noEntriesFound') + '</p>';
    },

    _onSearchClick: function(form) {
        this.reload('?' + form.serialize());
    },

    _onResetSearchClick: function() {
        this.reload('/reset-search/true/');
    },

    _addSelectionHandlers: function() {
        var context = this;
        var selectButton;

        var actionsBox = this._componentElement.select('.actions-box').first();
        if (actionsBox) {
            selectButton = new Element('li', {"class": "r-actions-item r-actions-select"})
                .update('<span></span>')
                .observe('click', this.onSelectButtonClick.bindAsEventListener(this));
            this._componentElement.down('.actions-box .r-actions-list').insert({top: selectButton});
        }

        var globalCheckbox = this._componentElement.select('input[name="listGlobalCheckbox"]').first();
        globalCheckbox.observe('click', this.onListGlobalCheckboxClick.bind(this));

        this._componentElement.select('input[name="listCheckbox[]"]').each(function(checkbox) {
            checkbox.observe('click', function() {
                if (checkbox.checked) {
                    checkbox.up('tr').addClassName('selected');
                } else {
                    checkbox.up('tr').removeClassName('selected');
                    globalCheckbox.checked = false;
                    if (selectButton) {
                        selectButton.removeClassName('r-actions-item-active');
                    }
                }
            });
        });

        $(document).observe('click', function(event) {
            if (event.findElement('.objects-toolbar')) {
                return;
            }

            context._hideItemsNotSelectedWarning();
        });
        $(document).observe('touchstart', function() {
            list._hideItemsNotSelectedWarning();
        });
    },

    _addPathbar: function() {
        if (!this._pathbar) {
            return;
        }

        Jsw.render($(this._id + '-pathbar'), Jsw.createComponent(this._pathbar));
    },

    disable: function() {
        this._disablerOverlay.show();
        this._disablerOverlay.clonePosition(this._componentElement);
    },

    enable: function() {
        this._disablerOverlay.hide();
    },

    getSelectedItemsIds: function() {
        return this._componentElement.select('input[name="listCheckbox[]"]').filter(function (checkbox) {
            return checkbox.checked;
        }).map(function (checkbox) {
            return checkbox.value;
        });
    },

    getSelectedItems: function() {
        var ids = [];
        var selectedItems = [];

        this.getSelectedItemsIds().each(function(id) {
            ids.push(id);
        });

        this._data.each(function(dataItem) {
            var itemIndex = ids.indexOf(dataItem.id);
            if (itemIndex < 0) {
                return;
            }

            selectedItems.push(dataItem);
        });

        return selectedItems;
    },

    checkNonEmptySelection: function() {
        if (!this.getSelectedItemsIds().length) {
            this._showItemsNotSelectedWarning();
            return false;
        }
        this._hideItemsNotSelectedWarning();
        return true;
    },

    execLongGroupOperation: function(params, event) {
        var itemId;
        params.onSuccess = function() {
            var progressBar = Jsw.getComponent('asyncProgressBarWrapper');
            progressBar.removePreparingItem(itemId);
            progressBar.update();
        };

        params.beforeSendRequest = function(sendRequest) {
            var beginOffset = event.target.cumulativeOffset();
            itemId = Jsw.getComponent('asyncProgressBarWrapper').fly(beginOffset,
                params.taskName,
                function(){
                    sendRequest();
                });
        };

        this.execGroupOperation(params);
    },

    execGroupOperation: function(params) {
        var context = this;

        var ids = $H();
        var count = 0;

        var idsParamName = params.submitVarName
            ? params.submitVarName
            : 'ids';

        var selectedItems = params.selectedItems ? params.selectedItems : this.getSelectedItemsIds();
        selectedItems.each(function(id) {
            ids.set(idsParamName + '[' + count + ']', id);
            count++;
        });

        if (params.checkSelection) {
            if (!params.checkSelection()) {
                return;
            }
        } else if (!count) {
            this._showItemsNotSelectedWarning();
            return ;
        } else {
            this._hideItemsNotSelectedWarning();
        }

        var submit = this._submit;
        var sendRequestHandler = params.submitHandler
            ? params.submitHandler
            : function(url, ids) {
                submit(Jsw.prepareUrl(url), {
                    method: 'post',
                    parameters: ids,
                    reloading: false,
                    context: context,

                    onSuccess: function (transport) {
                        try {
                            var status = transport.responseText.evalJSON();
                        } catch (e) {
                            Jsw.showInternalError(transport.responseText);
                            return;
                        }
                        if (status.redirect) {
                            Jsw.redirect(status.redirect);
                        } else if (!status.noReload) {
                            this.reloading = true;
                            context.reload();
                        }

                        if (context._clearStatusOnReload) {
                            Jsw.clearStatusMessages();
                        }
                        $A(status.statusMessages).each(function(message) {
                            Jsw.addStatusMessage(message.status, message.content);
                        });

                        if (params.onSuccess) {
                            params.onSuccess(status);
                        }
                    },

                    onCreate: function() {
                        context.disable();
                    },

                    onComplete: function() {
                        if (!this.reloading) {
                            context.enable();
                        }
                    },

                    onFailure: function(req) {
                        if (504 === req.status) {
                            Jsw.addStatusMessage('error', context.lmsg('timeoutMessage'));
                        } else {
                            Jsw.showInternalError(req.responseText);
                        }

                        context.enable();
                    }
                });
            };

        var sendRequest = function() {
            if (params.beforeSendRequest) {
                params.beforeSendRequest(function(){
                    sendRequestHandler(params.url, ids);
                });
            } else {
                sendRequestHandler(params.url, ids);
            }
        };

        var skipConfirmation = params.skipConfirmation;
        var mouseEvent = params.mouseEvent;

        if (mouseEvent && !skipConfirmation) {
            mouseEvent.preventDefault();
            skipConfirmation = mouseEvent.shiftKey;
        }

        if (skipConfirmation) {
            sendRequest();
        } else {
            params.confirmationPopup = params.confirmationPopup || this._confirmationPopup.bind(this, params, sendRequest);
            params.confirmationPopup(ids);
        }
    },

    _submit: function(url, params) {
        new Ajax.Request(url, params);
    },

    _confirmationPopup: function(params, sendRequest, ids) {
        Jsw.messageBox.show({
            type: Jsw.messageBox.TYPE_YESNO,
            buttonTitles: {
                yes: this.lmsg('messageBoxButtonYes'),
                no: this.lmsg('messageBoxButtonNo'),
                wait: this.lmsg('messageBoxButtonWait')
            },
            text: params.getConfirmOnGroupOperation
                ? params.getConfirmOnGroupOperation()
                : params.locale.confirmOnGroupOperation,
            subtype: params.subtype,
            needAttention: params.needAttention ? params.needAttention : false,
            needAttentionText: params.needAttentionText ? params.needAttentionText : '',
            needAttentionBlockSubmit: params.needAttentionBlockSubmit ? params.needAttentionBlockSubmit : false,
            onYesClick: sendRequest,

            isAjax: params.isAjax,
            requestUrl: params.requestUrl,
            requestParams: ids,
            loadingTitle: params.loadingTitle
        });
    },

    _showItemsNotSelectedWarning: function() {
        this._hideItemsNotSelectedWarning();
        var element = this._componentElement.down('items-not-selected-warning');
        if (element) {
            element.show();
        } else {
            this._componentElement.down('.actions-box').insert({ top:
                '<div class="actions-msg-container" id="items-not-selected-warning"><span class="list-actions-msg"><span>' +
                this.lmsg('itemsNotSelected') + '</span></span></div>'
            });
        }
    },

    _hideItemsNotSelectedWarning: function() {
        var element = this._componentElement.down('.actions-msg-container');
        if (element) {
            element.hide();
        }
    },

    render: function($super) {
        $super();

        if (this._getColumns().indexOf(Jsw.list.COLUMN_ACTIONS) !== -1) {
            this._contextMenu = new Jsw.ListContextMenu({
                renderTo: document.body,
                list: this
            });
        }

        if (!this._data) {
            this.reload();
            return ;
        }

        this.redraw();
    },

    _addEvents: function() {
        $(document).observe('click', function () {
            var paging = this._componentElement.select('.paging').first();
            if (paging) {
                paging.removeClassName('r-paging-visible');
            }
        }.bind(this));
    },

    reload: function(urlParams, place) {
        urlParams = urlParams || '';

        if (!this._dataUrl) {
            return;
        }

        var reloadUrl = Jsw.addUrlParams(this._dataUrl, urlParams);

        if (this._additionalData && this._additionalData.controllerName) {
            reloadUrl = Jsw.addUrlParams(reloadUrl, {controllerName: this._additionalData.controllerName});
        }
        if (this._additionalData && this._additionalData.actionName) {
            reloadUrl = Jsw.addUrlParams(reloadUrl, {actionName: this._additionalData.actionName});
        }

        if (this._request) {
            this._request.abort();
        }

        this._request = new Ajax.Request(Jsw.prepareUrl(reloadUrl), {
            method: 'get',
            onSuccess: this._onReloadSuccess.bind(this, place),
            onFailure: this._onReloadFailure.bind(this),
            onException: this._onReloadException.bind(this),
            onCreate: this._onReloadCreate.bind(this),
            onComplete: this._onReloadComplete.bind(this)
        });
        return this._request;
    },

    _onReloadSuccess: function(place, transport) {
        if ('' == transport.responseText) {
            //:INFO: sometimes happens in FF if you are go to other page during request
            return;
        }

        try {
            var data = transport.responseText.evalJSON();
        } catch (e) {
            Jsw.showInternalError(transport.responseText);
            return;
        }
        if (data.redirect) {
            Jsw.redirect(data.redirect);
        }
        var dataLen = this._splitListData(data, place);
        if (false === dataLen) {
            this.processReloadError(data);
        } else {
            this.redraw(place, dataLen);
        }
    },

    _onReloadFailure: function(transport) {
        Jsw.showInternalError(transport.responseText);
    },

    _onReloadException: function(transport, exception) {
        Jsw.showInternalError(exception + "\n" + transport.responseText);
    },

    _onReloadCreate: function(transport) {
        if (this._clearStatusOnReload) {
            Jsw.clearStatusMessages();
        }
        this.disable();
    },

    _onReloadComplete: function() {
        this._request = null;
        this.enable();
    },

    _addDisabledCheckboxesHints: function() {
        var checkboxes = this._componentElement.select('input[type="checkbox"][disabled]');

        checkboxes.each(function(checkbox) {
            new Jsw.Tooltip.Instance(checkbox.previous(), {text: this._disabledSelectHint });
        }, this);
    },

    /**
     * @param {String} [place]
     * @param {Number} [dataLen]
     */
    redrawPartial: function(place, dataLen) {
        if (!dataLen) {
            return;
        }

        if ('before' === place) {
            $(this._tableId).down('thead').insert({
                after: this._getListDataHtml(this._data.slice(0, dataLen))
            });
        } else if ('after' === place) {
            $(this._tableId).insert({
                bottom: this._getListDataHtml(this._data.slice(-dataLen))
            });
        }

        Jsw.Tooltip.initData(this._componentElement);
        this.updateFilter(true);
    },

    /**
     * @param {String} [place]
     * @param {Number} [dataLen]
     */
    redraw: function(place, dataLen) {
        if (place && $(this._tableId)) {
            this.redrawPartial(place, dataLen);
            this._onRedraw();
            return;
        }

        this._componentElement.down().remove();
        Jsw.render(this._componentElement, this.containerView(), 'top');

        if (this._operations || this._searchFilters.size()) {
            if (this._state.forceShowSearch) {
                Jsw.Cookie.set(this._id + '-search-show', 'true');
            }

            this._actionBox = new Jsw.SmallTools({
                locale: this.getLocale(),
                operationsId: this._id + '-operations',
                renderTo: this._componentElement.down(),
                renderMode: 'top',
                operations: this._getOperations(),
                listId: this._id,
                searchFilters: this._searchFilters,
                searchFiltersState: this._state.searchFilters,
                searchOveral: this._searchOveral,
                searchHandler: this._onSearchClick.bind(this),
                resetSearchHandler: this._onResetSearchClick.bind(this),
                searchCollapsed: 'true' !== Jsw.Cookie.get(this._id + '-search-show'),
                onToggleSearch: function (collapsed) {
                    Jsw.Cookie.set(this._id + '-search-show', !collapsed);
                    this._hideItemsNotSelectedWarning();
                }.bind(this),
                quickSearchInputId: this._id + "-search-text-" + this._getSearchOveralField()
            });
        }

        if (this._isColumnSelectionPresent() && this._pager.totalItemCount > 0) {
            this._addSelectionHandlers();
        }
        if (this._contextMenu) {
            this._contextMenu.onRedraw();
        }

        this._addPathbar();

        if (this._disabledSelectHint) {
            this._addDisabledCheckboxesHints();
        }

        this._addResponsiveHtml();

        this._initDropdowns();
        this._initItemActions();
        Jsw.Tooltip.initData(this._componentElement);
        this.updateFilter(true);
        this._onRedraw();
    },

    _initItemActions: function () {
        this._componentElement.select('a[data-action-name]').invoke('observe', 'click', function (event) {
            event.preventDefault();
            var link = event.findElement('a[data-action-name]');
            var actionName = link.getAttribute('data-action-name');
            if (!this._itemActions[actionName]) {
                return;
            }

            var itemId = link.up('tr').getAttribute('data-row-id');
            var row = this._data.find(function (item) {
                return item.id == itemId;
            });
            this._itemActions[actionName](row, event);
        }.bind(this));
    },

    _initDropdowns: function() {
        var dropdown;
        this._dropdowns = this._dropdowns || [];
        while (dropdown = this._dropdowns.pop()) {
            Jsw.DropdownManager.unregister(dropdown);
        }

        this._componentElement.select('.dropdown .input-group').each(function(el) {
            this._dropdowns.push(Jsw.DropdownManager.register(el,
                function() {
                    return el.up().hasClassName('open');
                },
                function() {
                    el.up().addClassName('open');
                },
                function() {
                    el.up().removeClassName('open');
                }
            ));
        }, this);
    },

    /**
     * @param {*} data
     */
    processReloadError: function(data) {
        if (data && data.statusMessages) {
            $A(data.statusMessages).each(function (message) {
                Jsw.addStatusMessage(message.status, message.content);
            });
        } else {
            Jsw.showInternalError('Unable to load list data.');
        }
    },

    /**
     * @param {Function} callback
     * @returns {Boolean}
     */
    hasSelectedItems: function(callback) {
        var selected = this.getSelectedItemsIds();

        if (!selected.length) {
            this._showItemsNotSelectedWarning();
            return false;
        } else {
            this._hideItemsNotSelectedWarning();
        }

        if (callback) {
            callback.bind(this)();
        }

        return true;
    },

    getItemById: function(itemId) {
        for (var i = 0; i < this._data.length; i++) {
            if (this._data[i].id == itemId) {
                return this._data[i];
            }
        }
    },

    _addResponsiveHtml: function() {
        var list = this;
        var columns = this._componentElement.select('thead th');
        this._componentElement.select('#' + this._tableId + ' tbody tr').each(function(row){
            var cells = row.childElements();
            for (var i = 0; i < cells.length; i++) {
                var element = cells[i];
                var columnName = columns[i].innerHTML.strip().stripTags();
                var columnNameHtml = '<span class="r-visible">' + columnName + '</span>';

                list._addResponsiveHtmlToButtons(element, columnNameHtml);

                list._addResponsiveHtmlToImages(element, columnNameHtml);

                list._addResponsiveHtmlToIcons(element, columnNameHtml);

                list._addResponsiveHtmlToNumbers(element, columnName);
            }
        });
    },

    _addResponsiveHtmlToButtons: function(element, columnNameHtml) {
        var buttons = element.select('a.s-btn');
        buttons.each(function(button) {
            var tooltip = button.previous('.tooltipData');
            if (!button.down('span').innerHTML && tooltip) {
                button.down('span').innerHTML = '<span class="r-visible">' + tooltip.innerHTML + '</span>';
            }
        });
        if (buttons.length === 1 && !buttons[0].down('span').innerHTML) {
            buttons[0].down('span').innerHTML = columnNameHtml;
        }
    },

    _addResponsiveHtmlToImages: function(element, columnNameHtml) {
        var images = element.select('a img,a [class^="icon-"],a [class*=" icon-"]');
        images.each(function(image) {
            var text = '';
            var tooltip = image.up().previous('.tooltipData');
            if (!tooltip) {
                if (images.length !== 1) {
                    return;
                }
                text = columnNameHtml;
            } else {
                text = tooltip.innerHTML;
            }
            if (!image.up('.b-indent-icon') || !image.up('a').innerHTML.replace(image.up('.b-indent-icon').outerHTML, '').strip()) {
                var wrapper = image;
                if ('img' === image.tagName.toLowerCase()) {
                    wrapper = image.wrap('i', {'class': 'icon'});
                }
                wrapper.insert({after: ' <span class="r-visible">' + text + '</span>'});
                image.up('a').addClassName('i-link');
            }
        });
    },

    _addResponsiveHtmlToIcons: function(element, columnNameHtml) {
        var icons = element.select('span.b-indent-icon');
        icons.each(function(icon) {
            var tooltip = icon.select('.tooltipData');
            if (tooltip.length > 0 && !icon.up().innerHTML.replace(icon.outerHTML, '').strip()) {
                icon.down('img').insert({after: ' <span class="r-visible">' + tooltip[0].innerHTML + '</span>'});
            }
        });
        if (icons.length === 1 && !icons[0].down('span.r-visible') && !icons[0].up().innerHTML.replace(icons[0].outerHTML, '').strip()) {
            icons[0].down('img').insert({after: columnNameHtml});
        }
    },

    _addResponsiveHtmlToNumbers: function(element, columnName) {
        var number = element.innerHTML;
        var columnNameHtml = '<span class="r-visible">' + columnName + ': </span>';
        if ('-' === number || (!isNaN(parseFloat(number)) && isFinite(number))) {
            element.insert({top: columnNameHtml});
        }
        var links = element.select('a');
        if (
            links.length === 1 &&
            ('-' === links[0].innerHTML || (!isNaN(parseFloat(links[0].innerHTML)) && isFinite(links[0].innerHTML)))
        ) {
            element.insert({top: columnNameHtml});
        }
    },

    checkSyncStatus: function(statusElementId, url, onFinishCallback, randomId, options) {
        //list was reloaded - stop the check of sync status for old list elements
        if (this._randomId != randomId) {
            return;
        }

        var context = this;
        options = $H({
            timeout: 5000,
            progressStatus: 'started'
        }).merge($H(options));
        new Ajax.Request(url, {
            method: 'get',
            parameters: {},
            onSuccess: function(transport) {
                var result = transport.responseText.evalJSON();
                var statusElement = $(statusElementId);
                if (!statusElement) {
                    return;
                }
                if (options.get('progressStatus') === result.status) {
                    setTimeout(function(){
                        context.checkSyncStatus(statusElementId, url, onFinishCallback, randomId, options);
                    }, options.get('timeout'));
                } else {
                    onFinishCallback(statusElement, result);
                }
            }
        });
    },

    _getOperations: function() {
        var operations = this._operations ? this._operations.slice() : [];
        if (!this._additionalData || !this._additionalData.operations || !this._additionalData.operations.length) {
            return operations;
        }
        var deleteButtonIndex = this._getDeleteButtonIndex();
        var args = [deleteButtonIndex, 0];
        if (deleteButtonIndex !== 0 && operations[deleteButtonIndex - 1].componentType !== 'Jsw.bar.Separator') {
            args.push({componentType: 'Jsw.bar.Separator'});
        }
        args = args.concat(this._additionalData.operations);
        if (deleteButtonIndex !== operations.length) {
            args.push({componentType: 'Jsw.bar.Separator'});
        }
        operations.splice.apply(operations, args);
        return operations;
    },

    _getColumns: function () {
        var columns = this._columns.slice();

        var extensions = this._additionalData && this._additionalData.extensions || {};
        Object.keys(extensions).forEach(function (id) {
            this._modifyColumnsByExtension(columns, extensions[id]);
        }.bind(this));

        return columns;
    },

    _modifyColumnsByExtension: function (columns, extension) {
        function findColumn(dataIndex) {
            var column = columns.find(function (column) {
                return column.dataIndex === dataIndex;
            });

            dataIndex = parseInt(dataIndex);
            return column || columns[dataIndex < 0 ? dataIndex + columns.length : dataIndex - 1];
        }

        if (extension.columnsOverride) {
            Object.keys(extension.columnsOverride).forEach(function (dataIndex) {
                var originalColumn = findColumn(dataIndex);
                if (!originalColumn) {
                    return;
                }

                var column = extension.columnsOverride[dataIndex];

                if (column.title) {
                    column.header = column.title
                }

                if (column.renderer) {
                    column.renderer = eval('(' + column.renderer + ')');
                }

                if (!Object.isUndefined(column.isVisible) && !column.isVisible) {
                    column.isVisible = function () {
                        return false;
                    };
                }

                Object.extend(originalColumn, column);
            });
        }

        if (extension.columns) {
            Object.keys(extension.columns).forEach(function (dataIndex) {
                var column = extension.columns[dataIndex];

                if (column.renderer) {
                    column.renderer = eval('(' + column.renderer + ')');
                }

                column = Object.extend({
                    header: column.title,
                    dataIndex: dataIndex
                }, column);

                var index, originalColumn;
                if (column.insertBefore && (originalColumn = findColumn(column.insertBefore))) {
                    index = columns.indexOf(originalColumn);
                } else if (column.insertAfter && (originalColumn = findColumn(column.insertAfter))) {
                    index = columns.indexOf(originalColumn) + 1;
                } else {
                    index = columns.length;
                }

                columns.splice(index, 0, column);
            });
        }
    },

    _getDeleteButtonIndex: function() {
        if (!this._operations) {
            return 0;
        }
        var deleteButtonIndex = this._operations.length;
        this._operations.forEach(function(el, i) {
            if (el.addCls === 'sb-remove-selected') {
                deleteButtonIndex = i;
            }
        });
        return deleteButtonIndex;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DynamicSubForm
 * @extends Jsw.Component
 */
Jsw.DynamicSubForm = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);
        var getDynamicContent = this._getConfigParam('getDynamicContent', null);
        if (getDynamicContent) {
            this._getDynamicContent = getDynamicContent.bind(this);
        }
        var prepareDynamicContent = this._getConfigParam('prepareDynamicContent', null);
        if (prepareDynamicContent) {
            this._prepareDynamicContent = prepareDynamicContent.bind(this);
        }
        var bindDynamicContent = this._getConfigParam('bindDynamicContent', null);
        if (bindDynamicContent) {
            this._bindDynamicContent = bindDynamicContent.bind(this);
        }
        var insertDynamicContent = this._getConfigParam('insertDynamicContent', null);
        if (insertDynamicContent) {
            this._insertDynamicContent = insertDynamicContent.bind(this);
        }
        var onUpdateDynamic = this._getConfigParam('onUpdateDynamic', null);
        if (onUpdateDynamic) {
            this._onUpdateDynamic = onUpdateDynamic.bind(this);
        }
        var onInitDynamic = this._getConfigParam('onInitDynamic', null);
        if (onInitDynamic) {
            this._onInitDynamic = onInitDynamic.bind(this);
        }
    },

    _addEvents: function($super) {
        $super();
        var dynamicElements = this._componentElement.select('.dynamicSubFormContent');
        if (!dynamicElements.length) {
            this._addEmptyContent();
        } else {
            dynamicElements.each(function(element, index) {
                this._bindDynamicContent(element, !index);
            }, this);
        }
        this._onInitDynamic();
        this._onUpdateDynamic();
    },

    _addEmptyContent: function() {
        var element = this._prepareDynamicContent(this._getDynamicContent());
        this._insertDynamicContent(element);
        this._bindDynamicContent(element, true);
    },

    _getDynamicContent: function() {
        var dynamicElement = this._componentElement.down('.dynamicSubFormTemplate').cloneNode(true);
        dynamicElement.removeClassName('dynamicSubFormTemplate').addClassName('dynamicSubFormContent').show();
        return dynamicElement;
    },

    _prepareDynamicContent: function(content, value) {
        return content;
    },

    _insertDynamicContent: function(content) {
        var dynamicElements = this._componentElement.select('.dynamicSubFormContent');
        if (!dynamicElements.length) {
            this._componentElement.insert({top : content});
        } else {
            dynamicElements.last().insert({after : content});
        }
    },

    _bindDynamicContent: function(content, isFirstElement) {
    },

    _onInitDynamic: function() {
    },

    _onUpdateDynamic: function() {
    },

    deleteContent: function(content) {
        content.remove();
        this._onUpdateDynamic();
    },

    addContent: function(value) {
        var content = this._prepareDynamicContent(this._getDynamicContent(), value);
        this._insertDynamicContent(content);
        this._bindDynamicContent(content, false);
        this._onUpdateDynamic();
    }

});

/**
 * @class Jsw.AddRemoveDynamicSubForm
 * @extends Jsw.DynamicSubForm
 */
Jsw.AddRemoveDynamicSubForm = Class.create(Jsw.DynamicSubForm, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._addButtonId = this._getConfigParam('addButtonId', '');
        this._addButtonTitle = this._getConfigParam('addButtonTitle', '');
        this._removeButtonId = this._getConfigParam('removeButtonId', '');
        this._removeButtonTitle = this._getConfigParam('removeButtonTitle', '');
    },

    _onInitDynamic: function() {
        $(this._addButtonId).replace('<div id="' + this._addButtonId + '" class="text-value"></div>');
        new Jsw.SmallButton({
            id: 'dynamicSubFormContentAddButton-' + this._id,
            title: this._addButtonTitle,
            addCls: 'sb-item-add dynamicSubFormContentAddButton',
            handler: this.addContent.bind(this),
            disabled: this._isAddButtonDisabled(),
            renderTo: this._addButtonId
        });
    },

    _isAddButtonDisabled: function() {
        return false;
    },

    _bindDynamicContent: function(content, isFirstElement) {
        if (!isFirstElement) {
            var wrapperId = this._initRemoveButtonWrapper(content);
            new Jsw.SmallButton({
                id: wrapperId,
                title: this._removeButtonTitle,
                addCls: 'sb-item-remove dynamicSubFormContentRemoveButton',
                handler: this.deleteContent.bind(this, content),
                renderTo: wrapperId
            });
        }
        return content;
    },

    _initRemoveButtonWrapper: function(content) {
        var wrapperId = this._removeButtonId + '-' + this._getRandomNumber();
        content.select('.field-value input, .field-value select').last().insert({
            after: '<span id="' + wrapperId + '" class="' + this._removeButtonId + '"></span>'
        });
        return wrapperId;
    },

    _prepareDynamicContent : function(content) {
        var newId = Math.floor(1000000 * Math.random());

        var nameRegExp = new RegExp("(name=.*?\\[?" + this._id + "\\]?\\[)dynamicSubFormTemplate(\\])", "g");
        var idRegExp = new RegExp("(id=.*?\\-?" + this._id + "-)dynamicSubFormTemplate(-)", "g");

        content = content.update(content.innerHTML
            .replace(nameRegExp, '\$1c' + newId +'\$2')
            .replace(idRegExp, '\$1c' + newId +'\$2')
        );

        return content;
    },

    _onUpdateDynamic: function() {
        var childs = this._componentElement.select('.dynamicSubFormContent');
        $$('label[for="' + this._addButtonId + '"]').first().toggle(!childs.length);
        if (childs.length) {
            childs.each(function(child, index) {
                child.select('label').last().toggle(!index);
            });
        }
    },

    addContent: function($super, event) {
        $super();
        Event.stop(event);
    },

    deleteContent: function($super, content, event) {
        $super(content);
        Event.stop(event);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Box
 * Component with custom inner html.
 * @extends Jsw.Component
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Box({
 *         renderTo: document.body,
 *         html: '<h1>Heading 1</h1><p>Paragraph</p>'
 *     });
 */
Jsw.Box = Class.create(Jsw.Component, {
    _tag: 'div',

    /**
     * @cfg {String} html Inner html of the box.
     */

    _initComponentElement: function($super) {
        $super();

        this._componentElement.update(
            this._getConfigParam('html', '')
        );
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Gauge
 * @extends Jsw.Component
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Gauge({
 *         renderTo: document.body,
 *         value: 75
 *     });
 */
Jsw.Gauge = Class.create(Jsw.Component, {
    _tag: 'div',

    /**
     * @cfg {Number} value
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = this._getConfigParam('cls', 'progress progress-sm');
    },

    _initComponentElement: function($super) {
        $super();

        this.setProgress(this._getConfigParam('value', ''));
    },

    setProgress: function(value)
    {
        this._componentElement.update(
            '<div class="progress-bar" style="width: ' + value + '%"></div>'
        );
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Cookie
 * Utility class for setting/reading values from browser cookies.
 * Values can be written using the {@link #set} or {@link #setPermanent} method.
 * Values can be read using the {@link #get} method.
 * A cookie can be invalidated on the client machine using the {@link #remove} method.
 * @singleton
 */
Jsw.Cookie = {
    /**
     * Retrieves cookies that are accessible by the current page. If a cookie does not exist, `get()` returns null.
     * @param {String} name The name of the cookie to get
     * @returns {String|null}  Returns the cookie value for the specified name; null if the cookie name does not exist.
     */
    get: function (name) {
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
            var crumbs = cookies[i].split("=");
            if (name == crumbs[0]) {
                return unescape(crumbs[1]);
            }
        }
        return null;
    },

    /**
     * Creates a cookie with the specified name and value.
     * @param {String} name The name of the cookie to set.
     * @param {String} value The value to set for the cookie.
     * @param {String} [expires] Specify an expiration date the cookie is to persist until.
     * @param {String} [path] Setting a path on the cookie restricts access to pages that match that path.
     */
    set: function (name, value, expires, path) {
        var cookie = name + "=" + escape(value) + "; ";

        if (('undefined' != typeof expires) && expires) {
            cookie += 'expires=' + expires + '; '
        }

        if (('undefined' != typeof path) && path) {
            cookie += "path=" + path + '; ';
        }

        if (window.location.protocol == 'https:') {
            cookie += "secure; ";
        }

        document.cookie = cookie;
    },

    /**
     * Creates a permanent cookie with the specified name and value.
     * @param {String} name The name of the cookie to set.
     * @param {String} value The value to set for the cookie.
     * @param {String} [path] Setting a path on the cookie restricts access to pages that match that path.
     */
    setPermanent: function (name, value, path) {
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        var expires = date.toGMTString();
        Jsw.Cookie.set(name, value, expires, path);
    },

    /**
     * Removes a cookie with the provided name from the browser by setting its expiration date to sometime in the past.
     * @param {String} name
     * @param {String} [path]
     */
    remove: function (name, path) {
        Jsw.Cookie.set(name, '', 'Fri, 31 Dec 1999 23:59:59 GMT', path);
    }
};

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Tooltip
 * @singleton
 */
Jsw.Tooltip = {
    // show timeout
    showTimeoutStatus: true,

    // show timeout
    showTimeout: 0.55,

    // minimum viewport delta
    minDelta: 5,

    // horisonatl offset from cursor
    xOffsetLeft: -5,

    // horisonatl offset from cursor
    xOffsetRight: 5,

    // vertical offset from cursor
    yOffsetTop: 1,

    // vertical offset from cursor
    yOffsetBottom: 13,

    current: null,

    initData: function(contentElement) {
        var elements;

        if ('undefined' !== typeof contentElement) {
            elements = contentElement.select('.tooltipData');
        } else {
            elements = $$('.tooltipData');
        }

        elements.each(function(tooltipData) {
            Jsw.Tooltip.init(tooltipData.parentNode, {element: tooltipData});
        });
    },

    /**
     * @param {Element} element
     * @param {Object} config Tooltip config.
     * @param {String} config.text Text of tooltip.
     * @returns {Jsw.Tooltip.Instance}
     */
    init: function(element, config) {
        return new Jsw.Tooltip.Instance(element, config);
    },

    set: function(tooltip) {
        if (Jsw.Tooltip.current && Jsw.Tooltip.current !== tooltip) {
            Jsw.Tooltip.hide();
        }
        if (Jsw.Tooltip.current === tooltip) {
            return;
        }
        Jsw.Tooltip.current = tooltip;
        Element.observe(tooltip._element, 'mousemove', Jsw.Tooltip._onMouseMove);
        Element.observe(tooltip._element, 'mouseout', Jsw.Tooltip._onMouseOut);

        Jsw.Tooltip.show();
    },

    show: function() {
        Jsw.Tooltip.showCancel();
        Jsw.Tooltip.hideCancel();
        if (Jsw.Tooltip.showTimeoutStatus) {
            Jsw.Tooltip.showTask = new PeriodicalExecuter(Jsw.Tooltip.showFinish, Jsw.Tooltip.showTimeout);
        } else {
            Jsw.Tooltip.showFinish();
        }
    },

    showCancel: function() {
        if (Jsw.Tooltip.showTask) {
            Jsw.Tooltip.showTask.stop();
            Jsw.Tooltip.showTask = null;
        }
    },

    showFinish: function() {
        Jsw.Tooltip.showCancel();
        var tooltipElement = Jsw.Tooltip._fetchTooltipElement();
        var tooltip = Jsw.Tooltip.current;
        if (tooltip._config.text) {
            tooltipElement.down('span').update(tooltip._config.text);
        } else
        if(tooltip._config.element) {
            tooltipElement.down('span').update(tooltip._config.element.innerHTML);
        }
        tooltipElement.show();
        Jsw.Tooltip.update();
    },

    hide: function() {
        Jsw.Tooltip.showCancel();
        if (!Jsw.Tooltip.current) {
            return;
        }
        var tooltip = Jsw.Tooltip.current;
        Jsw.Tooltip.current = null;
        var tooltipElement = Jsw.Tooltip._fetchTooltipElement();
        tooltipElement.hide();
        Element.stopObserving(tooltip._element, 'mousemove', Jsw.Tooltip._onMouseMove);
        Element.stopObserving(tooltip._element, 'mouseout', Jsw.Tooltip._onMouseOut);
        Jsw.Tooltip.hideTask = new PeriodicalExecuter(Jsw.Tooltip.hideFinish, Jsw.Tooltip.showTimeout);
    },

    hideCancel: function() {
        if (Jsw.Tooltip.hideTask) {
            Jsw.Tooltip.hideTask.stop();
            Jsw.Tooltip.hideTask = null;
        }
    },

    hideFinish: function() {
        Jsw.Tooltip.showTimeoutStatus = true;
    },

    update: function() {
        if (!Jsw.Tooltip.current) {
            return;
        }
        var tooltipElement = Jsw.Tooltip._fetchTooltipElement();
        var position = Jsw.Tooltip._fetchTooltipPosition(tooltipElement);
        Element.setStyle(tooltipElement, {
            top: position.y + 'px',
            left: position.x + 'px'
        });
    },

    _onMouseOut: function() {
        Jsw.Tooltip.hide();
    },

    _onMouseMove: function(event) {
        Jsw.Tooltip.tooltipX = Event.pointerX(event);
        Jsw.Tooltip.tooltipY = Event.pointerY(event);
        Jsw.Tooltip.update();
    },

    _fetchTooltipElement: function() {
        if (!Jsw.Tooltip._tooltipElement) {
            Jsw.Tooltip._tooltipElement = $$('.tooltip').first();
        }

        return Jsw.Tooltip._tooltipElement;
    },

    _fetchTooltipPosition: function(tooltipElement) {
        var x = Jsw.Tooltip.tooltipX;
        var y = Jsw.Tooltip.tooltipY;

        var tDim = Element.getDimensions(tooltipElement);
        var vDim = document.viewport.getDimensions();
        var vScr = document.viewport.getScrollOffsets();

        var freeRight = vDim.width + vScr.left - Jsw.Tooltip.tooltipX;
        var freeLeft = Jsw.Tooltip.tooltipX - vScr.left;
        var freeTop = Jsw.Tooltip.tooltipY - vScr.top;
        var freeBottom = vDim.height + vScr.top - Jsw.Tooltip.tooltipY;

        //apply better x
        if( freeRight > tDim.width + Jsw.Tooltip.minDelta + Jsw.Tooltip.xOffsetRight) {
            x = Jsw.Tooltip.tooltipX + Jsw.Tooltip.xOffsetRight;
        } else
        if( freeLeft > tDim.width + Jsw.Tooltip.minDelta + Jsw.Tooltip.xOffsetLeft) {
            x = Jsw.Tooltip.tooltipX - tDim.width - Jsw.Tooltip.xOffsetLeft;
        } else {
            x = Jsw.Tooltip.tooltipX - (tDim.width + Jsw.Tooltip.xOffsetLeft) / 2;
        }

        //apply better y
        if (freeBottom > tDim.height + Jsw.Tooltip.minDelta + Jsw.Tooltip.yOffsetBottom) {
            y = Jsw.Tooltip.tooltipY + Jsw.Tooltip.yOffsetBottom;
        } else
        if( freeTop > tDim.height + Jsw.Tooltip.minDelta + Jsw.Tooltip.yOffsetTop) {
            y = Jsw.Tooltip.tooltipY - tDim.height - Jsw.Tooltip.yOffsetTop;
        } else {
            y = Jsw.Tooltip.tooltipY - (tDim.height + Jsw.Tooltip.yOffsetTop) / 2;
        }
        if (x < 0) {
            x = Jsw.Tooltip.minDelta;
        }

        return { x: x, y: y };
    }

};

Event.observe(window, 'load', function() {
    Jsw.Tooltip.initData();
});

/**
 * @class Jsw.Tooltip.Instance
 */
Jsw.Tooltip.Instance = Class.create({

    initialize: function(element, config) {
        this._element = element;
        this._config = config;
        //observe events
        Event.stopObserving(this._element, 'mouseover');
        Event.observe(this._element, 'mouseover', this.set.bind(this));
    },

    set: function() {
        Jsw.Tooltip.set(this);
    },

    setText: function(text) {
        this._config.text = text;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ModalDialogBox
 * @extends Jsw.Component
 */
Jsw.ModalDialogBox = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._screenDisablerId = this._getConfigParam('screenDisablerId', 'screenDisabler');
        this._hideOnEscape = this._getConfigParam('hideOnEscape', false);
        this._onShow = this._getConfigParam('onShow', Jsw.emptyFn);
        this._onHide = this._getConfigParam('onHide', Jsw.emptyFn);

        if (!$(this._screenDisablerId)) {
            Jsw.ModalDialogBox.initScrollbarSpacer();
            $(document.body).insert({
                top: '<div id="' + this._screenDisablerId + '" class="main-disabled-block"></div>'
            });
        }

        this._screenDisabler = $(this._screenDisablerId);

        var renderTo = this._getConfigParam('renderTo', 'modalDialogBox');
        this._renderTarget = $(renderTo) || new Element("div", {"id": renderTo});

        this._renderTarget.update('');
        this._screenDisabler.insert({after: this._renderTarget});
        this._onKeyDownhandler = this._onKeyDown.bind(this);
    },

    _addEvents: function ($super) {
        $super();

        this._componentElement.observe('click', function() {
            this.hide();
        }.bind(this));

        var popupContainer = this._componentElement.down('.popup-container');
        if (popupContainer) {
            popupContainer.observe('click', function (e) {
                e.stopPropagation();
            });
        }
    },

    _addEvents: function ($super) {
        $super();

        this._componentElement.observe('click', function() {
            this.hide();
        }.bind(this));

        var popupContainer = this._componentElement.down('.popup-container');
        if (popupContainer) {
            popupContainer.observe('click', function (e) {
                e.stopPropagation();
            });
        }

        this._onKeyDownhandler = this._onKeyDown.bind(this);
    },

    show: function($super) {
        $super();
        $$('html')[0].addClassName('modal-open');
        document.observe('keydown', this._onKeyDownhandler);
        this._onShow();
    },

    hide: function($super) {
        $super();
        $$('html')[0].removeClassName('modal-open');
        document.stopObserving('keydown', this._onKeyDownhandler);
        this._onHide();
    },

    _onKeyDown: function (e) {
        switch (e.keyCode) {
            case (this._hideOnEscape && Event.KEY_ESC):
                this.hide();
                break;
        }
    }
});

Jsw.ModalDialogBox.initScrollbarSpacer = function () {
    var scrollDiv = document.createElement("div");
    scrollDiv.style.width = "50px";
    scrollDiv.style.height = "50px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);

    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    var styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    styleEl.sheet.insertRule('.modal-open {margin-right: ' + scrollbarWidth + 'px}', 0);
    styleEl.sheet.insertRule('.modal-open .js-scrollbar-spacer {margin-right: ' + scrollbarWidth + 'px}', 1);
};
// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.PopupForm
 * @extends Jsw.ModalDialogBox
 */
Jsw.PopupForm = Class.create(Jsw.ModalDialogBox, {

    _initConfiguration: function($super, config) {
        config = Object.extend({
            cls: 'popup-panel'
        }, config || {});
        $super(config);

        this._popupContentAreaId = this._id + '-popup-content-area';
        this._titleAreaId = this._id + '-title-area';
        this._hintAreaId = this._id + '-hint-area';
        this._hint1AreaId = this._id + '-hint1-area';
        this._boxAreaId = this._id + '-box-area';
        this._contentAreaId = this._id + '-content-area';

        this._actionButtonsId = this._id + '-action-buttons';
        this._leftActionButtonsAreaId = this._id + '-left-action-buttons-area';
        this._rightActionButtonsAreaId = this._id + '-right-action-buttons-area';

        this._titleCls = this._getConfigParam('titleCls', '');
        this._scrollable = this._getConfigParam('scrollable');
        this._isRemoved = false;

        if (this._scrollable) {
            this._cls += ' popup-panel-scrollable';
        }
    },

    _initComponentElement: function($super) {
        $super();
        Jsw.render(this._componentElement, this.view());
        this.show();
    },

    view: function () {
        var ce = Jsw.createElement;
        return ce('.popup-wrapper', ce('.popup-container', [
            ce('.popup-heading', ce('.popup-heading-area', [
                ce('span.popup-heading-actions', this._getHeadingActions()),
                ce('h2.' + this._titleCls,
                    ce('span#' + this._titleAreaId, {
                        'title': this._getConfigParam('title')
                    }, this._getConfigParam('title'))
                )
            ])),
            ce('.popup-content', ce('#' + this._popupContentAreaId + '.popup-content-area',
                this._getContentArea()
            ))
        ]));
    },

    _getHeadingActions: function () {
        return '';
    },

    _getContentArea: function () {
        var ce = Jsw.createElement;
        return [
            ce('p#' + this._hint1AreaId),
            ce('span#' + this._hintAreaId),
            this._getBoxArea(),
            this._getButtonsArea()
        ];
    },

    _getBoxArea: function () {
        var ce = Jsw.createElement;
        return ce('#' + this._boxAreaId + '.form-box', ce('.box-area', ce('.content',
            ce('#' + this._contentAreaId + '.content-area')
        )));
    },

    _getButtonsArea: function () {
        var ce = Jsw.createElement;
        var buttonsRow = ce('#' + this._rightActionButtonsAreaId + '.field-value', ' ');
        if (this._getConfigParam('singleRowButtons')) {
            buttonsRow = ce('.single-row', buttonsRow);
        } else {
            buttonsRow = [
                ce('#' + this._leftActionButtonsAreaId + '.field-name', ' '),
                buttonsRow
            ];
        }
        return ce('#' + this._actionButtonsId + '.btns-box', ce('.box-area', ce('.form-row', buttonsRow)));
    },

    toggleButtonsArea: function (bool) {
        if (this._scrollable) {
            this._componentElement.toggleClassName('popup-panel-scrollable', bool);
        }
        $(this._actionButtonsId).toggle(bool);
    },

    setBoxType: function(type) {
        $(this._boxAreaId).className = type;
        if ('list-box' == type) {
            $(this._actionButtonsId).addClassName('no-separator');
            $(this._actionButtonsId).addClassName('simple-box');
        }
        if ('form-box' == type) {
            $(this._actionButtonsId).removeClassName('no-separator');
            $(this._actionButtonsId).removeClassName('simple-box');
        }
        if ('fm-box' == type) {
            $(this._boxAreaId).className = 'list-box';
            $(this._actionButtonsId).addClassName('no-separator');
        }
    },

    /**
     * @param {String} cls
     */
    setTitleType: function(cls) {
        $(this._titleAreaId).parentNode.className = cls;
    },

    /**
     * @param {String} text
     */
    setTitle: function(text) {
        $(this._titleAreaId).update(text).setAttribute('title', text);
    },

    /**
     * @param {String} text
     */
    setHint: function(text) {
        if ('' == text) {
            $(this._hintAreaId).hide();
        } else {
            $(this._hintAreaId).update(text);
            $(this._hintAreaId).show();
        }
    },

    /**
     * @param {String} text
     */
    setHint1: function(text) {
        if ('' == text) {
            $(this._hint1AreaId).hide();
        } else {
            $(this._hint1AreaId).update(text);
            $(this._hint1AreaId).show();
        }
    },

    /**
     * Remove this component.
     */
    remove: function() {
        this._isRemoved = true;
        this._renderTarget.remove();
    },

    /**
     * @param {String} title
     * @param {Function} handler
     * @param {Boolean} [isDefault]
     * @param {Boolean} [isAction]
     * @param {Object} [params]
     * @returns {Element}
     */
    addRightButton: function(title, handler, isDefault, isAction, params) {
        var button = this._createButton(title, handler, isDefault, isAction, params);
        $(this._rightActionButtonsAreaId).insert(button);
        return button;
    },

    /**
     * @param {String} title
     * @param {Function} handler
     * @param {Boolean} [isDefault]
     * @param {Boolean} [isAction]
     * @param {Object} [params]
     * @returns {Element}
     */
    addLeftButton: function(title, handler, isDefault, isAction, params) {
        var button = this._createButton(title, handler, isDefault, isAction, params);
        $(this._leftActionButtonsAreaId).insert(button);
        return button;
    },

    /**
     * Clear right buttons area.
     */
    removeRightButtons: function() {
        $(this._rightActionButtonsAreaId).update(' ');
    },

    /**
     * Clear left buttons area.
     */
    removeLeftButtons: function() {
        $(this._leftActionButtonsAreaId).update(' ');
    },

    /**
     * Update list size.
     */
    resizeList: function() {
        if (this._isRemoved) {
            return;
        }

        var minHeigh = 150;
        var list = $(this._contentAreaId).down('table');
        var listContainer = $(this._contentAreaId).down('.list');

        var bodyHeight = (Prototype.Browser.IE)
            ? $(document.documentElement).getHeight()
            : $(document.body).getHeight();

        var buttonsHeight = $(this._actionButtonsId).getHeight();
        var top = Position.cumulativeOffset(list)[1];
        var height = list.getHeight();
        var newHeight = bodyHeight - top - buttonsHeight - 100; // 100px below dialog

        if (newHeight > height) {
            listContainer.style.height = '';
            listContainer.removeClassName('with-scroll');
            return;
        }

        if (newHeight < minHeigh) {
            newHeight = minHeigh;
        }

        listContainer.style.height = newHeight + 'px';
        listContainer.style.overflowY = 'auto';
        listContainer.style.overflowX = 'hidden';
        listContainer.addClassName('with-scroll');
    },

    /**
     * @param {String} title
     * @param {Function} handler
     * @param {Boolean} [isDefault]
     * @param {Boolean} [isAction]
     * @param {Object} [params]
     * @returns {Element}
     * @private
     */
    _createButton: function(title, handler, isDefault, isAction, params) {
        params = (typeof params !== 'undefined') ? params : {};

        var buttonContainer = new Element('span', params);
        buttonContainer.addClassName('btn');
        if (isAction) {
            buttonContainer.addClassName('action');
        }

        buttonContainer.update(
            '<button value="" type="' + (isDefault ? 'submit' : 'button') + '">' +
                title +
            '</button>'
        );
        buttonContainer.down('button').observe(
            'click',
            this._onClick.bindAsEventListener(this, handler.bind(this))
        );

        return buttonContainer;
    },

    _updateButton: function(element, config) {
        $H(config).each(function(pair) {
            switch (pair.key) {
            case 'title':
                element.down('button').update(pair.value);
                break;
            case 'disabled':
                element.down('button').disabled = pair.value ? true : false;
                pair.value ? Element.addClassName(element, 'disabled')
                           : Element.removeClassName(element, 'disabled');
                break;
            }
        });
    },

    _onClick: function(event, handler) {
        Event.stop(event);
        handler(event);
    },

    _addEvents: function($super) {
        $super();

        if ($(this._hintAreaId)) {
            $(this._hintAreaId).hide();
        }
        if ($(this._hint1AreaId)) {
            $(this._hint1AreaId).hide();
        }
    },

    _clearMessages: function() {
        var contentElement = $(this._popupContentAreaId);

        ['.msg-error', '.msg-info', '.msg-warning'].each(function(msgClass) {
            contentElement.select(msgClass).each(function(messageElement) {
                messageElement.remove();
            });
        });
    },

    _addErrorMessage: function(message) {
        this._addStatusMessage('error', message);
    },

    _addStatusMessage: function(status, message) {
        $(this._popupContentAreaId).insert(
            {
                top:
                    '<div class="msg-box msg-' + status + '">' +
                        '<div>' +
                            '<div>' +
                                '<div>' +
                                    '<div>' +
                                        '<div>' +
                                            '<div class="msg-content">' +
                                                message +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
            }
        );
    },

    _userError: function(error) {
        Jsw.clearStatusMessages();
        Jsw.addStatusMessage('error', error);
        this._close();
    },

    _internalError: function(error) {
        Jsw.clearStatusMessages();
        Jsw.addStatusMessage('error', 'Internal error: ' + error);
        this._close();
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.AjaxPopupForm
 * @extends Jsw.PopupForm
 */
Jsw.AjaxPopupForm = Class.create(Jsw.PopupForm, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._url = this._getConfigParam('url');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.down('.popup-content-area').update('<div class="ajax-loading">' + this.lmsg('waitMsg') + '</div>');
        new Ajax.Request(Jsw.prepareUrl(this._url), {
            method: 'get',
            onSuccess: this._onSuccess.bind(this)
        });
    },

    _onSuccess: function(transport) {
        this._componentElement.down('.popup-content-area').update(transport.responseText);
        (function () {
            this._componentElement.down('form').writeAttribute('action', Jsw.prepareUrl(this._url));
            var cancelBtn = Jsw.getComponent('btn-cancel');
            cancelBtn.removeEventObserver('click', cancelBtn._handler);
            cancelBtn._handler = function () {
                this.hide();
            }.bind(this);
            cancelBtn.addEventObserver('click', cancelBtn._handler);
        }).bind(this).defer();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.messageBox
 * @singleton
 */
Jsw.messageBox = {

    /**
     * @property {String} TYPE_OK
     */
    TYPE_OK: 'TYPE_OK',

    /**
     * @property {String} TYPE_YESNO
     */
    TYPE_YESNO: 'TYPE_YESNO',

    _messageBox: null,

    /**
     * Show message box.
     * @param {Object} config
     */
    show: function(config) {
        function factory(config) {
            switch (true) {
                case config.isWebspace:
                    return new Jsw.WebspaceFoldersMessageBox(config);
                case config.isAjax:
                    return new Jsw.MultiCheckboxMessageWindow(config);
                default:
                    return new Jsw.MessageBox(config);
            }
        }
        Jsw.messageBox._messageBox
            ? Jsw.messageBox._messageBox.initialize(config)
            : Jsw.messageBox._messageBox = factory(config);

        Jsw.messageBox._messageBox.show();
    }
};

/**
 * @class Jsw.MessageBox
 * @extends Jsw.ModalDialogBox
 */
Jsw.MessageBox = Class.create(Jsw.ModalDialogBox, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = "popup-panel popup-panel-sm popup-panel-centered confirmation-box";
        this._type = this._getConfigParam('type', Jsw.messageBox.TYPE_YESNO);
        this._text = this._getConfigParam('text', '');
        this._subtype = this._getConfigParam('subtype', null);
        this._description = this._getConfigParam('description', '');
        this._descriptionWrapperTag = this._getConfigParam('descriptionWrapperTag', 'p');
        this._buttonTitles = this._getConfigParam('buttonTitles', null);

        this._onYesClick = this._getConfigParam('onYesClick', null);
        this._onNoClick = this._getConfigParam('onNoClick', null);
        this._onOkClick = this._getConfigParam('onOkClick', null);
        this._needAttention = this._getConfigParam('needAttention', false);
        this._needAttentionText = this._getConfigParam('needAttentionText', '');
        this._needAttentionBlockSubmit = this._getConfigParam('needAttentionBlockSubmit', false);

        if (Jsw.messageBox.TYPE_YESNO == this._type) {
           if (this._onYesClick) {
               this._onYesClickHandler = this._onYesClick.bindAsEventListener(this);
           } else {
               this._onYesClickHandler = this._defaultOnButtonClick.bindAsEventListener(this);
           }
        }
    },

    _getDescriptionCode: function() {
        var descriptionCode = '';
        if (Object.isArray(this._description)) {
            this._description.each(function(item) {
                descriptionCode += '<' + this._descriptionWrapperTag + '>' + item + '</' + this._descriptionWrapperTag +'>';
            })
        } else {
            descriptionCode += '<' + this._descriptionWrapperTag + '>' + this._description + '</' + this._descriptionWrapperTag + '>';
        }
        return descriptionCode;
    },

    _getNeedAttentionCode: function() {
        var needAttentionCode = '';
        if (this._needAttention) {
           needAttentionCode = '<hr>';
           if (this._needAttentionBlockSubmit) {
               needAttentionCode += '<p><span class="b-indent"><span class="b-indent-icon"><input type="checkbox" class="checkbox" id="needAttentionConfirmationCheckbox"></span><label for="needAttentionConfirmationCheckbox">' + this._needAttentionText + '</label></span></p>';
           } else {
               needAttentionCode += '<p class="hint-warning">' + this._needAttentionText + '</p>';
           }
           needAttentionCode += '<hr>';
        }
        return needAttentionCode;
    },

    _initComponentElement: function($super) {
        $super();

        var descriptionCode = this._getDescriptionCode();
        var needAttentionCode = this._getNeedAttentionCode();

        var contentHtml =
            '<div class="popup-wrapper">' +
                '<div class="popup-container">' +
                    '<div class="popup-content">' +
                        '<div class="popup-content-area">' +

                            '<div class="confirmation-msg' + (this._subtype ? ' mw-' + this._subtype : '') + '">' +
                                '<h3>' + this._text + '</h3>' +
                                descriptionCode + needAttentionCode +
                                '<div class="btns-container">';

                if (Jsw.messageBox.TYPE_YESNO == this._type) {
                    var buttonDefault = this._getConfigParam('buttonDefault', 'no');
                    contentHtml += '<button class="btn' + ('yes' == buttonDefault ? ' action' : '') + '" type="button">' + this._buttonTitles.yes + '</button>';
                    contentHtml += '<button class="btn' + ('no' == buttonDefault ? ' action' : '') + '" type="button">' + this._buttonTitles.no + '</button>';
                }

                if (Jsw.messageBox.TYPE_OK == this._type) {
                    contentHtml += '<button class="btn action" type="button">' + this._buttonTitles.ok + '</button>';
                }

            contentHtml +=      '</div>' +
                            '</div>' +

                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        this._updateComponentElement(contentHtml);

        this._componentElement.hide();
    },

    _disableYesButton: function() {
        if (Jsw.messageBox.TYPE_YESNO == this._type) {
            var buttonYes = this._componentElement.down('.btns-container .btn');
            buttonYes.addClassName('disabled').disable();
            Event.stopObserving(buttonYes, 'click', this._onYesClickHandler);
        }
    },

    _enableYesButton: function(button) {
        if (Jsw.messageBox.TYPE_YESNO == this._type) {
            var buttonYes = this._componentElement.down('.btns-container .btn');
            buttonYes.removeClassName('disabled').enable();
            Event.observe(buttonYes, 'click', this._onYesClickHandler);
        }
    },

    _addEvents: function($super) {
        $super();

        // add default behavior - hide dialog
        this._componentElement.select('button').each(function(button) {
            Event.observe(button, 'click', this._defaultOnButtonClick.bindAsEventListener(this));
        }, this);

        if (Jsw.messageBox.TYPE_YESNO == this._type) {
            if (this._onYesClick) {
                var buttonYes = this._componentElement.select('button').first();
                Event.observe(buttonYes, 'click', this._onYesClickHandler);
            }

            if (this._onNoClick) {
                var buttonNo = this._componentElement.select('button').last();
                Event.observe(buttonNo, 'click', this._onNoClick.bindAsEventListener(this));
            }

           if (this._needAttention && this._needAttentionBlockSubmit) {
                var confirmationCheckbox = this._componentElement.select('input').last();
                var top = this;
                Event.observe(confirmationCheckbox, 'click',
                              function() { if ($F(confirmationCheckbox)) {top._enableYesButton()} else {top._disableYesButton()}} );
           }
        }

        if (Jsw.messageBox.TYPE_OK == this._type) {
            if (this._onOkClick) {
                var buttonOk = this._componentElement.select('button').first();
                Event.observe(buttonOk, 'click', this._onOkClick.bindAsEventListener(this));
            }
        }
    },

    _addTooltips: function() {
    },

    _defaultOnButtonClick: function() {
        this.hide();
    },

    show: function($super) {
        $super();
        this._componentElement.select('.action').first().focus();
        if (this._needAttention && this._needAttentionBlockSubmit) {
           this._disableYesButton();
        }
    }

});

/**
 * @class Jsw.AjaxMessageBox
 * @extends Jsw.MessageBox
 */
Jsw.AjaxMessageBox = Class.create(Jsw.MessageBox, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._requestUrl = this._getConfigParam('requestUrl', '');
        this._requestMethod = this._getConfigParam('requestMethod', 'post');
        this._requestParams = this._getConfigParam('requestParams', '');
        this._contentContainerId = this._getConfigParam('contentContainerId', this._id + 'contentContainer');
        this._confirmationCheckboxId = this._getConfigParam('confirmationCheckboxId', this._id + 'confirmationCheckbox');
        this._loadingTitle = this._getConfigParam('loadingTitle', '');
        if (this._progress) {
            return;
        }
        this._progress = false;
    },

    initialize: function ($super, config) {
        if (this._progress) {
            return;
        }
        $super(config);
    },

    _getDescriptionCode: function() {
        return '';
    },

    _getNeedAttentionCode: function($super) {
        return '<div id="' + this._contentContainerId + '"></div>' + $super();
    },

    _showSpinner: function() {
        if (Jsw.messageBox.TYPE_YESNO === this._type) {
            this._progress = true;
            this._componentElement.select('button').first().update('<span class="wait">' + this._buttonTitles.wait + '</span>');
        }
    },

    _hideSpinner: function(button) {
        if (Jsw.messageBox.TYPE_YESNO === this._type) {
            this._progress = false;
            this._componentElement.select('button').first().update(this._buttonTitles.yes);
        }
    },

    show: function($super) {
        $super();
        if (!this._requestUrl || this._progress) {
            return;
        }

        new Ajax.Request(Jsw.prepareUrl(this._requestUrl), {
            method: this._requestMethod,
            parameters: this._requestParams,
            onCreate: this._onCreate.bind(this),
            onSuccess: this._onSuccess.bind(this),
            onFailure: this._onFailure.bind(this)
        });
    },

    _onCreate: function() {
        this._disableYesButton();
        this._showSpinner();
    },

    _onSuccess: function () {
        this._hideSpinner();
        this._enableYesButton();
    },

    _onFailure: function() {
        this._hideSpinner();
        this._enableYesButton();
    }
});

/**
 * @class Jsw.MultiCheckboxMessageWindow
 * @extends Jsw.AjaxMessageBox
 */
Jsw.MultiCheckboxMessageWindow = Class.create(Jsw.AjaxMessageBox, {
    _onSuccess: function(transport) {
        this._hideSpinner();

        var result = transport.responseText.evalJSON();

        var content = result.content;
        var contentCode = '';
        if (Object.isArray(content)) {
            if (content.length > 0) {
                contentCode = '<ul class="ul">';
                content.each(function(item) {
                    contentCode += '<li>' + item + '</li>';
                });
                contentCode += '</ul>';
            }
        } else {
            contentCode = content;
        }

        var descriptionCode = '';
        if (result.description) {
            descriptionCode = '<p><span class="hint-warning">' + result.description + '</span></p>';
        }

        var confirmationCode = '';
        if (result.confirmation) {
            confirmationCode = '<p><span class="b-indent">' +
                '<span class="b-indent-icon">' +
                    '<input type="checkbox" class="checkbox" id="' + this._confirmationCheckboxId + '"/>' +
                '</span>' +
                '<label for="' + this._confirmationCheckboxId + '">' + result.confirmation + '</label>' +
            '</span></p>';
        }

        $(this._contentContainerId).update('' + contentCode + descriptionCode + confirmationCode + '');

        var checkboxes = this._componentElement.select('input[type="checkbox"]');
        var top = this;
        checkboxes.each(function(checkbox) {
            Event.stopObserving(checkbox, 'click');
            Event.observe(checkbox, 'click',
                function() {
                    var enableYesButton = true;
                    top._componentElement.select('input[type="checkbox"]').each(function(confirmationCheckbox) {
                        if (!$F(confirmationCheckbox)) {
                            enableYesButton = false;
                        }
                    });
                    if (enableYesButton) {
                        top._enableYesButton()
                    } else {
                        top._disableYesButton()}
                }
            );
        });

        if (!checkboxes.length) {
            this._enableYesButton();
        }
    }
});

/**
 * @class Jsw.WebspaceFoldersMessageBox
 * @extends Jsw.AjaxMessageBox
 */
Jsw.WebspaceFoldersMessageBox = Class.create(Jsw.AjaxMessageBox, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._successDescription = this._getConfigParam('successDescription', '');
        this._failureDescription = this._getConfigParam('failureDescription', '');
    },

    initialize: function ($super, config) {
        $super(config);
        this._setDescription([]);
    },

    _setDescription: function (folders) {
        var list = folders.map(function (item) {
            return '<li>' + item.name.escapeHTML() + '</li>';
        });
        var message = folders.length
            ? this._description.concat(' ').concat(this._successDescription).concat('<ul>' + list.join('') + '</ul>')
            : this._description;
        $(this._contentContainerId).update(message);
    },

    _onSuccess: function(transport) {
        this._hideSpinner();
        this._enableYesButton();
        try {
            this._setDescription(transport.responseText.evalJSON().data);
        } catch (e) {
            Jsw.showInternalError(transport.responseText);
        }
    },

    _onFailure: function ($super) {
        $super();
        $(this._contentContainerId).update(this._description + ' ' + this._failureDescription);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Popup
 * @extends Jsw.ModalDialogBox
 */
Jsw.Popup = Class.create(Jsw.ModalDialogBox, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._popupContentAreaId = this._id + '-popup-content-area';
        this._titleAreaId = this._id + '-title-area';
        this._actionButtonsId = this._id + '-action-buttons';
        this._rightActionButtonsAreaId = this._id + '-right-action-buttons-area';

        this._contentHeight = this._getConfigParam('contentHeight', null);
        this._closeButtonEnabled = this._getConfigParam('closeButtonEnabled', false);
        this._cls = this._getConfigParam('popupCls', 'popup-panel');
        this._titleCls = this._getConfigParam('titleCls', '');
        this._buttons = this._getConfigParam('buttons', []);
    },

    _initComponentElement: function($super) {
        $super();
        var closeButton = '';
        if (this._closeButtonEnabled) {
            closeButton = '<span class="close" id="' + this._id + '-close"></span>';
        }
        var contentExtraStyle = '';
        if (this._contentHeight) {
            contentExtraStyle = ' style="height:' + this._contentHeight + 'px"';
        }
        this._updateComponentElement(
            '<div class="popup-wrapper">' +
                '<div class="popup-container">' +
                    '<div class="popup-heading">' +
                        '<div class="popup-heading-area">' +
                            closeButton +
                            '<h2 class="' + this._titleCls + '"><span id="' + this._titleAreaId + '" title="' + Jsw.escapeAttribute(this._getConfigParam('title', '')) + '">' +
                                this._getConfigParam('title', '') +
                            '</span></h2>' +
                        '</div>' +
                    '</div>'+
                    '<div class="popup-content">' +
                        '<div class="popup-content-area" id="' + this._popupContentAreaId + '"' + contentExtraStyle + '>' +
                            this._getContentArea() +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    },

    _getContentArea: function() {
        var buttonsArea = '';
        if (this._buttons.size() > 0) {
            buttonsArea = this._getButtonsArea();
        }
        return '' +
            '<form id="' + this.getId() + '-form">' +
                this._getConfigParam('content', '') +
                buttonsArea +
            '</form>';
    },

    _getButtonsArea: function() {
        return '' +
            '<div class="btns-box" id="' + this._actionButtonsId + '">' +
                '<div class="box-area">' +
                    '<div class="form-row">' +
                        '<div class="single-row">' +
                            '<div class="field-value" id="' + this._rightActionButtonsAreaId + '"> </div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    },

    _addEvents: function($super) {
        $super();

        var context = this;

        this._buttons.each(function(buttonDesc) {
            var buttonId = '';
            if ('undefined' !== typeof buttonDesc['id']) {
                buttonId = ' id="' + buttonDesc['id'] + '" ';
            }
            if ('undefined' === typeof buttonDesc['class']) {
                buttonDesc['class'] = '';
            }
            var buttonDisabled = '';
            if ('undefined' !== typeof buttonDesc['disabled'] && buttonDesc['disabled']) {
                buttonDisabled = 'disabled="disabled"';
            }
            var buttonContainer = new Element('span', { 'class': 'btn ' + buttonDesc['class'] });
            buttonContainer.update('<button ' + buttonId + ' value="" type="button" ' + buttonDisabled + '>' + buttonDesc['title'] + '</button>');
            buttonContainer.down('button').observe(
                'click',
                buttonDesc['handler'].bindAsEventListener(this, context)
            );
            $(context._rightActionButtonsAreaId).insert(buttonContainer);
        });

        if (this._closeButtonEnabled) {
            Event.observe($(this._id + '-close'), 'click', this._onCloseClick.bindAsEventListener(this));
        }

        this.show();
    },

    _onCloseClick: function() {
        this.hide();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DoubleListSelector
 * @extends Jsw.Component
 */
Jsw.DoubleListSelector = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._cls = 'doubleListSelect';
        this._name = this._getConfigParam('name', '');
        this._list = this._getConfigParam('list', $A());
        this._dataUrl = this._getConfigParam('dataUrl', null);
        this._selectedMarked = 0;
        this._unselectedMarked = 0;
        this._prevSelectedItem = -1;
        this._isSearchable = this._getConfigParam('isSearchable', false);
        this._isLarge = this._getConfigParam('isLarge', false);
    },

    _initList: function() {
        var elements = {};
        this._list.each(function(element, index) {
            element.marked = false;
            if ('undefined' === typeof element.selected) {
                element.selected = false;
            }

            this._initListItem(element, index, true);
            this._initListItem(element, index, false);
            elements[element.id] = element.selected;
        }, this);
        this._originalSelection = elements;
        this._initInputElement(elements);
    },

    _initComponentElement: function() {
        this._componentElement = $(this._applyTargetId);
        this._componentElement.addClassName('double-list-select');
        this._componentElement.addClassName('dls-icons-1');
        if (this._isLarge) {
            this._componentElement.addClassName('dls-large');
        }

        var searchControlUnselected = this._isSearchable ? this._getSearchControl('unselected') : '';
        var searchControlSelected = this._isSearchable ? this._getSearchControl('selected') : '';
        var ajaxLoading = null === this._dataUrl ? ''
            : '<div class="ajax-loading" style="display: none;">' + this.lmsg('loadingTitle') + '</div>';

        var listHtml =
            '<div class="dls-first-box">' +
                searchControlUnselected +
                '<h4><span>' + this.lmsg('unselectedTitle') + '</span></h4>' +
                '<div  id="' + this._id + '-container-unselected" class="dls-box-area">' + ajaxLoading + '<ul id="' + this._id + '-unselected"></ul></div>' +
            '</div>' +
            '<div class="dls-second-box">' +
                 searchControlSelected +
                '<h4><span>' + this.lmsg('selectedTitle') +'</span></h4>' +
                '<div id="' + this._id + '-container-selected" class="dls-box-area">' + ajaxLoading + '<ul id="' + this._id + '-selected"></ul></div>' +
            '</div>' +
            '<div id="' + this._id + '-controls" class="dls-controls">' +
                '<span id="' + this._id + '-controls-select" class="btn disabled">' +
                    '<button type="button" id="'+ this._id +'-submitSelect" onclick="return false;"><span class="dls-add">&gt;&gt;</span></button>' +
                '</span>' +
                '<span id="' + this._id + '-controls-unselect" class="btn disabled">' +
                    '<button type="button" id="'+ this._id +'-submitUnselect" onclick="return false;"><span class="dls-remove">&lt;&lt;</span></button>' +
                '</span>' +
            '</div>';

        this._updateComponentElement(listHtml);
        this._initList();
    },

    _initListItem: function(element, index, isSelected) {
        var container = null;
        var isHidden = false;
        if (isSelected) {
            container = $(this._id + '-selected');
            isHidden = !element.selected;
        } else {
            container = $(this._id + '-unselected');
            isHidden = element.selected;
        }

        var item = new Element('div', {
            'class': 'dls-item-block'
        })
        .insert('<b>' + element.title.escapeHTML() + '</b>');

        if (element.description) {
            item.insert('<span>' + element.description + '</span>');
        }

        if (element.icons && element.icons.length) {
            var itemIcons = new Element('span', {
                'class': 'dls-icons'
            });

            element.icons.each(function(icon) {
                itemIcons
                .insert('<i class="icon"><img src="' + Jsw.skinUrl + icon.src + '" title="' + icon.title + '"></i>');
            }, this);

            item.insert(itemIcons);
        }

        var listItem = new Element('li', {
            'id': this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item'
        })
        .insert(item);


        container.insert(listItem);
        var context = this;
        listItem.observe('click', function(event) {
            context._toggleItem(index, isSelected, event);
        });
        if (isHidden) {
            listItem.hide();
        }
    },

    _initInputElement: function(elements) {
        var inputElement = $(this._id + '-elements');
        if (!inputElement) {
            inputElement = new Element('input', {
                'id': this._id + '-elements',
                'name': this._name,
                'type': 'hidden'
            });
            this._componentElement.insert(inputElement);
        }
        inputElement.setValue(JSON.stringify(elements));
    },

    _getSearchControl: function(columnId) {
        return '' +
            '<div class="dls-search">' +
                '<input id="' + this._id + '-search-' + columnId + '" class="search-input search-empty" type="text" autocomplete="off"' +
                    ' value="' + this.lmsg('searchTitle') + '"' +
                    ' onfocus="Jsw.getComponent(\'' + this._id + '\').onFocus(this)"' +
                    ' onblur="Jsw.getComponent(\'' + this._id + '\').onBlur(this)"' +
                    ' onkeyup="Jsw.getComponent(\'' + this._id + '\').onToggleSearch(\'' + columnId + '\', this.value);">' +
                '<span id="' + this._id + '-search-button-' + columnId + '" class="search-button icon-search"' +
                    ' onmousedown="Jsw.getComponent(\'' + this._id + '\').onResetSearch(\'' + columnId + '\');">' +
                '</span>' +
            '</div>';
    },

    _addEvents: function() {
        $(this._id + '-controls-select').observe('click', this._onSubmitSelect.bind(this));
        $(this._id + '-controls-unselect').observe('click', this._onSubmitUnselect.bind(this));
    },

    _toggleItem: function(index, isSelected, event) {
        if (this._list[index].marked) {
            this._unmarkItem(index, isSelected, event);
        } else {
            this._markItem(index, isSelected, event);
        }
    },

    _markItem: function(index, isSelected, event) {
        if (('undefined' != typeof event) && event.shiftKey && (-1 != this._prevSelectedItem)) {
            var startIndex = Math.min(index, this._prevSelectedItem);
            var finishIndex= Math.max(index, this._prevSelectedItem);
            for (i = startIndex; i < finishIndex; i++) {
                this._markItem(i, isSelected);
            }
        }

        this._prevSelectedItem = index;

        this._list[index].marked = true;
        $(this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item').addClassName('marked');
        this._updateSelectControls(isSelected, true);
    },

    _unmarkItem: function(index, isSelected, event) {
        this._list[index].marked = false;
        $(this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item').removeClassName('marked');
        this._updateSelectControls(isSelected, false);
    },

    _onSubmitSelect: function() {
        this._list.each(function(element, index) {
            if (element.marked && !element.selected && $(this._id + '-' + index + '-unselected-item').visible()) {
                this._unmarkItem(index, false);
                element.selected = true;
                this._updateElement(element);
                $(this._id + '-' + index + '-unselected-item').hide();
                $(this._id + '-' + index + '-selected-item').show();
            }
        }, this);

        this.onChange();
    },

    _onSubmitUnselect: function() {
        this._list.each(function(element, index) {
            if (element.marked && element.selected && $(this._id + '-' + index + '-selected-item').visible()) {
                this._unmarkItem(index, true);
                element.selected = false;
                this._updateElement(element);
                $(this._id + '-' + index + '-selected-item').hide();
                $(this._id + '-' + index + '-unselected-item').show();
            }
        }, this);

        this.onChange();
    },

    _updateElement: function(element) {
        var elements = JSON.parse($(this._id + '-elements').value);
        elements[element.id] = element.selected;
        $(this._id + '-elements').value = JSON.stringify(elements);
    },

    onChange: function() {},

    onToggleSearch: function(columnId, searchString) {
        var isSelected = (columnId === 'selected');
        searchString = searchString.strip().toLowerCase();

        if (searchString.length) {
            this._toggleSearchButtonIcon(columnId, true);
            this._list.each(function(element, index) {
                if (isSelected !== element.selected) {
                    return;
                }
                var item = $(this._id + '-' + index + '-' + columnId + '-item');
                if (this._isSearchMatched(element, searchString)) {
                    if (!item.visible() && element.marked) {
                        this._updateSelectControls(isSelected, true);
                    }
                    item.show();
                } else {
                    if (item.visible() && element.marked) {
                        this._updateSelectControls(isSelected, false);
                    }
                    item.hide();
                }
            }, this);
        } else {
            this._toggleSearchButtonIcon(columnId, false);
            this._showAllItems(columnId);
        }
    },

    _isSearchMatched: function(element, searchString) {
        var searchIndex = 'undefined' === typeof element.searchIndex
            ? element.title
            : element.searchIndex;

        return -1 !== searchIndex.toLowerCase().indexOf(searchString);
    },

    onFocus: function(element) {
        if (this.lmsg('searchTitle') === element.value) {
            element.value = '';
            element.removeClassName('search-empty');
        }
    },

    onBlur: function(element) {
        if ('' === element.value) {
            this._resetSearchControl(element);
        }
    },

    onResetSearch: function(columnId) {
        this._showAllItems(columnId);
        var element = $(this._id + '-search-' + columnId);
        this._resetSearchControl(element);
        this._toggleSearchButtonIcon(columnId, false);
    },

    _showAllItems: function(columnId) {
        var isSelected = (columnId === 'selected');
        this._list.each(function(element, index) {
            if (isSelected === element.selected) {
                var item = $(this._id + '-' + index + '-' + columnId + '-item');
                if (!item.visible() && element.marked) {
                    this._updateSelectControls(isSelected, true);
                }
                item.show();
            }
        }, this);
    },

    _resetSearchControl: function(element) {
        element.value = this.lmsg('searchTitle');
        element.addClassName('search-empty');
    },

    _toggleSearchButtonIcon: function(columnId, isActive) {
        $(this._id + '-search-button-' + columnId).toggleClassName('search-button-clear', isActive);
    },

    _updateSelectControls: function(isSelected, setMarked) {
        var counter = isSelected ? this._selectedMarked : this._unselectedMarked;
        var controlId = isSelected ? 'unselect' : 'select';

        setMarked ? counter++ : counter--;
        $(this._id + '-controls-' + controlId).toggleClassName('disabled', !counter);

        if (isSelected) {
            this._selectedMarked = counter;
        } else {
            this._unselectedMarked = counter;
        }
    },

    isEmpty: function() {
        return !this._list.any(function(element) { return element.selected; });
    },

    reload: function(params) {
        if (!this._dataUrl) {
            return;
        }

        var reloadUrl = Jsw.addUrlParams(this._dataUrl, params);
        new Ajax.Request(Jsw.prepareUrl(reloadUrl), {
            method: 'get',
            onSuccess: this._onReloadSuccess.bind(this),
            onFailure: this._onReloadFailure.bind(this),
            onException: this._onReloadException.bind(this),
            onCreate: this._onReloadCreate.bind(this),
            onComplete: this._onReloadComplete.bind(this)
        });
    },

    _onReloadSuccess: function(transport) {
        if (!transport.responseText) {
            //:INFO: sometimes happens in FF if you are go to other page during request
            return;
        }

        try {
            var data = transport.responseText.evalJSON();
        } catch (e) {
            Jsw.showInternalError(transport.responseText);
            return;
        }

        if (data.list) {
            this._list = $A(data.list);
        } else if (data.status) {
            Jsw.clearStatusMessages();
            $A(data.statusMessages).each(function(message) {
                Jsw.addStatusMessage(message.status, message.content);
            }.bind(this));
        } else {
            Jsw.showInternalError('Unable to load list data.');
        }

        this._initList();
    },

    _onReloadFailure: function(transport) {
        Jsw.showInternalError(transport.responseText);
    },

    _onReloadException: function(transport, exception) {
        Jsw.showInternalError(exception + "\n" + transport.responseText);
    },

    _onReloadCreate: function(transport) {
        this._list = $A();
        this._componentElement.select('.dls-box-area').each(function(listArea) {
            listArea.select('ul').first().update();
            listArea.select('.ajax-loading').first().show();
        });
    },

    _onReloadComplete: function() {
        this._componentElement.select('.dls-box-area').each(function(listArea) {
            listArea.select('.ajax-loading').first().hide();
        });
    },

    reset: function ()
    {
        this._list.forEach(function (item) {
            item.selected = this._originalSelection[item.id];
        }, this);

        var list = this._list;
        this._onReloadCreate();
        this._onReloadComplete();
        this._list = list;

        this._initList();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.EnhancedDoubleListSelector
 * @extends Jsw.DoubleListSelector
 */
Jsw.EnhancedDoubleListSelector = Class.create(Jsw.DoubleListSelector, {
    _initComponentElement: function() {
        this._componentElement = $(this._applyTargetId);
        this._componentElement.addClassName('edls');

        var searchControlUnselected = this._isSearchable ? this._getSearchControl('unselected') : '';
        var searchControlSelected = this._isSearchable ? this._getSearchControl('selected') : '';

        var listHtml = '' +
            '<div class="edls-wrap">' +
                '<div class="edls-box edls-box-first">' +
                    '<div class="edls-header">' +
                        '<div class="edls-header-title">' + this.lmsg('unselectedTitle') + '</div>' +
                    '</div>' +
                    '<div class="edls-box-wrap">' +
                        searchControlUnselected +
                        '<div class="edls-box-body">' +
                            '<ul class="edls-list" id="' + this._id + '-unselected"></ul>' +
                            '<div class="edls-list-empty" style="display: none;"><span>' + this.lmsg('unselectedEmpty') + '</span></div>' +
                            '<div class="edls-ajax-loading" style="display: none;"><span class="ajax-loading">' + this.lmsg('loadingTitle') + '</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="edls-control">' +
                    '<div class="edls-control-wrap">' +
                        '<div class="edls-control-body">' +
                            '<div class="edls-control-text">' +
                                '<div class="edls-control-text-none">' + this.lmsg('controlTextNone') + '</div>' +
                                '<div class="edls-control-text-first">' +
                                    this.lmsg('controlTextFirst', {'checked': '<b>' + this.lmsg('controlChecked', {'count': '<span class="edls-count">0</span>'}) + '</b>'}) +
                                '</div>' +
                                '<div class="edls-control-text-second">' +
                                    this.lmsg('controlTextSecond', {'checked': '<b>' + this.lmsg('controlChecked', {'count': '<span class="edls-count">0</span>'}) + '</b>'}) +
                                '</div>' +
                            '</div>' +
                            '<div class="edls-control-indicator"><i></i></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="edls-box edls-box-second">' +
                    '<div class="edls-header">' +
                        '<div class="edls-header-title">' + this.lmsg('selectedTitle') + '</div>' +
                    '</div>' +
                    '<div class="edls-box-wrap">' +
                        searchControlSelected +
                        '<div class="edls-box-body">' +
                            '<ul class="edls-list" id="' + this._id + '-selected"></ul>' +
                            '<div class="edls-list-empty" style="display: none;"><span>' + this.lmsg('selectedEmpty') + '</span></div>' +
                            '<div class="edls-ajax-loading" style="display: none;"><span class="ajax-loading">' + this.lmsg('loadingTitle') + '</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        this._updateComponentElement(listHtml);
        this._initList();
    },

    _initList: function($super) {
        $super();

        this._fixListZebra();
    },

    _fixListZebra: function() {
        [$(this._id + '-unselected'), $(this._id + '-selected')].each(function(list) {
            var count = 0;
            list.select('.edls-item').each(function(el) {
                if (el.visible()) {
                    el.addClassName(count % 2 ? 'odd' : 'even');
                    el.removeClassName(count % 2 ? 'even' : 'odd');
                    count++;
                }
            });
            list.next('.edls-list-empty')[count ? 'hide' : 'show']();
        });
    },

    _getSearchControl: function(columnId) {
        var html =
            '<div class="edls-search">' +
                '<span class="edls-check"><input type="checkbox" value="" class="checkbox"></span>' +
                '<span class="edls-search-control">' +
                    '<input type="text" value="" autocomplete="off" class="search-input search-empty"' +
                        ' id="' + this._id + '-search-' + columnId + '"' +
                        ' onfocus="Jsw.getComponent(\'' + this._id + '\').onFocus(this)"' +
                        ' onblur="Jsw.getComponent(\'' + this._id + '\').onBlur(this)"' +
                        ' onkeyup="Jsw.getComponent(\'' + this._id + '\').onToggleSearch(\'' + columnId + '\', this.value);"' +
                        '>' +
                    '<input type="image" src="' + Jsw.skinUrl + '/images/search-input.png" class="search-button"' +
                        ' id="' + this._id + '-search-button-' + columnId + '"' +
                        ' onmousedown="Jsw.getComponent(\'' + this._id + '\').onResetSearch(\'' + columnId + '\');"' +
                        ' onclick="return false;"' +
                        '>' +
                '</span>' +
            '</div>';

        return html;
    },

    _toggleSearchButtonIcon: function(columnId, isActive) {
        var inputIcon = $(this._id + '-search-button-' + columnId);
        inputIcon.toggleClassName('search-button-clear', isActive);
        inputIcon.src = (isActive)
            ? Jsw.skinUrl + '/images/clear-search.png'
            : Jsw.skinUrl + '/images/search-input.png';
    },

    onFocus: function(element) {
        element.removeClassName('search-empty');
    },

    _resetSearchControl: function(element) {
        element.value = '';
        element.addClassName('search-empty');
    },

    _initListItem: function(element, index, isSelected) {
        var container = null;
        var isHidden = false;
        if (isSelected) {
            container = $(this._id + '-selected');
            isHidden = !element.selected;
        } else {
            container = $(this._id + '-unselected');
            isHidden = element.selected;
        }

        var itemCheckbox = new Element('input', {
            'type': 'checkbox',
            'class': 'checkbox',
            'value': ''
        });

        var item = new Element('div', {
            'class': 'edls-item-wrap'
        })
        .insert(new Element('span', {'class': 'edls-check'}).insert(itemCheckbox))
        .insert('<span class="edls-text">' + this._getItemText(element) + '</span>');

        var listItem = new Element('li', {
            'id': this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item',
            'class': 'edls-item'
        })
        .insert(item);

        container.insert(listItem);
        var context = this;
        listItem.observe('click', function(event) {
            context._toggleItemSelection(index, isSelected, event);
        });
        itemCheckbox.observe('click', function(event) {
            event.stopPropagation();
            context._toggleItemCheckbox(itemCheckbox, itemCheckbox.checked);
        });
        if (isHidden) {
            listItem.hide();
        }
    },

    _getItemText: function(element, highlight) {
        var itemIcons = '';
        if (element.icons && element.icons.length) {
            element.icons.each(function(icon) {
                itemIcons += '<i class="icon"><img src="' + Jsw.skinUrl + icon.src + '" title="' + icon.title + '"></i>';
            });
            itemIcons += ' ';
        }
        var itemText = element.title.escapeHTML();
        if (highlight) {
            var resultPos = itemText.indexOf(highlight);
            if (resultPos !== -1) {
                itemText = itemText.substr(0, resultPos) +
                    '<b class="search-result-label">' +
                        itemText.substr(resultPos, highlight.length) +
                    '</b>' +
                    itemText.substr(resultPos + highlight.length);
            }
        }

        return itemIcons + itemText;
    },

    onToggleSearch: function(columnId, searchString) {
        var isSelected = (columnId === 'selected');
        searchString = searchString.strip().toLowerCase();

        if (searchString.length) {
            this._toggleSearchButtonIcon(columnId, true);
            this._list.each(function(element, index) {
                var item = $(this._id + '-' + index + '-' + columnId + '-item');
                if (this._isSearchMatched(element, searchString)) {
                    item.down('.edls-text').update(this._getItemText(element, searchString));
                    if (isSelected === element.selected) {
                        item.show();
                    }
                } else {
                    item.down('.edls-text').update(this._getItemText(element));
                    var checkbox = item.down('.edls-check input');
                    if (item.visible() && checkbox.checked) {
                        this._toggleItemCheckbox(checkbox, false);
                    }
                    item.hide();
                }
            }, this);
        } else {
            this._toggleSearchButtonIcon(columnId, false);
            this._showAllItems(columnId);
        }
    },

    _showAllItems: function(columnId) {
        var isSelected = (columnId === 'selected');
        this._list.each(function(element, index) {
            var item = $(this._id + '-' + index + '-' + columnId + '-item');
            item.down('.edls-text').update(this._getItemText(element));
            if (isSelected === element.selected) {
                item.show();
            }
        }, this);
    },

    _toggleItemSelection: function(index, isSelected, event, batchMode) {
        event.preventDefault();
        this._list[index].selected = !isSelected;
        this._updateElement(this._list[index]);
        $(this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item').hide();
        $(this._id + '-' + index + '-' + (isSelected ? 'unselected' : 'selected') + '-item').show();
        this._toggleItemCheckbox($(this._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item').down('.edls-check input'), false);
        if (!batchMode) {
            this._fixListZebra();
            this.onChange();
        }
    },

    _toggleItemCheckbox: function(checkbox, value) {
        checkbox.checked = value;

        var side = checkbox.up('.edls-box-first') ? 'first' : 'second';
        var count = checkbox.up('.edls-box-' + side).select('.edls-list .edls-check input:checked').length;
        if (value) {
            checkbox.up('.edls-item').addClassName('selected');
        } else {
            checkbox.up('.edls-item').removeClassName('selected');
            checkbox.up('.edls-box').down('.edls-search .checkbox').checked = false;
        }
        checkbox.up('.edls')[count ? 'addClassName' : 'removeClassName']('edls-selected-' + side);
        checkbox.up('.edls').down('.edls-control-text-' + side + ' .edls-count').update(count);
    },

    _updateSelectControls: function(isSelected, setMarked) {},

    _addEvents: function() {
        var context = this;
        var componentElement = this._componentElement;

        this._componentElement.select('.edls-box-wrap').each(function(el) {
            el.observe('mouseover', function() {
                componentElement.addClassName('edls-over');
                componentElement.addClassName(this.up('.edls-box-first') ? 'edls-over-first' : 'edls-over-second');
                componentElement.removeClassName(this.up('.edls-box-first') ? 'edls-over-second' : 'edls-over-first');
            });
            el.observe('mouseleave', function() {
                if (!componentElement.hasClassName('edls-selected-first') && !componentElement.hasClassName('edls-selected-second')) {
                    componentElement.removeClassName('edls-over');
                    componentElement.removeClassName('edls-over-first');
                    componentElement.removeClassName('edls-over-second');
                }
            });
        });

        this._componentElement.observe('mouseleave', function() {
            this.removeClassName('edls-over');
            this.removeClassName('edls-over-first');
            this.removeClassName('edls-over-second');
        });

        this._componentElement.select('.edls-box .edls-search .edls-check input').each(function(element) {
            element.observe('click', function() {
                var value = this.checked;
                this.up('.edls-box').select('.edls-list .edls-check input').each(function(checkbox) {
                    if (value && checkbox.up('.edls-item').visible()) {
                        context._toggleItemCheckbox(checkbox, true);
                    } else {
                        context._toggleItemCheckbox(checkbox, false);
                    }
                });
            });
        });

        this._componentElement.select('.edls-control-wrap').first().observe('click', function(event) {
            var isSelected;
            if (componentElement.hasClassName('edls-over-first')) {
                isSelected = false;
            } else if (componentElement.hasClassName('edls-over-second')) {
                isSelected = true;
            } else {
                return;
            }

            context._list.each(function(element, index) {
                if (element.selected === isSelected) {
                    var item = $(context._id + '-' + index + '-' + (isSelected ? 'selected' : 'unselected') + '-item');
                    if (item.hasClassName("selected")) {
                        context._toggleItemSelection(index, isSelected, event, true);
                    }
                }
            });
            context._fixListZebra();
            context.onChange();
        });
    },

    _onReloadCreate: function() {
        this._list = $A();
        this._componentElement.select('.edls-box').each(function(listArea) {
            listArea.select('ul').first().update();
            listArea.select('.edls-ajax-loading').first().show();
            listArea.select('.edls-list-empty').first().hide();
        });
    },

    _onReloadComplete: function() {
        this._componentElement.select('.edls-box').each(function(listArea) {
            listArea.select('.edls-ajax-loading').first().hide();
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ImageSelector
 * @extends Jsw.Component
 */
Jsw.ImageSelector = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);
        var list = this._getConfigParam('list', {});
        this._list = Object.isArray(list) ? $H() : $H(list);
        var captions = this._getConfigParam('captions', {});
        this._captions = Object.isArray(captions) ? $H() : $H(captions);
        this._name = this._getConfigParam('name', '');
        this._value = this._getConfigParam('value', null);

        this._currentId = this._id + '-current';
        this._listId = this._id + '-list';
    },

    _initComponentElement: function($super) {
        $super();

        this._updateComponentElement(
            '<div class="' + this._cls + '-area">' +
                '<div id="' + this._currentId + '" class="' + this._cls + '-current">' +
                    '<img/>' +
                    '<p>' + this._captions.get('selectedImage').escapeHTML() + '</p>' +
                '</div>' +
                '<div id="' + this._listId + '" class="' + this._cls + '-select clearfix"></div>' +
            '</div>'
        );

        this._valueElement = new Element('input', {
            'id': this._id + '-value',
            'name': this._name,
            'type': 'hidden',
            'value': null
        });

        this._componentElement.insert(this._valueElement);
    },

    _addEvents: function() {
        this._list.each(function(pair) {
            this._addImage(pair.key, pair.value);
        }, this);

        this.set(this._value);
    },

    _addImage: function(value, image) {
        this._componentElement.select('#' + this._listId).each(function(target) {
            var element = new Element('img', {
                'src': image.url,
                'alt': image.title
            });

            target.insert(element);

            element.observe('click', this._onImageClick.bindAsEventListener(this, value));
        }, this);
    },

    _onImageClick: function(event, value)
    {
        this.set(value);
    },

    /**
     * Update component value.
     * @param {String} value
     */
    set: function(value)
    {
        this._valueElement.value = value;
        var image = this._list.get(value);
        this._componentElement.select('#' + this._currentId + ' img').each(function(target) {
            if (image) {
                target.src = image.url;
                target.alt = image.title;
                target.show();
            } else {
                target.hide();
            }
        }, this);

    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ToolList
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.ToolList({
 *         renderTo: document.body,
 *         items: [{
 *             componentType: 'Jsw.toollist.Panel',
 *             title: 'Components',
 *             image: 'class-icons/component-large.png',
 *             items: [{
 *                 componentType: 'Jsw.toollist.Item',
 *                 title: 'Jsw.Box',
 *                 href: './#!/api/Jsw.Box',
 *                 target: '_parent'
 *             }, {
 *                 componentType: 'Jsw.toollist.Item',
 *                 title: 'Jsw.Button',
 *                 href: './#!/api/Jsw.Button',
 *                 target: '_parent',
 *                 attention: true
 *             }]
 *         }, {
 *             componentType: 'Jsw.toollist.Panel',
 *             title: 'Classes',
 *             image: 'class-icons/class-large.png',
 *             items: [{
 *                 componentType: 'Jsw.toollist.Item',
 *                 title: 'Jsw.Locale',
 *                 href: './#!/api/Jsw.Locale',
 *                 target: '_parent'
 *             }]
 *         }, {
 *             componentType: 'Jsw.toollist.Panel',
 *             title: 'Singletons',
 *             image: 'class-icons/singleton-large.png',
 *             items: [{
 *                 componentType: 'Jsw.toollist.Item',
 *                 title: 'Jsw.Cookie',
 *                 href: './#!/api/Jsw.Cookie',
 *                 target: '_parent'
 *             }]
 *         }]
 *     });
 */
Jsw.ToolList = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._tools = this._getConfigParam('tools', null);
        this._cls = this._getConfigParam('cls', 'tools-list-box');
        this._contentAreaId = this._id + '-tools-list';

        if (Object.isArray(this._tools) && (0 == this._operations.size())) {
            this._operations = null;
        }
    },

    _initComponentElement: function($super) {
        $super();
        this._updateComponentElement(
            '<div id="' + this._id + '-box-area" class="box-area">' +
                '<div id="' + this._id + '-content" class="content">' +
                        '<div id="' + this._id + '-content-area" class="content-area">' +
                            '<ul id="' + this._id + '-tools-list" class="tools-list"></ul>' +
                        '</div>' +
                '</div>' +
            '</div>'
        );
    },

    render: function($super) {
        $super();
        Jsw.Tooltip.initData(this._componentElement);
    }
});

Jsw.toollist = {};

/**
 * @class Jsw.toollist.Panel
 * @extends Jsw.Container
 */
Jsw.toollist.Panel = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._contentAreaId = this._id + '-tools-list';
        this._image = this._getConfigParam('image', '');
        this._title = this._getConfigParam('title', '');
    },

    _initComponentElement: function($super) {
        var attributes = { 'class': 'tools-item' };
        var forcedId = this._getConfigParam('id', null);
        if (forcedId) {
            attributes.id = forcedId;
        }

        this._componentElement = new Element('li', attributes);
        this._componentElement.update(new Element('div', {
                'class': 'tool-block'
            }).insert(
                '<span class="tool-icon">'+
                    '<img src="' + this._image + '"/>'+
                '</span>'+
                '<span class="tool-name">' + this._title + '</span>'
            ).insert(new Element('ul', {
                'id': this._id + '-tools-list',
                'class': 'tool-info' })
            )
        );
    }
});

/**
 * @class Jsw.toollist.Item
 * @extends Jsw.Component
 */
Jsw.toollist.Item = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._handler = this._getConfigParam('handler', false);
        if (Object.isString(this._handler)) {
            eval('this._handler = ' + this._handler);
        }
        this._href = this._getConfigParam('href', '#');
        this._target = this._getConfigParam('target', null);
        this._title = this._getConfigParam('title', '');
        this._disabled = this._getConfigParam('disabled', false);
        this._attention = this._getConfigParam('attention', false);
    },

    _initComponentElement: function($super) {
        if (this._disabled) {
            href = '#';
        } else {
            href = this._href;
        }

        if (this._attention) {
            this._title = new Element('span', {
                'class': 'hint-attention'
            }).update(this._title);
        }

        this._componentElement = new Element('li', {
            'id': this._getConfigParam('id', null)
        }).update(new Element('a', {
            'href': href,
            'target': this._target
        }).update(this._title));

        if (this._handler && !this._disabled) {
            var handler = this._handler;
            this._componentElement.down('a').observe('click', function(e) {
                e.preventDefault();
                handler.call(this, e);
            });
        }
    },

    _addTooltips: function() {
        var description = this._getConfigParam('description');
        if (description) {
            this._tooltip = Jsw.Tooltip.init(this._componentElement.down('a'), {text: description});
        }
    }
});

/**
 * @class Jsw.toollist.Button
 * @extends Jsw.Component
 */
Jsw.toollist.Button = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._handler = this._getConfigParam('handler', false);
        if (Object.isString(this._handler)) {
            eval('this._handler = ' + this._handler);
        }
        this._href = this._getConfigParam('href', '#');
        this._target = this._getConfigParam('target', null);
        this._image = this._getConfigParam('image', '');
        this._disabledImage = this._getConfigParam('disabledImage', this._image);
        this._title = this._getConfigParam('title', '');
        this._description = this._getConfigParam('description', '');
        this._disabled = this._getConfigParam('disabled', false);
    },

    _initComponentElement: function($super) {
        var attributes = { 'class': 'tools-item' };
        var forcedId = this._getConfigParam('id', null);
        if (forcedId) {
            attributes.id = forcedId;
        }

        this._componentElement = new Element('li', attributes);

        cls = 'tool-block';
        if (this._disabled) {
            cls += ' tool-block-disabled';
            href = '#';
            image = this.getImagePath(this._disabledImage);
        } else {
            href = this._href;
            image = this.getImagePath(this._image);
        }
        this._componentElement.update(new Element('a', {
                'class': cls,
                'href': href,
                'target': this._target
            }).insert(
                '<span class="tool-icon">'+
                    '<img src="' + image + '"/>'+
                '</span>'+
                '<span class="tool-name">' + this._title + '</span>'+
                '<span class="tool-info">' + this._description + '</span>'
            )
        );

        if (this._handler && !this._disabled) {
            this._componentElement.observe('click', this._handler);
        }
    },

    _addTooltips: function() {
        // don't show tooltips, 'cause we've inline descriptions
    },

    getImagePath: function(path) {
         return Jsw.skinUrl + "/" + path;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.CustomButton
 * @extends Jsw.toollist.Button
 */
Jsw.CustomButton =  Class.create(Jsw.toollist.Button, {
    /**
     * @param {String} path
     * @returns {String}
     */
    getImagePath: function(path) {
        return path;
    }
});

Object.extend(Form.Element.Methods, {
    disable: function(element) {
        element = $(element);
        element.disabled = 'disabled';
        element.addClassName('disabled');
        return element;
    },

    enable: function(element) {
        element = $(element);
        element.disabled = false;
        element.removeClassName('disabled');
        return element;
    }
});

Element.addMethods();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.PasswordMeter
 * @extends Jsw.Component
 */
Jsw.PasswordMeter = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._passwordElement = $(this._getConfigParam('observe', null));
        this._passwordElement.observe('keyup', this._onChange.bind(this));
        this._passwordElement.observe('plesk:passwordGenerated', this._onChange.bind(this));
        this._passwordElement.observe('blur', this._onBlur.bind(this));
        this._requiredStrength = this._getConfigParam('strength', -1);
        this._tag = 'span';
        this._cls = 'password-strength';
    },

    _initComponentElement: function($super) {
        $super();

        this._hintContainer = new Element('span', {class: 'hint-inline hint-info'});
        this._hint = new Element('span');
        this._hint.insert(this.lmsg('hintInfo'));
        this._hintContainer.insert(this._hint);

        this._progress = new Element('i');
        this._componentElement.insert(this._progress);

        this._verdict = new Element('b');
        this._componentElement.insert(this._verdict);
    },

    render: function($super) {
        $super();

        if (!this._tooltip) {
            this._componentElement.insert({'after':this._hintContainer});
            this._tooltip = new Jsw.DynamicPopupHint.Instance({
                title: this.lmsg('title'),
                waitMsg: '',
                url: '',
                placement: 'right',
                target: this._hint
            });
        }
        this._onChange();
    },

    setProgress: function(value) {
        this._progress.writeAttribute('style', 'width: ' + value + '%');
    },

    _onBlur: function() {
        var password = this._passwordElement.value;
        if (!password.empty()) {
            var result = this._applyRules(password);
            this._updateError(result.score);
        }
    },

    _onChange: function() {
        var result = this._applyRules(this._passwordElement.value);
        this._updateVisibility();
        this._updateProgress(result.score);
        this._updateHint(result.unusedRules);
        this._updateVerdict(result.score);
        this._updateColor(result.score);
    },

    _updateVisibility: function() {
        if (this._passwordElement.value === '') {
            this._componentElement.hide();
            this._hintContainer.hide();
        } else {
            this._componentElement.show();
            this._hintContainer.show();
        }
    },

    _applyRules: function (passwd) {
        var unusedRules = [];
        var sum = 0;
        Object.keys(this.rules).forEach(function (rule) {
            var mark = this.rules[rule](passwd);
            if (mark < 0) {
                unusedRules.push({rule: rule, value: -mark});
            } else {
                sum += mark;
            }
        }.bind(this));

        return {
            score: sum,
            unusedRules: unusedRules
        };
    },

    _updateError: function (score) {
        var rowElement = this._passwordElement.up('.form-row');
        if (!rowElement) {
            return;
        }
        if (score <= this._requiredStrength) {
            rowElement.addClassName('error');
            var errorHint = '<span class="error-hint">' + this.lmsg('errorHint') + '</span>';
            rowElement.down('.field-errors').update(errorHint);
            rowElement.down('.field-errors').show();
        } else {
            rowElement.removeClassName('error');
            rowElement.down('.field-errors').update();
            rowElement.down('.field-errors').hide();
        }
    },

    _verdictClasses: {
        verdictNone: 'verdictNone',
        verdictVeryWeak: 'password-strength-very-weak',
        verdictWeak: 'password-strength-weak',
        verdictMediocre: 'password-strength-medium',
        verdictStrong: 'password-strength-strong',
        verdictStronger: 'password-strength-very-strong'
    },

    _updateColor: function (score) {
        var verdict = this._getVerdict(score);
        var newClass = this._verdictClasses[verdict];
        if (this._oldClass == newClass ) {
            return;
        }
        if (this._oldClass) {
            this._componentElement.removeClassName(this._oldClass);
        }
        this._componentElement.addClassName(newClass);
        this._oldClass = newClass;
    },

    _updateHint: function (unusedRules) {
        var description = '';
        if (unusedRules.length) {
            description =  this.lmsg('description') + '<br/><ul>';
            for (var i = 0; i < unusedRules.length && i < 3; ++i) {
                description += "<li>" +  this.lmsg(unusedRules[i].rule) + "</li>";
            }
            description += "</ul>";
        } else {
            description += this.lmsg('yourPasswordIsStrong');
        }

        this._tooltip.setContent(description);
    },

    _updateVerdict: function (score) {
        this._verdict.update(this.lmsg(this._getVerdict(score)));
    },

    _updateProgress: function (score) {
        var value = (Math.min(score, 42) / 42) * 100;
        this.setProgress(value);
    },

    _getVerdict: function (score) {
        if (score < 1) {
            return "verdictNone";
        }
        if(score < 16) {
           return "verdictVeryWeak";
        }
        if (score > 15 && score < 25) {
            return "verdictWeak";
        }
        if (score > 24 && score < 35) {
            return "verdictMediocre";
        }
        if (score > 34 && score < 45) {
            return "verdictStrong";
        }
        return "verdictStronger"
    },

    rules: {
        passwordTooShort: function (passwd) {
            return passwd.length < 5 ? -1 : 0;
        },

        passwordLength: function (passwd) {
            if (passwd.length < 5) {
                return 3;
            }
            if (passwd.length > 4 && passwd.length < 8) {
                return 6;
            }
            if (passwd.length > 7 && passwd.length < 16) {
                return 12;
            }
            return 18;
        },

        lettersLowerCase: function (passwd) {
            // [verified] at least one lower case letter
            return passwd.match(/[a-z]/) ? 1 : -1;
        },

        lettersUpperCase: function (passwd) {
            // [verified] at least one upper case letter
            return passwd.match(/[A-Z]/) ? 5 : -1;
        },

        numbers1: function (passwd) {
            // [verified] at least one number
            return passwd.match(/\d+/) ? 5 : -1;
        },

        numbers3: function (passwd) {
            // [verified] at least three numbers
            return passwd.match(/(.*[0-9].*[0-9].*[0-9])/) ? 5 : -1;
        },

        specialChar1: function (passwd) {
            // [verified] at least one special character
            return passwd.match(/[!@#$%^&*?_~]/) ? 5 : -1;
        },
        specialChar2: function (passwd) {
            // [verified] at least two special characters
            return passwd.match(/(.*[!@#$%^&*?_~].*[!@#$%^&*?_~])/) ? 5 : -1;
        },

        comboUpperAndLower: function (passwd) {
            // [verified] both upper and lower case
            return passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ? 2 : -1;
        },

        comboLettersAndNumbers: function (passwd) {
            // [verified] both letters and numbers
            return passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/) ? 2 : -1;
        },

        comboLettersNumbersSpecial: function (passwd) {
            // [verified] letters, numbers, and special characters
            return passwd.match(/([a-zA-Z0-9].*[!@#$%^&*?_~])|([!@#$%^&*?_~].*[a-zA-Z0-9])/) ? 2 : -1;
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.PasswordGenerator
 * @extends Jsw.Component
 */
Jsw.PasswordGenerator = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._passwordElement = $(this._getConfigParam('password', null));
        this._passwordConfirmationElement = $(this._getConfigParam('passwordConfirmation', null));
        this._generateButtonElement = $(this._getConfigParam('generateButton', null));
        this._generateButtonElement.observe('click', this._onGeneratePasswordClick.bind(this));
        this._showButtonElement = $(this._getConfigParam('showButton', null));
        this._showButtonElement.observe('click', this._onShowPasswordClick.bind(this));
        this._showPasswordVisible = true;
        this._showPasswordTitle = this._getConfigParam('showPasswordTitle', '');
        this._hidePasswordTitle = this._getConfigParam('hidePasswordTitle', '');
        this._passwordStrength = this._getConfigParam('passwordStrength', '');
        this._tag = 'span';
    },

    _onGeneratePasswordClick: function() {
        var password = this._generatePassword();
        this._passwordElement.value = password;
        if(this._passwordConfirmationElement) {
            this._passwordConfirmationElement.value = password;
        }
        this._passwordElement.fire('plesk:passwordGenerated');
    },

    _onShowPasswordClick: function() {
        if (this._showPasswordVisible) {
            try {
                this._passwordElement.writeAttribute('type', 'text');
            } catch (err) {
                // IE8 doesn't allow to change input type
            }
            if ('text' == this._passwordElement.type) {
                this._showButtonElement.down().update(this._hidePasswordTitle);
                this._showPasswordVisible = !this._showPasswordVisible;
            } else if (Prototype.Browser.IE && 'undefined' != typeof(prompt)) {
                var newPassword;
                if (newPassword = prompt('', this._passwordElement.value)) {
                    this._passwordElement.value = newPassword;
                    if(this._passwordConfirmationElement) {
                        this._passwordConfirmationElement.value = newPassword;
                    }
                }
            }
        } else {
            this._passwordElement.writeAttribute('type', 'password');
            this._showButtonElement.down().update(this._showPasswordTitle);
            this._showPasswordVisible = !this._showPasswordVisible;
        }
    },

    _symbolClasses: {
        upper: new ObjectRange('A', 'Z').entries(),
        lower: new ObjectRange('a', 'z').entries(),
        number: new ObjectRange('0', '9').entries(),
        special: "!@#$%^&*?_~"
    },

    _generatePassword: function() {
        var password = "";
        var symbolClasses = ['upper', 'lower', 'lower', 'lower', 'number', 'number', 'special', 'number'];

        if ('Stronger' == this._passwordStrength) {
            symbolClasses.push('upper', 'upper', 'lower', 'lower', 'lower', 'lower', 'lower', 'lower');
        }

        symbolClasses.sort(function(a, b) {
            return Math.floor(b.length * Math.random()) - Math.floor(a.length * Math.random());
        });
        symbolClasses.each(function(i) {
            password += this._generateSymbol(i);
        }, this);
        return password;
    },

    _generateSymbol: function(symbolClass) {
        var index = Math.floor(this._symbolClasses[symbolClass].length*Math.random());
        return this._symbolClasses[symbolClass][index];
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Promo
 * @extends Jsw.Container
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.Promo({
 *         renderTo: document.body,
 *         title: 'Promo block',
 *         locale: {
 *             next: '>>',
 *             prev: '<<'
 *         },
 *         items: [
 *             new Jsw.Promo.Item({
 *                 title: 'Jsw.Component',
 *                 text: 'The base class for all Jsw components.',
 *                 iconUrl: 'class-icons/component-large.png',
 *                 buttonText: 'View',
 *                 buttonUrl: './#!/api/Jsw.Component',
 *                 buttonTarget: '_parent'
 *             }),
 *             new Jsw.Promo.Item({
 *                 title: 'Jsw.Box',
 *                 text: 'Component with custom inner html.',
 *                 iconUrl: 'class-icons/class-large.png',
 *                 buttonText: 'View',
 *                 buttonUrl: './#!/api/Jsw.Box',
 *                 buttonTarget: '_parent'
 *             }),
 *             new Jsw.Promo.Item({
 *                 title: 'Jsw.Cookie',
 *                 text: 'Utility class for setting/reading values from browser cookies.',
 *                 iconUrl: 'class-icons/singleton-large.png',
 *                 buttonText: 'View',
 *                 buttonUrl: './#!/api/Jsw.Cookie',
 *                 buttonTarget: '_parent'
 *             }),
 *             new Jsw.Promo.Item({
 *                 title: 'Custom Promo',
 *                 text: 'Text text text...',
 *                 buttonText: 'View'
 *             })
 *         ]
 *     });
 */
Jsw.Promo = Class.create(Jsw.Container, {
    _tag: 'div',

    /**
     * @cfg {String} dataUrl
     */
    /**
     * @cfg {String} title
     */
    /**
     * @cfg {String} rows=3
     */
    /**
     * @cfg {String} cls="p-box home-promo-block"
     */
    /**
     * @cfg {Object} locale
     * @cfg {String} locale.prev
     * @cfg {String} locale.next
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._dataUrl = this._getConfigParam('dataUrl', '');
        this._title = this._getConfigParam('title', '');
        this._rows = this._getConfigParam('rows', 3);
        this._cls = this._getConfigParam('cls', 'p-box home-promo-block');
        this._contentAreaId = this._id + '-content-area';
        this._itemCount = 0;
        this._current = 0;
    },

    _initComponentElement: function($super) {
        $super();
        this._initLayout();
    },

    _initLayout: function() {
        this._componentElement.update(
                '<div class="p-box-tl"><div class="p-box-tr"><div class="p-box-tc"><!----></div></div></div>' +
                '<div class="p-box-ml"><div class="p-box-mr"><div class="p-box-mc">' +
                '<div class="p-box-header">' +
                  '<div class="p-box-header-wrap">' +
                    '<div class="p-box-header-wrap-inner">' +
                      '<div class="p-box-header-text">' +
                        this._title +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="p-box-content">' +
                  '<ul class="tools-list" id="' + this._contentAreaId + '">' +
                  '</ul>' +
                '</div>' +
                '<div class="p-box-footer">' +
                    '<div class="p-box-footer-nav">' +
                        '<a class="prev-link" id="' + this._id + '-prev" href="#"><span>' + this.lmsg('prev') + '</span></a> ' +
                        '<a class="next-link" id="' + this._id + '-next" href="#"><span>' + this.lmsg('next') + '</span></a>' +
                    '</div>' +
                '</div>' +
                '</div></div></div>' +
                '<div class="p-box-bl"><div class="p-box-br"><div class="p-box-bc"><!----></div></div></div>'
        );
    },

    _renderItems: function() {
        this._showCurrentItems();
        if (this._dataUrl) {
            this.reload();
        }
    },

    reload: function() {
        new Ajax.Request(Jsw.prepareUrl(this._dataUrl), {
            method: 'get',
            onSuccess: function(transport) {
                try {
                    var items = transport.responseText.evalJSON();
                } catch (e) {
                    Jsw.showInternalError(transport.responseText);
                    return;
                }
                this._initItems(items);
                this._showCurrentItems();
            }.bind(this),
            onFailure: function(transport) {
                Jsw.showInternalError(transport.responseText);
            }
        });
    },

    _onHide: function(item) {
        for (var i = 0; this._items && i < this._items.length; ++i) {
            if (this._items[i] == item) {
                this._items.splice(i, 1);
                break;
            }
        }

        this._showCurrentItems();
    },

    _addEvents: function() {
        $(this._id + '-next').observe('click', this._onNext.bind(this));
        $(this._id + '-prev').observe('click', this._onPrev.bind(this));
    },

    _onNext: function(event) {
        Event.stop(event);
        this._current += this._rows;
        this._showCurrentItems();
    },

    _onPrev: function(event) {
        Event.stop(event);
        this._current -= this._rows;
        this._showCurrentItems();
    },

    _clampCurrentItem: function () {
        if (this._items.length > this._rows) {
            $(this._id + '-prev').up('div').show();
            $(this._id + '-next').up('div').show();
        } else {
            $(this._id + '-next').up('div').hide();
            $(this._id + '-prev').up('div').hide();
        }

        if (this._current >= this._items.length) {
            this._current = 0;
        } else if (this._current < 0) {
            if (this._rows == 1) {
                this._current = this._items.length - 1;
            } else {
                this._current = this._items.length - this._items.length % this._rows;
            }
        }
    },

    _showCurrentItems: function() {
        if (!this._items.length) {
            this.hide();
            return;
        }
        this.show();

        this._clampCurrentItem();

        this._items.forEach(function (item, i) {
            item.setHideHandler(this._onHide.bind(this));
            item.hide();
            if (i >= this._current && i < this._current + this._rows) {
                Jsw.render($(this._contentAreaId), item);
                item.show();
            }
        }, this);
    }
});

/**
 * @class Jsw.Promo.Item
 * @extends Jsw.Component
 */
Jsw.Promo.Item = Class.create(Jsw.Component, {

    _tag: 'li',

    /**
     * @cfg {String} text
     */
    /**
     * @cfg {String} title
     */
    /**
     * @cfg {String} buttonUrl
     */
    /**
     * @cfg {String} buttonText
     */
    /**
     * @cfg {String} buttonTarget
     */
    /**
     * @cfg {String} hideUrl
     */
    /**
     * @cfg {String} hideText
     */
    /**
     * @cfg {String} iconUrl
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._text = this._getConfigParam('text', '');
        this._title = this._getConfigParam('title', '');
        this._buttonUrl = this._getConfigParam('buttonUrl', '');
        this._buttonText = this._getConfigParam('buttonText', '');
        this._buttonTarget = this._getConfigParam('buttonTarget', '');
        this._hideUrl = this._getConfigParam('hideUrl', '');
        this._hideText = this._getConfigParam('hideText', '');
        this._iconUrl = this._getConfigParam('iconUrl', '');
        this._cls = "tools-item tools-item-active";
    },

    render: function($super) {
        this._componentElement.update(
            '<a class="tool-block" href="' + this._buttonUrl + '" target="' + this._buttonTarget + '">' +
                '<span class="tool-icon"><img src="' + this._iconUrl + '"></span>' +
                '<span class="tool-name">' + this._title.escapeHTML() + '</span>' +
                '<span class="tool-info">' + this._text.escapeHTML() + '</span>' +
            '</a>' +
            '<div class="tool-actions">' +
                '<a href="' + this._buttonUrl + '" class="btn" target="' + this._buttonTarget + '">' + this._buttonText.escapeHTML() + '</a>' +
                '<a href="#" class="link-02" id="' + this._id + '-hide"><span>' + this._hideText.escapeHTML() + '</span></a>' +
            '</div>'
        );
        $super();
    },

    /**
     * @param {Function} handler
     */
    setHideHandler: function (handler) {
        this._hideHandler = handler;
    },

    _onClose: function(event)
    {
        Event.stop(event);
        this._hideHandler(this);
        this._componentElement.remove();
        if (this._hideUrl) {
            new Ajax.Request(this._hideUrl, { method: 'post' });
        }
        return false;
    },

    _addEvents: function() {
        var el = $(this._id + '-hide');
        if (el) {
            el.observe('click', this._onClose.bind(this));
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.UpgradeFailureNotification
 * @extends Jsw.Component
 */
Jsw.UpgradeFailureNotification = Class.create(Jsw.Component, {

    updateInterval: 5,

    _initConfiguration: function($super, config) {

        $super(config);
        this._isBootstrapRunning = this._getConfigParam('isBootstrapRunning');
        this._bootstrapExecutionUrl = this._getConfigParam('bootstrapExecutionUrl');
        this._bootstrapStatusUrl = this._getConfigParam('bootstrapStatusUrl');
        this._upgradeFailedMessage = this._getConfigParam('upgradeFailedMessage');
        this._bootstrapInProgressMessage = this._getConfigParam('bootstrapInProgressMessage');
        this._bootstrapLinkTitle = this._getConfigParam('bootstrapLinkTitle');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.update(
            '<div class="msg-box msg-warning">' +
            '<div><div><div><div><div>' +
            '<div class="msg-content" id="execute-bootstrap-message">' +
                (this._isBootstrapRunning ?
                    '<span class="ajax-loading">' + this._bootstrapInProgressMessage + '</span>' :
                    this._upgradeFailedMessage + ' <a id="execute-bootstrap-link" href="#">' + this._bootstrapLinkTitle +'</a>') +
            '</div>' +
            '</div></div></div></div></div>' +
            '</div>'
        );
    },

    _addEvents: function($super) {
        $super();
        if (this._isBootstrapRunning) {
            this._scheduleUpdateStatus();
        } else {
            $('execute-bootstrap-link').observe('click', this._executeBootstrapper.bind(this));
        }
    },

    _executeBootstrapper: function() {
        new Ajax.Request(Jsw.prepareUrl(this._bootstrapExecutionUrl), {
            method: 'post',
            onCreate: this._onCreateExecute.bind(this),
            onSuccess: this._scheduleUpdateStatus.bind(this),
            onFailure: this._scheduleUpdateStatus.bind(this)
        });
    },

    _onCreateExecute: function() {
        $('execute-bootstrap-message').update('<span class="ajax-loading">' + this._bootstrapInProgressMessage + '</span>');
    },

    _scheduleUpdateStatus: function() {
        this._statusUpdate.bind(this).delay(this.updateInterval);
    },

    _statusUpdate: function() {
        new Ajax.Request(Jsw.prepareUrl(this._bootstrapStatusUrl), {
            method: 'get',
            onSuccess: this._scheduleUpdateStatus.bind(this),
            onFailure: this._scheduleUpdateStatus.bind(this),
            on0: this._scheduleUpdateStatus.bind(this)
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.CustomDescription');

/**
 * @class Jsw.CustomDescription.PopupForm
 * @extends Jsw.PopupForm
 */
Jsw.CustomDescription.PopupForm = Class.create(Jsw.PopupForm, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._hint = this._getConfigParam('hint', '');
        this._value = this._getConfigParam('value', '');
        this._handler = this._getConfigParam('handler', null);
        this._sendButtonId = this._getConfigParam('sendButtonId', 'btn-send');
        this._cancelButtonId = this._getConfigParam('cancelButtonId', 'btn-cancel');
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this.setTitle(this.lmsg('popupTitle'));
        this.setTitleType(this._getConfigParam('titleCls', 'pp-edit-description'));

        $(this._contentAreaId).update(
            '<p>' + this._hint + '</p>' +
            '<textarea id="' + this._id + '-description" class="js-auto-resize" rows="4" maxlength="255" cols="80">' +
                this._value + '</textarea>'
        );

        this.addOkButton();
        this.addCancelButton();
    },

    addOkButton: function() {
        this.addRightButton(this.lmsg('buttonOk'), this._onOkClick, true, true, {id: this._sendButtonId} );
    },

    addCancelButton: function() {
        this.addRightButton(this.lmsg('buttonCancel'), this._onCancelClick, false, false, {id: this._cancelButtonId} );
    },

    _onOkClick: function() {
        this._handler($(this._id + '-description').value);
        this.hide();
    },

    _onCancelClick: function() {
        this.hide();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.ConfirmationPopupManager');

/**
 * @class Jsw.ConfirmationPopupManager.PopupForm
 * @extends Jsw.PopupForm
 */
Jsw.ConfirmationPopupManager.PopupForm = Class.create(Jsw.PopupForm, {
    _sendButtonTitle: '',

    _initConfiguration: function($super, config) {
        config = Object.extend({
            'singleRowButtons': true
        }, config || {});
        $super(config);

        this._prepareUrl = this._getConfigParam('prepareUrl', '');
        this._handlerUrl = this._getConfigParam('handlerUrl', '');
        this._ids = this._getConfigParam('ids', '');
        this._formListItemsAreaId = this._id + '-form-list-items';
        this._formListAreaId = this._id + '-form-list';
        this._formBoxAreaId = this._id + '-form-box';
        this._sendButtonId = this._getConfigParam('sendButtonId', 'btn-send');
        this._cancelButtonId = this._getConfigParam('cancelButtonId', 'btn-cancel');
        this._formDescriptionId =  this._id + '-form-desc';
        this._longtask = this._getConfigParam('longtask', false);
        this._autoload = this._getConfigParam('autoload', true);
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this._setTitle();

        $(this._contentAreaId).update(
            this._getHeadDescription() +
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
            '<div class="box" id="' + this._formBoxAreaId + '"></div>' +
            '<div class="list" id="' + this._formListAreaId + '"></div>' +
            '</form>' +
            this._getBottomDescription()
        );

        var form = $(this._id + '-form');
        form._formSubmit = form.submit;
        form.submit = this._onSubmit.bind(this);
        form.observe('submit', this._onSubmitEvent.bind(this));

        $(this._formBoxAreaId).insert('<div class="ajax-loading">' + this.lmsg('loading') + '</div>');

        this._addButtons();

        if (this._autoload) {
            this._renderPreparePopup();
        }
    },

    reload: function() {
        $(this._formListAreaId).update('');
        $(this._formBoxAreaId).update('<div class="ajax-loading">' + this.lmsg('loading') + '</div>');
        this._preparePopup();
    },

    _addButtons: function() {
        this.addRightButton(this.lmsg('buttonOk'), this._onOkClick, true, true, {id: this._sendButtonId} );
        this.addRightButton(this.lmsg('buttonCancel'), this._onCancelClick, false, false, {id: this._cancelButtonId} );
    },

    _setTitle: function() {
        this.setTitle(this.lmsg('title'));
    },

    _getHeadDescription: function() {
        return '';
    },

    _getBottomDescription: function() {
        return '<p id="' + this._formDescriptionId + '">' + this.lmsg('description') + '</p>';
    },

    _onException: function(transport, exception) {
        this._addErrorMessage('Internal error: ' + exception);
        this.enable();
    },

    _onOkClick: function(e) {
        this._onSubmit(e);
    },

    _onCancelClick: function() {
        this.hide();
    },

    _preparePopup: function() {
        var ids = $H();
        var count = 0;

        this._ids.each(function(id) {
            ids.set('ids[' + count + ']', id);
            count++;
        });

        new Ajax.Request(
            Jsw.prepareUrl(this._prepareUrl), {
                method: 'post',
                parameters: ids,
                onSuccess: this._onSuccessPreparePopup.bind(this),
                onException: this._onException.bind(this)
            }
        );
    },

    _renderPreparePopup: function() {
        this._preparePopup();
    },

    _onSubmitEvent: function(event) {
        this._onSubmit();
        Event.stop(event);
        return false;
    },

    _onSuccessResponse: function(response) {
        this.hide();
        Jsw.redirect(response.redirect);
    },

    _onSuccess: function(transport) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            if ('success' == response.status) {
                this._onSuccessResponse(response);
            } else {
                if (response.redirect) {
                    Jsw.redirect(response.redirect);
                    return;
                }
                this._addErrorMessage(response.message);
                this.enable();
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
            this.enable();
        }
    },

    disable: function() {
        var sendButtonWrapper = $(this._sendButtonId);
        if (sendButtonWrapper) {
            var sendButton = sendButtonWrapper.down('button');
            sendButton.disabled = true;
            sendButtonWrapper.addClassName('disabled');
            if (!this._sendButtonTitle) {
                this._sendButtonTitle = sendButton.innerHTML;
            }
            sendButton.update('<span class="wait">' + this.lmsg('loading') + '</span>');
        }

        var cancelButtonWrapper = $(this._cancelButtonId);
        if (cancelButtonWrapper) {
            cancelButtonWrapper.down('button').disabled = true;
            cancelButtonWrapper.addClassName('disabled');
        }
    },

    enable: function() {
        var sendButtonWrapper = $(this._sendButtonId);
        if (sendButtonWrapper) {
            var sendButton = sendButtonWrapper.down('button');
            sendButton.disabled = false;
            sendButton.update(this._sendButtonTitle);
            sendButtonWrapper.removeClassName('disabled');
        }

        var cancelButtonWrapper = $(this._cancelButtonId);
        if (cancelButtonWrapper) {
            cancelButtonWrapper.down('button').disabled = false;
            cancelButtonWrapper.removeClassName('disabled');
        }
    },

    _onSuccessPreparePopup: function() {
        //should be implemented in child classes
        return true;
    },

    _getLoadingIndicatorItems: function() {
        return [];
    },

    _addLoadingIndicator: function(items) {
        //should be implemented in child classes
    },

    _getAdditionalParams: function(params) {
        //should be implemented in child classes if it necessary
        return params;
    },

    _isValid: function() {
        return true;
    },

    _onSubmit: function(e) {

        this._clearMessages();

        if (!this._isValid()) {
            return;
        }

        var params = $H();
        var count = 0;
        this._ids.each(function(id) {
            params.set('ids[' + count + ']', id);
            count++;
        });
        params = this._getAdditionalParams(params);

        this.disable();
        this._addLoadingIndicator(this._getLoadingIndicatorItems());

        if (this._needFlyEffect()) {
            var context = this;
            var beginOffset = e.target.cumulativeOffset();
            Jsw.getComponent('asyncProgressBarWrapper').fly(beginOffset,
                this._longtask,
                function(){
                    context._sendRequest(params);
                });
        } else {
            this._sendRequest(params);
        }
    },

    _needFlyEffect: function() {
        return (false !== this._longtask);
    },

    _sendRequest: function(params) {
        new Ajax.Request(
            this._handlerUrl,
            {
                method: 'post',
                parameters: params,
                onSuccess: this._onSuccess.bind(this),
                onException: this._onException.bind(this)
            }
        );
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.LookUp
 * @extends Jsw.Component
 */
Jsw.LookUp = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._name = this._getConfigParam('name', null);
        this._cls = this._getConfigParam('cls', 'lookup');
        this._data = this._getConfigParam('data', []);
        this._currentValue = this._getConfigParam('value', null);
        this._newItemValue = this._getConfigParam('newItemValue', null);
        this._dataUrl = this._getConfigParam('dataUrl', null);
        this._copyTitleValue = this._getConfigParam('copyTitleValue', false);
        this._limit = this._getConfigParam('limit', this._dataUrl ? 10 : Jsw.list.ITEMS_UNLIMITED);
        this._lookUpParams = this._getConfigParam('lookUpParams', {});

        if (!this._currentValue && this._newItemValue) {
            this._currentValue = this._newItemValue;
        }
    },

    _initComponentElement: function($super) {
        $super();

        this._valueField = new Element('input', {
            'type': 'hidden',
            'name': this._name
        });

        this._componentElement
            .insert(this._valueField);

        this._inputField = new Element('input', {
            'type': 'text',
            'class': 'form-control'
        });

        this._lookUpButton = new Element('span', {'class': 'form-control-icon form-control-icon-action'})
            .insert(new Element('i', {'class': 'icon-form-control-search'}));

        this._lookUpControl = new Element('div', {'class': 'form-control-group'})
            .insert(this._inputField)
            .insert(this._lookUpButton);

        this._dropdownList = new Element('ul', {'class': 'dropdown-menu lookup-dropdown-menu'});

        this._initCustomLookUpComponent();
        if (this._customLookUpComponent) {
            this._dropdownList
                .insert(new Element('li', {'class': 'dropdown-header'})
                    .update(this.lmsg('label'))
            );
            this._dropdownList
                .insert(new Element('li')
                    .insert(new Element('div', {'class': 'dropdown-menu-content'})
                        .insert(this._lookUpControl)
                )
            );
        } else {
            this._lookUpControl.addClassName('f-large-size');
            this._componentElement
                .insert(this._lookUpControl);
        }

        this._emptyElement = new Element('li')
            .insert(new Element('div', {'class': 'dropdown-menu-content'}).update(this.lmsg('nothingFound')));
        this._dropdownList.insert(this._emptyElement);

        this._componentElement
            .insert(this._dropdownList);

        this._updateValue();

        if (0 < this._data.length) {
            this._updateData(this._data);
        }
        if (this._dataUrl && this._limit == Jsw.list.ITEMS_UNLIMITED) {
            this._getDataByUrl();
        }
    },

    _initCustomLookUpComponent: function() {
        if (!this._newItemValue) {
            return;
        }

        this._customLookUpComponent = new Element('div', {'class': 'input-group'}).update(
            '<input type="text" readonly="" class="form-control f-large-size" value="">' +
            '<span class="input-group-btn">' +
                '<span type="button" class="btn dropdown-toggle">' +
                    '<button type="button">' +
                        '<span class="caret"></span>' +
                    '</button>' +
                '</span>' +
            '</span>'
        );
        this._componentElement.insert(this._customLookUpComponent);

        this._dropdownList
            .insert(this._createItem(this._newItemValue))
            .insert(new Element('li', {'class': 'divider'}));
    },

    _getDataByUrl: function(filter) {
        this._emptyElement.down('div').update(this.lmsg('loading'));
        new Ajax.Request(Jsw.prepareUrl(this._dataUrl), {
            method: 'get',
            parameters: Object.extend({
                filter: filter,
                limit: this._limit
            }, this._lookUpParams),
            onSuccess: function(transport) {
                var response = transport.responseText.evalJSON();
                this._emptyElement.down('div').update(this.lmsg('nothingFound'));
                if ('error' == response.status) {
                    return;
                }

                this._data = response.data;
                this._updateData(this._data);
                this._selectResults(filter, response.itemsCount - this._data.length);
            }.bind(this)
        });
    },

    isEmpty: function() {
        return null === this._currentValue;
    },

    getValue: function() {
        return this._currentValue ? this._currentValue.id : null;
    },

    getItemValue: function() {
        return this._currentValue ? this._currentValue : null;
    },

    getDisplayValue: function() {
        return this._currentValue ? this._currentValue.title : '';
    },

    _openList: function(showAll) {
        this._componentElement.addClassName('open');
        this._lookUpButton.down('i').removeClassName('icon-form-control-search').addClassName('icon-form-control-clear');
        this._fixDropdownPosition();

        var filter = showAll ? '' : this._inputField.getValue().toLocaleLowerCase();
        if (this._dataUrl && this._limit != Jsw.list.ITEMS_UNLIMITED) {
            this._emptyElement.down('div').update(this.lmsg('loading'));
            if (this._getDataTask) {
                clearTimeout(this._getDataTask);
            }
            this._getDataTask = setTimeout(function() {
                this._getDataByUrl(filter);
            }.bind(this), 250);
        } else {
            this._selectResults(filter);
        }
    },

    _closeList: function() {
        this._updateValue();
        this._componentElement.removeClassName('open');
        this._lookUpButton.down('i').addClassName('icon-form-control-search').removeClassName('icon-form-control-clear');
    },

    _updateValue: function() {
        this._valueField.setValue(this._currentValue ? (this._copyTitleValue ?  this._currentValue.title :  this._currentValue.id) : '');
        this._inputField.setValue(this._currentValue && !(this._newItemValue && this._currentValue.id === this._newItemValue.id) ? this._currentValue.title : '');
        if (this._newItemValue) {
            this._componentElement.down('.input-group input').setValue(this._currentValue ? this._currentValue.title : '');
        }
    },

    _selectResults: function(filter, itemsCount) {
        var itemsFound = 0;
        this._dropdownList.select('li').each(function(item) {
            if (!item._item) {
                return;
            }
            if (this._newItemValue && this._newItemValue.id === item._item.id) {
                if (this._currentValue && this._currentValue.id === this._newItemValue.id) {
                    item.hide();
                    item.next().hide();
                } else {
                    item.show();
                    item.next().show();
                }
                return;
            }
            item.removeClassName('active');
            var itemLink = item.select('a').first();
            var itemData = itemLink.innerHTML.stripTags();
            var pos = itemData.toLowerCase().indexOf(filter);
            if (-1 != pos) {
                itemsFound++;
                if (itemsFound <= this._limit) {
                    item.show();
                    itemData = itemData.substr(0, pos)
                        + '<b class="search-result-label">'
                        + itemData.substr(pos, filter.length)
                        + '</b>'
                        + itemData.substr(pos + filter.length);
                } else {
                    item.hide();
                }
            } else {
                item.hide();
            }
            itemLink.update(itemData);
        }.bind(this));

        this._emptyElement.toggle(!itemsFound);
        if (itemsFound) {
            var firstVisibleItem = this._dropdownList.select('li').find(function(el) { return el.visible() });
            if (firstVisibleItem) {
                firstVisibleItem.addClassName('active');
            }
        }

        itemsFound += itemsCount || 0;

        if (itemsFound > this._limit) {
            this._searchMoreElement.down('div').update(this._getSearchMoreText(itemsFound - this._limit));
            this._searchMoreElement.show();
            this._searchMoreElement.previous().show();
        } else {
            this._searchMoreElement.hide();
            this._searchMoreElement.previous().hide();
        }

        this._fixDropdownPosition();
    },

    _addEvents: function($super) {
        $super();

        if (this._customLookUpComponent) {
            this._customLookUpComponent.observe('click', function(event) {
                event.preventDefault();
                Jsw.Tooltip.hide();
                if (this._componentElement.hasClassName('open')) {
                    this._inputField.blur();
                } else {
                    this._openList(true);
                    this._inputField.focus();
                }
            }.bindAsEventListener(this));
        } else {
            this._inputField.observe('focus', this._inputOnFocus.bindAsEventListener(this));
        }
        this._inputField.observe('paste', this._inputOnPaste.bindAsEventListener(this));
        this._inputField.observe('blur', this._inputOnBlur.bindAsEventListener(this));
        this._inputField.observe('keyup', this._inputOnKeyUp.bindAsEventListener(this));
        this._inputField.observe('keydown', this._inputOnKeyDown.bindAsEventListener(this));
        this._lookUpButton.observe('click', this._lookUpButtonOnClick.bindAsEventListener(this));
    },

    _inputOnFocus: function() {
        this._openList(true);
    },

    _inputOnBlur: function(event) {
        // workaround for Google Chrome
        setTimeout(function() {
            this._closeList();
        }.bind(this), 300);
    },

    _inputOnPaste: function(event) {
        setTimeout(function() {
            this._openList();
            var activeItem = this._dropdownList.select('li.active').first();
            if (activeItem) {
                this._currentValue = activeItem._item;
                this._updateValue();
            }
        }.bind(this), 300);
    },

    _inputOnKeyUp: function(event) {
        if ([Jsw.keyCode.UP_ARROW,  Jsw.keyCode.DOWN_ARROW, Jsw.keyCode.LEFT_ARROW, Jsw.keyCode.RIGHT_ARROW, Jsw.keyCode.ENTER, Jsw.keyCode.ESC].indexOf(event.keyCode) != -1) {
            return;
        }

        this._openList();
    },

    _inputOnKeyDown: function(event) {
        if ([Jsw.keyCode.UP_ARROW,  Jsw.keyCode.DOWN_ARROW].indexOf(event.keyCode) != -1) {
            this._onArrowKeyPressed(event.keyCode);
        }

        if (Jsw.keyCode.ESC == event.keyCode) {
            this._closeList();
        }

        if (Jsw.keyCode.ENTER == event.keyCode) {
            var activeItem = this._dropdownList.select('li.active').first();
            if (activeItem) {
                this._currentValue = activeItem._item;
                this._closeList();
                this._componentElement.fire('component:change');
            } else {
                this._closeList();
                this._openList();
            }
        }
    },

    _onArrowKeyPressed: function(keyCode) {
        var nextItem = null;
        var activeItem = this._dropdownList.select('li.active').first();
        if (!activeItem) {
            nextItem = this._dropdownList.select('li').first();
            while (nextItem && !(nextItem.visible() && nextItem._item)) {
                nextItem = nextItem.next();
            }
        } else if (Jsw.keyCode.DOWN_ARROW == keyCode) {
            nextItem = activeItem.next();
            while (nextItem && !(nextItem.visible() && nextItem._item)) {
                nextItem = nextItem.next();
            }
        } else if (Jsw.keyCode.UP_ARROW == keyCode) {
            nextItem = activeItem.previous();
            while (nextItem && !(nextItem.visible() && nextItem._item)) {
                nextItem = nextItem.previous();
            }
        }

        if (nextItem && nextItem.visible() && nextItem._item) {
            nextItem.addClassName('active');
            if (activeItem) {
                activeItem.removeClassName('active');
            }
        }
    },

    _lookUpButtonOnClick: function(event) {
        event.preventDefault();

        if (this._componentElement.hasClassName('open')) {
            this._closeList();
        } else {
            this._openList(true);
        }
    },

    _itemOnClick: function(event) {
        event.preventDefault();
        this._currentValue = event.target.up('li')._item;
        this._closeList();
        this._componentElement.fire('component:change');
    },

    _itemOnOver: function() {
        this._dropdownList.select('li.active').each(function(element) {
            element.removeClassName('active');
        });
    },

    _createItem: function(item) {
        var listItem = new Element('li', {'class': 'dropdown-menu-list-item'}).insert(
            new Element('a', {'href': '#'}).update(item.title.escapeHTML())
        );
        listItem._item = item;
        listItem.observe('click', this._itemOnClick.bindAsEventListener(this));
        listItem.observe('mouseover', this._itemOnOver.bindAsEventListener(this));

        return listItem;
    },

    _getSearchMoreText: function(count) {
        return this.lmsg('moreObjectsAvailable', {count: count});
    },

    _updateData: function(data) {
        this._clearData();

        data.each(function(item) {
            this._dropdownList.insert(this._createItem(item));
        }.bind(this));

        this._addSearchMoreElement();
    },

    _clearData: function() {
        while (this._emptyElement.next()) {
            this._emptyElement.next().remove();
        }
    },

    _addSearchMoreElement: function() {
        this._searchMoreElement = new Element('li')
            .insert(new Element('div', {'class': 'dropdown-menu-content'}));
        this._dropdownList
            .insert(new Element('li', {'class': 'divider'}).hide())
            .insert(this._searchMoreElement.hide());
    },

    _fixDropdownPosition: function() {
        var style = {};
        style[Jsw.isRtl() ? 'right' : 'left'] = null;
        this._dropdownList.setStyle(style);

        var windowWidth = $(document.body).getWidth();
        var width = this._dropdownList.getWidth();
        var offsets = this._dropdownList.cumulativeOffset();
        var delta = (Jsw.isRtl() ? offsets.left : (windowWidth - width - offsets.left))
            - parseInt($$('.page-content')[0].getStyle('padding-left'));

        if (delta < 0) {
            style[Jsw.isRtl() ? 'right' : 'left'] = delta + 'px';
            this._dropdownList.setStyle(style);
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.StatusMessage
 * @extends Jsw.Component
 */
Jsw.StatusMessage = Class.create(Jsw.Component, {
    _initConfiguration: function($super, config) {
        config = Object.extend({
            renderTo: 'main',
            renderMode: 'top'
        }, config || {});
        $super(config);
        this._type = this._getConfigParam('type', 'error');
        this._cls = this._getConfigParam('cls', 'msg-box msg-' + this._type);
        this._title = this._getConfigParam('title', '');
        this._message = this._getConfigParam('message', '');
        this._closable = this._getConfigParam('closable', false);
        this._onClose = this._getConfigParam('onClose', null);
    },

    _initComponentElement: function($super) {
        $super();

        this._updateComponentElement(
            '<div><div><div><div><div>' +
            '<div class="msg-content">' +
            this._renderCloseButton() +
            this._renderMessage() +
            '</div>' +
            '</div></div></div></div></div>'
        );
    },

    _renderMessage: function() {
        var message = '';
        if (this._title) {
            message = '<b>' + this._title + ':</b> ';
        }
        message += this._message;
        return message;
    },

    _renderCloseButton: function() {
        if (!this._closable) {
            return '';
        }
        return '<span class="close"></span>'
    },

    _addEvents: function($super) {
        $super();

        this._componentElement.select('.close').each(function(closeButton) {
            Event.observe(closeButton, 'click', this._onCloseEvent.bind(this));
        }, this);
    },

    _onCloseEvent: function() {
        if (!this._onClose) {
            return;
        }
        this._onClose();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.Observer
 * @singleton
 */
Jsw.Observer = (function(){
    var observers = {};
    var getObservers = function(ns) {
        if ('undefined' == typeof observers[ns]) {
            observers[ns] = [];
        }
        return observers[ns];
    };
    return {
        /**
         * @param {Function} callback
         * @param {String} ns
         */
        append: function(callback, ns) {
            getObservers(ns).push(callback);
        },
        /**
         * @param {Function} callback
         * @param {String} ns
         */
        appendAndCall: function(callback, ns) {
            getObservers(ns).push(callback);
            callback();
        },
        /**
         * @param {Event} event
         * @param {String} ns
         */
        notify: function(event, ns) {
            getObservers(ns).each(function(callback) {
                callback(event);
            });
        }
    };
})();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ResponsiveDropdown
 * @extends Jsw.Container
 */
Jsw.ResponsiveDropdown = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._contentAreaId = this._id + '-content-area';
        this._cls = this._getConfigParam('cls', 'dropdown');
        this._onChange = this._getConfigParam('onChange', false);
        this._hasIcons = this._getConfigParam('hasIcons', true);
        this._forceDropdown = this._getConfigParam('forceDropdown', false);
        this._responsiveClass = this._getConfigParam('responsiveClass', false);
        this._headerClass = this._getConfigParam('headerClass', false);
        this._responsiveHeaderClass = this._getConfigParam('responsiveHeaderClass', false);
    },

    _initComponentElement: function($super) {
        $super();

        if (this._items.length && (this._forceDropdown || this._items.length > 1)) {
            this._updateComponentElement(
                '<a class="btn dropdown-toggle" href="#">' +
                '<span>' + this._getConfigParam('title') + '</span>' +
                ' <em class="caret"></em>' +
                '</a>' +
                '<ul id="' + this._contentAreaId + '" class="dropdown-menu dropdown-menu-flip' + (this._hasIcons ? ' dropdown-icon-menu' : '') + '"></ul>'
            );
            this._componentElement.addClassName(this._cls);
        } else {
            this._componentElement = new Element('span', {
                id: this._id
            }).update(this._getConfigParam('title'));
        }
    },

    _addEvents: function($super) {
        $super();

        this._componentElement.observe('click', function(event) {
            if ($$('.' + this._headerClass).first().hasClassName('r-show-main-header-navbar')) {
                event.stopPropagation();
            }
        }.bind(this));

        var boxElement = this._componentElement.down('.dropdown-toggle');
        if (boxElement) {
            Jsw.DropdownManager.register(
                boxElement,
                function () {
                    return boxElement.up('.dropdown').hasClassName('open');
                },
                function () {
                    boxElement.up('.dropdown').addClassName('open');
                },
                function () {
                    boxElement.up('.dropdown').removeClassName('open');
                }
            );
        }

        this._addResponsiveEvents();
    },

    _addResponsiveEvents: function() {
        if (this._responsiveClass) {
            var dropdown = this;
            var responsiveElement = $$('.' + this._responsiveClass)[0];
            $(document).observe('click', function() {
                dropdown._hide();
            });

            Event.observe(responsiveElement, 'click', function(event) {
                dropdown._show(responsiveElement);
                event.stopPropagation();
            });
        }
    },

    _hide: function() {
        $$('.' + this._headerClass).first().className = this._headerClass;
        $$('.r-item-active').invoke('removeClassName', 'r-item-active');
        $$('.r-page-sidebar-search-active').invoke('removeClassName', 'r-page-sidebar-search-active');
    },

    _show: function(el) {
        var needShow = true;
        if (el.hasClassName('r-item-active')) {
            needShow = false;
        }

        this._hide();
        if (needShow) {
            $$('.' + this._headerClass).first().addClassName(this._responsiveHeaderClass);
            el.addClassName('r-item-active');
        }
    },

    _renderItem: function(item) {
        if (!$(this._contentAreaId)) {
            return;
        }
        var dropdownItem = new Jsw.DropdownItem(item);

        var attributes = {
            'href': item.href ? item.href : '#'
        };
        if (item.target) {
            attributes.target = item.target;
        }

        if (item.dataType) {
            attributes['data-type'] = item.dataType;
        }

        var valueItem = new Element('a', attributes).update(
            (item.iconClass ? '<i class="' + item.iconClass + '"></i>' : '') +
            dropdownItem.title.escapeHTML()
        );
        if (item.description) {
            Jsw.Tooltip.init(valueItem, {text: item.description});
        }

        var liElement = new Element('li');
        if (this._getConfigParam('title') === dropdownItem.title.escapeHTML()) {
            liElement.addClassName('current');
        }
        liElement.appendChild(valueItem);
        $(this._contentAreaId).insert(liElement);

        if (item.disabled) {
            liElement.addClassName('disabled');
            valueItem.observe('click', function(event) {
                event.stop();
            });
        } else if (this._onChange) {
            valueItem.observe('click', this._onChange.bindAsEventListener(this, dropdownItem));
        }
    }

});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.SearchResponsiveDropdown
 * @extends Jsw.ResponsiveDropdown
 */
Jsw.SearchResponsiveDropdown = Class.create(Jsw.ResponsiveDropdown, {

    _initComponentElement: function($super) {
    },

    _addEvents: function($super) {
        this._addResponsiveEvents();
    },

    _addResponsiveEvents: function($super) {
        $super();
        $(this._applyTargetId).observe('click', function(event) {
            if ($$('.' + this._headerClass).first().hasClassName('r-show-top-search')) {
                event.stopPropagation();
            }
        }.bind(this));
    },

    _show: function($super, el) {
        $super(el);
        if ($$('.' + this._headerClass).first().hasClassName(this._responsiveHeaderClass)) {
            $(this._applyTargetId).addClassName('r-page-sidebar-search-active');
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
Jsw.namespace('Jsw.Task.ProgressBar');

/**
 * @class Jsw.Task.ProgressBar
 * @extends Jsw.Container
 */
Jsw.Task.ProgressBar = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);

        this.pe = null;
        this._contentAreaId = this._id + '-content-area';
        this._preparingItems = [];
        this._preparingCounter = 0;
        this._deletedIds = [];
        if (!this._getConfigParam('items')) {
            this.update();
        } else {
            this._itemsReady = true;
        }
    },

    _initComponentElement: function($super) {
        $super();

        var isAsyncProgressBarCollapsed = Jsw.Cookie.get('isAsyncProgressBarCollapsed');

        this._updateComponentElement(
            '<div id="asyncProgressBar" class="async-progress-bar ' + ("true" === isAsyncProgressBarCollapsed ? 'async-progress-bar-collapsed' : '') + ' js-scrollbar-spacer"> ' +
                '<div class="async-progress-bar-wrap">' +
                    '<div id="asyncProgressBarTop" class="async-progress-bar-top">' +
                        '<div class="async-progress-bar-control">' +
                            '<a id="asyncProgressBarControlHide" href="#" class="async-progress-bar-control-hide">' + this.lmsg('progressBarHide') +'</a>' +
                            '<a id="asyncProgressBarControlShow" href="#" class="async-progress-bar-control-show">' + this.lmsg('progressBarShow') +'</a>' +
                        '</div>' +
                        '<div class="async-progress-bar-title">' +
                            '<span id="asyncProgressBarTitleTasks" class="async-progress-bar-title-tasks hidden"></span>' +
                            '<span id="asyncProgressBarTitleTasksError" class="async-progress-bar-title-tasks-error hidden"></span>' +
                            '<span id="asyncProgressBarTitleTasksComplete" class="async-progress-bar-title-tasks-complete hidden"></span>' +
                            '<span id="asyncProgressBarTitleTasksWarning" class="async-progress-bar-title-tasks-warning hidden"></span>' +
                            '<a id="asyncProgressBarHideCompletedTasks" class="async-progress-bar-title-tasks-hide hidden" href="#">' + this.lmsg('hideCompletedTasks') + '</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="async-progress-bar-body">' +
                        '<ul class="async-progress-bar-list" id="' + this._contentAreaId + '">' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    },

    addPreparingItem: function(title) {
        var id = "preparing-" + this._preparingCounter;
        var item = new Jsw.Task.ProgressBar.Item({
            errors: [],
            id: id,
            progressTitle: title,
            status: "flying"
        });
        this._preparingItems.unshift(item);
        this._preparingCounter++;
        this._items.unshift(item);
        return id;
    },

    removePreparingItem: function(id) {
        this._preparingItems = this._preparingItems.filter(function(item) {
            return item.getId() != id;
        });
        this._deletedIds.push(id);
    },

    toggle: function() {
        var element = $('asyncProgressBar');
        element.toggleClassName('async-progress-bar-collapsed');

        Jsw.Cookie.setPermanent(
            'isAsyncProgressBarCollapsed',
            element.hasClassName('async-progress-bar-collapsed'),
            '/'
        );

        this._updateTitle();
    },

    update: function () {
        return new Ajax.Request(Jsw.prepareUrl('/task/task-progress/'), {
            method: 'get',
            onSuccess: function (response) {
                this.removeItemsByIds(this._deletedIds);
                this._deletedIds = [];
                var data = response.responseText.evalJSON();
                this.checkPreviousStatus(data.items);
                this.setItems(data.items);
                this._updateProgressDialog();
                this._itemsReady = true;
                this._renderItems();
            }.bind(this),
            on400: function () {
                // prevents page reload
                return false;
            }
        });
    },

    removeItemsByIds: function(ids){
        if (!ids.length) {
            return;
        }
        var items = this.getItems();
        for (var i = 0; i < ids.length; i++) {
            for (var j = 0; j < items.length; j++) {
                if (items[j].getId() === ids[i]) {
                    items[j].getRenderTarget().remove();
                    items.splice(j, 1);
                    break;
                }
            }
        }
        this.setItems(items);
        this._renderItems();
    },

    checkPreviousStatus: function(items) {
        var context = this;
        items.each(function(item) {
            this._items.each(function(item) {
                if (this['id'] == item.getId()) {
                    this['isRefreshLinkEnabled'] = item['_isRefreshLinkEnabled'];
                    if (this['status'] !== item['_status']) {
                        context.onItemStatusChange(this);
                    }
                    if (('started' !== this['status']) && item.isStarted()) {
                        this['isRefreshLinkEnabled'] = true;
                    }
                }
            }, item);
        }, this);
    },

    onItemStatusChange: function(item) {
    },

    setItems: function(items) {
        this._initItems(this._preparingItems.concat(items));
    },

    removeCompletedTask: function() {
        var ids = this._items.filter(function (item) {
            return !item.isStarted();
        }).map(function (item) {
            return item.getId();
        });

        if (ids.length > 0) {
            new Ajax.Request(Jsw.prepareUrl('/task/task-remove/'), {
                method: 'post',
                parameters: {'ids[]': ids},
                onSuccess: function () {
                    this.removeItemsByIds(ids);
                }.bind(this)
            });
        }
    },

    fly: function(beginOffset, taskName, action) {
        if (!Jsw.BrowserFeatures.transition) {
            action();
            return;
        }

        var item = new Element('div', {'class': 'async-progress-bar-floating-item'});
        item.insert(taskName);
        item.setStyle({
            top: beginOffset.top + 'px',
            left: beginOffset.left + 'px'
        });
        $$('body')[0].insert({bottom: item});
        var progressBarComponent = this;
        var progressBarItemId = progressBarComponent.addPreparingItem(taskName);
        progressBarComponent._renderItems();
        var progressBarPreparingItem = $$('.async-progress-bar-preparing-item-begin').first();
        if ($('asyncProgressBar').hasClassName('async-progress-bar-collapsed')) {
            this.toggle();
        }
        setTimeout(function(){
            var progressBarTotalHeight = progressBarPreparingItem.getHeight();
            progressBarPreparingItem.addClassName('async-progress-bar-preparing-item');
            setTimeout(function(){
                progressBarPreparingItem.addClassName('async-progress-bar-preparing-item-end');
                var endOffset = $$('ul.async-progress-bar-list')[0].cumulativeOffset();
                var endScrollOffset = $$('ul.async-progress-bar-list')[0].cumulativeScrollOffset();
                var progressBar = progressBarPreparingItem.firstDescendant();
                var height = progressBar.measure('height');
                var width = progressBar.measure('width');
                item.setStyle({
                    top: (endOffset.top + endScrollOffset.top - progressBarTotalHeight) + 'px',
                    left: endOffset.left + 'px',
                    height: height + 'px',
                    width: width + 'px'
                });
                item.addClassName('async-progress-bar-floating-item-end');
                var transitionEvents = $w('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd');
                transitionEvents.each(function(ev) {
                    item.observe(ev, function(){
                        transitionEvents.each(function(ev2) {
                            item.stopObserving(ev2);
                        });
                        item.remove();
                        var progressBarItem = Jsw.getComponent(progressBarItemId);
                        progressBarItem.setStatus(progressBarItem.STATUS_PREPARING);
                        var progressBar = progressBarPreparingItem.firstDescendant();
                        progressBar.setStyle({'visibility': 'visible'});
                        action();
                    });
                });
            }, 0);
        }, 0);

        return progressBarItemId;
    },

    progressDialog: function(task, params) {
        var returnUrl = task && task.returnUrl;
        params = Object.extend({
            'progressBarItem': task instanceof Jsw.Task.ProgressBar.Item ? task : Jsw.createComponent(task),
            'locale': this.getLocale(),
            'onHide': function() {
                var task = this._progressDialog.progressBarItem;
                if (task.isComplete()) {
                    task.onComplete();
                } else if (returnUrl) {
                    Jsw.redirect(returnUrl);
                }
                delete this._progressDialog;
                this.show();
            }.bind(this)
        }, params || {});
        this._progressDialog = new Jsw.ProgressDialog(params);

        this.update();
        this.hide();
    },

    _updateProgressDialog: function() {
        if (this._progressDialog) {
            var itemId = this._progressDialog.progressBarItem.getId();
            this._progressDialog.updateItem(this.getItem(itemId));
        }
    },

    _renderItems: function($super) {
        $super();

        this._updateTitle();
        if (this._items.length) {
            this._componentElement.removeClassName('hidden');
            this._setPeriodicalExecutor();
        } else {
            this._componentElement.addClassName('hidden');
        }
    },

    _setPeriodicalExecutor: function() {
        var context = this;
        if (null == this.pe && this._hasStartedTasks()) {
            this.pe = new PeriodicalExecuter(function() {
                context.update();
                if (!context._hasStartedTasks()) {
                    context.pe.stop();
                    context.pe = null;
                }
            }, 5);
        }
    },

    _hasStartedTasks: function() {
        return this._items.any(function (item) {
            return item.isStarted();
        });
    },

    _updateTitle: function() {
        var countRunning = 0;
        var countCompleteError = 0;
        var countComplete = 0;
        var countCompleteWarning = 0;

        this._items.forEach(function (item) {
            if (item.isComplete()) {
                countComplete++;
            } else if (item.isCompleteWithWarning()) {
                countCompleteWarning++;
            } else if (item.isCompleteWithError()) {
                countCompleteError++;
            } else {
                countRunning++;
            }
        });

        var taskRunningElement = $('asyncProgressBarTitleTasks');
        if (countRunning > 0) {
            if (countRunning === this._items.length) {
                taskRunningElement.update(this.lmsg('taskInProgress', {'count': countRunning}));
            } else {
                taskRunningElement.update(countRunning);
            }
            $('asyncProgressBar').removeClassName('async-progress-bar-complete');
            taskRunningElement.removeClassName('hidden');
        } else {
            $('asyncProgressBar').addClassName('async-progress-bar-complete');
            taskRunningElement.addClassName('hidden');
        }
        if (countComplete > 0 || countCompleteWarning > 0 || countCompleteError > 0) {
            $('asyncProgressBarHideCompletedTasks').removeClassName('hidden');
        } else {
            $('asyncProgressBarHideCompletedTasks').addClassName('hidden');
        }

        this._updateTaskTitleElement('asyncProgressBarTitleTasksError', countCompleteError);
        this._updateTaskTitleElement('asyncProgressBarTitleTasksWarning', countCompleteWarning);
        this._updateTaskTitleElement('asyncProgressBarTitleTasksComplete',
            $('asyncProgressBar').hasClassName('async-progress-bar-collapsed') && countComplete === this._items.length
                ? this.lmsg('allTasksCompleted', {'num': countComplete})
                : countComplete
        );
    },

    _updateTaskTitleElement: function(id, title) {
        if(!this._itemsReady) {
            return;
        }
        var element = $(id);

        if (element._oldValue !== undefined && title > element._oldValue) {
            element.update('<span>' +title + '</span>');
        } else {
            element.update(title);
        }
        element.toggleClassName('hidden', title === 0);
        element._oldValue = title;
    },

    _renderItem: function(item) {
        var renderTargetId = this._id + '-item-' + item.getId();
        if (!$(renderTargetId)) {
            $(this._contentAreaId).insert({
                top: '<li id="' + renderTargetId +'" class="async-progress-bar-item"></li>'
            });
        }
        item.setLocale(this.getLocale());
        item.setProgressBarElement(this);
        Jsw.render($(renderTargetId), item);
    },

    _addEvents: function($super) {
        $super();

        var context = this;
        $('asyncProgressBarTop').observe('click', function(e) {
            e.preventDefault();
            context.toggle();
        });
        $('asyncProgressBarHideCompletedTasks').observe('click', function(e) {
            e.preventDefault();
            context.removeCompletedTask();
        });
    }
});

/**
 * @class Jsw.Task.ProgressBar.Item
 * @extends Jsw.Component
 */
Jsw.Task.ProgressBar.Item = Class.create(Jsw.Component, {

    STATUS_COMPLETE: 'done',
    STATUS_ERROR: 'error',
    STATUS_STARTED: 'started',
    STATUS_RUNNING: 'running',
    STATUS_NOT_STARTED: 'not_started',
    STATUS_PREPARING: 'preparing',
    STATUS_FLYING: 'flying',
    STATUS_CANCELED: 'canceled',

    _initConfiguration: function($super, config) {
        $super(config);

        this._id = this._getConfigParam('id', '');
        this._status = this._getConfigParam('status', '');
        this._errors = this._getConfigParam('errors', []);
        this._output = this._getConfigParam('output', []);
        this._isRefreshLinkEnabled = this._getConfigParam('isRefreshLinkEnabled', false)
            && this._getConfigParam('isRefreshAllowed', true);
        this._progressValue = this._getConfigParam('progressValue', 0);
        this._canCancel = this._getConfigParam('canCancel', true);
        this._referrer = this._getConfigParam('referrer', '');
        this._progressBarElement = {};
    },

    render: function() {
        var ce = Jsw.createElement;
        var progressBar = [];
        var element = this.getRenderTarget();

        if (this.isComplete()) {
            element.addClassName('async-progress-bar-item-complete');
            progressBar = ce('.async-progress-bar-item-msg', [
                this.getCloseButton(),
                ce('.async-progress-bar-item-msg-body', [
                    this.getProgressTitle(),
                    this.hasOutput() ? ce('.output-details', ce('ul', this.getOutputString())) : '',
                    this.getRefreshLink()
                ])
            ]);
        } else if (this.isCompleteWithWarning() || this.isCompleteWithError()) {
            element.addClassName(this.isCompleteWithWarning() ? 'async-progress-bar-item-warning' : 'async-progress-bar-item-error');
            progressBar = ce('.async-progress-bar-item-msg', [
                this.getCloseButton(),
                ce('.async-progress-bar-item-msg-body', [
                    this.getProgressTitle(),
                    this.getErrorsString(),
                    this.getRefreshLink()
                ])
            ]);
        } else if (this.isPreparing() || this.isFlying() || this.isProgressUndefined()) {
            if (!this.isProgressUndefined()) {
                element.addClassName('async-progress-bar-preparing-item-begin');
            }
            progressBar = [
                ce('.async-progress-bar-item-heading', {style: this.isFlying() ? 'visibility: hidden' : ''}, [
                    ce('.async-progress-bar-item-title', this.getProgressTitle())
                ]),
                ce('.progress.progress-sm', ce('.progress-bar.progress-bar-striped.active', {style: 'width: 100%'}))
            ];
            var link = this.getProgressDialogLink();
            if (link) {
                progressBar.push(ce('.async-progress-bar-item-footer', [link, '&nbsp;']));
            }
        } else {
            progressBar = [
                ce('.async-progress-bar-item-heading', [
                    ce('.async-progress-bar-item-control', this.getCancelButton()),
                    ce('.async-progress-bar-item-title', this.getProgressTitle())
                ]),
                ce('.progress.progress-sm', ce('.progress-bar', {style: 'width: ' + this.getProgressValue() + '%'})),
                ce('.async-progress-bar-item-footer', [
                    this.getProgressDialogLink(),
                    this.lmsg('percentCompleted', {'percent': this.getProgressValue()})
                ])
            ];
        }
        Jsw.render(element, ce('.async-progress-bar-item-wrap', progressBar), 'inner');

        this._addEvents();
        this._addTooltips();
    },

    getCloseButton: function () {
        var ce = Jsw.createElement;
        return ce('a', {
            href: '#',
            onclick: function (event) {
                event.preventDefault();
                this.remove();
            }.bind(this)
        }, ce('span.close'));
    },

    getSteps: function () {
        return this._getConfigParam('steps', {});
    },

    setProgressBarElement: function(element) {
        this._progressBarElement = element;
    },

    getProgressBarElement: function() {
        return this._progressBarElement;
    },

    getProgressTitle: function() {
        return this._getConfigParam('progressTitleHtml', this._getConfigParam('progressTitle', '').escapeHTML());
    },

    getProgressValue: function() {
        return this._progressValue;
    },

    getStatus: function() {
        return this._status;
    },

    setStatus: function(status) {
        this._status = status;
    },

    getProgressDialogLink: function () {
        if (!Object.keys(this.getSteps()).length) {
            return;
        }
        var ce = Jsw.createElement;
        return ce('.async-progress-bar-item-control', ce('a', {
            href: '#',
            onclick: function (event) {
                event.preventDefault();
                this.getProgressBarElement().progressDialog(this);
            }.bind(this)
        }, this.lmsg('progressDialogLink')))
    },

    getRefreshLink: function() {
        var ce = Jsw.createElement;
        var redirect = this._getConfigParam('redirect');
        if (redirect) {
            return ce('', ce('a', {
                href: '#',
                onclick: function (event) {
                    event.preventDefault();
                    Jsw.redirect(redirect);
                }
            }, redirect.title ? redirect.title.escapeHTML() : this.lmsg('refresh')));
        }

        if (this._isRefreshLinkEnabled && window.location.pathname === this._referrer) {
            return ce('', ce('a', {
                href: '#',
                onclick: function (event) {
                    event.preventDefault();
                    Jsw.redirect(Jsw.prepareUrl(window.location.pathname));
                }
            }, this.lmsg('refresh')));
        }
        return '';
    },

    hasErrors: function() {
        return this._errors.length > 0;
    },

    getErrors: function() {
        return this._errors;
    },

    getErrorsString: function () {
        var hideErrors = this._getConfigParam('hideErrors', false);
        if (hideErrors || !this.hasErrors()) {
            return null;
        }
        var ce = Jsw.createElement;
        return ce('.error-details', ce('ul',
            this.getErrors().map(function (error) {
                return ce('li', String(error).escapeHTML());
            })
        ));
    },

    hasOutput: function() {
        return this._output.length > 0;
    },

    getOutputString: function () {
        return this._output.map(function (line) {
            return '<li>' + String(line).escapeHTML() + '</li>';
        }).join('');
    },

    getCancelButton: function() {
        return ''; // PPP-13558
        if (!this._canCancel) {
            return '';
        }
        var ce = Jsw.createElement;
        return ce('a', {
            href: '#',
            onclick: function (event) {
                event.preventDefault();
                this.remove();
            }.bind(this)
        }, this.lmsg('cancel'));
    },

    isComplete: function() {
        return this.STATUS_COMPLETE === this._status && !this.hasErrors();
    },

    isCompleteWithWarning: function() {
        return this.STATUS_COMPLETE === this._status && this.hasErrors();
    },

    isStarted: function() {
        return this.STATUS_STARTED === this._status || this.STATUS_NOT_STARTED == this._status;
    },

    isPreparing: function() {
        return this.STATUS_PREPARING === this._status;
    },

    isFlying: function() {
        return this.STATUS_FLYING === this._status;
    },

    isProgressUndefined: function() {
        return this._progressValue === -1;
    },

    isCompleteWithError: function() {
        return this.STATUS_ERROR === this._status;
    },

    remove: function () {
        return new Promise(function (resolve) {
            new Ajax.Request(Jsw.prepareUrl('/task/task-remove/'), {
                method: 'post',
                parameters: {'ids[]': [this.getId()]},
                onSuccess: function () {
                    this.getProgressBarElement().removeItemsByIds([this.getId()]);
                    resolve();
                }.bind(this)
            });
        }.bind(this));
    },

    onComplete: function () {
        var redirect = this._getConfigParam('redirect');
        if (!redirect) {
            return;
        }
        if (this.getProgressBarElement()._progressDialog) {
            this.remove().then(function () {
                Jsw.redirect(redirect);
            });
        }
    }
});

/**
 * @class Jsw.Task.ProgressBar.OutputPopup
 * @extends Jsw.Popup
 */
Jsw.Task.ProgressBar.OutputPopup = Class.create(Jsw.Popup, {
    initialize: function($super, event, link) {
        Event.extend(event).preventDefault();

        var config = link.readAttribute('data-config').evalJSON();
        this.setLocale(config.locale);

        var output = link.readAttribute('data-output');
        this._content = '<div class="tree-box" style="height: 400px">' +
            '<p>' + output.escapeHTML().replace(/\n/gm, '<br>') + '</p>' +
            '</div>';

        $super(config);
    },

    _initConfiguration: function($super) {
        $super({
            title: this.lmsg('popupTitle'),
            content: this._content,
            buttons: [{
                title: this.lmsg('popupClose'),
                handler: function(event, popup) {
                    popup.hide();
                }
            }]
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.ScheduledTasks');

/**
 * @class Jsw.ScheduledTasks.OutputPopup
 * @extends Jsw.Task.ProgressBar.OutputPopup
 */
Jsw.ScheduledTasks.OutputPopup = Class.create(Jsw.Task.ProgressBar.OutputPopup, {
    _initConfiguration: function($super, config) {
        var titleMessage = '';
        var titleClass = '';
        if (config.result) {
            titleMessage = 'popupDone';
            titleClass = 'hint-ok';
        } else {
            titleMessage = 'popupError';
            titleClass = 'hint-failed';
        }
        titleMessage = this.lmsg(titleMessage, {
            "task": config.name,
            "seconds": config.seconds
        });

        this._content = '<div>' +
            '<p><span class="' + titleClass + '"><b>' + titleMessage + '</b></span></p>' +
            '</div>' +
            this._content;

        $super(config);
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

(function () {
    var ce = Jsw.createElement;

    /**
     * @class Jsw.ActiveList
     * @extends Jsw.Component
     *
     * Example usage:
     *
     *     @example
     *     new Jsw.ActiveList({
     *         renderTo: document.body,
     *         toolbar: {
     *             buttons: {
     *                 btn1: {
     *                     title: 'Add new item',
     *                     url: '#!'
     *                 }
     *             }
     *         },
     *         layout: 'responsivecolumn',
     *         data: [{
     *             title: 'Item 1',
     *             icon: 'class-icons/component-large.png',
     *             buttons: [{
     *                 title: 'Action 1',
     *                 icon: 'class-icons/class-large.png'
     *             }, {
     *                 title: 'Action 2',
     *                 icon: 'class-icons/singleton-large.png'
     *             }]
     *         }, {
     *             title: 'Item 2',
     *             icon: 'class-icons/component-large.png',
     *             buttons: [{
     *                 title: 'Action 1',
     *                 icon: 'class-icons/class-large.png'
     *             }, {
     *                 title: 'Action 2',
     *                 icon: 'class-icons/singleton-large.png'
     *             }]
     *         }]
     *     });
     */
    Jsw.ActiveList = Class.create(Jsw.Component, {
        _initConfiguration: function($super, config) {
            $super(config);

            this.icons = this._getConfigParam('icons', {});
            this.urls = this._getConfigParam('urls', {});

            this.isCollapsible = this._getConfigParam('isCollapsible', false);
            this.isNew = this._getConfigParam('isNew', false);
            this.isShowItemTitle = this._getConfigParam('isShowItemTitle', true);
            this.layout = this._getConfigParam('layout', 'auto');
            if (Object.isString(this.layout)) {
                this.layout = {
                    type: this.layout
                };
            }

            this.stateCollapsed = (function (cookieName) {
                var stateCollapsed = Jsw.Cookie.get(cookieName);

                try {
                    stateCollapsed = stateCollapsed.evalJSON();
                } catch (e) {
                    stateCollapsed = {}
                }

                return {
                    get: function (item) {
                        return stateCollapsed[item.id] !== undefined;
                    },
                    set: function (item, value) {
                        if (value) {
                            stateCollapsed[item.id] = 1;
                        } else {
                            delete stateCollapsed[item.id];
                        }
                        Jsw.Cookie.setPermanent(cookieName, Object.toJSON(stateCollapsed), '/');
                    }
                };
            })(this.getId() + '-state-collapsed');

            this.itemActions = this._getConfigParam('itemActions', {});
            this.data = this._getConfigParam('data', []);

            this._cls = 'active-list' + (this.isCollapsible ? ' active-list-collapsible' : '');
        },

        _initComponentElement: function ($super) {
            $super();

            Jsw.render(this._componentElement, this.view());
        },

        view: function () {
            return ce(".active-list-wrap",
                this.toolbarView(this._getConfigParam('toolbar')),
                this.itemsView(),
                this.bottomBarView(this._getConfigParam('countMoreItems', 0))
            );
        },

        toolbarView: function (toolbar) {
            if (!toolbar) {
                return '';
            }

            return ce(".a-toolbar.a-toolbar-collapsed",
                ce(".a-toolbar-wrap",
                    ce(".a-toolbar-buttons",
                        ce(".a-toolbar-buttons-wrap",
                            ce("table.a-toolbar-buttons-table[cellspacing=0]",
                                ce("tbody",
                                    ce("tr",
                                        ce("td.a-toolbar-buttons-table-main",
                                            ce(".a-toolbar-buttons-main",
                                                Object.keys(toolbar.buttons).map(function (id) {
                                                    return ce("a.btn", {
                                                        "id": id,
                                                        "href": toolbar.buttons[id].url.escapeHTML()
                                                    }, " " + toolbar.buttons[id].title.escapeHTML());
                                                }.bind(this))
                                            )
                                        ),
                                        ce("td.a-toolbar-buttons-table-misc",
                                            ce(".a-toolbar-buttons-misc",
                                                toolbar.showInformer ? ce("span.btn.btn-informer", {"title": this.lmsg('informerTitle')},
                                                    ce("button[type=button]", {"onclick": this.showInformer.bind(this)}, ce("i.icon", ce("img[alt='']", {"src": this.icons["informer-toolbar"]})))
                                                ) : "",
                                                toolbar.showSearch ? ce("span.btn.btn-search", {"title": this.lmsg('searchTitle')},
                                                    ce("button[type=button]", ce("i.icon", ce("img[alt='']", {"src": this.icons["search-toolbar"]})))
                                                ) : "",
                                                ce(".a-toolbar-buttons-settings.a-toolbar-buttons-settings-inactive",
                                                    ce("span.btn.btn-settings", {"title": this.lmsg('settingsTitle')},
                                                        ce("button[type=button]", ce("i.icon", ce("img[alt='']", {"src": this.icons["settings-toolbar"]})))
                                                    ),
                                                    this.isNew ? ce("span.badge-new", this.lmsg('badgeNew')) : "",
                                                    ce(".popup-box.a-toolbar-buttons-settings-popup",
                                                        ce("table.popup-wrapper[cellspacing=0]", ce("tbody", ce("tr", ce("td.popup-container",
                                                            ce(".c1", ce(".c2", ce(".c3", ce(".c4", ce(".c5",
                                                                ce(".popup-content",
                                                                    ce(".popup-content-area",
                                                                        ce(".settings-list",
                                                                            ce(".settings-item.settings-item-1",
                                                                                ce("h3.settings-item-title",
                                                                                    ce("span", this.lmsg('sortTitle') + ":")
                                                                                ),
                                                                                ce("a.btn" + (toolbar.sortDir === "up" ? ".btn-state-selected" : ""), {"href": this.urls["sort-up"]},
                                                                                    ce("i.icon", ce("img[alt='']", {"src": this.icons["order-ascending"]})),
                                                                                    this.lmsg('orderAscending')
                                                                                ),
                                                                                ce("a.btn" + (toolbar.sortDir === "down" ? ".btn-state-selected" : ""), {"href": this.urls["sort-down"]},
                                                                                    ce("i.icon", ce("img[alt='']", {"src": this.icons["order-descending"]})),
                                                                                    this.lmsg('orderDescending')
                                                                                )
                                                                            ),
                                                                            toolbar.hasClassicView ? ce(".settings-item.settings-item-2",
                                                                                ce("h3.settings-item-title",
                                                                                    ce("span", this.lmsg('modeTitle') + ":")
                                                                                ),
                                                                                ce("a.btn.btn-state-selected", {"href": "#"},
                                                                                    ce("i.icon", ce("img[alt='']", {"src": this.icons["list-type-active"]})),
                                                                                    this.lmsg('typeActive')
                                                                                ),
                                                                                ce("a.btn", {"href": "?list-type=classic"},
                                                                                    ce("i.icon", ce("img[alt='']", {"src": this.icons["list-type-classic"]})),
                                                                                    this.lmsg('typeClassic')
                                                                                )
                                                                            ) : ""
                                                                        )
                                                                    )
                                                                )
                                                            )))))
                                                        ))))
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            );
        },

        itemsView: function () {
            if (!this.data.length) {
                return this.emptyView();
            }

            var items = this.data.map(this.itemView.bind(this));
            if (this.layout.type !== 'responsivecolumn') {
                return items;
            }

            var cls = ['.grid'];
            if (this.layout.stretched !== false) {
                cls.push('.grid-stretched');
            }
            cls = cls.concat((this.layout.columns || 'xl-2 xxl-3').split(' ').map(function (cls) {
                return '.grid-' + cls;
            }));

            return ce(cls.join(''),
                items.map(function (item) {
                    return ce(".grid-col", item);
                })
            );
        },

        emptyView: function () {
            return ce("p", this.lmsg('noObjects'));
        },

        itemView: function (item) {
            var itemClasses = [
                ".active-list-item"
            ], types = [
                'danger', 'warning', 'inactive', 'success'
            ];

            if (item.type && types.indexOf(item.type) > -1) {
                itemClasses.push(".active-list-item-" + item.type);
            }
            if (this.isCollapsible && item.buttons) {
                itemClasses.push(".active-list-item-collapsible");
                itemClasses.push(this.stateCollapsed.get(item) ? ".active-list-item-collapsed" : ".active-list-item-expanded");
            } else {
                itemClasses.push(".active-list-item-expanded");
            }

            return ce("#active-list-item-" + item.id + itemClasses.join(''),
                ce(".active-list-item-wrap",
                    this.itemCaptionView(item),
                    this.itemDetailsView(item)
                )
            );
        },

        itemDetailsView: function (item) {
            var children = [];
            if (item.settings && item.settings.length) {
                children.push(this.itemSettingsView(item));
            }
            if (item.buttons && item.buttons.length) {
                children.push(this.itemToolsView(item));
            }

            if (!children.length) {
                return '';
            }

            return ce(".active-list-details",
                ce(".active-list-details-wrap",
                    children
                )
            );
        },

        itemSettingsView: function (item) {
            return ce(".list",
                ce("table#active-list-item-settings-table-" + item.id+ "[width=100%][cellspacing=0]",
                    ce("tbody",
                        item.settings.map(function (settings, index) {
                            return ce("tr" + (index % 2 ? '.even' : '.odd'),
                                ce("td.min",
                                    ce("span.tooltipData", settings.hint.escapeHTML()),
                                    ce("a.s-btn." + settings.button + "[data-method=post]", {"href": settings.url}, ce("span"))
                                ),
                                ce("td", settings.name.escapeHTML()),
                                ce("td", settings.description.escapeHTML())
                            );
                        })
                    )
                )
            );
        },

        itemToolsView: function (item) {
            return ce(".tools-list-box",
                ce(".box-area",
                    ce(".content",
                        ce(".content-area",
                            ce("ul.tools-list",
                                item.buttons.map(function (button) {
                                    var onClick = null;
                                    if (button.name && this.itemActions[button.name]) {
                                        onClick = function (event) {
                                            event.preventDefault();
                                            this.itemActions[button.name](item, event);
                                        }.bind(this);
                                    } else if (button.handler) {
                                        onClick = Object.isFunction(button.handler)
                                            ? button.handler
                                            : '(' + button.handler + '(event)); return false;';
                                    }

                                    return ce("li.tools-item",
                                        ce("a.tool-block" + (button.disabled ? ".disabled" : ""), {
                                                "href": !button.disabled && button.href ? button.href : null,
                                                "onclick": button.disabled ? null : onClick,
                                                "target": button.target || null,
                                                "data-identity": button.id || null,
                                                "data-action-name": button.name || null,
                                                "rel": button.target === '_blank' ? 'noopener noreferrer' : null
                                            },
                                            ce("span.tool-icon", ce("img[alt='']", {"src": button.icon.escapeHTML()})),
                                            ce("span.tool-name", button.title.escapeHTML()),
                                            button.new ? ce("span.badge-new", this.lmsg('badgeNew')) : "",
                                            Object.isArray(button.additionalComments) ? ce(".span.tool-info",
                                                button.additionalComments.map(function (comment) {
                                                    return comment.escapeHTML();
                                                }).join('<br>')
                                            ) : ''
                                        ),
                                        button.comment ? ce("span.tooltipData", button.comment.escapeHTML()) : ""
                                    );
                                }.bind(this))
                            )
                        )
                    )
                )
            );
        },

        bottomBarView: function (countMoreItems) {
            if (!countMoreItems) {
                return '';
            }

            return ce(".active-list-bottom-bar",
                ce(".active-list-bottom-bar-wrap", this.lmsg("showAll", {
                    "countMoreItems": countMoreItems,
                    "loadAllLink": '<a href="?all=">' + this.lmsg('loadAll') + '</a>',
                    "switchToLink": '<a href="?list-type=classic">' + this.lmsg('switchTo', {"listType": this.lmsg('typeClassic')}) + '</a>'
                }))
            );
        },

        itemCaptionView: function (item) {
            return ce(".caption",
                ce(".caption-wrap",
                    this.itemCaptionHeaderView(item),
                    this.itemCaptionServicesView(item),
                    this.itemCaptionDataView(item),
                    item.additionalHtml ? ce(".caption-data",
                        ce(".caption-data-wrap", item.additionalHtml)
                    ) : '',
                    Object.isArray(item.buttons) && item.buttons.length ? (
                        this.isCollapsible ? ce(".caption-control", {
                                "onclick": this.toggleItem.bind(this, item)
                            },
                            ce("span.caption-control-wrap",
                                ce("i"), " ",
                                ce("span.caption-control-on", this.lmsg('showMore')),
                                ce("span.caption-control-off", this.lmsg('showLess'))
                            )
                        ) : ""
                    ) : ""
                )
            );
        },

        itemCaptionHeaderView: function (item) {
            return ce(".caption-header",
                ce(".caption-widget"),
                ce(".caption-header-wrap",
                    ce(".caption-main",
                        item.icon ? ce(".caption-icon",
                            ce("span", ce("img[alt='']", {"src": item.icon}))
                        ) : "",
                        this.itemCaptionHeadView(item)
                    )
                )
            );
        },

        itemCaptionHeadView: function (item) {
            return ce(".caption-head",
                this.isShowItemTitle ? this.itemCaptionHeadWrapView(item) : "",
                this.itemCaptionSummaryView(item),
                this.itemCaptionToolbarView(item)
            );
        },

        itemCaptionHeadWrapView: function (item) {
            var labels = [],
                labelTypes = ['danger', 'warning', 'success', 'info', 'inactive'];

            if (Object.isArray(item.labels) && item.labels.length) {
                labels = item.labels.map(function (label) {
                    var type = label.type && labelTypes.indexOf(label.type) > -1 ? label.type : '',
                        cls = type === '' ? '' : ('.label-' + type);

                    return ce("span.label" + cls, label.value || '');
                }.bind(this));
            }

            return ce(".caption-head-wrap", {
                    "onclick": this.isCollapsible && item.buttons ? this.onCaptionHeadWrapClick.bind(this, item) : null
                },
                ce("h2.caption-name",
                    ce("span", item.title.escapeHTML())
                ),
                labels,
                Object.isArray(item.primaryActions) && item.primaryActions.length ? ce("span.caption-head-widget",
                    item.primaryActions.map(function (action) {
                        return [ce("a.btn", {"href": action.link},
                            action.title
                        ), ' '];
                    })
                ) : ''
            );
        },

        itemCaptionSummaryView: function (item) {
            return Object.isArray(item.summary) && item.summary.length ? ce(".caption-summary",
                ce(".caption-summary-wrap",
                    item.summary.map(this.summaryItemView.bind(this))
                )
            ) : item.summary || '';
        },

        summaryItemView: function (summaryItem) {
            return ce('span.summary-item', summaryItem.name + ': <b>' + summaryItem.value + '</b>');
        },

        itemCaptionToolbarView: function (item) {
            return Object.isArray(item.toolbar) && item.toolbar.length ? ce(".caption-toolbar",
                ce(".caption-toolbar-wrap",
                    item.toolbar.map(this.toolbarButtonView.bind(this))
                )
            ): "";
        },

        toolbarButtonView: function (button) {
            return ce('a.i-link' + (button.action ? '[data-item-action="' + button.action + '"]' : ''), {href: button.link || null},
                button.icon || button.iconClass ? [ce('i' + (button.iconClass ? '.' + button.iconClass : 'icon'),
                    button.icon ? ce('img[alt=""]', {"src": button.icon}) : ''
                ), ' '] : '',
                ce('span', button.title.escapeHTML())
            );
        },

        itemCaptionServicesView: function (item) {
            return Object.isArray(item.services) ? item.services.map(this.itemServiceView.bind(this)) : "";
        },

        itemServiceView: function (service) {
            return ce(".caption-services" + (service.class ? "." + service.class : ""), {"style": service.hidden ? "display:none" : ""},
                ce(".caption-services-wrap",
                    service.header ? ce(service.headerClass ? "." + service.headerClass : "",
                        service.closeUrl ? ce("span.close", {"data-close-url": service.closeUrl}) : "",
                        service.header
                    ) : "",
                    this.itemServiceBlockView(service)
                )
            );
        },

        itemServiceBlockView: function (service) {
            if (service.grid) {
                var columns = service.grid.reduce(function (columns, service) {
                    return columns + (service.colspan || 1);
                }, 0);
                return ce(".b-grid" + (service.grid.length > 1 ? ".b-grid-" + columns : ""),
                    ce("ul.b-grid-list",
                        service.grid.map(function (subService) {
                            return ce("li.b-grid-item" + (service.grid.length > 1 && subService.colspan ? ".b-grid-item-" + subService.colspan : ""),
                                ce(".b-grid-item-wrap", this.itemServiceBlockView(subService))
                            );
                        }.bind(this))
                    )
                );
            }

            if (service.type) {
                return this['itemService' + service.type.capitalize().camelize() +  'View'](service);
            }

            var icon = ce("img[alt='']", {"src": service.icon});
            var name = service.title.escapeHTML();
            if (service.href) {
                icon = ce("a" + (service.newWindow ? "[target=_blank]" :""), {"href": service.href}, icon);
                name = ce("a" + (service.newWindow ? "[target=_blank]" :""), {"href": service.href}, name);
            }

            var description = service.description ? service.description : '';
            return ce(".caption-service-block",
                ce("span.caption-service-title",
                    ce("i.caption-service-icon", icon),
                    ce("span.caption-service-name", name, description)
                ),
                Object.isArray(service.links) && service.links.length ? ce(".caption-service-toolbar",
                    service.links.map(function (link) {
                        var linkView;
                        if (link.childLinks && link.childLinks.lenght) {
                            linkView = ce(".btn-group",
                                ce("a.btn", {
                                    "href": link.href.escapeHTML(),
                                    "target": link.newWindow ? "_blank" : null
                                }, link.title.escapeHTML),
                                ce("span.btn.dropdown-toggle", ce("button[type=button]", ce("em.caret"))),
                                ce("ul.dropdown-menu",
                                    link.childLinks.map(function (childLink) {
                                        return ce("li",
                                            ce("a", {
                                                "href": childLink.href.escapeHTML(),
                                                "target": childLink.newWindow ? "_blank" : null
                                            }, childLink.title.escapeHTML())
                                        );
                                    })
                                )
                            );
                        } else {
                            var icon = link.icon ? [ce("i.icon", ce("img[alt='']", {"src": link.icon.escapeHTML()})), " "] : "";
                            if (link.isSimpleText) {
                                linkView = ce("span",
                                    icon,
                                    link.noEscape ? link.info : link.info.escapeHTML()
                                );
                            } else if (link.isSimpleLink) {
                                linkView = ce("span" + (link.spanClass ? "." + link.spanClass : ""),
                                    icon,
                                    link.info.escapeHTML() + " ",
                                    ce("a", {
                                        "href": link.href.escapeHTML(),
                                        "class": link.class ? link.class.escapeHTML() : null,
                                        "onclick": link.onClick ? link.onClick.escapeHTML() : null,
                                        "target": link.newWindow ? "_blank" : null
                                    }, link.title.escapeHTML())
                                );
                            } else {
                                linkView = ce("a.btn", {
                                    "href": link.href.escapeHTML(),
                                    "class": link.class ? link.class.escapeHTML() : null,
                                    "onclick": link.onClick ? link.onClick.escapeHTML() : null,
                                    "target": link.newWindow ? "_blank" : null,
                                    "id": link.id ? link.id.escapeHTML() : null,
                                    "name": link.name ? link.name.escapeHTML() : null
                                }, icon, link.title.escapeHTML());
                            }
                        }

                        return [
                            link.newLine ? ce("br") : "",
                            linkView, " "
                        ];
                    })
                ) : ''
            );
        },

        itemCaptionDataView: function (item) {
            if (!item.data) {
                return "";
            }

            return ce(".caption-data",
                ce(".caption-data-wrap",
                    item.data.map(function (data, index) {
                        return ce(".form-group",
                            ce("label.control-label[for=active-list-data-" + item.id + "-" + index + "]", data.label),
                            ce("textarea#active-list-data-" + item.id + "-" + index +
                                ".form-control.code[rows=" + data.linesNumber + "][readonly]", data.text.escapeHTML())
                        );
                    })
                )
            );
        },

        render: function ($super) {
            $super();

            var m = decodeURIComponent(location.href).match('/id/([^0-9]*[0-9]+)');
            if (!m) {
                return;
            }

            var el = $('active-list-item-' + m[1]);
            if (el) {
                $$('.msg-box').each(function (msg) {
                    el.down('.caption-header-wrap').insert({top: msg});
                });
                this.scrollToItem(el);
            }
        },

        onCaptionHeadWrapClick: function (item, event) {
            if (event && event.findElement(".caption-head-action, .caption-head-widget")) {
                return;
            }

            this.toggleItem(item);

            var el = this.getItemElement(item);
            if (el.hasClassName("active-list-item-collapsed")) {
                return;
            }

            var itemBottom = el.cumulativeOffset().top + el.getHeight();
            var viewportBottom = document.viewport.getScrollOffsets().top + document.viewport.getHeight();
            if (itemBottom + 40 > viewportBottom) {
                this.scrollToItem(el, 500);
            }
        },

        getItemElement: function (item) {
            return $('active-list-item-' + item.id);
        },

        _addEvents: function() {
            this._componentElement.select('dropdown-toggle').each(function(element) {
                element.observe('click', function(e){
                    Event.stop(e);
                    var hadClassName = this.up('.btn-group').hasClassName('btn-group-open');
                    $$('.active-list .dropdown-toggle').each(function(elem){
                        elem.up('.btn-group').removeClassName('btn-group-open');
                    });
                    if (!hadClassName) {
                        this.up('.btn-group').addClassName('btn-group-open');
                    }
                });
                $(document.body).observe('click', function() {
                    element.up('.btn-group').removeClassName('btn-group-open');
                });
            });

            this._componentElement.select('.a-toolbar-buttons-misc .btn-search').invoke('observe', 'click', function() {
                this.up('.a-toolbar')
                    .toggleClassName('a-toolbar-collapsed')
                    .toggleClassName('a-toolbar-expanded');
            });

            this._componentElement.select('.a-toolbar-buttons-misc .btn-settings').each(function (el) {
                Jsw.DropdownManager.register(el,
                    function() {
                        return el.up().hasClassName('a-toolbar-buttons-settings-active');
                    },
                    function() {
                        el.up()
                            .addClassName('a-toolbar-buttons-settings-active')
                            .removeClassName('a-toolbar-buttons-settings-inactive');
                    },
                    function() {
                        el.up()
                            .addClassName('a-toolbar-buttons-settings-inactive')
                            .removeClassName('a-toolbar-buttons-settings-active');
                    }
                );
            }, this);

            this._componentElement.select('.caption-services .close').each(function(element) {
                element.observe('click', function(e){
                    Event.stop(e);
                    var closeUrl = this.readAttribute('data-close-url');
                    this.up('.caption').select('.caption-services').map(Element.show);
                    this.up('.caption-services').remove();
                    new Ajax.Request(Jsw.baseUrl + closeUrl, { method: 'post' });
                });
            });

            this._initToolbar();
        },

        showInformer: function () {
            Jsw.getComponent('modal-informer').show();
        },

        _initToolbar: function() {
            this._componentElement.select('.a-toolbar-buttons-main').each(function (toolbarEl) {
                var itemEls = toolbarEl.childElements();

                var menuEl = new Element('span', {'class': 'btn-group'}).insert(
                    '<span class="btn dropdown-toggle"><button type="button"><i class="icon"><img src="' +
                    Jsw.skinUrl + '/icons/16/plesk/menu.png" alt=""></i> <em class="caret"></em></button></span>' +
                    '<ul class="dropdown-menu pull-right"></ul>'
                );
                menuEl.observe('click', function (event) {
                    event.stopPropagation();
                    menuEl.toggleClassName('btn-group-open');

                    var dropdownMenu = menuEl.down('.dropdown-menu');
                    if (dropdownMenu.visible()) {
                        dropdownMenu.setStyle({
                            right: 0
                        });
                        var offset = dropdownMenu.cumulativeOffset();
                        var left = toolbarEl.cumulativeOffset().left;
                        if (offset.left < left) {
                            dropdownMenu.setStyle({
                                right: (offset.left - left) + 'px'
                            });
                        }
                    }
                });
                $(document.body).observe('click', function() {
                    menuEl.removeClassName('btn-group-open');
                });
                toolbarEl.insert(menuEl);

                var layout = menuEl.getLayout();
                toolbarEl._menuEl = {
                    el: menuEl,
                    width: menuEl.getWidth() + layout.get('margin-left') + layout.get('margin-right')
                };
                menuEl.hide();

                toolbarEl._items =[];
                itemEls.each(function (itemEl) {
                    var itemElClone = itemEl.clone(true);
                    itemElClone.removeClassName('btn');

                    var liEl = new Element('li').insert(itemElClone);
                    menuEl.down('ul').insert(liEl);

                    var layout = itemEl.getLayout();
                    toolbarEl._items.push({
                        el: itemEl,
                        elInMenu: liEl,
                        width: itemEl.getWidth() + layout.get('margin-left') + layout.get('margin-right')
                    });
                });

            });

            function onWindowResize() {
                $$('.a-toolbar-buttons-main').each(function (toolbarEl) {
                    var width = toolbarEl.getWidth();
                    width -= toolbarEl._menuEl.width;

                    toolbarEl._items.each(function (item) {
                        if (width > item.width) {
                            item.el.show();
                            item.elInMenu.hide();
                            width -= item.width;
                        } else {
                            item.el.hide();
                            item.elInMenu.show();
                            width = -1;
                        }
                    });
                    if (width == -1) {
                        toolbarEl._menuEl.el.show();
                    } else {
                        toolbarEl._menuEl.el.hide();
                    }
                });
            }

            onWindowResize();
            Event.observe(window, 'resize', onWindowResize);
        },

        toggleItem: function (item) {
            this.getItemElement(item)
                .toggleClassName('active-list-item-collapsed')
                .toggleClassName('active-list-item-expanded');
            this.stateCollapsed.set(item, !this.stateCollapsed.get(item));
        },

        scrollToItem: function (el, duration) {
            var startTime = new Date().getTime(),
                from = document.viewport.getScrollOffsets().top,
                to = el.cumulativeOffset().top - $$('.page-main')[0].cumulativeOffset().top - 40;
            if ($('classic-mode-navigation')) {
                to -= $('classic-mode-navigation').getHeight();
            }

            function frame() {
                var progress = duration ? (new Date().getTime() - startTime) / duration : 1;
                if (progress > 1) {
                    progress = 1;
                }

                window.scrollTo(0, Math.round(from + (to - from) * progress));

                if (progress < 1) {
                    setTimeout(frame, 50);
                }
            }
            frame();
        }
    });
})();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DirectoryBrowser
 * @extends Jsw.PopupForm
 */
Jsw.DirectoryBrowser = Class.create(Jsw.PopupForm, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._pathElementId = this._getConfigParam('pathElementId');
        this._subscriptionId = this._getConfigParam('subscriptionId');
        this._showFiles = this._getConfigParam('showFiles', false);
        this._onSubmit = this._getConfigParam('onSubmit', function() {});
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this.setTitle(this.lmsg('title'));

        $(this._contentAreaId).update(
            '<form method="post" id="' + this._id + '-form">' +
                '<div class="single-row">' +
                '<div class="scrollable fm-scrollable" style="height: 300px;">' +
                '<div class="scrollable-wrap">' +
                '<div id="' + this._id + '-files-tree" class="tree"></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</form>'
        );

        this._tree = new Jsw.FileManager.Tree(Object.extend({
            applyTo: this._id + '-files-tree',
            data: null,
            dataUrl: '^/smb/file-manager/tree-data/subscriptionId/' + this._subscriptionId,
            showFiles: this._showFiles,
            onNodeClick: this._onTreeNodeClick.bind(this),
            onReload: function() {
                this.setDirectory('/');
            }
        }, this._getConfigParam('treeConfig', {})));

        this._buttonOk = this.addRightButton(this.lmsg('buttonOk'), this._onOkClick, true, true);
        this._buttonCancel = this.addRightButton(this.lmsg('buttonCancel'), this._onCancelClick, false, false);

        if (this._showFiles) {
            this._updateButton(this._buttonOk, {disabled: true});
        }
    },

    _onTreeNodeClick: function() {
        this._updateButton(this._buttonOk, {disabled: this._showFiles && this._tree.getSelectedItemData().isDirectory});
    },

    _onOkClick: function(event) {
        if (event) {
            event.preventDefault();
        }

        var selectedPath = this._tree.getSelectedItemData().path;
        var pathValue = this._showFiles ? selectedPath.substr(1) : selectedPath;
        if (this._pathElementId) {
            $(this._pathElementId).value = pathValue;
        }
        this._onSubmit(pathValue);
        this.hide();
    },

    _onCancelClick: function() {
        this.hide();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DropArea
 * Drop area component
 * @extends Jsw.Component
 */
Jsw.DropArea = (function () {
    /**
     * @param {Entry} entry
     * @return {Promise}
     */
    function readEntry(entry) {
        return new Promise(function (resolve) {
            if (entry.isDirectory) {
                entry.createReader().readEntries(function (entries) {
                    resolve(entriesToFiles(entries));
                });
            } else {
                entry.file(resolve);
            }
        });
    }

    /**
     * @param {String[]} entries
     * @return {Promise}
     */
    function entriesToFiles(entries) {
        return Promise.all(entries.map(readEntry))
            .then(function (items) {
                var files = [];
                items.forEach(function (item) {
                    if (Array.isArray(item)) {
                        files = files.concat(item);
                    } else {
                        files.push(item);
                    }
                });
                return files;
            });
    }

    /**
     * @param {File} file
     * @return {Promise}
     */
    function isFile(file) {
        return new Promise(function (resolve) {
            if (file.size > 4096) {
                resolve(true);
                return;
            }

            if (!window['FileReader']
                || (window['opera'] && navigator.platform.toLowerCase().indexOf('mac') > -1 && window['opera'].version() === '12.00')
            ) {
                resolve(null);
            } else {
                try {
                    var reader = new FileReader();
                    reader.onerror = function () {
                        reader.onloadend = reader.onprogress = reader.onerror = null;
                        resolve(false);
                    };
                    reader.onloadend = reader.onprogress = function (e) {
                        reader.onloadend = reader.onprogress = reader.onerror = null;
                        if (e.type !== 'loadend') {
                            reader.abort();
                        }
                        resolve(true);
                    };
                    reader.readAsDataURL(file);
                } catch (e) {
                    resolve(false);
                }
            }
        });
    }

    /**
     * @param {Event} e
     * @return {Boolean}
     */
    function isDragFiles(e) {
        if (!e.dataTransfer) {
            return false;
        }

        if (e.dataTransfer.effectAllowed === 'none') {
            return false;
        }

        return e.dataTransfer.files
            || (!Prototype.Browser.WebKit && e.dataTransfer.types.contains && e.dataTransfer.types.contains('Files'));
    }

    /**
     * @param {Event} e
     * @return {Promise}
     */
    function getDragFiles(e) {
        if (!e.dataTransfer) {
            return Promise.resolve([]);
        }

        if (!e.dataTransfer.items) {
            return Promise.all([].map.call(e.dataTransfer.files, isFile))
                .then(function (isFiles) {
                    return [].filter.call(e.dataTransfer.files, function (file, index) {
                        return isFiles[index];
                    });
                });
        }

        return entriesToFiles([].map.call(e.dataTransfer.items, function (item) {
            return item.webkitGetAsEntry();
        }).filter(function (entry) {
            return !!entry;
        }));
    }

    return Class.create(Jsw.Component, {
        _initConfiguration: function($super, config) {
            config = Object.extend({
                cls: 'fm-drop-area'
            }, config || {});
            $super(config);

            this._onDrop = this._getConfigParam('onDrop');
        },

        _initComponentElement: function($super) {
            $super();

            this._componentElement.update(
                '<div class="fm-drop-area-wrap">' +
                    '<span class="fm-drop-area-text">' +
                        this.lmsg('dragAndDropArea') +
                    '</span>' +
                '</div>'
            );

            this.hide();
        },

        _addEvents: function() {
            this._addDocumentHandlers();
            this._addDropAreaHandlers();
        },

        _addDocumentHandlers: function() {
            $(document).observe('dragover', function(e){
                if (e.dataTransfer){
                    e.preventDefault();
                }
            });

            $(document).observe('dragenter', function(e) {
                if (!isDragFiles(e)) {
                    return;
                }
                this.show();
            }.bindAsEventListener(this));

            $(document).observe('drop', function(e) {
                if (!isDragFiles(e)) {
                    return;
                }
                this.hide();
                e.preventDefault();
            }.bindAsEventListener(this));
        },

        _addDropAreaHandlers: function() {
            this._componentElement.observe('dragover', function(e) {
                if (!isDragFiles(e)) {
                    return;
                }
                e.stopPropagation();
                e.preventDefault();
            }.bindAsEventListener(this));

            this._componentElement.observe('drop', function(e) {
                if (!isDragFiles(e)) {
                    return;
                }
                e.preventDefault();

                this.hide();
                if (this._onDrop) {
                    getDragFiles(e).then(this._onDrop);
                }
            }.bindAsEventListener(this));

            this._componentElement.observe('mouseover', function () {
                this.hide();
            }.bind(this));
        }
    });
})();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DropdownManager
 * @singleton
 */
Jsw.DropdownManager = function() {
    var dropdowns = [];

    function closeAllDropdowns() {
        dropdowns.each(function(dropdown) {
            if (dropdown.isOpened()) {
                dropdown.close();
            }
        });
    }

    return {
        /**
         * Register dropdown component.
         * @param {Element} toggler
         * @param {Function} isOpened
         * @param {Function} open
         * @param {Function} close
         * @param {Function} [beforeClick]
         * @returns {Object}
         */
        register: function (toggler, isOpened, open, close, beforeClick) {
            var dropdown = {
                toggler: toggler,
                isOpened: isOpened,
                open: open,
                close: close,
                handler: function(event) {
                    if (beforeClick && !beforeClick(event)) {
                        return;
                    }
                    event.stopPropagation();
                    var oldIsOpened = isOpened();
                    closeAllDropdowns();
                    if (!oldIsOpened) {
                        open(event);
                    }
                }
            };

            dropdowns.push(dropdown);
            dropdown.toggler.observe('click', dropdown.handler);

            if (dropdowns.length > 0) {
                $(document.body).observe('click', closeAllDropdowns);
            }

            return dropdown;
        },

        /**
         * Un register dropdown component.
         * @param {Object} dropdown
         */
        unregister: function(dropdown) {
            dropdown.toggler.stopObserving('click', dropdown.handler);
            dropdowns = dropdowns.without(dropdown);

            if (dropdowns.length === 0) {
                $(document.body).stopObserving('click', closeAllDropdowns);
            }
        }
    };
}();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.DynamicPopupHint
 * @singleton
 */
Jsw.DynamicPopupHint = {
    windowId: 'ajaxTooltipWindow',
    delay: 0.55,
    _isInitialized: false,
    _currentTooltip: null,

    _init: function(cls) {
        if (this._isInitialized) {
            return ;
        }

        this._cls = cls;
        this._initWindowElement();
        this._initWindowEvents();
        this._isInitialized = true;
    },

    _initWindowElement: function() {
        $(document.body).insert({
            top: '<div id="' + this.windowId + '" class="' + this._cls + '" style="display: none; z-index: 10000"></div>'
        });

        $(this.windowId).update(
            '<table cellspacing="0" class="popup-wrapper"><tbody><tr><td class="popup-container">' +
                '<div class="c1"><div class="c2"><div class="c3"><div class="c4"><div class="c5">' +
                    '<div class="popup-heading">' +
                        '<div class="heading-area">' +
                            '<span class="arrow"></span>' +
                            '<span class="close" id="' + this.windowId + '-close' + '"></span>' +
                            '<h4><span id="' + this.windowId + '-title' + '"></span></h4>' +
                        '</div>' +
                    '</div>' +
                    '<div class="popup-content">' +
                        '<div id="' + this.windowId + '-content' + '" class="popup-content-area"></div>' +
                    '</div>' +
                '</div></div></div></div></div>' +
            '</td></tr></tbody></table>'
        // TODO Need remove this hack when all popup boxes will use DynamicPopupHint component and hardcoded offset will be removed in css
        ).setStyle({marginTop: 0});
    },

    _initWindowEvents: function() {
        $(this.windowId).observe('mouseover', this._onWindowMouseOver.bind(this));
        $(this.windowId).observe('mouseout', this._onWindowMouseOut.bind(this));
        $(this.windowId + '-close').observe('click', this._onCloseClick.bind(this));
        $(document.body).observe('click', this._onCloseClick.bind(this));
        $(this.windowId).observe('click', function (event) {
            event.stopPropagation();
        });
    },

    _onWindowMouseOver: function() {
        this._showWindow();
    },

    _onWindowMouseOut: function() {
        if (this._currentTooltip.getPlacement() === '') {
            $(this.windowId).hide();
        }
    },

    _onCloseClick: function() {
        $(this.windowId).hide();
    },

    set: function(tooltip) {
        this._init(tooltip.getCls());
        var title = tooltip.getTitle();
        var titleElement = $(this.windowId + '-title');
        if (false === title) {
            $(this.windowId + '-title').update('');
            titleElement.up('.popup-heading').hide();
        } else {
            $(this.windowId + '-title').update(title);
            titleElement.up('.popup-heading').show();
        }
        $w('left right top bottom').each(function (className){
            $(this.windowId).removeClassName(className);
        }, this);
        $(this.windowId).addClassName(tooltip.getPlacement());
        $(this.windowId).down('.heading-area .arrow').toggle(['left', 'right', 'bottom'].indexOf(tooltip.getPlacement()) !== -1);
        $(this.windowId).toggleClassName('popup-box-scrollable', tooltip.getScrollable());
        this._currentTooltip = tooltip;
        this.updateContent(tooltip);
        this._showWindow(tooltip);
    },

    isSet: function (tooltip) {
        var element = $(this.windowId);
        return element && element.visible() && this._currentTooltip === tooltip;
    },

    unset: function () {
        var element = $(this.windowId);
        if (element) {
            element.hide();
        }
    },

    updateContent: function(tooltip) {
        if (this._currentTooltip === tooltip) {
            Jsw.render($(this.windowId + '-content'), [
                tooltip.getPlacement() === 'top' ? '<span class="arrow"></span>' : '',
                tooltip.getContent()
            ], 'inner');
        }
        this._updatePosition();
    },

    _showWindow: function() {
        $(this.windowId).show();
        this._updatePosition();
    },

    _updatePosition: function()
    {
        var element = $(this.windowId),
            elementWidth = element.getWidth(),
            elementHeight = element.getHeight(),
            headingElementHeight = element.down('.popup-heading').getHeight(),
            tooltipElement = this._currentTooltip.getTargetElement(),
            tooltipElementHeight = tooltipElement.getHeight(),
            tooltipElementWidth = tooltipElement.getWidth(),
            offsetLeft = document.viewport.getScrollOffsets().left,
            offsetTop = document.viewport.getScrollOffsets().top,
            elementRight = tooltipElement.cumulativeOffset().left + elementWidth,
            viewportRight = document.viewport.getWidth() + document.viewport.getScrollOffsets().left;

        switch (this._currentTooltip.getPlacement()) {
            case 'top':
                offsetTop -= elementHeight;
                offsetLeft -= (elementWidth - tooltipElementWidth) / 2;
                break;
            case 'bottom':
                offsetTop += tooltipElementHeight;
                offsetLeft -= (elementWidth - tooltipElementWidth) / 2;
                break;
            case 'left':
                offsetTop -= (headingElementHeight - tooltipElementHeight) / 2;
                offsetLeft -= elementWidth;
                break;
            case 'right':
                offsetTop -= (headingElementHeight - tooltipElementHeight) / 2;
                offsetLeft += tooltipElementWidth;
                break;
        }
        if (elementRight + offsetLeft > viewportRight) {
            offsetLeft -= elementRight + offsetLeft - viewportRight + 10;
        }

        element.clonePosition(tooltipElement, {
            offsetLeft: offsetLeft,
            offsetTop: offsetTop,
            setWidth: false,
            setHeight: false
        });
    }
};

/**
 * @class Jsw.DynamicPopupHint.Instance
 * @extends Jsw.Component
 */
Jsw.DynamicPopupHint.Instance = Class.create(Jsw.Component, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._targetElement = $(this._getConfigParam('target', ''));
        this._title = this._getConfigParam('title', '');
        this._waitMsg = this._getConfigParam('waitMsg', '');
        this._url = this._getConfigParam('url', '');
        this._cls = this._getConfigParam('cls', 'popup-box');
        this._scrollable = this._getConfigParam('scrollable', true);
        this._placement = this._getConfigParam('placement', '');

        this._content = this._getConfigParam('content', '<div class="ajax-loading">' + this._waitMsg + '</div>');
        this._contentLoaded = false;
        this._delayedExecuter = null;
    },

    _initComponentElement: function() {
        this._initTargetEvents();
    },

    _initTargetEvents: function() {
        if (this._placement !== '') {
            this._targetElement.observe('click', function (event) {
                event.stop();
                if (Jsw.DynamicPopupHint.isSet(this)) {
                    Jsw.DynamicPopupHint.unset();
                } else {
                    Jsw.DynamicPopupHint.set(this);
                }
            }.bind(this));
        } else {
            this._targetElement.observe('mouseover', this.set.bind(this));
            this._targetElement.observe('mouseout', this.unset.bind(this));
        }
    },

    _loadContent: function() {
        var context = this;
        new Ajax.Request(Jsw.prepareUrl(this._url), {
            method: 'get',
            onSuccess: function(transport) {
                if ('' === transport.responseText) {
                    return;
                }

                context._content = transport.responseText;
                Jsw.DynamicPopupHint.updateContent(context);
            }
        });

        this._contentLoaded = true;
    },

    setContent: function(content)
    {
        this._contentLoaded = true;
        this._content = content;
    },

    set: function() {
        var context = this;
        this._delayedExecuter = new PeriodicalExecuter(function(pe) {
            Jsw.DynamicPopupHint.set(context);
            pe.stop();
            this._delayedExecuter = null;
        }, Jsw.DynamicPopupHint.delay);
    },

    unset: function() {
        if (this._delayedExecuter) {
            this._delayedExecuter.stop();
            this._delayedExecuter = null;
        }
    },

    getTitle: function() {
        return this._title;
    },

    getContent: function() {
        if (!this._contentLoaded && this._url) {
            this._loadContent();
        }

        return this._content;
    },

    getTargetElement: function() {
        return this._targetElement;
    },

    getCls: function() {
        return this._cls;
    },

    getScrollable: function() {
        return this._scrollable;
    },

    getPlacement: function() {
        return this._placement;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.GroupsList
 * @extends Jsw.List
 */
Jsw.GroupsList = Class.create(Jsw.List, {
    _groupBy: false,
    _groupsConfig: [],
    _getGroupRowClass: function (group) {
        return '';
    },

    _initConfiguration: function ($super, config) {
        $super(config);
        this._groupBy = this._getConfigParam('groupBy', false);
        this._groupsConfig = this._getConfigParam('groupsConfig', false);
        this._getGroupRowClass = this._getConfigParam('getGroupRowClass', this._getGroupRowClass);
    },

    _getListDataHtml: function (listData, indexOffset) {
        if ('undefined' === typeof listData) {
            listData = this._data;
        }

        if (!listData) {
            return;
        }

        indexOffset = indexOffset || 0;

        if (this._groupBy) {
            listData = listData.sort(function (a, b) {
                if (a[this._groupBy] > b[this._groupBy]) {
                    return 1;
                }
                if (a[this._groupBy] < b[this._groupBy]) {
                    return -1;
                }
                return 0;
            }.bind(this));

            var groupedData = {};
            listData.forEach(function (item) {
                if (!groupedData[item[this._groupBy]]) {
                    groupedData[item[this._groupBy]] = {
                        'id': item[this._groupBy],
                        'items': []
                    };
                }
                groupedData[item[this._groupBy]]['items'].push(item);
            }.bind(this));

            return Object.keys(groupedData).map(function (groupId, groupIndex) {
                var group = groupedData[groupId];
                return this._getGroupDataRowHtml(group, groupIndex, indexOffset);
            }.bind(this)).join('');

        } else {
            return listData.map(function (item, index) {
                return this._getRowHtml(item, index, indexOffset);
            }.bind(this)).join('');
        }
    },

    _getGroupDataRowHtml: function (group, groupIndex, indexOffset) {
        var html = '';
        var groupRowClass = this._getGroupRowClass(group);

        var oddEvenRowClass = (groupIndex + indexOffset) % 2 ? 'even' : 'odd';
        var groupRowId = group.id ? Jsw.escapeAttribute(group.id) : '';
        html += '<tr class="' + groupRowClass + ' ' + oddEvenRowClass + '" data-row-id="' + groupRowId + '"><td colspan=';
        html += this._columns.length + "'>";
        html += '<b>' + this._getGroupName(group) + '</b>';

        html += '</td></tr>';

        html += group['items'].map(function (item, index) {
            return this._getRowHtml(item, index, indexOffset);
        }.bind(this)).join('');
        return html;
    },

    _getGroupName: function (group) {
        return this._groupsConfig[group['id']] ? this._groupsConfig[group['id']] : group['id'];
    }
});
// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ReporterPopup
 * @extends Jsw.PopupForm
 */
Jsw.ReporterPopup = Class.create(Jsw.PopupForm, {
    _initConfiguration: function($super, config) {
        config = Object.extend({
            'singleRowButtons': true
        }, config || {});
        $super(config);
        this._actionCollectId = this._id + '-action-collect';
        this._actionToSupportId = this._id + '-action-to-support';
        this._sendButtonId = 'btn-send';
        this._cancelButtonId = 'btn-cancel';
        this._supportUrl = this._getConfigParam('supportUrl', '');
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this.setTitle(this.lmsg('title'));

        this.addRightButton(this.lmsg('buttonCollect'), this._onCollectClick, true, true, {id: this._sendButtonId});
        this.addRightButton(this.lmsg('buttonCancel'), this._onCancelClick, false, false, {id: this._cancelButtonId});
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.down('div.content-area').update(
            '<div class="form-row">' +
                '<div class="single-row">' +
                '<div class="field-value">' +
                '<label><input class="radio" type="radio" name="action" id="' + this._actionCollectId + '" checked="checked"> ' + this.lmsg('actionCollect') + this._getTooltip() + '</label>' +
                '</div>' +
                '<div class="field-value">' +
                '<label><input class="radio" type="radio" name="action" id="' + this._actionToSupportId + '"> ' + this.lmsg('actionToSupport') + '</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<a href="#" class="toggler js-show-previous-reports">' + this.lmsg('showPreviousReports') + '</a>' +
                '<a href="#" class="toggler hidden js-hide-previous-reports">' + this.lmsg('hidePreviousReports') + '</a>' +
                '<div id="js-reports"><span class="ajax-loading hidden">' + this.lmsg('pleaseWait') + '</span></div>'
        );
    },

    _onSupportClick: function(close) {
        window.open(this._supportUrl, '_blank');
        this._disableSendButton(this.lmsg('buttonWait'));
        var context = this;
        new Ajax.Request(
            Jsw.prepareUrl('/admin/report/report-usage/'), {
                method: 'post',
                onException: this._onException.bind(this),
                onSuccess: function() {
                    close ? context.hide() : context._enableSendButton(context.lmsg('buttonToSupport'));
                }
            }
        );
    },

    _onCollectClick: function() {
        this._disableSendButton();
        Jsw.DynamicPopupHint.unset();
        $(this._contentAreaId).update('<p class="text-center"><span class="ajax-loading">' + this.lmsg('collecting') + this._getTooltip() +'</span></p>');
        this._addTooltips();
        var context = this;
        new Ajax.Request(
            Jsw.prepareUrl('/admin/report/collect/'), {
                method: 'post',
                onException: this._onException.bind(this),
                onSuccess: function(response) {
                    var data = response.responseText.evalJSON();
                    if (context._checkResponseStatus(data)) {
                        Jsw.DynamicPopupHint.unset();
                        var link = '<a href="' + Jsw.prepareUrl('/admin/report/download/file/' + encodeURIComponent(data.file)) + '">' + context.lmsg('downloadLink') + '</a>';
                        $(context._contentAreaId).update('<p>' + context.lmsg('collectedInfo', {link: link}) + '</p>');
                        context._enableSendButton(context.lmsg('buttonSend'), context._onSendClick.bind(context, data.file));
                    }
                }
            }
        );
    },

    _onSendClick: function(file) {
        this._disableSendButton(this.lmsg('buttonSending'));
        var context = this;
        new Ajax.Request(
            Jsw.prepareUrl('/admin/report/send/'), {
                method: 'post',
                parameters: {file: file},
                onException: this._onException.bind(this),
                onSuccess: function(response) {
                    var data = response.responseText.evalJSON();
                    if (context._checkResponseStatus(data)) {
                        $(context._contentAreaId).update('<p>' + context.lmsg('sentInfo', {id: data.reportId.escapeHTML()}) + '</p>');
                        context._enableSendButton(context.lmsg('buttonToSupport'), context._onSupportClick.bind(context, false));
                    }
                }
            }
        );
    },

    _onCancelClick: function() {
        this.hide();
    },

    _onShowReportsClick: function(e) {
        e.preventDefault();
        this._componentElement.down('.js-show-previous-reports').addClassName('hidden');
        if (Jsw.getComponent('reports-list') && this._componentElement.down('.list-box')) {
            this._componentElement.down('.list-box').removeClassName('hidden');
            this._componentElement.down('.js-hide-previous-reports').removeClassName('hidden');
            return;
        }
        this._componentElement.down('.ajax-loading').removeClassName('hidden');
        var dialogHeight = this._componentElement.getHeight();
        var list = new Jsw.List({
            id: 'reports-list',
            dataUrl: Jsw.prepareUrl('/admin/report/list-data'),
            pageable: false,
            columns: [
                {
                    header: this.lmsg('date'),
                    dataIndex: 'date'
                }, {
                    header: this.lmsg('reportId'),
                    dataIndex: 'id'
                }
            ],
            onRedraw: function() {
                this._componentElement.down('.js-hide-previous-reports').removeClassName('hidden');
                this._componentElement.down('.ajax-loading').addClassName('hidden');
                var maxHeight = Math.max(document.viewport.getScrollOffsets().top + document.viewport.getHeight() - parseInt(this._componentElement.getStyle('top')) * 1.5 - dialogHeight, 100);
                this._componentElement.down('.list').setStyle({'max-height': parseInt(maxHeight) + 'px'});
            }.bind(this)
        });
        new Jsw.Panel({
            cls: 'list-box',
            renderTo: 'js-reports',
            items: [
                list
            ]
        });
    },

    _onHideReportsClick: function(e) {
        e.preventDefault();
        this._componentElement.down('.list-box').addClassName('hidden');
        this._componentElement.down('.js-show-previous-reports').removeClassName('hidden');
        this._componentElement.down('.js-hide-previous-reports').addClassName('hidden');
    },

    _addEvents: function($super) {
        $super();

        $(this._actionCollectId).observe('click', function() {
            this._enableSendButton(this.lmsg('buttonCollect'), this._onCollectClick.bind(this));
        }.bind(this));
        $(this._actionToSupportId).observe('click', function() {
            this._enableSendButton(this.lmsg('buttonToSupport'), this._onSupportClick.bind(this, true));
        }.bind(this));
        this._componentElement.down('.js-show-previous-reports').observe('click', this._onShowReportsClick.bind(this));
        this._componentElement.down('.js-hide-previous-reports').observe('click', this._onHideReportsClick.bind(this));
    },

    _addTooltips: function($super) {
        $super();

        new Jsw.DynamicPopupHint.Instance({
            title: this.lmsg('hintTitle'),
            target: $('tooltip'),
            placement: 'right',
            content: this.lmsg('hintText')
        });
    },

    _getTooltip: function() {
        if (!this._tooltip) {
            this._tooltip = '&nbsp;<span class="s-btn sb-help" id="tooltip">&nbsp;</span>';
        }
        return this._tooltip;
    },

    _disableSendButton: function(title) {
        $(this._sendButtonId).firstDescendant().disable();
        $(this._sendButtonId).addClassName('disabled');
        if (title) {
            $(this._sendButtonId).down('button').update('<span class="wait">' + title + '</span>');
        }
    },

    _enableSendButton: function(title, handler) {
        if (handler) {
            $(this._sendButtonId).down('button').stopObserving('click');
            $(this._sendButtonId).down('button').observe('click', handler);
        }
        if (title) {
            $(this._sendButtonId).down('button').update(title);
        }

        $(this._sendButtonId).firstDescendant().enable();
        $(this._sendButtonId).removeClassName('disabled');
    },

    _checkResponseStatus: function(response) {
        if (response.redirect) {
            Jsw.redirect(response.redirect);
        }

        if (response.status && 'success' != response.status) {
            $A(response.statusMessages).each(function(message) {
                Jsw.addStatusMessage(message.status, message.content);
            });
            this.hide();
            return false;
        }
        return true;
    },

    _onException: function(transport, exception) {
        Jsw.addStatusMessage('error', 'Internal error: ' + exception);
        this.hide();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
Jsw.namespace('Jsw.ListContextMenu');

/**
 * @class Jsw.ListContextMenu
 * @extends Jsw.Container
 */
Jsw.ListContextMenu = Class.create(Jsw.Container, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = 'popup-box popup-menu collapsed';
        this._list = this._getConfigParam('list');
    },

    _initComponentElement: function($super) {
        $super();

        this._componentElement.update(
            '<table class="popup-wrapper" cellspacing="0"><tbody><tr><td class="popup-container">' +
                '<div class="c1"><div class="c2"><div class="c3"><div class="c4"><div class="c5">' +
                    '<div class="popup-content">' +
                        '<div class="popup-content-area"></div>' +
                    '</div>' +
                '</div></div></div></div></div>' +
            '</td></tr></tbody></table>'
        );
    },

    /**
     * Called on list redraw
     */
    onRedraw: function() {
        var dropdown;
        this._dropdowns = this._dropdowns || [];
        while (dropdown = this._dropdowns.pop()) {
            Jsw.DropdownManager.unregister(dropdown);
        }

        $$('.btn-list-menu').each(function(contextMenuButton) {
            this._dropdowns.push(Jsw.DropdownManager.register(
                contextMenuButton,
                function() {
                    return contextMenuButton.up('.btn-group').hasClassName('btn-group-open');
                }.bind(this),
                function() {
                    this._toggleMenu(contextMenuButton);
                }.bind(this),
                function() {
                    this._hidePopup();
                }.bind(this)
            ));
        }, this);
        this._initShowOnRowClick();
    },

    /**
     * Show context menu on context menu button click
     */
    _toggleMenu: function(button) {
        var row = this._list.getItemById(button.readAttribute('data-row-id'));
        if (!row || !row.actions || !row.actions.length) {
            return;
        }

        this._prefillPopup(row);
        this._togglePopupNearButton(button);
    },

    /**
     * Get list of actions for popup by row
     */
    _prefillPopup: function(row) {
        var contentArea = this._componentElement.down('.popup-content-area').update('<ul></ul>');
        contentArea = contentArea.down('ul');
        row.actions.each(function(actionInfo) {
            if (actionInfo === 'separator') {
                contentArea.insert('<li class="separator"><span></span></li>');
                return;
            }
            if (typeof actionInfo === 'string') {
                actionInfo = {name:actionInfo};
            }
            var item = new Element('li').update(
                '<a class="sb-btn ' + (actionInfo.iconClass ? actionInfo.iconClass : 'sb-no-icon') + '" ' +
                    'href="' + (actionInfo.href ? Jsw.prepareUrl(actionInfo.href) : '#') + '" ' +
                    (actionInfo.newWindow ? 'target="_blank" ' : '') +
                    (actionInfo.onclick ? 'onclick="' + actionInfo.onclick + '" ' : '') +
                '>' +
                    '<i><i><i><span>' +
                        (actionInfo.title || this._list.lmsg('item-action-' + actionInfo.name)) +
                    '</span></i></i></i>' +
                '</a>'
            );

            if (this._list._itemActions && this._list._itemActions[actionInfo.name]) {
                item.down('a').observe('click', function (event) {
                    event.preventDefault();
                    this._list._itemActions[actionInfo.name](row, event);
                }.bind(this));
            }

            contentArea.insert(item);
        }, this);
    },

    /**
     * Show prefilled popup on context menu button click
     */
    _togglePopupNearButton: function(button) {
        $(this._list._tableId).select('tr.odd,tr.even').each(function(el) {
            el.removeClassName('row-over');
        });
        this._componentElement.addClassName('collapsed');

        if (!button.up('.btn-group').hasClassName('btn-group-open')) {
            $$('.btn-list-menu').each(function(el) {
                el.up('.btn-group').removeClassName('btn-group-open');
            });

            this._componentElement.removeClassName('collapsed');
            button.up('tr').addClassName('row-over');
        }

        button.up('.btn-group').toggleClassName('btn-group-open');

        var scrollOffsets = document.viewport.getScrollOffsets();
        var buttonPosition = button.viewportOffset();
        buttonPosition.left += scrollOffsets.left;
        buttonPosition.top += scrollOffsets.top;

        var buttonWidth = button.getWidth();
        var buttonHeight = button.getHeight();

        if (!this._componentElement.hasClassName('collapsed')) {
            this._setPosition(
                buttonPosition.left,
                buttonPosition.top + buttonHeight,
                buttonPosition.left + buttonWidth,
                buttonPosition.top
            );
        }
    },

    /**
     * Hide popup and remove selection from row
     */
    _hidePopup: function() {
        this._componentElement.addClassName('collapsed');
        $(this._list._tableId).select('tr.odd,tr.even').each(function(el) {
            el.removeClassName('row-over');
        });
        $$('.btn-list-menu').each(function(menu) {
            menu.up('.btn-group').removeClassName('btn-group-open');
        });
    },

    /**
     * Show popup on click on row
     */
    _initShowOnRowClick: function() {
        $(this._list._tableId).select('tr.odd,tr.even').each(function(el) {
            var button = el.down('.dropdown-toggle');
            if (!button) {
                return;
            }

            var row = this._list.getItemById(button.readAttribute('data-row-id'));
            if (!row || !row.actions || !row.actions.length) {
                return;
            }

            el.addClassName('list-context-actions');
            Jsw.DropdownManager.register(
                el,
                function() {
                    return !this._componentElement.hasClassName('collapsed');
                }.bind(this),
                function(e) {
                    var row = this._list.getItemById(button.readAttribute('data-row-id'));
                    if (!row || !row.actions || !row.actions.length) {
                        return;
                    }
                    this._prefillPopup(row);

                    this._componentElement.removeClassName('collapsed');
                    el.addClassName('row-over');
                    this._setPosition(Event.pointerX(e), Event.pointerY(e));
                }.bind(this),
                function() {
                    this._hidePopup(row);
                }.bind(this),
                function(e) {
                    return !e.findElement('a, input');
                }
            );
        }, this);
    },

    _setPosition: function(x, y, altX, altY) {
        altX = altX || x;
        altY = altY || y;

        var scrollOffsets = document.viewport.getScrollOffsets();

        var windowWidth = $(document.body).getWidth();
        var popupWidth = this._componentElement.getWidth();
        if (Jsw.isRtl()) {
            if ((altX - popupWidth - scrollOffsets.left) > 0) {
                x = altX - popupWidth;
            }
        } else {
            if ((x + popupWidth - scrollOffsets.left) > windowWidth) {
                x = altX - popupWidth;
            }
        }

        var windowHeight = $(document.body).getHeight();
        var popupHeight = this._componentElement.getHeight();
        var popupMarginTop = parseInt(this._componentElement.getStyle('margin-top'));
        if ((y + popupHeight + popupMarginTop - scrollOffsets.top) > windowHeight) {
            y = altY - popupHeight - 2 * popupMarginTop;
        }

        this._componentElement.setStyle({
            right: 'auto',
            left: x + 'px',
            top: y + 'px'
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ObjectSwitcher
 * @extends Jsw.LookUp
 */
Jsw.ObjectSwitcher = Class.create(Jsw.LookUp, {
    _tag: 'span',

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = this._getConfigParam('cls', 'btn-group object-switcher');
        this._listUrl = this._getConfigParam('listUrl', '');
        this._itemUrlTemplate = this._getConfigParam('itemUrlTemplate', '');
        this._owner = this._getConfigParam('owner', null);
    },

    _initCustomLookUpComponent: function() {
        this._customLookUpComponent = new Element('button' , {'type': 'button', 'class': 'btn dropdown-toggle'}).update('···');
        this._componentElement.insert(this._customLookUpComponent);
    },

    _addEvents: function($super) {
        $super();

        this.addEventObserver('component:change', function() {
            Jsw.redirect(this._itemUrlTemplate.interpolate(this._currentValue, /(^|.|\r|\n)(%%(\w+)%%)/));
        }.bind(this));
    },

    _getSearchMoreText: function($super, count) {
        return $super(count)
            + (this._listUrl ? ' ' + this.lmsg('refineSearchMessage', {link: '<a href="' + this._listUrl + '">' + this.lmsg('listOfAllObjects') + '</a>'}) : '');
    },

    _updateData: function(data) {
        this._clearData();

        var myData = [];

        if (null != this._owner) {
            myData = data.filter(function(item) {
                return 1 == item.isSameParent;
            }.bind(this));

            data = data.filter(function(item) {
                return 1 != item.isSameParent;
            }.bind(this));
        }

        var itemElement, insertTo = this._emptyElement;
        if (myData.length) {
            if (data.length) {
                this._dropdownList.insert(new Element('li', {'class': 'dropdown-header'})
                    .update(this.lmsg('myObjectsLabel', {name: this._owner})));
            }

            myData.each(function (item) {
                this._dropdownList.insert(this._createItem(item));
            }.bind(this));

            if (data.length) {
                this._dropdownList.insert(new Element('li', {'class': 'divider'}));
                this._dropdownList.insert(new Element('li', {'class': 'dropdown-header'})
                    .update(this.lmsg('otherObjectsLabel')));
            }
        }

        data.each(function(item) {
            this._dropdownList.insert(this._createItem(item));
        }.bind(this));

        this._addSearchMoreElement();
    },

    _addTooltips: function() {
        this._tooltip = Jsw.Tooltip.init(this._customLookUpComponent, {text: this.lmsg('description')});
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.PopupSlider
 * @extends Jsw.Popup
 */
Jsw.PopupSlider = Class.create(Jsw.Popup, {

    _initConfiguration: function($super, config) {
        config = Object.extend({
            popupCls: 'popup-panel popup-panel-slider popup-panel-auto',
            closeButtonEnabled: true,
            hideOnEscape: true
        }, config || {});
        $super(config);

        this._slides = this._getConfigParam('slides', []);
        this._current = this._getConfigParam('current', 0);
    },

    _getContentArea: function() {
        var name = 'slider-' + this.getId();

        return '' +
            '<div class="slider infinity">' +
                this._slides.map(function (item, index) {
                    return '<input type="radio" class="slider-check" name="' + name + '" id="' + name + '_' + (index + 1) + '"' + (index === this._current ? ' checked="checked"' : '')+ '>';
                }.bind(this)).join('') +
                '<ul class="slider-container">' +
                    this._slides.map(function (item) {
                        return '<li class="slider-item">' + item + '</li>';
                    }).join('') +
                '</ul>' +
                '<div class="slider-arrows">' +
                    this._slides.map(function (item, index) {
                        return '<label class="slider-label" for="' + name + '_' + (index + 1) + '"></label>';
                    }).join('') +
                    (this._slides.length > 1 ? '<label class="slider-label goto-first" for="' + name + '_1"></label><label class="slider-label goto-last" for="' + name + '_' + (this._slides.length) + '"></label>' : '') +
                '</div>' +
                '<div class="slider-navigation">' +
                    '<div class="slider-navigation-inner">' +
                        this._slides.map(function (item, index) {
                            return '<label class="slider-label" for="' + name + '_' + (index + 1) + '"></label>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</div>';
    },

    _onKeyDown: function ($super, e) {
        $super(e);
        var slides = $$('.slider-check');
        var currentIndex = slides.indexOf($$('.slider-check:checked')[0]);
        switch (e.keyCode) {
            case Event.KEY_LEFT:
                slides[currentIndex === 0 ? slides.length - 1 : currentIndex - 1].checked = true;
                break;
            case Event.KEY_RIGHT:
                slides[currentIndex === slides.length - 1 ? 0 : currentIndex + 1].checked = true;
                break;
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ProgressDialog
 * @extends Jsw.PopupForm
 */
Jsw.ProgressDialog = Class.create(Jsw.PopupForm, {
    _initConfiguration: function ($super, config) {
        config = Object.extend({
            'singleRowButtons': true,
            'scrollable': true
        }, config || {});
        $super(config);

        this.progressBarItem = this._getConfigParam('progressBarItem');
    },

    updateItem: function (progressBarItem) {
        var isComplete = this.progressBarItem.isComplete();
        this.progressBarItem = progressBarItem;
        if (!isComplete && this.progressBarItem.isComplete()) {
            this.toggleButtonsArea(true);
            setTimeout(function () {
                this.progressBarItem.onComplete();
            }.bind(this), 2000);
        }
        this.renderProgress();
    },

    _getHeadingActions: function () {
        var ce = Jsw.createElement;
        return ce('a.s-btn', { onclick: this.hide.bind(this) }, [
            ce('i.icon-background-tasks'),
            this.lmsg('minimize')
        ]);
    },

    render: function ($super) {
        $super();

        this.setBoxType('form-box');
        this.renderProgress();

        this.toggleButtonsArea(false);
        this.addRightButton(this.lmsg('close'), this.hide.bind(this));
    },

    renderProgress: function () {
        var ce = Jsw.createElement;
        var steps = this.progressBarItem.getSteps();
        this.setTitle(this.progressBarItem.getProgressTitle());
        Jsw.render($(this._contentAreaId), ce('.progress-steps', Object.keys(steps).map(function (stepName) {
            var step = steps[stepName];

            return ce('.progress-step',  {'class': this.getClassName(step)}, [
                step.icon && ce('.progress-step-icon', ce('i.icon-md', ce('img', {src: step.icon}))),
                ce('.progress-step-body', [
                    this.renderStatus(step),
                    ce('.progress-step-name', step.title.escapeHTML()),
                    this.renderContent(step),
                ])
            ]);
        }.bind(this))), 'inner');
    },

    getClassName: function (step) {
        if (step.status === this.progressBarItem.STATUS_COMPLETE && this.progressBarItem.hasErrors()) {
            return 'progress-step-warning';
        }
        if (step.status === this.progressBarItem.STATUS_COMPLETE) {
            return 'progress-step-success';
        }
        if (step.status === this.progressBarItem.STATUS_ERROR) {
            return 'progress-step-danger';
        }
        return null;
    },

    renderStatus: function (step) {
        var ce = Jsw.createElement;
        if (step.status === this.progressBarItem.STATUS_COMPLETE) {
            return ce('.progress-step-status', [ce('i.icon-ok'), ' ', this.lmsg('statusDone')]);
        }
        if (step.status === this.progressBarItem.STATUS_ERROR) {
            return ce('.progress-step-status', [ce('i.icon-warning'), ' ', this.lmsg('statusError')]);
        }
        if (step.status === this.progressBarItem.STATUS_CANCELED) {
            return ce('.progress-step-status', [ce('i.icon-delete'), ' ', this.lmsg('statusCanceled')]);
        }
        if (step.status === this.progressBarItem.STATUS_NOT_STARTED) {
            return ce('.progress-step-status.text-muted', [ce('i.icon-waiting'), ' ', this.lmsg('statusNotStarted')]);
        }
        return '';
    },

    renderContent: function (step) {
        var ce = Jsw.createElement;
        var content;
        if (step.status === this.progressBarItem.STATUS_ERROR) {
            content = this.progressBarItem.getErrorsString();
        } else if (this.progressBarItem.isStarted()) {
            content = this.renderProgressIndicator(step);
        }
        return content && ce('.progress-step-content', content);
    },

    renderProgressIndicator: function (step) {
        var ce = Jsw.createElement;
        var progressIndicator = [];
        if (step.progressStatus) {
            progressIndicator.push(ce('.progress-label', step.progressStatus.escapeHTML()));
        }
        var value = parseInt(step.progress);
        if (-1 === value) {
            progressIndicator.push(
                ce('.progress', ce('.progress-bar.progress-bar-striped.active', {style: 'width: 100%;'}))
            );
        } else if (step.status === this.progressBarItem.STATUS_RUNNING) {
            progressIndicator.push(ce('.progress', ce('.progress-bar', {style: 'width: ' + value + '%;'})));
            progressIndicator.push(ce('.progress-label', this.lmsg('percentCompleted', {percent: value})));
        }
        return progressIndicator;
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

(function(window) {
    if (window.Promise) {
        return;
    }

    function Promise(fn) {
        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }
        if (typeof fn !== 'function'){
            throw new TypeError('fn is not a function');
        }
        this._state = null;
        this._value = null;
        this._deferreds = [];

        doResolve(fn, resolve.bind(this), reject.bind(this));
    }

    Promise.prototype['catch'] = function (onRejected) {
        return this.then(null, onRejected);
    };

    Promise.prototype.then = function(onFulfilled, onRejected) {
        var me = this;
        return new Promise(function(resolve, reject) {
            handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
        });
    };

    Promise.all = function () {
        var args = [].slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments);

        return new Promise(function (resolve, reject) {
            if (args.length === 0) {
                return resolve([]);
            }
            var remaining = args.length;
            function res(i, val) {
                try {
                    if (val && (typeof val === 'object' || typeof val === 'function')) {
                        var then = val.then;
                        if (typeof then === 'function') {
                            then.call(val, function (val) {
                                res(i, val);
                            }, reject);
                            return;
                        }
                    }
                    args[i] = val;
                    if (--remaining === 0) {
                        resolve(args);
                    }
                } catch (ex) {
                    reject(ex);
                }
            }
            for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
            }
        });
    };

    Promise.resolve = function (value) {
        if (value && typeof value === 'object' && value.constructor === Promise) {
            return value;
        }

        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    Promise.reject = function (value) {
        return new Promise(function (resolve, reject) {
            reject(value);
        });
    };

    Promise.race = function (values) {
        return new Promise(function (resolve, reject) {
            for (var i = 0, len = values.length; i < len; i++) {
                values[i].then(resolve, reject);
            }
        });
    };

    function handle(deferred) {
        var me = this;
        if (this._state === null) {
            this._deferreds.push(deferred);
            return;
        }
        setTimeout(function() {
            var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
            if (cb === null) {
                (me._state ? deferred.resolve : deferred.reject)(me._value);
                return;
            }
            var ret;
            try {
                ret = cb(me._value);
            } catch (e) {
                deferred.reject(e);
                return;
            }
            deferred.resolve(ret);
        }, 0);
    }

    function resolve(newValue) {
        try {
            if (newValue === this) {
                throw new TypeError('A promise cannot be resolved with itself.');
            }
            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (typeof then === 'function') {
                    doResolve(then.bind(newValue), resolve.bind(this), reject.bind(this));
                    return;
                }
            }
            this._state = true;
            this._value = newValue;
            finale.call(this);
        } catch (e) {
            reject.call(this, e);
        }
    }

    function reject(newValue) {
        this._state = false;
        this._value = newValue;
        finale.call(this);
    }

    function finale() {
        for (var i = 0, len = this._deferreds.length; i < len; i++) {
            handle.call(this, this._deferreds[i]);
        }
        this._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, resolve, reject){
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
    }

    function doResolve(fn, onFulfilled, onRejected) {
        var done = false;
        try {
            fn(function (value) {
                if (done){
                    return;
                }
                done = true;
                onFulfilled(value);
            }, function (reason) {
                if (done){
                    return;
                }
                done = true;
                onRejected(reason);
            });
        } catch (ex) {
            if (done) {
                return;
            }
            done = true;
            onRejected(ex);
        }
    }

    window.Promise = Promise;
})(window);

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ScrollableList
 * The extension of the list widget: fits 100% height of screen.
 * @extends Jsw.List
  */
Jsw.ScrollableList = Class.create(Jsw.List, {
    listView: function($super) {
        var view = $super();

        view.attrs.class += ' scrollable-list';
        view.children[0].attrs.class = 'scrollable-list-table';
        view.children = [
            Jsw.createElement('table.fixed-table-head[width="100%"][cellspacing="0"]',
                this.listHeadersView()
            ),
            Jsw.createElement('.scrollable-list-wrapper', view.children)
        ];

        return view;
    },

    checkEmptyList: function($super) {
        $super();

        var isEmpty = this.isListEmpty();
        this._componentElement.select('.' + this._listCls).invoke('toggle', true);
        this._componentElement.select('.scrollable-list-wrapper').invoke('toggle', !isEmpty);
    },

    /**
     * @param {Function} $super
     * @param {String} place
     * @param {Number} dataLen
     */
    redraw: function($super, place, dataLen) {
        var bottom = true;
        var scrollTop, tableHeight = 0;
        var wrapper = $(this._id).down('.scrollable-list-wrapper');
        if (wrapper) {
            bottom = (wrapper.offsetHeight + wrapper.scrollTop >= wrapper.scrollHeight);
            scrollTop = wrapper.scrollTop;
            tableHeight = $(this._tableId).getHeight();
        }

        $super(place, dataLen);
        var table = $(this._tableId);
        var headerTable = table.up('.' + this._listCls).down('.fixed-table-head');

        table.setStyle({marginTop: -headerTable.getHeight() + 'px'});
        setTimeout(function() {
            this._resizeList();
            var wrapper = table.up('.scrollable-list-wrapper');
            if (bottom) {
                this.scrollToBottom();
            } else if ('before' === place) {
                wrapper.scrollTop += table.getHeight() - tableHeight;
            } else if ('after' === place) {
            } else {
                wrapper.scrollTop = scrollTop;
            }
        }.bind(this), 0);
    },

    updateFilter: function($super, force) {
        $super(force);
        this._resizeList();
    },

    scrollToBottom: function() {
        var table = $(this._tableId);
        var wrapper = table.up('.scrollable-list-wrapper');
        wrapper.scrollTop = wrapper.select('tr').filter(Element.visible).last().offsetTop;
    },

    _resizeList: function() {
        var minHeight = 200;
        var table = $(this._tableId);
        var wrapper = table.up('.scrollable-list-wrapper');

        var headerTable = table.up('.' + this._listCls).down('.fixed-table-head');
        var visibleHeader = headerTable.down('thead');
        if (visibleHeader) {
            var isEmpty = this.isListEmpty();
            visibleHeader.select('tr').each(function(tr) {
                if (!tr.hasClassName('list-search-filter')) {
                    isEmpty ? tr.hide() : tr.show();
                }
            });
        }

        var blockHeight = $(document.body).getHeight() - wrapper.cumulativeOffset().top;
        for (var up = wrapper; up instanceof Element; up = up.up()) {
            blockHeight = blockHeight
                - (parseInt(up.getStyle('borderBottomWidth')) || 0)
                - (parseInt(up.getStyle('marginBottom')) || 0)
                - (parseInt(up.getStyle('paddingBottom')) || 0);
            for (var next = up.next(); next instanceof Element; next = next.next()) {
                if ('none' !== next.getStyle('display') && 'fixed' !== next.getStyle('position') && 'absolute' !== next.getStyle('position')) {
                    blockHeight = blockHeight - next.getHeight();
                }
            }
        }

        if (blockHeight < minHeight) {
            blockHeight = minHeight;
        }

        if (blockHeight > table.getHeight() + parseInt(table.getStyle('marginTop'))) {
            wrapper.setStyle({height: null});
        } else {
            wrapper.setStyle({height: blockHeight + 'px'});
        }

        if (!visibleHeader || !table.select('tr.odd,tr.even').filter(Element.visible)) {
            return;
        }

        var invisibleHeader = table.down('thead');
        invisibleHeader.select('th').each(function(th, index) {
            visibleHeader.select('th')[index].setStyle({width: th.getWidth() + 'px'});
        });
        var lastHeader = visibleHeader.down('th:last');
        lastHeader.setStyle({width: (headerTable.getWidth() - invisibleHeader.up('table').getWidth()) + parseInt(lastHeader.getStyle('width')) +'px'});
    },

    _addResponsiveHtml: function() {
        // Don't need responsive UI in case of logs list
    },

    _addEvents: function($super) {
        $super();
        Event.observe(
            window,
            'resize',
            this._resizeList.bind(this),
            false
        );
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.UAT = (function () {
    /**
     * AWS.Firehose instance
     */
    var firehose;

    var config;

    var initialized = false;

    function getUrl(href) {
        var link = window.location;
        if (href) {
            link = document.createElement("a");
            link.href = href;
        }
        return link.pathname + link.search + link.hash;
    }

    function preparePostData(action, target) {
        var data = {};
        if (action.post && target) {
            if (action.post.self) {
                action.post.self.forEach(function (attr) {
                    if (attr === 'value') {
                        return;
                    }
                    var value = target.getAttribute(attr);
                    if (value) {
                        data[attr] = value;
                    }
                });
            }
            if (action.post.selfText) {
                data.text = target.innerText;
            }
        }
        if (action.data) {
            Object.keys(action.data).forEach(function (key) {
                data[key] = action.data[key];
            });
        }
        return data;
    }

    function request(action, target, result) {
        var parameters = {
            timestamp: (new Date()).toISOString(),
            instanceId: config.instanceId,
            accountLevel: config.accountLevel,
            accountId: config.accountId,
            sessionId: config.sessionId,
            path: action.url || getUrl(),
            action: action.name || null,
            result: result || null,
        };

        var data = preparePostData(action, target);
        if (config.parentId) {
            data.parentId = config.parentId;
        }
        if (Object.keys(data).length) {
            parameters.additionalData = JSON.stringify(data);
        }
        if (Object.isFunction(config.logger)) {
            config.logger(parameters);
        }
        if (!config.firehose) {
            return null;
        }
        if (!firehose) {
            firehose = new AWS.Firehose(config.firehose);
        }

        firehose.putRecord({
            DeliveryStreamName: config.firehose.stream,
            Record: {
                Data: Object.values(parameters).join("|") + "\n",
            },
        }, function () {});
    }

    var patches = (function () {
        function wrap(handler, fn, after) {
            fn = fn || function () {};
            return after === true
                ? function () {
                    var result = fn.apply(this, arguments);
                    var args = Array.prototype.slice.call(arguments);
                    args.push(result);
                    try {
                        handler.apply(this, args);
                    } catch (e) {
                    }
                    return result;
                }
                : function () {
                    try {
                        handler.apply(this, arguments);
                    } catch (e) {
                    }
                    return fn.apply(this, arguments);
                };
        }

        return {
            uiPointerForm: function () {
                document.addEventListener('DOMContentLoaded', function () {
                    var lastUrl = Jsw.Cookie.get('uat-data-source');
                    if (lastUrl) {
                        var msgs = document.querySelectorAll('div[data-source]');
                        if (msgs.length) {
                            for(var i = 0; i < msgs.length; i++) {
                                var dataSource = msgs[i].getAttribute('data-source');
                                if (dataSource && dataSource.indexOf(lastUrl) !== -1) {
                                    var result = null;
                                    switch (true) {
                                        case msgs[i].hasClassName('msg-warning'):
                                            result = 'WARNING';
                                            break;
                                        case msgs[i].hasClassName('msg-error'):
                                            result = 'ERROR';
                                            break;
                                    }
                                    request({ name: 'POST', url: getUrl(dataSource) }, null, result);
                                }
                            }
                        }
                        Jsw.Cookie.remove('uat-data-source', '/');
                    }
                    if (typeof update_oC === 'undefined') {
                        return null;
                    }
                    update_oC = wrap(function (form) {
                        Jsw.Cookie.set('uat-data-source', getUrl(form.action), null, '/');
                    }, update_oC, true);
                }, true);
            },

            jswFormAjax: function () {
                var formAjaxProto = Jsw.FormAjax.prototype;

                formAjaxProto._onSubmit = wrap(function () {
                    this._componentElement._formSubmit = wrap(function () {
                        var url = getUrl(this._componentElement.action);
                        request({ name: 'POST', url: url, post: { self: ['id', 'name'] } }, this._componentElement);
                    }.bind(this), this._componentElement._formSubmit);
                }, formAjaxProto._onSubmit);

                formAjaxProto._onFailure = wrap(function (transport) {
                    var name = this._componentElement.noRedirect ? 'APPLY' : 'OK';
                    var url = getUrl(transport.request.url);
                    request({ name: name, url: url, post: { self: ['id', 'name'] } }, this._componentElement, 'ERROR');
                }, formAjaxProto._onFailure);

                formAjaxProto._onSuccess = wrap(function (transport) {
                    var name = this._componentElement.noRedirect ? 'APPLY' : 'OK';
                    var url = getUrl(transport.request.url);
                    var result = transport.responseJSON.formMessages
                        ? 'VALIDATION_ERROR'
                        : transport.responseJSON.status === 'error'
                            ? 'ERROR'
                            : null;
                    request({ name: name, url: url, post: { self: ['id', 'name'] } }, this._componentElement, result);
                }, formAjaxProto._onSuccess);
            },

            jswList: function () {
                var listProto = Jsw.List.prototype;

                listProto._submit = wrap(function (url, params) {
                    var self = params.context || this;
                    params.onSuccess = wrap(function (transport) {
                        var name = self._lastOperation ? self._lastOperation.toUpperCase() : 'POST';
                        var data = { selected: Object.keys(transport.request.parameters).length };
                        var result = transport.responseJSON.status === 'error' ? 'ERROR' : null;
                        request({ name: name, url: getUrl(transport.request.url), data: data }, null, result);
                    }, params.onSuccess);

                    params.onFailure = wrap(function (transport) {
                        var name = self._lastOperation ? self._lastOperation.toUpperCase() : 'POST';
                        var data = { selected: Object.keys(transport.request.parameters).length };
                        request({ name: name, url: getUrl(transport.request.url), data: data }, null, 'ERROR');
                    }, params.onFailure);
                }, listProto._submit);

                listProto._showItemsNotSelectedWarning = wrap(function () {
                    var name = this._lastOperation ? this._lastOperation.toUpperCase() : 'POST';
                    request({ name: name, url: getUrl() }, null, 'NOT_SELECTED');
                }, listProto._showItemsNotSelectedWarning);

                listProto._getOperations = wrap(function (result) {
                    var self = this;
                    function replaceHandlers(operations) {
                        operations.each(function (operation) {
                            if (operation.handler) {
                                operation.handler = wrap(function () {
                                    var o = operation, last = o.id || o.title || o.description || o.addCls || '';
                                    self._lastOperation = last
                                        .replace('button', '')
                                        .replace(' ', '')
                                        .replace('sb-', '')
                                        .replace('-', '');
                                }, operation.handler);
                            }
                            if (operation.operations) {
                                replaceHandlers(operation.operations);
                            }
                        });
                    }
                    replaceHandlers(result);
                }, listProto._getOperations, true);
            },

            confirmationPopupManager: function () {
                var popupFormProto = Jsw.ConfirmationPopupManager.PopupForm.prototype;

                popupFormProto._onSuccess = wrap(function () {
                    var name = typeof this._id === 'string' ? this._id.toUpperCase() : 'POST';
                    request({ name: name, url: this._handlerUrl });
                }, popupFormProto._onSuccess);

                popupFormProto._onException = wrap(function () {
                    var name = typeof this._id === 'string' ? this._id.toUpperCase() : 'POST';
                    request({ name: name, url: this._handlerUrl }, null, 'ERROR');
                }, popupFormProto._onException);

                popupFormProto._onCancelClick = wrap(function () {
                    request({ name: 'CANCEL', url: getUrl(), data: { popup: this._text } });
                }, popupFormProto._onCancelClick);
            },

            ajaxPopupForm: function () {
                Jsw.AjaxPopupForm.prototype._onSuccess = wrap(function () {
                    (function () {
                        var cancelBtn = Jsw.getComponent('btn-cancel');
                        cancelBtn && cancelBtn.addEventObserver('click', function () {
                            request({ name: 'CANCEL', url: this._url });
                        }.bind(this));
                    }).bind(this).defer();
                }, Jsw.AjaxPopupForm.prototype._onSuccess, true);
            },

            messageBox: function () {
                var msgBoxProto = Jsw.MessageBox.prototype;

                msgBoxProto._onNoClick = wrap(function () {
                    request({ name: 'CANCEL', url: getUrl(), data: { popup: this._text } });
                }, msgBoxProto._onNoClick);
            },

            ajaxMessageBox: function () {
                var ajaxMsgBoxProto = Jsw.AjaxMessageBox.prototype;

                ajaxMsgBoxProto._onSuccess = wrap(function () {
                    request({ url: this._requestUrl });
                }, ajaxMsgBoxProto._onSuccess);
            },
        };
    })();

    var watchers = (function () {
        function _defaultEvent(config, expect, action, eventName) {
            document.addEventListener(eventName, function (event) {
                if (action.preconditions) {
                    var match = action.preconditions.pathMatch;
                    if (match && !match.test(getUrl())) {
                        return;
                    }
                }
                var targetEl = event.target;
                var activeEl = event.currentTarget.activeElement;
                if (config.tags) {
                    if (targetEl && config.tags.indexOf(targetEl.nodeName.toLowerCase()) !== -1
                        || activeEl && config.tags.indexOf(activeEl.nodeName.toLowerCase()) !== -1
                    ) {
                        request(action, activeEl);
                    }
                } else if (config.element) {
                    var elements = Array.prototype.slice.call(document.querySelectorAll(config.element));
                    var elementIsFound = elements.some(function (el) {
                        return targetEl === el || activeEl === el;
                    });
                    if (elementIsFound) {
                        request(action, event.target);
                    }
                }
            }, true);
        }

        return {
            sessionChanged: function () {
                document.addEventListener('DOMContentLoaded', function () {
                    if (Jsw.Cookie.get('uat-sid') !== config.sessionId) {
                        Jsw.Cookie.remove('uat-sid', '/');
                        Jsw.Cookie.set('uat-sid', config.sessionId, null, '/');
                        var data = {
                            userAgent: navigator.userAgent,
                            versionInfo: config.versionInfo,
                        };
                        request({ name: 'LOGIN', url: getUrl(), data: data });
                    }
                }, true);
            },

            unloadByClick: function (config, expect, action) {
                window.addEventListener('beforeunload', function (event) {
                    if (event.target.activeElement === document.querySelector(config.element)) {
                        request(action, event.target, null, true);
                    }
                }, true);
            },

            contentLoad: function (config, expect, action) {
                document.addEventListener('DOMContentLoaded', function (event) {
                    request(action, event.target);
                }, true);
            },

            click: _defaultEvent,

            change: _defaultEvent,
        };
    })();

    var actions = [
        {
            name: 'LOGIN',
            expects: [{
                sessionChanged: {},
            }],
        },
        {
            expects: [{
                contentLoad: {},
            }],
        },
        {
            name: 'LOGOUT',
            expects: [{
                unloadByClick: {
                    element: '#account-menu-content-area a[href="/logout.php"]',
                },
            }],
        },
        {
            name: 'HELP',
            expects: [{
                click: {
                    element: 'a[data-type="link-read-manual"]',
                },
            }],
        },
        {
            name: 'CANCEL',
            expects: [{
                click: {
                    element: 'button[name="cancel"]',
                },
            }],
        },
        {
            name: 'CANCEL',
            expects: [{
                click: {
                    element: 'button[name="bname_cancel"]',
                },
            }],
        },
    ];

    function patchUI() {
        Object.keys(patches).forEach(function (patch) { patches[patch](); });
    }

    function startTracking() {
        actions.forEach(function (action) {
            action.expects.forEach(function (expect) {
                Object.keys(expect).forEach(function (event) {
                    watchers[event] && watchers[event](expect[event], expect, action, event);
                });
            });
        });
    }

    return {
        init: function (initConfig) {
            if (!initConfig || initialized) {
                return null;
            }

            config = initConfig;
            patchUI();
            startTracking();
            initialized = true;
        },

        setLogger: function (logger) {
            config.logger = logger;
        },

        dispatchAction: function (action, data) {
            if (!initialized) {
                return null;
            }

            request({ name: action, url: getUrl(), data: data });
        },
    };
})();

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

/**
 * @class Jsw.ViewSwitcher
 * @extends Jsw.Component
 */
Jsw.ViewSwitcher = Class.create(Jsw.Component, {

    /**
     * @cfg {Boolean} isPowerUserPanel
     */
    /**
     * @cfg {Boolean} showPowerUserViewWarning
     */
    /**
     * @cfg {String} learnMoreUrl
     */
    /**
     * @cfg {Object} locale
     * @cfg {String} locale.title
     * @cfg {String} locale.currentViewMessage
     * @cfg {String} locale.powerUserView
     * @cfg {String} locale.serviceProviderView
     * @cfg {String} locale.actionMessage
     * @cfg {String} locale.switchView
     * @cfg {String} locale.learnMore
     * @cfg {String} locale.powerUserViewWarning
     * @cfg {String} locale.confirmationBoxText
     * @cfg {String} locale.confirmationBoxDescription
     * @cfg {String} locale.confirmationBoxButtonYes
     * @cfg {String} locale.confirmationBoxButtonNo
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = 'view-switcher';
        this._isPowerUserPanel = this._getConfigParam('isPowerUserPanel');
        this._showPowerUserViewWarning = this._getConfigParam('showPowerUserViewWarning');
        this._learnMoreUrl = this._getConfigParam('learnMoreUrl');
    },

    _initComponentElement: function($super) {
        $super();

        this._updateComponentElement(
            '<span class="close"></span>' +
            '<a href="#"><i class="icon-nav-navigation"></i> ' + this.lmsg('title') + '</a>'
        );
    },

    _addEvents: function($super) {
        $super();

        this._componentElement.down('span').observe('click', function(event) {
            event.preventDefault();

            Jsw.messageBox.show({
                'type': Jsw.messageBox.TYPE_YESNO,
                'subtype': 'toggle',
                'text': this.lmsg('confirmationBoxText'),
                'description': this.lmsg('confirmationBoxDescription'),
                'buttonTitles': {
                    'yes': this.lmsg('confirmationBoxButtonYes'),
                    'no': this.lmsg('confirmationBoxButtonNo')
                },
                'onYesClick': function() {
                    this.hide();
                    new Ajax.Request('/admin/index/hide-view-switcher', {method: 'post'});
                }.bind(this)
            });
        }.bindAsEventListener(this));

        this._componentElement.down('a').observe('click', function(event) {
            event.stop();

            var popover = this._getPopover();
            popover.toggleClassName('collapsed');
            if (popover.hasClassName('collapsed')) {
                return;
            }

            var pos = $$('.view-switcher').first().cumulativeOffset();
            var popHeight = popover.getHeight();
            var topPos = pos[1] + document.viewport.getScrollOffsets().top - popHeight + 'px';
            popover.setStyle({'top': topPos});
        }.bindAsEventListener(this));

        Event.observe(window, 'scroll', function() {
            this._getPopover().addClassName('collapsed');
        }.bind(this));
    },

    _getPopover: function() {
        if (!this._popover) {
            this._popover = new Element('div', {'class': 'popup-box top view-switcher-popover collapsed'}).update(
                '<table cellspacing="0" class="popup-wrapper"><tbody><tr><td class="popup-container">' +
                    '<div class="c1"><div class="c2"><div class="c3"><div class="c4"><div class="c5">' +
                        '<div class="popup-heading">' +
                            '<div class="heading-area">' +
                                '<span class="close"></span>' +
                                '<h4><span>' + this.lmsg('title') + '</span></h4>' +
                            '</div>' +
                        '</div>' +
                        '<div class="popup-content">' +
                            '<div class="popup-content-area">' +
                                '<span class="arrow"></span>' +
                                this.lmsg('currentViewMessage', {view: this.lmsg(this._isPowerUserPanel ? 'powerUserView' : 'serviceProviderView')}) +
                                '<p>' + this.lmsg('actionMessage', {
                                    switchLink: '<a href="#" class="js-switch-view">' + this.lmsg('switchView', {view: this.lmsg(this._isPowerUserPanel ? 'serviceProviderView' : 'powerUserView')}) + '</a>',
                                    helpLink: '<a href="' + this._learnMoreUrl + '">' + this.lmsg('learnMore') + '</a>'
                                }) + '</p>' +
                                (this._showPowerUserViewWarning ? '<i class="icon-attention-tr"></i> ' + this.lmsg('powerUserViewWarning') : '') +
                            '</div>' +
                        '</div>' +
                    '</div></div></div></div></div>' +
                '</td></tr></tbody></table>'
            );
            this._popover.down('.heading-area .close').observe('click', function(event) {
                event.preventDefault();
                this._popover.addClassName('collapsed');
            }.bindAsEventListener(this));
            this._popover.down('.popup-content-area .js-switch-view').observe('click', function(event) {
                event.preventDefault();
                new Ajax.Request(Jsw.prepareUrl('/admin/index/change-view'), {
                    method: 'post',
                    onSuccess: function(transport) {
                        var result = transport.responseText.evalJSON();
                        if (result.redirect) {
                            Jsw.redirect(result.redirect);
                        }
                    }
                });
                this._popover.addClassName('collapsed');
            }.bindAsEventListener(this));
            this._popover.observe('click', function(event) {
                event.stopPropagation();
            }.bindAsEventListener(this));
            $(document.body).observe('click', function() {
                this._popover.addClassName('collapsed');
            }.bind(this));

            $(document.body).insert(this._popover);
        }

        return this._popover;
    }
});


// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.FileManager');

/**
 * @class Jsw.FileManager.Tree
 * The widget displays directories and files in the webspace, allows selection
 * @extends Jsw.Component
 *
 * Example usage:
 *
 *     @example
 *     new Jsw.FileManager.Tree({
 *         renderTo: document.body,
 *         rootNodeTitle: 'Root node',
 *         data: [{
 *             name: 'folder',
 *             isDirectory: true,
 *             icon: '/icons/16/plesk/file-folder.png'
 *         }, {
 *             name: 'file.html',
 *             isDirectory: false,
 *             icon: '/icons/16/plesk/file-html.png'
 *         }]
 *     });
 */
Jsw.FileManager.Tree = Class.create(Jsw.Component, {

    /**
     * @cfg {Object[]} data=[]
     */
    /**
     * @cfg {String} dataUrl=""
     */
    /**
     * @cfg {Boolean} showFiles=false
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._data = this._getConfigParam('data', []);
        this._dataUrl = this._getConfigParam('dataUrl', '');
        this._createFolderUrl = this._getConfigParam('createFolderUrl', '');
        this._onNodeClick = this._getConfigParam('onNodeClick', function() {});
        this._rootNodeTitle = this._getConfigParam('rootNodeTitle', '');
        this._onReload = this._getConfigParam('onReload', function() {});
        this._showFiles = this._getConfigParam('showFiles', false);
        this._filterNodes = this._getConfigParam('filterNodes', function() { return true; });
        if (this._getConfigParam('showMessage')) {
            this._showMessage = this._getConfigParam('showMessage');
        }
    },

    _initComponentElement: function($super) {
        $super();
        if (null === this._data) {
            this.reload();
        } else {
            this._initTreeView();
        }
    },

    _initTreeView: function() {
        var container = this._componentElement.update(new Element('div', { 'class': 'tree-wrap' })).down();

        this._insertNode(container, {
            name: this._rootNodeTitle,
            path: '/',
            icon: '/icons/16/plesk/file-folder.png',
            htmlElement: 'div',
            cssClass: 'tree-item-root',
            isRootDirectory: true
        });
        container.insert(this._getNodes(this._data));
    },

    _getNodes: function(items) {
        var ulElement = new Element('ul', { 'class': 'tree-container' });

        items.filter(this._filterNodes).forEach(this._insertNode.bind(this, ulElement));

        return ulElement;
    },

    _insertNode: function(container, item, position) {
        var element = new Element(item.htmlElement ? item.htmlElement : 'li',
            { 'class': 'tree-item ' + (item.cssClass ? item.cssClass : '') });
        var wrapper = element.update('<div class="tree-item-wrap"></div>').down();
        element.data = item;

        var itemSelect = new Element('div', { 'class': 'tree-item-select' });
        wrapper.insert(itemSelect);
        this._addCommonEvents(itemSelect, item, element);
        if (item.isDirectory) {
            wrapper.insert('<span class="tree-item-state"><img src="' + Jsw.skinUrl + '/images/tree-open.gif' + '" height="16" width="16"></span>');
            wrapper.down('.tree-item-state').observe('click', this._onNodeToggle.bind(this, item.path, element));
            wrapper.observe('dblclick', this._onNodeToggle.bind(this, item.path, element));
            wrapper.down('.tree-item-state').observe('mouseover', this._onNodeMouseover.bind(this, element));
            wrapper.down('.tree-item-state').observe('mouseleave', this._onNodeMouseleave.bind(this, element));
        } else if (!item.isRootDirectory) {
            wrapper.insert('<span class="tree-item-state"><img src="' + Jsw.skinUrl + '/images/blank.gif' + '" height="16" width="16"></span>');
        }
        var linkElement = new Element('a', { 'class': 'tree-item-content', 'href': '#' });
        linkElement.update('<span><img src="' + Jsw.skinUrl + item.icon + '" alt=""><b>' + item.name.escapeHTML() + '</b></span>');
        this._addCommonEvents(linkElement, item, element);
        wrapper.insert(linkElement);

        if (position !== 'top') {
            position = 'bottom';
        }
        var insertion = {};
        insertion[position] = element;
        container.insert(insertion);
    },

    _addCommonEvents: function(target, item, element) {
        target.observe('mouseover', this._onNodeMouseover.bind(this, element));
        target.observe('mouseleave', this._onNodeMouseleave.bind(this, element));
        target.observe('click', this._onNodeSelect.bindAsEventListener(this, element));
        target.observe('click', this._onNodeClick.bind(this, item.path, element));
    },

    _onNodeToggle: function(directoryPath, containerElement) {
        var subTreeElement = containerElement.down('ul');
        var expandElement = containerElement.down('.tree-item-state');

        if (subTreeElement) {
            expandElement.update('<img src="' + Jsw.skinUrl + '/images/tree-open.gif' + '" height="16" width="16">');
            subTreeElement.remove();
            containerElement.data.showNewNode = false;
            return;
        }

        this._loadNode(directoryPath, containerElement);
    },

    _loadNode: function(directoryPath, containerElement) {
        if (containerElement.down('.tree-item-state').down('.js-loader')) {
            return;
        }
        new Ajax.Request(
            Jsw.prepareUrl(this._dataUrl),
            {
                method:'post',
                parameters: { 'rootDir': directoryPath, showFiles: this._showFiles },
                onCreate: this._onNodeLoadStart.bind(this, containerElement),
                onSuccess: this._onNodeLoadSuccess.bind(this, containerElement),
                onFailure: this._onNodeLoadFailure.bind(this)
            }
        );
    },

    _isNodeExpanded: function(nodeElement) {
        return !!nodeElement.down('ul') || nodeElement.hasClassName('tree-item-root');
    },

    _onNodeLoadStart: function(containerElement) {
        var expandElement = containerElement.down('.tree-item-state');
        expandElement.update('<img src="' + Jsw.skinUrl + '/images/indicator.gif' + '" height="16" width="16" class="js-loader">');
    },

    _onNodeLoadSuccess: function(containerElement, request) {
        var expandElement = containerElement.down('.tree-item-state');
        var items = request.responseText.evalJSON();
        if (items.status) {
            expandElement.update('<img src="' + Jsw.skinUrl + '/images/tree-open.gif' + '" height="16" width="16">');
            this._showMessage(items.status, items.message);
            return;
        }

        Jsw.clearStatusMessages();
        expandElement.update('<img src="' + Jsw.skinUrl + '/images/tree-close.gif' + '" height="16" width="16">');
        containerElement.insert(this._getNodes(items));
        if (containerElement.data.showNewNode) {
            this.showNewNode(containerElement);
        }
    },

    _showMessage: function(status, message) {
        Jsw.clearStatusMessages();
        Jsw.addStatusMessage(status, message);
    },

    _onNodeSelect: function(event, containerElement) {
        if (event) {
            event.preventDefault();
        }
        this.resetSelection();
        containerElement.down('.tree-item-wrap').addClassName('tree-item-row-active');
        this.hideNewNode();
    },
    resetSelection: function() {
        this._componentElement.select('.tree-item-wrap').each(function(element) {
            element.removeClassName('tree-item-row-active');
        });
    },
    _onNodeMouseover: function(containerElement) {
        this.resetHover();
        containerElement.down('.tree-item-select').addClassName('tree-item-hover');
    },
    _onNodeMouseleave: function(containerElement) {
        this.resetHover();
        containerElement.down('.tree-item-select').removeClassName('tree-item-hover');
    },
    resetHover: function() {
        this._componentElement.select('.tree-item-select').each(function(element) {
            element.removeClassName('tree-item-hover');
        });
    },

    /**
     * @param {String} directory
     */
    setDirectory: function(directory) {
        var node = this._getNodeElement(directory);
        if (node) {
            this._onNodeSelect(null, node);
        }
    },

    reload: function() {
        this._componentElement.update('<div class="ajax-loading">Please wait...</div>');

        new Ajax.Request(
            Jsw.prepareUrl(this._dataUrl),
            {
                method: 'post',
                parameters: { 'rootDir': '/', showFiles: this._showFiles },
                onSuccess: this._onFullReloadSuccess.bind(this),
                onFailure: this._onNodeLoadFailure.bind(this)
            }
        );
    },

    _onFullReloadSuccess: function(request) {
        this._data = request.responseText.evalJSON();
        this._initTreeView();
        this._onReload();
    },

    _onNodeLoadFailure: function() {
        Jsw.showInternalError('Failed to load tree data.');
    },

    reloadPath: function(path) {
        if (path === '/') {
            this.reload();
            return;
        }

        var node = this._getNodeElement(path);
        if (!node) {
            return;
        }

        if (this._isNodeExpanded(node)) {
            node.down('ul').remove();
            this._loadNode(path, node);
        }
    },

    _getNodeElement: function(path) {
        var nodes = this._componentElement.select('.tree-item');
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].data.path === path) {
                return nodes[i];
            }
        }
    },

    getSelectedNode: function() {
        var selectedElement = this._componentElement.select('.tree-item-row-active').first();
        if (!selectedElement) {
            return null;
        }

        return selectedElement.up('.tree-item');
    },

    getSelectedItemData: function() {
        var selectedElement = this.getSelectedNode();
        if (!selectedElement) {
            return null;
        }

        return selectedElement.data;
    },

    expandNode: function(node) {
        if (!node) {
            node = this.getSelectedNode();
        }
        if (this._isNodeExpanded(node)) {
            return;
        }

        this._loadNode(node.data.path, node);
    },

    showNewNode: function(parentNode) {
        if (!parentNode) {
            parentNode = this.getSelectedNode();
        }
        if (!parentNode) {
            // Process root node
            parentNode = this._componentElement.select('.tree-item-root').first();
        }
        parentNode.data.showNewNode = true;
        if (!this._isNodeExpanded(parentNode)) {
            this.expandNode(parentNode);
            return;
        }
        var container = parentNode.down('ul.tree-container');
        if (!container) {
            // Process root node
            container = parentNode.next();
        }
        this._insertNewNode(container, {
            name: name,
            path: parentNode.data.path,
            icon: '/icons/16/plesk/file-folder.png',
            isDirectory: true,
            type: "dir"
        }, 'top');
    },

    hideNewNode: function() {
        var newNode = this._componentElement.down('.js-tree-item-new');
        if (!newNode) {
            return;
        }
        var parentNode = newNode.up('.tree-item');
        if (!parentNode) {
            // Process root node
            parentNode = this._componentElement.down('.tree-item-root');
        }
        parentNode.data.showNewNode = false;
        newNode.remove();
    },

    _insertNewNode: function(container, item, position) {
        if (container.down('> .js-tree-item-new')) {
            return;
        }
        var ce = Jsw.createElement;
        var element = ce('li.tree-item js-tree-item-new', {
                onrender: function(el) {
                    el.data = item;
                }
            },
            ce('div.tree-item-wrap',
                ce('span.tree-item-state', ce('img', {src: Jsw.skinUrl + '/images/blank.gif'})),
                ce('div.tree-item-content',
                    ce('div.input-btn-group',
                        ce('i.icon-folder'),
                        ce('input.form-control', {'type': 'text', onkeydown: this._onNewNodeKeyDown.bind(this)}),
                        ce('button.btn btn-icon-only input-btn',
                            {'type': 'button', onclick: this._onCreateFolder.bind(this)}, ce('i.icon-save')),
                        ce('button.btn btn-icon-only input-btn',
                            {'type': 'button',  onclick: this._onCancelCreateFolder.bind(this)}, ce('i.icon-cancel'))
                    )
                )
            )
        );

        Jsw.render(container, element, position);
        container.down('> .js-tree-item-new input').focus();
    },

    _onCreateFolder: function(e) {
        var name = e.target.up('.input-btn-group').down('.form-control').value;
        var newNode = e.target.up('.js-tree-item-new');
        var parentNode = newNode.up('.tree-item');
        if (!parentNode) {
            // Process root node
            parentNode = newNode.up('ul.tree-container').previous();
        }
        new Ajax.Request(
            Jsw.prepareUrl(this._createFolderUrl),
            {
                method: 'post',
                parameters: {
                    currentDir: newNode.data.path,
                    newDirectoryName: name
                },
                onSuccess: this._onFolderCreated.bind(this, name, parentNode)
            }
        );
    },

    _onFolderCreated: function(name, parentNode, transport) {
        var response = transport.responseText.evalJSON();
        var row = parentNode.up('.form-row');
        var errorMessage;
        if (response.status === 'success') {
            var path = parentNode.data.path + '/' + name;
            var container = parentNode.down('ul.tree-container');
            if (!container) {
                // Process root node
                container = parentNode.next();
            }
            this.hideNewNode();
            this._insertNode(container, {
                name: name,
                path: path,
                icon: '/icons/16/plesk/file-folder.png',
                isDirectory: true,
                type: "dir"
            }, 'top');
            this._onNodeSelect(null, container);
            row.removeClassName('error');
            errorMessage = row.down('.field-value .field-errors');
            if (errorMessage) {
                errorMessage.remove();
            }
        } else {
            row.addClassName('error');
            var ce = Jsw.createElement;
            errorMessage = ce('span.field-errors', ce('span.error-hint', response.message));
            Jsw.render(row.down('.field-value'), errorMessage);
        }
    },

    _onCancelCreateFolder: function() {
        this.hideNewNode();
    },

    _onNewNodeKeyDown: function(e) {
        switch (e.keyCode) {
            case Event.KEY_RETURN:
                e.preventDefault();
                this._onCreateFolder(e);
                break;
            case Event.KEY_ESC:
                e.preventDefault();
                this._onCancelCreateFolder(e);
                break;
        }
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.FileManager');

/**
 * @class Jsw.FileManager.UploadAdapterIframe
 */
Jsw.FileManager.UploadAdapterIframe = Class.create({
    initialize: function(config) {
        this._contentAreaId = config.contentAreaId;
        this._handlerUrl = config.handlerUrl;
        this._startUploadHandler = config.startUploadHandler;
        this._finishUploadHandler = config.finishUploadHandler;
        this._uploadFrameInitialized = false;
        this._getUploadIFrameElement();
    },

    _getUploadIFrameElement: function() {
        if (!$(this._contentAreaId).down('iframe')) {
            this._uploadFrameElement = new Element('iframe', {
                id: this._contentAreaId + '-upload-iframe',
                name: '_uploadIFrame',
                style: "display: none;",
                src: this._handlerUrl
            });
            $(this._contentAreaId).insert(this._uploadFrameElement);
            this._uploadFrameElement.observe('load', this._onUploadFrameInitialized.bindAsEventListener(this));
        }
        return this._uploadFrameElement;
    },

    _onUploadFrameInitialized: function()
    {
        if (this._uploadFrameInitialized) {
            return;
        }
        this._uploadFrameInitialized = true;
        this._uploadFrameElement.observe('load', this._finishUploadHandler);
        this._startUploadHandler();
    },

    isReady: function() {
        return this._uploadFrameInitialized;
    },

    getResult: function() {
        var statusFrame = this._getUploadIFrameElement();
        var statusDocument = statusFrame.contentDocument || statusFrame.contentWindow.document;
        try {
            return statusDocument.body.innerHTML.evalJSON();
        } catch(e) {
            return {
                status: 'ERROR',
                message: 'No upload response'
            };
        }
    },

    cancel: function() {
        if (this._uploadFrameElement){
            this._uploadFrameElement.setAttribute('src', 'javascript:false;');
        }
        this._finishUploadHandler();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.form');

/**
 * @class Jsw.form.Form
 * @extends Jsw.Component
 */
Jsw.form.Form = Class.create(Jsw.Component, {
    _tag: 'form',

    _initConfiguration: function ($super, config) {
        config = config || {};
        config.attrs = Object.extend({
            enctype: 'application/x-www-form-urlencoded',
            method: 'post'
        }, config.attrs || {});

        $super(config);
    },

    render: function ($super) {
        $super();

        var params = this._getConfigParam('params', {});
        if ($('forgery_protection_token')) {
            params.forgery_protection_token = $('forgery_protection_token').content;
        }

        Object.keys(params).forEach(function (name) {
            this._componentElement.insert(new Element('input', {
                type: 'hidden',
                name: name,
                value: params[name]
            }));
        }.bind(this));
    },

    _addEvents: function () {
        this._componentElement._formSubmit = this._componentElement.submit;
        this._componentElement.submit = this._onSubmit.bind(this);
        this._componentElement.observe('submit', function (event) {
            this._onSubmit();
            event.stop();
        }.bind(this));
    },

    _onSubmit: function () {
        this._componentElement._formSubmit();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.form');

/**
 * @class Jsw.form.GetPassword
 * @extends Jsw.form.Form
 */
Jsw.form.GetPassword = Class.create(Jsw.form.Form, {
    _initComponentElement: function ($super) {
        $super();

        this._componentElement.update(
            '<div id="getLinkSection" class="form-box">' +
                '<div id="getLinkSection-content-area">' +

                    this._getConfigParam('warnings', '') +

                    '<div class="login-info">' +
                        '<h3>' + this.lmsg('label') + '</h3>' +
                        this.lmsg('text') +
                    '</div>' +

                    '<div id="getLinkSection-username-form-row" class="form-row">' +
                        '<div class="field-name"><label for="getLinkSection-username">' + this.lmsg('loginLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="text" name="login_name" id="getLinkSection-username" value="' + this._getConfigParam('loginNameValue', '') + '" class="input-text" />' +
                        '</div>' +
                    '</div>' +

                    '<div id="getLinkSection-email-form-row" class="form-row">' +
                        '<div class="field-name"><label for="getLinkSection-email">' + this.lmsg('emailLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="text" name="email" id="getLinkSection-email" value="' + this._getConfigParam('emailValue', '') + '" class="input-text" />' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="btns-box">' +
                '<div class="box-area">' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                        '</div>' +
                        '<div class="field-value">' +


                            '<span id="btn-send" class="btn">' +
                                '<button type="submit" value="" name="send">' + this.lmsg('send') + '</button>' +
                            '</span>' +
                            '<span id="btn-cancel" class="btn">' +
                                '<button id="getLinkSection-cancel-button" type="button" value="" name="cancel">' + this.lmsg('cancel') + '</button>' +
                            '</span>' +

                            '<input type="image" src="/smb/images/blank.gif" style="border: 0; height: 0; width: 0; position: absolute;" />' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        this._componentElement.down('#getLinkSection-cancel-button').observe('click', function () {
            Jsw.redirect("/login_up.php");
        });
        this._componentElement.down('#getLinkSection-username').focus();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.form');

/**
 * @class Jsw.form.Login
 * @extends Jsw.form.Form
 */
Jsw.form.Login = Class.create(Jsw.form.Form, {
    _initComponentElement: function ($super) {
        $super();

        this._componentElement.update(
            '<div id="loginSection" class="form-box">' +
                '<div id="loginSection-content-area">' +

                    this._getConfigParam('warnings', '') +

                    '<div id="loginSection-username-form-row" class="form-row">' +
                        '<div class="field-name"><label for="loginSection-username">' + this.lmsg('loginLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="text" name="' + this._getConfigParam('loginInputName', '') + '" id="loginSection-username" value="' + this._getConfigParam('loginNameValue', '') + '" class="input-text" />' +
                        '</div>' +
                    '</div>' +

                    '<div id="loginSection-password-form-row" class="form-row" >' +
                        '<div class="field-name"><label for="loginSection-password">' + this.lmsg('passwdLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="password" name="' + this._getConfigParam('passwdInputName', '') + '" id="loginSection-password" value="" class="input-text" />' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-row">' +
                        '<div class="field-name"><label for="fid-locale">' + this.lmsg('localeLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' + this._getConfigParam('localeSelect', '')  + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="btns-box">' +
                '<div class="box-area">' +
                    '<div class="form-row">' +

                        '<div class="field-name">' +
                            '<a href="/get_password.php">' + this.lmsg('forgotPasswordLabel') + '</a>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<span id="btn-send" class="btn">' +
                                '<button type="submit" value="" name="send">' + this.lmsg('loginButtonLabel') + '</button>' +
                            '</span>' +

                            '<input type="image" src="/theme/images/blank.gif" style="border: 0; height: 0; width: 0; position: absolute; left: -9999px;"/>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        this._componentElement.down('#fid-' + this._getConfigParam('loginSelectName', '')).observe('change', function () {
            this._componentElement._formSubmit()
        }.bind(this));
    },

    render: function($super) {
        $super();

        this._componentElement.down('#loginSection-username').focus();
        this._componentElement.down('#loginSection-username').select();
    },

    _onSubmit: function ($super) {
        if (this._componentElement.down('#loginSection-username').value === ''
            || this._componentElement.down('#loginSection-password').value === ''
        ) {
            alert(this.lmsg('enterLoginAndPasswd'));
            this._componentElement.down('#loginSection-username').focus();
            this._componentElement.down('#loginSection-username').select();
            return;
        }

        $super();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.form');

/**
 * @class Jsw.form.RestorePassword
 * @extends Jsw.form.Form
 */
Jsw.form.RestorePassword = Class.create(Jsw.form.Form, {
    _initComponentElement: function ($super) {
        $super();

        this._componentElement.update(
            this._getConfigParam('warnings', '') +

            '<input type="hidden" name="cmd" value="update">' +
            '<div id="restorePasswordSection">' +
                '<div id="restorePasswordSection-content-area">' +
                    '<div id="restorePasswordSection-title"><h3>' + this.lmsg('title') + '&nbsp;</h3></div>' +

                    '<div id="restorePasswordSection-login-name-form-row" class="form-row">' +
                        '<div class="field-name"><label for="restorePasswordSection-login-name">' + this.lmsg('loginNameLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="text" name="login_name" id="restorePasswordSection-login-name" value="' + this._getConfigParam('loginNameValue', '') + '" class="input-text" />' +
                        '</div>' +
                    '</div>' +

                    '<div id="restorePasswordSection-secret-key-form-row" class="form-row">'+
                        '<div class="field-name"><label for="restorePasswordSection-secret-key">' + this.lmsg('secretKeyLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="text" name="secret" id="restorePasswordSection-secret-key" value="' + this._getConfigParam('secretKeyValue', '') + '" class="input-text" />' +
                        '</div>' +
                    '</div>' +

                    '<div id="restorePasswordSection-password-form-row" class="form-row">' +
                        '<div class="field-name"><label for="restorePasswordSection-password">' + this.lmsg('passwordLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="password" name="password" id="restorePasswordSection-password" value="" class="input-text" maxlength="255" />' +
                        '</div>' +
                    '</div>' +

                    '<div id="restorePasswordSection-confirm-password-form-row" class="form-row">' +
                        '<div class="field-name"><label for="restorePasswordSection-confirm-password">' + this.lmsg('confirmPasswordLabel') + '&nbsp;</label></div>' +
                        '<div class="field-value">' +
                            '<input type="password" name="confirm" id="restorePasswordSection-confirm-password" value="" class="input-text" maxlength="255" />' +
                        '</div>' +
                    '</div>' +

                '</div>' +
            '</div>' +

            '<div class="btns-box">' +
                '<div class="box-area">' +
                    '<div class="form-row">' +
                        '<div class="field-value">' +
                            '<span id="btn-restore" class="btn action"><button id="restorePasswordSection-button-restore" type="submit" value="" name="send">' + this.lmsg('buttonRestore') + '</button></span>' +
                            '<span id="btn-cancel" class="btn"><button id="restorePasswordSection-button-cancel" type="button" value="" name="cancel">' + this.lmsg('buttonCancel') + '</button></span>' +
                        '</div>' +
                        '<input type="image" src="/theme/images/blank.gif" style="border: 0; height: 0; width: 0; position: absolute; left: -9999px;"/>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        this._componentElement.down('#restorePasswordSection-login-name').focus();
        this._componentElement.down('#restorePasswordSection-login-name').select();

        this._componentElement.down('#restorePasswordSection-button-cancel').observe('click', function(){
            Jsw.redirect('/login_up.php');
        });
    },

    _onSubmit: function ($super) {
        var isError = $('restorePasswordSection-login-name', 'restorePasswordSection-secret-key', 'restorePasswordSection-password', 'restorePasswordSection-confirm-password').some(function (element) {
            if (element.value === '') {
                element.focus();
                element.select();
                return true;
            }
            return false;
        });

        if (isError) {
            alert(this.lmsg('enterAllRequiredElement'));
            return;
        }

        var confirmPassword = $('restorePasswordSection-confirm-password');
        if ($('restorePasswordSection-password').value !== confirmPassword.value) {
            alert(this.lmsg('passwordDoesntMatch'));
            confirmPassword.focus();
            confirmPassword.select();
            return;
        }

        $super();
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.list');

/**
 * @class Jsw.list.Domains
 * @extends Jsw.List
 */
Jsw.list.Domains = Class.create(Jsw.List, {
    _initConfiguration: function ($super, config) {
        config = Object.extend({
            searchOveral: 'domainName'
        }, config || {});
        $super(config);

        this._disabledSelectHint = this.lmsg('disabledSelectHint');
        this._urls = this._getConfigParam('urls', {});
        this._icons = this._getConfigParam('icons', {});
        this._userId = this._getConfigParam('userId');

        this._operations = [];
        if (this._urls.createDomain) {
            this._operations.push({
                componentType: 'Jsw.SmallButton',
                id: 'buttonAddDomain',
                cls: 's-btn sb-new-domain',
                title: this.lmsg('buttonAddDomain'),
                description: this.lmsg('hintAddDomain'),
                href: this._urls.createDomain
            });
        }
        if (this._urls.createSubdomain) {
            this._operations.push({
                componentType: 'Jsw.SmallButton',
                id: 'buttonAddSubDomain',
                cls: 's-btn sb-new-subdomain',
                title: this.lmsg('buttonAddSubdomain'),
                description: this.lmsg('hintAddSubdomain'),
                href: this._urls.createSubdomain
            });
        }
        if (this._urls.createDomainAliases) {
            this._operations.push({
                componentType: 'Jsw.SmallButton',
                id: 'buttonAddDomainAlias',
                cls: 's-btn sb-new-domain-alias',
                title: this.lmsg('buttonAddDomainAlias'),
                description: this.lmsg('hintAddDomainAlias'),
                href: this._urls.createDomainAliases
            });
        }
        if (this._operations.length) {
            this._operations.push({
                componentType: 'Jsw.bar.Separator'
            });
        }
        this._operations.push({
            componentType: 'Jsw.list.AdditionalActions',
            title: this.lmsg('buttonChangeStatus'),
            operations: [{
                componentType: 'Jsw.SmallButton',
                id: 'buttonSuspendDomains',
                title: this.lmsg('buttonSuspendDomains'),
                description: this.lmsg('hintSuspendDomains'),
                addCls: 'sb-suspend',
                cls: 'sb-btn',
                handler: function () {
                    this.execGroupOperation({
                        url: this._urls.suspend,
                        skipConfirmation: true
                    });
                }.bind(this)
            }, {
                componentType: 'Jsw.SmallButton',
                id: 'buttonDisableDomains',
                title: this.lmsg('buttonDisableDomains'),
                description: this.lmsg('hintDisableDomains'),
                addCls: 'sb-turn-off',
                cls: 'sb-btn',
                handler: function () {
                    this.execGroupOperation({
                        url: this._urls.disable,
                        skipConfirmation: true
                    });
                }.bind(this)
            }, {
                componentType: 'Jsw.SmallButton',
                id: 'buttonActivateDomains',
                title: this.lmsg('buttonActivateDomains'),
                description: this.lmsg('hintActivateDomains'),
                addCls: 'sb-activate',
                cls: 'sb-btn',
                handler: function () {
                    this.execGroupOperation({
                        url: this._urls.activate,
                        skipConfirmation: true
                    });
                }.bind(this)
            }]
        });
        if (this._urls.remove) {
            this._operations.push({
                componentType: 'Jsw.bar.Separator'
            });
            this._operations.push({
                componentType: 'Jsw.SmallButton',
                id: 'buttonRemoveSite',
                title: this.lmsg('buttonRemove'),
                description: this.lmsg('hintRemove'),
                cls: 's-btn sb-remove-selected',
                handler: function (event) {
                    var homonymSearch = this._getConfigParam('homonymSearch');
                    this.execGroupOperation({
                        url: this._urls.remove,
                        subtype: 'delete',
                        mouseEvent: event,
                        locale: {
                            confirmOnGroupOperation: this.lmsg('removeConfirmation')
                        },
                        isAjax: !!homonymSearch,
                        requestUrl: homonymSearch && homonymSearch.url,
                        loadingTitle: homonymSearch && homonymSearch.title
                    });
                }.bind(this)
            });
        }

        this._columns.push(Jsw.list.COLUMN_SELECTION);
        this._columns.push({
            header: this.lmsg('domainName'),
            sortable: true,
            dataIndex: 'domainDisplayName',
            renderer: function (item) {
                var message = '';
                if (parseInt(item.domainStatus)) {
                    var messageText = this.lmsg('statusDisabled');
                    var messageIcon = this._icons.disabled;
                    var messageAlt = 'disabled';
                    if (item.turnOffAction === 'suspend') {
                        messageText = this.lmsg('statusSuspended');
                        messageIcon = this._icons.suspended;
                        messageAlt = 'suspended';
                    }
                    message += '<div class="b-indent"><span class="b-indent-icon"><span>' +
                        '<span class="tooltipData">' + messageText + '</span>' +
                        '<img src="' + messageIcon + '" alt="' + messageAlt + '" title="">' +
                        '</span>';
                }

                message += (item.overviewUrl ? '<a href="' + Jsw.prepareUrl(item.overviewUrl) + '">' + item.domainDisplayName.escapeHTML() + '</a>' : item.domainDisplayName.escapeHTML());

                if (parseInt(item.domainStatus)) {
                    message += '</span></div>';
                }

                var description = '';
                if (item.adminDescription) {
                    description += '<div class="hint">' + item.adminDescription.truncate(50, '...').escapeHTML()  + '<span class="tooltipData">' + item.adminDescription.escapeHTML() + '</span></div>';
                }
                if (item.resellerDescription) {
                    var descriptionTitle = (item.hideResellerTitleDescription) ? '' : this.lmsg('resellerDescription') +  ': ';
                    description += '<div class="hint">'
                        + descriptionTitle
                        + item.resellerDescription.truncate(50, '...').escapeHTML() + '<span class="tooltipData">' + item.resellerDescription.escapeHTML() + '</span></div>';
                }
                if (item.ownerDescription) {
                    description += '<div class="hint">' + this.lmsg('ownerDescription')
                        + ': ' + item.ownerDescription.truncate(50, '...').escapeHTML() + '<span class="tooltipData">' + item.ownerDescription.escapeHTML() + '</span></div>';
                }
                message += description;

                return message;
            }.bind(this)
        });
        if (this._getConfigParam('icpPermitColumn')) {
            this._columns.push(this._getConfigParam('icpPermitColumn'));
        }
        this._columns.push({
            header: this.lmsg('hostingType'),
            sortable: true,
            dataIndex: 'hostingType',
            renderer: function (item) {
                var message = '';

                if (item.hostingType === 'alias') {
                    message = '<img src="' + this._icons.alias + '"/>'
                        + ' '
                        + this.lmsg('aliasFor')
                        + ' '
                        + '<a href="http://' + item.realDomainName.escapeHTML() + '" target="_blank">'
                        + item.realDomainDisplayName.escapeHTML()
                        + '</a>';
                } else if (item.hostingType === 'vrt_hst') {
                    message = '<img src="' + this._icons.website + '"/>'
                        + ' '
                        + this.lmsg(item.parentDomainId > 0 ? 'subdomainWebsite' : 'website');
                } else if (item.hostingType === 'none') {
                    message = '<img src="' + this._icons.none + '"/>'
                        + '<em class="hint">' + this.lmsg('noHosting') + '</em>';

                } else if (item.hostingType === 'frm_fwd' || item.hostingType === 'std_fwd') {

                    message = '<img src="' + this._icons.forwarding + '"/>'
                        + ' '
                        + this.lmsg('forwardingTo')
                        + ' '
                        + '<a href="' + item.forwardingUrl.escapeHTML() + '" target="_blank">'
                        + item.forwardingDisplayUrl.escapeHTML()
                        + '</a>';
                }

                return message;
            }.bind(this)
        });
        if (this._getConfigParam('showOwnerName')) {
            this._columns.push({
                header: this.lmsg('ownerName'),
                sortable: true,
                dataIndex: 'ownerName',
                renderer: function (item) {
                    var linkHref = null;
                    if (parseInt(item.ownerId) !== this._userId) {
                        if ('client' === item.ownerType) {
                            linkHref = 'customer';
                        } else if ('reseller' === item.ownerType) {
                            linkHref = 'reseller';
                        }
                    }
                    return (linkHref ? '<a href="' + Jsw.baseUrl + '/' + linkHref + '/overview/id/' + item.ownerId + '">' : '')
                        + item.ownerName.escapeHTML() +
                        (linkHref ? '</a>' : '') +
                        (item.ownerCompanyName ? ', ' + item.ownerCompanyName.escapeHTML() : '');
                }.bind(this)
            });
        }
        this._columns.push({
            header: this.lmsg('setupDate'),
            sortable: true,
            dataIndex: 'setupDate',
            renderer: function (item) {
                return item.setupDateString.escapeHTML();
            }
        });
        if (this._getConfigParam('showExpirationDate')) {
            this._columns.push({
                header: this.lmsg('expirationDate'),
                sortable: false,
                dataIndex: 'expirationDate',
                renderer: function (item) {
                    if (item.expirationDateString) {
                        return item.expirationDateString.escapeHTML();
                    } else {
                        return '&mdash;';
                    }
                }
            });
        }
        this._columns.push({
            header: this.lmsg('diskUsage'),
            sortable: true,
            dataIndex: 'realSize',
            renderer: function (item) {
                return item.diskUsage.escapeHTML();
            }
        });
        this._columns.push({
            header: this.lmsg('traffic'),
            sortable: false,
            dataIndex: 'traffic'
        });
        this._columns.push({
            header: '',
            sortable: false,
            renderer: function (item) {
                if (item.hostingType === 'none') {
                    return '';
                }

                return '<a href="http://' + item.realDomainName + '" class="s-btn sb-publish" target="_blank"><span>' +
                    this.lmsg('openSite') +
                    '</span></a>';
            }.bind(this)
        });
        this._columns.push({
            header: '',
            sortable: false,
            renderer: function (item) {
                if (!item.previewUrl) {
                    return '';
                }

                return '<a href="' + item.previewUrl + '" class="s-btn sb-view-site" target="_blank"><span>' +
                    this.lmsg('previewSite') +
                    '</span></a>';
            }.bind(this)
        });
        this._columns.push({
            header: '',
            sortable: false,
            renderer: function (item) {
                if (!item.manageUrl || parseInt(item.ownerId) === this._userId) {
                    return '';
                }

                var href = '/admin' + (item.ownerType === 'reseller' ? '/reseller' : '/customer') + '/login/id/' + item.ownerId +
                    '?pageUrl=' + encodeURIComponent(item.manageUrl);

                return '<a href="' + href + '" class="s-btn sb-login"><span>' +
                    this.lmsg(item.ownerType === 'reseller' ? 'manageInResellerPanel' : 'manageInCustomerPanel') +
                    '</span></a>';
            }.bind(this)
        });
    }
});

// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.

Jsw.namespace('Jsw.List').Filters = {
    create: function (config, handler) {
        if (config.render) {
            return config.render(config, handler);
        }

        if (config.type === 'date') {
            return this.createDate(config, handler);
        }

        if (config.options) {
            if (config.multi) {
                return this.createMultiEnum(config, handler);
            }
            return this.createEnum(config, handler);
        }

        return this.createText(config, handler);
    },

    createText: function (config, handler) {
        return Jsw.createElement('input[type="text"]', {
            id: config.idPrefix ? config.idPrefix + '-search-text-' + config.name : null,
            name: 'searchFilter[' + config.name + '][searchText]',
            placeholder: config.placeholder || null,
            pattern: config.pattern || null,
            title: config.pattern && config.placeholder || null,
            onkeyup: config.live && handler || null,
            value: config.value || null,
            class: config.cls || null
        });
    },

    createEnum: function (config, handler) {
        return Jsw.createElement('select', {
                id: config.idPrefix ? config.idPrefix + '-type-filter' : null,
                name: 'searchFilter[' + config.name + '][searchText]',
                onchange: handler || null
            },
            this.enumOptionsView(config.options, config.value)
        );
    },

    createMultiEnum: function (config, handler) {
        return Jsw.createElement('.dropdown',
            Jsw.createElement('.input-group',
                Jsw.createElement('input.form-control[type="text"][readonly]', {
                    placeholder: config.placeholder || null
                }),
                Jsw.createElement('span.input-group-btn',
                    Jsw.createElement('span.btn.dropdown-toggle',
                        Jsw.createElement('button[type="button"]',
                            Jsw.createElement('span.caret')
                        )
                    )
                )
            ),
            Jsw.createElement('ul.dropdown-menu.pull-right', {"onclick": function (event) { event.stopPropagation(); }},
                Object.isArray(config.options) && config.options.length ? Jsw.createElement('li',
                    Jsw.createElement('div.dropdown-menu-content.checkbox-group',
                        config.options.map(function (option) {
                            return Jsw.createElement('label',
                                Jsw.createElement('input[type="checkbox"]', {
                                    value: option.value,
                                    checked: !config.value || config.value.indexOf(option.value) !== -1 ? true : null,
                                    onclick: function (event) {
                                        var element = event.element();
                                        var output = element.up('th').down('input[type=text]');
                                        var input = element.up('th').select('input[type=checkbox]:checked');
                                        var total = element.up('th').select('input[type=checkbox]');
                                        if (!input.length) {
                                            output.value = config.locale.lmsg('none');
                                        } else if (input.length === total.length) {
                                            output.value = '';
                                        } else {
                                            var value = [];
                                            input.each(function(el) {
                                                value.push(el.value[0].toUpperCase());
                                            });
                                            output.value = value.join(', ');
                                        }

                                        if (Object.isFunction(handler)) {
                                            handler();
                                        }
                                    }.bind(this)
                                }),
                                ' ' + option.value
                            );
                        }.bind(this))
                    )
                ) : ''
            )
        );
    },

    createDate: function (config, handler) {
        var i;
        var locale = config.locale || new Jsw.Locale();

        var hour = Jsw.createElement('select');
        for (i = 0; i < 24; i++) {
            hour.children.push(
                Jsw.createElement('option', {value: i}, (i < 10 ? '0' : '') + i)
            );
        }

        var minute = Jsw.createElement('select');
        for (i = 0; i < 60; i++) {
            minute.children.push(
                Jsw.createElement('option', {value: i}, (i < 10 ? '0' : '') + i)
            );
        }

        var day = Jsw.createElement('select');
        for (i = 1; i < 32; i++) {
            day.children.push(
                Jsw.createElement('option', {value: i}, (i < 10 ? '0' : '') + i)
            );
        }

        var month = Jsw.createElement('select');
        for (i = 0; i < 12; i++) {
            month.children.push(
                Jsw.createElement('option', {value: i}, locale.lmsg('month' + (i + 1)))
            );
        }

        var year = Jsw.createElement('select');
        for (i = 2000; i <= (new Date()).getFullYear(); i++) {
            year.children.push(
                Jsw.createElement('option', {value: i}, i)
            );
        }

        return Jsw.createElement('.dropdown',
            Jsw.createElement('.input-group', {
                    "onclick": function (event) {
                        this.onDateSearchFilterOpen(event.element().up('.dropdown'));
                    }.bind(this)
                },
                Jsw.createElement('input.form-control[type="text"][readonly]', {
                    placeholder: config.placeholder || null
                }),
                Jsw.createElement('span.input-group-btn',
                    Jsw.createElement('span.btn.dropdown-toggle',
                        Jsw.createElement('button[type="button"]',
                            Jsw.createElement('span.caret')
                        )
                    )
                )
            ),
            Jsw.createElement('ul.dropdown-menu', {"onclick": function (event) { event.stop(); }},
                Jsw.createElement('li',
                    Jsw.createElement('.filter-date-form',
                        Jsw.createElement('.form-row',
                            Jsw.createElement('.inline-fields-group',
                                hour, ' : ', minute
                            ),
                            Jsw.createElement('.inline-fields-group',
                                day, ' ', month, ' ', year
                            ),
                            Jsw.createElement('.inline-fields-group',
                                Jsw.createElement('span.btn',
                                    Jsw.createElement('button[type="button"]', {
                                        "onclick": function (event) {
                                            event.element().up('.dropdown').toggleClassName('open');
                                            this.onDateSearchFilterOpen(event.element().up('.dropdown'));
                                            this.onDateSearchFilterChange(event.element().up('.dropdown'));
                                            if (Object.isFunction(handler)) {
                                                handler();
                                            }
                                        }.bind(this)
                                    }, locale.lmsg('apply'))
                                ),
                                Jsw.createElement('span.btn',
                                    Jsw.createElement('button[type="button"]', {
                                        "onclick": function (event) {
                                            event.element().up('.dropdown').toggleClassName('open');
                                            event.element().up('.dropdown').down('input').value = '';
                                            this.onDateSearchFilterOpen(event.element().up('.dropdown'));
                                            if (Object.isFunction(handler)) {
                                                handler();
                                            }
                                        }.bind(this)
                                    }, locale.lmsg('clear'))
                                )
                            )
                        ),
                        Jsw.createElement('.form-row.filter-actions-row',
                            Jsw.createElement('a.toggler', {
                                "onclick": function (event) {
                                    this.onDateSearchFilterModify(event.element().up('.dropdown'), new Date(new Date().getTime() - 3600 * 1000));
                                    if (Object.isFunction(handler)) {
                                        handler();
                                    }
                                }.bind(this)
                            }, locale.lmsg('hourAgo')),
                            ' ',
                            Jsw.createElement('a.toggler', {
                                "onclick": function (event) {
                                    this.onDateSearchFilterModify(event.element().up('.dropdown'), new Date(new Date().getTime() - 86400 * 1000));
                                    if (Object.isFunction(handler)) {
                                        handler();
                                    }
                                }.bind(this)
                            }, locale.lmsg('prevDay'))
                        )
                    )
                )
            )
        );
    },

    enumOptionsView: function (options, value) {
        return options.map(function (option) {
            if ('value' === option.type) {
                return this.enumValueView(option, value);
            }
            return this.enumGroupValue(option, value);
        }.bind(this))
    },

    enumValueView: function (option, value) {
        return Jsw.createElement('option', {
            value: option.value,
            selected: option.value === value
        }, option.label.escapeHTML());
    },

    enumGroupValue: function (option, value) {
        return Jsw.createElement('optgroup', {
                label: option.label
            },
            this.enumOptionsView(option.options, value)
        );
    },

    onMultiEnumSearchFilterChange: function (element) {
    },

    onDateSearchFilterOpen: function (element) {
        if (!element.hasClassName('open')) {
            return;
        }

        var date = new Date(element.down('input').value);
        if (isNaN(date.getTime())) {
            date = new Date();
        }

        this._dateSearchFieldFromDate(element, date);
    },

    onDateSearchFilterChange: function (element) {
        var date = this._dateSearchFieldToDate(element);

        element.down('input').value = date.getFullYear() + '-' +
            (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1) + '-' +
            (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
            (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
            (date.getMinutes() < 10 ? '0' : '') +date.getMinutes();
    },

    onDateSearchFilterModify: function (element, date) {
        this._dateSearchFieldFromDate(element, date);
    },

    _dateSearchFieldFromDate: function (element, date) {
        var elements = element.select('select');
        elements[0].value = date.getHours();
        elements[1].value = date.getMinutes();
        elements[2].value = date.getDate();
        elements[3].value = date.getMonth();
        elements[4].value = date.getFullYear();
    },

    _dateSearchFieldToDate: function (element) {
        var elements = element.select('select');
        return new Date(elements[4].value, elements[3].value, elements[2].value, elements[0].value, elements[1].value);
    }
};
