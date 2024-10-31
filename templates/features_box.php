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

    #report-container {
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

<div>
    <div id="section-feature-box" class="hidden mt-3">
        Click below to check your text for plagiarism <br>
        <br>
        <button type="button" class="button button-primary button-large" id="quetextSearch"> Check Plagiarism </button>
        <p class="mt-4"><a href="#" id="quetextUserLogout"><img src="<?php echo esc_html($this->plugin_url) . 'assets/images/icon_logout.png' ?>" /> Logout </a></p>

        <p class="mt-2 error-message plag-check-error hidden">
            <i class="fa fa-exclamation-triangle"></i>
            <span class="plag-check-error-msg"> An error occurred</span>
        </p>
    </div>
    <div id="section-login-box" class="hidden">
        <div class="col-md-4 mb-1">
            <label for="qt-email" class="form-label">Email Address</label>
            <input type="email" class="form-control qt-email" id="qt-email" placeholder="Email address">
            <strong>
                <p class="qt-error qt-email-err text-danger">Please enter valid email address</p>
            </strong>
        </div>
        <div class="col-md-4 mb-2">
            <label for="qt-password" class="form-label">Password</label>
            <input type="password" class="form-control qt-pwd" id="qt-password" placeholder="Password">
            <button type="button" class="button button-primary button-large mt-3" id="quetextUserLogin" data-callSrc="features"> Login </button>
            <p class="mt-2">Don't have an account yet? <a href="https://www.quetext.com/pricing">Create Account</a></p>
        </div>
        <strong>
            <p class="qt-error qt-gen-err text-danger hidden ml-3"></p>
        </strong>
    </div>
    <div id="report-container">
        <div class="">
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
                                <!-- api_url is being set in BaseController.php line 20-->
                                <input type="hidden" id="api_url" value="<?php echo esc_html($this->api_url); ?>">
                                <input type="hidden" id="access_token" value="">
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

</div>

<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/bootstrap.js' ?>"></script>
<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/jquery.knob.js' ?>"></script>
<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/fontawesome.js' ?>"></script>
