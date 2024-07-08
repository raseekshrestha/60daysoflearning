# code monitoring

## with prometheus, grafana and loki


```
global:
  scrape_interval: 4s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["192.168.1.65:8000"]

```

docker compose for prometheus server

```
version: '3'

services:
  prom-server:
    image: prom/prometheus
    
    ports:
      - 9090:9090
    volumes:
      - ./prometheus-config.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana-oss
    ports:
      - 3000:3000
    depends_on:
      - prom-server

```

default credential for grafana admin panel
user: admin 
pass: admin


for custom metrics
```
npm i prom-client
```
insert this code 
```
import client from 'prom-client'


client.collectDefaultMetrics({
    register: client.register
})

const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "indicate request and respose time",
    labelNames: ['method', "route", "statusCode"],
    buckets: [1, 50, 100, 200, 500, 800, 1000, 2000]
})

const totalRequest = new client.Counter({
    name: "total_request_counter",
    help: "show total request"
})
```