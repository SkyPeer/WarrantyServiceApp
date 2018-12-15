module.exports = (_currentDate, _ticketDate, _daysLeft) => {

        const dateOfCreation = new Date(_ticketDate);
        const finishDate = new Date(_ticketDate);
        const currentDate = new Date(_currentDate);
        const minutes = dateOfCreation.getMinutes() < 10 ? '0'+dateOfCreation.getMinutes(): dateOfCreation.getMinutes();
        let daysLeftClass = '';

        finishDate.setDate(dateOfCreation.getDate()+parseInt(_daysLeft));

        const daysLeftLocal = Math.round((finishDate - currentDate) / 1000 / 60 / 60/ 24);




        switch (true) {
            case(daysLeftLocal < 5)  :
                daysLeftClass = 'daysForService_red';
                break;
            case(daysLeftLocal < 10)  :
                daysLeftClass = 'daysForService_yellow';
                break;
            default:
                daysLeftClass = 'daysForService_green';
        }


        return {dateOfCreation: (dateOfCreation.getDate() + '/' + (dateOfCreation.getMonth()+parseInt(1)) + '/' +dateOfCreation.getFullYear()+' '+dateOfCreation.getHours()+':'+ minutes ),
            finishDate: (finishDate.getDate() + '/' +(finishDate.getMonth()+parseInt(1)) + '/' +finishDate.getFullYear()),
            daysLeftLocal: daysLeftLocal < 0 ? 'просрочено: ' + daysLeftLocal * -1 + ' ' : daysLeftLocal + '', daysLeftClass: daysLeftClass}
};
