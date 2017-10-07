var showSuccessFlag = function(message) {
    require(['aui/flag'], function(flag) {
        var myFlag = flag({
            type: 'success',
            title: 'Kitchen Duty Plugin',
            close: 'auto',
            body: message
        });
    });
};

var initIssueSearch = function() {
    var templateIssueSearch = JIRA.Templates.JPEXT.issueSearch();
    var currentProjectKey = JIRA.API.Projects.getCurrentProjectKey();

    var auiUserSelectOptions = {
        ajax: {
            url: function () {
                return JPEXT.restUrl + '/issue/' + currentProjectKey + '/search';
            },
            dataType: 'json',
            delay: 250,
            data: function (searchTerm) {
                return {
                    query: searchTerm
                };
            },
            results: function (data) {
                return {
                    results: data
                };
            },
            cache: true
        },
        minimumInputLength: 1,
        tags: true
    };

    /* INIT TEMPLATES AND WIDGETS */

    AJS.$('#jpext-issue-select-container').append(templateIssueSearch);
    AJS.$('#jpext-issue-select').auiSelect2(auiUserSelectOptions);
    AJS.$('#jpext-issue-select').on("select2-selecting", function(e) {
        // what you would like to happen
        console.log(e.object);
    });
    AJS.$('#jpext-issue-select-form').submit(function (e) {
        e.preventDefault();
        AJS.$(AJS.$('#jpext-issue-select').select2('data')).each(function () {
            showSuccessFlag(this.id);
        });
    });
    AJS.InlineDialog(
        AJS.$("#issue-search-info"),
        "infoDialog",
        function(contents, trigger, showPopup) {
            contents.css({"padding":"20px", "width": "200px"}).html('This is a search form info message..');
            showPopup();
            return false;
        },
        {
            gravity: 'w'
        });
};

AJS.toInit(function(){
    AJS.log('JPEXT: Project Panel initializing ...');
    JPEXT.baseUrl = AJS.params.baseURL;
    JPEXT.restUrl = JPEXT.baseUrl + '/rest/jpext/1.0';

    initIssueSearch();
    JPEXT.sseListener = new SSEListener();
});
