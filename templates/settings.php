<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly
?>

<link rel="stylesheet" href="<?php echo esc_html($this->plugin_url) . 'assets/css/lib/bootstrap.css' ?>">

<style>
    .errorclass {
        width: 100%;
        margin-top: 0.25rem;
        font-size: 20px;
        color: #dc3545;
    }
    .successclass{
        width: 100%;
        margin-top: 0.25rem;
        font-size: 20px;
        color: green;
    }
</style>
<div class="container">
    <div class="row">
        <div class="col-12 text-center">
            <img src="<?php echo esc_html($this->plugin_url) . 'assets/images/primary.svg' ?>" style="height:100px;width:250px">
            <p style="font-size: 18px;">Quetext's plagiarism checker analyzes your text to identify plagiarism and resolve other writing issues. You wouldn't want to write without it.</p>
            <br>
<!--                <div class="errorclass">-->
<!--                    -->
<!--                    <br><br>-->
<!--                </div>-->
        </div>
    </div>

    <div class="row" style="border: 1px solid #ccc;padding: 27px;">
        <div class="col-12">

            <div class="tab-content">
                <div class="tab-pane active" id="tabs-1" role="tabpanel">


                        <div id="section-user-info-box" class="hidden">
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td id="userFullName"></td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td id="userEmail"></td>
                                </tr>
                                <tr>
                                    <td>Active Plan</td>
                                    <td style="color:green" id="userPlan"></td>
                                </tr>
                                <tr>
                                    <td>Pages</td>
                                    <td id="totalQuota">
                                        <img src="<?php echo esc_html($this->plugin_url); ?>assets/images/dots-loading.gif" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr>
                        <div class="text-center">
                            <a href="https://www.quetext.com/account" target="_blank">
                                <button class="btn btn-success">View Account</button>
                            </a>
                            <a href="#" id="quetextUserLogout">
                                <button class="btn btn-danger">Logout</button>
                            </a>
                        </div>
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
                                <button type="button" class="button button-primary button-large mt-3" id="quetextUserLogin" data-callSrc="admin"> Login </button>
                                <p class="mt-2">Don't have an account yet? <a href="https://www.quetext.com/pricing">Create Account</a>
                                </p>
                            </div>
                            <strong>
                                <p class="qt-error qt-gen-err text-danger hidden ml-3"></p>
                            </strong>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="<?php echo esc_html($this->plugin_url) . 'assets/js/lib/bootstrap-5.2.3.min.js' ?>"></script>

<script>
    jQuery(document).ready(function() {
      var accessToken = '';
      accessToken = localStorage.getItem('qt_token');
      setTimeout(function(){
          jQuery(".successclass").hide();
          jQuery(".errorclass").hide();
        }, 3000);

        const api_url = "<?php echo esc_html($this->api_url).'auth/plan'; ?>";

        if (accessToken) {
            jQuery.ajax({
              url : api_url,
              type: "GET",
              beforeSend: function (xhr) {
                  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
              },
              success: function(response) {
                  let pagesLeft = response?.data?.credits?.pages ?? '0';
                  jQuery('#totalQuota').html(pagesLeft);
              },
              error: function (request, status, error) {
                  console.log(error);
              }
          });

          const firstName = localStorage.getItem('qt_name');
          const lastName = localStorage.getItem('qt_lname');
          const email = localStorage.getItem('qt_email');
          const plan = localStorage.getItem('qt_plan') ? localStorage.getItem('qt_plan') : 'Free';

          jQuery('#userPlan').html(plan);
          jQuery('#userFullName').html(firstName + " " + lastName);
          jQuery('#userEmail').html(email);
      }

  });
</script>

