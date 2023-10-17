var App = {

    pageLoaded: function () {
        var _this = this;
        App.setLang();
        $("#main_loader").fadeOut(function () {
            $("#pages section[data-name='homepage']").fadeIn();
        });
        
        IronLikes.get_twitter_posts();
        setTimeout(function () {
            _this.setButtons();
        }, 2000);
        
    },

    setLang: function () {

        Texts = Language.Hebrew;
        var lang = Utils.Url.getQuerystringParamValue("lang");
        if (lang == "en") {
            $("body").attr("data-direction", "ltr");
            Texts = Language.English;
        }

    },

    setButtons: function () {

        console.log ($("#start_automation_button .play.not_installed").get(0));
        if (!IronLikes.is_chrome()) {

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

    detect_extension: function (extensionId, callback) { 
        var img; 
        img = new Image(); 
        img.src = "chrome-extension://" + extensionId + "/test.png"; 
        console.log (img);
        img.onload = function() { 
            callback(true); 
        }; 
        img.onerror = function() { 
            callback(false); 
        };
    },

    has_extension: function (callback){
        var _this = this;
        _this.detect_extension("hbgbekianmmcbkenheennefojoemjaol", function (result) {
            _this.userInstalledExtension = result;
            callback();
        });
    },

    get_twitter_posts: function () {
        var _this = this;
        $.ajax({
            url: "https://raw.githubusercontent.com/IronLikes/debug/main/db",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        })
        .done(function (data) {
            items = JSON.parse(data)["records"]["items"];
            for (let item of items) {
                _this.urls.push(item["post_link"]);
            }
            _this.next_post();
        });
    },

    next_post: function() {
        var _this = this;
        if (_this.post_index < _this.urls.length) {
            $("#current_post").html('<blockquote class="twitter-tweet"><a href="' + _this.urls[_this.post_index] + '"></a></blockquote><script src="https://platform.twitter.com/widgets.js" charset="utf-8"/>');
            id = _this.urls[_this.post_index].split("/");
            id = id[id.length -1]
            $("#like_url").attr("href", "https://twitter.com/intent/like?tweet_id="+id);
            _this.post_index += 1;
        } else {
            $("#current_post").html("No more posts for now.");
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

    }
    
}

$(document).ready(function() {
    App.pageLoaded();
});