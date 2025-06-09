// RUN THIS WITH NODE JS TO GENERATE TEST DATA FOR SSMS TABLE
// node SSMSTableDataGenerator.js
// This will create or overwrite the file SSMSTableLarge.json

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const numberOfDatums = 8000;

const getRandomString = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getRandomConsequence = () => {
  return {
    id: getRandomString(15),
    transcript: {
      aa_change: getRandomString(5),
      annotation: {
        polyphen_impact: Math.random() < 0.5 ? 'possibly damaging' : 'benign',
        polyphen_score: Math.random(),
        sift_impact: Math.random() < 0.5 ? 'tolerated' : 'deleterious',
        sift_score: Math.random(),
        vep_impact: 'MODERATE',
      },
      consequence_type: 'missense_variant',
      gene: {
        gene_id: 'ENSG' + Math.floor(Math.random() * 100000000),
        symbol: 'TP' + Math.floor(Math.random() * 100),
      },
      is_canonical: Math.random() < 0.5,
    },
  };
};

const getRandomSSMSArray = () => {
  const data = [];
  for (let i = 0; i < numberOfDatums; i++) {
    const obj = {
      ssm_id: getRandomString(15),
      score: Math.floor(Math.random() * 100000000),
      id: getRandomString(15),
      mutation_subtype: Math.random() < 0.5 ? 'Deletion' : 'Insertion',
      genomic_dna_change: getRandomString(15),
      occurrence: Math.floor(Math.random() * 100000000),
      filteredOccurrences: Math.floor(Math.random() * 100000000),
      consequence: [getRandomConsequence()],
    };
    data.push(obj);
  }

  return data;
};

const SSMSTableDataGenerator = () => {
  return {
    ssmsTotal: numberOfDatums,
    cases: 16508,
    filteredCases: 4738,
    ssms: getRandomSSMSArray(),
  };
};

// Generate data and write to file
const data = SSMSTableDataGenerator();
fs.writeFile('SSMSTableLarge.json', JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file', err);
  } else {
    console.log(
      'File SSMSTableLarge.json has been created/overwritten successfully.',
    );
  }
});
