$("#o_inputOrdQty").val(0);
$("#o_inputDiscount").val(0);

$(document).ready(function () {
    let nextOrderID = generateNextOrderID();
    $("#o_inputOrderId").val(nextOrderID);

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

$("#o_inputItmCode").on("change", function () {
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

let finalTotal;
let subTotal;
$("#btnAddToCart").click(function () {
    let itemID = $("#o_inputItmCode").val();
    let itemName = $("#o_lblItmName").text();
    let unitPrice = $("#o_lblItmUnitPrice").text();
    let qty = $("#o_inputOrdQty").val();
    let total = parseFloat(unitPrice) * parseFloat(qty);

    if (itemID != null) {
        let itemQTY = parseFloat($("#o_lblItmQtyLeft").text());
        let tableCheck = "notFound";
        $("#o_tBody tr").each(function () {
            let cellData = $(this).find("td:eq(0)").text();
            if (itemID == cellData) {
                tableCheck = "found";
                let orderQtyValidResult = ordQtyValidation(qty);
                if (orderQtyValidResult) {
                    let currentQty = parseFloat($(this).find("td:eq(3)").text());
                    let newQty = currentQty + parseFloat(qty);

                    if (newQty > itemQTY) {
                        alert("insufficient item amount. Please order less than the amount left");
                    } else {
                        $(this).find("td:eq(3)").text(newQty);
                        let newTotal = parseFloat(unitPrice) * newQty;
                        $(this).find("td:eq(4)").text(newTotal);
                    }
                } else {
                    alert("Order quantity required.");
                }
            }
        });

        if (tableCheck == "notFound") {
            let orderQtyValidResult = ordQtyValidation(qty);
            if (orderQtyValidResult) {
                if (parseFloat(qty) > itemQTY) {
                    alert(`insufficient item amount. Please enter an amount less than ${itemQTY}.`);
                } else {
                    let row = `<tr>
                    <td>${itemID}</td>
                    <td>${itemName}</td>
                    <td>${unitPrice}</td>
                    <td>${qty}</td>
                    <td>${total}</td>
                </tr>`;

                    $("#o_tBody").append(row);
                    orderTblRowClick();
                }
            } else {
                alert("Order quantity required.");
            }
        }
    } else {
        alert("Please select an item first");
    }

    finalTotal = 0;
    $("#o_tBody tr").each(function () {
        let eachItemTotal = parseFloat($(this).find("td:eq(4)").text());
        finalTotal = finalTotal + eachItemTotal;
        $("#o_lblTotal").html("&nbsp;" + finalTotal + "/=");
    });

    let discount = $("#o_inputDiscount").val();
    if (discount === "") {
        subTotal = finalTotal;
    } else {
        let reduce_amount = (finalTotal / 100) * parseFloat(discount);
        subTotal = finalTotal - reduce_amount;
    }
    $("#o_lblSubTotal").html("&nbsp;" + subTotal + "/=");
});


$("#o_inputDiscount").on("keyup", function (e) {
    if (finalTotal == undefined) {

    } else {
        let discount = $("#o_inputDiscount").val();
        if (discount === "") {
            subTotal = finalTotal;
        } else {
            let reduce_amount = (finalTotal / 100) * parseFloat(discount);
            subTotal = finalTotal - reduce_amount;
        }
        $("#o_lblSubTotal").html("&nbsp;" + subTotal + "/=");
    }
});

$("#o_btnPurchase").click(function () {
    if ($("#o_inputCusId").val() != null) {
        if ($("#o_tBody tr").length == 0) {
            alert("Add something to cart first");
        } else {
            let orderID = $("#o_inputOrderId").val();
            let orderDate = $("#o_inputOrderDate").val();
            let cusID = $("#o_inputCusId").val();
            let discount = parseFloat($("#o_inputDiscount").val());
            let finalPrice = subTotal;
            let orderDetails = [];

            if (discount >= 0 && discount <= 100) {
                if ($("#o_inputCash").val() == "") {
                    alert("input cash amount before purchase");
                } else {
                    $("#o_tBody tr").each(function () {
                        let orderDetail = {
                            itemCode: $(this).children().eq(0).text(),
                            unitPrice: $(this).children().eq(2).text(),
                            qty: $(this).children().eq(3).text()
                        }
                        orderDetails.push(orderDetail);

                        let item = o_findItem(orderDetail.itemCode);
                        let newQtyLeft = item.qty - orderDetail.qty;
                        item.qty = newQtyLeft;
                    });

                    let newOrder = Object.assign({}, order);

                    newOrder.oID = orderID;
                    newOrder.orderDate = orderDate;
                    newOrder.cusID = cusID;
                    newOrder.discount = discount;
                    newOrder.cash = finalPrice;
                    newOrder.orderDetails = orderDetails;

                    orderDB.push(newOrder);

                    alert("Order Placed Successfully");

                    let nextOrderID = generateNextOrderID();
                    $("#o_inputOrderId").val(nextOrderID);

                    let currentDate = new Date();
                    var formattedDate = currentDate.toISOString().split('T')[0];
                    $("#o_inputOrderDate").val(formattedDate);

                    document.getElementById("o_inputCusId").selectedIndex = -1;
                    document.getElementById("o_inputItmCode").selectedIndex = -1;
                    $("#o_inputOrdQty").val(0);
                    $("#o_inputDiscount").val(0);
                    $("#o_tBody").empty();
                    $("#o_lblCusName, #o_lblCusContact, #o_lblItmName, #o_lblItmUnitPrice, #o_lblItmQtyLeft, #o_lblTotal, #o_lblSubTotal").text("");
                    $("#o_inputCash, #o_inputBalance").val("");
                    finalTotal = 0;
                    subTotal = 0;
                }
            } else {
                alert("Discount must be between 0 and 100");
            }
        }
    } else {
        alert("Please select a customer ID");
    }
});

$("#o_inputCash").on("keyup", function () {
    let cash = parseFloat($("#o_inputCash").val());
    let balance = cash - subTotal;
    if (isNaN(balance)) {

    } else {
        if (balance >= 0) {
            $("#o_inputBalance").val(balance);
            $("#o_btnPurchase").prop("disabled", false);
            $("#o_inputCash").css({
                "background-color": "white",
                "color": "black"
            });
        } else {
            $("#o_btnPurchase").prop("disabled", true);
            $("#o_inputCash").css({
                "background-color": "red",
                "color": "white"
            });
            $("#o_inputBalance").val("Insufficient Cash");
        }
    }
});

function orderTblRowClick() {
    $("#o_tBody tr:last-of-type").dblclick(function () {
        let result = confirm("are you sure you want to remove this item?");
        if (result) {
            $(this).remove();

            finalTotal = 0;
            if ($("#o_tBody tr").length == 0) {
                $("#o_lblTotal").html(0);
            } else {
                $("#o_tBody tr").each(function () {
                    let eachItemTotal = parseFloat($(this).find("td:eq(4)").text());
                    finalTotal = finalTotal + eachItemTotal;
                    $("#o_lblTotal").html("&nbsp;" + finalTotal + "/=");
                });
            }
            let discount = $("#o_inputDiscount").val();
            if (discount === "") {
                subTotal = finalTotal;
            } else {
                let reduce_amount = (finalTotal / 100) * parseFloat(discount);
                subTotal = finalTotal - reduce_amount;
            }
            $("#o_lblSubTotal").html("&nbsp;" + subTotal + "/=");
        }
    });
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
