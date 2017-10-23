const { toAscii } = require("./utils");

const TranslationContract = artifacts.require("./TranslationContract.sol");

contract("TranslationContract", accounts => {
  const [joshs_address, marys_address, franks_address] = accounts;
  const Languages = { English: 1, Spanish: 2, Chinese: 3, French: 4 };

  it("should return the string to be translated", async () => {
    const translationInstance = await TranslationContract.deployed();

    await translationInstance.newTranslation(
      "Test Translation",
      Languages.English,
      Languages.French,
      {from: joshs_address, value: 10 }
    );

    await translationInstance.newTranslation(
      "Hi, how are you?",
      Languages.English,
      Languages.French,
      {from: joshs_address, value: 10 }
    );

    const result = await translationInstance.getAllOpenRequests.call();
    const str = await translationInstance.getRequestString(result[1]);
    
    // const str = toAscii(result[1]).replace(/\0/g, "");

    console.log("Translation String = ", str);
    assert.equal(str, "Hi, how are you?");
  });

  it("should return a failed transaction because the string has not been translated", async () => {
    const translationInstance = await TranslationContract.deployed();
    const result = await translationInstance.getTranslatedString.call(0);
    
    console.log (result);
  });

  it("should return the translated string", async () => {
    const translationInstance = await TranslationContract.deployed();

    await translationInstance.performTranslation("Bonjour, comment ça va?", 1);
    const result = await translationInstance.getTranslatedString.call(1);

    console.log(result);
    assert.equal(result,"Bonjour, comment ça va?");
  
  })
});

