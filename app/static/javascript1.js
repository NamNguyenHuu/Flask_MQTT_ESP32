var socket = io.connect('http://localhost:5000');
        // listen for mqtt_message events
        // when a new message is received, log data to the page

$(document).ready(function() {
        
});

var Data = {
    labels: [],
    datasets: [{
        label: 'Nhiệt độ ',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y',
    }
    ,{
        label: 'Độ ẩm ',
        data: [],
        backgroundColor: 'rgba(0, 128, 0, 1)',
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
    }]
};

var Options = {
    type:'line',
    options:{
        responsive: true
    },
    scales: {
        x:{
            display: true,
            title:{
                display: true,
                text: 'Thời gian (hh:mm)'
            }
        },
        y: {
            display: true,
            title:{
                display: true,
                text: 'Nhiệt độ (°C)'
            },
            position: 'left',
            suggestedMin: 0,
            suggestedMax: 50 
        },
        y1: {
            display: true,
            title:{
                display: true,
                text: 'Độ ẩm (%)'
            },
            position: 'right',
            suggestedMin: 0,
            suggestedMax: 80, 
            grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
        },
    }
};

var Chart = new Chart(document.getElementById('Chart').getContext('2d'), {
    type: 'line',
    data: Data,
    options: Options
});

function UpdateData(chart, label,tempdata,humdata) {
    chart.data.labels.push(label.toString());
    chart.data.labels.shift();
    chart.data.datasets[0].data.push(tempdata.toString());
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.push(humdata.toString());
    chart.data.datasets[1].data.shift();
    chart.update('none');
}

socket.on('chart_getdata',function(data){
    console.log("chuoi JSON nhan duoc: ",data)
    myarray = JSON.parse(data)
    myarray.forEach(function(item){
        Chart.data.labels.push(item.time.toString())
        Chart.data.datasets[0].data.push(item.temperature.toString())
        Chart.data.datasets[1].data.push(item.humidity.toString())
    })
    Chart.update()
})

socket.on('mqtt_message_recent', function(data) {
    console.log("Do am nhan duoc: ",data[0]);
    console.log("Nhiet do nhan duoc: ",data[1]);
    console.log("Thoi gian cap nhat:",data[2]);
    document.getElementById("humdata_id").textContent = "Nhiệt độ: " + data[0] + "%";
    document.getElementById("tempdata_id").textContent = "Độ ẩm: " + data[1] + "°C";
    UpdateData(Chart,data[2],data[1],data[0]);
})
socket.emit('connect_homepage','connected')