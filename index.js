const fs = require('fs')
const moment = require('moment')

const dia = {
  gaudiyaMasa: {
    Vamana: 'Vāmana',
    Sridhara: 'Śrīdhara',
    Purusottama: 'Puruṣottama',
    Hrsikesa: 'Hṛṣīkeśa',
    Padmanabha: 'Padmanābha',
    Damodara: 'Dāmodara',
    Kesava: 'Keśava',
    Narayana: 'Nārāyana',
    Madhava: 'Mādhava',
    Govinda: 'Govinda',
    Visnu: 'Viṣṇu',
    Madhusudana: 'Madhusūdhana',
    Trivikrama: 'Trivikrama'
  },
  traditionalMasa: {
    Asadha: 'Āṣāḍa',
    'Adhika Asadha': 'Adhika Āṣāḍa',
    Sravana: 'Śrāvaṇa',
    'Adhika Sravana': 'Adhika Śrāvaṇa',
    Bhadra: 'Bhādrapada',
    'Adhika Bhadra': 'Adhika Bhādrapada',
    Asvina: 'Aśvayuja',
    'Adhika Asvina': 'Adhika Aśvayuja',
    Kartika: 'Kārthika',
    'Adhika Kartika': 'Adhika Kārthika',
    Margasirsa: 'Mārgaśira',
    'Adhika Margasirsa': 'Adhika Mārgaśira',
    Pausa: 'Pauṣa',
    'Adhika Pausa': 'Adhika Pauṣa',
    Magha: 'Māgha',
    'Adhika Magha': 'Adhika Māgha',
    Phalguna: 'Phalguṇa',
    'Adhika Phalguna': 'Adhika Phalguṇa',
    Caitra: 'Ćaitra',
    'Adhika Caitra': 'Adhika Ćaitra',
    Vaisakha: 'Vaiśāka',
    'Adhika Vaisakha': 'Adhika Vaiśāka',
    Jyestha: 'Jyeṣṭa',
    'Adhika Jyestha': 'Adhika Jyeṣṭa'
  },
  gaudiyaPaksha: { Gaura: 'Gaura', Krishna: 'Kṛṣṇa' },
  traditionalPaksha: { Shukla: 'Śukla', Krishna: 'Kṛṣṇa' },
  tithi: {
    Tritiya: 'Tṛtīyā',
    Caturthi: 'Ćaturthī',
    Pancami: 'Pañćamī',
    Sasti: 'Ṣaṣṭī',
    Saptami: 'Saptamī',
    Astami: 'Aṣtamī',
    Navami: 'Navamī',
    Dasami: 'Daśamī',
    'Ekadasi (suitable for fasting)': 'Ekādaśī (suitable for fasting)',
    Dvadasi: 'Dvādaśī',
    Trayodasi: 'Trayodaśī',
    Caturdasi: 'Ćaturdaśī',
    Purnima: 'Pūrṇimā',
    Pratipat: 'Pratipat',
    Dvitiya: 'Dvitīyā',
    Amavasya: 'Amāvāsyā',
    'Ekadasi (not suitable for fasting)': 'Ekādaśī (not suitable for fasting)',
    'Dvadasi (suitable for fasting)': 'Dvādaśī (suitable for fasting)'
  },
  vasara: {
    saumya: 'Saumya',
    guru: 'Guru',
    bhargava: 'Bhārgava',
    sthira: 'Sthira',
    bhanu: 'Bhānu',
    indu: 'Indu',
    bhauma: 'Bhauma'
  },
  nakshatra: {
    Pusyami: 'Puṣya',
    Aslesa: 'Āśleṣā',
    Magha: 'Maghā',
    'Purva-phalguni': 'Pūrvā Phalgunī',
    'Uttara-phalguni': 'Uttarā Phalgunī',
    Hasta: 'Hasta',
    Citra: 'Chitrā',
    Swati: 'Swāti',
    Visakha: 'Viśākhā',
    Anuradha: 'Anurādhā',
    Jyestha: 'Jyeṣṭhā',
    Mula: 'Mūla',
    'Purva-asadha': 'Pūrvāṣāḍhā',
    Sravana: 'Śravaṇa',
    Dhanista: 'Dhaniṣṭā',
    Satabhisa: 'Śatabhiṣa',
    'Purva-bhadra': 'Pūrvabhādra',
    'Uttara-bhadra': 'Uttarabhādra',
    Revati: 'Revati',
    Asvini: 'Aśvinī',
    Bharani: 'Bhāranī',
    Krittika: 'Kṛttikā',
    Rohini: 'Rohiṇī',
    Mrigasira: 'Mṛgaśīra',
    Ardra: 'Ārdrā',
    Punarvasu: 'Punarvasū',
    'Uttara-asadha': 'Uttarāṣāḍhā'
  },
  yoga: {
    Vyagata: 'Vyāgātha',
    Harsana: 'Harṣaṇa',
    Vajra: 'Vajra',
    Siddhi: 'Siddhi',
    Vyatipata: 'Vyatipāta',
    Variyana: 'Variyān',
    Parigha: 'Parigha',
    Siddha: 'Siddha',
    Sadhya: 'Sādhya',
    Subha: 'Śubha',
    Sukla: 'Śukla',
    Brahma: 'Brahma',
    Indra: 'Indra',
    Vaidhriti: 'Vaidhṛti',
    Priti: 'Prīti',
    Ayusmana: 'Āyuṣmān',
    Saubhagya: 'Śaubhāgya',
    Sobana: 'Śobhāna',
    Atiganda: 'Atigaṇḍa',
    Sukarma: 'Sukarma',
    Dhriti: 'Dhṛti',
    Sula: 'Śūla',
    Ganda: 'Gaṇḍa',
    Vriddhi: 'Vṛddhi',
    Dhruva: 'Dhruva ',
    Siva: 'Śiva',
    Viskumba: 'Viśkumbha'
  },
  karana: {
    Gara: 'Garaja',
    Vanija: 'Vaṇija',
    Vishti: 'Viṣṭi',
    Bava: 'Bava',
    Baalava: 'Bālava',
    Kauvala: 'Kaulava',
    Taitila: 'Taitila',
    Sakuna: 'Śakuni',
    Chatushpada: 'Ćatuṣpāda',
    Naga: 'Nāga',
    Kinstughna: 'Kiṃstughna'
  },
  rtu: {
    Grishma: 'Gṛīṣma',
    Varsha: 'Varṣa',
    Sharat: 'Śarad',
    Hemanta: 'Hemanta',
    Shishira: 'Śiśira',
    Vasant: 'Vasanta'
  }
}

