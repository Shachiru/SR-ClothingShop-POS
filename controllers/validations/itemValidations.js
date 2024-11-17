// validation for customers
const ITEM_CODE_REGEX = /^(I00-)[0-9]{3}$/;
const ITEM_NAME_REGEX = /^.{3,}$/;
const UNIT_PRICE_REGEX = /\d+(\.\d{1,2})/;
const QTY_REGEX = /^\d+(\.\d{1,2})?$/;

//add validations and text fields to the
let i_validationArray = new Array();
i_validationArray.push({field: $("#item_id"), regEx: ITEM_CODE_REGEX});
i_validationArray.push({field: $("#item_name"), regEx: ITEM_NAME_REGEX});
i_validationArray.push({field: $("#item_unitPrice"), regEx: UNIT_PRICE_REGEX});
i_validationArray.push({field: $("#item_qty"), regEx: QTY_REGEX});

setItemBtn();
$(".i_err-label").css("display", "none");

$("#item_id,#item_name,#item_unitPrice,#item_qty").on("keydown keyup", function (e) {
    let indexNo = i_validationArray.indexOf(i_validationArray.find((i) => i.field.attr("id") == e.target.id));

    if (e.key == "Tab") {
        e.preventDefault();
    }

    itemCheckValidations(i_validationArray[indexNo]);

    setItemBtn();

    if (e.key == "Enter") {

        if (e.target.id != i_validationArray[i_validationArray.length - 1].field.attr("id")) {
            if (itemCheckValidations(i_validationArray[indexNo])) {
                i_validationArray[indexNo + 1].field.focus();
            }
        } else {
            if (itemCheckValidations(i_validationArray[indexNo])) {
                saveItem();
            }
        }
    }
});

function itemCheckValidations(object) {
    if (object.regEx.test(object.field.val())) {
        setItemBorder(true, object);
        object.field.parent().children().eq(2).css("display", "none");
        return true;
    }
    setItemBorder(false, object);
    object.field.parent().children().eq(2).css("display", "block");
    return false;
}

function setItemBorder(bool, ob) {
    if(ob.field.val().length>0){
        if(!bool){
            ob.field.css("border", "2px solid red" );
            ob.field.removeClass("border-secondary-subtle");
        }else{
            ob.field.css("border", "2px solid green" );
            ob.field.removeClass("border-secondary-subtle");
        }
    }else{
        ob.field.addClass("border-secondary-subtle");
    }
}

function setItemBtn() {
    if (itemCheckAll()) {
        $("#item_btnSave").prop("disabled", false);
        $("#item_btnUpdate").prop("disabled", false);
    } else {
        $("#item_btnSave").prop("disabled", true);
        $("#item_btnUpdate").prop("disabled", true);
    }

    let id = $("#item_id").val();
    if (findItem(id) == undefined) {
        $("#item_btnDelete").prop("disabled", true);
    } else {
        $("#item_btnDelete").prop("disabled", false);
    }
}

function itemCheckAll() {
    for (let i = 0; i < i_validationArray.length; i++) {
        if (!itemCheckValidations(i_validationArray[i])) return false;
    }
    return true;
}