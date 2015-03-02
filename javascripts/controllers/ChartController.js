angular.module('monitora').controller('ChartControllerOrgao',function($scope , $http, $resource , $element , _ , ngProgress ){
    $scope.anos = [ {value : 2012}, {value : 2013}, {value : 2014}];
    $scope.tipo = 'orgao'
    $scope.ano = 2014;
    $scope.top = 3;

    $scope.valChange = function (){
        if (($scope.ano)&&($scope.top)){
            callGraph( ngProgress,$resource,$element,$scope,_);
        }
    };

    callGraph(ngProgress,$resource,$element,$scope,_)
});

angular.module('monitora').controller('ChartControllerFornecedor',function($scope , $http, $resource , $element , _ , ngProgress ){
    $scope.anos = [ {value : 2012}, {value : 2013}, {value : 2014}];
    $scope.tipo = 'favorecido'
    $scope.ano = 2014;
    $scope.top = 3;

    $scope.valChange = function (){
        if (($scope.ano)&&($scope.top)){
            callGraph(ngProgress,$resource,$element,$scope,_);
        }
    };

    callGraph(ngProgress,$resource,$element,$scope,_)
});

angular.module('monitora').controller('ChartControllerAcao',function($scope , $http, $resource , $element , _ , ngProgress ){
    $scope.anos = [ {value : 2012}, {value : 2013}, {value : 2014}];
    $scope.tipo = 'acao'
    $scope.ano = 2014;
    $scope.top = 3;

    $scope.valChange = function (){
        if (($scope.ano)&&($scope.top)){
            callGraph(ngProgress,$resource,$element,$scope,_);
        }
    };

    callGraph(ngProgress,$resource,$element,$scope,_)
});



function callGraph(ngProgress,$resource,$element,$scope,_){
    
    var tipo = $scope.tipo;
    var ano = $scope.ano;
    var top = $scope.top;




    ngProgress.start();


    var Orgao = $resource('http://opendataday.herokuapp.com/api/despesas/:tipo?ano=:ano&top=:top');
    //var Orgao = $resource('http://localhost:3000/api/despesas/:tipo?ano=:ano&top=:top');
    Orgao.query({tipo : tipo, ano : ano , top : top}, function(data){ 
        $scope.dados = data[0];
        processaDados($scope.dados);
    } , function (erro) {});


    function processaDados(dados) {
        var  dados_analise = (function(){
            if(tipo == 'orgao') {
                return  dados.orgaos
            } else if (tipo == 'favorecido') {
                return  dados.favorecidos
            } else {
                return  dados.acoes
            }
        })();


        var dados  = _.map( dados_analise ,function(el)
        {

            var  key = (function(){
                if(tipo == 'orgao') {
                    return  el.orgao
                } else if (tipo == 'favorecido') {
                    return  el.favorecido
                } else {
                    return  el.acao
                }
            })();


            //$scope.elementos.push({'key': key, 'valor_pago' : el.valor_pago});

            var  dados_nivel1 = {'key': key, 'values': _.map(el.periodos,
                function(periodos){
                    return [
                        new Date(periodos.datdocumento.split(" ")[1], periodos.datdocumento.split(" ")[0] - 1, 1)
                        , periodos.valor_pago]

                })};


            if (el.periodos.length < 12){
                var ano = ano;
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
            createMultiBarChartByDate(dados, '#'+ el.id + ' svg.'+ tipo);
        });


        ngProgress.complete();


        saida = $scope.dados;
        
        

    }

    
}







