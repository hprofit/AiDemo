describe("CanvasScreen Directive", function () {
    'use strict';
    var template, rootScope, scope, compile, $window, $interval, $timeout, DrawUtils, Vector;

    var commonTemplate = '<canvas-screen has-grid="n" bg-color="#FFFFFF" box="{}"></canvas-screen>';

    beforeEach(function () {
        module('aidemo.templates');
        module('aidemo.ui.canvas', function ($provide) {
            $provide.value('$window', {});

            $provide.decorator('DrawUtils', function ($delegate) {
                $delegate.path = jasmine.createSpy();
                return $delegate;
            });

            $provide.decorator('Vector', function ($delegate) {
                $delegate.path = jasmine.createSpy();
                return $delegate;
            });
        });

        inject(function (_$templateCache_, _$rootScope_, _$compile_, _$window_, _$interval_, _$timeout_, _DrawUtils_, _Vector_) {
            rootScope = _$rootScope_;
            scope = rootScope.$new();
            compile = _$compile_;
            $window = _$window_;
            $interval = _$interval_;
            $timeout = _$timeout_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;

            scope.update = jasmine.createSpy('update');
        });
    });

    function createDirective(temp) {
        return compile(angular.element(temp))(scope);
    }

    it('should have several isolated scope properties', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        expect(iScope.hasGrid).toEqual(false);
        expect(iScope.bgColor).toEqual('#FFFFFF');
        expect(iScope.box).toBeDefined();
    });

    it('should have support several optional isolated scope properties', function () {
        var element = createDirective('<canvas-screen has-grid="y" bg-color="#FFFFFF" box="{}" grid-spacing="15"' +
                'height="100" width="150" min-height="50" min-width="100" objects="[]" grid-color="#000000" on-update="update()">' +
                '</canvas-screen>'),
            iScope = element.isolateScope();

        expect(iScope.gridColor).toBe('#000000');
        expect(iScope.gridSpacing).toBe(15);
        expect(iScope.height).toBe(100);
        expect(iScope.width).toBe(150);
        expect(iScope.minHeight).toBe(50);
        expect(iScope.minWidth).toBe(100);
        expect(iScope.objects).toBeDefined();
        expect(iScope.onUpdate).toBeDefined();
    });

    it('should set window.requestAnimFrame', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        expect($window.requestAnimationFrame).toBeDefined();
    });

    it('should handle resize events', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        spyOn(iScope, 'resizeCanvasAndSetBox').and.callFake(function () {
        });
        spyOn(iScope, '$apply').and.callFake(function () {
        });

        iScope.resizeHandler();

        expect(iScope.resizeCanvasAndSetBox).toHaveBeenCalled();
        expect(iScope.$apply).toHaveBeenCalled();
    });

    it('should call an objects render method if it has one', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        var object = {
            render: function (context) {
            }
        };

        spyOn(_, 'isFunction').and.callFake(function (fn) {
            expect(fn).toBe(object.render);
            return true;
        });
        spyOn(object, 'render').and.callThrough();

        iScope.renderObject(object);

        expect(object.render).toHaveBeenCalled();
    });

    it('should call renderArrayOrObjectsArrays for each property of a given object', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        var object = {
            array: [],
            property: {}
        };

        spyOn(iScope, 'renderArrayOrObjectsArrays').and.callFake(function (object) {
        });

        iScope.renderArraysInObject(object);

        expect(iScope.renderArrayOrObjectsArrays.calls.count()).toBe(2);
    });

    it('should render a grid', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        spyOn(DrawUtils, 'drawGrid').and.callFake(function (context, box, spacing, color) {
            expect(context).toBe(iScope.canvasContext);
            expect(box).toBe(iScope.box);
            expect(spacing).toBe(iScope.gridSpacing);
            expect(color).toBe(iScope.gridColor);
        });

        iScope.hasGrid = true;

        iScope.renderGrid();

        expect(DrawUtils.drawGrid).toHaveBeenCalled();
    });

    it('should render an array of objects', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope(),
            objects = [
                {
                    render: function (context) {
                    }
                }
                //,
                //{
                //    render: function (context) {
                //    }
                //},
                //{
                //    render: ''
                //},
                //{}
            ];

        spyOn(iScope, 'renderArraysInObject').and.callFake(function (object) {
            expect(object).toBeDefined();
        });
        spyOn(iScope, 'renderObject').and.callFake(function (object) {
        });

        iScope.renderArrayOrObjectsArrays({});

        expect(iScope.renderArraysInObject).toHaveBeenCalled();

        iScope.renderArrayOrObjectsArrays(objects);

        expect(iScope.renderObject).toHaveBeenCalled();
    });

    it('should render the canvas and objects', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        spyOn(DrawUtils, 'fillCanvas').and.callFake(function (canvas, color) {
            expect(canvas).toBe(iScope.canvas);
            expect(color).toBe(iScope.bgColor);
        });
        spyOn(iScope, 'renderGrid').and.callFake(function () {
        });
        spyOn(iScope, 'renderArrayOrObjectsArrays').and.callFake(function (objects) {
            expect(objects).toBe(iScope.objects);
        });

        iScope.render();

        expect(DrawUtils.fillCanvas).toHaveBeenCalled();
        expect(iScope.renderGrid).toHaveBeenCalled();
        expect(iScope.renderArrayOrObjectsArrays).toHaveBeenCalled();
    });

    it('should animate the canvas', function () {
        var element = createDirective('<canvas-screen has-grid="y" bg-color="#FFFFFF" box="{}" on-update="update()"></canvas-screen>'),
            iScope = element.isolateScope();

        spyOn(iScope, 'onUpdate').and.callFake(function () {
        });
        spyOn(iScope, 'render').and.callFake(function () {
        });
        spyOn($window, 'requestAnimationFrame').and.callFake(function (fn) {
            expect(fn).toBe(iScope.animate);
        });

        iScope.animate();

        expect(iScope.onUpdate).toHaveBeenCalled();
        expect(iScope.render).toHaveBeenCalled();
        expect($window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should set height and width from the given minimum values', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        iScope.height = 100;
        iScope.minHeight = 150;

        iScope.width = 200;
        iScope.minWidth = 250;

        iScope.setHeightAndWidthFromMinimumValues();

        expect(iScope.height).toBe(150);
        expect(iScope.width).toBe(250);
    });

    it('should set the box', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        iScope.setBoxObject(200, 100);

        expect(iScope.box.width).toBe(100);
        expect(iScope.box.height).toBe(200);
        expect(iScope.box.center.x).toBe(50);
        expect(iScope.box.center.y).toBe(100);
    });

    it('should set the canvas height', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope(),
            parent = {offsetHeight: 400};

        iScope.setCanvasHeight(parent);

        expect(element.css('height')).toBe('400px');
        expect(iScope.canvas.height).toBe(400);

        iScope.height = 500;

        iScope.setCanvasHeight(parent);

        expect(element.css('height')).toBe('500px');
        expect(iScope.canvas.height).toBe(500);
    });

    it('should set the canvas width', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope(),
            parent = {offsetWidth: 400};

        iScope.setCanvasWidth(parent);

        expect(element.css('width')).toBe('400px');
        expect(iScope.canvas.width).toBe(400);

        iScope.width = 500;

        iScope.setCanvasWidth(parent);

        expect(element.css('width')).toBe('500px');
        expect(iScope.canvas.width).toBe(500);
    });

    it('should resize the canvas and call setBoxObject', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope();

        spyOn(iScope, 'setBoxObject').and.callFake(function (height, width) {
        });
        spyOn(iScope, 'setCanvasHeight').and.callFake(function (parent) {
        });
        spyOn(iScope, 'setCanvasWidth').and.callFake(function (parent) {
        });

        iScope.resizeCanvasAndSetBox();

        expect(iScope.setCanvasHeight).toHaveBeenCalled();
        expect(iScope.setCanvasWidth).toHaveBeenCalled();
        expect(iScope.setBoxObject).toHaveBeenCalled();
    });

    it('should set up the resize handler event', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope(),
            handler = function () {
            };

        spyOn(_, 'debounce').and.callFake(function (fn, delay) {
            expect(fn).toBe(iScope.resizeHandler);
            expect(delay).toBe(100);
            return handler;
        });
        spyOn(iScope, '$on').and.callFake(function (watch, fn) {
            expect(watch).toBe('$viewContentLoaded');
            expect(fn).toBe(handler);
        });

        iScope.setupResizeHandler();

        expect(_.debounce).toHaveBeenCalled();
        expect(iScope.$on).toHaveBeenCalled();
    });

    it('should request an animation frame', function () {
        var element = createDirective(commonTemplate),
            iScope = element.isolateScope(),
            callback = function () {
            };

        callback = jasmine.createSpy('callback');

        iScope.requestAnimFrameFunction(callback);
    });

    //it('should dosomething', function () {
    //    var element = createDirective(commonTemplate),
    //        iScope = element.isolateScope();
    //});
});