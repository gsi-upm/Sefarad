//  Copyright (c) 2013 Marcos Torres, Grupo de Sistemas Inteligentes - Universidad Politécnica de Madrid. (GSI-UPM)
//  http://www.gsi.dit.upm.es/
//
//  All rights reserved. This program and the accompanying materials
//  are made available under the terms of the GNU Public License v2.0
//  which accompanies this distribution, and is available at
//
//  http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
//
//  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and  limitations under the License.
 
var fs = require('fs');

var widgetsPath = 'src/js/widgets';
var sourceFile = 'src/_sefarad.html';
var destinationFile = 'src/sefarad.html';

// Update widgets to the html file.
var string1 = '';
var string2 = '\t\t<script type="text/javascript">\n\t\t\tvar widgetX = [';

fs.readdir(widgetsPath, function (err, files) {
	if (err) {
		console.log(err);
	} else {
		//console.log(files.toString());
		for (var i = 0; i < files.length; i++) {
		 	string1 += '\t\t<script type="text/javascript" src="js/widgets/' + files[i] + '"></script>\n';
		 	string2 += files[i].substring(0, files[i].length - 3) + ', ';
		}
		
		string2 = string2.substring(0, string2.length - 2);
		string2 += '];\n\t\t</script>\n\t';

		updateHTML();
	}
});

var updateHTML = function() {
	var finalString = '';
	fs.readFile(sourceFile, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			var headPosition = data.toString().indexOf('<head>') + '<head>'.length + 1;
			//console.log(headStart);
			finalString += data.toString('utf8', 0, headPosition);
			finalString += string1;
			finalString += string2;
			finalString += data.toString('utf8', headPosition+1, data.length);
			//console.log(finalString);

			fs.writeFile (destinationFile, finalString, function(err) {
				if (err) {
					console.log(err);
				}
				console.log('Widgets actualizados.');
			})
 
		}
	});
}