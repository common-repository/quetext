<?php
    if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>

<link rel="stylesheet" href="<?php echo esc_html($this->plugin_url) . 'assets/css/lib/fontawesome.css' ?>">
<link rel="stylesheet" href="<?php echo esc_html($this->plugin_url) . 'assets/css/lib/bootstrap.css' ?>">
<link rel="stylesheet" href="<?php echo esc_html($this->plugin_url); ?>assets/css/quetext-plugin.css">

<style>
    #doc-details {
        position: relative !important;
        top: 0px;
        width: 100%;
        display: block;
        margin-left: 0;
        background: #f8f9fa;
        box-sizing: border-box;
        min-height: 100vh;
        transition: all .4s ease;
    }

    #doc-textarea {
        max-width: 100%;
        padding: 40px;
    }

    #doc-percent-complete {
        color: #fff;
        position: relative;
        top: 0px;
        margin-top: 0px;
    }

    .source-url.overview {
        margin: 3px 15px 0;
    }

    #quetext-section {
        display: none;
    }

    #doc-results {
        height: 80vh;
    }

    #doc-details {
        min-height: 80vh;
    }

    #current-match-selection {
        margin: 0px;
    }

    #match-navigator i {
        padding: 0 10px;
    }

    .hideBT {
        display: none;
        width: 40%;
        float: right;
    }

    .paraAppendDiv {
        background-color: #fff;
        padding: 10px 42px;
        margin: 9px 0px;
        box-shadow: 0 0 8px #eaedf1;
        border-radius: 5px;
    }

    .paratitle {
        font-size: 20px;
        font-weight: bold;
        padding: 15px 0;
        color: #333aeb;
    }

    .parasentence {
        color: darkgoldenrod;
        font-size: 15px;
    }

    #source-actions {
        float: right;
        margin-top: 1px;
        margin-right: 17px;
    }

    .source {
        margin-top: 15px;
    }

    .source .row:first-child {
        padding-bottom: 0px;
    }

    .actionBt {
        padding: 0 4%;

    }

    .modal-backdrop {}

    body {
        overflow: visible;
    }
</style>
<div id="quetext-section">
    <div class="container-fluid">
        <div class="row mt-3">
            <div class="col-12">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#tabs-1" role="tab">Plagiarism Report</a>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#tabs-2" role="tab">Citation Report</a>
                    </li> -->
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="tabs-1" role="tabpanel">
                        <div class="doc-details-header mt-4">
                            <h5>Plagiarism Checker Report </h5>
                            <input type="hidden" id="access_key" value="">
                            <input type="hidden" id="api_url" value="<?php echo esc_html($this->api_url); ?>">
                            <div class="button button-primary" id="download-plagiarism-report">Download Plagiarism Report</div>
                        </div>

                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-7 mt-4">
                                    <div class="main-report-box" style="position: relative;">
                                        <input type="hidden" id="doc">
                                        <div id="doc-textarea" class="notextarea" style="display: block;min-height:0px;max-height:800px; overflow-y: scroll;">
                                        </div>
                                        <div id="search-multi" style="display: block; position: absolute; top: 10px; left: auto; right: 10px; margin: 0px !important;">
                                            <div class="inlineblock" style="font-weight: 300;font-size: 13px;color: #94a3ab;background: #fff;border-radius: 20px;" id="postsearch-wordcount">1,610 words (~3.2 pages)</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-5 mt-4">
                                    <div id="doc-details">
                                        <div id="results-percentage">
                                            <input type="text" value="75" id="percent-matches-dial" class="dial" />
                                            <div id="percent-matches"></div>
                                            <i data-toggle="tooltip" title="Overall percentage of your text matching sources within our database" class="fa fa-info-circle question-tooltip-icon bottom"></i>
                                        </div>
                                        <div id="waiting-note" class="hidden">
                                            We’re searching billions of files for similar text to your input. This may take some time, depending on the size of your input and other factors.<br /><br /> This job will continue even if you leave the page or logout. You can view the status or results of a job in your <a href="/reports">reports section</a> at any time.
                                        </div>
                                        <div id="results-title" class="noselect">
                                            <div id="match-navigator">
                                                <i id="nav-prev-match" class="fa fa-angle-left top" aria-hidden="true"></i>
                                                <input type="text" id="current-match-selection" value="--" />
                                                <i id="nav-next-match" class="fa fa-angle-right top" aria-hidden="true"></i>
                                            </div>
                                            <div id="num-sources-count"></div>
                                        </div>
                                        <div id="doc-results">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="tab-pane" id="tabs-2" role="tabpanel">
                        <div class="container-fluid">
                            <div class="row mt-4">
                                <div class="col-10">
                                    <br>
                                    <h5>Citaion Report </h5>
                                    <input type="hidden" id="access_key" value="">
                                </div>
                                <div class="col-2">
                                    <button class="button button-primary">Download Citation Report</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal for citation-->
<div class="modal fade" id="modal-citation-generator" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="margin-top: 50px;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">Citation Assistant</div>
            <div class="modal-body" style="background-color: #fff;">
                <div class="error hidden">
                    <div><b>Something went wrong...</b></div>
                    We were unable to cite this source. Please try again in a few minutes.
                </div>
                <object class='medium-loading-dots hidden' type='image/svg+xml' data='/img/loading-small-grey.svg'></object>
                <div id="ask-for-details">
                    <div class="error hidden"></div>
                    <br>
                    <p>Fill out as many fields as possible for this source, and we'll use it to generate the citation in MLA, APA, and Chicago formats.</p>
                    <br>
                    <label>
                        <span>Author's Firstname</span>
                        <input class="general-field citation-detail autofocus" id="citation-detail_author-firstname" type="text" value="" placeholder="Pentti" />
                    </label>
                    <label>
                        <span>Author's Lastname</span>
                        <input class="general-field citation-detail" id="citation-detail_author-lastname" type="text" value="" placeholder="Kanerva" />
                    </label>
                    <label>
                        <span>Publisher</span>
                        <input class="general-field citation-detail" id="citation-detail_publisher" type="text" value="" placeholder="Elsevier" />
                    </label>
                    <label>
                        <span>Publication Title</span>
                        <input class="general-field citation-detail" id="citation-detail_article-title" type="text" value="" placeholder="Sparse Distributed Memory" />
                    </label>
                    <label>
                        <span>Publication Date</span>
                        <input class="general-field citation-detail" id="citation-detail_publication-date" type="text" value="" placeholder="12/4/1892" />
                    </label>
                    <button type="button" id="submit-citation-details" class="btn btn-primary">Create Citation</button>

                </div>
                <div id="citations" class="hidden">
                    <h4>MLA</h4>
                    <div data-toggle="tooltip" title="Click to highlight" class="citation-text bottom" id="citation-mla-format"></div>
                    <h4>APA</h4>
                    <div data-toggle="tooltip" title="Click to highlight" class="citation-text bottom" id="citation-apa-format"></div>
                    <h4>Chicago</h4>
                    <div data-toggle="tooltip" title="Click to highlight" class="citation-text bottom" id="citation-chicago-format"></div>
                    <button type="button" class="grey" id="citation-go-back">&larr; Go Back</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/bootstrap.js' ?>"></script>
<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/jquery.knob.js' ?>"></script>
<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/fontawesome.js' ?>"></script>
