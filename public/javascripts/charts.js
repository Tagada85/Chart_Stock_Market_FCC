'strict mode';
const socket = io.connect('https://morning-reef-68678.herokuapp.com');

socket.on('display charts',function(data){
    let symbols = data.stocks.map((el)=>{
        return el.symbol_name;
    });
    $(function () {
        let seriesOptions = [];
        let seriesCounter = 0;
        let dates = [];
        let desc = [];
        function createChart(){
            $('#stocks').empty();
            $.each(desc, function(i, stock){
                $('#stocks').append('<div class="stock_desc"><h2>' + stock[0] +'</h2>' + 
                    "<p>" + stock[1] + "</p><button id='"+ stock[0] +"' onclick='deleteBtn(this)'>Delete Stock</button></div>");
            });
            $('#container').highcharts({
                title : {
                    text : 'Stock Prices'
                },
                tooltip: {
                    pointFormatter: function(){
                        return Highcharts.dateFormat("%A %d %B %Y", this.category, true)  + '<br>' + this.series.name + ' : ' + this.y;
                    }
                },
                xAxis: {
                    labels:{
                        formatter:function(){
                            return Highcharts.dateFormat("%B %Y", this.value, false);
                        }
                    },    
                    range:  12 * 30 * 24 * 3600 * 1000
                },
                series : seriesOptions
            });
            symbols = [];
        }//end createChart
        $.each(symbols, function(i, symbol){
             $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?api_key=scNpCyAxytomddqPSCPR', function (data) {
                dates.push(data.dataset.start_date);
                desc.push([data.dataset.dataset_code, data.dataset.name]);
                const stocks = data.dataset.data;
                const displayedStocks = stocks.map((stock)=>{
                    let dateUtc = new Date(stock[0]).getTime();
                    return [dateUtc, stock[4]];
                });
                displayedStocks.sort(function(a,b){
                    if(a[0] < b[0]){
                        return -1;
                    }else{
                        return 1;
                    }
                });
                seriesOptions[i] = {
                    name: symbol,
                    data: displayedStocks
                }
                seriesCounter += 1;
                if (seriesCounter === symbols.length) {
                    createChart();
                }
            });
        });
    });

});


function deleteBtn(param){
    let id = $(param).attr('id');
    socket.emit('delete stock', {id: id});
}


