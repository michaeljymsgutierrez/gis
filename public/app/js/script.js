/*
    CG Script
*/

/*
    Continous check input for address
*/
var checkReceiveAlert = setInterval(function() {
    var pa = $('#poultryaddress');
    if (pa.length == 1) {
        // clearInterval(checkReceiveAlert);
        $(pa).geocomplete({ details: "form" });
    }
}, 3000);