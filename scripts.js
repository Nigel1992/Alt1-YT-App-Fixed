///<reference path="/runeappslib.js"/>

mainwnd = window; // elements in other windows refer to this
customcontrols = false;
controlsel = null;
currenttab = 0;
currentchannel = "";
subvids = [];

menuopen = true;
menuwindow = null;

authscope = "https://www.googleapis.com/auth/youtube.readonly";
accesstoken = localStorage.yt_access_token || false;
accessexpire = +localStorage.yt_access_expire || 0;
refreshtoken = localStorage.yt_refresh_token || false;
temptoken = false;

window.addEventListener("popstate", parseargs);

function start() {
    // Check if YouTube API key and client ID already exist in local storage
    ytkey = localStorage.getItem('ytkey');
    ytclientid = localStorage.getItem('ytclientid');

    // If both exist, ask the user if they want to use the existing credentials
    if (ytkey && ytclientid) {
        var useExisting = confirm("YouTube API key and client ID found in local storage. Do you want to use the existing credentials?");

        if (useExisting) {
            // If the user wants to use existing credentials, no need to prompt again
            initialize();
        } else {
            // If the user doesn't want to use existing credentials, prompt again
            promptForCredentials();
        }
    } else {
        // If either or both credentials don't exist, prompt for both
        promptForCredentials();
    }
}

function promptForCredentials() {
    ytkey = prompt("Please enter your YouTube API key:");
    ytclientid = prompt("Please enter your YouTube client ID:");

    // Save the entered credentials to local storage
    localStorage.setItem('ytkey', ytkey);
    localStorage.setItem('ytclientid', ytclientid);

    initialize();
}

function initialize() {
    a1lib.identifyUrl("appconfig.json");
    controlsel = elid("controls");
    elid("progressouter").onmousedown = function(e) {
        newdraghandler2(e, settime);
        e.preventDefault();
    }
    elid("volumeouter").onmousedown = function(e) {
        newdraghandler2(e, setvolume);
        e.preventDefault();
    }

    var a = arglist();
    menuopen = !a.v;

    resize();
    attemploadsubvids();
    elid(controlsel, "ytinput").focus();
}

function attemploadsubvids() {
    var a, b, func;
    func = function() {
        loadsubvids();
        settab(2);
    };

    if (accessexpire < Date.now() - 1000 * 60) {
        if (refreshtoken) {
            refreshauth(func);
        } else {
            clog("Not logged in");
        }
    } else {
        func();
    }
}

function lookupvideo(query) {
    var a, b, c, query, script, vidid;

    if (query) {
        elid(controlsel, "ytinput").value = query;
    } else {
        query = elid(controlsel, "ytinput").value;
    }

    if (a = getvidid(query)) {
        selectvid(a);
        return;
    }

    elid(controlsel, "ytoutput").innerHTML = "<div class='vidliststatus'>Loading...</div>";
    dlpage("https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=20&type=channel,video&q=" + encodeURIComponent(query) + "&key=" + ytkey, function(t) {
        elid(controlsel, "ytoutput").innerHTML = "<div class='ytoutputpad'></div>" + ytcallback(t);
    });
    elid(controlsel, "ytoutput").innerHTML = "<div class='vidliststatus'>Loading...</div>";
    settab(0);
}

function loadchannelvids(id) {
    elid(controlsel, "channelvidlist").innerHTML = "<div class='vidliststatus'>Loading...</div>";
    dlpage("https://www.googleapis.com/youtube/v3/search?part=id,snippet&maxResults=20&type=video&order=date&channelId=" + id + "&key=" + ytkey, function(t) {
        elid(controlsel, "channelvidlist").innerHTML = ytcallback(t);
    });
    elid(controlsel, "channelvidlist").innerHTML = "Loading...";
}

function ytcallback(str) {
    var a, b, c, items, data;

    data = JSON.parse(str);
    if (data.error) {
        clog("yt api error");
        return "Youtube Api error";
    }

    items = data.items || [];
    return drawvidlist(items);
}

function sameday(date1, date2) {
    return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
}

// escapes html but collapses double escaped chars
// youtube api now prevides pre-escaped strings,
// however it would still be retarded to inject those into html
// so we have to do some magic
function escapehtmlcollapse(str) {
    str += "";
    //unescape first
    str = str.replace(/&(\w{1,4});/g, function(f, s) {
        switch (s) {
            case "apos":
                return "'";
            case "quot":
                return "\"";
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            default:
                return f;
        }
    }).replace(/&#(\d{2,3});/g, function(f, s) {
        return String.fromCharCode(+s);
    });

    //do an actual escape to make sure we got everything
    return escapehtml(str);
}

