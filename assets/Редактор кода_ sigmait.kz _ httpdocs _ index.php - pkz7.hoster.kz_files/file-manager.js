// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
Jsw.namespace('Smb.FileManager');

Smb.FileManager.resizeBlocks = function() {
    var minBlockHeight = 200;
    var bodyHeight = (Prototype.Browser.IE)
        ? $(document.documentElement).getHeight()
        : $(document.body).getHeight();

    var block = $$('.objects-management-box')[0];
    var blockLayout = block.getLayout();

    var newBlockHeight = bodyHeight - block.cumulativeOffset()[1] - blockLayout.get('border-top') - blockLayout.get('border-bottom') - parseInt($$('.page-content')[0].getStyle('paddingBottom'));
    if ($$('.page-footer-wrapper').first()) {
        newBlockHeight -= $$('.page-footer-wrapper').first().getHeight();
    }
    if (newBlockHeight < minBlockHeight) {
        newBlockHeight = minBlockHeight;
    }

    $('objects-details').setStyle({ 'height': newBlockHeight + 'px' });
    $('objects-list-content-area').setStyle({ 'height': newBlockHeight + 'px' });

    var topBlocksHeight = $('fm-content-operations').getHeight() + $('fm-content-pathbar').getHeight();
    $('objects-details').down('.objects-content').setStyle({ 'height': (newBlockHeight - topBlocksHeight) + 'px' });
};

Smb.FileManager.initSidebarVisibility = function() {
    $('fm-frame-switcher').observe('click', function(){
        if ($('fm').hasClassName('objects-management-box-collapsed')) {
            $('fm').removeClassName('objects-management-box-collapsed');
            Jsw.Cookie.remove('fm-hidden-tree');
        } else if ($('fm').hasClassName('fm-hidden-tree')) {
            $('fm').removeClassName('fm-hidden-tree');
            Jsw.Cookie.remove('fm-hidden-tree');
        } else {
            $('fm').addClassName('objects-management-box-collapsed');
            Jsw.Cookie.set('fm-hidden-tree', true);
        }
    });
};

Smb.FileManager.Explorer = Class.create(Jsw.List, {

    _initComponentElement: function($super) {
        $super();

        var uploadButton = this._operations.find(function (operation) {
            return operation.id === 'upload-file-button';
        });
        if (uploadButton && Smb.FileManager.UploadCapabilities.isAdvancedUploadSupported()) {
            this._dropArea = new Jsw.DropArea({
                locale: uploadButton.uploadPopupParams.locale,
                onDrop: function (files) {
                    this.showPopup(Smb.FileManager.MultipleUpload, Object.extend({
                        files: files
                    }, uploadButton.uploadPopupParams));
                }.bind(this)
            });
            this._dropArea.render();
        }
    },

    changeDirectory: function(newDirectory, absolutePath) {
        newDirectory = absolutePath ? newDirectory : (this._state.currentDir + '/' + newDirectory);
        this.reload('?currentDir=' + encodeURIComponent(newDirectory));
    },

    getCurrentDir: function() {
        return this._state.currentDir;
    },

    getReadonlyHint: function() {
        return this._state.currentDirReadonly
            ? '<span class="error-hint">' + this._pathbar.locale.readonlyHint + '</span>'
            : '';
    },

    showPopup: function(popupClass, options) {
        var popupId = options['id'];
        var component = Jsw.getComponent(popupId);

        if (component) {
            component.reset(options);
        } else {
            new popupClass(options);
        }
    },

    calculateSize: function() {
        var context = this;
        var params = {
            url: '/file-manager/calculate-size' +
                '?currentDir=' + encodeURIComponent(this.getCurrentDir()),
            skipConfirmation: true
        };
        params.submitHandler = function(url, ids) {
            new Ajax.Request(Jsw.prepareUrl(url), {
                method: 'post',
                parameters: ids,
                onSuccess: function (transport) {
                    var status = transport.responseText.evalJSON();
                    var table = $('fm-content-table');
                    var selectedRows = table.select('tr.selected');
                    selectedRows.each(function(selectedRow) {
                        var fileNameElement = selectedRow.select('td.js-file-name a span').first();
                        if (!fileNameElement) {
                            return;
                        }
                        var fileName = fileNameElement.firstChild.nodeValue;
                        if (fileName in status.fileSizes) {
                            var fileSize = status.fileSizes[fileName];
                            selectedRow.select('td.js-file-size').first().update(fileSize);
                        }
                    });

                    Jsw.clearStatusMessages();
                    $A(status.statusMessages).each(function(message) {
                        Jsw.addStatusMessage(message.status, message.content);
                    });
                    context.enable();
                },

                onCreate: function() {
                    context.disable();
                },

                onFailure: function() {
                    context.enable();
                }
            });
        };
        this.execGroupOperation(params);
    },

    changeTimestamp: function() {
        this.execGroupOperation({
            url: '/file-manager/touch' +
                '?currentDir=' + encodeURIComponent(this.getCurrentDir()),
            skipConfirmation: true
        });
    },

    deleteFile: function(config) {
        this.execGroupOperation(Object.extend({
            url: '/file-manager/delete' +
                '?currentDir=' + encodeURIComponent(this.getCurrentDir()),
            subtype: 'delete',
            onSuccess: function() {
                this.enable();
                Jsw.getComponent('fm-tree').reloadPath(this.getCurrentDir());
            }.bind(this)
        }, config));
    },

    processReloadError: function(data) {
        if (data.status) {
            Jsw.clearStatusMessages();
            Jsw.addStatusMessage(data.status, data.message);
        } else {
            Jsw.showInternalError('Unable to load list data.');
        }
    },

    _initConfiguration: function($super, config) {
        $super(config);

        var hideTree = Jsw.Cookie.get('fm-hidden-tree');
        if (hideTree) {
            this.hideTree();
        } else {
            this.showTree();
        }

        this._treeConfig = this._getConfigParam('tree', '');
        this._tree = new Jsw.FileManager.Tree(this._treeConfig);
    },

    redraw: function($super) {
        $super();

        this._tree.setDirectory(this.getCurrentDir());
        Jsw.render($('fm-tree'), this._tree);
        if (this._dropArea) {
            $(this._id + '-container').insert(this._dropArea._componentElement);
        }

        Smb.FileManager.resizeBlocks();
    },

    _isColumnSelectionPresent: function() {
        return true;
    },

    containerView: function($super) {
        var view = $super();

        var children = view.children.splice(1);
        view.children.push(Jsw.createElement('.objects-content',
            Jsw.createElement('#' + this._id + '-objects-content-area.objects-content-area',
                Jsw.createElement('.list-box',
                    Jsw.createElement('.box-area',
                        Jsw.createElement('.content',
                            Jsw.createElement('.content-area', children)
                        )
                    )
                )
            )
        ));

        return view;
    },

    callDefaultItemAction: function(itemId) {
        var item = this.getItemById(itemId);
        var defaultAction = item.actions.find(function (action) {
            return action['default'];
        }) || { name: 'view' };

        if (defaultAction.href) {
            Jsw.redirect(defaultAction.href);
        }

        if (this._itemActions[defaultAction.name]) {
            this._itemActions[defaultAction.name](item, defaultAction);
        }
    },

    getActionByName: function(item, actionName) {
        return item.actions.find(function (action) {
            return action.name === actionName;
        });
    },

    showTree: function() {
        $('fm').removeClassName('fm-hidden-tree');
    },

    hideTree: function() {
        $('fm').addClassName('fm-hidden-tree');
    },

    disable: function() {
        $(this._id + '-pathbar').hide();
        this._componentElement.down('.objects-content').hide();

        var element = $(this._id + '-loading-container');

        if (element) {
            element.show();
        } else {
            this._componentElement.insert(
                '<div class="ajax-loading" id="' + this._id + '-loading-container">' +
                    this.lmsg('loadingTitle') +
                '</div>'
            );
        }

        this._disablerOverlay.show();
        this._disablerOverlay.clonePosition(this._componentElement.down('.actions-box'));
    },

    enable: function($super) {
        $(this._id + '-loading-container').hide();

        this._componentElement.down('.objects-content').show();
        $(this._id + '-pathbar').show();

        $super();
    },

    _addResponsiveHtml: function($super) {}

});

