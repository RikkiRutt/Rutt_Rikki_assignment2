////code used from sal, chat, and bing chat gpt
// Get the URL
let params = (new URL(document.location)).searchParams;

// Update the window.onload function to handle WebSocket messages
window.onload = function () {
    console.log('window.onload function called');

    // Check for server-side validation errors
    if (params.has('error')) {
        document.getElementById('errMsg').innerHTML = 'No quantities selected.';
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = '';
        }, 2000);
    } else if (params.has('inputErr')) {
        document.getElementById('errMsg').innerHTML = 'Please fix the quantity errors before proceeding.';
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = '';
        }, 2000);

        for (let i in products) {
            let qtyInput = document.querySelector(`#qty${i}_entered`);
            if (!qtyInput) {
                console.error(`Qty input not found for product ${i}`);
                continue; // Skip to the next iteration if the input is not found
            }

            let storedInvalidQty = localStorage.getItem(`invalidQty_${i}`);

            if (storedInvalidQty !== null) {
                // Convert the stored quantity to a valid non-negative integer
                let storedQuantity = Number(storedInvalidQty);
                if (!isNaN(storedQuantity) && storedQuantity >= 0 && Number.isInteger(storedQuantity)) {
                    // Set the input field's value to the stored valid quantity
                    qtyInput.value = storedQuantity;

                    // Validate and display the error message for the stored valid quantity
                    validateAndDisplayMessage(qtyInput, products[i].qty_available);
                } else {
                    // Remove the stored invalid quantity from local storage
                    localStorage.removeItem(`invalidQty_${i}`);
                }
            } else if (params.has(`qty${i}`)) {
                // Set the input field's value to the quantity from the URL parameters
                qtyInput.value = params.get(`qty${i}`);
            }

            // Validate and display error messages for the current input field
            let qtyError = document.getElementById(`qty${[i]}_error`);
            if (!qtyError) {
                console.error(`Qty error element not found for product ${i}`);
                continue; // Skip to the next iteration if the error element is not found
            }

            let errorMessages = validateQuantity(qtyInput.value, products[i].qty_available);

            if (errorMessages.length > 0) {
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = 'red';
            } else {
                qtyError.innerHTML = '';
                qtyInput.parentElement.style.borderColor = 'black';
            }
        }
    }
    if (params.has('name')) {
        document.getElementById('helloMsg').innerHTML = `Thank You ${params.get('name')} we appreciate your business!`;
        for (let i in products) {
            qty_form[`qty${i}`].value = params.get(`qty${i}`);
        }
    }
};

// Add this line to create a WebSocket connection
const socket = new WebSocket('ws://localhost:8080');

// WebSocket Handling
socket.addEventListener('open', function (event) {
    console.log('WebSocket connection opened:', event);

    // After the WebSocket is open, trigger the rest of the window.onload code
    window.dispatchEvent(new Event('websocket_open'));
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    updateQuantityAvailable(data.productId, data.quantityAvailable);
});

socket.addEventListener('close', function (event) {
    if (event.wasClean) {
        console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
        console.error('Connection died');
    }
});

socket.addEventListener('error', function (error) {
    console.error('WebSocket Error:', error);
});

// Listen for the custom event to continue the initialization
window.addEventListener('websocket_open', function () {
    // WebSocket Handling
    socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        updateQuantityAvailable(data.productId, data.quantityAvailable);
    });

    // Function to update the displayed quantity available
    function updateQuantityAvailable(productId, quantityAvailable) {
        const qtyAvailableElement = document.querySelector(`#qty${productId}_available`);
        if (qtyAvailableElement) {
            qtyAvailableElement.textContent = `Available: ${quantityAvailable}`;
        }
    }
});

// Odd added code in this section before client-side validation was gpt to get the blue message for valid quantitys input
// Populate the DOM Form with the product details
let productRow = document.querySelector('.row'); // Get the product row outside the loop

