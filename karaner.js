const axios = require('axios')
const { JSDOM } = require('jsdom')
const moment = require('moment')
const fs = require('fs')

// Function to fetch the body content from the URL
async function fetchContent(url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error)
    return null
  }
}

// Function to extract the Karana string using jsdom and regex
function extractKarana(content) {
  const dom = new JSDOM(content)
  const body = dom.window.document.querySelector('body')
  return getKarana(body.textContent.replaceAll(/\n/g, "").replaceAll(/ /g, ""))
}

function getKarana(text) {
  var regex = /FirstKarana:(.*?)upto(\d{1,2}:\d{1,2})SecondKarana:(.*?)upto(\d{1,2}:\d{1,2})/g

  var match = regex.exec(text)
  return JSON.parse(JSON.stringify([match[1], match[2], match[3], match[4]]))
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
  const endDate = moment('2051-12-20')
  const dates = []

  while (startDate.isSameOrBefore(endDate)) {
    dates.push(startDate.format('DD-MM-YYYY'))
    startDate.add(1, 'day')
  }

  return dates
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to fetch content, extract Karana, and create the date: karana object
async function generateDateKaranaMap() {
  const baseUrl = 'https://www.mpanchang.com/panchang/today-panchang/'
  const dates = generateDates()
  var dateKaranaMap = {}

  try {
    dateKaranaMap = JSON.parse(fs.readFileSync('karana.json', 'utf-8'))
  }catch{
    dateKaranaMap = {}
  }

  for (var i=0; i<dates.length; i++) {
    var date = dates[i]
    const url = `${baseUrl}?date=${date}&epoch=${moment().unix()}`
    const content = await fetchContent(url)
    if(!content){
      console.log(new Date(), `rate limited`)
      await delay(60000)
      i--
    }
    const karana = extractKarana(content)

    if(karana.length==0){
      fs.writeFile('lastdate.txt', moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"), 'utf8', ()=>{})
      const dom = new JSDOM(content)
      const body = dom.window.document.querySelector('body')
      fs.writeFile('content.txt', body.textContent.replaceAll(/\n/g, "").replaceAll(/ /g, ""), 'utf8', ()=>{})
      fs.writeFile('index.html', content, 'utf8', ()=>{})
      throw new Error("empty karana "+date)
    }

    dateKaranaMap[moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")] = karana
    createKaranaFile(dateKaranaMap)
    fs.writeFile('lastdate.txt', moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"), 'utf8', ()=>{})
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

// Example usage
generateDateKaranaMap()
  .catch(error => {
    console.error('Error generating date: karana map:', error)
  })
