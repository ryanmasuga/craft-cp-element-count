$(document).ready(function () {
    var href = location.href;
    var urlInEntries = href.match(/\/entries/);
    var urlInCategories = href.match(/\/categories/);
    var urlInUsers = href.match(/\/users/);
    var urlInAssets = href.match(/\/assets/);

    var hasSections = $('#main-content.has-sidebar .sidebar li a[data-key]').filter(function () {
        return $(this).data('key').match(/section:\d+/);
    }).length > 0;

    var hasGroups = $('#main-content.has-sidebar .sidebar li a[data-key]').filter(function () {
        return $(this).data('key').match(/group:\d+/);
    }).length > 0;

    var hasFolders = $('#main-content.has-sidebar .sidebar li a[data-key]').filter(function () {
        return $(this).data('key').match(/folder:\d+/);
    }).length > 0;

    if (hasSections) {
        getEntriesCount();
    }

    if (urlInCategories && hasGroups) {
        getCategoriesCount();
    }

    if (urlInUsers && hasGroups) {
        getUsersCount();
    }

    if (urlInAssets && hasFolders) {
        getAssetsCount();
    }

    function getEntriesCount() {
        var slugs = getSectionSlugs();

        Craft.postActionRequest('cp-element-count/count/get-entries-count', {slugs: slugs},
            function (result) {
                $.each(slugs, function (i, val) {
                    if (typeof result[val] !== 'undefined') {
                        var $anchor = $('#main-content.has-sidebar .sidebar li a[data-handle="' + val + '"]');
                        if ($anchor.length > 0) {
                            $anchor.append('<span class="cpelementcount-pill">' + result[val] + '</span>')
                        }
                    }
                });

                if (typeof result['*'] !== 'undefined') {
                    var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="*"]');

                    if ($anchor.length > 0) {
                        $anchor.append('<span class="cpelementcount-pill">' + result['*'] + '</span>')
                    }
                }
            }
        );
    }

    function getCategoriesCount() {
        var ids = getGroupIds();

        Craft.postActionRequest('cp-element-count/count/get-categories-count', {ids: ids},
            function (result) {
                $.each(ids, function (i, val) {
                    if (typeof result[val] !== 'undefined') {
                        var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="group:' + val + '"]');

                        if ($anchor.length > 0) {
                            $anchor.append('<span class="cpelementcount-pill">' + result[val] + '</span>')
                        }
                    }
                });
            }
        );
    }

    function getUsersCount() {
        var ids = getGroupIds();

        Craft.postActionRequest('cp-element-count/count/get-users-count', {ids: ids},
            function (result) {
                $.each(ids, function (i, val) {
                    if (typeof result[val] !== 'undefined') {
                        var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="group:' + val + '"]');

                        if ($anchor.length > 0) {
                            $anchor.append('<span class="cpelementcount-pill">' + result[val] + '</span>')
                        }
                    }
                });

                var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="*"]');
                if ($anchor.length > 0) {
                    $anchor.append('<span class="cpelementcount-pill">' + result['*'] + '</span>')
                }

                var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="admins"]');
                if ($anchor.length > 0) {
                    $anchor.append('<span class="cpelementcount-pill">' + result['admins'] + '</span>')
                }

            }
        );
    }
    
    function getAssetsCount() {
        var folders = getFolders();
        
        Craft.postActionRequest('cp-element-count/count/get-assets-count', {folders: folders},
            function (result) {
                $.each(folders, function (i, val) {
                    if (typeof result[val] !== 'undefined') {
                        var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="folder:' + val.split('|').join('/folder:') + '"]');

                        if ($anchor.length > 0) {
                            $anchor.append('<span class="cpelementcount-pill">' + result[val] + '</span>')
                        }
                    }
                });

                var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="*"]');
                if ($anchor.length > 0) {
                    $anchor.append('<span class="cpelementcount-pill">' + result['*'] + '</span>')
                }

                var $anchor = $('#main-content.has-sidebar .sidebar li a[data-key="admins"]');
                if ($anchor.length > 0) {
                    $anchor.append('<span class="cpelementcount-pill">' + result['admins'] + '</span>')
                }

            }
        );
    }

    function getSectionSlugs() {
        var slugs = [];

        $('#main-content.has-sidebar .sidebar li a[data-key]').each(function () {
            if ($(this).data('key').match(/section:\d+/)) {
                slugs.push($(this).data('handle'));
            }
        });

        return slugs;
    }

    function getGroupIds() {
        var ids = [];

        $('#main-content.has-sidebar .sidebar li a[data-key]').each(function () {
            if ($(this).data('key').match(/group:\d+/)) {
                ids.push($(this).data('key').replace('group:', ''));
            }
        });

        return ids;
    }

    function getFolders() {
        var folders = [];

        $('#main-content.has-sidebar .sidebar li a[data-key]').each(function () {
            if ($(this).data('key').match(/folder:\d+/)) {
                var folderKeys = $(this).data('key').split('/');
                folders.push(folderKeys.join('|').replace(/folder:/g, ''));
            }
        });

        return folders;
    }


});
