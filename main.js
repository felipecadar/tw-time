Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function startPage(){
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    
    if (params.source){
        console.log("source", params.source)
        document.getElementById("coord1").value = params.source
    }
    if (params.target){
        console.log("target", params.target)
        document.getElementById("coord2").value = params.target
    }
    if(params.arrival){
        console.log("arrival", params.arrival)
        document.getElementById("chegada").value = params.arrival

        calc(null)
    }
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

function calc(e) {
    if(e){
        e.preventDefault();
    }

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

    var min_diff = 10000000000
    var min_key = ''

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

        // <div class="alert alert-primary" role="alert">

        let now_date = new Date()
        let diff_hours = Math.abs(now_date.getHours() - exit_date.getHours())
        let diff_minutes = Math.abs(now_date.getMinutes() - exit_date.getMinutes())
        let diff_seconds = Math.abs(now_date.getSeconds() - exit_date.getSeconds())

        let total_diff = (diff_hours * 60 * 60) + (diff_minutes * 60) + diff_seconds
        
        if (total_diff < min_diff){
            min_diff = total_diff
            min_key = key
        }
    }

    document.getElementById(min_key).parentElement.setAttribute("class", "alert alert-primary");
    document.getElementById(min_key).parentElement.setAttribute("role", "alert");

    return false
}