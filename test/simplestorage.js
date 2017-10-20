const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", accounts => {
  it("should store the value 89.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed()
    
    // Set a number to be stored
    await simpleStorageInstance.set(89, { from: accounts[0] });

    // Get the number that was stored
    const storedData = await simpleStorageInstance.get.call();
    
    assert.equal(storedData, 89, "The value 89 was not stored.")
  });
});
