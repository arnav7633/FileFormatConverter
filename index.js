/**
  *Author - Vivek Bindal
  *Date and Time - 7 August 2020 16:00
  *Task - Converting File From One format to Other
*/

const exec = require('child_process').exec;
const fs = require('fs');


const powerpointToImages = async(inputFileName,outputDir)=>{

  return new Promise((resolve,reject)=>{
    try {
      if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
      }
  
      let timestamp = new Date().getTime();
      PowerPointToPdf(inputFileName,outputDir,timestamp).then(pdffileName => {
          PdfToImages(pdffileName,outputDir,timestamp).then(imageArray => {
            fs.unlink(pdffileName, (err) => {
              if (err) console.error("Error",err)
            });
            resolve(imageArray)
          }).catch(error => {
              console.error("-----PDF To Image Conversion "+error)
              reject(error)
          }) 
      }).catch(error => {
          console.error("-----PowerPoint To PDF Conversion "+error)
          reject(error)
      })    
    } catch (error) {
        console.error("-----PowerPoint To Image Conversion "+error)
        reject(error)
    }
  })
}

const PowerPointToPdf = async (inputFileName,outputDir,timestamp=new Date().getTime())=>{
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
      }
      let outputPdfFile =  outputDir+timestamp + '.pdf';
      let pdfConversionCommand = 'unoconv -f pdf -o ' +outputPdfFile + ' ' +inputFileName;
      exec(pdfConversionCommand, (error, stdout, stderr) => {
        if (error) {
         console.error(error);
         reject(error);
        }
        resolve(outputPdfFile);
      });
    } catch (error) {
      console.error('Exception encountered while Converting Powerpoint file to Pdf', error);
      reject(error)
    }
  });
}

const PdfToImages = async (inputFileName,outputDir,timestamp=new Date().getTime())=>{
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
      }
      let outputImageFile =  outputDir+timestamp+ '.png';
      let pdfConversionCommand = 'convert ' + inputFileName + ' ' + outputImageFile;
      exec(pdfConversionCommand, (error, stdout, stderr) => {
        if (error) {
         console.error(error);
         reject(error);
        }
          let listfileCommand =  'ls -rt '+outputDir+timestamp+ '*.png'
        /*
        let listfileCommand =  'ls -rt '+outputDir+timestamp+ '*.png'
        console.log(listfileCommand)
        exec(listfileCommand, (error, stdout, stderr) => {
          if (error) {
           console.error(error);
           reject(error);
          }
          stdout = stdout.replace(/\n$/, '');
          const filesNames = stdout.split('\n');  
          console.log(filesNames)      
          resolve(filesNames);
        });
        */
       const files = fs.readdirSync( `${outputDir}`)
      const fileNames = files.filter(file => file.startsWith(`${timestamp}`) && file.endsWith('.png'))
      resolve(fileNames)
      });
    } catch (error) {
      console.error('Exception encountered while Converting PDF to Image', error);
      reject(error)
    }
  });
}



module.exports = {
  powerpointToImages,
  PowerPointToPdf,
  PdfToImages
};


