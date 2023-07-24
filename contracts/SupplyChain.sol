// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    enum State {
        Manufactured,
        ShippedByManufacturer,
        ShippedByDeliveryHub,
        ReceivedByBookstore
    }
    // Struct to store shipping information
    struct Shipment {
        uint256 transferId;
        address origin;
        address deliveryHub;
        address destination;
        string dateOfDeparture;
        State shipmentState;
        string expectedArrivalDate;
        Book[] books;
    }

    // Struct to store Books for shipping
    struct Book {
        string title;
        string author;
        uint256 bookId;
        uint256 numberOfBooks;
    }

    // Mapping to store shipments
    mapping(uint256 => Shipment) public shipments;
    // Mapping to store books
    mapping(uint256 => Book) public books;


    modifier onlyManufacturer() {
    require(msg.sender == owner, "Only the manufacturer can call this function");
    _;
}

    // Modifier to check if the shipment exists
    modifier shipmentExists(uint256 _transferId) {
        require(shipments[_transferId].transferId != 0, "Shipment does not exist");
        _;
    }
    // Modifier to check if the book exists
    modifier bookExists(uint256 _bookId) {
        require(books[_bookId].bookId != 0, "Book does not exist");
        _;
    }
    // Modifier to check if the shipment has been dispatched
    modifier shipmentDispatched(uint256 _transferId) {
        require(shipments[_transferId].shipmentState == State.ShippedByManufacturer, "Shipment has not been dispatched");
        _;
    }
    // Modifier to check if the shipment has been dispatched from the Delivery Hub
    modifier shipmentDispatchedFromDeliveryHub(uint256 _transferId) {
        require(shipments[_transferId].shipmentState == State.ShippedByDeliveryHub, "Shipment has not been dispatched from delivery hub");
        _;
    }

    // Function to get the book information by bookId
    function getBook(uint256 _bookId) public view onlyManufacturer bookExists(_bookId) returns (Book memory) {
        return books[_bookId];
    }


    // Function to add a new shipment
    function createShipment(
        uint256 _transferId,
        address _origin,
        address _deliveryHub,
        address _destination,
        string memory _dateOfDeparture,
        string memory _expectedArrivalDate,
        Book[] memory _books
    ) public onlyManufacturer {
        // Check if the shipment ID is already taken
        require(shipments[_transferId].transferId == 0, "Shipment with this ID already exists");

        // Create a new shipment
        Shipment storage newShipment = shipments[_transferId];
        newShipment.transferId = _transferId;
        newShipment.origin = _origin;
        newShipment.destination = _destination;
        newShipment.deliveryHub = _deliveryHub;
        newShipment.dateOfDeparture = _dateOfDeparture;
        newShipment.expectedArrivalDate = _expectedArrivalDate;
        newShipment.shipmentState = State.Manufactured;

        // Add books to the shipment only if they exist and there are enough copies
        for (uint256 i = 0; i < _books.length; i++) {
            uint256 bookId = _books[i].bookId;
            Book storage book = books[bookId];
            require(book.bookId != 0, "Book with this ID does not exist");
            require(book.numberOfBooks >= _books[i].numberOfBooks, "Not enough copies of the book available");

            // Deduct the shipped books from the available stock
            book.numberOfBooks -= _books[i].numberOfBooks;

            newShipment.books.push(_books[i]);
        }
    }

    // Create or update books
    function createBook(
        string memory _title,
        string memory _author,
        uint256 _bookId,
        uint256 _numberOfBooks
    ) public onlyManufacturer {
        Book storage book = books[_bookId];
        if (book.bookId == 0) {
            // Create a new book
            book.title = _title;
            book.author = _author;
            book.bookId = _bookId;
            book.numberOfBooks = _numberOfBooks;
        } else if (book.bookId != 0 && keccak256(bytes(book.title)) == keccak256(bytes(_title))) {
            // Increment the number of books
            book.numberOfBooks += _numberOfBooks;
        }
    }

    // Function to update the shipment status as delivered
    function deliveredToBookstore(uint256 _transferId) public shipmentExists(_transferId) shipmentDispatchedFromDeliveryHub(_transferId) {
        // Check if the shipment is already delivered
        require(msg.sender == shipments[_transferId].destination, "Only the destination address can receive a shipment");
        // Update the shipment status
        shipments[_transferId].shipmentState = State.ReceivedByBookstore;
    }

    // Function to dispatch shipment FROM DELIVERY HUB
        function dispatchShipmentFromDelivery(uint256 _transferId) public shipmentExists(_transferId) shipmentDispatched(_transferId) {
            require(msg.sender == shipments[_transferId].deliveryHub, "Only the delivery hub address can dispatch a shipment");
                shipments[_transferId].shipmentState = State.ShippedByDeliveryHub;
        }

    // Function to dispatch shipment 
    function dispatchShipmentFromFactory(uint256 _transferId) public shipmentExists(_transferId) {
        require(msg.sender == shipments[_transferId].origin, "Only the origin address can dispatch a shipment");
        shipments[_transferId].shipmentState = State.ShippedByManufacturer;
    }

    // Function to get the status and route of a shipment
    function getShipmentStatus(uint256 _transferId)
        public
        view
        shipmentExists(_transferId)
        returns (
            uint256,
            address,
            address,
            string memory,
            string memory,
            State,
            Book[] memory
        )
    {
        Shipment memory shipment = shipments[_transferId];

        // Check if the caller is either the delivery hub or the destination address
        require(
            msg.sender == shipment.deliveryHub || msg.sender == shipment.destination || msg.sender == shipment.origin,
            "Only the delivery hub or destination address or manufacturer can access this information"
        );

        return (
            shipment.transferId,
            shipment.origin,
            shipment.destination,
            shipment.dateOfDeparture,
            shipment.expectedArrivalDate,
            shipment.shipmentState,
            shipment.books
        );
    }
}

