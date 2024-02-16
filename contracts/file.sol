// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


contract File {
    mapping (string => filesInfo) internal hashToFile;
    
    struct filesInfo {
        string file_name;
        string file_type;
        string file_secret;
    }

    modifier checkFile(string memory fileHashId) {
        bytes memory tempString = bytes(hashToFile[fileHashId].file_name);
        require(tempString.length > 0);//check if file exist
        _;
    }
    
    function getFileInfo(string memory fileHashId) internal view checkFile(fileHashId) returns(filesInfo memory ) {
        return hashToFile[fileHashId];
    }
}
