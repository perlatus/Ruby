function handleNsfwGate() {
    var nsfwGate = document.getElementById("nsfw-gate");
    function showNsfwGate() {
        nsfwGate.style = "";
    }
    function hideNsfwGate() {
        nsfwGate.style = "display:none";
    }

    var nsfwOk = false;
    document.cookie.split(";").find(function (c) {
        if (c.trim() === "nsfwOk=true") {
            nsfwOk = true;
        }
    });

    if (nsfwOk) {
        return;
    } else {
        showNsfwGate();
    }

    var consent = document.getElementById("nsfw-consent");
    var legal = document.getElementById("nsfw-legal");
    var submit = document.getElementById("nsfw-submit");

    function validate() {
        if (!consent.checked || !legal.checked) {
            submit.setAttribute("disabled", "");
        } else {
            submit.removeAttribute("disabled", "");
        }
    }

    function enter() {
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "nsfwOk=true; Path=/; SameSite=strict; Expires=" + date.toUTCString();
        hideNsfwGate();
    }

    validate();
    consent.onchange = validate;
    legal.onchange = validate;
    submit.onclick = enter;
    // foo
}; handleNsfwGate();