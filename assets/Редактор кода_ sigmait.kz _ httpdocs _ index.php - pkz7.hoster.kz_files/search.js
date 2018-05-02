// Copyright 1999-2017. Parallels IP Holdings GmbH. All Rights Reserved.
Jsw.onReady(function() {

    var searchActionDelay = 200;
    var timer;
    var enterPressed = false;

    function lmsg(localeKey) {
        return searchBarParams.locale[localeKey].escapeHTML();
    }

    function fatalError(message) {
        alert(message);
    }

    function onPasteHandler() {
        scheduleSearch();
    }

    function onKeyUpHandler(event) {
        if ([Jsw.keyCode.UP_ARROW,  Jsw.keyCode.DOWN_ARROW, Jsw.keyCode.LEFT_ARROW, Jsw.keyCode.RIGHT_ARROW, Jsw.keyCode.ENTER].indexOf(event.keyCode) != -1) {
            return;
        }

        scheduleSearch();
    }

    function onKeyDownHandler(event) {
        if ([Jsw.keyCode.UP_ARROW,  Jsw.keyCode.DOWN_ARROW].indexOf(event.keyCode) != -1) {
            onArrowKeyPressed(event.keyCode);
        }

        enterPressed = (Jsw.keyCode.ENTER == event.keyCode);
        if (enterPressed) {
            scheduleSearch();
        }
    }

    function onFocusHandler(event) {
        var field = event.target;
        field.value = '';
        field.removeClassName('search-empty');
    }

    function onBlurHandler(event) {
        // workaround for Google Chrome
        setTimeout(function() {
            showSearchFieldStub();
            setTimeout(resetSearch, 300);
        }, 0);
    }

    function showSearchFieldStub() {
        var field = $('searchTerm');
        field.value = '';
        field.blur();
    }

    function scheduleSearch() {
        var iconState = $('searchTerm').next();
        iconState.removeClassName('icon-search');
        iconState.addClassName('icon-indicator');

        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(findTerm, searchActionDelay);
    }

    function onSearchSuccess(request) {
        if ($('searchTerm').value != request.request.options.parameters.term) {
            return;
        }

        try {
            var response = request.responseText.evalJSON();
        } catch (e) {
            fatalError('Failed to parse JSON response: ' + e.message);
            return;
        }

        if ('error' == response.status) {
            var result = '';
            response.statusMessages.each(function(message) {
                result += message.title + ': ' + message.content + "\n";
            });
            fatalError(result);
            return;
        }

        if (enterPressed) {
            goToSelectedItem(response);
        } else {
            showResults(response);
        }
    }

    function onSearchFailure(request) {
        fatalError('Search request failed due to following error: ' + request.responseText);
    }

    function onSearchComplete(request) {
        var iconState = $('searchTerm').next();
        iconState.removeClassName('icon-indicator');
        iconState.addClassName('icon-search');
    }

    function goToSelectedItem(results) {
        var resultsBlock = getResultsBlock();
        var activeRow = resultsBlock.down('li.active');

        if (!activeRow) {
            activeRow = resultsBlock.down('li');
        }

        var linkHref = activeRow.down('a') ? activeRow.down('a').href : results.records.first().link;
        var linkTarget = activeRow.down('a') ? activeRow.down('a').target : results.records.first().target;

        Jsw.redirect(linkHref, null, linkTarget);
    }

    function showResults(results) {
        var resultsBlock = getResultsBlock();

        var resultsHtml = '';

        if (0 == results.records.size()) {
            resultsHtml += '<li><div class="search-results-note">' + lmsg('nothingFound') + '</div></li>';
        } else {
            results.records.each(function(item) {
                var itemDetails = ('undefined' != typeof item.details) ? item.details.escapeHTML() : '';
                var linkTarget = '';
                if (item.target) {
                    linkTarget = 'target="' + item.target + '"';
                }
                var iconUrl = '';

                if ('undefined' != typeof item.icon) {
                    var iconUrl = (0 == item.icon.indexOf(searchBarParams.skinUrl))
                        ? item.icon
                        : searchBarParams.skinUrl + item.icon;
                }

                resultsHtml +=
                    '<li>'
                        + '<a href="' + item.link.escapeHTML() + '" title="' + itemDetails + '" ' + linkTarget + '>'
                            + (iconUrl ? '<i class="icon-" style="background-image: url(' + iconUrl + ')"></i>' : '')
                            + item.title.escapeHTML()
                        + '</a>'
                    + '</li>';
            });

            if (results.meta.moreResultsFound) {
                resultsHtml +=
                    '<li><div class="search-results-note">'
                    + lmsg('moreResultsFound')
                    + '</div></li>';
            }
        }

        resultsBlock.update(resultsHtml);

        var links = resultsBlock.select('a');
        links.each(function(link) {
            link.observe('mouseover', onItemMouseOver.bind(link, resultsBlock));
            link.observe('mouseout', onItemMouseOut);
        });
        if (0 != links.size()) {
            links.first().up('li').addClassName('active');
        }

        resultsBlock.up('.dropdown').addClassName('open');
    }

    function onItemMouseOver(resultsBlock) {
        var oldActiveLink = resultsBlock.select('li.active')[0];

        if (oldActiveLink) {
            oldActiveLink.removeClassName('active');
        }

        this.up('li').addClassName('active');
    }

    function onItemMouseOut() {
        this.up('li').removeClassName('active');
    }

    function getResultsBlock() {
        return $('searchResultsBlock');
    }

    function resetSearch() {
        if (timer) {
            clearTimeout(timer);
        }

        $('searchResultsBlock').up('.dropdown').removeClassName('open');

        onSearchComplete();
    }

    function onArrowKeyPressed(keyCode) {
        var resultsBlock = getResultsBlock();

        if (0 == resultsBlock.select('a').length) {
            return;
        }

        var activeRow = resultsBlock.down('li.active');

        if (!activeRow) {
            resultsBlock.down('li').addClassName('active');
            return;
        }

        if (Jsw.keyCode.DOWN_ARROW == keyCode) {
            var nextRow = activeRow.next();

            if (nextRow && nextRow.down('a')) {
                activeRow.removeClassName('active');
                nextRow.addClassName('active');
            }
        }

        if (Jsw.keyCode.UP_ARROW == keyCode) {
            var prevRow = activeRow.previous();

            if (prevRow && prevRow.down('a')) {
                activeRow.removeClassName('active');
                prevRow.addClassName('active');
            }
        }
    }

    function findTerm() {
        var term = $('searchTerm').value;

        if ('' == term) {
            resetSearch();
            return;
        }

        new Ajax.Request(
            searchBarParams.actionUrl,
            {
                method: 'get',
                parameters: { 'term': term },
                onSuccess: onSearchSuccess.bind(this),
                onFailure: onSearchFailure.bind(this),
                onComplete: onSearchComplete.bind(this)
            }
        );
    }

    $('searchTerm').observe('paste', onPasteHandler);
    $('searchTerm').observe('keyup', onKeyUpHandler);
    $('searchTerm').observe('keydown', onKeyDownHandler);
    $('searchTerm').observe('focus', onFocusHandler);
    $('searchTerm').observe('blur', onBlurHandler);
});
