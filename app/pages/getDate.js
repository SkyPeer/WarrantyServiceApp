module.exports = (_currentDate, _ticketDate, _daysLeft) => {

        let dateOfCreation = new Date(_ticketDate);
        let finishDate = new Date(_ticketDate);
        let currentDate = new Date(_currentDate);
        let minutes = dateOfCreation.getMinutes() < 10 ? '0'+dateOfCreation.getMinutes(): dateOfCreation.getMinutes()

        finishDate.setDate(dateOfCreation.getDate()+parseInt(_daysLeft));



        let daysLeftLocal = Math.round((finishDate - currentDate) / 1000 / 60 / 60/ 24);
        return {dateOfCreation: (dateOfCreation.getDate() + '/' + (dateOfCreation.getMonth()+parseInt(1)) + '/' +dateOfCreation.getFullYear()+' '+dateOfCreation.getHours()+':'+ minutes ),
            finishDate: (finishDate.getDate() + '/' +(finishDate.getMonth()+parseInt(1)) + '/' +finishDate.getFullYear()),
            daysLeftLocal: daysLeftLocal}
};
