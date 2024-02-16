// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Patient {
    mapping (address => patient) internal patients;
    mapping (address => mapping (address => uint)) internal patientToDoctor;
    mapping (address => mapping (string => uint)) internal patientToFile; // Changed bytes32 to string
    
    struct patient {
        string name;
        uint8 age;
        address id;
        string[] files; // Changed bytes32[] to string[]
        address[] doctor_list;
    }
    
    modifier checkPatient(address id) {
        patient memory p = patients[id];
        require(p.id != address(0)); // Changed to check if patient exists
        _;
    }
    
    function getPatientInfo() public view checkPatient(msg.sender) returns(string memory, uint8, string[] memory, address[] memory) {
        patient memory p = patients[msg.sender];
        return (p.name, p.age, p.files, p.doctor_list);
    }
    
    function signupPatient(string memory _name, uint8 _age) public {
        patient storage p = patients[msg.sender]; // Changed memory to storage
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0 && _age < 100, "Invalid age");
        require(p.id == address(0), "Patient already exists");
        
        p.name = _name;
        p.age = _age;
        p.id = msg.sender;
    }

}
