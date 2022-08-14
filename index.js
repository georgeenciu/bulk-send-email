require("dotenv").config();

const xlsx = require("node-xlsx");
const fs = require("fs");
const Handlebars = require("handlebars");

const { arrayToObject } = require("./utils");
const { sendMail } = require("./mailer");

const SHEET = "training_queue";
const main = async () => {
  const xlsxFile = xlsx.parse(`${__dirname}/data/list.xlsx`);
  const sheet = xlsxFile.find((x) => x.name === SHEET);

  const header = sheet.data.shift();
  const listOfStudents = arrayToObject(header, sheet.data);

  const textTemplate = Handlebars.compile(
    fs.readFileSync("templates/text.hbs").toString()
  );
  const htmlTemplate = Handlebars.compile(
    fs.readFileSync("templates/html.hbs").toString()
  );

  const emailPromises = listOfStudents.map(async (student) => {
    const textEmail = textTemplate(student);
    const htmlEmail = htmlTemplate(student);

    await sendMail(
      student.email,
      "Your place in the training queue",
      textEmail,
      htmlEmail
    );
  });

  await Promise.all(emailPromises);
};
main().then(console.timeLog).catch(console.error);
