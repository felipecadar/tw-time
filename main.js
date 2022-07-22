Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function movingTime(fields){
    return {
        'lanc':18*fields*60000,
        'esp':22*fields*60000,
        'barb':18*fields*60000,
        'expl':9*fields*60000,
        'cl':10*fields*60000,
        'cp':11*fields*60000,
        'ar':30*fields*60000,
        'nb':35*fields*60000,
        'palad':10*fields*60000,
    }
}

function parseDate(str) {
    var parts = str.split(":")
    var hora = parseInt(parts[0])
    var minuto = parseInt(parts[1])
    var segundo = parseInt(parts[2])

    var dt = new Date()
    var today = new Date()
    
    dt.setHours(hora)
    dt.setMinutes(minuto)
    dt.setSeconds(segundo)
    
    if(dt < today){
        dt = dt.addDays(1)
    }

    return dt
}

function parseCoord(str){
    var parts = str.split("|");
    var coord = [parseInt(parts[0]), parseInt(parts[1])]
    return coord
}

function calculateFiels(p1, p2){
    return Math.sqrt( Math.pow((p1[0]-p2[0]), 2) + Math.pow((p1[1]-p2[1]), 2) );
}

function cedo(){
    document.getElementById("chegada").value = "8:0:0"
}

function calc() {
    meses = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec',]

    // let today = new Date()
    let coord1 = parseCoord(document.getElementById("coord1").value)
    let coord2 = parseCoord(document.getElementById("coord2").value)
    let chegada = parseDate(document.getElementById("chegada").value)

    let dist = calculateFiels(coord1, coord2)
    
    let times = movingTime(dist)
    let exit_times = {}
    let offset_times = {}

    for (const key in times) {
        t = times[key]
        offset = new Date(t)
        exit_date = new Date(chegada - offset)
        exit_times[key] = exit_date
        offset_times[key] = t/60000
    } 


    for (const key in exit_times) {
        exit_date = exit_times[key]
        let time_str = ` ${exit_date.getHours()}h ${exit_date.getMinutes()}m ${exit_date.getSeconds()}s`
        // let time_str = `${exit_date.getDay()} ${meses[exit_date.getMonth()]}  ${exit_date.getHours()}h ${exit_date.getMinutes()}m ${exit_date.getSeconds()}s`
        document.getElementById(key).innerHTML = time_str
        
        
        offset = offset_times[key]
        hours = parseInt(offset/60)
        minutes = parseInt(offset - (60*hours))
        seconds = parseInt((offset - parseInt(offset))*60)
        let offset_str = `${hours}h ${minutes}m ${seconds}s`
        document.getElementById(`total-${key}`).innerHTML = offset_str



    }


    // document.getElementById("meses").innerHTML = meses_completos
    // document.getElementById("anos").innerHTML = anos_completos

    // document.getElementById("resp_capital_mes").innerHTML = capital
    // document.getElementById("resp_juros_mes").innerHTML = resp_juros_mes
    // document.getElementById("resp_final_mes").innerHTML = resp_final_mes

    // document.getElementById("resp_capital_ano").innerHTML = capital
    // document.getElementById("resp_juros_ano").innerHTML = resp_juros_ano
    // document.getElementById("resp_final_ano").innerHTML = resp_final_ano
}