# -*- coding: utf-8 -*-
#
# Copyright 2012-2015 Spotify AB
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import datetime
import json
import random

import luigi
from luigi.contrib.esindex import CopyToIndex

class FetchDataTask(luigi.Task):
    """
    Generates a local file containing 5 elements of data in JSON format.
    """

    #: the date parameter.
    date = luigi.DateParameter(default=datetime.date.today())
    file = str(random.randint(0,10000)) + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

    def run(self):
        """
        Writes data in JSON format into the task's output target.
        The data objects have the following attributes:
        * `_id` is the default Elasticsearch id field,
        * `text`: the text,
        * `date`: the day when the data was created.
        """
        today = datetime.date.today()

	with open('TuscanyPlaces.json') as f:
                j = json.load(f)
        with self.output().open('w') as output:
                for i in j:
			i["_id"] = i["id"]
			output.write(json.dumps(i))
			output.write('\n')       
    def output(self):
        """
        Returns the target output for this task.
        In this case, a successful execution of this task will create a file on the local filesystem.
        :return: the target output for this task.
        :rtype: object (:py:class:`luigi.target.Target`)
        """
        return luigi.LocalTarget(path='/tmp/_docs-%s.ldj' % self.file)

# class SenpyTask(luigi.Task):
#     """
#     This task loads data fetched with previous task and send it to Senpy tool in order to analyze 
#     data retrieved and check sentiments expressed.
#     """
#     #: date task parameter (default = today)
#     date = luigi.DateParameter(default=datetime.date.today())

#     def requires(self):
#         """
#         This task's dependencies:
#         * :py:class:`~.FetchDataTask`
#         :return: object (:py:class:`luigi.task.Task`)
#         """
#         return FetchDataTask()

#     def run(self):
#         """
#         Send data to Senpy tool and retrieve it analyzed. Store data in a json file.
#         """



class Elasticsearch(CopyToIndex):
    """
    This task loads JSON data contained in a :py:class:`luigi.target.Target` into an ElasticSearch index.
    This task's input will the target returned by :py:meth:`~.Senpy.output`.
    This class uses :py:meth:`luigi.contrib.esindex.CopyToIndex.run`.
    After running this task you can run:
    .. code-block:: console
        $ curl "localhost:9200/example_index/_search?pretty"
    to see the indexed documents.
    To see the update log, run
    .. code-block:: console
        $ curl "localhost:9200/update_log/_search?q=target_index:example_index&pretty"
    To cleanup both indexes run:
    .. code-block:: console
        $ curl -XDELETE "localhost:9200/example_index"
        $ curl -XDELETE "localhost:9200/update_log/_query?q=target_index:example_index"
    """
    #: date task parameter (default = today)
    date = luigi.DateParameter(default=datetime.date.today())

    #: the name of the index in ElasticSearch to be updated.
    index = luigi.Parameter()
    #: the name of the document type.
    doc_type = luigi.Parameter()
    #: the host running the ElasticSearch service.
    host = 'localhost'
    #: the port used by the ElasticSearch service.
    port = 9200
    
    def requires(self):
        """
        This task's dependencies:
        * :py:class:`~.SenpyTask`
        :return: object (:py:class:`luigi.task.Task`)
        """
        return FetchDataTask()

# class SemanticTask(luigi.Task):
#     """
#     This task loads JSON data contained in a :py:class:`luigi.target.Target` and transform into RDF file
#     to insert into Fuseki platform as a semantic 
#     """
#     #: date task parameter (default = today)
#     date = luigi.DateParameter(default=datetime.date.today())

#     def requires(self):
#         """
#         This task's dependencies:
#         * :py:class:`~.SenpyTask` 
#         :return: object (:py:class:`luigi.task.Task`)
#         """
#         return SenpyTask()

if __name__ == "__main__":
    luigi.run(['--task', 'Elasticsearch'])
