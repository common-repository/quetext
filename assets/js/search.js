var accessToken = false;
jQuery(document).ready(function() {
    accessToken = localStorage.getItem('qt_token');
    if (accessToken) {
        jQuery('#section-feature-box').show();
        jQuery('#section-login-box').hide();
        jQuery('#section-user-info-box').show();
    } else {
        jQuery('#section-feature-box').hide();
        jQuery('#section-login-box').show();
        jQuery('#section-user-info-box').hide();
    }
});

var data;

jQuery("#quetextSearch").click(function () {
    jQuery("#download-plagiarism-report").hide();
    jQuery('.plag-check-error').addClass('hidden');
    jQuery('.plag-check-error-msg').html('');

    //if (jQuery('#pc_checker').prop('checked')) {

        // var contentHTML = jQuery("#postdivrich #wp-content-wrap #wp-content-editor-container textarea").text();

        var nonTinyMceContent = null;
        var contentHTML = null;

        if (!parent.tinyMCE.activeEditor) {
            alert('This plugin requires TinyMCE editor to work');
            return false;
        }

        contentHTML = parent.tinyMCE.activeEditor.getContent();
        contentHTML = strip_html_tags(contentHTML);

        //var contentHTML = parent.tinyMCE.activeEditor.getContent();
        jQuery('#doc-textarea').html(contentHTML);

        var title = jQuery("#title").val();
        // var api_key = jQuery('#access_key').val();
        var newapiurl = jQuery('#api_url').val();
        accessToken = localStorage.getItem('qt_token');
        const text = strip_html_tags(contentHTML);
        if (!text || text.length < 1) {
            alert('Please provide some text to check for plagiarism');
            return false;
        }

        jQuery("#quetextSearch").prop('disabled', true);
        jQuery("#quetextSearch").html('Checking...');

        var values = {
            "api_key": accessToken,
            "title": title,
            "text": text
        };

    jQuery.ajax({
            url: newapiurl + "wordpress/check-status",
            type: "post",
            data: values,
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            dataType: 'JSON',
            success: function (response) {
                if (response.error) {
                    alert(response.error);
                    jQuery("#quetextSearch").html('Check Plagiarism').prop('disabled', false);
                } else {
                    var reportId = response.id;
                    jQuery("#doc").val(reportId);
                    var doc = new Doc(); // get report status
                }
            },
            error: function (request, status, error) {
                jQuery("#quetextSearch").html('Check Plagiarism').prop('disabled', false);
                const err = JSON.parse(request.responseText)
                if (!!err.error) {
                    jQuery('.plag-check-error').removeClass('hidden');
                    jQuery('.plag-check-error-msg').html(err.error);
                }
                console.log(error);
            }
        });
    //}
});

jQuery(document).on('blur', '.qt-email', function() {
    let emailValue = jQuery(this).val();
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailValue === '' || !emailRegex.test(emailValue)) {
        jQuery(this).addClass('is-invalid');
    } else {
        jQuery(this).removeClass('is-invalid');
    }
});

jQuery(document).on('click', '#quetextUserLogout', function(e) {
    e.preventDefault();
    jQuery("#quetextUserLogout").html('Logging out...');

    localStorage.setItem('qt_token', '');
    localStorage.setItem('qt_name', '');
    localStorage.setItem('qt_lname', '');
    localStorage.setItem('qt_email', '');
    localStorage.setItem('qt_occupation', '');
    jQuery("#quetextUserLogout").hide();
    jQuery("#quetextUserLogout").html('Logout');
    jQuery('#access_token').val('');
    jQuery('#access_key').val('');
    window.location.reload();
});

jQuery(document).on('click', '#quetextUserLogin', function() {

    const callSource = jQuery('#quetextUserLogin').attr('data-callSrc');

    if (jQuery('.qt-email').hasClass('is-invalid')) {
        jQuery('.qt-error').show();
        return false;
    }

    jQuery('.qt-error').hide();

    const email = jQuery('.qt-email').val().trim();
    const password = jQuery('.qt-pwd').val().trim();
    const generalError = jQuery('.qt-gen-err');

    jQuery("#quetextUserLogin").prop('disabled', true);
    jQuery("#quetextUserLogin").html('Logging in...');

    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        async: true,
        data: {
            action: 'qtpc_attempt_user_login',
            email,
            password,
        },
        success: function(response) {
            try {
                const data = JSON.parse(JSON.parse(response));
                if (!!data.status === true) {
                    jQuery('#section-feature-box').show();
                    jQuery('#section-login-box').hide();
                    jQuery('#access_token').val(data.accessToken);
                    jQuery('#access_key').val(data.accessToken);

                    localStorage.setItem('qt_token', data.accessToken);
                    localStorage.setItem('qt_name', data?.data?.account?.name);
                    localStorage.setItem('qt_lname', data?.data?.account?.last_name);
                    localStorage.setItem('qt_email', data?.data?.account?.email);
                    localStorage.setItem('qt_plan', data?.data?.plan?.name);
                    if (callSource === 'admin') {
                        window.location.reload();
                    }
                } else {
                    // Error!
                    const errorMessage = data.message ? data.message : 'An error occurred while trying to login';
                    generalError.show();
                    generalError.html(errorMessage);
                    jQuery("#quetextUserLogin").prop('disabled', false);
                    jQuery("#quetextUserLogin").html('Login');
                }
            } catch (e) {
                jQuery("#quetextUserLogin").prop('disabled', false);
                jQuery("#quetextUserLogin").html('Login');
                generalError.show();
                generalError.html('An error occurred while trying to login. Please try later');
            }
        },
        error: function(err) {
            generalError.show();
            generalError.html(err);
        }
    });
});

