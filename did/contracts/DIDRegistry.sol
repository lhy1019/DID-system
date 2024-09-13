// spdx-license-identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    struct DIDDocument {
        string did;
        string document;
        uint256 updatedAt;
    }

    mapping(address => DIDDocument) private didDocuments;

    event DIDRegistered(address indexed owner, string did, string document);
    event DIDUpdated(address indexed owner, string did, string document);

    function registerDID(string memory _did, string memory _document) public {
        require(bytes(didDocuments[msg.sender].did).length == 0, "DID already registered");
        didDocuments[msg.sender] = DIDDocument(_did, _document, block.timestamp);
        emit DIDRegistered(msg.sender, _did, _document);
    }

    function updateDID(string memory _did, string memory _document) public {
        require(bytes(didDocuments[msg.sender].did).length > 0, "DID not registered");
        didDocuments[msg.sender] = DIDDocument(_did, _document, block.timestamp);
        emit DIDUpdated(msg.sender, _did, _document);
    }

    function getDID(address _owner) public view returns (string memory, string memory, uint256) {
        DIDDocument memory doc = didDocuments[_owner];
        return (doc.did, doc.document, doc.updatedAt);
    }
}
