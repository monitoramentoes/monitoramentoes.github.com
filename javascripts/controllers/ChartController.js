angular.module('monitora').controller('ChartController',function($scope , $http, $resource , $element , _ , ngProgress ){
    
    
    
    
    $scope.anos = [ {value : 2012}, {value : 2013}, {value : 2014}];
    $scope.tipo = 'orgao'
    $scope.tipos = [ {text: 'Órgãos', value : 'orgao'}, {text: 'Favorecidos', value : 'favorecido'}, {text: 'Programas', value : 'acao'}];
    $scope.ano = 2014;
    $scope.top = 3;
    
    
    $scope.title = _.where($scope.tipos,{ value : $scope.tipo})[0].text;
    


    $scope.valChange = function (){
        if (($scope.ano)&&($scope.top)){
            callGraph($scope.tipo,$scope.ano,$scope.top);
        }
    };


    function callGraph(tipo,ano,top){
        
        ngProgress.start();
        
        var Orgao = $resource('http://opendataday.herokuapp.com/api/despesas/:tipo?ano=:ano&top=:top');
        //var Orgao = $resource('http://localhost:3000/api/despesas/:tipo?ano=:ano&top=:top');
        Orgao.query({tipo : tipo, ano : ano , top : top}, function(data){ processaDados(data[0]) } , function (erro) {});



        function processaDados(dados) {
            var  dados_analise = (function(){
                if($scope.tipo == 'orgao') {
                    return  dados.orgaos
                } else if ($scope.tipo == 'favorecido') {
                    return  dados.favorecidos
                } else {
                    return  dados.acoes
                }
            })();
            
            
            var dados  = _.map( dados_analise ,function(el)
            {

                var  key = (function(){
                    if($scope.tipo == 'orgao') {
                        return  el.orgao
                    } else if ($scope.tipo == 'favorecido') {
                        return  el.favorecido
                    } else {
                        return  el.acao
                    }
                })();
                
                var  dados_nivel1 = {'key': key, 'values': _.map(el.periodos,
                function(periodos){
                    return [
                        new Date(periodos.datdocumento.split(" ")[1], periodos.datdocumento.split(" ")[0] - 1, 1)
                        , periodos.valor_pago]

                })};


                if (el.periodos.length < 12){
                    var ano = $scope.ano;
                    var periodos = _.map(el.periodos, function (num) {
                        return parseInt(num.datdocumento.split(" ")[0])
                    });


                    var  meses_restantes =  (_.map(_.filter(_.range(1,13), function(num){return  !_.contains(periodos,num) }),
                        function (mes_restante){ return [new Date(ano, mes_restante -1, 1),0];}));
                    
                    _.each(meses_restantes,function(val) {
                        dados_nivel1.values.push(val);
                    });

                    dados_nivel1.values = _.sortBy(dados_nivel1.values, function(d){ return new Date(d[0]).getMonth() })


            }



                return dados_nivel1
            });


            dados_analise = dados;



                _.each($element,function (el){
                createMultiBarChartByDate(dados, '#'+ el.id + ' svg');
            });
        }


        ngProgress.complete();
    }



    callGraph('orgao',$scope.ano,$scope.top)


});