function strip_html_tags(str) {
    if ((str === null) || (str === '')) {
        return '';
    } else {
        str = str.toString();
    }

    str = str.replace(/<p>/g, '');
    str = str.replace(/<\/p>/g, '');
    str = str.replace(/&lt;br&gt;/g, ''); // Fix the replacement for <br>
    str = str.replace(/(?:\r\n|\r|\n)/g, ' '); // Replace newlines with spaces
    str = str.replace(/[\t ]+\</g, "<");
    str = str.replace(/\>[\t ]+\</g, "");
    str = str.replace(/\>[\t ]+$/g, ">");
    str = str.replace(/<[^>]*>/g, ' ');
    str = str.replace(/\s\s+/g, ' ');
    str = str.replace(/&nbsp;/g, '');

    return str.trim();
}

function Doc() {
    //jQuery('#quetext-section').show();
    jQuery('#report-container').show();
    var self = this;
    self.doc = jQuery("#doc");
    self.data = null;
    self.docId = self.doc.val();
    self.docTextarea = jQuery("#doc-textarea");
    self.docDetails = jQuery("#doc-details");
    self.docResults = jQuery("#doc-results");
    self.resultsTitle = jQuery("#results-title");
    self.percentComplete = jQuery("#doc-percent-complete");
    self.percentProgress = jQuery("#percent-progress");
    //self.accessKey = jQuery('#access_key');
    self.accessKey = localStorage.getItem('qt_token');
    self.apiUrl = jQuery('#api_url').val();
    self.docTextLoaded = false;
    self.inputTextReady = false;
    self.apiGetResults = self.apiUrl + "wordpress/report/" + self.docId;
    //data.uniqueSources = [];
    self.renderComponents();
}

var getColor = function (percentage) {
    var color = {
        red: "#f11313",
        orange: "#ff9800",
        yellow: "#ffcc0f",
        blue: "#0093dd",
        grey: "#bbbbbb"
    }

    if (percentage >= 90) {
        return color.red;
    }
    else if (percentage >= 80) {
        return color.orange;
    }
    else {
        return color.yellow;
    }
}

