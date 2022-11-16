var modelList = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var models = this.el.getAttribute("models");
      var barcodeValue = this.el.getAttribute("value");
      elementsArray.push({ models: models, barcode_value: barcodeValue });

      compounds[barcodeValue]["compounds"].map(item => {
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
        compound.setAttribute("visible", false);
      });

      var atom = document.querySelector(`#${models}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var models = this.el.getAttribute("models");
      var index = elementsArray.findIndex(x => x.models === models);
      if (index > -1) {
        elementsArray.splice(index, 1);
      }
    });
  },

  tick: async function () {
    if (modelList.length > 1) {
      var baseModelPresent = this.isModelPresentInArray(modelList,'base');
      var messageText = document.querySelector("#message-text");

      if(!baseModelPresent){
        messageText.setAttribute("visible",false);
      } else{
        if(models === null){
          models = await this.getModels();
        }

        messageText.setAttribute('visible', false);
        this.placeModel("road",models);
        this.placeModel("car",models);
        this.placeModel("building1",models);
        this.placeModel("building2",models);
        this.placeModel("building3",models);
        this.placeModel("tree",models);
        this.placeModel("sun",models);
      }
    }
  },

  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  
  isModelPresentInArray: function (arr, val) {
    for (var i of arr){
      if(i.model_name === val){
        return true;
      }
    }
    return false;
  },

  placeModel : function(modelName, models){
    var isListContainModel = this.isModelPresentInArray(modelList, modelName);
    if(isListContainModel){
      var distance = null
      var marker1 = document.querySelector(`#marker-base`);
      var marker2 = document.querySelector(`#marker-${modelName}`);

      distance = this.getDistance(marker1, marker2);
      if(distance < 1.25){
        var modelEl = document.querySelector(`#model-${modelName}`);
        if(isModelPlaced === null){
          var el = document.createElement("a-entity");
          var modelGeometry = this.getModelGeometry(models,modelName);

          el.setAttribute("id", `model-${modelName}`);
          el.setAttribute("gltf-model", `url(${modelGeometry.model_url})`);
          el.setAttribute("position",modelGeometry.position);
          el.setAttribute('rotation',modelGeometry.rotation);
          el.setAttribute("scale", modelGeometry);
          marker1.appendChild(el);
        }
      }
    }
  }
});