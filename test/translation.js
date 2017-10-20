const { toAscii } = require("./utils");

const TranslationContract = artifacts.require("./TranslationContract.sol");

contract("TranslationContract", accounts => {
  const [joshs_address, marys_address, franks_address] = accounts;
  const Languages = { English: 1, Spanish: 2, Chinese: 3, French: 4 };

  it("should return the string to be translated", async () => {
    const translationInstance = await TranslationContract.deployed();

    await translationInstance.requestTranslation(
      "Test Translation",
      Languages.English,
      Languages.French,
      { from: joshs_address, value: 10 }
    );

    const result = await translationInstance.getStringToTranslate.call(
      joshs_address
    );
    const str = toAscii(result[0]).replace(/\0/g, "");

    console.log("Translation String = ", str);
    assert.equal(str, "Test Translation");
  });
});
