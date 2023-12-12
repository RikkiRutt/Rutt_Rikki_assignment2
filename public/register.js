let params = (new URL(document.location)).searchParams;

//function when window load
window.onload = function () {
    let register_form = document.forms['register_form'];

    //take prior input and put back into input field
    register_form.elements['name'].value = params.get('name');
    register_form.elements['email'].value = params.get('email');

    //get err msg and dispay
    for (let i = 0; i <= document.forms['register_form'].elements.length; i++) {
        let inputName = register_form.elements[i].name;

        if (params.has(`${inputName}_length`)) {
            document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_length`);

            if (params.has(`${inputName}_length`)) {
                document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_length`) + `<br>` + params.get(`${inputName}_type`);
        }
    }
    else if (params.has(`${inputName}_type`)) {
        document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_type`);
    }
}
}