function drawvidlist(items, options) {
    var a, b, c, r, items, id, type, onclicks, classes;
    if (!options) {
        options = {};
    }
    onclicks = { "vid": "mainwnd.selectvid", "channel": "mainwnd.selectchannel" };
    classes = { "vid": "videoitem", "channel": "channelitem" };

    var lastDate = null;
    var yday = new Date();
    yday.setDate(yday.getDate() - 1);
    var today = new Date();
    r = "";
    for (a in items) {
        var snippet = items[a].snippet;
        type = null;
        if (items[a].id.kind == "youtube#video") {
            type = "vid";
            id = items[a].id.videoId;
        }
        if (items[a].id.kind == "youtube#channel") {
            type = "channel";
            id = items[a].id.channelId;
        }
        if (!type) {
            continue;
        }

        var date = new Date(snippet.publishedAt);
        if (options.seperatedays) {
            if (!lastDate || !sameday(date, lastDate)) {
                r += "<div class='ytlistseperator'>";
                if (sameday(today, date)) {
                    r += "Today";
                } else if (sameday(yday, date)) {
                    r += "Yesterday";
                } else {
                    r += date.getDate() + " " + fullmonthnames[date.getMonth()];
                }
                r += "</div><div></div>";
            }
            lastDate = date;
        }

        r += "<div class='ytviditem " + classes[type] + "' data-id='" + id + "' onclick='" + onclicks[type] + "(\"" + id + "\")'>";
        r += "<div class='ytvidimg' style='background-image:url(\"" + escapehtmlcollapse(snippet.thumbnails.default.url) + "\")'></div>";
        r += "<div class='ytvidtitle' title='" + escapehtmlcollapse(snippet.title) + "'>" + escapehtmlcollapse(snippet.title) + "</div>";
        if (type == "vid") {
            r += "<div class='ytvidchannel'>By: <span onclick='" + onclicks["channel"] + "(\"" + snippet.channelId + "\"); event.stopPropagation();'>" + escapehtmlcollapse(snippet.channelTitle) + "</span></div>";
        }
        if (type == "vid") {
            r += "<div class='ytvidtime'>" + timeago(+date) + " ago</div>";
        }
        r += "</div>";
    }
    return r;
}

function resize() {
    if (customcontrols && window.innerHeight > 70) {
        customcontrols = false;
        toggleclass("ytcontrols", "enabled", false);
        toggleclass("ytvid", "hidden", false);
        if (playinginterval) {
            clearInterval(playinginterval);
            playinginterval = false;
        }
        fixmenu();
    }
    if (!customcontrols && window.innerHeight <= 70) {
        customcontrols = true;
        toggleclass("ytcontrols", "enabled", true);
        toggleclass("ytvid", "hidden", true);
        drawytcontrols();
        fixmenu();
    }
}

function settab(tabnr) {
    var a, b, c;
    a = elcl(controlsel, "contenttab");
    for (b = 0; b < a.length; b++) {
        a[b].classList.remove("activetab");
    }
    a = elcl(controlsel, "tabcontent");
    for (b = 0; b < a.length; b++) {
        a[b].style.display = "none";
    }

    elid(controlsel, "contenttab" + tabnr).classList.add("activetab");
    elid(controlsel, "tabcontent" + tabnr).style.display = "block";
    currenttab = tabnr;
}

function selectchannel(id) {
    currentchannel = id;
    dlpage("https://www.googleapis.com/youtube/v3/channels?part=id,snippet&id=" + id + "&key=" + ytkey, loadedchannel);
    loadchannelvids(id);
    settab(1);
}

function loadedchannel(str) {
    var a, b, c, d, data, obj;

    data = JSON.parse(str);
    if (data.error) {
        clog("error loading channel data");
        return;
    }

    for (var a in data.items) {
        var obj = data.items[a];
        if (obj.id != currentchannel) {
            continue;
        }
        elid(controlsel, "channeltitle").innerHTML = escapehtmlcollapse(obj.snippet.title);
        elid(controlsel, "channeltext").innerHTML = escapehtmlcollapse(obj.snippet.description).replace(/\n/g, "<br/>");
        elid(controlsel, "channelthumb").style.backgroundImage = "url('" + obj.snippet.thumbnails.default.url + "')";
        elid(controlsel, "channelinfo").style.display = "block";
        elid(controlsel, "channeltexttoggle").style.display = "block";
        elid(controlsel, "channeltextsep").style.display = "block";
    }
}

