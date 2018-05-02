// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
/* SMB specific JavaScript classes */

Jsw.namespace('Smb');

/**
 * @class Smb.Webmail
 * @singleton
 */
Smb.Webmail = {

    urlWrapper: function(webmailUrl) {
        return 'window.open("' + webmailUrl.escapeHTML() + '", "webmail", ' +
            '"width=1150,height=600,innerWidth=1150,innerHeight=600,toolbar=yes,personalbar=no,' +
            'locationbar=no,statusbar=no,scrollbars=yes,resizable=yes");';
    }

};

/**
 * @class Smb.ApsLicense
 * @singleton
 */
Smb.ApsLicense = {

    buy: function(action) {
        window.open(action);
        return false;
    },

    initForm: function() {
        $('apsLicense-uploadType-text').observe('click', this.onChangeUploadType.bindAsEventListener(this));
        $('apsLicense-uploadType-file').observe('click', this.onChangeUploadType.bindAsEventListener(this));
    },

    onChangeUploadType: function() {
        if ($('apsLicense-uploadType-text').checked) {
            $('apsLicense-uploadText').enable();
            $('uploadFile').disable();
        } else {
            $('apsLicense-uploadText').disable();
            $('uploadFile').enable();
        }
    }

};

/**
 * @class Smb.GettingStartedPopup
 */
Smb.GettingStartedPopup = Class.create({

    initialize: function(containerId) {
        this._container = $(containerId);

        if (!this._container) {
            return;
        }

        this._container.select('.getting-started-link').each((
            function(element) {
                element.observe('click', this._onOkClick.bindAsEventListener(this));
            }
        ).bind(this));
        this._container.select('.s-btn.action').each((
            function(element) {
                element.observe('click', this._onOkClick.bindAsEventListener(this));
            }
        ).bind(this));
        this._container.select('.s-btn').each((
            function(element) {
                if (element.hasClassName('action')) {
                    return;
                }
                element.observe('click', this._onCancelClick.bindAsEventListener(this));
            }
        ).bind(this));

        if ('true' != Jsw.Cookie.get('show-getting-started-popup')) {
            return;
        }
        if ('true' == Jsw.Cookie.get('do-not-show-getting-started-popup')) {
            return;
        }

        this._container.addClassName('active');
        $(document.body).insert({
            top: '<div class="main-disabled-block"></div>'
        });
    },

    _onOkClick: function(event) {
        Event.stop(event);

        this._close();
    },

    _onCancelClick: function(event) {
        Event.stop(event);

        this._close();
    },

    _close: function() {
        this._container.removeClassName('active');

        $(document.body).select('.main-disabled-block').each(
            function(element) {
                element.remove();
            }
        );

        // use two cookies for backward compatibility
        Jsw.Cookie.set('show-getting-started-popup', 'false', null, Jsw.baseUrl + '/');
        Jsw.Cookie.setPermanent('do-not-show-getting-started-popup', 'true', Jsw.baseUrl + '/');
    }

});

//prevent AJAX request canceling on Escape button press in Firefox
$(document).observe('keydown', function(event) {
    if (Event.KEY_ESC == event.keyCode) {
        Event.stop(event);
    }
});

/**
 * @class Smb.ToolPanel
 * @extends Jsw.Container
 */
Smb.ToolPanel = Class.create(Jsw.Container, {

    /**
     * @cfg {String} image
     */
    /**
     * @cfg {String} title
     */

    _initConfiguration: function($super, config) {
        $super(config);

        this._contentAreaId = this._id + '-tools-list';
        this._image = this._getConfigParam('image', '');
        this._title = this._getConfigParam('title', '');
    },

    _initComponentElement: function($super) {
        this._componentElement = new Element('div', {
            'class': 'tool-block'
        }).insert(
            '<span class="tool-icon">'+
                '<img src="' + this._image + '"/>'+
            '</span>'+
            '<span class="tool-name">' + this._title + '</span>'
        ).insert(new Element('ul', {
            'id': this._id + '-tools-list',
            'class': 'tool-info' })
        );
    }
});

/**
 * @class Smb.ToolButton
 * @extends Jsw.BigButton
 * @deprecated
 */
