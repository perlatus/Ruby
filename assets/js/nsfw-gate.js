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
        if (c.trim() === "nsfwOk") {
            nsfwOk = true;
        }
    });

    if (nsfwOk) {
        return
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
        document.cookie = "nsfwOk; " + document.cookie;
        hideNsfwGate();
    }

    validate();
    consent.onchange = validate;
    legal.onchange = validate;
    submit.onclick = enter;
    // foo
}; handleNsfwGate();