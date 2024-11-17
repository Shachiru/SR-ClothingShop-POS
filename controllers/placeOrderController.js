$(document).ready(function () {
    let nextOrderID = generateNextOrderID();
    $("#o_inputOrderID").val(nextOrderID);

    let currentDate = new Date();
    var formattedDate = currentDate.toISOString().split('T')[0];
    $("#o_inputOrderDate").val(formattedDate);

    loadCusIds();
    loadItemCodes();
});

$("#o_inputCusId").on("change", function () {
    let selectedOption = $(this).val();

    let customer = o_findCustomer(selectedOption);
    $("#o_lblCusName").text(customer.name);
    $("#o_lblCusContact").text(customer.contact);
});

$("#o_inputItmCode").on("change",function () {
    let selectedOption = $(this).val();

    let item = o_findItem(selectedOption);
    $("#o_lblItmName").text(item.name);
    $("#o_lblItmUnitPrice").text(item.price);
    $("#o_lblItmQtyLeft").text(item.qty);
});

function generateNextOrderID() {
    const highestOrderID = orderDB.reduce((max, order) => {
        const orderNumber = parseInt(order.oID.split('-')[1]);
        return orderNumber > max ? orderNumber : max;
    }, 0);

    const nextOrderNumber = highestOrderID + 1;
    return `OID-${String(nextOrderNumber).padStart(3, '0')}`;
}

function loadCusIds() {
    for (let i = 0; i < customerDB.length; i++) {
        let cusId = customerDB[i].id;

        $("#o_inputCusId").append(`<option>${cusId}</option>`);
    }
    document.getElementById("o_inputCusId").selectedIndex = -1;
}

function loadItemCodes() {
    for (let i = 0; i < itemDB.length; i++) {
        let itemCode = itemDB[i].id;

        $("#o_inputItmCode").append(`<option>${itemCode}</option>`);
    }
    document.getElementById("o_inputItmCode").selectedIndex = -1;
}

function o_findCustomer(id) {
    return customerDB.find(function (customer) {
        return customer.id == id;
    });
}

function o_findItem(id) {
    return itemDB.find(function (item) {
        return item.id == id;
    });
}
