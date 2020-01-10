const inquirer = require("inquirer");
const fs = require("fs");
const electron = require("electron");
const convertFactory = require("electron-html-to");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const axios = require("axios");
const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "white",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#bd2318",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};
function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What's your GitHub username?"
    },
    {
      type: "list",
      name: "colors",
      message: "Which color do you prefer?",
      choices: ["green", "blue", "pink", "red"]
    }
  ]);
}
promptUser().then(function({ username, colors }) {
  const selectedColor = colors;
  //console.log(selectedColor.color);
  const queryUrl = `https://api.github.com/users/${username}`;
  axios.get(queryUrl).then(function(res) {
    const a = res.data;
    const name = a.name;
    const picture = a.picture_url;
    const githubUser = a.login;
    const location = a.location;
    const githubLink = a.html_url;
    const blogLink = a.blog;
    const bio = a.bio;
    const repos = a.public_repos;
    const followers = a.followers;
    const following = a.following;
    const queryUrlStars = `https://api.github.com/users/${username}/starred`;
    axios
      .get(queryUrlStars)
      .then(function(stars) {
        const starsLength = stars.data.length;
        const githubUserData = {
          name,
          picture,
          githubUser,
          location,
          githubLink,
          blogLink,
          bio,
          repos,
          followers,
          following,
          starsLength
        };
        //console.log(selectedColor)
        const html = generateHTML(githubUserData, selectedColor);
        writeFileAsync("index.html", html);
      })
      .catch(function(err) {
        //   console.log(err);
        // .then(() => {
        readFileAsync("index.html", "utf8").then(htmlString => {
          const conversion = htmlToPdf({
            converterPath: htmlToPdf.converters.PDF
          });
          conversion({ html: htmlString }, function(err, res) {
            if (err) {
              return console.error(err);
            }
            res.stream.pipe(fs.createWriteStream("Profile.pdf"));
            conversion.kill();
          });
        });
      });
  });
});

function generateHTML(githubUserData, selectedColor) {
  return `
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Document</title>
      <style>
          @page {
            margin: 0;
          }
         *,
         *::after,
         *::before {
         box-sizing: border-box;
         }
         html, body {
         padding: 0;
         margin: 0;
         }
         html, body, .wrapper {
         height: 100%;
         }
         .wrapper {
         background-color: ${colors[selectedColor.wrapperBackground]};
         color: ${colors[selectedColor.wrapperColor]};
         padding-top: 100px;
         }
         body {
         background-color: white;
         -webkit-print-color-adjust: exact !important;
         font-family: 'Cabin', sans-serif;
         }
         main {
         background-color: #E9EDEE;
         height: auto;
         padding-top: 30px;
         }
         h1, h2, h3, h4, h5, h6 {
         font-family: 'BioRhyme', serif;
         margin: 0;
         }
         h1 {
         font-size: 3em;
         }
         h2 {
         font-size: 2.5em;
         }
         h3 {
         font-size: 2em;
         }
         h4 {
         font-size: 1.5em;
         }
         h5 {
         font-size: 1.3em;
         }
         h6 {
         font-size: 1.2em;
         }
         .photo-header {
         position: relative;
         margin: 0 auto;
         margin-bottom: -50px;
         display: flex;
         justify-content: center;
         flex-wrap: wrap;
         background-color: ${colors[selectedColor.headerBackground]};
         color: ${colors[selectedColor.headerColor]};
         padding: 10px;
         width: 95%;
         border-radius: 6px;
         }
         .photo-header img {
         width: 250px;
         height: 250px;
         border-radius: 50%;
         object-fit: cover;
         margin-top: -75px;
         border: 6px solid ${colors[selectedColor.photoBorderColor]};
         color: ${colors[selectedColor.photoBorderColor]};
         box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
         }
         .photo-header h1, .photo-header h2 {
         width: 100%;
         text-align: center;
         }
         .photo-header h1 {
         margin-top: 10px;
         }
         .links-nav {
         width: 100%;
         text-align: center;
         padding: 20px 0;
         font-size: 1.1em;
         }
         .nav-link {
         display: inline-block;
         margin: 5px 10px;
         }
         .workExp-date {
         font-style: italic;
         font-size: .7em;
         text-align: right;
         margin-top: 10px;
         }
         .container {
         padding: 50px;
         padding-left: 100px;
         padding-right: 100px;
         }
 
         .row {
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           margin-top: 20px;
           margin-bottom: 20px;
         }
 
         .card {
           padding: 20px;
           border-radius: 6px;
           background-color: ${colors[selectedColor.headerBackground]};
           color: ${colors[selectedColor.headerColor]};
           margin: 20px;
         }
         
         .col {
         flex: 1;
         text-align: center;
         }
 
         a, a:hover {
         text-decoration: none;
         color: inherit;
         font-weight: bold;
         }
 
         @media print { 
          body { 
            zoom: .75; 
          } 
         }
      </style>
      </head>
       <body>
       <div class="wrapper">
        <div class="photo-header">
        <img class="" src="${githubUserData.picture}" />
        <h1>Hi!</h1>
        <h1>My name is ${githubUserData.name}</h1>
        <div class="links-nav">
          <a class="nav-link" href="https://www.google.com/maps/place/${
            githubUserData.location
          }"> 
          <i class="fas fa-map-marker-alt">${githubUserData.location}</i>
          </a>
          <a class="nav-link" href="${
            githubUserData.githubLink
          }"><i class="fab fa-github"></i> GitHub</a>
          <a class="nav-link" href="${
            githubUserData.blogLink
          }"><i class="fas fa-rss"></i> Blog</a>
        </div>
      </div>
      <main>
        <div class="container">
          <h1 class="col">${githubUserData.bio}</h1>
          <div class="card-deck">
            <div class="card col col-sm-6">
              <h2>Followers</h2>
              <h3>${githubUserData.followers}</h3>
            </div>
            <div class="card col col-sm-6">
              <h2>Following</h2>
              <h3>${githubUserData.following}</h3>
            </div>
          </div>
          <br />
          <div class="card-deck">
            <div class="card col col-sm-6">
              <h2>GitHub stars</h2>
              <h3>${githubUserData.starsLength}</h3>
            </div>
            <div class="card col col-sm-6">
              <h2>Public Repos</h2>
              <h3>${githubUserData.repos}</h3>
          </div>
          <br />
        </div>
      </main>
    </div>
       </body>
      </html>`;
}