function togglechanneltext() {
    var expanded;
    expanded = elid(controlsel, "channelinfo").classList.contains("capped");
    if (expanded) {
        elid(controlsel, "channelinfo").classList.remove("capped");
        elid(controlsel, "channeltexttoggle").innerHTML = "Collapse";
    } else {
        elid(controlsel, "channelinfo").classList.add("capped");
        elid(controlsel, "channeltexttoggle").innerHTML = "Show more";
    }
}

function startauth() {
    var url, q;
    q = {
        client_id: ytclientid,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        scope: authscope,
        response_type: "code",
        access_type: "offline"
    };

    a1lib.openbrowser("https://accounts.google.com/o/oauth2/auth" + buildquery(q));
    elid(controlsel, "authcodepart").style.display = "block";
}

function validateauth(code) {
    var obj;
    obj = {
        code: code,
        client_id: ytclientid,
        redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
        grant_type: "authorization_code"
    };
    dlpagepost("tokenproxy.php", obj, function(t) {
        receiveauthcode(t);
        loadsubvids();
        settab(2);
    });
}

function receiveauthcode(str) {
    var a, b, obj;
    obj = JSON.parse(str);
    if (obj.error) {
        clog("auth error");
        return;
    }

    if (obj.access_token) {
        localStorage.yt_access_token = accesstoken = obj.access_token;
        localStorage.yt_access_expire = accessexpire = Date.now() + obj.expires_in * 1000;
    }
    if (obj.refresh_token) {
        localStorage.yt_refresh_token = refreshtoken = obj.refresh_token;
    }

    clog("auth code received");
}

function refreshauth(cb) {
    var a, b, obj;
    clog("refreshing token");
    obj = {
        client_id: ytclientid,
        refresh_token: refreshtoken,
        grant_type: "refresh_token"
    };
    dlpagepost("tokenproxy.php", obj, function(t) {
        receiveauthcode(t);
        cb && cb();
    });
}

function loadsubvids(pagetoken) {
    if (!accesstoken) {
        clog("attemped to load sub vids without token.");
        return;
    }

    if (!pagetoken) {
        elid(controlsel, "subvidlist").innerHTML = "<div class='vidliststatus'>Loading subscriptions...</div>";
        elid(controlsel, "subvidlist").style.display = "block";
        elid(controlsel, "authbox").style.display = "none";
        subvids = [];
    }
    var url = "https://www.googleapis.com/youtube/v3/subscriptions?part=id,snippet&mine=true&maxResults=50&order=unread&access_token=" + encodeURIComponent(accesstoken);
    if (pagetoken) {
        url += "&pageToken=" + encodeURIComponent(pagetoken);
    }
    dlpage(url, subsloaded);
}

var subvidlist = [];

function subsloaded(str) {
    var obj = JSON.parse(str);

    if (obj.error) {
        qw("Error in sub response");
        elid(controlsel, "subvidlist").style.display = "none";
        elid(controlsel, "authbox").style.display = "block";
        return;
    }

    for (var a in obj.items) {
        if (obj.items[a].snippet.resourceId.kind != "youtube#channel") {
            continue;
        }
        loadsubchannel(obj.items[a].snippet.resourceId.channelId);
    }
    if (obj.nextPageToken) {
        loadsubvids(obj.nextPageToken);
    }
    drawvidlist();
}

function loadsubchannel(id) {
    dlpage("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&order=date&channelId=" + id + "&key=" + ytkey, loadedsubchannel);
}

function loadedsubchannel(str) {
    var a, b, c, obj;
    obj = JSON.parse(str);
    if (obj.error) {
        return;
    }
    subvids = subvids.concat(obj.items);
    drawsubvids();
}

function drawsubvids() {
    subvids.sort(function(b, a) {
        return new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt);
    });
    elid(controlsel, "subvidlist").innerHTML = "<div class='ytoutputpad'><span id='logoutbutton' onclick='mainwnd.logout();'>Log out</span></div>" + drawvidlist(subvids.slice(0, 30), { seperatedays: true });
}

function clearaccesskey() {
    localStorage.yt_access_token = "";
}

function togglemenu() {
    menuopen = !menuopen;
    fixmenu();
}