Smb.FileManager.Pathbar = Class.create(Jsw.Pathbar, {

    _renderItem: function($super, item) {
        $super(item);

        if (item instanceof Jsw.Pathbar.Item) {

            var context = this;

            item.addEventObserver('click', function(event) {
                Event.stop(event);
                Jsw.getComponent('fm-content').changeDirectory(item.getHref(), true);
            });
        }
    },

    _renderItemSuffix: function($super, item) {
        if (!(item instanceof Jsw.Pathbar.Item)) {
            return;
        }
        $super(item);
    }

});

Smb.FileManager.PopupForm = Class.create(Jsw.PopupForm, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._handlerUrl = this._getConfigParam('handlerUrl', '');
    },

    _getHandlerUrl: function(params) {
        return Jsw.addUrlParams(
            this._handlerUrl,
            'currentDir=' + encodeURIComponent(Jsw.getComponent('fm-content').getCurrentDir()) +
                (params ? '&' + params : '')
        );
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this.setTitle(this.lmsg('title'));
    },

    reset: function() {
        this.show();
    },

    _onSubmitEvent: function(event) {
        this._onSubmit();
        Event.stop(event);
        return false;
    },

    _initOnSubmitEvent: function() {
        var form = $(this._id + '-form');
        form._formSubmit = form.submit;
        form.submit = this._onSubmit.bind(this);
        form.observe('submit', this._onSubmitEvent.bind(this));
    },

    disable: function() {
        var context = this;
        $(this._rightActionButtonsAreaId).select('.btn.action').each(
            function(actionButtonWrapper) {
                var sendButton = actionButtonWrapper.down('button');
                context._okButtonTitle = sendButton.innerHTML;
                sendButton.update(
                    '<span class="wait">' + context.lmsg('waitButtonTitle') + '</span>'
                );
            }
        );

        $(this._rightActionButtonsAreaId).select('.btn').each(
            function(actionButtonWrapper) {
                actionButtonWrapper.down('button').disabled = true;
                actionButtonWrapper.addClassName('disabled');
            }
        );
    },

    enable: function() {
        var context = this;
        $(this._rightActionButtonsAreaId).select('.btn.action').each(
            function(actionButtonWrapper) {
                var sendButton = actionButtonWrapper.down('button');
                sendButton.update(context._okButtonTitle);
            }
        );
        $(this._rightActionButtonsAreaId).select('.btn').each(
            function(actionButtonWrapper) {
                actionButtonWrapper.down('button').disabled = false;
                actionButtonWrapper.removeClassName('disabled');
            }
        );
    },

    _initSelectionHint: function() {
        var filesNumber = this._selectedItems.length;

        if (1 == filesNumber) {
            this.setHint1(this.lmsg('hintFile', {'file': '<b>' + this._selectedItems[0].name.escapeHTML() + '</b>'}));
        } else {
            this.setHint1(this.lmsg('hintFiles', {'number': filesNumber}));
        }
    },

    _onOkHandlerException: function(transport, exception) {
        this._addErrorMessage('Internal error: ' + exception);
    },

    _onOkHandlerCreate: function(transport) {
        this.disable();
    },

    _onOkHandlerComplete: function(transport) {
        this.enable();
    }

});

Smb.FileManager.ListPopup = Class.create(Jsw.PopupForm, {

    _initConfiguration: function($super, config) {
        $super(config);
        this._itemsAreaId = this._id + '-items';
    },

    _addEvents: function($super) {
        $super();
        Event.observe(
            window,
            'resize',
            this.resizeList.bind(this),
            false
        );
    },

    _renderContentArea: function() {
        $(this._contentAreaId).insert (
            '<div class="list">' +
                '<table width="100%" cellspacing="0">' +
                    '<tbody id="' + this._itemsAreaId + '">' +
                    '</tbody>' +
                '</table>' +
            '</div>'
        );
    },

    render: function($super) {
        $super();
        this._renderContentArea();
        $(this._actionButtonsId).addClassName('no-separator');
    }
});

Smb.FileManager.CreateFile = Class.create(Smb.FileManager.PopupForm, {

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div>' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                            '<label for="' + this._id + '-file-name">' +
                                this.lmsg('fileName') +
                            '</label>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<input name="fileName" id="' + this._id + '-file-name" ' +
                                'value="" class="f-middle-size input-text" type="text">' +
                            '<span class="field-errors" style="display: none;"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-row">' +
                        '<div class="single-row">' +
                            '<div class="indent-box">' +
                                '<input type="checkbox" class="checkbox" value="1" ' +
                                    'id="' + this._id + '-html-template"/>' +
                                '<div class="indent-box-content">' +
                                    '<label for="' + this._id + '-html-template">' +
                                        this.lmsg('htmlTemplate') +
                                    '</label>' +
                                    '<span class="hint">' +
                                        this.lmsg('htmlTemplateHint') +
                                    '</span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset();
    },

    reset: function($super) {
        this.setHint(
            this.lmsg('hint', {
                'folder': '<b>' + Jsw.getComponent('fm-content').getCurrentDir().escapeHTML() + '</b>'
            }) + Jsw.getComponent('fm-content').getReadonlyHint()
        );

        this._clearMessages();

        $(this._id + '-file-name').value = '';
        $(this._id + '-html-template').checked = false;

        $super();

        try {
            $(this._id + '-file-name').focus();
        } catch (e) {}
    },

    _onSubmit: function() {
        var fileName = $(this._id + '-file-name').value;
        var htmlTemplate = $(this._id + '-html-template').checked;

        new Ajax.Request(
            this._getHandlerUrl(),
            {
                method: 'post',
                parameters: {
                    'newFileName': fileName,
                    'htmlTemplate': htmlTemplate
                },
                onCreate: this._onOkHandlerCreate.bind(this),
                onSuccess: (function(transport) {
                    this._onOkHandlerSuccess(transport, fileName);
                }).bind(this),
                onException: this._onOkHandlerException.bind(this),
                onComplete: this._onOkHandlerComplete.bind(this)
            }
        );
    },

    _onOkHandlerSuccess: function(transport, fileName) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            if ('success' == response.status) {
                Jsw.getComponent('fm-content').reload();
                var message = response.message.replace(
                    '%%file%%',
                    fileName.escapeHTML()
                );

                Jsw.addStatusMessage('info', message);

                this.hide();
            } else {
                this._addErrorMessage(response.message);
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
        }
    }

});

Smb.FileManager.CreateFolder = Class.create(Smb.FileManager.PopupForm, {

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div>' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                            '<label for="' + this._id + '-folder-name">' +
                                this.lmsg('folderName') +
                            '</label>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<input name="folderName" id="' + this._id + '-folder-name" ' +
                                'value="" class="f-middle-size input-text" type="text">' +
                            '<span class="field-errors" style="display: none;"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset();
    },

    reset: function($super) {
        this.setHint(
            this.lmsg('hint', {
                'folder': '<b>' + Jsw.getComponent('fm-content').getCurrentDir().escapeHTML() + '</b>'
            }) + Jsw.getComponent('fm-content').getReadonlyHint()
        );

        this._clearMessages();

        $(this._id + '-folder-name').value = '';

        $super();

        try {
            $(this._id + '-folder-name').focus();
        } catch (e) {}
    },

    _onSubmit: function() {
        var folderName = $(this._id + '-folder-name').value;
        new Ajax.Request(
            this._getHandlerUrl(),
            {
                method: 'post',
                parameters: {
                    'newDirectoryName': folderName
                },
                onCreate: this._onOkHandlerCreate.bind(this),
                onSuccess: (function(transport) {
                    this._onOkHandlerSuccess(transport, folderName);
                }).bind(this),
                onException: this._onOkHandlerException.bind(this),
                onComplete: this._onOkHandlerComplete.bind(this)
            }
        );
    },

    _onOkHandlerSuccess: function(transport, folderName) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            if ('success' == response.status) {
                Jsw.getComponent('fm-content').reload();
                Jsw.getComponent('fm-tree').reloadPath(Jsw.getComponent('fm-content').getCurrentDir());
                var message = response.message.replace(
                    '%%folder%%',
                    '<a href="#" id="' + this._id + '-success-message-link">' +
                        folderName.escapeHTML() +
                    '</a>'
                );

                Jsw.addStatusMessage('info', message);

                $(this._id + '-success-message-link').observe('click', function() {
                    Jsw.getComponent('fm-content').changeDirectory(folderName);
                });

                this.hide();
            } else {
                this._addErrorMessage(response.message);
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
        }
    }

});