Smb.ToolButton = Jsw.BigButton;

/**
 * @class Smb.RssFeedCustomSpot
 * @extends Jsw.Container
 */
Smb.RssFeedCustomSpot = Class.create(Jsw.Container, {
    _tag: 'div',

    /**
     * @cfg {String} dataUrl
     */
    /**
     * @cfg {String} customSpotsBlock
     */
    /**
     * @cfg {Number} itemCount
     */

    _initConfiguration: function($super, config) {
        $super(config);
        this._dataUrl = this._getConfigParam('dataUrl', '');
        this._customSpotsBlock = this._getConfigParam('customSpotsBlock', '');
        this._itemCount = parseInt(this._getConfigParam('itemCount', ''));
        this._total = this._offset = 0;
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
                '<div class="p-box-header-nav">' +
                '<a class="link-01" id="' + this._id + '-prev" href="#"><span>' + this.lmsg('prev') + '</span></a> ' +
                '<a class="link-01" id="' + this._id + '-next" href="#"><span>' + this.lmsg('next') + '</span></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div></div></div>' +
                '<div class="p-box-bl"><div class="p-box-br"><div class="p-box-bc"><!----></div></div></div>'
        );
    },

    _renderItems: function() {
        this._showCurrentItems();
        return false;
    },

    _onNext: function(event) {
        this._offset += this._itemCount;
        this._showCurrentItems();
        Event.stop(event);
        return false;
    },

    _onPrev: function(event) {
        this._offset -= this._itemCount;
        this._showCurrentItems();
        Event.stop(event);
        return false;
    },

    _addEvents: function() {
        $(this._id + '-next').observe('click', this._onNext.bind(this));
        $(this._id + '-prev').observe('click', this._onPrev.bind(this));
    },

    _onCreateExecute: function() {
        this._renderTarget.update('<div class="ajax-loading">' + this.lmsg('loading') + '</div>');
    },

    _onSuccessExecute: function(transport) {
        try {
            var data = transport.responseText.evalJSON();
        } catch (e) {
            Jsw.showInternalError(transport.responseText);
            return false;
        }

        this._total = parseInt(data.total);
        this._togglePrev();
        this._toggleNext();
        this._renderCurrentItems(data.items);
        if (0 >= this._total && $(this._customSpotsBlock)) {
            $(this._customSpotsBlock).hide();
        }
        return false;
    },

    _onFailureExecute: function() {
        if ($(this._customSpotsBlock)) {
            $(this._customSpotsBlock).hide();
        }
    },

    _togglePrev: function() {
        if (0 >= this._offset) {
            $(this._id + '-prev').hide();
        } else {
            $(this._id + '-prev').show();
        }
    },

    _toggleNext: function() {
        if (this._total <= (this._offset + this._itemCount)) {
            $(this._id + '-next').hide();
        } else {
            $(this._id + '-next').show();
        }
    },

    _renderCurrentItems: function(items) {
        if (!items.length) {
            this._renderTarget.update('');
            return;
        }

        var content = '<ul id="rssFeedItems" class="rss-feed-list">';
        for(var key in items) {
            if (!items.hasOwnProperty(key)) {
                continue;
            }
            content += '<li class="rss-feed-item">' +
                '<a class="i-link" href="' + items[key]['link'].escapeHTML() + '" target="_blank">' + items[key]['title'].escapeHTML() + '</a>' +
                '<p>' + items[key]['description'] + '</p>' +
                '</li>';
        }
        content += '</ul>';
        this._renderTarget.update(content);
    },

    _showCurrentItems: function() {
        new Ajax.Request(this._dataUrl, {
            method: 'get',
            parameters: {
                offset: this._offset
            },
            onCreate: this._onCreateExecute.bind(this),
            onSuccess: this._onSuccessExecute.bind(this),
            onFailure: this._onFailureExecute.bind(this)
        });
    }
});

/**
 * @class Smb.StickyNav
 */
