const DIDRegistry = artifacts.require("DIDRegistry");

contract("DIDRegistry", accounts => {
    let didRegistry;
    const owner = accounts[0];
    const anotheraccount = accounts[1];
    const sampleDID = "did:example:123456789abcdefghi";
    const sampleDocument = "sample Document";

    beforeEach(async () => {
        didRegistry = await DIDRegistry.new();
    }); 

    it("should allow a user to register a DID", async () => {
        await didRegistry.registerDID(sampleDID, sampleDocument, {from: owner});

        const result = await didRegistry.getDID(owner);
        assert.equal(result[0], sampleDID, "DID does not match");
        assert.equal(result[1], sampleDocument, "Document does not match");
    });

    it("should not allow a user to register the same DID twice", async () => {
        await didRegistry.registerDID(sampleDID, sampleDocument, {from: owner});

        try {
            await didRegistry.registerDID(sampleDID, sampleDocument, {from: owner});
            assert.fail("should have thrown an error");
        } catch (error) {
            assert.include(error.message, "DID already registered", "Error message mismatch");
        }
    });

    it("should allow a user to update their DID", async () => {
        await didRegistry.registerDID(sampleDID, sampleDocument, {from: owner});

        const newDocument = "new Document";
        await didRegistry.updateDID(sampleDID, newDocument, {from: owner});

        const result = await didRegistry.getDID(owner);
        assert.equal(result[1], newDocument, "Document does not match");
    });

    it("should not allow non-owners to update a DID", async () => {
        // Register a DID first
        await didRegistry.registerDID(sampleDID, sampleDocument, { from: owner });
    
        // Try updating the DID from another account and expect it to fail
        try {
          const newDocument = "Unauthorized Update";
          await didRegistry.updateDID(sampleDID, newDocument, { from: anotheraccount });
          assert.fail("Expected an error but did not get one");
        } catch (error) {
          assert.include(error.message, "DID not registered", "Error message mismatch");
        }
    });

    it("should retrieve a DID for a specific address", async () => {
        // Register a DID
        await didRegistry.registerDID(sampleDID, sampleDocument, { from: owner });
    
        // Fetch the DID using the owner's address and check the result
        const result = await didRegistry.getDID(owner);
        assert.equal(result[0], sampleDID, "DID does not match");
        assert.equal(result[1], sampleDocument, "DID Document does not match");
      });

      it("should allow a non-owner to view the DID document", async () => {
        // Owner registers a DID
        await didRegistry.registerDID(sampleDID, sampleDocument, { from: owner });
      
        // Non-owner fetches the DID document using the owner's address
        const result = await didRegistry.getDID(owner, { from: anotheraccount });
      
        // Check if the non-owner can successfully retrieve the DID document
        assert.equal(result[0], sampleDID, "Non-owner DID retrieval: DID does not match");
        assert.equal(result[1], sampleDocument, "Non-owner DID retrieval: DID Document does not match");
      });
      

    });

    


