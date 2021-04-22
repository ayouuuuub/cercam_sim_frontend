class LayerTree {
    constructor(options) {

        /*   if (!(this instanceof layerTree)) {
              throw new Error('layerTree must be constructed with the new keyword.');
          }  else*/
        if (typeof options === 'object' && options.map && options.target) {
            if (!(options.map instanceof ol.Map)) {
                throw new Error('Please provide a valid OpenLayers 3 map object.');
            }
            myExtObject.map = options.map;
            var containerDiv = document.getElementById(options.target);
            if (containerDiv === null || containerDiv.nodeType !== 1) {
                throw new Error('Please provide a valid element id.');
            }
            this.messages = document.getElementById(options.messages) || document.createElement('span');
            var controlDiv = document.createElement('div');
            controlDiv.className = 'layertree-buttons';
            controlDiv.appendChild(this.createButton('addwms', 'Ajouter visualiseur', 'addlayer'));
            /*  controlDiv.appendChild(this.createButton('deletelayer', 'Remove Layer', 'deletelayer')); */
            containerDiv.appendChild(controlDiv);
            this.layerContainer = document.createElement('div');
            this.layerContainer.className = 'layercontainer';
            containerDiv.appendChild(this.layerContainer);
            this.idCounter = 0;
            this.selectedLayer = null;

            myExtObject.map.getLayers().on('add', function(evt) {
                //if (evt.element instanceof ol.layer.Vector) {
                //  this.createRegistry(evt.element, true);
                // } else {
                this.createRegistry(evt.element);
                //}
            }, this);
            myExtObject.map.getLayers().on('remove', function(evt) {
                this.removeRegistry(evt.element);
            }, this);
        } else {
            throw new Error('Invalid parameter(s) provided.');
        }

    }
    createButton(elemName, elemTitle, elemType) {
            var buttonElem = document.createElement('button');
            buttonElem.className = elemName + "  mb-sm btn btn-primary";
            buttonElem.title = elemTitle;
            buttonElem.innerText = elemTitle;
            buttonElem.style.marginRight = "10px";
            switch (elemType) {
                case 'addlayer':
                    buttonElem.addEventListener('click', () => {
                        // // console.log("test")
                        document.getElementById(elemName).style.display = 'block';
                        myExtObject.ref_Component.ajouterWMS();
                    });
                    return buttonElem;
                case 'deletelayer':
                    var _this = this;
                    buttonElem.addEventListener('click', function() {
                        if (_this.selectedLayer) {
                            //alert("clicked");
                            //  // console.log("_this.selectedLayer.id : " + _this.selectedLayer.id)
                            var layer = _this.getLayerById(_this.selectedLayer.id);
                            myExtObject.map.removeLayer(layer);
                            _this.messages.textContent = 'Layer removed successfully.';
                        } else {
                            _this.messages.textContent = 'No selected layer to remove.';
                        }
                    });
                    return buttonElem;
                default:
                    return false;
            }
        }
        //not used
    addBufferIcon(layer) {
        layer.getSource().on('change', function(evt) {
            var layerElem = document.getElementById(layer.get('id'));
            switch (evt.target.getState()) {
                case 'ready':
                    layerElem.className = layerElem.className.replace(/(?:^|\s)(error|buffering)(?!\S)/g, '');
                    break;
                case 'error':
                    layerElem.className += ' error'
                    break;
                default:
                    layerElem.className += ' buffering';
                    break;
            }
        });
    }
    removeContent(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        return this;
    }

    createOption(optionValue) {
        var option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        return option;
    }


    checkWmsLayer(form) {
        //form.check.disabled = true;
        var _this = this;
        this.removeContent($("#layer")).removeContent($("#format"));
        $("#layer").find('option').remove();
        $("#format").find('option').remove();
        var url = form.server;
        url = /^((http)|(https))(:\/\/)/.test(url) ? url : 'http://' + url;
        form.server = url;
        //// console.log(url)
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                var parser = new ol.format.WMSCapabilities();
                try {
                    var capabilities = parser.read(request.responseText);
                    var currentProj = myExtObject.map.getView().getProjection().getCode();
                    var crs;
                    var messageText = 'Layers read successfully.';
                    if (capabilities.version === '1.3.0') {
                        crs = capabilities.Capability.Layer.CRS;
                    } else {
                        crs = [currentProj];
                        messageText += ' Warning! Projection compatibility could not be checked due to version mismatch (' + capabilities.version + ').';
                    }

                    var layers = capabilities.Capability.Layer.Layer;
                    if (layers.length > 0 && crs.indexOf(currentProj) > -1) {
                        $(".formwms").css({ "display": "initial" })

                        var option = document.createElement('option');
                        option.value = null;
                        option.textContent = "<< Non défini >>";
                        $("#layer").append(option);
                        for (var i = 0; i < layers.length; i += 1) {
                            $("#layer").append(_this.createOption(layers[i].Name));
                        }
                        $('#layer option:first-child').attr("selected", "selected");

                        var formats = capabilities.Capability.Request.GetMap.Format;
                        var optionFormat = document.createElement('option');
                        optionFormat.value = null;
                        optionFormat.textContent = "<< Non défini >>";
                        $("#format").append(optionFormat);

                        for (i = 0; i < formats.length; i += 1) {
                            $("#format").append(_this.createOption(formats[i]));
                        }
                        $('#format option:first-child').attr("selected", "selected");

                        _this.messages.textContent = messageText;
                        //// console.log(messageText)

                        //form.check.disabled = false;
                    }
                } catch (error) {
                    //// console.log("catch")
                    _this.messages.textContent = 'Some unexpected error occurred: (' + error.message + ').';
                    //form.check.disabled = false;
                } finally {
                    //// console.log("finally")
                    // form.check.disabled = false;
                }
            } else if (request.status > 200) {
                // // console.log("200")
                // form.check.disabled = false;
            }
        };
        url = /\?/.test(url) ? url + '&' : url + '?';
        url = url + 'REQUEST=GetCapabilities&SERVICE=WMS';
        //request.open('GET', '../../../cgi-bin/proxy.py?' + encodeURIComponent(url), true);
        request.open('GET', url, true);
        //// console.log("400")
        request.send();
    }


    addWmsLayer(form) {
        console.log(form)
        $("#layer").find('option').remove();
        $("#format").find('option').remove();
        $(".formwms").css({ "display": "none" })
        var params = {
            url: form.server,
            params: {
                layers: form.layer,
                format: form.format
            }
        };
        var layer;
        if (form.tiled) {
            layer = new ol.layer.Tile({
                source: new ol.source.TileWMS(params),
                name: form.displayname
            });
        } else {
            layer = new ol.layer.Image({
                source: new ol.source.ImageWMS(params),
                name: form.displayname
            });
        }
        myExtObject.map.addLayer(layer);
        //this.messages.textContent = 'WMS layer added successfully.';
        //return this;
    }

    addSelectEvent(node, isChild) {
        var _this = this;
        node.addEventListener('click', function(evt) {
            var targetNode = evt.target;
            if (isChild) {
                evt.stopPropagation();
                targetNode = targetNode.parentNode;
            }
            if (_this.selectedLayer) {
                _this.selectedLayer.classList.remove('active');
            }
            _this.selectedLayer = targetNode;
            targetNode.classList.add('active');
        });
        return node;
    }

    removeRegistry(layer) {
        //// console.log("id : " + layer.get('id'))
        var layerDiv = document.getElementById(layer.get('id'));
        this.layerContainer.removeChild(layerDiv);
        /*this.removeIndector() ; 
        myExtObject.ref_Component.removeIndectorFromSerie();*/
        return this;
    }

    getLayerById(id) {
        var layers = myExtObject.map.getLayers().getArray();
        for (var i = 0; i < layers.length; i += 1) {
            if (layers[i].get('id') === id) {
                //// console.log(layers[i])
                return layers[i];
            }
        }
        return false;
    }

    stopPropagationOnEvent(node, event) {
        node.addEventListener(event, function(evt) {
            evt.stopPropagation();
        });
        return node;
    }


    createRegistry(layer, buffer, titre) {
        layer.set('id', 'layer_' + this.idCounter);
        this.idCounter += 1;
        var layerDiv = document.createElement('div');
        layerDiv.className = buffer ? 'layer ol-unselectable buffering' : 'layer ol-unselectable';
        layerDiv.title = layer.get('name') || titre || 'couche WMS';
        layerDiv.id = layer.get('id');
        layerDiv.style.border = "1px dashed #9ea3a3";
        layerDiv.style.padding = "8px";
        layerDiv.style.marginBottom = "7px";
        this.addSelectEvent(layerDiv);
        var _this = this;
        layerDiv.draggable = true;


        layerDiv.addEventListener('dragstart', function(evt) {
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.setData('Text', this.id);
        });
        layerDiv.addEventListener('dragenter', function(evt) {
            this.classList.add('over');
        });
        layerDiv.addEventListener('dragleave', function(evt) {
            this.classList.remove('over');
        });
        layerDiv.addEventListener('dragover', function(evt) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'move';
        });
        layerDiv.addEventListener('drop', function(evt) {
            evt.preventDefault();
            this.classList.remove('over');
            var sourceLayerDiv = document.getElementById(evt.dataTransfer.getData('Text'));
            if (sourceLayerDiv !== this) {
                //// console.log("sourceLayerDiv", sourceLayerDiv)
                //// console.log("sourceLayerDiv", this)

                _this.layerContainer.removeChild(sourceLayerDiv);
                // $(sourceLayerDiv).remove();
                //// console.log("$(sourceLayerDiv)", $(sourceLayerDiv))
                //// console.log("remove _this.layerContainer ", _this.layerContainer)
                _this.layerContainer.insertBefore(sourceLayerDiv, this);
                // // console.log("_this.layerContainer ", _this.layerContainer)
                var htmlArray = [].slice.call(_this.layerContainer.children);
                var index = htmlArray.length - htmlArray.indexOf(sourceLayerDiv) - 1;
                var sourceLayer = _this.getLayerById(sourceLayerDiv.id);
                //// console.log("sourceLayer :", sourceLayer)
                var layers = myExtObject.map.getLayers().getArray();
                layers.splice(layers.indexOf(sourceLayer), 1);
                layers.splice(index, 0, sourceLayer);
                myExtObject.map.render();
            }
        });
        var layerSpan = document.createElement('label');
        layerSpan.textContent = layerDiv.title;
        layerDiv.appendChild(this.addSelectEvent(layerSpan, true));
        layerSpan.addEventListener('dblclick', function() {
            this.contentEditable = true;
            layerDiv.draggable = false;
            layerDiv.classList.remove('ol-unselectable');
            this.focus();
        });
        layerSpan.addEventListener('blur', function() {
            if (this.contentEditable) {
                this.contentEditable = false;
                layerDiv.draggable = true;
                layer.set('name', this.textContent);
                layerDiv.classList.add('ol-unselectable');
                layerDiv.title = this.textContent;
                this.scrollTo(0, 0);
            }
        });
        var divButton = document.createElement('div');
        divButton.style.display = "inline-block";
        divButton.style.float = "right";

        var buttonRemove = document.createElement('button');
        //buttonRemove.type = 'button';
        buttonRemove.name = 'removeLayer-' + layerDiv.id;
        buttonRemove.className = 'btn btn-xs fa fa-trash-o bg-danger';
        buttonRemove.id = layer.get('id');
        buttonRemove.style.marginRight = "10px";
        buttonRemove.style.height = "20px";
        buttonRemove.style.paddingTop = "0px";
        buttonRemove.style.fontSize = "12px";
        buttonRemove.addEventListener('click', (evt) => {
            // // console.log(evt)
            if (event.target.id) {
                //alert("clicked");
                /*     // console.log(layer) */
                var layers = myExtObject.map.getLayers().getArray();
                //// console.log(layers)
                for (var i = 0; i < layers.length; i += 1) {

                    if (layers[i].get('id') == event.target.id) {
                        myExtObject.map.removeLayer(layers[i]);
                        break;

                    }
                }


            }
        });
        //// console.log("layer : ", layer)
        if (layer.get('class') != "labelMap" && layer.get('class') != "baseCart" && titre != "Cart maroc")
            divButton.append(buttonRemove);

        var parentVisibleBox = document.createElement('div');
        parentVisibleBox.className = "checkbox c-checkbox";

        parentVisibleBox.style.display = "inline-block";
        parentVisibleBox.style.float = "right";
        parentVisibleBox.style.marginTop = "0px";


        var label = document.createElement('label');
        parentVisibleBox.append(label);

        var span = document.createElement('span');
        span.className = 'fa fa-check';
        span.style.marginTop = "1px";
        var visibleBox = document.createElement('input');
        visibleBox.type = 'checkbox';
        visibleBox.className = 'ng-untouched ng-pristine ng-valid visible';
        label.appendChild(this.stopPropagationOnEvent(visibleBox, 'click'));

        label.append(span);
        visibleBox.checked = layer.getVisible();
        visibleBox.addEventListener('change', function() {
            if (this.checked) {
                layer.setVisible(true);
            } else {
                layer.setVisible(false);
            }
        });
        layerDiv.appendChild(divButton);
        layerDiv.appendChild(parentVisibleBox);
        var layerControls = document.createElement('div');
        layerControls.style.width = "27%";
        layerControls.style.display = "inline-block";
        layerControls.style.float = "right";
        layerControls.style.marginTop = "1px";
        layerControls.style.marginRight = "20px";
        this.addSelectEvent(layerControls, true);
        var opacityHandler = document.createElement('input');
        opacityHandler.type = 'range';
        opacityHandler.min = 0;
        opacityHandler.max = 1;
        opacityHandler.step = 0.1;
        opacityHandler.value = layer.getOpacity();
        opacityHandler.addEventListener('input', function() {
            layer.setOpacity(this.value);
        });
        opacityHandler.addEventListener('change', function() {
            layer.setOpacity(this.value);
        });
        opacityHandler.addEventListener('mousedown', function() {
            layerDiv.draggable = false;
        });
        opacityHandler.addEventListener('mouseup', function() {
            layerDiv.draggable = true;
        });
        layerControls.appendChild(this.stopPropagationOnEvent(opacityHandler, 'click'));
        layerDiv.appendChild(layerControls);
        this.layerContainer.insertBefore(layerDiv, this.layerContainer.firstChild);
        return this;
    }
}

var LayerTreeInstance = (function(option) {
    return {
        createInstance: function(option) {
            var object = new LayerTree(option);
            return object;
        }
    };
})();