function fixmenu() {
    var makewindow = function() {
        if (menuwindow) {
            return;
        }
        menuwindow = window.open("", null, "width=350 height=400");
        menuwindow.document.body.classList.add("nis");
        menuwindow.document.title = "Menu";
        menuwindow.mainwnd = mainwnd;
        var style = menuwindow.document.createElement("link");
        style.rel = "stylesheet";
        style.href = absoluteUrl("style.css");
        menuwindow.document.head.appendChild(style);
        var niscss = menuwindow.document.createElement("link");
        niscss.rel = "stylesheet";
        niscss.href = absoluteUrl("/nis/nis.css");
        menuwindow.document.head.appendChild(niscss);

        var input = elid(controlsel, "ytinput");
        toggleclass(controlsel, "expanded", true);
        menuwindow.addEventListener("beforeunload", function() {
            document.body.appendChild(controlsel);
            menuwindow = null;
            menuopen = false;
            fixmenu();
        });
        menuwindow.document.body.appendChild(controlsel);
        input.focus();
    }

    var closewindow = function() {
        if (!menuwindow) {
            return;
        }
        menuwindow.close();
        window.removeEventListener("beforeunload", closewindow);
    }
    window.addEventListener("beforeunload", closewindow);

    if (menuopen) {
        if (customcontrols && !menuwindow) {
            makewindow();
        }
        if (!customcontrols && menuwindow) {
            closewindow();
        }
        if (!menuwindow) {
            toggleclass("controls", "expanded", true);
            elid(controlsel, "ytinput").focus();
        }
    } else {
        if (menuwindow) {
            closewindow();
        }
        toggleclass("controls", "expanded", false);
    }
}

//=========================================================================
//========================== Video player code ============================
//=========================================================================

playinginterval = false;
ytloaded = false;
draggingtime = false;

function onYouTubeIframeAPIReady() {
    ytplayer = new YT.Player("ytvid", {
        events: {
            onReady: onPlayerReady,
            onStateChange: drawytcontrols
        },
        playerVars: {
            iv_load_policy: 3,
            modestbranding: 0,
            theme: "dark",
            rel: 0,
            showinfo: 1
        }
    });
}

function settime(mouseloc) {
    var bounds, part;
    bounds = elid("progressouter").getBoundingClientRect();
    part = (mouseloc.x - bounds.left) / (bounds.right - bounds.left);
    drawtime(part);
    draggingtime = !mouseloc.end;
    if (mouseloc.end) {
        ytplayer.seekTo(ytplayer.getDuration() * part);
    }
}

function setvolume(mouseloc) {
    var bounds, part;
    bounds = elid("volumeouter").getBoundingClientRect();
    part = (mouseloc.x - bounds.left) / (bounds.right - bounds.left);
    if (part < 0) {
        part = 0;
    }
    if (part > 1) {
        part = 1;
    }
    elid("volumeinner").style.width = 100 * part + "%";
    ytplayer.setVolume(Math.pow(part, 2) * 100);
}

function drawytcontrols() {
    var state, a, id, data, title;

    if (ytloaded) {
        data = ytplayer.getVideoData();
        if (data) {
            id = data.video_id;
            title = data.title;
        }
        a = arglist();
        if (a.v != id) {
            a.v = id;
            history.pushState(null, document.title, document.location.protocol + "//" + document.location.host + document.location.pathname + buildquery(a));
        }
        if (title && document.title != title) {
            document.title = title;
            history.replaceState(null, document.title, document.location.protocol + "//" + document.location.host + document.location.pathname + buildquery(a));
        }
    }

    if (customcontrols && ytloaded) {
        state = ytplayer.getPlayerState();

        var viddata = ytplayer.getVideoData()
        if (viddata) {
            elid("videotitle").innerHTML = escapehtmlcollapse(viddata.title);
        }
        elid("volumeinner").style.width = Math.sqrt(ytplayer.getVolume() / 100) * 100 + "%";
        if (ytplayer.isMuted()) {
            elid("volumeicon").classList.add("muted");
        } else {
            elid("volumeicon").classList.remove("muted");
        }
        if (state == 1 || state == 3) { //"playing" state
            if (!playinginterval) {
                playinginterval = setInterval(function() {
                    !draggingtime && drawtime();
                }, 500);
            }
            elid("playbutton").classList.add("playing");
        } else { //not playing
            if (playinginterval) {
                clearInterval(playinginterval);
                playinginterval = false;
            }
            elid("playbutton").classList.remove("playing");
        }
    }
}

function drawtime(part) {
    var t;
    if (draghandler && !part) {
        return;
    }

    if (part) {
        t = part * ytplayer.getDuration();
    } else {
        t = ytplayer.getCurrentTime();
        part = t / ytplayer.getDuration();
    }
    elid("progresstext").innerHTML = timeformat(t) + " / " + timeformat(ytplayer.getDuration());
    elid("progressinner").style.width = part * 100 + "%";
}

function onPlayerReady() {
    ytloaded = true;
    drawytcontrols();
    elid("ytvid").style.display = "block";
    elid("loadingyt").style.display = "none";
    ytplayer.setPlaybackQuality("hd720");
}
