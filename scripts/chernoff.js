

;(function ( $, window, document, undefined ) {

    var pluginName = 'chernoff-face',
      defaults = {
          propertyName: "value"
    };

    function Plugin( element, options ) {
      this.element = element;

      this.options = $.extend( {}, defaults, options) ;

      this._defaults = defaults;
      this._name = pluginName;

      this.init();
    }

    Plugin.prototype.init = function () {
      
    };

    $.fn[pluginName] = function ( options ) {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName,
          new Plugin( this, options ));
        }
      });
    }

    $.fn.chernoff = function (objects) {
      draw(objects.canvas, objects.half_length_of_eyes_ratio, 
        objects.position_of_eyes_ratio, objects.angle_of_eyebrow_ratio, objects.curvature_of_mouth_ratio);
      return null;
    };

    function draw(c, half_length_of_eyes_ratio, position_of_eyes_ratio, angle_of_eyebrow_ratio, curvature_of_mouth_ratio) {

      var w = c.width;
      var h = c.height;

      var points = new Array();
      for(var i=1; i<4; i++) {
        for(var j=1; j<4; j++) {
          points.push({x: w * 1/4*j, y:h * 1/4*i});
        }
      }

      var context = c.getContext("2d");

      //FACE
      context.beginPath();
      context.arc(points[4].x, points[4].y, w/2, 0, 2 * Math.PI, false);
      context.stroke();

      //EYES      
      //half_length_of_eyes, slant_of_eyes, position_of_eyes
      var eye_half_length = half_length_of_eyes_ratio * w * 1/6;
      var eye_posiiton_x = points[1].x;
      var eye_posiiton_y = points[1].y + 30 * h/500;
      var eye_position_relative_to_center = position_of_eyes_ratio * w * 1/3;

      context.beginPath();
      context.arc(eye_posiiton_x - eye_position_relative_to_center, eye_posiiton_y, eye_half_length, 0, 2 * Math.PI, false);
      context.stroke();

      context.beginPath();
      context.arc(eye_posiiton_x - eye_position_relative_to_center, eye_posiiton_y, eye_half_length/3, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.stroke();

      context.beginPath();
      context.arc(eye_posiiton_x + eye_position_relative_to_center, eye_posiiton_y, eye_half_length, 0, 2 * Math.PI, false);
      context.stroke();

      context.beginPath();
      context.arc(eye_posiiton_x + eye_position_relative_to_center, eye_posiiton_y, eye_half_length/3, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.stroke();

      //EYE BROW
      var eyebrow_angle = (angle_of_eyebrow_ratio - 0.5) * w * 1/6;
      var eyebrow_position_relative_to_center = w / 4;
      var eyebrow_position_center_y = points[0].y * 2/3;

      context.beginPath();
      context.moveTo(points[1].x - eyebrow_position_relative_to_center, eyebrow_position_center_y - eyebrow_angle);
      context.lineTo(points[1].x - 10, eyebrow_position_center_y + eyebrow_angle);
      context.stroke();

      context.beginPath();
      context.moveTo(points[1].x + 10, eyebrow_position_center_y + eyebrow_angle);
      context.lineTo(points[1].x + eyebrow_position_relative_to_center, eyebrow_position_center_y - eyebrow_angle);
      context.stroke();

      //NOSE
      context.beginPath();
      context.moveTo(points[1].x, points[1].y + h * 1/8);
      context.lineTo(points[4].x - w * 1/10, points[4].y + h * 1/8);
      context.lineTo(points[4].x + w * 1/10, points[4].y + h * 1/8);
      //context.lineTo(points[1].x, points[1].y + h * 1/8);
      context.stroke();

      //MOUSE
      var mouse_curvature = -1 * curvature_of_mouth_ratio * 50;
      var mouse_length = w * 1/4 - mouse_curvature;

      var mouse_start_point, mouse_end_point, mouse_y_point;
      
      if(w < 200) var mouse_factor = 10;
      else if(w < 300) var mouse_factor = 9;
      else var mouse_factor = 8;

      if(curvature_of_mouth_ratio > 0.5) {
        mouse_y_point = points[7].y + h * 2/5 + mouse_curvature + (500-h)/5;
        mouse_start_point = (mouse_factor + curvature_of_mouth_ratio * 7)/mouse_factor * Math.PI;
        mouse_end_point = (mouse_factor*2 - curvature_of_mouth_ratio * 7)/mouse_factor * Math.PI;
      }
      else {
        mouse_y_point = points[7].y - w * 1/6 + mouse_curvature;
        mouse_start_point = (mouse_factor - curvature_of_mouth_ratio * 7)/mouse_factor * Math.PI;
        mouse_end_point = (curvature_of_mouth_ratio * 7)/mouse_factor * Math.PI;
      }

      context.beginPath();
      context.arc(points[7].x, mouse_y_point,
        mouse_length, mouse_start_point, mouse_end_point, true);
      context.stroke();
    }

})( jQuery, window, document );