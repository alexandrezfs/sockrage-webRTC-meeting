
$(document).ready(function() {

    var user = JSON.parse(localStorage.getItem("user"));
    user = user[0];

    if(user.length > 0) {
        $("#username_menu").html(user.username);
    }

});

/**
 * Rooms list
 * @constructor
 */
function RoomTable() {

    this.SockrageRoom;

    this.init = function(sockrageAddr, reference) {

        this.SockrageRoom = new SockRage(sockrageAddr, reference);

        this.SockrageRoom.on("getAll", function(rooms) {

            console.log(rooms);

            var html = "<table class='table table-striped'>";
                html += "<thead>";
                    html += "<td>Room's name</td><td>Room's description</td><td>Room's owner</td><td>Settings</td>";
                html += "</thead>";

                html += "<tbody>";

                    for(var i = 0; i < rooms.length; i++) {

                        var room = rooms[i];

                        html += "<tr><td>" + room.name + "</td><td>" + room.description + "</td><td>" + room.author + "</td><td><a href='/room/" + room._id + "'>Enter</a></td></tr>";
                    }

                html += "</tbody>";
            html += "</table>";

            $("#rooms_table").html(html);
        });

        this.SockrageRoom.list();

    }
}

/**
 * The create room form
 * @constructor
 */
function CreateRoomForm() {

    this.SockrageRoom;
    this.user;

    this.init = function(sockrageAddr, reference) {

        var userSession = JSON.parse(localStorage.getItem("user"));
        this.user = userSession[0];

        this.SockrageRoom = new SockRage(sockrageAddr, reference);

        $("#submitCreateRoom").click(function() {

           CreateRoomForm.createRoom();

        });

    }

    this.createRoom = function() {

        if($("#inputName").val().length == 0) {

            toastr.error("Please enter a room name");
        }
        else if($("#inputDescription").val().length == 0) {

            toastr.error("Please enter a room description");
        }
        else {

            CreateRoomForm.SockrageRoom.set({
                name : $("#inputName").val(),
                description : $("#inputDescription").val(),
                author : CreateRoomForm.user.username
            });

            document.location = "/dashboard";

        }

    }

}

/**
 * The login form class
 * @constructor
 */
function LoginForm() {

    this.SockrageUser;

    this.init = function(sockrageAddr, reference) {

        this.SockrageUser = new SockRage(sockrageAddr, reference);
        this.SockrageUser.on("getAll", function(data) {

            var password = $("#inputPassword").val();
            var email = $("#inputEmail").val();

            var user = jsonsql.query(
                "SELECT * FROM json WHERE (password == '" + password + "' && email == '" + email + "')",
                data);

            if(user.length == 1) {
                //connection OK

                localStorage.setItem("user", JSON.stringify(user)); //store in session

                document.location = "/dashboard";
            }
            else {
                toastr.error("Authentication failed.");
            }

        });

        $("#submitLoginButton").click(function() {

            LoginForm.login();

        });

    }

    this.login = function() {

        this.SockrageUser.list();

    }
}

/**
 * The signup Form class
 * @constructor
 */
function SignupForm() {

    this.dropzoneId = "profilePicDropper";
    this.uploadPath = "/uploads";
    this.SockrageUser;

    this.init = function(sockrageAddr, reference) {

        this.SockrageUser = new SockRage(sockrageAddr, reference);
        this.SockrageUser.on("create", function(data) {

            console.log(data);

            document.location = "/login";

        });

        initDropzone(
            this.uploadFinished,
            this.dragStart,
            this.dragOver,
            this.dragEnd,
            this.dragEnd,
            this.drop,
            this.totalUploadProgress,
            null,
            this.dropzoneId
        );

        $("#submitUserButton").click(function() {
            SignupForm.submitForm();
        });

    }

    this.uploadFinished = function(file, response) {

        console.log(response);

        if(response.file) {

            convertImgToBase64(SignupForm.uploadPath + "/" + response.file.name, function(base64Img) {

                $("#uploadLoader").hide();

                $("#" + SignupForm.dropzoneId).html('<img src="' + encodeURI(SignupForm.uploadPath + "/" + response.file.name) + '">');
                $(".dropper").css("border", "1px solid #ffffff");
                $("#inputProfilePicture").val(base64Img);

            });
        }

    }

    this.dragStart = function() {

        $("#uploadLoader").show();
    }

    this.dragOver = function() {

        $(".dropper").css("border", "5px dotted #cccccc");
    }

    this.dragEnd = function() {

        $(".dropper").css("border", "5px dotted #ffffff");
    }

    this.drop = function() {

        $(".dropper").css("border", "5px dotted #ffffff");
    }

    this.totalUploadProgress = function(progress, totalBytes, totalBytesSent) {

        console.log(progress);
    }

    this.submitForm = function() {

        if($("#inputUsername").val().length == 0) {
            toastr.error("Please enter your username");
        }
        else if($("#inputPassword").val().length == 0) {
            toastr.error("Please enter your password");
        }
        else if($("#inputEmail").val().length == 0) {
            toastr.error("Please enter your password");
        }
        else if($("#inputProfilePicture").val().length == 0) {
            toastr.error("Please upload a profile picture");
        }
        else {
            SignupForm.SockrageUser.set({
                username : $("#inputUsername").val(),
                email : $("#inputEmail").val(),
                password : $("#inputPassword").val(),
                profilePicture : $("#inputProfilePicture").val()
            });
        }
    }
}

/**
 * Initialize a Dropzone
 * @param callback
 * @param dragStartFn
 * @param dragOverFn
 * @param dragEndFn
 * @param dragLeaveFn
 * @param dropFn
 * @param totalUploadProgressFn
 * @param queueCompleteFn
 * @param divId
 */
function initDropzone(callback, dragStartFn, dragOverFn, dragEndFn, dragLeaveFn, dropFn, totalUploadProgressFn, queueCompleteFn, divId) {

    Dropzone.options[divId] = {
        paramName: "file",
        previewsContainer: false,
        acceptedFiles: "image/*",
        processing: dragStartFn,
        dragover: function() {
            dragOverFn();
        },
        dragend: function() {
            dragEndFn();
        },
        dragleave: function() {
            dragLeaveFn();
        },
        drop: function() {
            dropFn();
        },
        success: function(file, response){
            callback(file, response);
        },
        totaluploadprogress: function(progress, totalBytes, totalBytesSent) {
            totalUploadProgressFn(progress, totalBytes, totalBytesSent);
        },
        completemultiple: function() {
            queueCompleteFn();
        }
    };

    new Dropzone("#" + divId, { url: "/upload"});

}

/**
 * Convert an image
 * to a base64 string
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}
