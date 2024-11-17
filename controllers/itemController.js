getAllItems();
// clear button
$("#item_btnSave").click(function () {
    saveItem();
    $("#item_id").empty();
    loadItemCodes();
    getAllItems();
    clearItemTxtFields();
});

$("#item_btnUpdate").click(function () {
    let id = $("#item_id").val();
    updateItem(id.trim());
    getAllItems();
    clearItemTxtFields();
});

$("#item_btnDelete").click(function () {
    let id = $("#item_id").val();
    deleteItem(id.trim());
    getAllItems();
    clearItemTxtFields();
})
$("#item_btnClear").click(function () {
    clearItemTxtFields();
});
// save button
function saveItem() {
    let itemId = $("#item_id").val();

    if (findItem(itemId.trim()) == undefined) {
        let itemName = $("#item_name").val();
        let itemUnitPrice = $("#item_unitPrice").val();
        let itemQty = $("#item_qty").val();

        let newItem = Object.assign({}, item);

        newItem.id = itemId;
        newItem.name = itemName;
        newItem.price = itemUnitPrice;
        newItem.qty = itemQty;

        itemDB.push(newItem);
    } else {
        alert("Please fill all the fields");
    }

}
function updateItem(id) {

    let item = findItem(id);
    if (item == undefined) {
        alert("Please fill all the fields");
    } else {
        let result = confirm("Confirm item details?");
        if (result) {
            let itemName = $("#item_name").val();
            let itemUnitPrice = $("#item_unitPrice").val();

            let itemQty = $("#item_qty").val();
            item.name = itemName;
            item.price = itemUnitPrice;
            item.qty = itemQty;
        }
    }
}
// delete button
function deleteItem(id) {
    let item = findItem(id);

    if (item == undefined) {
        alert(`No item with this ID: ${id} . Please enter the ID again.`);
    } else {
        let result = confirm("Confirm delete?");
        if (result) {
            let status = "pending";
            for (let i = 0; i < itemDB.length; i++) {
                if (itemDB[i].id == id) {
                    itemDB.splice(i, 1);
                    status = "success"
                    alert("Item deleted successfully.");
                }
            }
            if (status == "pending") {
                alert("Item not removed!");
            }
        }
    }

}
function findItem(id) {
    return itemDB.find(function (item) {
        return item.id == id;
    });
}

function getAllItems() {
    $("#item-tbl").empty();

    for (let i = 0; i < itemDB.length; i++) {
        let id = itemDB[i].id;
        let name = itemDB[i].name;
        let price = itemDB[i].price;
        let qty = itemDB[i].qty;

        let row = `<tr>`
            + `<td>${id}</td>`
            + `<td>${name}</td>`
            + `<td>${price}</td>`
            + `<td>${qty}</td>`
            + `</tr>`;
        $("#item-tbl").append(row);
    }
    onItemTblRowClick();
}

function onItemTblRowClick() {
    let singleClick;

    $("#item-tbl>tr").on("mousedown", function (event) {
        if (event.which === 1) {
            let row = $(this);
            if (singleClick) {
                clearTimeout(singleClick);
                singleClick = null;
                // deleteCustomer(row.children().eq(0).text());
                getAllItems();
            } else {
                singleClick = setTimeout(function () {
                    singleClick = null;
                    let id = row.children().eq(0).text();
                    let name = row.children().eq(1).text();
                    let price = row.children().eq(2).text();
                    let qty = row.children().eq(3).text();
                    setDataToItemTxtFields(id, name, price, qty);
                });
            }
        }
    });
}

function setDataToItemTxtFields(id, name, price, qty) {
    $("#item_id").val(id);
    $("#item_name").val(name);
    $("#item_unitPrice").val(price);
    $("#item_qty").val(qty);
    setItemBtn();
}

function clearItemTxtFields() {
    $("#item_id,#item_name,#item_unitPrice,#item_qty").val("");
    $("#item_id,#item_name,#item_unitPrice,#item_qty").addClass("border-secondary-subtle");
    setItemBtn();
    $(".err-label").css("display", "none");
}
