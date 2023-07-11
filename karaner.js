const axios = require('axios')
const moment = require('moment')
const fs = require('fs')

function extractDateParts(dateString) {
  const date = moment(dateString, 'YYYY-MM-DD');
  const extractedParts = [
    date.date(), // Day of the month
    date.month() + 1, // Month (Note: Moment.js uses zero-based month index)
    date.year() // Year
  ];

  return extractedParts;
}

async function fetchContent(date) {
  try {

    var [date, month, year] = extractDateParts(date)

    var html = await fetch("https://horoscope.astrodevam.com/panchang.php", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,kn;q=0.7",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "iframe",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": "_ga=GA1.2.1549191792.1687847550; _hjSessionUser_1337494=eyJpZCI6IjExYzBjNTMwLTIxNzctNTdmNC05ZmJkLTdhMjAzMjIxMmVkZCIsImNyZWF0ZWQiOjE2ODc4NDc1NTIzMDEsImV4aXN0aW5nIjp0cnVlfQ==; __utmc=30267055; _gid=GA1.2.318550259.1688118549; _hjSession_1337494=eyJpZCI6ImQzNGIxZjYwLTU4ZTUtNGM1YS04OWYzLWM3Y2MzNjYzNTg4NSIsImNyZWF0ZWQiOjE2ODgxMTg1NTAxNzgsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; PHPSESSID=hgtmv4euivupo24eubr4t1jcn1; __utma=30267055.1549191792.1687847550.1688118548.1688121987.3; __utmz=30267055.1688121987.3.3.utmcsr=horoscope.astrodevam.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmt=1; __utmb=30267055.1.10.1688121987; _ga_8FTPRFHJLE=GS1.2.1688121366.3.1.1688121987.0.0.0; _hjIncludedInSessionSample_1337494=0"
      },
      "referrer": "https://horoscope.astrodevam.com/panchang.php",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `citystatus=0&match=&HiddenPlaceOfBirth=Mysore&partner=&citystatus=0&match=&HiddenPlaceOfBirth=Mysore&partner=&DD=${date}&MM=${month}&YY=${year}&country=India&TxtPlaceOfBirth=Mysore&Submit=Submit+%3E%3E`,
      "method": "POST",
      "mode": "cors"
    })

    return html.text()
  }catch(err){
    throw err
  }
}

function getKaranas(html) {
  const regex = /<div class="col span_1_of_4">Karan <\/div>\n\s+<div class="col span_1_of_4">(\w+)<\/div>\n\s+<div class="col span_1_of_4">(.+)<\/div>/g
  const matches = [];
  let match

  while ((match = regex.exec(html)) !== null) {
    const karanaName = match[1].trim();
    const karanaTime = match[2].trim();
    matches.push(karanaName, karanaTime);
  }

  const formattedValues = matches.map((value, index) => {
    if (index % 2 !== 0) {
      const [hours, minutes] = value.split(' ')[1].split(':');
      const formattedTime = moment({ hours, minutes }).format('HH:mm');
      return formattedTime;
    }
    return value;
  });



  return formattedValues;
}

// Function to generate dates from today until December 31, 2025
function generateDates() {

  var ld
  try {
    ld = fs.readFileSync('lastdate.txt', 'utf-8')
  }catch {
    ld=""
  }

  const startDate = ld==""?moment():moment(ld)
  const endDate = moment('2028-12-20')
  const dates = []

  while (startDate.isSameOrBefore(endDate)) {
    dates.push(startDate.format('YYYY-MM-DD'))
    startDate.add(1, 'day')
  }

  return dates
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to fetch content, extract Karana, and create the date: karana object
async function generateDateKaranaMap() {
  const dates = generateDates()
  var dateKaranaMap = {}

  try {
    dateKaranaMap = JSON.parse(fs.readFileSync('karana.json', 'utf-8'))
  }catch{
    dateKaranaMap = {}
  }

  for (var i=0; i<dates.length; i++) {
    var date = dates[i]
    const html = await fetchContent(date)
    if(!html){
      console.log(new Date(), `rate limited`)
      await delay(60000)
      i--
    }
    const karana = getKaranas(html)

    if(karana.length==0){
      fs.writeFile('lastdate.txt', moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"), 'utf8', ()=>{})
      throw new Error("empty karana "+date)
    }

    dateKaranaMap[moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")] = karana
    createKaranaFile(dateKaranaMap)
    fs.writeFile('lastdate.txt', moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"), 'utf8', ()=>{})
  }
  // return dateKaranaMap
}

function createKaranaFile(dateKaranaMap) {
  fs.writeFile('karana.json', JSON.stringify(dateKaranaMap, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing karana.json file:', err)
    }
  })
}

generateDateKaranaMap()
  .catch(error => {
    console.error('Error generating date: karana map:', error)
  })