Smb.FileManager.Rename = Class.create(Smb.FileManager.PopupForm, {

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div>' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                            '<label for="' + this._id + '-file-name">' +
                                this.lmsg('fileName') +
                            '</label>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<input name="newFileName" id="' + this._id + '-file-name" ' +
                                'value="" class="f-middle-size input-text" type="text">' +
                            '<span class="field-errors" style="display: none;"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset(this._config);
    },

    reset: function($super, options) {
        this._itemId = options.itemId;
        this._fileName = options.fileName;

        this.setHint(
            this.lmsg('hint', {
                'file': '<b>' + this._fileName.escapeHTML() + '</b>'
            })
        );

        this._clearMessages();

        $(this._id + '-file-name').value = this._fileName;

        $super();

        try {
            $(this._id + '-file-name').focus();
        } catch (e) {}
    },

    _onSubmit: function() {
        var fileName = $(this._id + '-file-name').value;

        new Ajax.Request(
            this._getHandlerUrl(),
            {
                method: 'post',
                parameters: {
                    'ids[0]': this._itemId,
                    'newFileName': fileName
                },
                onCreate: this._onOkHandlerCreate.bind(this),
                onSuccess: (function(transport) {
                    this._onOkHandlerSuccess(transport);
                }).bind(this),
                onException: this._onOkHandlerException.bind(this),
                onComplete: this._onOkHandlerComplete.bind(this)
            }
        );
    },

    _onOkHandlerSuccess: function(transport) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            var message = $A(response.statusMessages).first();
            if ('info' == message.status) {
                Jsw.getComponent('fm-content').reload();
                Jsw.getComponent('fm-tree').reloadPath(Jsw.getComponent('fm-content').getCurrentDir());
                Jsw.addStatusMessage('info', message.content);

                this.hide();
            } else {
                this._addErrorMessage(message.content);
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
        }
    }

});

Smb.FileManager.CopyMoveFiles = Class.create(Smb.FileManager.PopupForm, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._treeConfig = this._getConfigParam('tree');
        this._cls = 'popup-panel popup-form-vertical';

    },

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div class="form-box">' +
                    '<div class="box-area">' +
                        '<div class="content">' +
                            '<div class="content-area">' +
                                '<div class="form-row">' +
                                    '<div class="field-name">' +
                                        this.lmsg('destinationFolderHint') +
                                    '</div>' +
                                    '<div class="field-value">' +
                                        '<div class="scrollable fm-scrollable">' +
                                            '<div class="scrollable-wrap">' +
                                                '<div id="fm-modal-dialog-box-files-tree" class="tree"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="form-row">' +
                                    '<div class="single-row">' +
                                        '<div class="indent-box">' +
                                            '<input type="checkbox" class="checkbox" value="1" ' +
                                                'id="' + this._id + '-overwrite"/>' +
                                            '<div class="indent-box-content">' +
                                                '<label for="' + this._id + '-overwrite">' +
                                                    this.lmsg('overwriteExisting') +
                                                '</label>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        var treeConfig = Object.extend(this._treeConfig, {
            onNodeClick: this._onTreeNodeClick.bind(this),
            showMessage: this._showMessage.bind(this)
        });

        this._tree = new Jsw.FileManager.Tree(treeConfig);

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset();
    },

    _onTreeNodeClick: function(directoryPath) {
        this.setDestinationDir(directoryPath);
    },

    _onTreeRootNodeClick: function() {
        this.setDestinationDir('/');
    },

    reset: function($super) {
        this._selectedItems = Jsw.getComponent('fm-content').getSelectedItems();
        this._destinationDir = '';
        this._tree.reload();
        $(this._id + '-overwrite').checked = false;

        this._initSelectionHint();

        this._clearMessages();

        $super();
    },

    _onSubmit: function() {
        if (this._destinationDir == '') {
            this._showMessage('error', this.lmsg('destinationRequired'));
            return;
        }
        this.hide();
        var overwriteExisting = $(this._id + '-overwrite').checked;

        Jsw.getComponent('fm-content').execGroupOperation({
            url: this._getHandlerUrl('destinationDir=' + this._destinationDir + '&overwrite=' + overwriteExisting),
            skipConfirmation: true,
            onSuccess: this._onSuccess.bind(this)
        });
    },

    _showMessage: function(status, message) {
        // Currently, various statuses don't supported, value of status is ignored and all messages have error status.
        this._clearMessages();
        this._addErrorMessage(message);
    },

    setDestinationDir: function(destinationDir) {
        this._destinationDir = destinationDir;
    },

    _onSuccess: function() {
        Jsw.getComponent('fm-content').enable();
        Jsw.getComponent('fm-tree').reloadPath(Jsw.getComponent('fm-content').getCurrentDir());
        Jsw.getComponent('fm-tree').reloadPath(this._destinationDir);
    }

});

Smb.FileManager.CopyFiles = Class.create(Smb.FileManager.CopyMoveFiles, {

});

Smb.FileManager.MoveFiles = Class.create(Smb.FileManager.CopyMoveFiles, {

});

Smb.FileManager.UploadCapabilities = {
    _isMultipleFileSupported: null,
    _isUploadProgressSupported: null,

    isAdvancedUploadSupported: function() {
        return Smb.FileManager.UploadCapabilities.isMultipleFileSupported() &&
            Smb.FileManager.UploadCapabilities.isFormDataSupported() &&
            Smb.FileManager.UploadCapabilities.isFileApiSupported() &&
            !Smb.FileManager.UploadCapabilities.isReadonlyDirectory();
    },

    isMultipleFileSupported: function() {
        if (null === Smb.FileManager.UploadCapabilities._isMultipleFileSupported) {
            var element = new Element('input', {'type' : 'file'});
            Smb.FileManager.UploadCapabilities._isMultipleFileSupported =  'multiple' in element;
        }
        return Smb.FileManager.UploadCapabilities._isMultipleFileSupported;
    },

    isReadonlyDirectory: function() {
        return Jsw.getComponent('fm-content').getReadonlyHint();
    },

    isFormDataSupported: function() {
        return typeof FormData != 'undefined';
    },

    isFileApiSupported: function() {
        return typeof File != "undefined";
    },

    isUploadProgressSupported: function() {
        if (null === Smb.FileManager.UploadCapabilities._isUploadProgressSupported) {
            var transport = Ajax.getTransport();
            Smb.FileManager.UploadCapabilities._isUploadProgressSupported = transport && typeof transport.upload != 'undefined';
        }
        return Smb.FileManager.UploadCapabilities._isUploadProgressSupported;
    }
};

Smb.FileManager.UploadButton = Class.create(Jsw.SmallButton, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._uploadPopupParams = this._getConfigParam('uploadPopupParams', {});
        this._fileInputId = this._getConfigParam('fileUploadInputId', 'file-upload-input');

        if (!Smb.FileManager.UploadCapabilities.isAdvancedUploadSupported()) {
            this._handler = this.uploadHandler.bind(this);
        }
    },

    _initComponentElement: function($super) {
        $super();

        if (!Smb.FileManager.UploadCapabilities.isAdvancedUploadSupported()) {
            return;
        }

        this._componentElement.setStyle({
            position: 'relative',
            overflow: 'hidden'
        });

        this.resetFileInputElement();
    },

    resetFileInputElement: function() {
        var fileInputElement = this._componentElement.select('#' + this._fileInputId).first();
        if (fileInputElement) {
            fileInputElement.remove();
        }

        fileInputElement = new Element('input', {
            type: 'file',
            name: 'file[]',
            id: this._fileInputId,
            multiple: true
        });

        fileInputElement.setStyle({
            position: 'absolute',
            right: 0,
            top: 0,
            cursor: 'pointer',
            opacity: 0,
            width: '100%',
            height: '100%',
            marginTop: '-30px',
            paddingBottom: '30px',
            boxSizing: 'content-box',
            outline: 0
        });
        this._componentElement.insert({bottom: fileInputElement});

        fileInputElement.observe('change', this.multipleUploadHandler.bind(this));
    },

    uploadHandler: function() {
        Jsw.getComponent('fm-content').showPopup(Smb.FileManager.Upload, this._uploadPopupParams);
    },

    multipleUploadHandler: function() {
        this._uploadPopupParams.fileInputId = this._fileInputId;
        this._uploadPopupParams.resetFileInputElement = this.resetFileInputElement.bind(this);
        Jsw.getComponent('fm-content').showPopup(Smb.FileManager.MultipleUpload, this._uploadPopupParams);
    }
});

