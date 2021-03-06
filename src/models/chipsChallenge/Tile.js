(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.tile', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils',
        'aidemo.models.chip.globals',
        'aidemo.models.vector'
    ])
        .factory('Tile', ['Utils', 'DrawUtils', 'Globals', 'Vector',
            function (Utils, DrawUtils, Globals, Vector) {

                /**
                 * Class that represents the tiles in the world the player can interact with and move on
                 * @param params - Object with options, MUST HAVE A 'type' PROPERTY
                 * @constructor
                 */
                function Tile(params) {
                    params = params || {};

                    if (!params.type) {
                        throw new Error("ERROR INSTANTIATING TILE: MUST HAVE A TYPE");
                    }

                    this.type = params.type;
                    this.worldPos = params.worldPos ? params.worldPos : new Vector();
                    this.screenPos = params.screenPos ? params.screenPos : new Vector();
                    this.image = Utils.generateImageFromURLObject(Tile.TILE_IMAGES, this.type);
                    this.item = params.item ? params.item : null;
                    this.obstacle = params.obstacle ? params.obstacle : null;
                    this.neighbors = params.neighbors ? params.neighbors : [];
                }

                var tileRoot = "images/chipsChallenge/tiles/";
                Tile.TILE_IMAGES = {
                    EMPTY: tileRoot + "emptyLarge.png",
                    BLOCK: tileRoot + "blockLarge.png",
                    WATER_BLOCK: tileRoot + "waterBlockLarge.png",
                    WATER: tileRoot + "waterLarge.png",
                    FIRE: tileRoot + "fireLarge.png",
                    ROLLER: tileRoot + "ROLLER",
                    ICE: tileRoot + "iceLarge.png",
                    ICE_LD: tileRoot + "iceLDLarge.png",
                    ICE_RD: tileRoot + "iceRDLarge.png",
                    ICE_LU: tileRoot + "iceLULarge.png",
                    ICE_RU: tileRoot + "iceRULarge.png",
                    EXIT: tileRoot + "exitLarge.png"
                };

                Tile.EMPTY = "EMPTY";
                Tile.BLOCK = "BLOCK";
                Tile.WATER_BLOCK = "WATER_BLOCK";
                Tile.WATER = "WATER";
                Tile.FIRE = "FIRE";
                Tile.ROLLER = "ROLLER";
                Tile.ICE = "ICE";
                Tile.ICE_LD = "ICE_LD";
                Tile.ICE_RD = "ICE_RD";
                Tile.ICE_LU = "ICE_LU";
                Tile.ICE_RU = "ICE_RU";
                Tile.EXIT = "EXIT";

                Tile.prototype.getNeighborTileInDirection = function (direction) {
                    if (direction.length() !== Globals.TILE_SIZE) {
                        throw new Error("ERROR GETTING NEIGHBOR FOR TILE: DIRECTION X OR Y MUST MATCH GLOBALS.TILE_SIZE");
                    }
                    var neighborPosition = this.worldPos.addNew(direction);
                    for (var idx = 0; idx < this.neighbors.length; idx++) {
                        if (neighborPosition.compare(this.neighbors[idx].worldPos)) {
                            return this.neighbors[idx];
                        }
                    }
                };

                Tile.prototype.getNeighbors = function () {
                    return this.neighbors;
                };

                Tile.prototype.fillNeighbors = function (neighbors) {
                    this.neighbors = neighbors ? neighbors : [];
                };

                Tile.prototype.move = function (dir) {
                    this.screenPos.add(dir);
                };

                Tile.prototype.removeItem = function () {
                    this.item = null;
                };

                Tile.prototype.getItem = function () {
                    return this.item;
                };

                Tile.prototype.removeObstacle = function () {
                    this.obstacle = null;
                };

                Tile.prototype.getObstacle = function () {
                    return this.obstacle;
                };

                Tile.prototype.setObstacle = function (obstacle) {
                    this.obstacle = obstacle;
                };

                Tile.prototype.getType = function () {
                    return this.type;
                };

                Tile.prototype.setType = function (type) {
                    this.type = type;
                    this.image = Utils.generateImageFromURLObject(Tile.TILE_IMAGES, this.type);
                };

                Tile.prototype._iceGetDir = function (type) {
                    return type.split(Tile.ICE, '_');
                };

                Tile.prototype.iceGetDir = function (curDir) {
                    if (this.type === Tile.ICE) {
                        return curDir;
                    }

                };

                Tile.prototype.update = function () {
                };

                /**
                 * If the tile has an item, calls item.render
                 * @param context - Canvas element's context property
                 * @private
                 */
                Tile.prototype._renderItem = function (context) {
                    if (this.item) {
                        this.item.render(context, this.screenPos.x, this.screenPos.y);
                    }
                };

                /**
                 * If the tile has an obstacle, calls obstacle.render
                 * @param context - Canvas element's context property
                 * @private
                 */
                Tile.prototype._renderObstacle = function (context) {
                    if (this.obstacle) {
                        this.obstacle.render(context, this.screenPos.x, this.screenPos.y);
                    }
                };

                /**
                 * Given a canvas context, renders this tile then calls _renderItem and _renderObstacle
                 * @param context - Canvas element's context property
                 */
                Tile.prototype.render = function (context) {
                    DrawUtils.drawImage(context, this.screenPos.x, this.screenPos.y, this.image);
                    this._renderItem(context);
                    this._renderObstacle(context);
                };

                return Tile;
            }]);
})(angular);