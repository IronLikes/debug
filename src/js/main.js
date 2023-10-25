var App = {

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

        IronLikes.setAutomationButton();
        
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
        IronLikes.ironLikesExtensionVersion = event.data.version;
        IronLikes.setAutomationButton();
    }
});

var IronLikes = {

    noMorePosts: false,
    post_index: 0,
    urls: [],
    userInstalledExtension: null,
    curUrlPlatform: null,
    autoLikeIsWorking: false,
    ironLikesExtensionVersion: -1,

    setAutomationButton: function () {

        $("#start_automation_button").off("click");
        if (!IronLikes.is_chrome() || Utils.Browser.isMobileBrowser()) {

            // User not in Chrome
            $("#start_automation_button").on("click", function () {
                Popup.openPopup('.popup-1');
                Utils.Analytics.sendGoogleAnalyticsEvent("start_automation_not_chrome");
            });
            $('.subtitle_container a').attr("href", "javascript: Popup.openPopup('.popup-3'); void(0);");
            $('.subtitle_container a').attr("target", "");

        } else if ( $("#start_automation_button .play.not_installed").get(0) != null && IronLikes.ironLikesExtensionVersion <= 0) {

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
                if (IronLikes.ironLikesExtensionVersion >= 1.04) {
                    IronLikes.toggleAutomationButton();
                }
                Utils.Analytics.sendGoogleAnalyticsEvent("start_automation_installed");
            });

        }

    },

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
        
        var timeTolike = Math.random() * 1000 * 8 + 2000;
        var timeToClose = Math.random() * 1000 * 4 + 2000;
        if ($("#like_url").attr("href") != "#") {
            window.postMessage({
                                type: 'iron_likes_update_vars',
                                vars: {
                                        time_to_like: timeTolike,
                                        time_to_close: timeToClose
                                    }
                                }, '*');
            setTimeout(function () {
                window.postMessage({type: 'iron_likes_click_like'}, '*');
            }, 1);
        }

        _this.activeTimeout = setTimeout (function () {
            var curBtn = document.getElementById("next_post_button");
            if (curBtn != null) {
                curBtn.click();
            }
            _this.activeTimeout = setTimeout (function () {
                _this.likePost();
            }, 3 * 1000);
        }, timeTolike + timeToClose + 2200 + Math.random() * 1000);

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


