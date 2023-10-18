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

            $(".popup-1").html(Texts.popup_wrong_browser);
            $(".popup-2").html(Texts.popup_not_installed);

            $("meta[name='description']").attr("content", Texts.description);

            $("#contact_link").html(Texts.contact_us);
            $("#contact_link").attr("href", Texts.contact_us_link_url);
        }

    },

    setButtons: function () {

        if (!IronLikes.is_chrome() || Utils.Browser.isMobileBrowser()) {

            // User not in Chrome
            $("#start_automation_button").on("click", function () {
                Popup.openPopup('.popup-1');
            });

        } else if ( $("#start_automation_button .play.not_installed").get(0) != null) {

            // User didn't install the extension
            $("#start_automation_button").on("click", function () {
                Popup.openPopup('.popup-2');
            });

        } else {

        }
        $("#next_post_button").on("click", function () {
            IronLikes.next_post();
        });
        $("#like_button").on("click", function (e) {
            if ($(e.target).prop("tagName") != "A") {
                $('#like_url')[0].click();
            }
            
        });
        $(".buttons_container").show();
    }

};

var IronLikes = {

    post_index: 0,
    urls: [],
    userInstalledExtension: null,

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
            items = JSON.parse(data)["records"]["items"];

            // Group items by date
            var groupedByDateItems = items.reduce(function (r, a) {
                r[a.date] = r[a.date] || [];
                r[a.date].push(a);
                return r;
            }, Object.create(null));

            for (var i in groupedByDateItems) {

                // Group items by favorites
                var groupedByFavItems = groupedByDateItems[i].reduce(function (r, a) {
                    r[a.is_favorite] = r[a.is_favorite] || [];
                    r[a.is_favorite].push(a);
                    return r;
                }, Object.create(null));

                for (var j in groupedByFavItems) {
                    var curUrls = Utils.Arrays.shuffleArray(groupedByFavItems[j]);
                    for (let item of curUrls) {
                        _this.urls.push(item["post_link"]);
                    }
                }
            }


            _this.next_post();
            callback();
        });
    },

    next_post: function() {
        var _this = this;
        if (_this.post_index < _this.urls.length) {
            $("#current_post").html('<blockquote class="twitter-tweet"><a href="' + _this.urls[_this.post_index] + '"></a></blockquote><script src="https://platform.twitter.com/widgets.js" charset="utf-8"/>');
            id = _this.urls[_this.post_index].split("/");
            id = id[id.length -1];
            if (Utils.Browser.isMobileBrowser()) {
                // TODO: Better use https://twitter.com/{{username}}/status/1713899878349205748
                $("#like_url").attr("href", "https://twitter.com/i/status/" + id);
            } else {
                $("#like_url").attr("href", "https://twitter.com/intent/like?tweet_id="+id);
            }
            _this.post_index += 1;
        } else {
            $("#current_post").html("<span style='padding-top: 40px; text-align: center; font-weight: bold; display: inline-block; width: 100%;'>" + Texts.no_more_posts + "</span>");
        }
    }

};

var Popup = {

    popupMainElementSelector: "#popup",

    setState: function (element, state) {
        $(element).attr("data-state", state);
    },

    closePopup: function () {

        Popup.setState($(Popup.popupMainElementSelector), "");
        Popup.closingPopupTimeout = setTimeout(function () {
            $(Popup.popupMainElementSelector).css("display", "none");
        }, 300);

    },

    openPopup: function (selector) {

        if ($("#popup_content").find('button.il-close_popup').length == 0) {
            $("#popup_content").prepend('<button class="il-close_popup" onclick="Popup.closePopup();" aria-label="Close"></button>');
        } else {
            $("#popup_content").find(".il-close_popup").stop().css("display", "");
        }

        $(Popup.popupMainElementSelector).unbind("click");
        $(Popup.popupMainElementSelector).on("click", function (e) {
            if (e.target == $(Popup.popupMainElementSelector).find("#popup_container").get(0)
                || e.target == $(Popup.popupMainElementSelector).get(0)) {
                Popup.closePopup();
            }
        });

        $(Popup.popupMainElementSelector).css("display", "inline-block");
        $(Popup.popupMainElementSelector + " .il-popup").css("display", "none");
        $(Popup.popupMainElementSelector).find(selector).css("display", "inline-block");

        setTimeout(function () {
            Popup.setState($(Popup.popupMainElementSelector), "active");
            Popup.setState($(Popup.popupMainElementSelector).find(selector), "active");
        }, 25);

    }
};

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
    
}

$(document).ready(function() {
    App.pageLoaded();
});