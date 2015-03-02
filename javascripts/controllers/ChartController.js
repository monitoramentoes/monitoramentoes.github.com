angular.module('monitora').controller('ChartController',function($scope , $http, $resource , $element , _ ){


    $scope.anos = [ {value : 2012}, {value : 2013}, {value : 2014}];
    $scope.ano = 2014;
    $scope.top = 3;


    $scope.valChange = function (){
        if (($scope.ano)&&($scope.top)){
            callGraph('orgao',$scope.ano,$scope.top);
        }
    };


    function callGraph(tipo,ano,top){
        //var Orgao = $resource('http://opendataday.herokuapp.com/api/despesas/:tipo?ano=:ano&top=:top');
        var Orgao = $resource('http://localhost:3000/api/despesas/:tipo?ano=:ano&top=:top');
        Orgao.query({tipo : tipo, ano : ano , top : top}, function(data){ processaDados(data[0]) } , function (erro) {});



        function processaDados(dados) {

            dados_puros = dados

            var dados  = _.map(dados.orgaos ,function(el)
            {
                var  dados_orgao = {'key': el.orgao, 'values': _.map(el.periodos,
                function(periodos){
                    return [
                        new Date(periodos.datdocumento.split(" ")[1], periodos.datdocumento.split(" ")[0] - 1, 1)
                        , periodos.valor_pago]

                })}


                if (el.periodos.length < 12){
                    var ano = $scope.ano
                    var periodos = _.map(el.periodos, function (num) {
                        return parseInt(num.datdocumento.split(" ")[0])
                    });


                    var  meses_restantes =  (_.map(_.filter(_.range(1,13), function(num){return  !_.contains(periodos,num) }),
                        function (mes_restante){ return [new Date(ano, mes_restante -1, 1),0];}));
                    
                    _.each(meses_restantes,function(val) {
                        dados_orgao.values.push(val);
                    })
                    
                    dados_orgao.values = _.sortBy(dados_orgao.values, function(d){ return  (new Date(d[0]).getMonth()) })


            }



                return dados_orgao
            });


            dados_analise = dados;



                _.each($element,function (el){
                createMultiBarChartByDate(dados, '#'+ el.id + ' svg');
            });
        }
    }



    callGraph('orgao',$scope.ano,$scope.top)


});