Smb.FileManager.Upload = Class.create(Smb.FileManager.PopupForm, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._selectFilesDialogId = this._id + '-select-files-dialog';
        this._selectFilesDialogItemsAreaId = this._selectFilesDialogId + '-items';
        this._uploadMaxFileSize = this._getConfigParam('uploadMaxFileSize', '')
    },

    render: function($super) {
        $super();

        this.setHint(this.lmsg('hint') + Jsw.getComponent('fm-content').getReadonlyHint());

        $(this._contentAreaId).insert('<div id="' + this._selectFilesDialogId + '">' +
                '<div id="' + this._selectFilesDialogItemsAreaId + '"></div>' +
                '<div class="form-row">' +
                    '<div class="single-row">' +
                        '<a href="#" class="s-btn sb-item-add"><i><i><i><span>' + this.lmsg('addFileItem') + '</span></i></i></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        this.addSelectFilesItem();

        $(this._selectFilesDialogId).select('.sb-item-add').each(function(element) {
            element.observe('click', this._onAddSelectFilesItemClick.bindAsEventListener(this));
        }, this);

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, false, false);
        this.addRightButton(this.lmsg('buttonCancel'), this._onCancel, false, false);
    },

    reset: function($super) {
        this._clearMessages();
        $(this._selectFilesDialogItemsAreaId).update('');
        this._uploadCanceled = false;

        $super();
    },

    _onSubmit: function() {
        if (!this._checkUploadQueue()) {
            return;
        }
        if (this._hasExistingFilesUploadQueue()) {
            this.showReplaceExisitingFilesDialog();
            return;
        }
        this.showUploadProgressDialog();
        this.startNextQueueUpload();
    },

    _onCancel: function() {
        this.hide();
    },

    _onAddSelectFilesItemClick: function(event) {
        this.addSelectFilesItem();
        Event.stop(event);
    },

    addSelectFilesItem: function() {
        var itemsArea = $(this._selectFilesDialogItemsAreaId);
        var itemsCount = itemsArea.select('form').length;

        var itemId = this._selectFilesDialogId + '-item-' + itemsCount;
        var item = '<form id="' + itemId + '" action="' + this._getHandlerUrl() + '" method="post" enctype="multipart/form-data" target="_uploadIFrame">' +
                '<input name="forgery_protection_token" type="hidden" value="' + $('forgery_protection_token').content + '"/>' +
                '<div class="form-row">' +
                    '<input name="file[]" type="file"/>' +
                    (itemsCount ? ' <a href="#" class="s-btn sb-item-remove"><i><i><i><span> ' + this.lmsg('removeFileItem') + '</span></i></i></i></a>' : '') +
                '</div>' +
            '</form>';

        itemsArea.insert({ bottom : item });

        if (itemsCount) {
            $(itemId).select('.sb-item-remove').each(function(element) {
                element.observe('click', this._onRemoveSelectFilesItemClick.bindAsEventListener(this));
            }, this);
        }
    },

    _onRemoveSelectFilesItemClick: function(event) {
        var item = Event.element(event).up('form');
        if (item) {
            item.remove();
        }
        Event.stop(event);
    },

    _checkUploadQueue: function() {
        this._clearMessages();
        this._prepareUploadQueue();
        return this._hasFilesInUploadQueue() && this._hasNormalSizeOfFilesInUploadQueue();
    },

    _hasFilesInUploadQueue: function() {
        if (0 == this._uploadQueue.length) {
            this._addErrorMessage(this.lmsg('noFilesSelectedForUpload'));
            return false;
        }
        return true;
    },

    _hasNormalSizeOfFilesInUploadQueue: function() {
        if (!this._uploadMaxFileSize) {
            return true;
        }
        for(var i = 0; i < this._uploadQueue.length; i++) {
            if (this._uploadQueue[i].total > this._uploadMaxFileSize) {
                this._addErrorMessage(this.lmsg('errorFileIsLarger', {
                    'filename': this._uploadQueue[i].savedFileName
                }));
                return false;
            }
        }
        return true;
    },

    _hasExistingFilesUploadQueue: function() {
        this._uploadExistingFilesQueue = $A();
        var currentDirectoryFiles = this._getCurrentDirectoryFiles();
        this._uploadQueue.each(function(queueItem) {
            if ( 0 <= currentDirectoryFiles.indexOf(encodeURIComponent(queueItem.savedFileName))) {
                this._uploadExistingFilesQueue.push(queueItem);
            }
        }, this);
        return 0 < this._uploadExistingFilesQueue.length;
    },

    _getCurrentDirectoryFiles: function() {
        var filenames = [];
        $('fm-content-table').select('tr').each(function(selectedRow) {
            var fileName = selectedRow.readAttribute('data-row-id');
            if (fileName) {
                filenames.push(fileName.replace(/\+/g, '%20'));
            }
        });
        return filenames;
    },

    _prepareUploadQueue: function() {
        this._uploadQueue = $A();
        var items = $(this._selectFilesDialogItemsAreaId).select('form');
        items.each(function(formElement) {
            var fileName = formElement.down('input[type="file"]').value;
            if (!fileName) {
                return;
            }

            // IE saves full path to file, but we needed in file name only
            fileName = fileName.replace(/\\/g,'/').replace( /.*\//, '');

            var queueItem = {
                inputId: formElement.id,
                progressId: formElement.id + '-progress',
                formElement: formElement,
                savedFileName: fileName,
                status: 'PENDING',
                type: 'unknown'
            };
            this._uploadQueue.push(queueItem);
        }, this);
    },

    showUploadProgressDialog: function() {
        this.hide();
        this._uploadProgressDialog = new Smb.FileManager.UploadProgressDialog({
            id: this._id + '-progress',
            renderTo: this._id + '-progress-dialog-box',
            cls: 'popup-panel',
            items: this._uploadQueue,
            locale: this.getLocale(),
            onCancelClick: this._onCancelUploadClick.bind(this),
            uploadProgressSupported: Smb.FileManager.UploadCapabilities.isAdvancedUploadSupported() &&
                Smb.FileManager.UploadCapabilities.isUploadProgressSupported()
        });
    },

    _onCancelUploadClick: function(event) {
        this._uploadCanceled = true;
        this._uploadAdapter.cancel();
    },

    showReplaceExisitingFilesDialog: function() {
        this.hide();
        this._uploadProgressDialog = new Smb.FileManager.ReplaceExistingFilesDialog({
            id: this._id + '-progress',
            renderTo: this._id + '-progress-dialog-box',
            cls: 'popup-panel',
            items: this._uploadExistingFilesQueue,
            locale: this.getLocale(),
            onSkipClick: this._onSkipExistingFilesClick.bind(this),
            onReplaceClick: this._onReplaceExistingFilesClick.bind(this)
        });
    },

    _onSkipExistingFilesClick: function(event) {
        this._uploadExistingFilesQueue.each(function(queueItem) {
            for(var i = 0; i < this._uploadQueue.length; i++) {
                if (queueItem.savedFileName == this._uploadQueue[i].savedFileName) {
                    this._uploadQueue.splice(i, 1);
                    break;
                }

            }
        }, this);
        if (!this._hasFilesInUploadQueue()) {
            this.close();
            return;
        }
        this.showUploadProgressDialog();
        this.startNextQueueUpload();
    },

    _onReplaceExistingFilesClick: function(event) {
        this.showUploadProgressDialog();
        this.startNextQueueUpload();
    },

    _prepareUploadAdapter: function() {
        if (!this._uploadAdapter) {
            var config = {
                contentAreaId: this._contentAreaId,
                handlerUrl: this._getHandlerUrl(),
                startUploadHandler: function() {
                    if (this._scheduleStartUpload) {
                        this._scheduleStartUpload = null;
                        this.startNextQueueUpload();
                    }
                }.bind(this),
                finishUploadHandler: this._onNextQueueUploadFinished.bind(this)
            };
            this._uploadAdapter = new Jsw.FileManager.UploadAdapterIframe(config);
        }
    },

    startNextQueueUpload: function() {
        this._prepareUploadAdapter();

        if (!this._uploadAdapter.isReady()) {
            this._scheduleStartUpload = true;
            return;
        }

        if (this._uploadCurrent) {
            return;
        }

        if (this._uploadCanceled) {
            this._onAllQueueUploadFinished();
            return;
        }

        this._started = false;

        this._processUploadQueue();

        if (!this._started) {
            this._onAllQueueUploadFinished();
            return;
        }

        var status = this.getQueueStatus();

        this._uploadProgressDialog.updateListDescription(
            this.lmsg('descriptionUploadProgress', {
                'total': status.total,
                'pending': status.pending,
                'uploading': status.uploading,
                'completed': status.completed,
                'failed': status.failed
            })
        );
    },

    _processUploadQueue: function() {
        this._uploadQueue.each(this._processUploadItem, this);
    },

    _processUploadItem: function(queueItem) {
        if ('PENDING' != queueItem.status) {
            return;
        }
        this._started = true;
        this.updateUploadProgressItemStatus(queueItem, 'UPLOADING');
        this._uploadCurrent = queueItem;
        queueItem.formElement.select('input[name="fileName"]').each(function(element) {
            element.value = queueItem.savedFileName;
        }, this);
        queueItem.formElement.submit();
        throw $break;
    },

    _onNextQueueUploadFinished: function() {
        if (!this._uploadCurrent) {
            return;
        }

        var queueItem = this._uploadCurrent;
        this._uploadCurrent = null;

        var status = this._getNextQueueUploadResult();
        switch(status.status) {
            case 'SUCCESS':
            case 'CANCELED':
                this.updateUploadProgressItemStatus(queueItem, status.status);
                this.startNextQueueUpload();
                break;
            case 'ERROR':
            default:
                this.updateUploadProgressItemStatus(queueItem, 'ERROR');
                this._onQueueUploadFailed(status);
                break;
        }
    },

    _getNextQueueUploadResult: function() {
        if (this._uploadCanceled) {
            return {
                status: 'CANCELED',
                message: ''
            };
        }
        return this._uploadAdapter.getResult();
    },

    _onAllQueueUploadFinished: function() {
        Jsw.getComponent('fm-content').reload();
        this.reportUploadFinished.bind(this).delay(0.5);
    },

    _onQueueUploadFailed: function(status) {
        var errorItems = $A();
        this._uploadQueue.each(function(item) {
            errorItems.push({
                'name': item.savedFileName,
                'type': item.type,
                'status': item.status
            });
        });

        this.close();

        new Smb.FileManager.ErrorDialog({
            errorMessage: status.message,
            message: this.lmsg('failed'),
            locale: this.getLocale(),
            items: errorItems
        });
    },

    reportUploadFinished: function() {
        var messageType = null;
        var message = null;

        Jsw.clearStatusMessages();

        this.close();

        if (0 == this._uploadQueue.length) {
            return;
        }

        var status = this.getQueueStatus();

        if (this._uploadCanceled) {
            message = 'uploadCanceled';
            messageType = 'warning';
        } else if (status.completed > 0) {
            message = 'uploadFinished';
            messageType = 'info';
        } else {
            message = 'uploadFinishedNoFiles';
            messageType = 'warning';
        }

        Jsw.addStatusMessage(messageType, this.lmsg(message, {
            'total': status.total,
            'pending': status.pending,
            'uploading': status.uploading,
            'completed': status.completed,
            'failed': status.failed,
            'folder': Jsw.getComponent('fm-content').getCurrentDir().escapeHTML()
        }));
    },

    updateUploadProgressItemStatus: function(queueItem, status) {
        queueItem.status = status;
        this._uploadProgressDialog.updateItemStatus(queueItem);
    },

    getQueueStatus: function() {
        var status = {
            completed: 0,
            pending: 0,
            failed: 0,
            uploading: 0,
            canceled: 0,
            total: this._uploadQueue.length
        };

        this._uploadQueue.each(function(queueItem) {
            switch (queueItem.status) {
                case 'PENDING':
                    status.pending++;
                    break;
                case 'UPLOADING':
                    status.uploading++;
                    break;
                case 'ERROR':
                    status.failed++;
                    break;
                case 'SUCCESS':
                    status.completed++;
                    break;
                case 'CANCELED':
                    status.canceled++;
                    break;
            }
        }, this);

        return status;
    },

    close: function() {
        if (this._uploadProgressDialog) {
            this._uploadProgressDialog.remove();
            this._uploadProgressDialog = null;
        }
        this.hide();
    }
});

