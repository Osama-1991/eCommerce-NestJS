export const emailTemplate = (data: {
  otp: string;
  name: string;
  link: string;
  text: string;
  btn: string;
  expiresTime: string;
}): string => {
  const { otp, name = '', link, text, btn, expiresTime } = data;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Confirmation</title>
    <style>
          body {font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;}
          .NameOf {color: rgb(88, 88, 88);
                 margin-bottom: 10px;
                 font-weight: bold;
                 text-decoration: none !important;
                 font-size: 30px;}
         .email-container {max-width: 600px;
                           margin: 20px auto;
                           background-color: #ffffff;
                           border-radius: 8px;
                           overflow: hidden;}
          .header {background-color: #1e78d6;
                  color: #ffffff;
                  padding: 10px;
                  text-align: center;}
          .logo {text-align: center;
                 margin: 10px;
                 padding: 0;}
         .content {padding: 30px;
                   text-align: center;}
         .content h1 {font-size: 24px;
                      margin: 0 0 10px;}
         .content p {color: #666666;
                     font-size: 16px;
                     line-height: 1.5;}
         .code {display: inline-block;
                background-color: #e8fdf4;
                color: #333333;
                font-weight: bold;
                font-size: 20px;
                padding: 10px 20px;
                margin: 20px 0;
                border-radius: 5px;}
          .button {background-color: #1e78d6;
                   color: rgb(255, 255, 255);
                   text-decoration: none !important;
                   font-size: 16px;
                   padding: 10px 20px;
                   border-radius: 5px;
                 margin-top: 20px;}
          .footer {background-color: rgb(114, 114, 114);
                   padding: 20px;
                   text-align: center;
                   font-size: 14px;
                   color: rgb(255, 255, 255);}
          .footer a {color: #1e78d6;
                     text-decoration: none;}
          .footer2 {padding: 20px 20px 20px 20px;
                    text-align: center;
                    font-size: 14px;}
          .footer2 a {padding: 10px 9px;
                      color: #fff;
                      border-radius: 50%;}
          .footer2 span {padding: 10px 9px;
                         color: #fff;
                         border-radius: 50%;}
    </style>
</head>  
<body>
      <div class="email-container">
          <div class="logo">
              <img width="100px"
                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png" />
          </div>
          <div class="header">
              <h2>Hallo <span class="NameOf">${name}</span> </h2>
          </div>
          <div class="content">
              <h1>You Are Almost There!</h1>
              <p>${text}</p>
              <div class="code">${otp}</div>
              <p>This code is valid for the next ${expiresTime} minutes.</p>
              <a href="${link}" class="button">${btn}</a>
          </div>
          <div class="footer">
              <p>Have a question or trouble logging in? Please contact us <a href="https://www.google.com/">here</a>.</p>
              <p>800 Bordway Suit 1500 cairo, NY 000423, Egypt</p>
              <p>Call us - 0123 456 789</p>
          </div>  
      </div>
  </body>  
</html>`;
};
