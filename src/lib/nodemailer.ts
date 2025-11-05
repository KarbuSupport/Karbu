// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.MAILER_HOST,
//   port: Number(process.env.MAILER_PORT),
//   secure: process.env.MAILER_SECURE === "true", // SSL
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASS,
//   },
// });

// async function sendMail() {
//   await transporter.sendMail({
//     from: `"Mi App" <${process.env.MAILER_MAIL_FROM}>`,
//     to: "usuario@ejemplo.com",
//     subject: "Prueba de correo",
//     text: "Hola, este es un correo de prueba desde mi aplicación.",
//   });
// //   console.log("Correo enviado con éxito ✅");
// }

// sendMail().catch(console.error);


