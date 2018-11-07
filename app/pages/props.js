export let ticketPriorityOptions = [
    {value: 0, label: "Низкий", className: 'priority priority_green' },
    {value: 1, label: "Средний", className: 'priority priority_yellow'},
    {value: 2, label: "Высокий", className: 'priority priority_red'}
];

export let placeOptions = [
    {value: 0, label: "Головной офис"},
    {value: 1, label: "Доп. офис №1"},
    {value: 2, label: "Доп. офис №2"},
    {value: 3, label: "Склад"},
    {value: 4, label: "Заказчик"},
    {value: 5, label: "Другое"}
];

export let statusOptions = [
    { value: 0, label: 'Новая', className: 'status_new' },
    { value: 1, label: 'Необходимы уточнения', className: 'status_red' },
    { value: 2, label: 'В работе', className: 'status_yellow'},
    { value: 3, label: 'Завершена', className: 'status_green'  },
    { value: 4, label: 'Отклонена', className: 'status_canceled'},
];
export let typeOfServiceOptions = [
    {value: 0, label: 'Гарантийный'},
    {value: 1, label: 'Не гарантийный'}
];