module.exports = (ticketDate, daysLeft) => {

        let dateOfCreation = new Date(ticketDate);
        let finishDate = new Date(ticketDate);
        let currentDate = new Date(this.state.currentDate._now);
        let minutes = dateOfCreation.getMinutes() < 10 ? '0'+dateOfCreation.getMinutes(): dateOfCreation.getMinutes()

        finishDate.setDate(dateOfCreation.getDate()+parseInt(daysLeft));

        let daysLeftLocal = Math.round((finishDate - currentDate) / 1000 / 60 / 60/ 24);
        return {dateOfCreation: (dateOfCreation.getDate() + '/' + (dateOfCreation.getMonth()+parseInt(1)) + '/' +dateOfCreation.getFullYear()+' '+dateOfCreation.getHours()+':'+ minutes ),
            finishDate: (finishDate.getDate() + '/' +(finishDate.getMonth()+parseInt(1)) + '/' +finishDate.getFullYear()),
            daysLeftLocal: daysLeftLocal}
};
