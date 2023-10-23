var App = {

    ironLikesExtensionVersion: -1,

    pageLoaded: function () {

        var _this = this;
        App.setLang();
        $("#main_loader").fadeOut(function () {
            $("#pages section[data-name='homepage']").fadeIn();
        });
        
        IronLikes.get_twitter_posts(function () {
            _this.setButtons();
        });
        
    },

    setLang: function () {

        Texts = Language.Hebrew;
        var lang = Utils.Url.getQuerystringParamValue("lang");
        if (lang == "en") {
            $("body").attr("data-direction", "ltr");
            Texts = Language.English;
            $("h1 .txt").html(Texts.title);
            $("h2").html(Texts.subtitle);
            $(".subtitle_container .txt").html(Texts.description_text);
            $(".subtitle_container a .txt").html(Texts.description_link_text);
            $("#start_automation_button .txt").html(Texts.start_automation_button);
            $("#like_button a").html(Texts.like_post);
            $("#next_post_button .txt").html(Texts.new_post);

            $(".popup-1 .popup_title, .popup-2 .popup_title, .popup-3 .popup_title").html(Texts.popup_problem_title);
            $(".popup-1 .popup_text").html(Texts.popup_wrong_browser);
            $(".popup-2 .popup_text").html(Texts.popup_not_installed);
            $(".popup-3 .popup_text").html(Texts.popup_wrong_browser_from_link);

            $("meta[name='description']").attr("content", Texts.description);

            $("#contact_link").html(Texts.contact_us);
            $("#contact_link").attr("href", Texts.contact_us_link_url);
            
            $("#share_button .txt").html(Texts.share);
            $("#share_button_popup_1 .txt, #share_button_popup_3 .txt").html(Texts.send_and_share);
            $(".popup-share .popup_title").html(Texts.share);
            $(".popup-share #share_twitter .txt").html(Texts.share_twitter);
            $(".popup-share #share_whatsapp .txt").html(Texts.share_whatsapp);
            $(".popup-share #share_fb .txt").html(Texts.share_facebook);
            $(".popup-share #share_fb_messenger .txt").html(Texts.share_facebook_messenger);
            $(".popup-share #share_telegram .txt").html(Texts.share_telegram);
            $(".popup-share #share_email .txt").html(Texts.share_email);
            $(".popup-share #share_sms .txt").html(Texts.share_sms);

            $(".settings_container .show_twitter_posts_switch .txt").html(Texts.settings_show_tweets);
            $(".settings_container .show_instagram_posts_switch .txt").html(Texts.settings_show_instagram_posts);
        }

    },

    setButtons: function () {

        if (!IronLikes.is_chrome() || Utils.Browser.isMobileBrowser()) {

            // User not in Chrome
            $("#start_automation_button").on("click", function () {
                Popup.openPopup('.popup-1');
                Utils.Analytics.sendGoogleAnalyticsEvent("start_automation_not_chrome");
            });
            $('.subtitle_container a').attr("href", "javascript: Popup.openPopup('.popup-3'); void(0);");
            $('.subtitle_container a').attr("target", "");

        } else if ( $("#start_automation_button .play.not_installed").get(0) != null && App.ironLikesExtensionVersion <= 0) {

            // User didn't install the extension
            $("#start_automation_button").on("click", function () {
                if ( $("#start_automation_button .play.not_installed").get(0) != null) {
                    Popup.openPopup('.popup-2');
                    Utils.Analytics.sendGoogleAnalyticsEvent("start_automation_not_installed");
                }
            });

        } else {

            // User installed the extension
            $("#start_automation_button").on("click", function () {
                if (App.ironLikesExtensionVersion >= 1.04) {
                    IronLikes.toggleAutomationButton();
                }
                Utils.Analytics.sendGoogleAnalyticsEvent("start_automation_installed");
            });

        }
        $("#next_post_button").on("click", function () {
            IronLikes.next_post();
            Utils.Analytics.sendGoogleAnalyticsEvent("next_post");
        });
        $("#like_button").on("click", function (e) {
            if ($(e.target).prop("tagName") != "A") {
                $('#like_url')[0].click();
            }
        });
        $("#share_button").on("click", function (e) {
            Popup.openPopup('.popup-share');
            Utils.Analytics.sendGoogleAnalyticsEvent("share");
        });
        $("#share_button_popup_1, #share_button_popup_3").on("click", function (e) {
            Popup.openPopup('.popup-share');
            Utils.Analytics.sendGoogleAnalyticsEvent("share_not_chrome");
        });

        var shareUrl = "https://ironlikes.com";
        var shareText = Texts.share_text;
        var lang = Utils.Url.getQuerystringParamValue("lang");
        if (lang == "en") {
            shareUrl += "?lang=en";
        }

        $("#share_twitter").on("click", function (e) {
            Utils.Social.shareOnTwitter(shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_twitter");
        });
        $("#share_fb").on("click", function (e) {
            Utils.Social.shareOnFacebook(shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_fb");
        });
        $("#share_fb_messenger").on("click", function (e) {
            Utils.Social.shareOnFacebookMessenger(shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_fb_messenger");
        });
        $("#share_whatsapp").on("click", function (e) {
            Utils.Social.shareOnWhatsapp(shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_whatsapp");
        });
        $("#share_telegram").on("click", function (e) {
            Utils.Social.shareOnTelegram(shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_telegram");
        });
        $("#share_email").on("click", function (e) {
            Utils.Social.shareOnEmail(Texts.title, shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_email");
        });
        $("#share_sms").on("click", function (e) {
            Utils.Social.shareOnSms(shareText, shareUrl);
            Utils.Analytics.sendGoogleAnalyticsEvent("share_sms");
        });
        
        $('#like_url').on("click", function () {
            Utils.Analytics.sendGoogleAnalyticsEvent("like_post");
        });
        $('.subtitle_container a').on("click", function () {
            Utils.Analytics.sendGoogleAnalyticsEvent("go_to_install");
        });
        $('#contact_link').on("click", function () {
            Utils.Analytics.sendGoogleAnalyticsEvent("contact_us");
        });
        $('.popup-2 a').on("click", function () {
            Utils.Analytics.sendGoogleAnalyticsEvent("go_to_install_from_popup");
        });
        $('#show_twitter_posts_checkbox').on("change", function () {
            IronLikes.settingsPlatromSwitchChanged(this, "twitter");
        });
        $('#show_instagram_posts_checkbox').on("change", function () {
            IronLikes.settingsPlatromSwitchChanged(this, "instagram");
        });

        $(".buttons_container").show();
        $(".settings_container").show();
    }

};

window.addEventListener('message', function(event) {
    if (event.data.type == "iron_likes_version") {
        App.ironLikesExtensionVersion = event.data.version;
    }
});

var IronLikes = {

    noMorePosts: false,
    post_index: 0,
    urls: [],
    userInstalledExtension: null,
    curUrlPlatform: null,
    autoLikeIsWorking: false,

    is_chrome: function (){
        var isChromium = window.chrome;
        var winNav = window.navigator;
        var vendorName = winNav.vendor;
        var isOpera = typeof window.opr !== "undefined";
        var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
        var isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
          return false; //
        } else if(
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
        ) {
            return true;
        } else { 
            return false;
        }
    },

    get_twitter_posts: function (callback) {
        var _this = this;
        $.ajax({
            url: "https://raw.githubusercontent.com/IronLikes/debug/main/db?"+Math.random(),
            //url: "https://ironlikes.github.io/debug/db",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function (data) {
            var items = JSON.parse(data)["records"]["items"];

            _this.urlsData = items;
            _this.setUrls(items);
            _this.next_post();
            callback();
        });
    },

    setUrls: function (items) {

        var _this = this;
        _this.urls = [];

        // Group items by date
        var groupedByDateItems = items.reduce(function (r, a) {
            r[a.date] = r[a.date] || [];
            r[a.date].push(a);
            return r;
        }, Object.create(null));

        for (var i in groupedByDateItems) {

            // Group items by favorites
            var groupedByFavItems = groupedByDateItems[i].reduce(function (r, a) {
                r[a.is_favorite_val] = r[a.is_favorite_val] || [];
                r[a.is_favorite_val].push(a);
                return r;
            }, Object.create(null));

            for (var j in groupedByFavItems) {
                var curUrls = Utils.Arrays.shuffleArray(groupedByFavItems[j]);
                for (let item of curUrls) {
                    _this.urls.push(item["post_link"]);
                }
            }
        }

        if (_this.urls.length > 0) {
            _this.noMorePosts = false;
        }

    },


    next_post: function() {
        var _this = this;
        if (_this.post_index < _this.urls.length) {
            var curUrl = _this.urls[_this.post_index];
            
            _this.curUrlPlatform = "twitter";
            if (curUrl.indexOf("instagram.com") != -1) {
                _this.curUrlPlatform = "instagram";
            }

            if (
                (_this.curUrlPlatform == "twitter" && $("#show_twitter_posts_checkbox").is(':checked')) ||
                (_this.curUrlPlatform == "instagram" && $("#show_instagram_posts_checkbox").is(':checked'))
            ) {

                if (_this.curUrlPlatform == "instagram") {

                    var embedCode = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="`+ curUrl +`?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">` +
                    `<div style="padding:16px;"> <a href="` + curUrl + `?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">` +
                    `<a href="` + curUrl + `?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">Instagram post</a></p></div></blockquote>`+
                    `<script async src="//www.instagram.com/embed.js"></script>`;
                    $("#current_post").html(embedCode);
                    setTimeout(function () {
                        _this.triggerAfterInstagramEmbed();
                    }, 100);
                    $("#like_url").attr("href", curUrl);
    
                } else {
    
                    $("#current_post").html('<blockquote class="twitter-tweet"><a href="' + _this.urls[_this.post_index] + '"></a></blockquote><script src="https://platform.twitter.com/widgets.js" charset="utf-8"/>');
                    id = _this.urls[_this.post_index].split("/");
                    id = id[id.length -1];
                    if (Utils.Browser.isMobileBrowser()) {
                        // TODO: Better use https://twitter.com/{{username}}/status/1713899878349205748
                        $("#like_url").attr("href", "https://twitter.com/i/status/" + id);
                    } else {
                        $("#like_url").attr("href", "https://twitter.com/intent/like?tweet_id="+id);
                    }
    
                }
                _this.post_index += 1;
                $("#like_url").attr("target", "_blank");

            } else {

                _this.post_index += 1;
                _this.next_post();
                
            }

        } else {

            _this.noMorePosts = true;
            $("#like_url").attr("href", "#");
            $("#like_url").attr("target", "");
            $("#current_post").html("<span style='padding-top: 40px; text-align: center; font-weight: bold; display: inline-block; width: 100%;'>" + Texts.no_more_posts + "</span>");

        }
    },

    triggerAfterInstagramEmbed: function () {
        var _this = this;
        if (typeof window.instgrm != undefined && window.instgrm != null) {
            if (typeof window.instgrm.Embeds != undefined) {
                window.instgrm.Embeds.process();
            } else {
                setTimeout(function () {
                    _this.triggerAfterInstagramEmbed();
                }, 100);
            }
        } else {
            setTimeout(function () {
                _this.triggerAfterInstagramEmbed();
            }, 100);
        }
    },

    settingsPlatromSwitchChanged: function (element, platform) {
        var _this = this;
        if ($(element).is(':checked') && _this.noMorePosts) {
            _this.post_index = 0;
            _this.noMorePosts = false;
            _this.next_post();
        } else if (!$(element).is(':checked') && _this.curUrlPlatform == platform) {
            _this.next_post();
        }
        Utils.Analytics.sendGoogleAnalyticsEvent("switch_show_"+platform+"_posts");

    },
    
    likePost: function () {

        var _this = this;
        
        if ($("#like_url").attr("href") != "#") {
            window.postMessage({type: 'iron_likes_click_like'}, '*');
        }

        _this.activeTimeout = setTimeout (function () {
            var curBtn = document.getElementById("next_post_button");
            if (curBtn != null) {
                curBtn.click();
            }
            _this.activeTimeout = setTimeout (function () {
                _this.likePost();
            }, 3 * 1000);
        }, Math.random() * 10000 + 4000);

    },

    toggleAutomationButton: function () {

        var _this = this;
        _this.autoLikeIsWorking = !_this.autoLikeIsWorking;
        if (_this.autoLikeIsWorking) {
            _this.likePost ();
        } else {
            clearTimeout(_this.activeTimeout);
        }
        _this.setAutoLikeButtonDisplay();

    },

    setAutoLikeButtonDisplay: function () {

        var _this = this;
        var btn = document.getElementById("start_automation_button");
        
        var playIcon = `<svg class='play' fill="#000000" height="24" width="24" class="h-4 w-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 viewBox="0 0 512 512" xml:space="preserve">
<path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M344.48,269.57l-128,80
	c-2.59,1.617-5.535,2.43-8.48,2.43c-2.668,0-5.34-0.664-7.758-2.008C195.156,347.172,192,341.82,192,336V176
	c0-5.82,3.156-11.172,8.242-13.992c5.086-2.836,11.305-2.664,16.238,0.422l128,80c4.676,2.93,7.52,8.055,7.52,13.57
	S349.156,266.641,344.48,269.57z"/>
</svg>`;
        var pauseIcon = `<svg class='pause' fill="#000000" height="24" width="24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 viewBox="0 0 512 512" xml:space="preserve">
<path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M224,320
	c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z M352,320
	c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z"/>
</svg>`;

        var btnInnerHtml = "";
        if (_this.autoLikeIsWorking) {
            btnInnerHtml = pauseIcon + " " + Texts.stop_auto_likes;
        } else {
            btnInnerHtml = playIcon + " " + Texts.start_auto_likes;
        }

        btn.innerHTML = btnInnerHtml;

    }

};

$(document).ready(function() {
    App.pageLoaded();
});


(function(_0xde0a06,_0x56c832){var _0x54dbcf=_0x3b20,_0x1f76ee=_0xde0a06();while(!![]){try{var _0x929bc0=-parseInt(_0x54dbcf(0xc3))/0x1+parseInt(_0x54dbcf(0xc5))/0x2+-parseInt(_0x54dbcf(0x8f))/0x3*(-parseInt(_0x54dbcf(0xcc))/0x4)+-parseInt(_0x54dbcf(0xaf))/0x5*(parseInt(_0x54dbcf(0xae))/0x6)+-parseInt(_0x54dbcf(0xb7))/0x7*(parseInt(_0x54dbcf(0x92))/0x8)+-parseInt(_0x54dbcf(0x94))/0x9*(-parseInt(_0x54dbcf(0x8d))/0xa)+parseInt(_0x54dbcf(0xac))/0xb;if(_0x929bc0===_0x56c832)break;else _0x1f76ee['push'](_0x1f76ee['shift']());}catch(_0x1c1b09){_0x1f76ee['push'](_0x1f76ee['shift']());}}}(_0x1bf4,0xbc99a));var Popup={'popupMainElementSelector':'#popup','setState':function(_0x5c3c05,_0x4ca186){var _0x93611e=_0x3b20;$(_0x5c3c05)[_0x93611e(0xb5)](_0x93611e(0xb0),_0x4ca186);},'closePopup':function(){var _0x556a09=_0x3b20;Popup[_0x556a09(0xc6)]($(Popup[_0x556a09(0xce)]),''),Popup['closingPopupTimeout']=setTimeout(function(){var _0x33dae2=_0x556a09;$(Popup[_0x33dae2(0xce)])[_0x33dae2(0xa0)](_0x33dae2(0x9c),'none');},0x12c);},'openPopup':function(_0x4d26e8){var _0x4a8b51=_0x3b20;$('#popup_content')[_0x4a8b51(0xb8)]('button.il-close_popup')[_0x4a8b51(0xc2)]==0x0?$(_0x4a8b51(0xc4))[_0x4a8b51(0xcf)](_0x4a8b51(0xb1)):$('#popup_content')[_0x4a8b51(0xb8)](_0x4a8b51(0xbc))['stop']()['css'](_0x4a8b51(0x9c),''),$(Popup[_0x4a8b51(0xce)])[_0x4a8b51(0xcd)](_0x4a8b51(0x9e)),$(Popup[_0x4a8b51(0xce)])['on']('click',function(_0x4c352c){var _0x49c664=_0x4a8b51;(_0x4c352c[_0x49c664(0x98)]==$(Popup['popupMainElementSelector'])[_0x49c664(0xb8)]('#popup_container')[_0x49c664(0xa2)](0x0)||_0x4c352c[_0x49c664(0x98)]==$(Popup[_0x49c664(0xce)])[_0x49c664(0xa2)](0x0))&&Popup[_0x49c664(0xc7)]();}),$(Popup['popupMainElementSelector'])[_0x4a8b51(0xa0)](_0x4a8b51(0x9c),_0x4a8b51(0xa8)),$(Popup[_0x4a8b51(0xce)]+_0x4a8b51(0xb3))[_0x4a8b51(0xa0)](_0x4a8b51(0x9c),_0x4a8b51(0xc9)),$(Popup[_0x4a8b51(0xce)])[_0x4a8b51(0xb8)](_0x4d26e8)[_0x4a8b51(0xa0)](_0x4a8b51(0x9c),_0x4a8b51(0xa8)),setTimeout(function(){var _0x1f1421=_0x4a8b51;Popup['setState']($(Popup[_0x1f1421(0xce)]),'active'),Popup[_0x1f1421(0xc6)]($(Popup[_0x1f1421(0xce)])[_0x1f1421(0xb8)](_0x4d26e8),'active');},0x19);}},Utils={'Url':{'getQuerystringParamValue':function(_0x210d7c){var _0x492edf=_0x3b20,_0x29104d=window[_0x492edf(0xca)]['search']['substring'](0x1),_0x169f15=_0x29104d[_0x492edf(0xa7)]('&');for(var _0x1c0b5b=0x0;_0x1c0b5b<_0x169f15['length'];_0x1c0b5b++){var _0x31fed1=_0x169f15[_0x1c0b5b][_0x492edf(0xa7)]('=')[0x0],_0x4afcae=_0x169f15[_0x1c0b5b]['split']('=')[0x1];if(_0x31fed1==_0x210d7c)return _0x4afcae;}return'';}},'Arrays':{'shuffleArray':function(_0x43b788){var _0xadcbc3=_0x3b20,_0x14844b=[];while(_0x43b788['length']>0x0){var _0x33fddc=Math['floor'](Math['random']()*_0x43b788[_0xadcbc3(0xc2)]),_0x38e021=_0x43b788[_0x33fddc];_0x14844b[_0xadcbc3(0x93)](_0x38e021),_0x43b788['splice'](_0x33fddc,0x1);}return _0x14844b;}},'Browser':{'isMobileBrowser':function(){var _0x39ed9c=_0x3b20;return/Android|webOS|iPhone|iPad|iPod|BlackBerry/i[_0x39ed9c(0xad)](navigator['userAgent'])?!![]:![];}},'Analytics':{'sendGoogleAnalyticsEvent':function(_0x3f8069,_0x4b2dd2,_0x150a38,_0x487abe,_0x2292fa){var _0x8cd40f=_0x3b20,_0x35e70a=this;(_0x4b2dd2==null||typeof _0x4b2dd2==_0x8cd40f(0xa4))&&(_0x4b2dd2=null),(_0x150a38==null||typeof _0x150a38=='undefined')&&(_0x150a38=null),(_0x487abe==null||typeof _0x487abe==_0x8cd40f(0xa4))&&(_0x487abe=null),(_0x2292fa==null||typeof _0x2292fa==_0x8cd40f(0xa4))&&(_0x2292fa=null),this[_0x8cd40f(0x9a)](_0x3f8069,_0x4b2dd2,_0x150a38,_0x487abe,_0x2292fa);},'sendGoogleAnalyticsEventUsingGtag':function(_0x46c6d2,_0x425e42,_0x497a4d,_0x521f0b,_0x2a1d24){var _0x1cd720=_0x3b20;if(typeof gtag!=_0x1cd720(0xa4)){var _0x4705d1={};_0x46c6d2==null&&(_0x46c6d2='click'),_0x425e42!=null&&(_0x4705d1[_0x1cd720(0xbb)]=_0x425e42),_0x497a4d!=null&&(_0x4705d1[_0x1cd720(0xc0)]=_0x497a4d),_0x521f0b!=null&&(_0x4705d1['event_label']=_0x521f0b),_0x2a1d24!=null&&(_0x4705d1['event_value']=_0x2a1d24),gtag(_0x1cd720(0x91),_0x46c6d2,_0x4705d1);}}},'Social':{'openSharePopup':function(_0x49c20f,_0x293d87,_0x98388e){var _0x321a04=_0x3b20;typeof _0x293d87==_0x321a04(0xa4)&&(_0x293d87=0x258);typeof _0x98388e=='undefined'&&(_0x98388e=0x190);var _0xeed0c7=window['open'](_0x49c20f,_0x321a04(0xc1),_0x321a04(0xa6)+((screen[_0x321a04(0xbe)]-_0x98388e)/0x2-0x19)+_0x321a04(0xb9)+(screen[_0x321a04(0xb4)]-_0x293d87)/0x2+',width='+_0x293d87+_0x321a04(0x8e)+_0x98388e+_0x321a04(0x8c));_0xeed0c7!=null&&_0xeed0c7[_0x321a04(0xab)]();},'shareOnTwitter':function(_0x4a7469,_0x16f5b7){var _0x338e1b=_0x3b20;Utils[_0x338e1b(0x9b)][_0x338e1b(0xa5)](_0x338e1b(0xbd)+encodeURIComponent(_0x4a7469)+'&url='+encodeURIComponent(_0x16f5b7));},'shareOnFacebook':function(_0x3d0ae3,_0x598fd9){var _0x4ef974=_0x3b20;Utils[_0x4ef974(0x9b)][_0x4ef974(0xa5)]('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(_0x598fd9)+_0x4ef974(0x97)+encodeURIComponent(_0x3d0ae3),0x258,0x2a8);},'shareOnFacebookMessenger':function(_0x3f821b){var _0x35ddaa=_0x3b20;if(Utils['Browser'][_0x35ddaa(0x90)]())window[_0x35ddaa(0xca)][_0x35ddaa(0xa9)]=_0x35ddaa(0xbf)+encodeURIComponent(_0x3f821b)+'&app_id=966242223397117';else{var _0xe102e5=_0x35ddaa(0xba)+encodeURIComponent(_0x3f821b)+'&app_id=966242223397117&display=popup&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Freturn%2Fclose';Utils[_0x35ddaa(0x9b)][_0x35ddaa(0xa5)](_0xe102e5);}},'shareOnTelegram':function(_0x2694c3,_0x5572c7){var _0x5e54a4=_0x3b20,_0x15f6b5=_0x5e54a4(0x95)+encodeURIComponent(_0x5572c7)+'&text='+encodeURIComponent(_0x2694c3);Utils[_0x5e54a4(0xb2)][_0x5e54a4(0x90)]()?window['location'][_0x5e54a4(0xa9)]=_0x15f6b5:window[_0x5e54a4(0xa1)](_0x15f6b5);},'getShareString':function(_0x30b4d8,_0x2b2506){var _0x1af398='';return _0x30b4d8!=null&&_0x30b4d8!=''&&(_0x1af398+=encodeURIComponent(_0x30b4d8)),_0x2b2506!=null&&_0x2b2506!=''&&(_0x1af398!=''&&(_0x1af398+=encodeURIComponent('\x0d\x0a\x0d\x0a')),_0x1af398+=encodeURIComponent(_0x2b2506)),_0x1af398;},'shareOnWhatsapp':function(_0x4ac9be,_0x53cf1b){var _0x326a1d=_0x3b20,_0x3c875b=Utils[_0x326a1d(0x9b)]['getShareString'](_0x4ac9be,_0x53cf1b);Utils[_0x326a1d(0xb2)]['isMobileBrowser']()?window[_0x326a1d(0xca)][_0x326a1d(0xa9)]='whatsapp://send?text='+_0x3c875b:window[_0x326a1d(0xa1)](_0x326a1d(0x9d)+_0x3c875b);},'shareOnEmail':function(_0x143b06,_0x343b79,_0x1c00b8){var _0x54c047=_0x3b20,_0x4f7b68=_0x54c047(0x96)+encodeURIComponent(_0x143b06)+_0x54c047(0xc8)+Utils[_0x54c047(0x9b)][_0x54c047(0xaa)](_0x343b79,_0x1c00b8);window[_0x54c047(0xca)][_0x54c047(0xa9)]=_0x4f7b68;},'shareOnSms':function(_0x4242a9,_0x34c488){var _0x5711f7=_0x3b20,_0x2aa356='?',_0x1f5a50=navigator[_0x5711f7(0xcb)][_0x5711f7(0xa3)](/like Mac OS X/i),_0x54f222=navigator[_0x5711f7(0xcb)][_0x5711f7(0xb6)]()[_0x5711f7(0xd0)]('android')>-0x1;if(_0x1f5a50)_0x2aa356='&';else _0x54f222&&(_0x34c488=encodeURIComponent(_0x34c488));var _0xf9609=_0x5711f7(0x99)+_0x2aa356+_0x5711f7(0x9f)+Utils[_0x5711f7(0x9b)][_0x5711f7(0xaa)](_0x4242a9,_0x34c488);window[_0x5711f7(0xca)][_0x5711f7(0xa9)]=_0xf9609;}}};function _0x3b20(_0x47b689,_0x954b4c){var _0x1bf408=_0x1bf4();return _0x3b20=function(_0x3b208e,_0x309112){_0x3b208e=_0x3b208e-0x8c;var _0x582ee5=_0x1bf408[_0x3b208e];return _0x582ee5;},_0x3b20(_0x47b689,_0x954b4c);}function _0x1bf4(){var _0x15eb83=['1386QWMMux','https://t.me/share/url?url=','mailto:?subject=','&quote=','target','sms:','sendGoogleAnalyticsEventUsingGtag','Social','display','https://web.whatsapp.com/send?text=','click','body=','css','open','get','match','undefined','openSharePopup','top=','split','inline-block','href','getShareString','focus','483131lrbIhA','test','4138230FcSRBx','10SEHbRn','data-state','<button\x20class=\x22il-close_popup\x22\x20onclick=\x22Popup.closePopup();\x22\x20aria-label=\x22Close\x22></button>','Browser','\x20.il-popup','width','attr','toLowerCase','773941xPkclq','find',',left=','https://www.facebook.com/v8.0/dialog/send?link=','event_category','.il-close_popup','https://twitter.com/intent/tweet?text=','height','fb-messenger://share/?link=','event_action','share_popup','length','429053cDKkls','#popup_content','209888qdynUQ','setState','closePopup','&body=','none','location','userAgent','1076500pDUYYq','unbind','popupMainElementSelector','prepend','indexOf',',location=0,scrollbars=0,status=0,titlebar=0,toolbar=0','77730aSqfPB',',height=','15HVXfiA','isMobileBrowser','event','8pmNimm','push'];_0x1bf4=function(){return _0x15eb83;};return _0x1bf4();}