Doc.prototype.escapeTags = function (string) {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

Doc.prototype.escapeScriptTags = function (string) {
    return string.replace(/<script>/gi, "&lt;script&gt;");
}


Doc.prototype.updateProgress = function (progress, fast) {
    var self = this;
    var fast = fast || false;
    var progressPercentage = (progress * 100).toFixed(2);
    var lastPercentage = parseInt(self.percentComplete.data('progress')) || 0;
    var speed = fast ? 5 : 10;

    // store progress in data attribute
    self.percentComplete.data('progress', progressPercentage);
    self.percentProgress.data('progress', progressPercentage);

    if (progress === 1) {
        document.title = "Report";
        self.percentComplete.text("100%");
        self.percentProgress.text("100%");
    }
    else if (progress > 0.01) {
        setTimeout(function () {
            document.title = "(" + parseInt(progressPercentage) + "%) " + " Report";
        }, 1000);
        var animateProgress = setInterval(function functionName() {
            self.percentComplete.text((lastPercentage) + "%");
            self.percentProgress.text((lastPercentage) + "%");
            ++lastPercentage;
            if (lastPercentage >= progressPercentage) {
                clearInterval(animateProgress);
            }
        }, speed);
    }
    else {
        document.title = 'Analyzing...';
        self.percentComplete.text('');
        self.percentProgress.text('');
    }

}

Doc.prototype.loadDocView = function () {
    var self = this;
    // used for file uploads that need conversion, and conversion is not yet complete
    var data = self.data;
    if (data.search_type === 3) {
        return self.loadDocViewV2();
    }
    else {
        var inputText = self.escapeTags(data.input_text);
        self.inputTextReady = inputText ? true : false;
        var title = data.title || 'untitled';
        var html = data.input_text;
        var matches = data.matches;
        var progress = data.progress;
        jQuery("#doc-title").text(title);
        self.percentComplete.removeClass('hidden');
        if (progress < 1) {
            self.updateProgress(progress, false);
            setTimeout(function () {
                jQuery(".loading").fadeIn('fast');
            }, 800);
            if (!self.docTextLoaded) {
                html = "<span id='progress-wrapper' data-status='" + progress + "'>" + self.escapeTags(html) + "</span>";
                self.docTextarea.show();
                self.docTextarea.html(html);
                self.docTextLoaded = self.inputTextReady ? true : false;
            }
            setTimeout(function () { // poll api until document is finished
                self.renderComponents();
            }, 2500);
        }
        else {
            jQuery(".loading").remove();
            // doc is complete and page has just (re)loaded
            if (!self.docTextLoaded) {
                html = "<span id='progress-wrapper' class='doc-finished' data-status='1'>" + self.escapeTags(html) + "</span>";
                self.docTextarea.html(html);
                setTimeout(function () {
                    self.docTextarea.fadeIn('fast');
                }, 300);
                self.docTextLoaded = true;
            }
            else {
                jQuery("#progress-wrapper").addClass('doc-finished').data('status', '1');
            }
            if (matches.length) {
                var replaceStartPos = 0;
                // transition from grey to animate matches
                matches.forEach(function (match, i) {
                    var percent = match.percent_similar;
                    var percentSimilar = percent + "%";
                    var textToHighlight = self.escapeTags(match.input_text_match);
                    var matchId = match.id;
                    var sourceId = match.source.id;
                    var url = match.source.url;
                    var escapedHighlightedText = self.escapeTags(textToHighlight);
                    var matchNum = i + 1;
                    var matchType = percent >= 90 ? "exact-match" : "inexact-match";
                    // insert each match into document text
                    self.docTextarea.html(function (_, html) {
                        var replacementStr = "<span id='" + matchId + "' data-source-url='" + url + "' data-match-num='" + matchNum + "' data-similarity-score='" + percentSimilar + "' title='" + percentSimilar + " match' class='match " + matchType + "' data-source-id='" + sourceId + "'>" + textToHighlight + "</span>";
                        var newStr = inputText.substr(0, replaceStartPos) + inputText.substr(replaceStartPos).replace(textToHighlight, replacementStr);
                        replaceStartPos += Math.abs(replaceStartPos - inputText.indexOf(textToHighlight, replaceStartPos)) + replacementStr.length - textToHighlight.length;
                        inputText = newStr;
                        return inputText;
                    });
                });
            }
        }
    }

}

Doc.prototype.loadDocViewV2 = function () {
    var self = this;
    // used for file uploads that need conversion, and conversion is not yet complete
    var data = self.data;
    var inputText = data.input_text;
    //var inputText = data.matches[0].input_text_match;
    self.inputTextReady = inputText ? true : false;
    var title = data.title || 'untitled';
    var html = data.input_text;
    var matches = data.matches;
    var progress = data.progress;
    jQuery("#doc-title").text(title);

    self.percentComplete.removeClass('hidden');

    if (progress < 1) {
        self.updateProgress(progress, false);
        setTimeout(function () {
            jQuery(".loading").fadeIn('fast');
        }, 800);

        if (!self.docTextLoaded) {
            html = "<span id='progress-wrapper' data-status='" + progress + "'>" + self.escapeTags(html) + "</span>";
            self.docTextarea.show();
            self.docTextarea.html(html);
            self.docTextLoaded = self.inputTextReady ? true : false;
        }

        setTimeout(function () { // poll api until document is finished
            self.renderComponents();
        }, 2500);
    }
    else {
        jQuery(".loading").remove();

        // doc is complete and page has just (re)loaded
        if (!self.docTextLoaded) {
            html = "<span id='progress-wrapper' class='doc-finished' data-status='1'>" + self.escapeTags(html) + "</span>";
            self.docTextarea.html(html);
            setTimeout(function () {
                self.docTextarea.fadeIn('fast');
            }, 300);
            self.docTextLoaded = true;
        }
        else {
            jQuery("#progress-wrapper").addClass('doc-finished').data('status', '1');
        }

        if (matches.length) {

            var matchesCopy = _.clone(matches);
            var matchStartOffsets = new Set();
            var matchEndOffsets = new Set();

            for (var m = 0; m < matchesCopy.length; ++m) {
                var match = matches[m];
                var startOffset = match.input_text_offset;
                var endOffset = match.input_text_offset + match.input_text_match.length;
                matchStartOffsets.add(startOffset);
                matchEndOffsets.add(endOffset);
            }

            var inputMarkup = [];
            var inputChars = inputText.split('');
            var matchNum = 0;
            for (let c = 0; c < inputChars.length; ++c) {
                let char = inputChars[c];
                if (matchEndOffsets.has(c)) {
                    inputMarkup.push("</span>");
                }
                if (matchStartOffsets.has(c)) {
                    ++matchNum;
                    let match = matchesCopy.shift();
                    let percent = match.percent_similar;
                    let percentSimilar = percent + "%";
                    let matchType = percent >= 90 ? "exact-match" : "inexact-match";
                    inputMarkup.push("<span id='" + match.id + "' data-source-url='" + match.source.url + "' data-match-num='" + matchNum + "' data-similarity-score='" + percentSimilar + "' title='" + percentSimilar + " match' class='match " + matchType + "' data-source-id='" + match.source.id + "'>");
                }
                if (char === '<') {
                    inputMarkup.push('&lt;');
                }
                else if (char === '>') {
                    inputMarkup.push('&gt;');
                }
                else {
                    inputMarkup.push(char);
                }
            }

            inputMarkup = inputMarkup.join('');
            self.docTextarea.html(inputMarkup);
        }
    }
}

Doc.prototype.loadInfoModal = function () {
    var self = this;
    var table = jQuery("#report-info tbody");
    var data = self.data;
    var title = data.title || '(untitled)';
    var titleEscaped = jQuery("<div>").text(title).html();
    // var dateFormatted = moment.unix(data.start_date).format('MMMM D, YYYY');
    table.append("<tr><td>Title:</td><td class='report-title'>" + titleEscaped + "</td></tr>");
    table.append("<tr><td>Score:</td><td>" + data.score + "% similarity</td></tr>");
    table.append("<tr><td>Words:</td><td>" + data.word_count + "</td></tr>");
    table.append("<tr><td>Phrases matched:</td><td>" + data.matches.length + "</td></tr>");
    table.append("<tr><td>Date:</td><td></td></tr>");
    table.append("<tr><td>Report ID:</td><td>" + data.id + "</td></tr>");

}

function animateKnob(score) {

    jQuery("#percent-matches-dial").knob({
        'readOnly': true,
        'width': 45,
        'height': 45,
        'lineCap': 'butt',
        'displayInput': false,
        'bgColor': '#e8e9ec',
        'thickness': 0.15,
        'fgColor': getColor(score)
    });

    if (jQuery("#results-percentage").is(":hidden")) {
        jQuery("#results-percentage").show();
    };

    jQuery("#percent-matches-dial").val(0).animate({
        value: score
    }, {
        duration: 3000,
        easing: 'swing',
        step: function () {
            jQuery('#percent-matches-dial').val(this.value).trigger('change');
        }
    });

    jQuery("#percent-matches").html(score + "%");
}

var uniqueSources = [];
Doc.prototype.loadResultsView = function () {
    var self = this;
    var data = self.data;
    var progress = data.progress;
    var score = data.score;
    //var uniqueSources = [];
    var numMatches = data.matches ? data.matches.length : 0;
    var deleteReport = '<a title="Delete report" class="report-function report-action delete-report" id="delete-report" aria-hidden="true" data-target="modal-delete-report">Delete</a>';

    if (numMatches > 0) {

        const groupBy = (array, key) => {

            // Return the end result
            return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object

                (result[currentValue[key].url] = result[currentValue[key].url] || []).push(
                    currentValue
                );

                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
            }, {}); // empty object is the initial value for result object
        };

        const sourceMatches = groupBy(data.matches, 'source');

        var sourcesGrouped = new Map();
        // calc overall percentage per match
        for (var sourceUrl of Object.keys(sourceMatches)) {
            var matchesArr = sourceMatches[sourceUrl];
            var sourcePercentage = Math.floor((matchesArr.length / data.matches.length) * 100);
            sourcesGrouped.set(sourceUrl, {
                percentage: sourcePercentage,
                matches: matchesArr
            });
        }

        data.matches.sort(function (a, b) {
            return (sourcesGrouped.get(b.source.url)).percentage - (sourcesGrouped.get(a.source.url)).percentage;
        });

        //jQuery("<div class='row'><div class='col-12'><div class='actionBt'><button type='button' class='red hideBT' id='paraFix' data-source-id='' data-match-id='' data-para-text=''><i class='fa fa-pencil' aria-hidden='true'></i> Rephrase</button><div id=' source-actions'><button type='button' class='hidden grey source-action' data-source-url='' id='source-generate-citations'><i class='fa fa-quote-left' aria-hidden='true'></i> Cite Source</button><button type='button' class='hidden grey' data-source-url='' id='exclude-source-url'><i class='fa fa-eye-slash' aria-hidden='true'></i> Exclude</button></div></div></div></div>").appendTo(self.docResults);
        jQuery("<div class='row'><div class='col-12'><div class='actionBt'><div id='source-actions'><button type='button' class='hidden grey' data-source-url='' id='exclude-source-url'><i class='fa fa-eye-slash' aria-hidden='true'></i> Exclude</button></div></div></div></div>").appendTo(self.docResults);

        data.matches.forEach(function (match) {
            var sourceId = match.source.id;
            var sourceTitle = sourceId.indexOf(':') !== -1 ? sourceId.substr(0, sourceId.indexOf(':')) : sourceId;
            var sourceUrl = match.source.url;
            var sourceUrlDisplay = decodeURI(match.source.url);
            sourceUrlDisplay = sourceUrlDisplay.substr(sourceUrlDisplay.indexOf(':') + 3).split('/').join('<span class="spacer"> > </span>');

            // created row for this source already
            if (uniqueSources.indexOf(sourceId) !== -1) {
                jQuery(".source[data-source-id='" + sourceId + "'] .snippets")
                    .append("<div class='snippet' data-match-id='" + match.id + "'>" + "<a class='source-url ellipsis' target='_blank' rel='noreferrer' href='" + sourceUrl + "'><i class='fa fa-external-link'></i>" + sourceUrlDisplay + "</a><div>" + self.escapeTags(match.highlighted_snippet.replace(/<b>/g, '{{b}}').replace(/<\/b>/g, '{{_b}}')).replace(/{{b}}/g, '<b>').replace(/{{_b}}/g, '</b>') + "</div></div>");
            }
            else {
                var sourcePercentageTotal = 100;

                if (sourcePercentageTotal <= 5) {
                    sourcePercentageColor = 'grey';
                }
                else if (sourcePercentageTotal <= 25) {
                    sourcePercentageColor = 'yellow';
                }
                else {
                    sourcePercentageColor = 'red';
                }

                if (sourcePercentageTotal === 0) {
                    sourcePercentageTotal = '< 1';
                }

                uniqueSources.push(sourceId);
                self.docResults.append(
                    "<div class='source' data-source-id='" + sourceId + "'>" +
                    "<div class='row'>" +
                    "<div class='col-12'><span class='source-percentage-total " + sourcePercentageColor + "' data-toggle='tooltip' data-original-title='" + sourcePercentageTotal + "% of your matches are from this source'>" + sourcePercentageTotal + "%</span>" +
                    "<div class='source-title ellipsis'>" + sourceTitle + "</div>" +
                    "<span class='match-similarity-score'></span>" +
                    "</div>" +
                    "<a class='source-url overview ellipsis' data-toggle='tooltip' data-original-title='Open webpage' target='_blank' rel='noreferrer' href='" + sourceUrl + "'>" + sourceUrlDisplay + "</a>" +
                    "</div>" +
                    "<div class='snippets'>" +
                    "<div class='snippet' data-match-id='" + match.id + "'>" + "<a class='source-url ellipsis' target='_blank' rel='noreferrer' href='" + sourceUrl + "'><i class='fa fa-external-link'></i>" + sourceUrlDisplay + "</a><div>" + self.escapeTags(match.highlighted_snippet.replace(/<b>/g, '{{b}}').replace(/<\/b>/g, '{{_b}}')).replace(/{{b}}/g, '<b>').replace(/{{_b}}/g, '</b>') + "</div></div>" +
                    "</div>" +
                    "</div>");
            }
        });

        // show the results info
        if (progress === 1) {

            var scoreColor = getColor(score);
            setTimeout(function () {
                animateKnob(score);
            }, 500);

            jQuery(window).on('focus', function () {
                animateKnob(score);
            })

            var resultsTitleHtml = "<span id='num-source-matches'>" + numMatches + "</span> " + (numMatches === 1 ? "match" : "matches") + " from " + "<span id='num-unique-sources'>" + sourcesGrouped.size + "</span>" + (sourcesGrouped.size === 1 ? " source " : " sources ");

            jQuery('<div class="pull-right" style="display:none">' +
                '<div class="dropdown">' +
                '<a class="btn dropdown-toggle" role="button" id="report-dropdown-menu" data-toggle="dropdown" data-original-title="Menu"><i class="fa fa-bars"></i></a>' +
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<a class="dropdown-item" id="show-report-info"><i class="fa fa-info-circle" aria-hidden="true"></i>Summary</a>' +
                '<a class="dropdown-item" id="show-all-matches" ><i class="fa fa-list-alt" aria-hidden="true"></i>List all matches</a>' +
                '<a class="dropdown-item" id="download-pdf" data-report-id="' + self.docId + '"><i class="fa fa-file-pdf-o" aria-hidden="true"></i>Download PDF</a>' +

                '<a class="dropdown-item report-action-v2 share-report" id="share-report" data-report-id="' + self.docId + '"><i class="fa fa-share-alt" aria-hidden="true"></i>Share</a>' +

                // '<a class="dropdown-item" id="email-report" data-target="modal-email-report" data-report-id="' + self.docId + '"><i class="fa fa-envelope-o" aria-hidden="true"></i>Email report</a>' +

                '<a class="dropdown-item report-action delete-report" id="delete-report" data-target="modal-delete-report"><i class="fa fa-trash" aria-hidden="true"></i>Delete report</a>' +
                '</div></div></div>').appendTo("#results-title");

            jQuery('#report-dropdown-menu').tooltip({
                placement: 'left',
                trigger: 'hover'
            });
            jQuery('.source-percentage-total').tooltip({
                placement: 'right',
                trigger: 'hover'
            });
            self.resultsTitle.show();
            jQuery("#num-sources-count").html(resultsTitleHtml);
        }
    }
    // no results
    else if (progress === 1) {
        var checkmarkSvg = '<svg class="animated-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>';
        var noResultsHtml = "<div id='no-results'><div><div>" + checkmarkSvg + "</div><div style='margin: 20px auto 8px'>No plagiarism found</div><div>" + deleteReport + "</div></div>";
        setTimeout(function () {
            self.resultsTitle.replaceWith(noResultsHtml).show();
        }, 800);
    }

    jQuery(document).on('click', '.report-action#delete-report', function () {
        jQuery('.modal#modal-delete-report').modal({
            keyboard: true,
            backdrop: true
        }); // confirm via modal prompt
    });

}

