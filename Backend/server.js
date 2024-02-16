const express = require('express');
const { ethers } = require('ethers');
const contractABI = require('./ContractABI.json');

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Ethereum provider and connect to the contract
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/1c2959aaaaea48b29dcbd39b41844ef0");
const contractAddress = '0x048f3Ab0D1D91a862A38d7ba3cd91D1d097C9524'; // Your smart contract address
const contract = new ethers.Contract(contractAddress, contractABI, provider);

// Walets Private Keys
const doctorPrivateKey = new ethers.Wallet("a36c24e21862a145c4d6c9b75af8185d3018a8f6d6c0dfc126efa79475081bb7", provider);
const patientPrivateKey = new ethers.Wallet("08253c7aa3c92649df44a67b98ae682e9ac642b270ca0347d45a1d827a32e94b", provider);

// Wallet Addresses
const patientAddress = "0xc8F14E3712AaF0c3b5a921Cc1926a0eCE3bB64f5";
const doctorAddress = "0x1B3DfD9c85f4Aa9825301a85CF2D80bc316e33c3";



//  Doctor signup
app.post('/signup/doctor', async (req, res) => {
    const { dName } = req.body;
    const tx = await contract.connect(doctorPrivateKey).signupDoctor(dName);
    res.send(tx.hash);
});

// Patient signup
app.post('/signup/patient', async (req, res) => {
    const { pName, pAge } = req.body;
    const tx = await contract.connect(patientPrivateKey).signupPatient(pName, pAge);
    res.send(tx.hash);
});

// Get patient information
app.get('/patient/info', async (req, res) => {
    const patientInfo = await contract.connect(patientPrivateKey).getPatientInfo();
    // Convert BigInt values to numbers if they fit within the range
    const patientInfoNumber = JSON.parse(JSON.stringify(patientInfo, (key, value) => typeof value === 'bigint' ? Number(value) : value));
    res.json(patientInfoNumber);
});


// Add file for patient
app.post('/patient/add-file', async (req, res) => {
    const { fileName, fileType, fileHash, fileSecret } = req.body;
    const tx = await contract.connect(patientPrivateKey).addFile(fileName, fileType, fileHash, fileSecret);
    res.send(tx.hash);
});

// Grant access to doctor
app.post('/patient/grant-access', async (req, res) => {
    const tx = await contract.connect(patientPrivateKey).grantAccessToDoctor(doctorAddress);
    res.send(tx.hash);
});

// Get patient information for doctor
app.get('/doctor/patient-info', async (req, res) => {
    try {
        const patientInfo = await contract.connect(doctorPrivateKey).getPatientInfoForDoctor(patientAddress);

        // Convert BigInt values to strings before sending the response
        const patientInfoString = JSON.parse(JSON.stringify(patientInfo, (key, value) => typeof value === 'bigint' ? value.toString() : value));

        res.json(patientInfoString);
    } catch (error) {
        console.error("Error fetching patient info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Get doctor information
app.get('/doctor/info', async (req, res) => {
    const doctorInfo = await contract.connect(doctorPrivateKey).getDoctorInfo();
    res.json(doctorInfo);
}); 

// Get file information
app.get('/file/info', async (req, res) => {
    try {
        const fileInfo = await contract.connect(doctorPrivateKey).getFileInfoDoctor(doctorAddress, patientAddress, "bjhxbajh");
        res.json(fileInfo);
    } catch (error) {
        console.error("Error fetching file info:", error);
        // Return an appropriate error response to the client
        res.status(500).json({ error: "File does not exist or an error occurred" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
