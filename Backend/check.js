const { ethers } = require('ethers');
const contractABI = require('./ContractABI.json');





const contractAddress = '0x048f3Ab0D1D91a862A38d7ba3cd91D1d097C9524'; // Your smart contract address
// const abi=[
//     "function signupDoctor(string memory _name) public "
// ]

// Initialize Ethereum provider and connect to the contract
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/1c2959aaaaea48b29dcbd39b41844ef0");
const contract = new ethers.Contract(contractAddress, contractABI, provider);


// Walets Private Keys
const doctorPrivateKey=new ethers.Wallet("",provider);//cc
const patientPrivateKey=new ethers.Wallet("",provider);//f

// Wallet Addresses
patientAddress="0xc8F14E3712AaF0c3b5a921Cc1926a0eCE3bB64f5";
doctorAddress="0x1B3DfD9c85f4Aa9825301a85CF2D80bc316e33c3"


// Doctor signup
/* async function HealthCare(dName,pName,pAge){
    
    const DoctorSignUp = await contract.connect(doctorPrivateKey).signupDoctor(dname);
    console.log(DoctorSignUp);
}

HealthCare("Yazib"); */

// =======================Patient Signup

/* async function PatientSignUp(pName,pAge){
    
    const patientSignUp = await contract.connect(patientPrivateKey).signupPatient(pName,pAge);
    console.log(patientSignUp);
}

PatientSignUp("Muzna",25); */


/* ================Should retrieve patient information correctly=============== */
async function getInfoPatient(){
    const getInfo = await contract.connect(patientPrivateKey).getPatientInfo();
    console.log(getInfo[0]);
    console.log(getInfo[1]);
    console.log(getInfo[2]);
    console.log(getInfo[3]);
}
getInfoPatient()

/* ==========================Should allow patients to add files=================== */
/* async function addFile(){
    const fileAdd = await contract.connect(patientPrivateKey).addFile("File1", "PDF", "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab", "secret");
}
addFile();
 */

/* =====================Should allow patients to grant access to doctors==================== */
/* async function grantAccessToDoctor(){
    const AccessToDoctor = await contract.connect(patientPrivateKey).grantAccessToDoctor(doctorAddress);
    console.log(AccessToDoctor);
}
grantAccessToDoctor(); */


/* ========================Doctor Can Get Patient Info ========================================= */
/* async function getPatientInfoForDoctor(){
    const AccessToDoctor = await contract.connect(doctorPrivateKey).getPatientInfoForDoctor(patientAddress);
    console.log(AccessToDoctor);
}
getPatientInfoForDoctor() ;*/


/* ======================= Get Doctor Info=========================== */
/* async function getDoctorInfo(){
    const AccessToDoctor = await contract.connect(doctorPrivateKey).getDoctorInfo();
    console.log(AccessToDoctor);
}
getDoctorInfo() */

/* ========================== */

/* async function getFileInfo(){
    const AccessToDoctor = await contract.connect(patientPrivateKey).getFileInfoDoctor(doctorAddress, patientAddress,"0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab");;
    console.log(AccessToDoctor);
}
getFileInfo(); */

  
