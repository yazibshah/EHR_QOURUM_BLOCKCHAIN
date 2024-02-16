// HealthCare.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthCare", function () {
  let HealthCare;
  let healthCare;
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
      await HealthCare.connect(doctor).grantAccessToDoctor(doctor.address);
      await HealthCare.addFile("File2", "PDF", ethers.utils.formatBytes32String("fileHash2"), "secret");
      const fileInfo = await HealthCare.getFileInfoDoctor(doctor.address, patient.address, ethers.utils.formatBytes32String("fileHash2"));
      expect(fileInfo[0]).to.equal("File2");
      expect(fileInfo[1]).to.equal("PDF");
    });
  });



  /* describe("File Functionality", function () {
    it("Should retrieve file information correctly", async function () {
      await healthCare.addFile("File3", "PDF", ethers.utils.formatBytes32String("fileHash3"), "secret");
      const fileInfo = await healthCare.getFileInfoPatient(patient.address, ethers.utils.formatBytes32String("fileHash3"));
      expect(fileInfo[0]).to.equal("File3");
      expect(fileInfo[1]).to.equal("PDF");
    });

    it("Should restrict access to file information based on roles", async function () {
      await healthCare.addFile("File4", "PDF", ethers.utils.formatBytes32String("fileHash4"), "secret");
      await expect(healthCare.getFileInfoDoctor(doctor.address, patient.address, ethers.utils.formatBytes32String("fileHash4"))).to.be.revertedWith("revert");
    });
  });*/
 });
 