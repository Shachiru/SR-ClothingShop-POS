// clear button
$("#cus_btnClear").click(function () {
    clearTxtFields();
});

function clearTxtFields() {
    $("#customer_id,#customer_name,#customer_address,#customer_contact").val("");
    $("#customer_id,#customer_name,#customer_address,#customer_contact").addClass(
        "border-secondary-subtle"
    );
    setBtn();
    $(".err-label").css("display", "none");
}
// save button
$("#cus_btnSave").click(function () {
    saveCustomer();
    $("#customer_id").empty();
    getAllCustomers();
    clearTxtFields();
});

function saveCustomer() {
    let cusId = $("#customer_id").val();
    if (findCustomer(cusId.trim()) == undefined) {
        let cusName = $("#customer_name").val();
        let cusAddress = $("#customer_address").val();
        let cusContact = $("#customer_contact").val();

        let newCustomer = Object.assign({}, customer);

        newCustomer.id = cusId;
        newCustomer.name = cusName;
        newCustomer.address = cusAddress;
        newCustomer.contact = cusContact;

        customerDB.push(newCustomer);

    }else {
        alert("Please fill all the fields");
    }
}

// update button
$("#cus_btnUpdate").click(function () {
    let id = $("#customer_id").val();
    updateCustomer(id.trim());
    getAllCustomers();
    clearTxtFields();
})

function updateCustomer(id) {
    let customer = findCustomer(id);

    if (customer == undefined) {
        alert("Please fill all the fields");
    } else {
        let result = confirm("Confirm customer details?");
        if (result) {
            let cusName = $("#customer_name").val();
            let cusAddress = $("#customer_address").val();
            let cusContact = $("#customer_contact").val();

            customer.name = cusName;
            customer.address = cusAddress;
            customer.contact = cusContact;
        }
    }
}

// delete button
$("#cus_btnDelete").click(function () {
    let id = $("#customer_id").val();
    deleteCustomer(id.trim());
    getAllCustomers();
    clearTxtFields();
})

function deleteCustomer(id) {
    let customer = findCustomer(id);

    if (customer == undefined) {
        alert(`No customer with the ID: ${id} . Please enter the ID again.`);
    }else {
        let result = confirm("Confirm delete");
        if (result) {
            let status = "pending";
            for (let i = 0; i < customerDB.length; i++) {
                if (customerDB[i].id == id) {
                    customerDB.splice(i, 1);
                    status = "success"
                    alert("Customer deleted successfully.");
                }
            }
            if (status == "pending") {
                alert("Customer not removed !");
            }
        }
    }
}

function findCustomer(id) {
    return customerDB.find(function (customer) {
        return customer.id == id;
    })
}

getAllCustomers();

function getAllCustomers() {
    $("#cus-tbl").empty();

    for (let i = 0; i < customerDB.length; i++) {
        let id = customerDB[i].id;
        let name = customerDB[i].name;
        let address = customerDB[i].address;
        let contact = customerDB[i].contact;

        let row = `<tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${address}</td>
                    <td>${contact}</td>
                    </tr>`;
        $("#cus-tbl").append(row);
    }
    onTblRowClick();
}

function onTblRowClick() {
    let singleClick;

    $("#cus-tbl>tr").on("mousedown", function (event) {
        if (event.which === 1) {
            let row = $(this);
            if (singleClick) {
                clearTimeout(singleClick);
                singleClick = null;
                // deleteCustomer(row.children().eq(0).text());
                getAllCustomers();
            } else {
                singleClick = setTimeout(function () {
                    singleClick = null;
                    let id = row.children().eq(0).text();
                    let name = row.children().eq(1).text();
                    let address = row.children().eq(2).text();
                    let contact = row.children().eq(3).text();
                    setDataToTxtFields(id, name, address, contact);
                });
            }
        }
    });
}

function setDataToTxtFields(id, name, address, contact) {
    $("#customer_id").val(id);
    $("#customer_name").val(name);
    $("#customer_address").val(address);
    $("#customer_contact").val(contact);
}