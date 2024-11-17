var customerDB = [
    {
        id: "C00-001",
        name: "Shachiru",
        address: "Beliatta",
        contact: "0779276268"
    },
    {
        id: "C00-002",
        name: "Lakhini",
        address: "Matara",
        contact: "0778585676"
    },
    {
        id: "C00-003",
        name: "Vihanga",
        address: "Colombo",
        contact: "0747754344"
    },
    {
        id: "C00-004",
        name: "Kasun",
        address: "Dikwella",
        contact: "0783434555"
    },
    {
        id: "C00-005",
        name: "Dhananjaya",
        address: "Ahangama",
        contact: "0779887654",
    },
];

var itemDB = [
    {
        id: "I00-001",
        name: "Nike T-shirt",
        price: "3500.00",
        qty: "100",
    },
    {
        id: "I00-002",
        name: "Denim Jeans",
        price: "4600.00",
        qty: "80",
    },
    {
        id: "I00-003",
        name: "Cap",
        price: "900.00",
        qty: "30",
    },
    {
        id: "I00-004",
        name: "Trousers",
        price: "2500.00",
        qty: "50",
    },
    {
        id: "I00-005",
        name: "Socks",
        price: "400.00",
        qty: "200",
    },
];

var orderDB = [
    {
        oID: "OID-001", orderDate: "2022/06/01", cusID: "C-001", discount: 5, cash: 3000,
        orderDetails: [
            {itmCode: "I-001", qty: 2, unitPrice: 3500},
            {itmCode: "I-002", qty: 1, unitPrice: 4600},
        ]
    }
]