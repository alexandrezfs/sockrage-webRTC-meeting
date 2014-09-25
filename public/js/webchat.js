/**
 * Global VARS
 * @type {*}
 */

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var sockRageWebchat;

function initSockrageWebchat(sockrage_addr, db_name_webchat) {

    sockRageWebchat = new SockRage(sockrage_addr, db_name_webchat);

    /**
     * Send message on push enter
     */
    $(document).keypress(function(e) {
        if(e.which == 13) {
            $("#message-input-confirm").click();
        }
    });

    /**
     * Send message event
     */
    $("#message-input-confirm").click(function() {

        if ($("#message-input-msg").val().length > 0) {

            sockRageWebchat.set({
                datetime : new Date(Date.now()),
                username : htmlentities(appGlobal.userSession.username),
                message : htmlentities($("#message-input-msg").val()),
                room_id : $("#room_id").val()
            });

        }

        $("#message-input-msg").val("");

        return false;
    });

    /**
     * Listening on messages
     */
    sockRageWebchat.on("getAll", function(data) {

        console.log(data);

        for (var i = data.length - 1; i >= 0; i--) {

            var message = data[i];

            displayMessage(message);
            scrollDown();
        }
    });

    /**
     * Listening on new message
     */
    sockRageWebchat.on("create", function(message) {

        displayMessage(message);
        scrollDown();
    });

    /**
     * List every messages
     */
    sockRageWebchat.list();
}

/**
 * Display a message on the WebChat
 * @param username
 * @param datetime
 * @param message
 */
function displayMessage(message) {

    console.log(message);

    //only append THIS room's messages
    if($("#room_id").val() == message.room_id) {
        $("#webchat-messages").append('<p><strong>' + message.username + "</strong> (" + getRelativeFromNow(message.datetime) + ")<br>" + message.message + '</p>');
    }
}

/**
 * Scroll down the webchat window
 */
function scrollDown() {

    var objDiv = document.getElementById("webchat-messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

/**
 * Get relative date from message date using moment.js
 * @param date
 * @returns {*}
 */
function getRelativeFromNow(date) {

    return moment.utc(date).fromNow();
}

/**
 * Escape all html entities
 * @param string
 * @returns {string}
 */
function htmlentities(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}