for (let i = 0; i < products.length; i++) {
    // Create a product card for each product
    let productCard = document.createElement('div');
    productCard.className = 'col-md-4 product_card';
    productCard.style = 'margin-bottom: 40px; padding: 30px;';

    productCard.innerHTML = `
        <div>
            <h5 class="product_name"><b>${products[i].model}</b></h5>
            <h5>$${(products[i].price).toFixed(2)}</h5>
        </div>  
        <img src="${products[i].image}" style="width: 300px; height: 250px;" class="img-thumbnail" alt="${products[i].alt}">
        <div style="height: 90px;">
            <table style="width: 100%; text-align: center; font-size: 18px;" id="product_table">
                <tr>
                    <!-- Display available quantity for the product -->
                    <td style="text-align: left; width: 35%;">Available: ${products[i].qty_available}</td>

                    <!-- Label for quantity -->
                    <td style="text-align: left; width: 75%;"><label id="qty${[i]}_label" style="margin: 6px 0; padding-right: 10px;">Qty:</label></td>
                </tr>
                <tr>
                    <!-- Display sold quantity for the product -->
                    <td style="text-align: left; width: 35%;" id="qty_sold${i}">Sold: ${products[i].qty_sold}</td>

                    <!-- Input field for quantity and buttons to increase/decrease -->
                    <td style="text-align: left; width: 35%;" rowspan="2">
                        <div style="display: flex; justify-content: center; align-items: center; border-radius: 40px; border: 2px solid black; width: 60%; height: 40px; padding: 10px;">
                            <!-- Decrease quantity button with an onclick event -->
                            <button type="button" class="qtyButton highlight" style="background-color: transparent; border: none; cursor: pointer; padding: 5px 10px; font-size: 40px; margin-bottom: 11px;" onclick="changeQuantity(${i}, -1)">-</button>

                            <!-- Input field for quantity -->
                            <input type="text" autocomplete="off" placeholder="0" name="qty${[i]}" id="qty${[i]}_entered" class="inputBox" style="background-color: transparent; border: none; width: 30px; text-align: center; margin: 0 10px; border: none;" oninput="validateAndDisplayMessage(this, ${products[i].qty_available})">

                            <!-- Increase quantity button with an onclick event -->
                            <button type="button" class="qtyButton highlight" style="background-color: transparent; border: none; cursor: pointer; padding: 5px 10px; font-size: 30px; margin-bottom: 7px;" onclick="changeQuantity(${i}, 1)">+</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <!-- Error message for quantity validation -->
                    <td colspan="3" style="padding-top: 60px;"><div id="qty${[i]}_error" style="color: red;"></div></td>
                </tr>
            </table>
        </div>  
    `;

    // Add the product card to the row
    productRow.appendChild(productCard);
}

// Function to handle quantity changes
function changeQuantity(index, delta) {
    let inputField = document.getElementById(`qty${index}_entered`);
    let currentValue = parseInt(inputField.value, 10) || 0;
    let newValue = currentValue + delta;

    // Update the input field value
    inputField.value = newValue;

    // Trigger input event for immediate validation
    inputField.dispatchEvent(new Event('input'));
}

// Do client-side validation
function validateQuantity(quantity, availableQuantity) {
    let errors = []; // Initialize an array to hold error messages

    quantity = Number(quantity);

    if ((isNaN(quantity)) && (quantity != '')) {
        errors.push("Not a number. Please enter a non-negative quantity to order.");
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        errors.push("Negative quantity and not an Integer. Please enter a non-negative quantity to order.");
    } else if (quantity < 0) {
        errors.push("Negative quantity. Please enter a non-negative quantity to order.");
    } else if (quantity !=0 && quantity != '' && !Number.isInteger(quantity)) {
        errors.push("Not an Integer. Please enter a non-negative quantity to order.");
    } else if (quantity > availableQuantity) {
        errors.push(`We do not have ${quantity} available.`);
    }

    return errors; // Return the array of errors
}

// CHECK INPUT BOXES AGAINST DATA VALIDATION FUNCTION
function validateAndDisplayMessage(textBox, availableQuantity) {
    let str = String(textBox.value);

    // Check if the first character is '0' and remove it if found
    if (str.charAt(0) == '0') {
        textBox.value = Number(str.slice(0, 0) + str.slice(1, str.length));
    }

    // Convert the input value to a number
    let inputValue = Number(textBox.value);

    // Validate the user input quantity using the updated validateQuantity function
    let errorMessages = validateQuantity(inputValue, availableQuantity);

    // Check if there are any error messages and update the display
    let errorDisplay = document.getElementById(textBox.name + '_error');

    if (errorMessages.length > 0) {
        // If there are error messages, change the color to red
        errorDisplay.style.color = 'red';
        textBox.parentElement.style.borderColor = 'red';
        errorDisplay.innerHTML = errorMessages.join('<br>');

        // Store the invalid quantity in local storage
        localStorage.setItem(`invalidQty_${textBox.name}`, textBox.value);
    } else {
        // If no error messages, change the color to blue
        errorDisplay.style.color = 'blue';
        textBox.parentElement.style.borderColor = 'blue';
        errorDisplay.innerHTML = `You have selected ${inputValue}.`;

        // Remove the stored invalid quantity from local storage
        localStorage.removeItem(`invalidQty_${textBox.name}`);
    }
}

// STICKY NAV BAR: Referenced from https://www.w3schools.com/howto/howto_js_navbar_sticky.asp
window.onscroll = function() {
    stickyNav()
};

// Get the navbar using its id
let navbar = document.getElementById("sticky-navbar");

// offsetTop returns the top position relative to the parent (documentation: https://www.w3schools.com/jsref/prop_element_offsettop.asp)
// The parent of navbar is body
let sticky = navbar.offsetTop;

function stickyNav() {
    // pageYOffSet returns the pixels a document has scrolled from the upper left corner of the window
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
    } else {
        navbar.classList.remove("sticky");
    }
};




