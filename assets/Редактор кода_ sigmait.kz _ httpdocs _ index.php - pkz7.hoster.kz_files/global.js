// Copyright 1999-2018. Plesk International GmbH. All rights reserved.

(function () {
    var extensionName = 'Letsencrypt';

    Jsw.namespace('PleskExt.' + extensionName);

    var extensionExports = PleskExt[extensionName];
    extensionExports.toggleCollapsibleDetails = toggleCollapsibleDetails;

    function toggleCollapsibleDetails(togglerElement) {
        var detailsContentId = togglerElement.getAttribute('data-details-content-id');
        var detailsContent = detailsContentId && $(detailsContentId);
        if (detailsContent) {
            detailsContent.toggle();
            togglerElement.toggleClassName('plesk-ext-letsencrypt--details-toggler-expanded', detailsContent.visible());
        }
    }
})();
