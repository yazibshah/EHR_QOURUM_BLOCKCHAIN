// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "./doctor.sol";
import "./patient.sol";
import "./file.sol";

contract HealthCare is Doctor, Patient, File {
    address public owner;
    
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier checkFileAccess(string memory role, address id, string memory fileHashId, address pat) {
        uint pos;
        if(keccak256(abi.encodePacked(role)) == keccak256("doctor")) {
            require(patientToDoctor[pat][id] > 0, "Doctor is not authorized");
            pos = patientToFile[pat][fileHashId];
            require(pos > 0, "File does not exist");   
        }
        else if(keccak256(abi.encodePacked(role)) == keccak256("patient")) {
            pos = patientToFile[id][fileHashId];
            require(pos > 0, "File does not exist");
        }
        _; 
    }
    
    function checkProfile(address _user) public view onlyOwner returns(string memory, string memory){
        patient memory p = patients[_user];
        doctor memory d = doctors[_user];
          
        if(p.id != address(0))
            return (p.name, 'patient');
        else if(d.id != address(0))
            return (d.name, 'doctor');
        else
            return ('', '');
    }
  
    function grantAccessToDoctor(address doctor_id) public {
        patient storage p = patients[msg.sender];
        doctor storage d = doctors[doctor_id];
        require(patientToDoctor[msg.sender][doctor_id] == 0, "Doctor already has access");// this means doctor already been access
      
        p.doctor_list.push(doctor_id);// new length of array
        uint pos = p.doctor_list.length;

        patientToDoctor[msg.sender][doctor_id] = pos;
        d.patient_list.push(msg.sender);
    }
  
    function addFile(string memory _file_name, string memory _file_type, string memory _fileHash, string memory _file_secret) public {
        patient storage  p = patients[msg.sender];

        require(patientToFile[msg.sender][_fileHash] == 0, "File already exists");
      
        hashToFile[_fileHash] = filesInfo({file_name:_file_name, file_type:_file_type,file_secret:_file_secret});
        p.files.push(_fileHash);
        uint pos = p.files.length;
        patientToFile[msg.sender][_fileHash] = pos;
    }
    
    function getPatientInfoForDoctor(address pat) public view checkPatient(pat) checkDoctor(msg.sender) returns(string memory , uint8, address, string[] memory ){
        patient memory p = patients[pat];

        require(patientToDoctor[pat][msg.sender] > 0, "Doctor does not have access");

        return (p.name, p.age, p.id, p.files);
    }
    
    function getFileSecret(string memory fileHashId, string memory role, address id, address pat) public view 
    checkFile(fileHashId) checkFileAccess(role, id, fileHashId, pat)
    returns(string memory ) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_secret);
    }

    function getFileInfoDoctor(address doc, address pat, string memory fileHashId) public view 
    onlyOwner checkPatient(pat) checkDoctor(doc) checkFileAccess("doctor", doc, fileHashId, pat)
    returns(string memory , string memory ) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_name, f.file_type);
    }
  
    function getFileInfoPatient(address pat, string memory fileHashId) public view 
    onlyOwner checkPatient(pat) checkFileAccess("patient", pat, fileHashId, pat) returns(string memory , string memory ) {
        filesInfo memory f = getFileInfo(fileHashId);
        return (f.file_name, f.file_type);
    }
  
}