Smb.FileManager.MultipleUpload = Class.create(Smb.FileManager.Upload, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._files = this._getConfigParam('files', null);

        this.resetFileInputElement = this._getConfigParam('resetFileInputElement', function(){});
        this._fileInputId = this._getConfigParam('fileInputId');
    },

    render: function() {
        this._onSubmit();
    },

    reset: function($super, config) {
        if (config) {
            this._initConfiguration(config)
        }
        this._uploadCanceled = false;

        // Do not call $super() here
        this.show();

        this._onSubmit();
    },

    _checkUploadQueue: function($super) {
        var result = $super();
        if (!result) {
            this.hide();
        }
        return result;
    },

    _clearMessages: function() {
        Jsw.clearStatusMessages();
    },

    _addErrorMessage: function(message) {
        Jsw.addStatusMessage('error', message);
    },

    _prepareUploadQueue: function() {
        this._uploadQueue = $A();
        this._totalUploadedSize = 0;
        this._totalSize = 0;

        if (this._files) {
            var files = this._files;
        } else {
            var files = $(this._fileInputId).files;
        }
        for (var i = 0, file; file = files[i]; i++) {
            var fileSize = this._getFileSize(file);
            var queueItem = {
                progressId: 'upload-progress-' + i,
                savedFileName: file.name,
                status: 'PENDING',
                type: 'unknown',
                file: file,
                loaded: null,
                total: fileSize
            };
            this._totalSize += fileSize;
            this._uploadQueue.push(queueItem);
        }
    },

    _getFileSize: function(file) {
        return typeof file.fileSize != 'undefined' ? file.fileSize : file.size;
    },

    _processUploadItem: function(queueItem) {
        if ('PENDING' != queueItem.status) {
            return;
        }
        this._started = true;
        this.updateUploadProgressItemStatus(queueItem, 'UPLOADING');
        this._uploadCurrent = queueItem;
        this._uploadAdapter.upload(queueItem.file);
        throw $break;
    },

    _prepareUploadAdapter: function() {
        if (!this._uploadAdapter) {
            var config = {
                handlerUrl: this._getHandlerUrl(),
                startUploadHandler: function() {
                    if (this._scheduleStartUpload) {
                        this._scheduleStartUpload = null;
                        this.startNextQueueUpload();
                    }
                }.bind(this),
                finishUploadHandler: this._onNextQueueUploadFinished.bind(this),
                progressUploadHandler: this._onProgress.bindAsEventListener(this)
            };
            this._uploadAdapter = new Smb.FileManager.UploadAdapterAjax(config);
        } else {
            this._uploadAdapter.setHandlerUrl(this._getHandlerUrl());
        }
    },

    close: function($super) {
        $super();
        if (!this._files) {
            this.resetFileInputElement();
        }
        this._files = null;
    },

    _onProgress: function(e) {
        if (e.lengthComputable && this._uploadCurrent){
            //e.loaded in Chrome and Safari contains POST request upload progress, not file upload progress, so try to normalize
            this._uploadCurrent.loaded = e.total > 0 ? Math.round(e.loaded / e.total * this._uploadCurrent.total) : 0;
            this._uploadProgressDialog.updateTotalProgress(this._getTotalUploadPercent(this._totalUploadedSize + this._uploadCurrent.loaded));
            this._uploadProgressDialog.updateItemUploadProgress(this._uploadCurrent);
        }
    },

    _onNextQueueUploadFinished: function($super) {
        if (this._uploadCurrent) {
            this._uploadCurrent.loaded = this._uploadCurrent.total;
            this._totalUploadedSize += this._uploadCurrent.total;
            this._uploadProgressDialog.updateTotalProgress(this._getTotalUploadPercent(this._totalUploadedSize));
            this._uploadProgressDialog.updateItemUploadProgress(this._uploadCurrent);
        }
        $super();
    },

    _getTotalUploadPercent: function(totalUploaded) {
        return this._totalSize > 0 ? Math.round(totalUploaded / this._totalSize * 100) : 100;
    }
});

