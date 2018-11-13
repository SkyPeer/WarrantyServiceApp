module.exports = (_currentDate, _ticketDate, _daysLeft) => {

        const dateOfCreation = new Date(_ticketDate);
        const finishDate = new Date(_ticketDate);
        const currentDate = new Date(_currentDate);
        const minutes = dateOfCreation.getMinutes() < 10 ? '0'+dateOfCreation.getMinutes(): dateOfCreation.getMinutes()

        finishDate.setDate(dateOfCreation.getDate()+parseInt(_daysLeft));



        const daysLeftLocal = Math.round((finishDate - currentDate) / 1000 / 60 / 60/ 24);


        let daysLeftClass = daysLeftLocal < 5 ? 'red' :'yellow';
        daysLeftClass = daysLeftLocal < 15 ? 'yellow' : 'green';




        return {dateOfCreation: (dateOfCreation.getDate() + '/' + (dateOfCreation.getMonth()+parseInt(1)) + '/' +dateOfCreation.getFullYear()+' '+dateOfCreation.getHours()+':'+ minutes ),
            finishDate: (finishDate.getDate() + '/' +(finishDate.getMonth()+parseInt(1)) + '/' +finishDate.getFullYear()),
            daysLeftLocal: daysLeftLocal, daysLeftClass: daysLeftClass}
};