Smb.StickyNav = Class.create({
    initialize: function (element) {
        this.element = $(element);
        this.elementHeight = this.element.down('.tabs-area').getHeight() + parseInt(this.element.getStyle('padding-bottom'));
        this.offsetTop = this.element.down('.tabs-area').cumulativeOffset().top - $$('.page-content-wrapper').first().cumulativeOffset().top;

        Event.observe(window, 'resize', this.update.bindAsEventListener(this));
        Event.observe(window, 'scroll', this.update.bindAsEventListener(this));
        Event.observe(document, 'mousewheel', this.update.bindAsEventListener(this));
    },

    update: function() {
        if (document.viewport.getScrollOffsets().top > ( this.offsetTop - 3 )) {
            this.element.setStyle({ paddingBottom: this.elementHeight - 3 + 'px' });
            this.element.addClassName('sticky-nav');
        } else {
            this.element.setStyle({ paddingBottom: null });
            this.element.removeClassName('sticky-nav');
        }
    }
});

Jsw.onReady(Jsw.priority.low, function() {
    if ($('classic-mode-navigation')) {
        new Smb.StickyNav($('classic-mode-navigation'));
    }
});

/**
 * @class Smb.ApplicationUpdate
 * @extends Jsw.StatusMessage
 */
Smb.ApplicationUpdate = Class.create(Jsw.StatusMessage, {
    _initConfiguration: function($super, config) {
        if ('undefined' == typeof config['type']) {
            config['type'] = 'warning';
        }
        $super(config);
        this._data = this._getConfigParam('data', []);
        this._limit = this._getConfigParam('limit', 5);
    },

    _renderMessage: function($super) {
        var message = $super() + '<br>';
        this._data.each(function(app) {
            var install = (app.instances.length == 1 ? this.lmsg('install') : this.lmsg('installAll'));
            message += '<div class="b-subitem">' +
            app.name +
            ' <span class="hint">(' + this._renderHint(app) + ')</span>' +
            ' <a href="#" class="toggler js-install">' + this.lmsg('install') + '</a>&nbsp;' +
            ' <a href="#" class="toggler js-changelog">' + this.lmsg('changelog') + '</a>' +
            '<input type="hidden" value="' + Jsw.escapeAttribute(JSON.stringify(app)) + '" />' +
            '</div>';
        }, this);
        if (this._data.length > this._limit) {
            message += '<a href="#" class="toggler js-view-more">' +
            this.lmsg('viewMore', {'number': this._data.length - this._limit}) +
            '</a>';
        }
        return message;
    },

    _renderHint: function($super, app) {
        if (app.instances.length == 1) {
            return app.instances[0].name;
        }
        return this.lmsg('instances', {'total': app.instances.length});
    },

    _addEvents: function($super) {
        $super();

        this._componentElement.select('.b-subitem').each(function(item) {
            Event.observe(item.down('.js-install'), 'click', this._onInstallEvent.bindAsEventListener(this));
            Event.observe(item.down('.js-changelog'), 'click', this._onChangelogEvent.bindAsEventListener(this));
        }, this);

        if (this._data.length > this._limit) {
            this._componentElement.select('.b-subitem').slice(this._limit).each(function(item) {
                item.hide();
            }, this);
            Event.observe(this._componentElement.down('.js-view-more'), 'click', this._onViewMoreEvent.bindAsEventListener(this));
        }
    },

    _onInstallEvent: function(e) {
        var app = JSON.parse(e.target.up('.b-subitem').down('input').value);
        Smb.updateApplication(app, this.getLocale(), e);
        e.target.up('.b-subitem').select('a').each(function (a) {
            a.remove();
        }, this);
    },

    _onChangelogEvent: function(e) {
        var app = JSON.parse(e.target.up('.b-subitem').down('input').value);
        Smb.showApplicationChangelog(app, this.getLocale(), e);
    },

    _onViewMoreEvent: function() {
        this._componentElement.select('.b-subitem').slice(this._limit).each(function(item) {
            item.toggle();
        }, this);
        this._componentElement.down('.js-view-more').remove();
    },

    _onCloseEvent: function() {
        this._componentElement.remove();
        new Ajax.Request(Jsw.prepareUrl('/web/hide-aps-updates/'), { method: 'post' });
    }
});