var Utils = {

    Url: {

        /**
         * Returns the value of the url query param by its name.
         * @param {String} param   The param to find
         */
        getQuerystringParamValue: function (param) {
            var queryStr = window.location.search.substring(1);
            var queryArr = queryStr.split("&");
            for (var i = 0; i < queryArr.length; i++) {
                var key = queryArr[i].split("=")[0];
                var val = queryArr[i].split("=")[1];
                if (key == param) {
                    return val;
                }
            }
            return "";
        }

    },

    Arrays: {

        /**
         * Returns a shuffled array
         * @param {Array} originArr   The original array to shuffle
         */
        shuffleArray: function (originArr) {
            var newArr = [];
            while (originArr.length > 0) {
                var curIndx = Math.floor(Math.random() * originArr.length);
                var curEl = originArr[curIndx];
                newArr.push(curEl);
                originArr.splice(curIndx, 1);
            }
            return newArr;
        }

    },

    Browser: {

        isMobileBrowser: function () {

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }

        }

    },
    
    Analytics: {

        sendGoogleAnalyticsEvent: function (event, category, action, label, value) {

            var _this = this;

            if (category == null || typeof (category) == "undefined") {
                category = null;
            }
            if (action == null || typeof (action) == "undefined") {
                action = null;
            }
            if (label == null || typeof (label) == "undefined") {
                label = null;
            }
            if (value == null || typeof (value) == "undefined") {
                value = null;
            }

            this.sendGoogleAnalyticsEventUsingGtag(event, category, action, label, value);
        },

        sendGoogleAnalyticsEventUsingGtag: function (event, category, action, label, value) {

            if (typeof (gtag) != "undefined") {

                var obj = {};
                if (event == null) {
                    event = "click";
                }
                if (category != null) {
                    obj.event_category = category;
                }
                if (action != null) {
                    obj.event_action = action;
                }
                if (label != null) {
                    obj.event_label = label;
                }
                if (value != null) {
                    obj.event_value = value;
                }
                gtag('event', event, obj);

            }

        }

    },

    Social: {

        openSharePopup: function (url, winWidth, winHeight) {
            if (typeof (winWidth) == "undefined") {
                winWidth = 600;
            }
            if (typeof (winHeight) == "undefined") {
                winHeight = 400;
            }
            var win = window.open(url, 'share_popup', 'top=' + ((screen.height - winHeight) / 2 - 25) + ',left=' + ((screen.width - winWidth) / 2) + ',width=' + winWidth + ',height=' + winHeight + ',location=0,scrollbars=0,status=0,titlebar=0,toolbar=0');
            if (win != null) {
                win.focus();
            }
        },

        /**
         * Opens Twitter share popup
         * @param {String} shareText   The text of the post
         * @param {String} shareUrl   The url to share on Twitter
         */
        shareOnTwitter: function (shareText, shareUrl) {
            Utils.Social.openSharePopup('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(shareUrl));
        },


        /**
         * Opens Facebook share popup
         * @param {String} shareUrl   The url to share on Facebook
         */
        shareOnFacebook: function (shareText, shareUrl) {
            Utils.Social.openSharePopup('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl) + "&quote=" + encodeURIComponent(shareText), 600, 680);
        },

        shareOnFacebookMessenger: function (shareUrl) {

            if (Utils.Browser.isMobileBrowser()) {
                window.location.href = "fb-messenger://share/?link=" + encodeURIComponent(shareUrl) + "&app_id=966242223397117";
            } else {
                var url = "https://www.facebook.com/v8.0/dialog/send?link=" + encodeURIComponent(shareUrl) + "&app_id=966242223397117&display=popup&next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Freturn%2Fclose";
                // &next=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117 // another "next" option
                Utils.Social.openSharePopup(url);
            }

        },

        /**
         * Opens Telegram share popup
         * @param {String} shareText   The text of the post
         * @param {String} shareUrl   The url to share on Telegram
         */
        shareOnTelegram: function (shareText, shareUrl) {
            var curLink = 'https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText);
            if (Utils.Browser.isMobileBrowser()) {
                window.location.href = curLink;
            } else {
                window.open(curLink);
            }
        },

        getShareString: function (shareText, shareUrl) {
            var curShareText = "";
            if (shareText != null && shareText != "") {
                curShareText += encodeURIComponent(shareText);
            }
            if (shareUrl != null && shareUrl != "") {
                if (curShareText != "") {
                    curShareText += encodeURIComponent("\r\n\r\n");
                    //curShareText += ("%0D%0A"); // for whatsapp
                }
                curShareText += encodeURIComponent(shareUrl);
            }
            return curShareText;
        },

        shareOnWhatsapp: function (shareText, shareUrl) {

            var curShareText = Utils.Social.getShareString(shareText, shareUrl);
            if (Utils.Browser.isMobileBrowser()) {
                window.location.href = 'whatsapp://send?text=' + curShareText; // "&phone="
            } else {
                window.open('https://web.whatsapp.com/send?text=' + curShareText); // "&phone="
            }
        },

        shareOnEmail: function (subjectText, bodyText, shareUrl) {

            var curLink = 'mailto:?subject=' + encodeURIComponent(subjectText) + '&body=' + Utils.Social.getShareString(bodyText, shareUrl);
            window.location.href = curLink;

        },

        shareOnSms: function (shareText, shareUrl) {

            var sepChar = "?";
            var isIos = navigator.userAgent.match(/like Mac OS X/i);
            var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
            if (isIos) {
                sepChar = "&";
            } else if (isAndroid) {
                shareUrl = encodeURIComponent(shareUrl);
            }

            var curLink = 'sms:' + sepChar + 'body=' + Utils.Social.getShareString(shareText, shareUrl);
            window.location.href = curLink;

        }

    },

}
