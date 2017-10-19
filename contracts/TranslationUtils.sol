pragma solidity ^0.4.15;

contract TranslationUtils{
 
    function TranslationUtils(){}

    function toString(address x) returns (string) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++)
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        return string(b);
    }

    //     function stringToBytes32(string memory source) returns (bytes32 result) {
    //     assembly {
    //         result := mload(add(source, 32))
    //     }
    // }
}