describe("FlockEntity Model", function () {
    var FlockEntity, Utils, MathUtils, DrawUtils, Vector,
        defaultOptionsPrey, defaultOptionsPredator, defaultOptionsUpdate, prey, predators;

    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.mathUtils', 'aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.flockEntity');

        inject(function (_FlockEntity_, _Utils_, _MathUtils_, _DrawUtils_, _Vector_) {
            FlockEntity = _FlockEntity_;
            Utils = _Utils_;
            MathUtils = _MathUtils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;

            defaultOptionsPrey = {
                position: new Vector({x: 10, y: 10}),
                velocity: new Vector({x: 1, y: -1}),
                radius: 5,
                speed: 1.5,
                cohesionWeight: 0.4,
                separateWeight: 0.4,
                alignWeight: 0.2,
                avoidWeight: 1.0,
                type: FlockEntity.PREY
            };
            defaultOptionsPredator = {
                position: new Vector({x: 10, y: 10}),
                velocity: new Vector({x: 1, y: -1}),
                radius: 5,
                speed: 3.0,
                cohesionWeight: 0.2,
                separateWeight: 0.2,
                alignWeight: 0.1,
                type: FlockEntity.PREDATOR
            };
            defaultOptionsUpdate = {
                box: {
                    width: 200,
                    height: 200,
                    center: 100
                },
                prey: null, predators: null
            };

            prey = [];
            for (var x = 0; x < 5; x++) {
                var ent = new FlockEntity(defaultOptionsPrey);
                ent.position = ent.position.mulNew(x);
                prey.push(ent);
            }

            predators = [];
            for (var y = 0; y < 5; y++) {
                var ent = new FlockEntity(defaultOptionsPredator);
                ent.position = ent.position.mulNew(y);
                predators.push(ent);
            }
            defaultOptionsUpdate.prey = prey;
            defaultOptionsUpdate.predators = predators;
        });
    });

    it('should build a FlockEntity object', function() {
        var entObj = new FlockEntity(defaultOptionsPrey);

        expect(entObj.position).toEqual(defaultOptionsPrey.position);
        expect(entObj.velocity).toEqual(defaultOptionsPrey.velocity);
        expect(entObj.radius).toEqual(defaultOptionsPrey.radius);
        expect(entObj.speed).toEqual(defaultOptionsPrey.speed);

        expect(entObj.cohesionWeight).toEqual(defaultOptionsPrey.cohesionWeight);
        expect(entObj.separateWeight).toEqual(defaultOptionsPrey.separateWeight);
        expect(entObj.alignWeight).toEqual(defaultOptionsPrey.alignWeight);
        expect(entObj.avoidWeight).toEqual(defaultOptionsPrey.avoidWeight);

        expect(entObj.type).toEqual(defaultOptionsPrey.type);
    });

    it("should instantiate properly", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);

        expect(entObj.position).toEqual(defaultOptionsPrey.position);
        expect(entObj.velocity).toEqual(defaultOptionsPrey.velocity);
        expect(entObj.radius).toEqual(defaultOptionsPrey.radius);
        expect(entObj.speed).toEqual(defaultOptionsPrey.speed);

        expect(entObj.cohesionWeight).toEqual(defaultOptionsPrey.cohesionWeight);
        expect(entObj.separateWeight).toEqual(defaultOptionsPrey.separateWeight);
        expect(entObj.alignWeight).toEqual(defaultOptionsPrey.alignWeight);
        expect(entObj.avoidWeight).toEqual(defaultOptionsPrey.avoidWeight);

        expect(entObj.type).toEqual(defaultOptionsPrey.type);
    });

    it("should update stats properly", function () {
        var entObj = new FlockEntity(defaultOptionsPrey),
            updatedStats = {
                position: new Vector({x: 0, y: 0}),
                velocity: new Vector({x: -1, y: 1}),
                radius: 15,
                speed: .5,
                cohesionWeight: 1.0,
                separateWeight: 1.0,
                alignWeight: 1.0,
                avoidWeight: 0.0,
                type: FlockEntity.PREDATOR
            };

        entObj.updateStats(updatedStats);

        expect(entObj.position).toEqual(updatedStats.position);
        expect(entObj.velocity).toEqual(updatedStats.velocity);
        expect(entObj.radius).toEqual(updatedStats.radius);
        expect(entObj.speed).toEqual(updatedStats.speed);

        expect(entObj.cohesionWeight).toEqual(updatedStats.cohesionWeight);
        expect(entObj.separateWeight).toEqual(updatedStats.separateWeight);
        expect(entObj.alignWeight).toEqual(updatedStats.alignWeight);
        expect(entObj.avoidWeight).toEqual(updatedStats.avoidWeight);

        expect(entObj.type).toEqual(updatedStats.type);
    });

    it("should calculate the separation force for a given target", function () {
        var entObj = new FlockEntity(defaultOptionsPrey), res;

        res = entObj._calculateSeparationForceForTarget(prey[0], prey);

        expect(res.x).toEqual(0.7071067811865475);
        expect(res.y).toEqual(0.7071067811865475);
    });

    it("should calculate cohesion", function () {
        var entObj = new FlockEntity(defaultOptionsPrey), res;

        res = entObj.calculateCohesion(prey);

        expect(res.x).toEqual(0.7071067811865475);
        expect(res.y).toEqual(0.7071067811865475);

        res = entObj.calculateCohesion([]);

        expect(res.x).toEqual(0);
        expect(res.y).toEqual(0);
    });

    it("should calculate separation", function () {
        var entObj = new FlockEntity(defaultOptionsPrey),
            res;

        spyOn(entObj, '_calculateSeparationForceForTarget').and.callFake(function(target) {
            expect(target.position).toBeDefined();
            return new Vector({
                x: target.position.x
            });
        });

        res = entObj.calculateSeparation(prey);

        expect(res.x).toEqual(1);
        expect(res.y).toEqual(0);

        expect(entObj._calculateSeparationForceForTarget.calls.count()).toBe(5);

        res = entObj.calculateSeparation([]);

        expect(res.x).toEqual(0);
        expect(res.y).toEqual(0);
    });

    it("should calculate alignment", function () {
        var entObj = new FlockEntity(defaultOptionsPrey), res;

        //spyOn(entObj, '_calculateAlignmentForceForTarget').and.callFake(function(target) {
        //    expect(target.position).toBeDefined();
        //    return new Vector({
        //        x: target.position.x
        //    });
        //});

        res = entObj.calculateAlignment(prey);

        expect(res.x).toEqual(0.7071067811865475);
        expect(res.y).toEqual(-0.7071067811865475);

        //expect(entObj._calculateAlignmentForceForTarget.calls.count()).toBe(5);

        res = entObj.calculateAlignment([]);

        expect(res.x).toEqual(0);
        expect(res.y).toEqual(0);
    });

    it("should update as a PREDATOR", function () {
        var entObj = new FlockEntity(defaultOptionsPredator);
        entObj.velocity = new Vector({x: 1});
        spyOn(entObj, 'calculateCohesion').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'calculateSeparation').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'calculateAlignment').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'avoidWalls').and.callFake(function () {
            return new Vector({x: 1});
        });

        var result = entObj.updateAsPredator(defaultOptionsUpdate);

        expect(entObj.calculateCohesion).toHaveBeenCalled();
        expect(entObj.calculateSeparation).toHaveBeenCalled();
        expect(entObj.calculateAlignment).toHaveBeenCalled();
        expect(entObj.avoidWalls).toHaveBeenCalled();

        expect(entObj.renderExclamation).toBe(false);
        expect(result.x).toBe(1.6);
        expect(result.y).toBe(0);
    });

    it("should update as a PREY with predators present", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);
        entObj.velocity = new Vector({x: 1});

        spyOn(entObj, 'calculateSeparation').and.callFake(function (entities) {
            return new Vector({x: 1});
        });
        spyOn(MathUtils, 'getNearestObjects').and.callFake(function (ents, obj, range) {
            expect(ents).toBeDefined();
            expect(obj).toBe(entObj);
            expect(range).toBe(80.0);
            return [{}];
        });

        var result = entObj.updateAsPrey(defaultOptionsUpdate);

        expect(MathUtils.getNearestObjects).toHaveBeenCalled();
        expect(entObj.calculateSeparation).toHaveBeenCalled();
        expect(entObj.renderExclamation).toBe(true);
        expect(result.x).toBe(2);
        expect(result.y).toBe(0);
    });

    it("should update as a PREY with NO predators present", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);
        entObj.velocity = new Vector({x: 1});

        spyOn(MathUtils, 'getNearestObjects').and.callFake(function (ents, obj, range) {
            expect(ents).toBeDefined();
            expect(obj).toBe(entObj);
            expect(range).toBe(80.0);
            return [];
        });
        spyOn(entObj, 'calculateCohesion').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'calculateSeparation').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'calculateAlignment').and.callFake(function () {
            return new Vector({x: 1});
        });
        spyOn(entObj, 'avoidWalls').and.callFake(function () {
            return new Vector({x: 1});
        });

        defaultOptionsUpdate.predators = [];

        var result = entObj.updateAsPrey(defaultOptionsUpdate);

        expect(MathUtils.getNearestObjects).toHaveBeenCalled();
        expect(entObj.calculateCohesion).toHaveBeenCalled();
        expect(entObj.calculateSeparation).toHaveBeenCalled();
        expect(entObj.calculateAlignment).toHaveBeenCalled();
        expect(entObj.avoidWalls).toHaveBeenCalled();
        expect(entObj.renderExclamation).toBe(false);
        expect(result.x).toBe(2.1);
        expect(result.y).toBe(0);
    });

    it("should avoid walls", function () {
        var entObj = new FlockEntity(defaultOptionsPrey), res;
        entObj.position = new Vector({x: 49, y: 49});

        res = entObj.avoidWalls(defaultOptionsUpdate.box);

        expect(res.x).toEqual(1);
        expect(res.y).toEqual(1);


        entObj.position = new Vector({
            x: defaultOptionsUpdate.box.width - 49,
            y: defaultOptionsUpdate.box.height - 49
        });

        res = entObj.avoidWalls(defaultOptionsUpdate.box);

        expect(res.x).toEqual(-1);
        expect(res.y).toEqual(-1);
    });

    it("should update it's velocity based upon it's type", function () {
        var entObj = new FlockEntity(defaultOptionsPrey), res,
            newVel;
        entObj.velocity = new Vector({x: 1, y: 0});
        newVel = entObj.velocity.normalize(1).mulNew(entObj.speed);

        spyOn(entObj, 'updateAsPrey').and.callFake(function (options) {
            return entObj.velocity;
        });

        res = entObj.updateVelocity(defaultOptionsUpdate);

        expect(entObj.updateAsPrey.calls.count()).toBe(1);
        expect(res.x).toBe(newVel.x);
        expect(res.y).toBe(newVel.y);


        entObj = new FlockEntity(defaultOptionsPredator);
        entObj.velocity = new Vector({x: 1, y: 0});
        newVel = entObj.velocity.normalize(1).mulNew(entObj.speed);
        spyOn(entObj, 'updateAsPredator').and.callFake(function (options) {
            return entObj.velocity;
        });

        res = entObj.updateVelocity(defaultOptionsUpdate);

        expect(entObj.updateAsPredator.calls.count()).toBe(1);
        expect(res.x).toBe(newVel.x);
        expect(res.y).toBe(newVel.y);
    });

    it("should bounce off of walls", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);

        entObj.position = new Vector({x: -1, y: -1});
        entObj.velocity = new Vector({x: -1, y: -1});

        entObj._bounceOffWalls(defaultOptionsUpdate.box);

        expect(entObj.velocity.x).toEqual(1);
        expect(entObj.velocity.y).toEqual(1);


        entObj.position = new Vector({
            x: defaultOptionsUpdate.box.width + 1,
            y: defaultOptionsUpdate.box.height + 1
        });
        entObj.velocity = new Vector({x: 1, y: 1});

        entObj._bounceOffWalls(defaultOptionsUpdate.box);

        expect(entObj.velocity.x).toEqual(-1);
        expect(entObj.velocity.y).toEqual(-1);
    });

    it("should keep itself in bounds", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);
        entObj.position = new Vector({x: -1, y: -1});
        entObj._keepInBounds(defaultOptionsUpdate.box);

        expect(entObj.position.x).toEqual(5);
        expect(entObj.position.y).toEqual(5);

        entObj.position = new Vector({
            x: defaultOptionsUpdate.box.width + 1,
            y: defaultOptionsUpdate.box.height + 1
        });
        entObj._keepInBounds(defaultOptionsUpdate.box);

        expect(entObj.position.x).toEqual(195);
        expect(entObj.position.y).toEqual(195);
    });

    it("should calculate it's nose", function () {
        var entObj = new FlockEntity(defaultOptionsPrey),
            nose = new Vector({x: entObj.position.x + 10, y: entObj.position.y});
        entObj.velocity = new Vector({x: 1, y: 0});

        entObj.calcNose();

        expect(entObj.nose.x).toEqual(nose.x);
        expect(entObj.nose.y).toEqual(nose.y);
    });

    it("should update accordingly", function () {
        var entObj = new FlockEntity(defaultOptionsPrey);

        spyOn(entObj, 'updateVelocity').and.callFake(function (options) {
            return new Vector({x: 0, y: 0});
        });
        spyOn(entObj, '_bounceOffWalls').and.callFake(function (box) {
        });
        spyOn(entObj, '_keepInBounds').and.callFake(function (box) {
        });

        entObj.update(defaultOptionsUpdate);
        expect(entObj.updateVelocity.calls.count()).toEqual(1);

        expect(entObj._bounceOffWalls.calls.count()).toEqual(1);
        expect(entObj._keepInBounds.calls.count()).toEqual(1);
    });

    it("should render", function () {
        var entObj = new FlockEntity(defaultOptionsPrey),
            nose = new Vector({x: 20, y: 20}),
            context = document.createElement("canvas").getContext('2d');
        spyOn(entObj, 'calcNose').and.callFake(function () {
            entObj.nose = nose;
        });
        spyOn(DrawUtils, 'drawCircle').and.callFake(function (ctx, x, y, radius, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(entObj.position.x);
            expect(y).toBe(entObj.position.y);
            expect(radius).toBe(entObj.radius);
            expect(color).toBe(entObj.color);
        });
        spyOn(DrawUtils, 'drawLine').and.callFake(function (ctx, sx, sy, ex, ey, color) {
            expect(ctx).toBe(context);
            expect(sx).toBe(entObj.position.x);
            expect(sy).toBe(entObj.position.y);
            expect(ex).toBe(nose.x);
            expect(ey).toBe(nose.y);
            expect(color).toBe(entObj.color);
        });
        spyOn(DrawUtils, 'drawExclamation').and.callFake(function (ctx, x, y, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(entObj.position.x);
            expect(y).toBe(entObj.position.y - 10);
            expect(color).toBe(FlockEntity.EXCLAMATION_COLOR);
        });
        entObj.render(context);

        entObj.renderExclamation = true;
        entObj.render(context);
    });
});