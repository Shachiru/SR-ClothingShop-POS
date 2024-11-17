document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        if (section.id !== "homeContent") {
            section.style.display = "none";
        }
    });

    document.getElementById("linkHome").addEventListener("click", function () {
        toggleSection("homeContent");
    });
    document
        .getElementById("linkCustomer")
        .addEventListener("click", function () {
            toggleSection("customerContent");
        });
    document.getElementById("linkItem").addEventListener("click", function () {
        toggleSection("itemContent");
    });
    document
        .getElementById("linkPlaceOrder")
        .addEventListener("click", function () {
            toggleSection("placeOrderContent");
        });
});

function toggleSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";
}