Doc.prototype.renderComponents = function () {
    var self = this;
    accessToken = localStorage.getItem('qt_token');
    jQuery.ajax({
        url: self.apiGetResults,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        },
        success: function (reportData) {
            //$.get(self.apiGetResults).done(function (reportData) {
            if (!reportData) {
                alert("Please check your quota limit.");
            } else {
                if (reportData.force_refresh) {
                    location.reload();
                }
                try {
                    if ('word_count' in reportData && reportData.word_count > 0) {
                        showWordCount(reportData.word_count)
                    }
                } catch (error) {
                }

                self.data = reportData;
                data = reportData;

                if (data.progress === 1) {
                    self.updateProgress(1, true);
                    self.loadInfoModal();
                    self.selectedMatch = 0;
                    if (self.ensureLoaderFinishes) {
                        setTimeout(function () {
                            self.loadDocView();
                            self.loadResultsView();
                            self.doc_loaded();
                            jQuery(document).trigger('doc_loaded');
                        }, 1000);
                    } else {
                        self.loadDocView();
                        self.loadResultsView();
                        self.doc_loaded();
                        jQuery(document).trigger('doc_loaded');
                    }
                } else {
                    self.ensureLoaderFinishes = true;
                    self.loadDocView();
                    self.loadResultsView();
                }
            }
        },
        error: function (xhr, status, errorMsg) {
            alert("An error occurred while trying to generate report");
            jQuery('#quetextSearch').removeClass('disabled');
        }
    });
}

