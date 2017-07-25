This deploys an elasticsearch instance that is exposed in the k8s cluster as `sefarad-es:9200` and externally as `http://sefarad-elasticsearch.cluster.gsi.dit.upm.es/` through an nginx ingress (proxy).

The ingress is configured to only allow `GET` requests, so only pods in the cluster can modify the databse (`POST`, `PUT`, `DELETE`).
