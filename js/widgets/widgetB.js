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
var widgetB = {
		// Widget name.
		name: "WidgetB Name",
		// Widget description.
		description: "WidgetB, description",
		// Path to the image of the widget.
		img: "img/widgetB.png",
		// Type of the widget.
		type: "widgetBChart",

		render: function () {
			var id = 'B' + Math.floor(Math.random() * 10001);
			var field = widgetB.field || "";
			vm.activeWidgetsLeft.push({"id":ko.observable(id),"title": ko.observable(widgetB.name), "type": ko.observable(widgetB.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			// widgetB.paint(field, id, widgetB.type);
			widgetB.paint(id);
		},

		// paint: function (field, id, type) {
		paint: function (id) {
			$('#' + id + 'container').remove();
			$('#' + id).append('<div id="' + id + 'container"><p>Data from widget B</p></div>');
		}
	};