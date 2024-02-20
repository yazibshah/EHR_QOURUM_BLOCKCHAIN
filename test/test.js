// HealthCare.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthCare", function () {
  let HealthCare;
  let owner;
  let patient1;
  let patient2;
  let doctor;
  let addrs;

  beforeEach(async function () {
    [owner, patient1,patient2, doctor, ...addrs] = await ethers.getSigners();
    HealthCare = await await ethers.deployContract("HealthCare");

    // healthCare = await HealthCare.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await HealthCare.owner()).to.equal(owner.address);
    });
  });

  describe("Patient Functionality", function () {
    it("Should allow patients to sign up", async function () {
      await HealthCare.connect(patient1).signupPatient("Patient1", 30);
      const patientInfo = await HealthCare.connect(patient1).getPatientInfo();
      console.log(patientInfo);
      expect(patientInfo[0]).to.equal("Patient1");
      expect(patientInfo[1]).to.equal(30);
    });
 
    it("Should retrieve patient information correctly", async function () {
      await HealthCare.connect(patient2).signupPatient("Patient2", 35);
      const patientInfo = await HealthCare.connect(patient2).getPatientInfo();
      expect(patientInfo[0]).to.equal("Patient2");
      expect(patientInfo[1]).to.equal(35);
    });
 
    it("Should allow patients to add files", async function () {
      await HealthCare.connect(patient1).signupPatient("Patient3", 40);
      await HealthCare.connect(patient1).addFile("File1", "PDF", "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab", "secret");
      const patientInfo = await HealthCare.connect(patient1).getPatientInfo();
      expect(patientInfo[0]).to.equal("Patient3");
      expect(patientInfo[1]).to.equal(40);
      expect(patientInfo[2].length).to.greaterThan(0);
    });
    

    it("Should allow patients to grant access to doctors", async function () {
      await HealthCare.connect(patient1).signupPatient("Patient4", 45);
      await HealthCare.connect(doctor).signupDoctor("Doctor1");
      await HealthCare.connect(patient1).grantAccessToDoctor(doctor.address);
      const patientInfo = await HealthCare.connect(doctor).getPatientInfoForDoctor(patient1.address);
      expect(patientInfo[0]).to.equal("Patient4");
      expect(patientInfo[1]).to.equal(45);
    }); 
  });

   describe("Doctor Functionality", function () {
     it("Should allow doctors to sign up", async function () {
      await HealthCare.connect(doctor).signupDoctor("Doctor2");
      const doctorInfo = await HealthCare.connect(doctor).getDoctorInfo();
      expect(doctorInfo[0]).to.equal("Doctor2");
    }); 

  

    it("Should retrieve file information for doctors", async function () {
      await HealthCare.connect(doctor).signupDoctor("Doctor4");
      await HealthCare.connect(patient1).signupPatient("Patient5", 50);
      await HealthCare.connect(patient1).grantAccessToDoctor(doctor.address);
      await HealthCare.connect(patient1).addFile("File2", "PDF", "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab", "secret");
      const fileInfo = await HealthCare.getFileInfoDoctor(doctor.address, patient1.address, "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab");
      expect(fileInfo[0]).to.equal("File2");
      expect(fileInfo[1]).to.equal("PDF");
    });
  });

  describe("revokeAccess", function () {
    it("should allow patients to revoke access granted to a doctor", async function () {
      // Patient grants access to the doctor
      await HealthCare.connect(patient1).signupPatient("Muzna", 23);
      await HealthCare.connect(doctor).signupDoctor("Doctor");
      await HealthCare.connect(patient1).grantAccessToDoctor(doctor.address);

      // Verify that the doctor has access before revocation
      const beforeAccess = await HealthCare.connect(doctor).getPatientInfoForDoctor(patient1.address);
      expect(beforeAccess[0]).to.equal("Muzna");
      expect(beforeAccess[1]).to.equal(23); // Assuming 1 doctor has access initially

      // Patient revokes access to the doctor
      await HealthCare.connect(patient1).revokeAccess(doctor.address);


    });

    it("should revert if the doctor does not have access to revoke", async function () {
      // Attempt to revoke access that was not granted
      await expect(HealthCare.connect(doctor).revokeAccess(doctor.address)).to.be.revertedWith("Doctor does not have access to revoke");
    });
  });


  describe("addFileByDoctor", function () {
    it("should allow doctors to add files to patient data", async function () {
      // Patient signs up
      await HealthCare.connect(patient1).signupPatient("Patient1", 30);

      // Doctor signs up
      await HealthCare.connect(doctor).signupDoctor("Doctor1");

      // Grant access to the doctor by the patient
      await HealthCare.connect(patient1).grantAccessToDoctor(doctor.address);

      // Add file by the doctor to the patient's data
      const fileHash = "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";
      await HealthCare.connect(doctor).addFileByDoctor(patient1.address, "File1", "PDF", fileHash, "secret");

      // Retrieve patient information to check if the file was added
      const patientInfo = await HealthCare.connect(doctor).getPatientInfoForDoctor(patient1.address);
      expect(patientInfo[0]).to.equal("Patient1");
      expect(patientInfo[3]).to.include(fileHash); // Expecting the file hash to be included in the patient's files
    });

    it("should revert if doctor does not have access to add files", async function () {
      // Patient signs up
      await HealthCare.connect(patient1).signupPatient("Patient1", 30);

      // Doctor signs up but does not have access

      // Attempt to add file by the doctor without access
      await expect(HealthCare.connect(doctor).addFileByDoctor(patient1.address, "File1", "PDF", "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab", "secret"))
        .to.be.revertedWith("Doctor does not have access to add files");
    });

    it("should revert if file already exists", async function () {
      // Patient signs up
      await HealthCare.connect(patient1).signupPatient("Patient1", 30);

      // Doctor signs up
      await HealthCare.connect(doctor).signupDoctor("Doctor1");

      // Grant access to the doctor by the patient
      await HealthCare.connect(patient1).grantAccessToDoctor(doctor.address);

      // Add file by the doctor to the patient's data
      const fileHash = "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";
      await HealthCare.connect(doctor).addFileByDoctor(patient1.address, "File1", "PDF", fileHash, "secret");

      // Attempt to add the same file again
      await expect(HealthCare.connect(doctor).addFileByDoctor(patient1.address, "File2", "PDF", fileHash, "secret"))
        .to.be.revertedWith("File already exists");
    });
  });
});


 