Smb.FileManager.AjaxUploadRequest = Class.create(Ajax.Request, {
    initialize: function($super, url, options) {
        if (options.onProgress) {
            this._onProgress = options.onProgress;
        }
        $super(url, options);
    },

    request: function($super, url) {
        if (this._onProgress) {
            this.transport.upload.onprogress = this._onProgress;
        }
        $super(url);
    },

    setRequestHeaders: function() {}
});

Smb.FileManager.UploadAdapterAjax = Class.create({
    initialize: function(config) {
        this._handlerUrl = config.handlerUrl;
        this._startUploadHandler = config.startUploadHandler;
        this._finishUploadHandler = config.finishUploadHandler;
        this._progressUploadHandler = config.progressUploadHandler;
    },

    setHandlerUrl: function (handlerUrl) {
        this._handlerUrl = handlerUrl;
    },

    upload: function(file, params) {
        var formData = new FormData();
        formData.append(file.name, file);
        formData.append('forgery_protection_token', $('forgery_protection_token').content);
        if (params) {
            $H(params).each(function(pair) {
                formData.append(pair.key, pair.value);
            });
        }

        this._request = new Smb.FileManager.AjaxUploadRequest(
            this._handlerUrl,
            {
                method: 'post',
                postBody: formData,
                onCreate: this._onCreate.bind(this),
                onSuccess: this._onSuccess.bind(this),
                onException: this._onException.bind(this),
                onProgress: this._progressUploadHandler
            }
        );
    },

    _onCreate: function() {
        this._startUploadHandler();
    },

    _onSuccess: function(transport) {
        try {
            this._result = transport.responseText.evalJSON();
        } catch (e) {
            this._result = {
                status: 'ERROR',
                message: 'No upload response'
            }
        }
        this._finishUploadHandler();
    },

    _onException: function(transport, exception) {
        this._result = {
            status: 'ERROR',
            message: 'Internal error: ' + exception
        }
    },

    isReady: function() {
        return true;
    },

    getResult: function() {
        return this._result;
    },

    cancel: function() {
        this._request.abort();
        this._finishUploadHandler();
    }
});

Smb.FileManager.UploadProgressDialog = Class.create(Smb.FileManager.ListPopup, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = this._getConfigParam('cls', 'popup-panel');
        this._titleCls = this._getConfigParam('titleCls', 'pp-upload');

        this._items = this._getConfigParam('items', $A());
        this._uploadProgressDialogDescriptionId = this._id + '-description';
        this._uploadProgressDialogPercentageId =  this._id + '-percentage';
        this._onCancelClickExternal = this._getConfigParam('onCancelClick', null);
        this._uploadProgressSupported = this._getConfigParam('uploadProgressSupported', false);
        this._units = [this.lmsg('bytes'), this.lmsg('kbytes'), this.lmsg('mbytes'), this.lmsg('gbytes')];
    },

    render: function($super) {
        $super();

        this.setHint1(this.lmsg('uploadDialogHint'));
        this.setTitle(this.lmsg('uploadDialogTitle'));

        $(this._contentAreaId).insert({
            top: '<div class="progress-box files-progress-upload">' +
                '<div class="progress-label">' +
                    '<span class="progress-label-left" id="' + this._uploadProgressDialogDescriptionId + '"></span>' +
                    '<span class="progress-label-right" id="' + this._uploadProgressDialogPercentageId + '"></span>' +
                '</div>' +
                '<div class="progress">' +
                    '<div class="progress-bar" style="width: 0;"></div>' +
                '</div>' +
            '</div>'
        });

        this._items.each(function(item) {
            this._addItem(item);
        }, this);

        this._cancelButton = this.addRightButton(
            this.lmsg('buttonCancel'),
            this._onCancelClick,
            true,
            false
        );
        this.resizeList();
    },

    _onCancelClick: function() {
        this._updateButton(this._cancelButton, {
            title: this.lmsg('buttonCancelUploadClicked'),
            disabled: true
        });
        if (this._onCancelClickExternal) {
            this._onCancelClickExternal();
        }
    },

    _addItem: function(queueItem) {
        this._itemClass = ('odd' == this._itemClass) ? 'even' : 'odd';

        var itemHtml = '<tr class="' + this._itemClass + '" id="' + queueItem.progressId + '">' +
            '<td class="first">' +
                '<span class="type-' + queueItem.type.escapeHTML() + '">' +
                    queueItem.savedFileName.escapeHTML() +
                '</span>' +
            '</td>' + (this._uploadProgressSupported ?
                '<td class="upload-progress nowrap t-r">' +
                    '<span>' +
                        this._getUploadProgressDescription(queueItem) +
                    '</span>' +
                '</td>' : '') +
            '<td class="last" style="width: 100px;">' +
                '<span class="hint-not-started">' +
                    this.lmsg('statusNotStarted') +
                '</span>' +
            '</td>' +
        '</tr>';

        $(this._itemsAreaId).insert({ bottom : itemHtml });
    },

    _getUploadProgressDescription: function(queueItem) {
        var progressText = '';
        if (queueItem.loaded === null || queueItem.loaded == queueItem.total) {
            progressText = this._getSize(queueItem.total);
        } else {
            progressText = this.lmsg('progressText', {
                'loaded': this._getSize(queueItem.loaded),
                'total': this._getSize(queueItem.total)
            });
        }
        return progressText;
    },

    _getSize: function(size){
        var unitIndex = 0;
        while (size >= 1024) {
            size /= 1024;
            unitIndex++;
        }

        return (unitIndex > 0 ? size.toFixed(1) : size) + ' ' + this._units[unitIndex];
    },

    updateListDescription: function(html) {
        $(this._uploadProgressDialogDescriptionId).update(html);
    },

    updateTotalProgress: function(totalUploaded) {
        $(this._contentAreaId).down('.progress-bar').setStyle({width: totalUploaded + '%'});
        $(this._uploadProgressDialogPercentageId).update(this.lmsg('totalProgressText', {'percent': totalUploaded + '%'}));
    },

    updateItemStatus: function(queueItem) {
        var statusIndicator = '';

        switch (queueItem.status) {
            case 'UPLOADING':
                statusIndicator = '<span class="hint-wait">' + this.lmsg('statusUploading') +'</span>';
                break;
            case 'ERROR':
                statusIndicator = '<span class="hint-failed">' + this.lmsg('statusFailed') +'</span>';
                break;
            case 'SUCCESS':
                statusIndicator = '<span class="hint-ok">' + this.lmsg('statusCompleted') +'</span>';
                break;
            case 'CANCELED':
                statusIndicator = '<span class="hint-failed">' + this.lmsg('statusCanceled') +'</span>';
                break;
        }
        $(queueItem.progressId).down('.last').update(statusIndicator);
    },

    updateItemUploadProgress : function(queueItem) {
        if (this._uploadProgressSupported) {
            var progressDescription = this._getUploadProgressDescription(queueItem);
            $(queueItem.progressId).down('.upload-progress').update(progressDescription);

            var progressPercent = queueItem.total > 0 ? Math.round(queueItem.loaded / queueItem.total * 100) : 100;
            var gauge = $(queueItem.progressId).down('.progress-bar');
            if (gauge) {
                gauge.setStyle({width: progressPercent + '%'});
            } else {
                var progressBar = '<div class="progress progress-sm">' +
                    '<div class="progress-bar" style="width: ' + progressPercent + '%;"></div>' +
                '</div>';
                $(queueItem.progressId).down('.last').update(progressBar);
            }
        }
    }
});


