/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var MATH_CONST = require('../../math/const');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Matrix used for display transformations for rendering.
 *
 * It is represented like so:
 *
 * ```
 * | a | c | tx |
 * | b | d | ty |
 * | 0 | 0 | 1  |
 * ```
 *
 * @class TransformMatrix
 * @memberof Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [a=1] - The Scale X value.
 * @param {number} [b=0] - The Skew Y value.
 * @param {number} [c=0] - The Skew X value.
 * @param {number} [d=1] - The Scale Y value.
 * @param {number} [tx=0] - The Translate X value.
 * @param {number} [ty=0] - The Translate Y value.
 */
var TransformMatrix = new Class({

    initialize:

        function TransformMatrix(a, b, c, d, tx, ty) {
            if (a === undefined) { a = 1; }
            if (b === undefined) { b = 0; }
            if (c === undefined) { c = 0; }
            if (d === undefined) { d = 1; }
            if (tx === undefined) { tx = 0; }
            if (ty === undefined) { ty = 0; }

            /**
             * The matrix values.
             *
             * @name Phaser.GameObjects.Components.TransformMatrix#matrix
             * @type {Float32Array}
             * @since 3.0.0
             */
            this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);

            /**
             * The decomposed matrix.
             *
             * @name Phaser.GameObjects.Components.TransformMatrix#decomposedMatrix
             * @type {object}
             * @since 3.0.0
             */
            this.decomposedMatrix = {
                translateX: 0,
                translateY: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0
            };
        },

    /**
     * The Scale X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#a
     * @type {number}
     * @since 3.4.0
     */
    a: {

        get: function () {
            return this.matrix[0];
        },

        set: function (value) {
            this.matrix[0] = value;
        }

    },

    /**
     * The Skew Y value.
     * The raw Skew Y value inclusive of rotation.
     * @name Phaser.GameObjects.Components.TransformMatrix#b
     * @type {number}
     * @since 3.4.0
     */
    b: {

        get: function () {
            return this.matrix[1];
        },

        set: function (value) {
            this.matrix[1] = value;
        }

    },

    /**
     * The Skew X value.
     * The raw Skew X value inclusive of rotation.
     * @name Phaser.GameObjects.Components.TransformMatrix#c
     * @type {number}
     * @since 3.4.0
     */
    c: {

        get: function () {
            return this.matrix[2];
        },

        set: function (value) {
            this.matrix[2] = value;
        }

    },

    /**
     * The Scale Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#d
     * @type {number}
     * @since 3.4.0
     */
    d: {

        get: function () {
            return this.matrix[3];
        },

        set: function (value) {
            this.matrix[3] = value;
        }

    },

    /**
     * The Translate X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#e
     * @type {number}
     * @since 3.11.0
     */
    e: {

        get: function () {
            return this.matrix[4];
        },

        set: function (value) {
            this.matrix[4] = value;
        }

    },

    /**
     * The Translate Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#f
     * @type {number}
     * @since 3.11.0
     */
    f: {

        get: function () {
            return this.matrix[5];
        },

        set: function (value) {
            this.matrix[5] = value;
        }

    },

    /**
     * The Translate X value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#tx
     * @type {number}
     * @since 3.4.0
     */
    tx: {

        get: function () {
            return this.matrix[4];
        },

        set: function (value) {
            this.matrix[4] = value;
        }

    },

    /**
     * The Translate Y value.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#ty
     * @type {number}
     * @since 3.4.0
     */
    ty: {

        get: function () {
            return this.matrix[5];
        },

        set: function (value) {
            this.matrix[5] = value;
        }

    },

    /**
     * The rotation of the Matrix. Value is in radians.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#rotation
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    rotation: {

        get: function () {
            return Math.acos(this.a / this.scaleX) * ((Math.atan(-this.c / this.a) < 0) ? -1 : 1);
        }

    },

    /**
     * The rotation of the Matrix, normalized to be within the Phaser right-handed
     * clockwise rotation space. Value is in radians.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#rotationNormalized
     * @type {number}
     * @readonly
     * @since 3.19.0
     */
    rotationNormalized: {

        get: function () {
            var matrix = this.matrix;

            var a = matrix[0];
            var b = matrix[1];
            var c = matrix[2];
            var d = matrix[3];

            if (a || b) {
                // var r = Math.sqrt(a * a + b * b);

                return (b > 0) ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
            }
            else if (c || d) {
                // var s = Math.sqrt(c * c + d * d);

                return MATH_CONST.TAU - ((d > 0) ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY));
            }
            else {
                return 0;
            }
        }

    },

    /**
     * The decomposed horizontal scale of the Matrix. This value is always positive.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleX
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    scaleX: {

        get: function () {
            return Math.sqrt((this.a * this.a) + (this.b * this.b));
        }

    },

    /**
     * The decomposed vertical scale of the Matrix. This value is always positive.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#scaleY
     * @type {number}
     * @readonly
     * @since 3.4.0
     */
    scaleY: {

        get: function () {
            return Math.sqrt((this.c * this.c) + (this.d * this.d));
        }

    },

    /**
    * The horizontal shear of the Matrix exclusive of rotation.
    *
    * @name Phaser.GameObjects.Components.TransformMatrix#skewX
    * @type {number}
    * @readonly
    * @since 3.53.0
    */
    skewX: {
        get: function () {
            return -Math.atan2(-this.c, this.d);
        }

    },

    /**
     * The vertical shear of the Matrix exclusive of rotation.
     *
     * @name Phaser.GameObjects.Components.TransformMatrix#skewY
     * @type {number}
     * @readonly
     * @since 3.53.0
     */
    skewY: {
        get: function () {
            return Math.atan2(this.b, this.a);
        }

    },

    /**
     * Reset the Matrix to an identity matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#loadIdentity
     * @since 3.0.0
     *
     * @return {this} This TransformMatrix.
     */
    loadIdentity: function () {
        var matrix = this.matrix;

        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 1;
        matrix[4] = 0;
        matrix[5] = 0;

        return this;
    },

    /**
     * Translate the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#translate
     * @since 3.0.0
     *
     * @param {number} x - The horizontal translation value.
     * @param {number} y - The vertical translation value.
     *
     * @return {this} This TransformMatrix.
     */
    translate: function (x, y) {
        var matrix = this.matrix;

        matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
        matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];

        return this;
    },

    /**
     * Scale the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#scale
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scale value.
     * @param {number} y - The vertical scale value.
     *
     * @return {this} This TransformMatrix.
     */
    scale: function (x, y) {
        var matrix = this.matrix;

        matrix[0] *= x;
        matrix[1] *= x;
        matrix[2] *= y;
        matrix[3] *= y;

        return this;
    },

    /**
     * Set the matrix x & y shear.
     *
     * Note: Mathematically, rotation, x skew, and y skew are related. As a result, setting 2 or more of those properties results in a mathematically equivalent decomposition which may not match the properties you set; this implementation favors including a rotation component.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#skew
     * @since 3.52.0
     *
     * @param {number} x - The horizontal shear value.
     * @param {number} y - The verical shear value.
     *
     * @return {this} This TransformMatrix.
    */
    skew: function (sx, sy) {
        this.applyITRS(this.tx, this.ty, this.rotation, this.scaleX, this.scaleY, sx, sy);
        return this;
    },

    /**
     * Rotate the Matrix.
     * See `skew` for discussion on interactions.
     * @method Phaser.GameObjects.Components.TransformMatrix#rotate
     * @since 3.0.0
     *
     * @param {number} angle - The angle of rotation in radians.
     *
     * @return {this} This TransformMatrix.
     */
    rotate: function (angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];

        matrix[0] = a * cos + c * sin;
        matrix[1] = b * cos + d * sin;
        matrix[2] = a * -sin + c * cos;
        matrix[3] = b * -sin + d * cos;

        return this;
    },

    /**
     * Multiply this Matrix by the given Matrix.
     *
     * If an `out` Matrix is given then the results will be stored in it.
     * If it is not given, this matrix will be updated in place instead.
     * Use an `out` Matrix if you do not wish to mutate this matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#multiply
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} rhs - The Matrix to multiply by.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [out] - An optional Matrix to store the results in.
     *
     * @return {(this|Phaser.GameObjects.Components.TransformMatrix)} Either this TransformMatrix, or the `out` Matrix, if given in the arguments.
     */
    multiply: function (rhs, out) {
        var matrix = this.matrix;
        var source = rhs.matrix;

        var localA = matrix[0];
        var localB = matrix[1];
        var localC = matrix[2];
        var localD = matrix[3];
        var localE = matrix[4];
        var localF = matrix[5];

        var sourceA = source[0];
        var sourceB = source[1];
        var sourceC = source[2];
        var sourceD = source[3];
        var sourceE = source[4];
        var sourceF = source[5];

        var destinationMatrix = (out === undefined) ? this : out;

        destinationMatrix.a = (sourceA * localA) + (sourceB * localC);
        destinationMatrix.b = (sourceA * localB) + (sourceB * localD);
        destinationMatrix.c = (sourceC * localA) + (sourceD * localC);
        destinationMatrix.d = (sourceC * localB) + (sourceD * localD);
        destinationMatrix.e = (sourceE * localA) + (sourceF * localC) + localE;
        destinationMatrix.f = (sourceE * localB) + (sourceF * localD) + localF;

        return destinationMatrix;
    },

    /**
     * Multiply this Matrix by the matrix given, including the offset.
     *
     * The offsetX is added to the tx value: `offsetX * a + offsetY * c + tx`.
     * The offsetY is added to the ty value: `offsetY * b + offsetY * d + ty`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#multiplyWithOffset
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} src - The source Matrix to copy from.
     * @param {number} offsetX - Horizontal offset to factor in to the multiplication.
     * @param {number} offsetY - Vertical offset to factor in to the multiplication.
     *
     * @return {this} This TransformMatrix.
     */
    multiplyWithOffset: function (src, offsetX, offsetY) {
        var matrix = this.matrix;
        var otherMatrix = src.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        var pse = offsetX * a0 + offsetY * c0 + tx0;
        var psf = offsetX * b0 + offsetY * d0 + ty0;

        var a1 = otherMatrix[0];
        var b1 = otherMatrix[1];
        var c1 = otherMatrix[2];
        var d1 = otherMatrix[3];
        var tx1 = otherMatrix[4];
        var ty1 = otherMatrix[5];

        matrix[0] = a1 * a0 + b1 * c0;
        matrix[1] = a1 * b0 + b1 * d0;
        matrix[2] = c1 * a0 + d1 * c0;
        matrix[3] = c1 * b0 + d1 * d0;
        matrix[4] = tx1 * a0 + ty1 * c0 + pse;
        matrix[5] = tx1 * b0 + ty1 * d0 + psf;

        return this;
    },

    /**
     * Transform the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transform
     * @since 3.0.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value.
     * @param {number} c - The Shear X value.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This TransformMatrix.
     */
    transform: function (a, b, c, d, tx, ty) {
        var matrix = this.matrix;

        var a0 = matrix[0];
        var b0 = matrix[1];
        var c0 = matrix[2];
        var d0 = matrix[3];
        var tx0 = matrix[4];
        var ty0 = matrix[5];

        matrix[0] = a * a0 + b * c0;
        matrix[1] = a * b0 + b * d0;
        matrix[2] = c * a0 + d * c0;
        matrix[3] = c * b0 + d * d0;
        matrix[4] = tx * a0 + ty * c0 + tx0;
        matrix[5] = tx * b0 + ty * d0 + ty0;

        return this;
    },

    /**
     * Transform a point using this Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#transformPoint
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the point to transform.
     * @param {number} y - The y coordinate of the point to transform.
     * @param {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} point - The Point object to store the transformed coordinates.
     *
     * @return {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} The Point containing the transformed coordinates.
     */
    transformPoint: function (x, y, point) {
        if (point === undefined) { point = { x: 0, y: 0 }; }

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        point.x = x * a + y * c + tx;
        point.y = x * b + y * d + ty;

        return point;
    },

    /**
     * Invert the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#invert
     * @since 3.0.0
     *
     * @return {this} This TransformMatrix.
     */
    invert: function () {
        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        var n = a * d - b * c;

        matrix[0] = d / n;
        matrix[1] = -b / n;
        matrix[2] = -c / n;
        matrix[3] = a / n;
        matrix[4] = (c * ty - d * tx) / n;
        matrix[5] = -(a * ty - b * tx) / n;

        return this;
    },

    /**
     * Set the values of this Matrix to copy those of the matrix given.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyFrom
     * @since 3.11.0
     *
     * @param {Phaser.GameObjects.Components.TransformMatrix} src - The source Matrix to copy from.
     *
     * @return {this} This TransformMatrix.
     */
    copyFrom: function (src) {
        var matrix = this.matrix;

        matrix[0] = src.a;
        matrix[1] = src.b;
        matrix[2] = src.c;
        matrix[3] = src.d;
        matrix[4] = src.e;
        matrix[5] = src.f;

        return this;
    },

    /**
     * Set the values of this Matrix to copy those of the array given.
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyFromArray
     * @since 3.11.0
     *
     * @param {array} src - The array of values to set into this matrix.
     *
     * @return {this} This TransformMatrix.
     */
    copyFromArray: function (src) {
        var matrix = this.matrix;

        matrix[0] = src[0];
        matrix[1] = src[1];
        matrix[2] = src[2];
        matrix[3] = src[3];
        matrix[4] = src[4];
        matrix[5] = src[5];

        return this;
    },

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.transform method.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyToContext
     * @since 3.12.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas Rendering Context to copy the matrix values to.
     *
     * @return {CanvasRenderingContext2D} The Canvas Rendering Context.
     */
    copyToContext: function (ctx) {
        var matrix = this.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        return ctx;
    },

    /**
     * Copy the values from this Matrix to the given Canvas Rendering Context.
     * This will use the Context.setTransform method.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#setToContext
     * @since 3.12.0
     *
     * @param {CanvasRenderingContext2D} ctx - The Canvas Rendering Context to copy the matrix values to.
     *
     * @return {CanvasRenderingContext2D} The Canvas Rendering Context.
     */
    setToContext: function (ctx) {
        var matrix = this.matrix;

        ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);

        return ctx;
    },

    /**
     * Copy the values in this Matrix to the array given.
     *
     * Where array indexes 0, 1, 2, 3, 4 and 5 are mapped to a, b, c, d, e and f.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#copyToArray
     * @since 3.12.0
     *
     * @param {array} [out] - The array to copy the matrix values in to.
     *
     * @return {array} An array where elements 0 to 5 contain the values from this matrix.
     */
    copyToArray: function (out) {
        var matrix = this.matrix;

        if (out === undefined) {
            out = [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
        }
        else {
            out[0] = matrix[0];
            out[1] = matrix[1];
            out[2] = matrix[2];
            out[3] = matrix[3];
            out[4] = matrix[4];
            out[5] = matrix[5];
        }

        return out;
    },

    /**
     * Set the values of this Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#setTransform
     * @since 3.0.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value inclusive of rotation.
     * @param {number} c - The Shear X value inclusive of rotation.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This TransformMatrix.
     */
    setTransform: function (a, b, c, d, tx, ty) {
        var matrix = this.matrix;

        matrix[0] = a;
        matrix[1] = b;
        matrix[2] = c;
        matrix[3] = d;
        matrix[4] = tx;
        matrix[5] = ty;

        return this;
    },

    /**
     * Describes the `translate`, `rotation`, `scale`, and `shear` (in that order) of a given `TransformMatrix`. The shear is additive with the rotation.
     * @method Phaser.GameObjects.Components.TransformMatrix#decomposeMatrix
     * @since 3.0.0
     * @return {object} The decomposed Matrix.
     */
    decomposeMatrix: function () {
        var decomposedMatrix = this.decomposedMatrix;

        var matrix = this.matrix;

        //  a = scale X (1)
        //  b = shear Y (0)
        //  c = shear X (0)
        //  d = scale Y (1)

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];

        var determ = a * d - b * c;
        var scaleX2 = a * a + b * b;
        var scaleY2 = c * c + d * d;

        decomposedMatrix.translateX = matrix[4];
        decomposedMatrix.translateY = matrix[5];
        decomposedMatrix.scaleX = 1;
        decomposedMatrix.scaleY = 1;
        decomposedMatrix.rotation = 0;
        decomposedMatrix.skewX = 0;
        decomposedMatrix.skewX = 0;
       
        // if (a || b) {
        //     var r = Math.sqrt(a * a + b * b);

        //     decomposedMatrix.rotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
        //     decomposedMatrix.scaleX = r;
        //     decomposedMatrix.scaleY = determ / r;
        // }
        if (a || b) {
            var scaleX = Math.sqrt(scaleX2);
            decomposedMatrix.rotation = (b > 0) ? Math.acos(a / scaleX) : -Math.acos(a / scaleX);
            decomposedMatrix.scaleX = scaleX;
            decomposedMatrix.scaleY = determ / scaleX;
            decomposedMatrix.skewX = Math.atan((a * c + b * d) / scaleX2);
        }
        else if (c || d) {
            //else if (c || d) {
            // var s = Math.sqrt(c * c + d * d);

            // decomposedMatrix.rotation = Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            // decomposedMatrix.scaleX = determ / s;
            // decomposedMatrix.scaleY = s;
            var scaleY = Math.sqrt(scaleY2);
            decomposedMatrix.rotation = Math.PI * 0.5 - (d > 0 ? Math.acos(-c / scaleY) : -Math.acos(c / scaleY));
            decomposedMatrix.scaleX = determ / scaleY;
            decomposedMatrix.scaleY = scaleY;
            decomposedMatrix.skewY = Math.atan((a * c + b * d) / scaleY2);
        }
        else {
            decomposedMatrix.rotation = 0;
            decomposedMatrix.scaleX = 0;
            decomposedMatrix.scaleY = 0;
            // decomposedMatrix.scaleX = decomposedMatrix.scaleY = Math.sqrt(scaleX2);
        }

        return decomposedMatrix;
    },

    /**
     * Apply the identity, translate, rotate ,scale and skew operations on the Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#applyITRS
     * @since 3.0.0
     *
     * @param {number} x - The horizontal translation.
     * @param {number} y - The vertical translation.
     * @param {number} rotation - The angle of rotation in radians.
     * @param {number} scaleX - The horizontal scale.
     * @param {number} scaleY - The vertical scale.
     * @param {number} [skewX=0] - The horizontal shear.
     * @param {number} [skewY=0] - The vertical shear.
     * @return {this} This TransformMatrix.
     */
    applyITRS: function (x, y, rotation, scaleX, scaleY, skewX, skewY) {
        if (skewX === undefined) { skewX = 0; }
        if (skewY === undefined) { skewY = 0; }
        var matrix = this.matrix;

        // var radianSin = Math.sin(rotation);
        // var radianCos = Math.cos(rotation);

        // Translate
        matrix[4] = x;
        matrix[5] = y;

        // Rotate and Scale
        // matrix[0] = radianCos * scaleX;
        // matrix[1] = radianSin * scaleX;
        // matrix[2] = -radianSin * scaleY;
        // matrix[3] = radianCos * scaleY;
        matrix[0] = Math.cos(rotation - skewY) * scaleX;
        matrix[1] = Math.sin(rotation - skewY) * scaleX;
        matrix[2] = -Math.sin(rotation + skewX) * scaleY;
        matrix[3] = Math.cos(rotation + skewX) * scaleY;

        return this;
    },

    /**
     * Takes the `x` and `y` values and returns a new position in the `output` vector that is the inverse of
     * the current matrix with its transformation applied.
     *
     * Can be used to translate points from world to local space.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#applyInverse
     * @since 3.12.0
     *
     * @param {number} x - The x position to translate.
     * @param {number} y - The y position to translate.
     * @param {Phaser.Math.Vector2} [output] - A Vector2, or point-like object, to store the results in.
     *
     * @return {Phaser.Math.Vector2} The coordinates, inverse-transformed through this matrix.
     */
    applyInverse: function (x, y, output) {
        if (output === undefined) { output = new Vector2(); }

        var matrix = this.matrix;

        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        var tx = matrix[4];
        var ty = matrix[5];

        var id = 1 / ((a * d) + (c * -b));

        output.x = (d * id * x) + (-c * id * y) + (((ty * c) - (tx * d)) * id);
        output.y = (a * id * y) + (-b * id * x) + (((-ty * a) + (tx * b)) * id);

        return output;
    },

    /**
     * Returns the X component of this matrix multiplied by the given values.
     * This is the same as `x * a + y * c + e`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getX
     * @since 3.12.0
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     *
     * @return {number} The calculated x value.
     */
    getX: function (x, y) {
        return x * this.a + y * this.c + this.e;
    },

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     * This is the same as `x * b + y * d + f`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getY
     * @since 3.12.0
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     *
     * @return {number} The calculated y value.
     */
    getY: function (x, y) {
        return x * this.b + y * this.d + this.f;
    },

    /**
     * Returns the X component of this matrix multiplied by the given values.
     *
     * This is the same as `x * a + y * c + e`, optionally passing via `Math.round`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getXRound
     * @since 3.50.0
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {boolean} [round=false] - Math.round the resulting value?
     *
     * @return {number} The calculated x value.
     */
    getXRound: function (x, y, round) {
        var v = this.getX(x, y);

        if (round) {
            v = Math.round(v);
        }

        return v;
    },

    /**
     * Returns the Y component of this matrix multiplied by the given values.
     *
     * This is the same as `x * b + y * d + f`, optionally passing via `Math.round`.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getYRound
     * @since 3.50.0
     *
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {boolean} [round=false] - Math.round the resulting value?
     *
     * @return {number} The calculated y value.
     */
    getYRound: function (x, y, round) {
        var v = this.getY(x, y);

        if (round) {
            v = Math.round(v);
        }

        return v;
    },

    /**
     * Returns a string that can be used in a CSS Transform call as a `matrix` property.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#getCSSMatrix
     * @since 3.12.0
     *
     * @return {string} A string containing the CSS Transform matrix values.
     */
    getCSSMatrix: function () {
        var m = this.matrix;

        return 'matrix(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + m[3] + ',' + m[4] + ',' + m[5] + ')';
    },

    /**
     * Destroys this Transform Matrix.
     *
     * @method Phaser.GameObjects.Components.TransformMatrix#destroy
     * @since 3.4.0
     */
    destroy: function () {
        this.matrix = null;
        this.decomposedMatrix = null;
    }

});

module.exports = TransformMatrix;