const masaSeq = [ 'Caitra', 'Vaisakha', 'Jyestha', 'Asadha', 'Sravana', 'Bhadra', 'Asvina', 'Adhika', 'Kartika', 'Margasirsa', 'Pausa', 'Magha',
'Phalguna']

const gtm = {
  Kesava: {
      Krishna: 'Kartika',
      Gaura: 'Margasirsa',
  },
  Narayana: {
      Krishna: 'Margasirsa',
      Gaura: 'Pausa',
  },
  Madhava: {
      Krishna: 'Pausa',
      Gaura: 'Magha',
  },
  Govinda: {
      Krishna: 'Magha',
      Gaura: 'Phalguna',
  },
  Visnu: {
      Krishna: 'Phalguna',
      Gaura: 'Caitra',
  },
  Madhusudana: {
      Krishna: 'Caitra',
      Gaura: 'Vaisakha',
  },
  Trivikrama: {
      Krishna: 'Vaisakha',
      Gaura: 'Jyestha',
  },
  Vamana: {
      Krishna: 'Jyestha',
      Gaura: 'Asadha',
  },
  Sridhara: {
      Krishna: 'Asadha',
      Gaura: 'Sravana',
  },
  Hrsikesa: {
      Krishna: 'Sravana',
      Gaura: 'Bhadra',
  },
  Padmanabha: {
      Krishna: 'Bhadra',
      Gaura: 'Asvina',
  },
  Damodara: {
      Krishna: 'Asvina',
      Gaura: 'Kartika',
  },
  Purusottama: {
    Krishna: 'Adhika',
    Gaura: 'Adhika',
}
}

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
    const startIndexTithi = headerLine.indexOf("TITHI")
    const endIndexTithi = headerLine.indexOf("PAKSA") - 1
    // const startIndexPaksa = endIndexTithi + 1
    const endIndexPaksa = headerLine.indexOf("YOGA") - 1
    const startIndexYoga = endIndexPaksa + 1
    const endIndexYoga = headerLine.indexOf("NAKSATRA") - 1
    const startIndexNaksatra = endIndexYoga + 1
    // const endIndexNaksatra = headerLine.indexOf("FAST") - 1
    return [startIndexTithi, endIndexPaksa, startIndexNaksatra, startIndexYoga]
}

function isHeader(line) {
    line = line.trim()
    const regex = /^DATE\s+TITHI\s+PAKSA\s+YOGA\s+NAKSATRA\s+FAST$/
    return regex.test(line)
}

function extractHeader(lines) {
    for (const line of lines) {
      if (isHeader(line)) {
        return line
      }
    }
    return null // Return null if header line is not found
}

function isMasaLine(line) {
    line = line.trim()
    const regex = /^([A-Za-z\s-]+)(?:\(([A-Za-z]+)\))?\sMasa,\sGaurabda\s\d+\s+GCal\s\d+,\sBuild\s\d+$/
    return regex.test(line)
}
  
function getMasa(line) {
    line = line.trim()
    const regex = /^([A-Za-z\s-]+)(?:\(([A-Za-z]+)\))?\sMasa,\sGaurabda\s\d+\s+GCal\s\d+,\sBuild\s\d+$/
    const match = line.match(regex)
    return (match && match.length>=2) ? match[1].trim() : null
}

