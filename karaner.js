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
  return getKarana(body.textContent.replaceAll(/\n/g, "").replaceAll(/ {1,}/g, " "))
}

function getKarana(text) {
  var regex = /FirstKarana:([A-Za-z]+)[0-9]+:([0-9]+:[0-9]+)/g

  var matches = []
  var match

  while ((match = regex.exec(text)) !== null) {
    var karana = match[1]
    var startTime = match[2]

    matches.push({
      [karana]: startTime
    })
  }

  return matches
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
  const endDate = moment('2050-12-31')
  const dates = []

  while (startDate.isSameOrBefore(endDate)) {
    dates.push(startDate.format('DD-MM-YYYY'))
    startDate.add(1, 'day')
  }

  return dates
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

  for (const date of dates) {
    const url = `${baseUrl}?date=${date}&epoch=${moment().unix()}`
    const content = await fetchContent(url)
    const karana = extractKarana(content)

    if(karana.length==0){
      fs.writeFile('lastdate.txt', moment(date, "DD-MM-YYYY").format("YYYY-MM-DD"), 'utf8', ()=>{})
      const dom = new JSDOM(content)
      const body = dom.window.document.querySelector('body')
      fs.writeFile('content.txt', body.textContent.replaceAll(/\n/g, "").replaceAll(/ {1,}/g, " "), 'utf8', ()=>{})
      fs.writeFile('index.html', content, 'utf8', ()=>{})
      throw new Error("empty karana "+date)
    }

    dateKaranaMap[moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")] = karana
    createKaranaFile(dateKaranaMap)
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