function highlightText(element) {
    var doc = document,
        text = doc.getElementById(element),
        range, selection;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    }
    else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function validDateFormat(dateStr) {
    // must adhere to format: MM/DD/YYYY
    // count occurances of /
    if (!dateStr || dateStr.length < 8 || dateStr.length > 10) {
        return false;
    }
    if ((dateStr.match(/\//g) || []).length !== 2) {
        return false;
    }
    var pieces = dateStr.split('/');
    if (pieces.length < 3) {
        return false;
    }
    var currentYear = (new Date()).getFullYear();
    var month = pieces[0];
    var day = pieces[1];
    var year = pieces[2];
    if (isNaN((month = parseInt(month))) || (month < 1) || (month > 12)) {
        return false;
    }
    if (isNaN((day = parseInt(day))) || (day < 1) || (day > 31)) {
        return false;
    }
    if (isNaN((year = parseInt(year))) || (year < 1000) || (year > currentYear)) {
        return false;
    }
    return true;
}

Doc.prototype.doc_loaded = function () {

    jQuery("#quetextSearch").html('Check Plagiarism').prop('disabled', false);

    jQuery("#download-plagiarism-report").show();

    // download pdf
    jQuery("#download-plagiarism-report").on('click', function () {

        if (jQuery(this).hasClass('disabled')) {
            return false;
        }

        var newreportId = jQuery("#doc").val();
        const url = 'https://www.quetext.com/api/wordpress/download-report/' + newreportId;

        jQuery.ajax({
            url: url,
            type: 'GET',
            beforeSend: function (xhr) {
                jQuery("#download-plagiarism-report").addClass('disabled');
                jQuery("#download-plagiarism-report").html('Downloading...');
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                const blobUrl = URL.createObjectURL(data);

                const anchor = document.createElement('a');
                anchor.href = blobUrl;
                anchor.download = newreportId + '.pdf';
                anchor.style.display = 'none';
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(blobUrl);
                jQuery("#download-plagiarism-report").html('Download Plagiarism Report');
                jQuery("#download-plagiarism-report").removeClass('disabled');
            },
            error: function (err) {
                alert("An error occurred while trying to download report");
                jQuery("#download-plagiarism-report").html('Download Plagiarism Report');
                jQuery("#download-plagiarism-report").removeClass('disabled');
            }
        });

    });

    jQuery("#source-generate-citations").on('click', function () {

        jQuery("#ask-for-details .error").addClass('hidden');
        jQuery('#modal-citation-generator .error').addClass('hidden');
        jQuery(".citation-detail").val('');
        jQuery('#modal-citation-generator #citations').addClass('hidden');

        jQuery('#modal-citation-generator').modal({
            keyboard: true,
            backdrop: true
        });

        jQuery('#modal-citation-generator #ask-for-details').removeClass('hidden');
        jQuery("#modal-citation-generator .citation-detail:not(.hidden)").first().focus();

    });

    jQuery("#submit-citation-details:not(.disabled)").on('click', function () {
        jQuery(this).find("input").blur();
        jQuery("#submit-citation-details").addClass('disabled');
        var url = jQuery("#source-generate-citations").data('source-url');
        var authorFirstname = jQuery("#citation-detail_author-firstname").length ? jQuery("#citation-detail_author-firstname").val().trim() : null;
        var authorLastname = jQuery("#citation-detail_author-lastname").length ? jQuery("#citation-detail_author-lastname").val().trim() : null;
        var publisher = jQuery("#citation-detail_publisher").length ? jQuery("#citation-detail_publisher").val().trim() : null;
        var publicationDate = jQuery("#citation-detail_publication-date").length ? jQuery("#citation-detail_publication-date").val().trim() : null;
        var title = jQuery("#citation-detail_article-title").length ? jQuery("#citation-detail_article-title").val().trim() : null;
        var newapiurl = jQuery('#api_url').val();
        // var response = {"citation":{"mla":"<i>leverageedu.com</i>. N.p., Web. 1 Jul. 2022.<br>&lt;https://leverageedu.com/blog/leave-application&gt;.","apa":"Retrieved from https://leverageedu.com/blog/leave-application","chicago":"leverageedu.com. https://leverageedu.com/blog/leave-application (accessed July 1, 2022)."}}
        $.post(newapiurl + 'create-citation', {
                url: url,
                author_firstname: authorFirstname && authorFirstname.length ? authorFirstname : '',
                author_lastname: authorLastname && authorLastname.length ? authorLastname : '',
                publisher: publisher && publisher.length ? publisher : '',
                title: title && title.length ? title : '',
                publication_date: publicationDate && publicationDate.length ? publicationDate : ''
            },
            function (response) {
                jQuery("#submit-citation-details").removeClass('disabled');
                jQuery("#submit-citation-details").html("Create Citation");
                if (response.force_refresh) {
                    location.reload();
                }
                else if (response.error) {
                    jQuery("#ask-for-details .error").html(response.error).removeClass('hidden');
                }
                else if (response.citation) {
                    jQuery("#ask-for-details .error").addClass('hidden');
                    jQuery('#modal-citation-generator #ask-for-details').addClass('hidden');
                    jQuery('#modal-citation-generator #citations').removeClass('hidden');
                    jQuery("#citation-mla-format").html(response.citation.mla);
                    jQuery("#citation-apa-format").html(response.citation.apa);
                    jQuery("#citation-chicago-format").html(response.citation.chicago);
                }
                else {
                    jQuery('#modal-citation-generator #ask-for-details').addClass('hidden');
                    jQuery('#modal-citation-generator #citations').addClass('hidden');
                    jQuery('#modal-citation-generator .error').removeClass('hidden');
                }
            });

    });

    jQuery("#ask-for-details input").on('keypress', function (e) {
        if (e.which == 13) jQuery("#submit-citation-details").click();
    });

    jQuery("#citation-go-back").on('click', function () {
        jQuery('#modal-citation-generator #citations').addClass('hidden');
        jQuery('#modal-citation-generator #ask-for-details').removeClass('hidden');
        jQuery("#modal-citation-generator .citation-detail").first().focus();
    });

    jQuery("#citations .citation-text").on('click', function () {
        highlightText(jQuery(this).attr('id'));
    });

    var showKeynavTip = jQuery("#tip-notification").length ? true : false;

    var dismissTip = function () {
        showKeynavTip = false;
        jQuery("#tip-notification").hide();
        $.post('/api/dismiss/keynav-tip');
    }

    // add a slight delay when moving mouse from one match to the next when they will highlight the same source on the right
    var lastMouseIn, lastMouseOut;
    jQuery(".match")
        .on('mouseover', function () {
            var sourceId = lastMouseIn = jQuery(this).data('source-id');
            jQuery(".source[data-source-id='" + sourceId + "']").addClass('focus');
        })
        .on('mouseout', function () {
            lastMouseIn = null;
            var sourceId = lastMouseOut = jQuery(this).data('source-id');
            setTimeout(function () {
                if (lastMouseIn === sourceId) return;
                jQuery(".source[data-source-id='" + sourceId + "']").removeClass('focus');
            }, 200);
        });

    // dismiss tip-notification
    jQuery("#notification-dismiss").on('click', function () {
        dismissTip();
    });

    // show match in right panel on input text match click
    var matchClicked = localStorage.getItem('match-clicked') !== null;
    if (matchClicked) {
        jQuery("#nav-next-match").addClass('no-effects');
    }
    jQuery(".match").on('click', function (e) {
        e.stopPropagation();

        jQuery('.source-percentage-total').hide();

        jQuery('.source-url:not(.overview').show();
        jQuery('.source-url.overview').hide();

        jQuery("#doc-results").scrollTop(0);

        if (!matchClicked) {
            jQuery("#nav-next-match").addClass('no-effects');
            localStorage.setItem('match-clicked', 'true');
        }

        matchClicked = true;

        // show tip if necessary
        if (showKeynavTip) {
            setTimeout(function () {
                jQuery("#tip-notification").fadeIn('fast');
                showKeynavTip = false;
            }, 1000);
        }

        var txt = jQuery(this).text();

        // attach source URL to the citation generator button
        jQuery("#source-generate-citations").data('source-url', jQuery(this).data('source-url'));
        jQuery("#exclude-source-url").data('source-url', jQuery(this).data('source-url'));

        var sourceId = jQuery(this).data('source-id');
        var matchId = jQuery(this).attr("id");
        self.selectedMatch = jQuery(this).data('match-num') * 1;

        // code for check paraphrasing start here
        jQuery('#paraFix').show();
        jQuery('.paraAppendDiv').hide();
        jQuery('#paraFix').data('para-text', txt);
        jQuery('#paraFix').data('match-id', matchId);

        // code for check paraphrasing end here

        var similarityScore = jQuery(this).data('similarity-score');
        jQuery(".match-similarity-score").html('').removeClass('visible');

        jQuery(".source-action").addClass('visible').removeClass('hidden');
        jQuery('.focus').removeClass('focus');
        jQuery(this).addClass('focus');
        jQuery('.snippet').hide();
        jQuery('.source').hide();
        var sourceRow = jQuery(".source[data-source-id='" + sourceId + "']");
        // show similarity score for match
        sourceRow.find(".match-similarity-score").html(similarityScore + "<span>similar</span>").addClass('visible');
        sourceRow.find('.source-title').addClass('open');
        sourceRow.show().addClass('focus');

        // if theres an open snippet in this row already, skip the slideToggle effect
        if (sourceRow.find('.open').length) {
            jQuery('.snippet').removeClass('open');
            sourceRow.find(".snippet[data-match-id='" + matchId + "']").show().addClass('open');
        }
        else {
            jQuery('.snippet').removeClass('open');
            sourceRow.find(".snippet[data-match-id='" + matchId + "']").fadeIn('fast').addClass('open');
        }

        // match navigator update
        jQuery("#current-match-selection").val(self.selectedMatch);

        // scroll to match if document height is >= certain height
        if (jQuery("#doc").outerHeight() > 800) {
            jQuery('html,body').animate({
                scrollTop: jQuery(this).offset().top - 300
            }, 80);
        }

    });

    // match navigation
    jQuery("#nav-next-match").on('click', function () {
        if (jQuery("#current-match-selection").is(':focus')) {
            return false;
        }
        if (jQuery(".match[data-match-num='" + (self.selectedMatch + 1) + "']").length) {
            self.selectedMatch++;
            jQuery(".match[data-match-num='" + (self.selectedMatch) + "']")[0].click();
        }
    });

    //Fix button click event for paraphrasing
    jQuery("#paraFix").on('click', function (e) {
        jQuery(".paraAppendDiv").hide();
        var plan = jQuery("#plan_id").val();
        if (plan === 'free_plan') {
            var html = '';
            html += "<div class='paraAppendDiv' style='padding:20px 10px'>";
            html += "<div class='text-center py-3' style='padding:10px 0px;color:#db2828'>";
            html += "Upgrade to PRO to fix plagiarisms";
            html += "</div>";
            html += "<div class='parabody'>";
            html += "<div class='py-3 text-center'>";
            html += "<a href='https://www.quetext.com/account/subscription' style='color:inherit;' target='_blank'><button type='button' class='btn btn-success'>Upgrade to PRO</button></a>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            jQuery('.snippets').before(html);
            return;
        } else {
            jQuery(this).html('<i class="fa fa-pencil" aria-hidden="true"></i> Rephrasing...');
            var paraText = jQuery(this).data('para-text');
            var reportId = jQuery('#doc').val();
            var matchId = jQuery(this).data('match-id');
            var apiUrl = jQuery('#api_url').val();
            jQuery.ajax({
                url: apiUrl + 'paraphrase',
                type: 'post',
                dataType: 'json',
                data: {
                    text: paraText,
                    reportId: reportId,
                    matchId: matchId,
                    apiKey: localStorage.getItem('qt_token'),
                    source: 'wordpress'
                },
                success: function (res) {
                    jQuery("#paraFix").html('<i class="fa fa-pencil" aria-hidden="true"></i> Rephrase');
                    var html = "";
                    html+="<div class='paraAppendDiv'>";
                    html+="<div class='paratitle'>";
                    html+="You can rephrase the sentence as";
                    html+="</div>";
                    html+="<div class='parabody'>";
                    for(var i=0;i < res.length;i++){
                        if (res[i].text.charAt(0)=='.') {
                            res[i].text = res[i].text.substr(1);
                        } else {
                            res[i].text = res[i].text;
                        }
                        html+="<div class='py-2'>";
                        html+="<p class='parasentence'><input type='radio' class='para_sentence' name='para_sentence' value='"+res[i].text.substring(0,res[i].text.length-1)+"' checked/> "+res[i].text.substring(0,res[i].text.length-1)+"<br></p>";

                        html+="</div>";
                    }
                    html+="<span>";
                    html+="<button type='button' class='btn green applyParaText' style='width:47%'>Apply</button> &nbsp;";
                    html+="<button type='button' class='btn grey copyParaText' style='width:47%'>Copy</button> &nbsp;";
                    html+="</span>";
                    html+="</div>";
                    html+="</div>";

                    jQuery('.snippets').before(html);
                    jQuery(".copyParaText").on('click', function(e) {
                        jQuery(this).html('Copied')
                        var text = jQuery('input[name="para_sentence"]:checked').val().replaceAll('\n', '');
                        navigator.clipboard.writeText(text);
                    });

                    jQuery(".applyParaText").on('click', function(e) {
                        var realText = jQuery(this).html();
                        if(realText==='Apply'){
                            jQuery(this).html('Undo')
                            var text = jQuery('input[name="para_sentence"]:checked').val().replaceAll('\n', '');
                            jQuery(".match.exact-match.focus").css("border-bottom", "none")
                            jQuery(".match.exact-match.focus").text(text);
                        }else {
                            jQuery(this).html('Apply');
                            jQuery(".match.exact-match.focus").css("border-bottom", "2px solid #ff6156e6")
                            jQuery(".match.exact-match.focus").text(paraText);
                        }
                    });
                },
                error: function (request, status, error) {
                    jQuery("#paraFix").html('<i class="fa fa-pencil" aria-hidden="true"></i> Rephrase');
                    console.log(error);
                }
            });
        }
    })

    jQuery("#nav-prev-match").on('click', function () {
        if (jQuery("#current-match-selection").is(':focus')) {
            return false;
        }
        if (jQuery(".match[data-match-num='" + (self.selectedMatch - 1) + "']").length) {
            self.selectedMatch--;
            jQuery(".match[data-match-num='" + (self.selectedMatch) + "']")[0].click();
        }
    });

    jQuery("#current-match-selection").on('focus', function () {
        jQuery("#doc").addClass('deaf');
        var val = jQuery(this).val() && !isNaN(parseInt(jQuery(this).val())) ? parseInt(jQuery(this).val()) : null;
        if (val === null) {
            jQuery(this).val('');
        }
        else {
            setTimeout(function () {
                jQuery("#current-match-selection").select();
            }, 150);
        }
    });

    jQuery("#current-match-selection").on('blur keyup change', function (e) {
        // any keyup event that isn't 'enter' gets ignored
        if (e && e.type === 'keyup' && e.which !== 13) {
            return;
        }
        var val = jQuery(this).val() && !isNaN(parseInt(jQuery(this).val())) ? parseInt(jQuery(this).val()) : null;
        val = val && (val > 0) && (val <= self.data.matches.length) ? val : null;
        if (val === null) {
            // see if match is focused
            if (jQuery('.match.focus').length && jQuery('.match.focus').data('match-num')) {
                var matchNum = jQuery('.match.focus').data('match-num') * 1;
                jQuery(this).val(matchNum);
            }
            else {
                jQuery(this).val('--');
            }
            jQuery("#doc").removeClass('deaf');
        }
        else if (jQuery(".match[data-match-num='" + val + "']").length) {
            jQuery(".match[data-match-num='" + val + "']")[0].click();
            self.selectedMatch = val;
            if (e.type === 'keyup') {
                jQuery(this).blur();
            }
            setTimeout(function () {
                jQuery("#doc").removeClass('deaf');
            }, 500);
        }

    });

    // left/right key navigation support
    jQuery("body").keydown(function (e) {
        if (jQuery(".modal.in").length === 0 && !jQuery('#doc-title-edit').is(':focus')) {
            // left arrow
            if ((e.keyCode || e.which) == 37) {
                if (jQuery("#tip-notification").length && jQuery("#tip-notification").is(":visible")) {
                    dismissTip();
                }
                jQuery("#nav-prev-match")[0].click();
            }
            // right arrow
            if ((e.keyCode || e.which) == 39) {
                if (jQuery("#tip-notification").length && jQuery("#tip-notification").is(":visible")) {
                    dismissTip();
                }
                jQuery("#nav-next-match")[0].click();
            }
        }
    });

    jQuery('#doc').on('click', function () {
        if (jQuery(this).hasClass('deaf')) {
            return false;
        }
        var inputMatchVal = jQuery("#current-match-selection").val() && !isNaN(parseInt(jQuery("#current-match-selection").val())) ? parseInt(jQuery("#current-match-selection").val()) : null;
        inputMatchVal = inputMatchVal && (inputMatchVal > 0) && (inputMatchVal <= self.data.matches.length) ? inputMatchVal : null;
        if (self.selectedMatch !== inputMatchVal) {
            return false;
        }
        self.selectedMatch = 0;
        jQuery("#current-match-selection").val('--');
        jQuery(".source-action").removeClass('visible').addClass('hidden');
        jQuery('.source-percentage-total').show();
        jQuery('.source-url.overview').show();
        jQuery('.source-url:not(.overview)').hide();
        jQuery('.source-title').removeClass('open');
        jQuery('.focus').removeClass('focus');
        jQuery('.open').removeClass('open');
        jQuery(".match-similarity-score").html('').removeClass('visible');
        jQuery(".match-item-left").addClass('collapsed');
        jQuery(".match-item-right").removeClass('squish');
        jQuery('.source').show();
        jQuery('.snippet').hide();
    });


}

jQuery(document).on('ready', function () {
    // var doc = new Doc();
});


function showWordCount(d) {
    jQuery('#search-multi').show()
    if (d < 1) {
        jQuery('#postsearch-wordcount').text('')
        return
    }
    var c = d === 1 ? d + " word" : d.toLocaleString("en") + " words";
    var b = Math.round((d / 500) * 10) / 10;
    if (b < 1) {
        var e = "Less than 1 page"
    } else {
        if (d === 500) {
            var e = "1 page"
        } else {
            if (d % 500 === 0) {
                var e = +b + " pages"
            } else {
                var e = "~" + b + " pages"
            }
        }
    }
    jQuery('#postsearch-wordcount').text(c + " (" + e + ")")
}
