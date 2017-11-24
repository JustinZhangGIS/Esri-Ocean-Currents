/**
 * Created by zhangjian on 11/22/2017.
 */
define([
    'esri/core/declare',
    'esri/views/3d/externalRenderers'
], function (
    declare,
    externalRenderers
) {
    // Enforce strict mode
    'use strict';
    // 常量
    var THREE = window.THREE;
    var RADIUS = 6378137;
    var OFFSET = 5000;
    var COLOR = 0x00ffff;
    var REST = 75; //ms

    return declare([],{
        constructor: function (view, points) {
            this.view = view;
            this.points = points;
            this.index = 0;
            this.max = 0;
        },
        setup:function(context){
            // Create the THREE.js webgl renderer
            this.renderer = new THREE.WebGLRenderer({
                context: context.gl
            });

            // Make sure it does not clear anything before rendering
            this.renderer.autoClear = false;
            this.renderer.autoClearDepth = false;
            this.renderer.autoClearColor = false;
            this.renderer.autoClearStencil = false;

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera();

            // Create lights that will resemble the sun light lighting that we do internally
            this._createLights();

            // Create objects and add them to the scene
            this._createObjects();

            // Set starting geometries
            this._updateObjects();
        },
        render:function(context){
            // Make sure to reset the internal THREE.js state
            this.renderer.resetGLState();

            // Update the THREE.js camera so it's synchronized to our camera
            this._updateCamera(context);

            // Update the THREE.js lights so it's synchronized to our light
            this._updateLights(context);

            // Advance current geometry
            this._updateObjects(context);

            // Render the scene
            this.renderer.render(this.scene, this.camera);

            // Immediately request a new redraw
            externalRenderers.requestRender(this.view);
        },

        _createLights: function () {
            // Create both a directional light, as well as an ambient light
            this.directionalLight = new THREE.DirectionalLight();
            this.scene.add(this.directionalLight);

            this.ambientLight = new THREE.AmbientLight();//环境光
            this.scene.add(this.ambientLight);
        },
        _updateCamera: function (context) {
            // Get Esri's camera
            var c = context.camera;

            // Update three.js camera
            this.camera.projectionMatrix.fromArray(c.projectionMatrix);
            this.camera.position.set(c.eye[0], c.eye[1], c.eye[2]);
            this.camera.up.set(c.up[0], c.up[1], c.up[2]);
            this.camera.lookAt(new THREE.Vector3(c.center[0], c.center[1], c.center[2]));
        },
        _updateLights: function (context) {
            // Get Esri's current sun settings
            var direction = context.sunLight.direction;
            var diffuse = context.sunLight.diffuse;

            // Update the directional light color, intensity and position
            this.directionalLight.color.setRGB(diffuse.color[0], diffuse.color[1], diffuse.color[2]);
            this.directionalLight.intensity = diffuse.intensity;
            this.directionalLight.position.set(direction[0], direction[1], direction[2]);

            // Update the ambient light color and intensity
            var ambient = context.sunLight.ambient;
            this.ambientLight.color.setRGB(ambient.color[0], ambient.color[1], ambient.color[2]);
            this.ambientLight.intensity = ambient.intensity;
        }

    })

})