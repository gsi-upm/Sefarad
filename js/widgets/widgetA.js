// Copyright (c) 2013 Marcos Torres, Grupo de Sistemas Inteligentes - Universidad Politécnica de Madrid. (GSI-UPM)
//  http://www.gsi.dit.upm.es/
//
//  All rights reserved. This program and the accompanying materials
//  are made available under the terms of the GNU Public License v2.0
//  which accompanies this distribution, and is available at
//
//  http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
//
//  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and  limitations under the License.
 
// New widget
var widgetA = {
		// Widget name.
		name: "WidgetA Name",
		// Widget description.
		description: "WidgetA, description",
		// Path to the image of the widget.
		img: "img/widgetA.png",
		// Type of the widget.
		type: "widgetAChart",
		// [OPTIONAL] data taken from this field.
		field: "hasPolarity",

		render: function () {
			var id = 'A' + Math.floor(Math.random() * 10001);
			var field = widgetA.field || "";
			vm.activeWidgetsLeft.push({"id":ko.observable(id),"title": ko.observable(widgetA.name), "type": ko.observable(widgetA.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			// widgetA.paint(field, id, widgetA.type);
			widgetA.paint(id);
		},

		// paint: function (field, id, type) {
		paint: function (id) {
			var field = "location";

			var t = ko.utils.getDataColumns(field);
	
			if(t==undefined){
				vm.newWidgetGetData(field, id);
			}else{
				console.log(t);
				$('#' + id + 'container').remove();
				var string = '<div id="' + id + 'container">';
				for (var i = 0; i < t.length; i++) {
					string += "<p>" + t[i].count + " tweets has " + t[i].facet + " polarity.</p>"
				}
				string += '</div>';
				$('#' + id).append(string);
			}

		}
	};