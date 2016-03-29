(function (ng) {
    'use strict';

    ng.module('aidemo.astar', [
        'ui.router',
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.aStar',
        'aidemo.service.gridService',
        'aidemo.models.vector',
        'aidemo.models.node'
        //'aidemo.models.lifeCell'
    ])
        .controller('AStarController', ['$timeout', 'AStar', 'GridService', 'MathUtils', 'Vector', 'Node',
            function ($timeout, AStar, GridService, MathUtils, Vector, Node) {
                var vm = this;
                vm.BACK_COLOR = "#555555";
                vm.GRID_COLOR = "#8EAEC9";
                vm.gridObj = {
                    grid: [],
                    tileSize: 20.0
                };
                vm.start = null;
                vm.end = null;

                vm.findNodeInGridAndPathSelect = function (node) {
                    if (vm.gridObj.grid) {
                        var row = parseInt(node.id / vm.gridObj.grid[0].length, 10),
                            column = parseInt(node.id - (row * vm.gridObj.grid[0].length), 10);

                        vm.gridObj.grid[row][column] = node;
                        vm.gridObj.grid[row][column].pathSelect();
                    }
                };

                vm.markPath = function (path) {
                    if (!path) {
                        return;
                    }
                    while (!path.isEmpty()) {
                        var node = path.dequeue();
                        vm.findNodeInGridAndPathSelect(node);
                    }
                };

                vm.createPath = function () {
                    if (vm.start && vm.end) {
                        vm.markPath(
                            AStar.aStarAlgorithm(
                                vm.start,
                                vm.end,
                                vm.gridObj.grid,
                                vm.gridObj.tileSize
                            )
                        );
                    }
                };

                vm.selectStartNode = function (position) {
                    vm.gridObj.grid.forEach(function (row) {
                        row.forEach(function (node) {
                            if (node) {
                                node.reset();
                                if (node.specialSelect(position)) {
                                    vm.start = node;
                                }
                            }
                        });
                    });
                };

                vm.selectEndNode = function (position) {
                    vm.gridObj.grid.forEach(function (row) {
                        row.forEach(function (node) {
                            if (node && node.eligibleForSelect(position)) {
                                vm.end = node;
                            }
                        });
                    });
                    vm.createPath();
                };

                vm.reset = function () {
                    vm.start = null;
                    vm.end = null;

                    for (var row = 0; row < vm.gridObj.grid.length; row++) {
                        for (var column = 0; column < vm.gridObj.grid[row].length; column++) {
                            if (vm.gridObj.grid[row][column]) {
                                vm.gridObj.grid[row][column].reset();
                            }
                        }
                    }
                };

                vm.handleTouchPosition = function (position) {
                    if (vm.start === null) {
                        vm.selectStartNode(position);
                    }
                    else if (vm.end === null) {
                        vm.selectEndNode(position);
                    }
                    else {
                        vm.reset();
                    }
                };

                vm.generateNode = function (numberOfColumns, numberOfRows, column, row, offset, curId) {
                    var spawn = MathUtils.getRandomNumber(0, 1) <= 0.7;
                    return spawn ? new Node({
                        box: {
                            x: column * vm.gridObj.tileSize,
                            y: row * vm.gridObj.tileSize,
                            width: vm.gridObj.tileSize,
                            height: vm.gridObj.tileSize
                        },
                        id: curId.toString(),
                        position: new Vector({
                            x: column * vm.gridObj.tileSize + offset,
                            y: row * vm.gridObj.tileSize + offset
                        })
                    }) : null;
                };

                vm.generateGridRow = function (numberOfColumns, numberOfRows, row, offset, curId) {
                    var rowArray = [];
                    for (var column = 0; column < numberOfColumns; column++) {
                        rowArray.push(vm.generateNode(
                            numberOfColumns, numberOfRows,
                            column, row, offset, curId
                        ));
                        curId++;
                    }
                    return rowArray;
                };

                vm.generateGrid = function () {
                    var curId = 0,
                        offset = vm.gridObj.tileSize,
                        xDifference = vm.box.width - vm.gridObj.tileSize,
                        yDifference = vm.box.height - vm.gridObj.tileSize,
                        numberOfColumns = xDifference / vm.gridObj.tileSize,
                        numberOfRows = yDifference / vm.gridObj.tileSize;

                    vm.gridObj.grid = [];

                    for (var row = 0; row < numberOfRows; row++) {
                        vm.gridObj.grid.push(
                            vm.generateGridRow(numberOfColumns, numberOfRows, row, offset, curId)
                        );
                        curId += numberOfColumns;
                    }
                    GridService.fillGridNeighbors(vm.gridObj.grid, true);
                };

                vm.touch = function (event) {
                    if (vm.gridObj.grid.length === 0 || (event.type !== 'mouseup' && event.type !== 'touchend')) {
                        return;
                    }
                    var position = new Vector({
                        x: event.offsetX - 1,
                        y: event.offsetY - 1
                    });

                    vm.handleTouchPosition(position);
                };

                $timeout(vm.generateGrid, 100);
            }])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.astar', {
                    url: 'astar',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'astarDemo.html',
                            controller: 'AStarController',
                            controllerAs: 'AStarCtrl'
                        }
                    }
                });
        }]);
}(angular));