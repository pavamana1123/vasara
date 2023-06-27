var calendarData = require("./calendarData")

var dia={
    gaudiyaMasa: {},
    traditionalMasa: {},
    gaudiyaPaksha: {},
    traditionalPaksha: {},
    tithi: {},
    vasara: {},
    nakshatra: {},
    yoga: {},
    karana: {},
    rtu: {}
}

calendarData.forEach(c=>{
    dia.gaudiyaMasa[c.gaudiyaMasa]=''
    dia.gaudiyaPaksha[c.gaudiyaPaksha]=''
    dia.traditionalMasa[c.traditionalMasa]=''
    dia.traditionalPaksha[c.traditionalPaksha]=''

    dia.tithi[c.tithi]=''
    dia.vasara[c.vasara]=''
    dia.nakshatra[c.nakshatra]=''
    dia.yoga[c.yoga]=''
    dia.rtu[c.rtu]=''
    if(c.karana){
        dia.karana[c.karana[0]]=''
        dia.karana[c.karana[2]]=''
    }
})

console.log(dia)