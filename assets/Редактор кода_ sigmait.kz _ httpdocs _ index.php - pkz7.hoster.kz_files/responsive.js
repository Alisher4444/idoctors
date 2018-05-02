// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
/* responsive.js */

Jsw.onReady( function() {
    //http://v4.thewatchmakerproject.com/blog/how-to-fix-the-broken-ipad-form-label-click-issue/
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i)) {
        $$('label[for]').each(function(label) {
            label.observe('click', function() {
                var el = $(this).readAttribute('for');
                var type = $(el).readAttribute('type');
                if ('radio' == type || 'checkbox' == type) {
                    $(el).writeAttribute('selected', !$(el).readAttribute('selected'));
                } else {
                    $(el).focus();
                }
            });
        });
    }
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].
            appendChild(msViewportStyle);
    }

});