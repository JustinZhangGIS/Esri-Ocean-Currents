/* ------------------------------------------------------------

   Copyright 2016 Esri

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at:
   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

--------------------------------------------------------------- */

require({
    packages: [{
        name: 'app',
        location: document.location.pathname + '/..'
    }]
}, [
    'esri/Map',
    'esri/views/SceneView',
    'esri/views/3d/externalRenderers',
    'app/renderers/arrows',
    'app/renderers/lines',
    'dojo/_base/xhr',
    'dojo/domReady!'
],
function (
    Map,
    SceneView,
    ExternalRenderers,
    Arrows,
    Lines,
    xhr
    ) {
    // Enforce strict mode
    'use strict';

    var _externalRenderer = null;

    // Update UI
    updateMenu();

    // Create map and view
    var _view = new SceneView({
        container: 'map',
        ui: {
            components: [
                'zoom',
                'compass'
            ]
        },
        padding: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        center: [40, 22],
        environment: {
            lighting: {
                directShadowsEnabled: false,
                ambientOcclusionEnabled: false,
                cameraTrackingEnabled: true
            },
            atmosphereEnabled: 'default',
            atmosphere: {
                quality: 'low'
            },
            starsEnabled: false
        },
        map: new Map({
            basemap: 'dark-gray'
        })
    })
    _view.then(function () {
        xhr.get({
            url: 'data/trackdata.json',
            handleAs: 'json',
            load: function (tracks) {


                // Load renderer
                loadRenderer(tracks);
            }
        });
    });

    function loadRenderer(tracks) {
        // Remove old renderer
        if (_externalRenderer) {
            ExternalRenderers.remove(_view, _externalRenderer);
        }
        var type = $('.rc-type li.active a').html();

        // Create renderer
        switch (type) {
            case 'Arrows':
                _externalRenderer = new Arrows(_view, tracks);
                break;
            case 'Lines':
                _externalRenderer = new Lines(_view, tracks);
                break;
        }

        // Add renderer
        ExternalRenderers.add(
            _view,
            _externalRenderer
        );
    }
    function updateMenu() {
        $('.dropdown-menu').each(function () {
            $(this).siblings('a').find('.rc-itemValue').html(
                $(this).find('li.active a').html()
            );
        });
    }
    $('#buttonAbout').click(function () {
        $('#modalAbout').modal('show');
    });
    $('.modal a').attr('target', '_blank');
});
