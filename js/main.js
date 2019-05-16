let init = 0;
let startDate;
let clocktimer;

function stopTime() {
    clearTimeout(clocktimer);
    init = 0;
}

function startTime() {
    let currentDate = new Date();
    let t = currentDate.getTime() - startDate.getTime();

    let ms = t % 1000; 
    t -= ms;
    t = Math.floor(t / 1000);

    let s = t % 60; 
    t -= s;
    t = Math.floor(t / 60);

    let m = t % 60; 
    t -= m;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    if (ms < 10) ms = '00' + ms;
    if (ms < 100) ms = '0' + ms;
    if (init == 1) $(".clock").text(m + ':' + s + '.' + ms);
    clocktimer = setTimeout(startTime, 1);
}

function findTime() {
    if (init == 0) {
        startDate = new Date();
        startTime();
        init = 1;
    }
    else {
        stopTime();
    }
}



$('.btn-start').on('click', function() {
    if ($(".found").length == 0) {
        findTime();
    } else {
        alert("Игра не закончена.\nПродолжите игру.");
    }
});

$('.game-field td').on('click', function(event) {
    if (init == 1) {
        handlerClickCell(event);
    } else {
        alert("Нажмите \"Старт\" для начала игры");
    }
});

generationColorToCells();

const handlerClickCell = (function() {
    let selectedCells = [];
    return function(event) {
        event.preventDefault();
        let cell = $(event.target);
        cell.css('background-color', cell.val());
        
        selectedCells.push(cell);

        if (selectedCells.length == 2) {
            let firstSelectedCell = selectedCells[0];
            let secondSelectedCell = selectedCells[1];
            
            //Если одну клетку тыкнули 2 раза, то второй раз удаляем
            if (firstSelectedCell[0] === secondSelectedCell[0]) {
                selectedCells.pop();
                return;
            }

            //Если цвета не одинаковы и выбранная клетка уже не найдена, то красим обратно в белый
            if (firstSelectedCell.val() !== secondSelectedCell.val()) {
                setTimeout(function () {
                    if (firstSelectedCell.attr('class') != 'found') {
                        firstSelectedCell.css('background-color', 'white');
                    }
                    if (secondSelectedCell.attr('class') != 'found') {
                        secondSelectedCell.css('background-color', 'white');
                    }
                }, 300);         
            } else {
                firstSelectedCell.addClass('found');
                secondSelectedCell.addClass('found');
                if ($(".found").length == 16) {
                    stopTime();
                    setTimeout(function() {
                        alert("Вы выиграли!!!\nЗатраченное время: " + $('.clock').text());
                    }, 50);
                } 
            }
            selectedCells.splice(0, 2);
        }
    }
})();

function generationColorToCells() {
    const maxNumberOneColorOnField = 2;
    let rows = $('tr');
    let colors = [
        { color: 'red', numberColorOnField: 0 }, 
        { color: 'green', numberColorOnField: 0 }, 
        { color: 'blue', numberColorOnField: 0 },  
        { color: 'yellow', numberColorOnField: 0 },
        { color: 'pink', numberColorOnField: 0 }, 
        { color: 'orange', numberColorOnField: 0 }, 
        { color: 'sienna', numberColorOnField: 0 },  
        { color: 'black', numberColorOnField: 0 }
    ];

    for (let indexRow = 0; indexRow < rows.length; indexRow++) {
        let cells = rows[indexRow].cells;

        for (let indexCell = 0; indexCell < cells.length; indexCell++) {
            let indexColor = randomNumber(0, colors.length);

            while (colors[indexColor].numberColorOnField == maxNumberOneColorOnField) {
                indexColor = randomNumber(0, colors.length);
            }

            rows[indexRow].cells[indexCell].value = colors[indexColor].color;
            colors[indexColor].numberColorOnField++;
        }
    }
}

function randomNumber(from, to) {
    return Math.floor(Math.random() * (from - to)) + to;
}