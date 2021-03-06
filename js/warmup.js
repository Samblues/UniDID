var view = {
    height: undefined,
    width: undefined,
};

var settings = {
    not: undefined,
    td: undefined,
    ts: undefined,
    ti: undefined,
};

var playLoops = 0;
var score = 0;

$(document).ready(function () {
    $("#instruction-view").fadeIn("fast");
    $("#links").fadeIn("fast");

    $("#settings").hide();
    resizeWindow();
    $("#settings-button").click(function () {
        if ($("#settings-button").html() === "Click me to edit settings!") {
            $("#settings-button").html("Click me to close the settings!");
            $("#settings").show();
        } else {
            $("#settings-button").html("Click me to edit settings!");
            $("#settings").hide();
        }
    });

    $("#play").click(function () {
        settings.not = parseInt(document.getElementsByName("numberOfTargets")[0].value);
        settings.td = parseInt(document.getElementsByName("targetDuration")[0].value);
        settings.ts = parseInt(document.getElementsByName("targetSize")[0].value);
        settings.ti = parseInt(document.getElementsByName("targetInterval")[0].value);
        $("#links").fadeOut("fast");
        $("#instruction-view").fadeOut("fast", function () {
            $("#game-view").fadeIn("fast", function () {
                playLoops = 0;
                score = 0;
                playGame(settings.not, settings.td, settings.ts, settings.ti);
            });
        });
    });

    $("#home").click(function () {
        $("#game-over").fadeOut("fast", function () {
            $("#links").fadeIn("fast");
            $("#instruction-view").fadeIn("fast", function () {
                document.getElementsByName("numberOfTargets")[0].value = settings.not;
                document.getElementsByName("targetDuration")[0].value = settings.td;
                document.getElementsByName("targetSize")[0].value = settings.ts;
                document.getElementsByName("targetInterval")[0].value = settings.ti;
                score = 0;
                playLoops = 0;
            });
        });
    });

    $("#play-again").click(function () {
        $("#links").fadeOut("fast");
        $("#game-over").fadeOut("fast", function () {
            $("#game-view").fadeIn("fast", function () {
                score = 0;
                playLoops = 0;
                playGame(settings.not, settings.td, settings.ts, settings.ti);
            });
        });
    });

    $(window).resize(resizeWindow);
});

function resizeWindow() {
    view.width = $(window).width();
    view.height = $(window).height();
    $("#game-view").height(view.height).width(view.width);
}

function playGame(numberOfTargets, targetDuration, targetSize, targetInterval) {
    var div = $("<div>");
    div.css("width", targetSize + "px");
    div.css("height", targetSize + "px");

    var randomY = Math.random() * view.height - targetSize;
    var randomX = Math.random() * view.width - targetSize;

    if (randomY - targetSize < 0) randomY = targetSize;
    if (randomY + targetSize > view.height) randomY = view.height - targetSize;
    if (randomX - targetSize < 0) randomX = targetSize;
    if (randomX + targetSize > view.width) randomX = view.width - targetSize;

    div.css("top", randomY + "px");
    div.css("left", randomX + "px");

    div.css("position", "absolute");

    $("#game-view").append(div);

    setTimeout(function () {
        div.remove();
    }, targetDuration);

    div.click(function () {
        score++;
        div.remove();
    });

    playLoops++;

    // Check if game is over
    if (playLoops === numberOfTargets) {
        setTimeout(function () {
            $("#game-view").fadeOut("fast", function () {
                $("#links").fadeIn("fast");
                $("#game-over").fadeIn("fast", function () {
                    var accuracy = Math.round(score / playLoops * 100);

                    $("#grade").html(generateGrade(accuracy));

                    accuracy >= 76 ? (
                        $("#text-grade").html("Great job! "),
                        $("#grade-punction").html("! Nice!")
                    ) : (
                        $("#text-grade").html("Better luck next time. "),
                        $("#grade-punction").html(". You can do better than that.")
                    );

                    $("#score-over").html(score);
                    $("#total-targets-over").html(playLoops);
                    $("#accuracy-percent").html(accuracy);
                });
            });
        }, targetInterval + targetDuration / 2);
    } else {
        setTimeout(function () {
            playGame(numberOfTargets, targetDuration, targetSize, targetInterval)
        }, targetInterval);
    }
}

function generateGrade(accuracy) {
    // I hate this function, but I couldn't find another way.
    if (accuracy > 97) {
        return "A+";
    } else if (96 >= accuracy && accuracy >= 93) {
        return "A";
    } else if (92 >= accuracy && accuracy >= 90) {
        return "A-";
    } else if (89 >= accuracy && accuracy >= 87) {
        return "B+";
    } else if (86 >= accuracy && accuracy >= 83) {
        return "B";
    } else if (82 >= accuracy && accuracy >= 80) {
        return "B-";
    } else if (79 >= accuracy && accuracy >= 77) {
        return "C+";
    } else if (76 >= accuracy && accuracy >= 73) {
        return "C";
    } else if (72 >= accuracy && accuracy >= 70) {
        return "C-";
    } else if (69 >= accuracy && accuracy >= 67) {
        return "D+";
    } else if (66 >= accuracy && accuracy >= 63) {
        return "D";
    } else if (62 >= accuracy && accuracy >= 60) {
        return "D-";
    } else if (accuracy <= 59) {
        return "F";
    }
}