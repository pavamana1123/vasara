const fs = require('fs')
const moment = require('moment')

const rtuMap = {
    "Margasirsa": "Hemanta",
    "Pausa": "Hemanta",
    "Magha": "Shishira",
    "Phalguna": "Shishira",
    "Caitra": "Vasant",
    "Vaisakha": "Vasant",
    "Jyestha": "Grishma",
    "Asadha": "Grishma",
    "Sravana": "Varsha",
    "Bhadra": "Varsha",
    "Asvina": "Sharat",
    "Kartika": "Sharat"
}

const vedicWeekdays = {
    Sunday: 'bhanu',
    Monday: 'indu',
    Tuesday: 'bhauma',
    Wednesday: 'saumya',
    Thursday: 'guru',
    Friday: 'bhargava',
    Saturday: 'sthira'
  }

function findIndicesInHeader(headerLine) {
    const startIndexTithi = headerLine.indexOf("TITHI");
    const endIndexTithi = headerLine.indexOf("PAKSA") - 1;
    const startIndexPaksa = endIndexTithi + 1;
    const endIndexPaksa = headerLine.indexOf("YOGA") - 1;
    const startIndexYoga = endIndexPaksa + 1;
    const endIndexYoga = headerLine.indexOf("NAKSATRA") - 1;
    const startIndexNaksatra = endIndexYoga + 1;
    const endIndexNaksatra = headerLine.indexOf("FAST") - 1;
    return [startIndexTithi, endIndexPaksa, startIndexNaksatra, startIndexYoga];
}

function isHeader(line) {
    line = line.trim()
    const regex = /^DATE\s+TITHI\s+PAKSA\s+YOGA\s+NAKSATRA\s+FAST$/;
    return regex.test(line);
}

function extractHeader(lines) {
    for (const line of lines) {
      if (isHeader(line)) {
        return line;
      }
    }
    return null; // Return null if header line is not found
}

function isMasaLine(line) {
    line = line.trim()
    const regex = /^([A-Za-z\s-]+)(?:\(([A-Za-z]+)\))?\sMasa,\sGaurabda\s\d+\s+GCal\s\d+,\sBuild\s\d+$/;
    return regex.test(line);
}
  
function extractMasaDetails(line) {
    line = line.trim()
    const regex = /^([A-Za-z\s-]+)(?:\(([A-Za-z]+)\))?\sMasa,\sGaurabda\s\d+\s+GCal\s\d+,\sBuild\s\d+$/;
    const match = line.match(regex);
    if (match && match.length >= 2) {
        const gaudiya = match[1].trim();
        const traditional = match[2] || gaudiya;
        return {
          gaudiya,
          traditional
        };
    }
    return null;
}

function isDateLine(line) {
    line = line.trim()
    const regex = /^\d{1,2}\s\w+\s\d{4}/;
    return regex.test(line);
}

function extractDate(line) {
    line = line.trim()
    const regex = /^(\d{1,2}\s\w+\s\d{4})/;
    const match = line.match(regex);
    return match ? match[1] : null;
}

function isSankrantiLine(line) {
    return line.includes("Makara Sankranti (Sun enters") || line.includes("Karka Sankranti (Sun enters")
}

function getAyana(line){
    return line.includes("Makara Sankranti (Sun enters")?"Uttarayana":"Dakshinayana"
}

function isRemarksLine(line, numSpaces) {
    const regex = new RegExp(`^\\s{${numSpaces}}`)
    return regex.test(line) && line[numSpaces]!=" "
}

var karana = {}

try {
  karana = JSON.parse(fs.readFileSync('karana.json', 'utf-8'))
}catch(e){
  throw e
}

// Read the calendar text from file
fs.readFile('cal.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err)
    return
  }

  var masa = null
  var ayana = "Uttarayana"

  // Split the text into lines
  const lines = data.split('\n')
  const [tithiIndex, pakshaIndex, nakshatraIndex ,yogaIndex] = findIndicesInHeader(extractHeader(lines))

  // Define an array to store the parsed calendar entries
  const calendarEntries = []

  // Iterate over the calendar data
  for (var line of lines) {

    if(isMasaLine(line)){
        var m = extractMasaDetails(line)
        if(m.gaudiya=="Purusottama-adhika"){
          masa.gaudiya="Purusottama"
          masa.traditional=`Adhika ${masa.traditional}`
          continue
        }
        masa = m
        continue
    }

    if(isSankrantiLine(line)){
        ayana = getAyana(line)
        calendarEntries[calendarEntries.length-1].ayana=ayana
        continue
    }

    if(isRemarksLine(line, tithiIndex)){
        calendarEntries[calendarEntries.length-1].remarks = (calendarEntries[calendarEntries.length-1].remarks || [])
        calendarEntries[calendarEntries.length-1].remarks.push(line.trim())
        continue
    }

    if(!isDateLine(line)){
        // console.log(line)
        continue
    }

    var rawDate = extractDate(line)
    const dayOfWeek = moment(rawDate, 'D MMM YYYY').format('dddd')
    const formattedDate = moment(rawDate, 'D MMM YYYY').format('YYYY-MM-DD')

    const entry = {
      date: formattedDate,
      day: dayOfWeek,
      ayana,
      rtu: rtuMap[masa.traditional],
      gaudiyaMasa: (masa.gaudiya || null),
      traditionalMasa: (masa.traditional || null),
      gaudiyaPaksha: line.charAt(pakshaIndex-1)=="G"?"Gaura":"Krishna",
      traditionalPaksha: line.charAt(pakshaIndex-1)=="G"?"Shukla":"Krishna",
      tithi: line.substring(tithiIndex, pakshaIndex-1).trim(),
      vasara: vedicWeekdays[dayOfWeek],
      nakshatra: line.substring(nakshatraIndex).replace(/\*/, '').trim(),
      yoga: line.substring(pakshaIndex, nakshatraIndex).trim(),
      karana: karana[formattedDate],
      fast: line.trim().endsWith("*")
    }

    // Add the entry to the calendar entries array
    calendarEntries.push(entry)
  }

  // Generate the JavaScript code
  const jsCode = `var calendarData = ${JSON.stringify(calendarEntries, null, 2)}`

  // Save the JavaScript code to cal.js
  fs.writeFile('cal.js', jsCode, err => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }
    console.log('cal.js file has been created successfully!')
  })
})
