(function () {
    "use strict";
  
    // Warten bis DOM und Snap.svg bereit sind
    function init() {
      if (typeof Snap === "undefined") {
        console.error("Snap.svg ist nicht geladen. Bitte Snap.svg vor main.js einbinden.");
        return;
      }
  
      var _highFive = {};
  
      function HighFive(elId) {
        this.elId = elId;
        this.s = Snap("#" + this.elId);
        this.bgCircle = {};
        this.svgDOM = null;
        this.svgs = {};
        this.timesClicked = 0;
  
        // Maske
        this.bgCircle.mask = this.s.circle(200, 200, 200);
        this.bgCircle.mask.attr({
          fill: "#FFFFFF",
          stroke: "#000000",
          strokeWidth: 0,
        });
  
        // Hintergrund
        this.bgCircle.bg = this.s.circle(200, 200, 200);
        this.bgCircle.bg.attr({ fill: "#97D2C4" });
  
        var self = this;
        Snap.load(
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/150883/high-five-all.svg",
          function (f) {
            self.loadAndInit(f);
          }
        );
  
        _highFive = this;
      }
  
      HighFive.prototype.loadAndInit = function (f) {
        _highFive.svgDOM = f;
  
        // Hand 1
        _highFive.svgs._01 = _highFive.svgDOM.select("#high-five-01");
        // Hand 2
        _highFive.svgs._02 = _highFive.svgDOM.select("#high-five-02");
        // Hand 3
        _highFive.svgs._03 = _highFive.svgDOM.select("#high-five-03");
        _highFive.svgs._03.palm = _highFive.svgDOM.select("#palm");
        _highFive.svgs._03.fingerprintsGrp =
          _highFive.svgDOM.select("#fingerprints");
        _highFive.svgs._03.fingerprints =
          _highFive.svgDOM.selectAll("#fingerprints > *");
  
        // Reihenfolge der Gruppierung ist wichtig
        var gr01 = _highFive.s.group(
          _highFive.bgCircle.bg,
          _highFive.svgs._01,
          _highFive.svgs._02,
          _highFive.svgs._03
        );
        gr01.attr({ mask: _highFive.bgCircle.mask });
  
        _highFive.s.add(_highFive.svgDOM);
  
        // Initiale Position (verhindert NS_ERROR_FAILURE in Firefox)
        _highFive.svgs._01.initStr = "s0.6r-30t-100,280";
        _highFive.svgs._01.transform(_highFive.svgs._01.initStr);
  
        _highFive.svgs._02.initStr = "t-50,25";
        _highFive.svgs._02.attr({ opacity: 0 });
        _highFive.svgs._02.transform(_highFive.svgs._02.initStr);
  
        _highFive.svgs._03.initStr = "t-50,30";
        _highFive.svgs._03.attr({ opacity: 0 });
        _highFive.svgs._03.transform(_highFive.svgs._03.initStr);
  
        // Fingertips-Klasse hinzufügen (#fingerprints statt #fingertips - korrigierter Selektor)
        var ellipses = document.querySelectorAll("#fingerprints ellipse, #fingerprints > ellipse");
        ellipses.forEach(function (el) {
          el.classList.add("fingertip");
        });
  
        _highFive.setUpEvents();
        _highFive.animate01();
      };
  
      HighFive.prototype.animate01 = function () {
        setTimeout(function () {
          _highFive.svgs._01.animate(
            { transform: "t-50,60" },
            400,
            mina.backout,
            function () {
              setTimeout(function () {
                _highFive.svgs._01.animate(
                  { opacity: 0 },
                  30,
                  mina.linear,
                  function () {
                    _highFive.svgs._01.attr({ display: "none" });
                    _highFive.animate02();
                  }
                );
              }, 100);
            }
          );
        }, 500);
      };
  
      HighFive.prototype.animate02 = function () {
        _highFive.svgs._02.animate({ opacity: 1 }, 10, mina.linear, function () {
          _highFive.svgs._02.animate(
            { opacity: 0 },
            30,
            mina.linear,
            function () {
              _highFive.svgs._02.attr({ display: "none" });
            }
          );
        });
  
        _highFive.animate03();
      };
  
      HighFive.prototype.animate03 = function () {
        _highFive.svgs._03.animate({ opacity: 1 }, 30, mina.linear, function () {
          _highFive.bgCircle.bg.animate(
            { fill: "#FFFFFF" },
            10,
            mina.linear,
            function () {
              _highFive.bgCircle.bg.animate({ fill: "#97D2C4" }, 10);
            }
          );
  
          _highFive.svgs._03.animate(
            { transform: "s1.05t-50,0" },
            600,
            mina.elastic,
            function () {
              _highFive.svgs._03.animate(
                { transform: "t-50,5" },
                1000,
                mina.elastic
              );
              _highFive.svgs._03.fingerprintsGrp.animate({ opacity: 0 }, 500);
            }
          );
        });
      };
  
      HighFive.prototype.setUpEvents = function () {
        var container = document.getElementById(_highFive.elId);
        if (!container) return;
  
        container.addEventListener("click", function () {
          if (!_highFive.s.attr("class")) {
            _highFive.s.attr({ class: "clicked" });
          }
  
          if (_highFive.timesClicked < 5) {
            _highFive.resetHighFive();
            _highFive.animate01();
            _highFive.makeRed();
          }
        });
      };
  
      HighFive.prototype.resetHighFive = function () {
        _highFive.svgs._01.attr({ display: "block" });
        _highFive.svgs._01.transform(_highFive.svgs._01.initStr);
        _highFive.svgs._01.attr({ opacity: 1 });
  
        _highFive.svgs._02.attr({ display: "block" });
        _highFive.svgs._02.transform(_highFive.svgs._02.initStr);
  
        _highFive.svgs._03.attr({ opacity: 0 });
        _highFive.svgs._03.fingerprintsGrp.attr({ opacity: 1 });
  
        if (_highFive.svgs._03.fingerprintsGrp && _highFive.svgs._03.fingerprintsGrp.inAnim) {
          var anims = _highFive.svgs._03.fingerprintsGrp.inAnim();
          if (anims && anims[0]) {
            anims[0].stop();
          }
        }
  
        _highFive.svgs._03.transform(_highFive.svgs._03.initStr);
      };
  
      HighFive.prototype.makeRed = function () {
        var shadesRed = ["#C3B49B", "#CCB59E", "#D8B5A3", "#E6B6A7", "#F3B7AC"];
        var shadesRedFingertips = [
          "#CCB59E",
          "#D8B5A3",
          "#E6B6A7",
          "#F3B7AC",
          "#D3978C",
        ];
  
        _highFive.svgs._03.palm.animate(
          { fill: shadesRed[_highFive.timesClicked] },
          600,
          mina.easein
        );
  
        var fingerPrints = _highFive.svgs._03.fingerprints;
        if (fingerPrints) {
          for (var i = 0; i < fingerPrints.length; i++) {
            fingerPrints[i].animate(
              { fill: shadesRedFingertips[_highFive.timesClicked] },
              600,
              mina.easein
            );
          }
        }
  
        _highFive.timesClicked++;
      };
  
      // Initialisierung wenn DOM bereit ist
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
          new HighFive("high-five");
        });
      } else {
        new HighFive("high-five");
      }
    }
  
    init();
  })();