Smb.updateApplication = function(app, locale, event) {
    event.preventDefault();
    var beginOffset = event.target.cumulativeOffset();
    var progressBar = Jsw.getComponent('asyncProgressBarWrapper');
    var itemId = progressBar.fly(beginOffset,
        locale.lmsg('appInstall', {'app': app.name.escapeHTML()}),
        function () {
            new Ajax.Request(Jsw.prepareUrl('/app-update/update-all'), {
                method: 'post',
                parameters: {
                    'resourceIds[]': app.instances.map(function (i) {
                        return i.id;
                    }),
                    name: app.name
                },
                onSuccess: function (response) {
                    progressBar.removePreparingItem(itemId);
                    progressBar.update();
                }
            });
        }
    );
    if (event.target.up('.caption-service-toolbar')) {
        event.target.up('.caption-service-toolbar').select('.js-app-update').invoke('remove');
    }
};

Smb.showApplicationChangelog = function(app, locale, event) {
    new Ajax.Request(Jsw.prepareUrl('/app-update/index/resourceId/' + app.instances[0].id + '/'), {
        method: 'get',
        onCreate: function() {
            new Jsw.Popup({
                content: '<div class="ajax-loading">' + locale.lmsg('loading') + '</div>',
                popupCls: 'popup-panel app-update-info',
                title: locale.lmsg('appChangelog', {'app': app.name.escapeHTML()})
            });
        },
        onSuccess: function(transport) {
            if ('' == transport.responseText) {
                return;
            }

            var contentText = '';
            try {

                var jsonResponse = JSON.parse(transport.responseText);
                if ('error' == jsonResponse.status) {
                    contentText = ('' != jsonResponse.statusMessages)
                        ? jsonResponse.statusMessages
                        : locale.lmsg('unableGetChangelog');
                }

            } catch(e) {
                contentText = transport.responseText;
            }

            var popup = new Jsw.Popup({
                content: contentText,
                popupCls: 'popup-panel app-update-info',
                title: locale.lmsg('appChangelog', {'app': app.name.escapeHTML()}),
                onShow: function () {
                    $$('.apps-box').each(function (e) {
                        var viewportHeight = document.viewport.getHeight();
                        var popupHeight = e.up('.popup-container').getHeight();
                        var popupTop = e.up('.popup-panel').positionedOffset().top;
                        if (popupHeight + popupTop * 2 >= viewportHeight) {
                            var height = viewportHeight - (popupHeight - e.getHeight()) - popupTop * 2;
                            e.setStyle({overflow: 'auto', height: height + 'px'});
                        }
                    });
                },
                buttons: [
                    {
                        title: locale.lmsg('close'),
                        handler: function () {
                            popup.hide();
                        }
                    }
                ]
            });
        }
    });
    event.preventDefault();
};

Smb.webspaceSelector = function(subscriptions, title, locale, returnUrl) {
    var options = '';
    $A(subscriptions).each(function(subscription) {
        options += '<option value="' + subscription.id + '">' + subscription.name + '</option>';
    });

    var selectorFieldTitle = locale.operationSelectorTitle;

    var content =
        '<p>' + locale.operationSelectorHint + '</p>' +
            '<div class="form-row">' +
            '<div class="field-name"><label for="subscription-selector">' + selectorFieldTitle + '</label></div>' +
            '<div class="field-value">' +
            '<select id="subscription-selector">' + options + '</select>' +
            '</div>' +
            '</div>';

    if (1 == subscriptions.length) {
        var selectedSubscriptionId = subscriptions[0].id;
        var targetUrl = '/account/switch/id/' + selectedSubscriptionId + '?hideNotice=1&returnUrl=' + encodeURIComponent(returnUrl);
        document.location = Jsw.prepareUrl(targetUrl);
        return;
    }

    var popup = new Jsw.Popup({
        title: title,
        content: content,
        buttons: [{
            title: locale.buttonOk,
            handler: function(event, popup) {
                var selectedSubscriptionId = $(popup._componentElement.down('select')).value;
                var targetUrl = '/account/switch/id/' + selectedSubscriptionId + '?hideNotice=1&returnUrl=' + encodeURIComponent(returnUrl);

                popup.hide();
                document.location = Jsw.prepareUrl(targetUrl);
            }
        }, {
            title: locale.buttonClose,
            handler: function(event, popup) {
                popup.hide();
            }
        }]
    });
};
