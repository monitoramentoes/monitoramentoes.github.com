/**
 * Created by clayton on 01/03/15.
 */
function renderChart(chart, data, container) {
    d3.select(container)
        .datum(data)
        .transition().duration(1000).call(chart);

    nv.utils.windowResize(
        function() {
            chart.update();
        }
    );
}

function createMultiBarChartByDate(data, container) {
    ptBR = d3.locale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["$", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
        "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    });

    var chart = nv.models.multiBarChart()
        .x(function(d,i) { return d[0] })
        .y(function(d) { return d[1] });
    
    //var legenda = nv.models.legend;
    //legenda.width = 600;
    //chart.legend = legenda();
    chart.showLegend(true);
    chart.showControls(false);
    chart.forceY([0]);
    chart.multibar.stacked(true);
    chart.yAxis
        .showMaxMin(true)
        .tickFormat(function(d) {
            return  format = ptBR.numberFormat('$,.2f')(d);
        })

    chart.xAxis
        .showMaxMin(true)
        .tickFormat(function(d) {
            return ptBR.timeFormat('%B')(d);
        })



    renderChart(chart, data, container);
    return chart;

}