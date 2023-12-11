//read url redir if there
let params = (new URL(document.location)).searchParams;

//when loads run function
window.onload = function () {
//login error means no or wrong input
    if (params.has('loginErr')) {
        //after load value form loginerror is dispaly as message
        document.getElementById('errMsg').innerHTML = params.get('loginErr');
    }
    document.getElementById('email').value = params.get('email');
}