function isDateLine(line) {
    line = line.trim()
    const regex = /^\d{1,2}\s\w+\s\d{4}/
    return regex.test(line)
}

function extractDate(line) {
    line = line.trim()
    const regex = /^(\d{1,2}\s\w+\s\d{4})/
    const match = line.match(regex)
    return match ? match[1] : null
}

function isSankrantiLine(line) {
    return line.includes("Makara Sankranti (Sun enters") || line.includes("Karka Sankranti (Sun enters")
}

function getAyana(line){
    return line.includes("Makara Sankranti (Sun enters")?"Uttarāyaṇa":"Dakṣiṇāyana"
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
  var ayana = "Uttarāyaṇa"

  // Split the text into lines
  const lines = data.split('\n')
  const [tithiIndex, pakshaIndex, nakshatraIndex ,yogaIndex] = findIndicesInHeader(extractHeader(lines))

  // Define an array to store the parsed calendar entries
  const calendarEntries = []

  // Iterate over the calendar data
  for (var line of lines) {

    if(isMasaLine(line)){
        var m = getMasa(line)
        if(m == "Purusottama-adhika"){
          masa = "Purusottama"
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
      gaudiyaMasa: masa,
      gaudiyaPaksha: line.charAt(pakshaIndex-1)=="G"?"Gaura":"Krishna",
      traditionalPaksha: line.charAt(pakshaIndex-1)=="G"?"Shukla":"Krishna",
      tithi: line.substring(tithiIndex, pakshaIndex-1).trim(),
      vasara: vedicWeekdays[dayOfWeek],
      nakshatra: line.substring(nakshatraIndex).replace(/\*/, '').trim(),
      yoga: line.substring(pakshaIndex, nakshatraIndex).trim(),
      karana: karana[formattedDate],
      fast: line.trim().endsWith("*")
    }

    entry.traditionalMasa = gtm[entry.gaudiyaMasa][entry.gaudiyaPaksha]
    entry.rtu = rtuMap[entry.traditionalMasa]

    if(entry.gaudiyaMasa == "Purusottama"){
      if(calendarEntries[calendarEntries.length-1].gaudiyaMasa!="Purusottama"){
        entry.traditionalMasa = `Adhika ${masaSeq[(masaSeq.indexOf(calendarEntries[calendarEntries.length-1].traditionalMasa)+1)%masaSeq.length]}`
      }else{
        entry.traditionalMasa = calendarEntries[calendarEntries.length-1].traditionalMasa
      }
      entry.rtu = rtuMap[entry.traditionalMasa.replace("Adhika ", "")]
    }

    // Add the entry to the calendar entries array
    calendarEntries.push(entry)
  }

  for(var i=0; i<calendarEntries.length; i++){
    calendarEntries[i].gaudiyaMasa = dia.gaudiyaMasa[calendarEntries[i].gaudiyaMasa] || calendarEntries[i].gaudiyaMasa
    calendarEntries[i].traditionalMasa = dia.traditionalMasa[calendarEntries[i].traditionalMasa] || calendarEntries[i].traditionalMasa
    calendarEntries[i].gaudiyaPaksha = dia.gaudiyaPaksha[calendarEntries[i].gaudiyaPaksha] || calendarEntries[i].gaudiyaPaksha
    calendarEntries[i].traditionalPaksha = dia.traditionalPaksha[calendarEntries[i].traditionalPaksha] || calendarEntries[i].traditionalPaksha
    calendarEntries[i].tithi = dia.tithi[calendarEntries[i].tithi] || calendarEntries[i].tithi
    calendarEntries[i].vasara = dia.vasara[calendarEntries[i].vasara] || calendarEntries[i].vasara
    calendarEntries[i].nakshatra = dia.nakshatra[calendarEntries[i].nakshatra] || calendarEntries[i].nakshatra
    calendarEntries[i].yoga = dia.yoga[calendarEntries[i].yoga] || calendarEntries[i].yoga
    calendarEntries[i].rtu = dia.rtu[calendarEntries[i].rtu] || calendarEntries[i].rtu
    if(calendarEntries[i].karana && calendarEntries[i].karana[0] && calendarEntries[i].karana[2]){
      calendarEntries[i].karana[0] = dia.karana[calendarEntries[i].karana[0]] || calendarEntries[i].karana[0]
      calendarEntries[i].karana[2] = dia.karana[calendarEntries[i].karana[2]] || calendarEntries[i].karana[2]
    }
  }

  // Generate the JavaScript code
  const jsCode = `var calendarData = ${JSON.stringify(calendarEntries, null, 2)}`
  const diaCode = `var calendarData = ${JSON.stringify(calendarEntries, null, 2)}\nmodule.exports = calendarData`

  // Save the JavaScript code to cal.js
  fs.writeFile('cal.js', jsCode, err => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }
    console.log('cal.js file has been created successfully!')
  })

  fs.writeFile('./dia/calendarData.js', diaCode, err => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }
    console.log('./dia/calendarData.js file has been created successfully!')
  })
})