Smb.FileManager.ReplaceExistingFilesDialog = Class.create(Smb.FileManager.ListPopup, {
    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = this._getConfigParam('cls', 'popup-panel');
        this._titleCls = this._getConfigParam('titleCls', 'pp-upload');

        this._items = this._getConfigParam('items', $A());
        this._onSkipClickExternal = this._getConfigParam('onSkipClick', null);
        this._onReplaceClickExternal = this._getConfigParam('onReplaceClick', null);
    },

    render: function($super) {
        $super();

        this.setHint1(this.lmsg('replaceExistingFilesDialogHint'));
        this.setTitle(this.lmsg('uploadDialogTitle'));

        this._items.each(function(item) {
            this._addItem(item);
        }, this);

        this._replaceButton = this.addRightButton(
            this.lmsg('buttonReplace'),
            this.onReplaceClick,
            true,
            false
        );

        this._skipButton = this.addRightButton(
            this.lmsg('buttonSkip'),
            this.onSkipClick,
            true,
            false
        );

        this.resizeList();
    },

    onSkipClick: function() {
        this._updateButton(this._skipButton, {
            disabled: true
        });
        if (this._onSkipClickExternal) {
            this._onSkipClickExternal();
        }
    },

    onReplaceClick: function() {
        this._updateButton(this._replaceButton, {
            disabled: true
        });
        if (this._onReplaceClickExternal) {
            this._onReplaceClickExternal();
        }
    },

    _addItem: function(queueItem) {
        this._itemClass = ('odd' == this._itemClass) ? 'even' : 'odd';

        var itemHtml = '<tr class="' + this._itemClass + '" id="' + queueItem.progressId + '">' +
            '<td class="first">' +
            '<span class="type-' + queueItem.type.escapeHTML() + '">' +
            queueItem.savedFileName.escapeHTML() +
            '</span>' +
            '</td>' +
            '</tr>';

        $(this._itemsAreaId).insert({ bottom : itemHtml });
    }
});

Smb.FileManager.ErrorDialog = Class.create(Smb.FileManager.ListPopup, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._cls = this._getConfigParam('cls', 'popup-panel');
        this._titleCls = this._getConfigParam('titleCls', 'pp-error');

        this._errorMessage = this._getConfigParam('errorMessage', '');
        this._message = this._getConfigParam('message', null);
        this._items = this._getConfigParam('items', $A());
    },

    render: function($super) {
        $super();

        this.setTitle(this.lmsg('errorDialogTitle'));

        this._addErrorMessage(this._errorMessage);
        if (this._message) {
            this.setHint1(this._message);
        }

        this._items.each(function(item) {
            this._addItem(item);
        }, this);

        this.addRightButton(
            this.lmsg('buttonClose'),
            this._onClose.bind(this),
            true,
            true
        );
        this.resizeList();
    },

    _onClose: function() {
        this.hide();
    },

    _addItem: function(item) {
        this._itemClass = ('odd' == this._itemClass) ? 'even' : 'odd';

        var statusClass = '';
        var statusTitle = '';

        switch (item.status) {
            case 'SUCCESS':
                statusClass = 'ok';
                statusTitle = this.lmsg('statusCompleted');
                break;
            case 'ERROR':
                statusClass = 'failed';
                statusTitle = this.lmsg('statusFailed');
                break;
            default:
                statusClass = 'not-started';
                statusTitle = this.lmsg('statusNotStarted');
        }

        var statusHtml = '<span class="hint-' + statusClass + '">' + statusTitle + '</span>';

        var itemHtml = '' +
            '<tr class="' + this._itemClass + '">' +
                '<td class="first">' +
                    '<span class="type-' + item.type.escapeHTML() + '">' +
                        item.name.escapeHTML() +
                    '</span>' +
                '</td>' +
                '<td class="last">' +
                    statusHtml +
                '</td>' +
            '</tr>';

        $(this._itemsAreaId).insert({ bottom : itemHtml });
    }
});

Smb.FileManager.ExtractArchive = Class.create(Smb.FileManager.PopupForm, {

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div>' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                            '<label for="' + this._id + '-destination-folder">' +
                                this.lmsg('destinationFolderHint') +
                            '</label>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<div class="text-value">' +
                                '<span id="' + this._id + '-destination-folder">' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="form-row">' +
                        '<div class="single-row">' +
                            '<div class="indent-box">' +
                                '<input type="checkbox" class="checkbox" value="1" ' +
                                    'id="' + this._id + '-overwrite"/>' +
                                '<div class="indent-box-content">' +
                                    '<label for="' + this._id + '-overwrite">' +
                                        this.lmsg('overwriteExisting') +
                                    '</label>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset(this._config);
    },

    reset: function($super, options) {
        if (options.fileName) {
            this._fileName = options.fileName;
            this._selectedItems = [Jsw.getComponent('fm-content').getItemById(this._fileName)];
        } else {
            this._fileName = '';
            this._selectedItems = Jsw.getComponent('fm-content').getSelectedItems();
        }

        $(this._id + '-overwrite').checked = false;

        this._initSelectionHint();

        $(this._id + '-destination-folder').update(Jsw.getComponent('fm-content').getCurrentDir().escapeHTML());

        var readonlyHint = Jsw.getComponent('fm-content').getReadonlyHint();
        if (readonlyHint) {
            readonlyHint = '<span class="field-errors">' + readonlyHint + '</span>';
            $(this._id + '-destination-folder').insert({after: readonlyHint});
        } else {
            readonlyHint = $(this._id + '-destination-folder').next('.field-errors');
            if (readonlyHint) {
                readonlyHint.remove();
            }
        }

        this._clearMessages();

        $super();
    },

    _onSubmit: function() {
        this.hide();
        var overwriteExisting = $(this._id + '-overwrite').checked;
        var params = {
            url: this._getHandlerUrl('overwrite=' + overwriteExisting),
            skipConfirmation: true
        };

        if (this._fileName) {
            params['ids[0]'] = this._fileName;
            new Ajax.Request(
                params.url,
                {
                    method: 'post',
                    parameters: params,
                    onCreate: this._onOkHandlerCreate.bind(this),
                    onSuccess: (function(transport) {
                        this._onOkHandlerSuccess(transport);
                    }).bind(this),
                    onException: this._onOkHandlerException.bind(this),
                    onComplete: this._onOkHandlerComplete.bind(this)
                }
            );

        } else {
            params.onSuccess = this._onGroupExtractSuccess;
            Jsw.getComponent('fm-content').execGroupOperation(params);
        }
    },

    _onGroupExtractSuccess: function() {
        Jsw.getComponent('fm-content').enable();
        Jsw.getComponent('fm-tree').reloadPath(Jsw.getComponent('fm-content').getCurrentDir());
    },

    _onOkHandlerSuccess: function(transport) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            var message = $A(response.statusMessages).first();
            if ('info' == message.status) {
                Jsw.getComponent('fm-content').reload();
                Jsw.getComponent('fm-tree').reloadPath(Jsw.getComponent('fm-content').getCurrentDir());
                Jsw.addStatusMessage('info', message.content);
                this.hide();
            } else {
                this._addErrorMessage(message.content);
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
        }
    }
});

