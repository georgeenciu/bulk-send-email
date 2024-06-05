require("dotenv").config();

const xlsx = require("node-xlsx");
const fs = require("fs");
const Handlebars = require("handlebars");

const { arrayToObject } = require("./utils");
const { sendMail } = require("./mailer");

const SHEET = "training_queue";
const main = async () => {
  try {
    const xlsxFile = xlsx.parse(`${__dirname}/data/list.xlsx`);
    const sheet = xlsxFile.find((x) => x.name === SHEET);

    if (!sheet) {
      throw new Error(`Sheet with name ${SHEET} not found`);
    }

    const header = sheet.data.shift();
    if (!header) {
      throw new Error(`No header row found in sheet ${SHEET}`);
    }

    console.log('Header:', header);

    const listOfStudents = arrayToObject(header, sheet.data);

    if (!listOfStudents.length) {
      throw new Error(`No data rows found in sheet ${SHEET}`);
    }

    console.log('List of Students:', listOfStudents);

    const textTemplate = Handlebars.compile(
      fs.readFileSync("templates/text.hbs").toString()
    );
    const htmlTemplate = Handlebars.compile(
      fs.readFileSync("templates/html.hbs").toString()
    );

    const emailPromises = listOfStudents.map(async (student, index) => {
      try {
        console.log(`Processing student ${index + 1}/${listOfStudents.length}:`, student);
        const textEmail = textTemplate(student);
        const htmlEmail = htmlTemplate(student);

        await sendMail(
          student.email,
          "Your place in the training queue",
          textEmail,
          htmlEmail
        );
      } catch (error) {
        console.error(`Error sending email to student ${student.email}:`, error);
      }
    });

    await Promise.all(emailPromises);
  } catch (error) {
    console.error('Error processing the Excel file:', error);
  }
};

main().then(() => console.log('Emails sent successfully')).catch(console.error);
