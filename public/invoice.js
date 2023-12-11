////code used from sal, chat, and and bing chat gpt
// Get the URL
let params = (new URL(document.location)).searchParams;

// On load, if there is no 'valid' key, redirect the user back to the Home page
window.onload = function() {
    if (!params.has('valid')) {
        document.write(`
            <head>
                <link rel="stylesheet" href="style.css">
            </head>
            <body style="text-align: center; margin-top: 10%;">
                <h2>ERROR: No form submission detected.</h2>
                <h4>Return to <a href="index.html">Home</a></h4> 
            </body>
        `)
    } else {
        document.getElementById('helloMsg').innerHTML = `Thank you ${params.get('name')}, we appreciate your business!`;
    }
}
//Initialize the subtotal to zero
let subtotal = 0;

// Create an empty array to store quantities
// Loop through each product in the 'products' array
let qty = [];
for (let i in products) {
    qty.push(params.get(`qty${i}`));
}

// Loop through each quantity in the 'qty' array
// Check if the quantity is 0 or an empty string, and if so, skip to the next iteration
for (let i in qty) {
    if (qty[i] == 0 || qty[i] == '') continue;

    // Calculate the extended price for the current product based on its quantity and price
    extended_price = (params.get(`qty${i}`) * products[i].price).toFixed(2);

     // Convert the extended price to a number and add it to the subtotal
    subtotal += Number(extended_price);

    //Invoice table of products purchased
    document.querySelector('#invoice_table').innerHTML += `
        <tr style="border: none;">
            <td width="10%"><div class="icon"><img src="${products[i].image}" alt="${products[i].alt}" style="border-radius: 5px;width: 200px; height: 150px;"><div class="popup">${products[i].model}</div>
            </div></td>
            <td><strong>${products[i].model}<strong></td>
            <td>${qty[i]}</td>
            <td>${products[i].qty_available}</td>
            <td>$${products[i].price.toFixed(2)}</td>
            <td>$${extended_price}</td>
        </tr>
    `;
}

// Sales tax
let tax_rate = (4.7/100);
let tax_amt = subtotal * tax_rate;

// Shipping
if (subtotal < 300) {
    shipping = 5;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else if (subtotal >= 300 && subtotal < 500) {
    shipping = 10;
    shipping_display = `$${shipping.toFixed(2)}`;
    total = Number(tax_amt + subtotal + shipping);
}
else {
    shipping = 0;
    shipping_display = 'FREE';
    total = Number(tax_amt + subtotal + shipping);
}
 //Table for subtotal, tax, shipping, and total under main invoice table
document.querySelector('#total_display').innerHTML += `
    <tr style="border-top: 2px solid black;">
        <td colspan="5" style="text-align:center;">Sub-total</td>
        <td>$${subtotal.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Tax @ ${Number(tax_rate) * 100}%</td>
        <td>$${tax_amt.toFixed(2)}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;">Shipping</td>
        <td>${shipping_display}</td>
    </tr>
    <tr>
        <td colspan="5" style="text-align:center;"><b>Total</td>
        <td><b>$${total.toFixed(2)}</td>
    </tr>
`;