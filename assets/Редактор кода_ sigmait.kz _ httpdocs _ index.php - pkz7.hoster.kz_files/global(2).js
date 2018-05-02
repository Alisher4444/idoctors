// Copyright 1999-2016. Parallels IP Holdings GmbH. All Rights Reserved.
Jsw.onReady(function () {
    var settingsField = $('additionalNginx-additionalNginxSettings');
    if (null == settingsField) {
        return;
    }

    $$("head").first().insert(
        new Element("script", {type: "text/javascript", src: "/modules/htaccess-to-nginx/rewrite-conf.js"})
    );

    var htaccessField = new Element('textarea', {
        'class': 'f-max-size code js-auto-resize',
        'name': 'htaccess',
        'id': 'htaccess',
        'rows': 6,
        'cols': 80
    });

    var convertBtn = new Element('span', {'class': 'btn action'}).insert(
        new Element('button').update('Convert to nginx')
    );
    convertBtn.observe('click', function(event) {
        Event.stop(event);
        var htaccess = htaccessField.getValue();
        var nginx = RewriteConf.convert(htaccess);
        settingsField.setValue(nginx);
    });

    var htaccessRow = new Element('div', {'class': 'form-row'}).insert(
        new Element('div', {'class': 'field-name'}).insert(
            new Element('label', {'for': 'htaccess'}).insert('.htaccess content&nbsp;')
        )
    ).insert(
        new Element('div', {'class': 'field-value'}).insert(htaccessField)
            .insert(new Element('p', {'class': 'hint'}).update('Attention: .htaccess converter is an experimental feature. Always check conversion results for possible issues.'))
            .insert(convertBtn)
    );

    var settingsRow = settingsField.up('.form-row');

    var toggleLink = new Element("a", {'href': '#', 'class': "toggler"});
    toggleLink.setStyle({'float': 'right'});
    var showLink = toggleLink.clone().update('Show .htaccess converter');
    var hideLink = toggleLink.clone().update('Hide .htaccess converter');

    var toggleFunc = function(event, show) {
        event && event.preventDefault();
        showLink.toggle(!show);
        hideLink.toggle(show);
        htaccessRow.toggle(show);
    };
    showLink.observe('click', function(event) { toggleFunc(event, true); });
    settingsRow.insert({before: showLink});
    hideLink.observe('click', function(event) { toggleFunc(event, false); });
    settingsRow.insert({before: hideLink});
    settingsRow.insert({before: new Element('div', {'class': 'clearfix'})});
    settingsRow.insert({before: htaccessRow});
    toggleFunc(null, false);
});