Smb.FileManager.CreateArchive = Class.create(Smb.FileManager.PopupForm, {

    render: function($super) {
        $super();

        $(this._contentAreaId).insert(
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">' +
                '<div>' +
                    '<div class="form-row">' +
                        '<div class="field-name">' +
                            '<label for="' + this._id + '-archive-name">' +
                                this.lmsg('archiveName') +
                            '</label>' +
                        '</div>' +
                        '<div class="field-value">' +
                            '<input name="archiveName" id="' + this._id + '-archive-name" ' +
                                'value="" class="f-middle-size input-text" type="text">.zip' +
                            '<span class="field-errors" style="display: none;"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</form>'
        );

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset();
    },

    reset: function($super) {
        this.setHint(
            this.lmsg('hint', {
                'folder': '<b>' + Jsw.getComponent('fm-content').getCurrentDir().escapeHTML() + '</b>'
            }) + Jsw.getComponent('fm-content').getReadonlyHint()
        );

        this._clearMessages();

        $(this._id + '-archive-name').value = '';

        $super();

        try {
            $(this._id + '-archive-name').focus();
        } catch (e) {}
    },

    _onSubmit: function() {
        var context = this;
        var archiveName = $(this._id + '-archive-name').value;
        var params = {
            url: this._getHandlerUrl('destinationDir=' + this._destinationDir),
            skipConfirmation: true
        };
        params.submitHandler = function(url, parameters) {
            parameters.set('archiveName', archiveName);
            new Ajax.Request(
                context._getHandlerUrl(),
                {
                    method: 'post',
                    parameters: parameters,
                    onCreate: context._onOkHandlerCreate.bind(context),
                    onSuccess: (function(transport) {
                        context._onOkHandlerSuccess(transport, archiveName);
                    }).bind(context),
                    onException: context._onOkHandlerException.bind(context),
                    onComplete: context._onOkHandlerComplete.bind(context)
                }
            );
        };
        Jsw.getComponent('fm-content').execGroupOperation(params);
    },

    _onOkHandlerSuccess: function(transport, archiveName) {
        this._clearMessages();
        try {
            var response = transport.responseText.evalJSON();
            if ('success' == response.status) {
                Jsw.getComponent('fm-content').reload();
                var message = response.message.replace('%%archive%%', archiveName.escapeHTML() + '.zip');

                Jsw.addStatusMessage('info', message);

                this.hide();
            } else {
                this._addErrorMessage(response.message);
            }
        } catch (e) {
            this._addErrorMessage(e.message);
            this._addErrorMessage(
                'Internal error: ' + transport.responseText
            );
        }
    }

});

Smb.FileManager.ViewSettings = Class.create(Smb.FileManager.PopupForm, {

    _initConfiguration: function($super, config) {
        $super(config);

        this._settings = this._getConfigParam('settings', {});
    },

    render: function($super) {
        $super();

        var content = '' +
            '<form method="post" action="" enctype="application/x-www-form-urlencoded" id="' + this._id + '-form">';

        if (this._settings.folderTree) {
            content += '' +
                    '<div class="form-row">' +
                        '<div class="single-row">' +
                            '<div class="indent-box">' +
                                '<input type="checkbox" class="checkbox" value="1" ' +
                                    'id="' + this._id + '-folder-tree"/>' +
                                '<div class="indent-box-content">' +
                                    '<label for="' + this._id + '-folder-tree">' +
                                        this.lmsg('folderTree') +
                                    '</label>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        }

        if (this._settings.previewPanel) {
            content += '' +
                    '<div class="form-row">' +
                        '<div class="single-row">' +
                            '<div class="indent-box">' +
                                '<input type="checkbox" class="checkbox" value="1" ' +
                                    'id="' + this._id + '-preview-panel"/>' +
                                '<div class="indent-box-content">' +
                                    '<label for="' + this._id + '-preview-panel">' +
                                        this.lmsg('previewPanel') +
                                    '</label>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        }

        if (this._settings.advanced) {
            content += '' +
                '<div id="' + this._id + '-advanced" class="form-box b-collapsible">' +
                    '<div id="' + this._id + '-advanced-content-area">';
        }

        if (this._settings.systemFiles) {
            content += '' +
                        '<div class="form-row">' +
                            '<div class="single-row">' +
                                '<div class="indent-box">' +
                                    '<input type="checkbox" class="checkbox" value="1" ' +
                                        'id="' + this._id + '-system-files"/>' +
                                    '<div class="indent-box-content">' +
                                        '<label for="' + this._id + '-system-files">' +
                                            this.lmsg('systemFiles') +
                                        '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
        }

        if (this._settings.permissions) {
            content += '' +
                        '<div class="form-row">' +
                            '<div class="single-row">' +
                                '<div class="indent-box">' +
                                    '<input type="checkbox" class="checkbox" value="1" ' +
                                        'id="' + this._id + '-permissions"/>' +
                                    '<div class="indent-box-content">' +
                                        '<label for="' + this._id + '-permissions">' +
                                            this.lmsg('permissions') +
                                        '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
        }

        if (this._settings.userAndGroup) {
            content += '' +
                        '<div class="form-row">' +
                            '<div class="single-row">' +
                                '<div class="indent-box">' +
                                    '<input type="checkbox" class="checkbox" value="1" ' +
                                        'id="' + this._id + '-user-group"/>' +
                                    '<div class="indent-box-content">' +
                                        '<label for="' + this._id + '-user-group">' +
                                            this.lmsg('userAndGroup') +
                                        '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
        }

        if (this._settings.advanced) {
        content += '' +
                    '</div>' +
                '</div>';
        }

        content += '' +
            '</form>';

        $(this._contentAreaId).insert(content);

        if (this._settings.advanced) {
            new Jsw.Panel({
                title: this.lmsg('showAdvanced'),
                hideContentTitle: this.lmsg('hideAdvanced'),
                applyTo: this._id + '-advanced',
                collapsed: true
            });
        }

        this._initOnSubmitEvent();

        this.addRightButton(this.lmsg('buttonOk'), this._onSubmit, true, true);
        this.addRightButton(this.lmsg('buttonCancel'), this.hide, false, false);

        this.reset();
    },

    reset: function($super) {
        this.setHint(this.lmsg('hint'));

        if (this._settings.folderTree) {
            $(this._id + '-folder-tree').checked = !Jsw.Cookie.get('fm-hidden-tree');
        }

        if (this._settings.systemFiles) {
            $(this._id + '-system-files').checked = !Jsw.Cookie.get('fm-hidden-system-files');
        }

        if (this._settings.permissions) {
            $(this._id + '-permissions').checked = !Jsw.Cookie.get('fm-hidden-permissions-column');
        }

        if (this._settings.userAndGroup) {
            $(this._id + '-user-group').checked = !Jsw.Cookie.get('fm-hidden-user-column');
            $(this._id + '-user-group').checked = !Jsw.Cookie.get('fm-hidden-group-column');
        }

        this._clearMessages();

        $super();
    },

    _onSubmit: function() {

        if (this._settings.folderTree) {
            if ($(this._id + '-folder-tree').checked) {
                Jsw.getComponent('fm-content').showTree();
                Jsw.Cookie.remove('fm-hidden-tree');
            } else {
                Jsw.getComponent('fm-content').hideTree();
                Jsw.Cookie.set('fm-hidden-tree', true);
            }
        }

        if (this._settings.systemFiles) {
            this._updateColumnState($(this._id + '-system-files'), 'fm-hidden-system-files');
            Jsw.getComponent('fm-tree').reload();
        }

        if (this._settings.permissions) {
            this._updateColumnState($(this._id + '-permissions'), 'fm-hidden-permissions-column');
        }

        if (this._settings.userAndGroup) {
            this._updateColumnState($(this._id + '-user-group'), 'fm-hidden-user-column');
            this._updateColumnState($(this._id + '-user-group'), 'fm-hidden-group-column');
        }

        Jsw.getComponent('fm-content').reload();
        this.hide();
    },

    _updateColumnState: function(checkbox, stateCookie) {
        var state = checkbox.checked;
        if (state) {
            Jsw.Cookie.remove(stateCookie);
        } else {
            Jsw.Cookie.set(stateCookie, true);
        }
    }

});

Smb.FileManager.FileNamePopupForm = Class.create(Jsw.PopupForm, {
    _initConfiguration: function($super, config) {
        $super(config);
        this._handler = this._getConfigParam('handler', null);
    },

    render: function($super) {
        $super();

        this.setBoxType('form-box');
        this.setTitle(this.lmsg('popupTitle'));

        $(this._contentAreaId).update(
            this.lmsg('popupFilename') + ' <input type="text" id="saveAsFileNamePopup"/>'
        );

        this.addOkButton();
        this.addCancelButton();

    },

    addOkButton: function() {
        this.addRightButton(this.lmsg('buttonOk'), this._onOkClick, true, true);
    },

    addCancelButton: function() {
        this.addRightButton(this.lmsg('buttonCancel'), this._onCancelClick, false, false);
    },

    _onOkClick: function() {
        this._handler($('saveAsFileNamePopup').value);
        this.hide();
    },

    _onCancelClick: function() {
        this.hide();
    }
});
