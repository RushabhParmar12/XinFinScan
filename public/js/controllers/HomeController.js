angular.module('BlocksApp').controller('HomeController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    var URL = '/data';

    $rootScope.isHome = true;

    $scope.reloadBlocks = function() {
      $scope.blockLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_blocks"}
      }).success(function(data) {
        $scope.blockLoading = false;
        $scope.latest_blocks = data.blocks;

        //get latest data
        $scope.blockHeight = data.blockHeight;
        $scope.epoch = (data.blockHeight / 900).toFixed()
        $scope.blockTime = data.blockTime;
        $scope.TPS = data.TPS;
        $scope.meanDayRewards = data.meanDayRewards;
      });

      // todayRewards();
      totalNodes();
      totalXDC();
      totalStakedValue();
      totalBurntValue();
      FetchUSDPrrice();
    }

    function todayRewards(){
      $http({
        method: 'POST',
        url: '/todayRewards',
        data: {}
      }).success(function(data) {
        $scope.todayRewards = data;
      });
    }
    function totalStakedValue(){
      $http({
        method: 'POST',
        url: '/totalStakedValue',
        data: {}
      }).success(function(data) {
        $scope.totalStakedValue = data;
      });
    }
    function totalBurntValue(){
      $http({
        method: 'POST',
        url: '/totalBurntValue',
        data: {}
      }).success(function(data) {
        $scope.totalBurntValue = data;
      });
    }
    function totalXDC(){
      $http({
        method: 'GET',
        url: '/totalXDCSupply',
        data: {}
      }).success(function(data) {
        $scope.totalXDC = data;
      });
    }
    function totalNodes(){
      $http({
        method: 'POST',
        url: '/totalMasterNodes',
        data: {}
      }).success(function(data) {
        $scope.totalNodes = data;
      });
    }
    function FetchUSDPrrice(){
      $http({
        method: 'get',
        url: 'https://api.coinmarketcap.com/v1/ticker/xinfin-network/',
        data: {}
      }).success(function(data) {
        $scope.CMCPrice_USD = data[0].price_usd;
        $scope.CMCPrice_change24h = data[0].percent_change_24h;
      });
    }
    $('td').each(function() {
      var val = $(this).text(), n = +val;
      if (!isNaN(n) && /^\s*[+-]/.test(val)) {
        $(this).addClass(val >= 0 ? 'pos' : 'neg')
      }
    })
    $scope.reloadTransactions = function() {
      $scope.txLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_txs"}
      }).success(function(data) {
        $scope.latest_txs = data.txs;
        $scope.txLoading = false;
      });  
    }

    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.txLoading = false;
    $scope.blockLoading = false;
})
.directive('summaryStats', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/views/summary-stats.html',
    scope: true,
    link: function(scope, elem, attrs){
      scope.stats = {};

      var etcEthURL = "/stats";
      var etcPriceURL = "https://coinmarketcap-nexuist.rhcloud.com/api/etc";
      var ethPriceURL = "https://coinmarketcap-nexuist.rhcloud.com/api/eth"
      scope.stats.ethDiff = 1;
      scope.stats.ethHashrate = 1;
      scope.stats.usdEth = 1;


      
      $http.post(etcEthURL, {"action": "etceth"})
       .then(function(res){
          scope.stats.etcHashrate = res.data.etcHashrate;
          scope.stats.ethHashrate = res.data.ethHashrate;
          scope.stats.etcEthHash = res.data.etcEthHash;
          scope.stats.ethDiff = res.data.ethDiff;
          scope.stats.etcDiff = res.data.etcDiff;
          scope.stats.etcEthDiff = res.data.etcEthDiff;
        });
      $http.get(etcPriceURL)
       .then(function(res){
          scope.stats.usdEtc = res.data.price["usd"].toFixed(2);
          scope.stats.usdEtcEth = parseInt(100*scope.stats.usdEtc/scope.stats.usdEth);
        });
      $http.get(ethPriceURL)
       .then(function(res){
          scope.stats.usdEth = res.data.price["usd"].toFixed(2);
          scope.stats.usdEtcEth = parseInt(100*scope.stats.usdEtc/scope.stats.usdEth);
          scope.stats.ethChange = parseFloat(res.data.change);
        });

      }
  }
});

