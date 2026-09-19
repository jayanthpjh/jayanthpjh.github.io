/* Renderer-independent topology. Coordinates are percentages of the desktop stage. */
window.portfolioModels = {
  gcp: {
    name: 'Shipment & Fulfillment', slug: 'logistics-lakehouse-gcp',
    evidence: 'Live-tested on real GCP. Cloud Composer was removed after validation to stop ongoing costs.',
    metrics: [
      { value: '3', label: 'medallion layers', context: 'Bronze, Silver, and Gold tables for logistics analysis.' },
      { value: 'Batch', label: 'processing pattern', context: 'Cloud Composer coordinates the logistics workflow.' },
      { value: 'GCP', label: 'tested environment', context: 'Validated with real Google Cloud infrastructure.' },
      { value: '5', label: 'architecture stages', context: 'Storage, orchestration, validation, lakehouse, and serving.' }
    ],
    nodes: [
      { id:'source', title:'GCS', caption:'Shipment & order files', kind:'storage', x:10,y:49, detail:'Land operational files in cloud storage, preserving the original source for repeatable processing.' },
      { id:'orchestrate', title:'Cloud Composer', caption:'Orchestrate the batch', kind:'compute', x:30,y:35, detail:'Coordinate scheduled tasks with Airflow dependencies. Deployment validation included real Cloud Composer.' },
      { id:'quality', title:'Transform & validate', caption:'Make the data usable', kind:'quality', x:50,y:49, detail:'Transform the source into consistent tables and check quality before downstream use.' },
      { id:'lake', title:'Delta lakehouse', caption:'Bronze → Silver → Gold', kind:'lake', x:71,y:35, detail:'Organize data through medallion layers with Unity Catalog governance.' },
      { id:'serve', title:'Logistics analytics', caption:'Shipment & fulfillment', kind:'analytics', x:91,y:49, detail:'Serve curated logistics data for shipment and order-fulfillment analysis.' }
    ], edges:[['source','orchestrate'],['orchestrate','quality'],['quality','lake'],['lake','serve']]
  },
  aws: {
    name:'Clickstream & Orders', slug:'ecommerce-lakehouse-databricks',
    evidence:'Live-tested on Databricks Free Edition. AWS S3 and Airflow deployment paths are documented.',
    metrics:[
      {value:'2',label:'ingestion paths',context:'Clickstream events and order-change records stay separate before merging.'},
      {value:'CDC',label:'processing pattern',context:'Order inserts, updates, and deletes are applied into Delta.'},
      {value:'Airflow',label:'orchestration path',context:'AWS and Airflow deployment guidance is documented.'},
      {value:'6',label:'architecture stages',context:'Parallel source paths converge into a shared commerce lakehouse.'}
    ],
    nodes:[
      {id:'events',title:'Clickstream',caption:'S3 deployment path',kind:'storage',x:10,y:25,detail:'Retain raw clickstream files. The repository documents an AWS S3 deployment path.'},
      {id:'orders',title:'Order changes',caption:'Inserts · updates · deletes',kind:'storage',x:10,y:73,detail:'Capture order changes separately so inserts, updates, and deletes can be merged predictably.'},
      {id:'loader',title:'Auto Loader',caption:'Incremental ingestion',kind:'compute',x:36,y:25,detail:'Incrementally ingest new clickstream files with checkpoints for repeatable processing.'},
      {id:'cdc',title:'CDC merge',caption:'Apply order changes',kind:'quality',x:36,y:73,detail:'Apply order change records to Delta tables while preserving the raw input.'},
      {id:'lake',title:'Delta Lake',caption:'A shared data foundation',kind:'lake',x:66,y:49,detail:'Bring the streaming and order-change paths into Delta tables for downstream analysis.'},
      {id:'serve',title:'Commerce analytics',caption:'Events + order context',kind:'analytics',x:90,y:49,detail:'Combine clickstream and order context into curated analytical outputs. Airflow deployment guidance accompanies the build.'}
    ], edges:[['events','loader'],['orders','cdc'],['loader','lake'],['cdc','lake'],['lake','serve']]
  },
  azure: {
    name:'Claims & Quotes',slug:'insurance-claims-lakehouse-azure',
    evidence:'Live-tested on Databricks Free Edition. The real Azure deployment path is documented.',
    metrics:[
      {value:'2',label:'ingestion paths',context:'Quote streams and claims change feeds are modeled separately.'},
      {value:'Rescue',label:'schema strategy',context:'Unexpected fields remain visible through schema rescue.'},
      {value:'ADF',label:'deployment path',context:'Azure Data Factory deployment guidance is documented.'},
      {value:'7',label:'architecture stages',context:'The model shows ingestion, CDC, quality, lakehouse, and serving.'}
    ],
    nodes:[
      {id:'quotes',title:'Quote streams',caption:'ADLS deployment path',kind:'storage',x:9,y:25,detail:'Ingest quote events on a streaming path. Azure storage deployment is documented in the project.'},
      {id:'claims',title:'Claims changes',caption:'Batch change feed',kind:'storage',x:9,y:73,detail:'Process claims changes in batches alongside the separate quote stream.'},
      {id:'schema',title:'Schema rescue',caption:'Retain unexpected fields',kind:'compute',x:33,y:25,detail:'Rescue unexpected fields to make schema changes visible rather than silently discarding them.'},
      {id:'cdc',title:'Claims CDC',caption:'Apply incremental changes',kind:'compute',x:33,y:73,detail:'Apply claims change records incrementally to the lakehouse.'},
      {id:'quality',title:'Quality gates',caption:'Validate both paths',kind:'quality',x:55,y:49,detail:'Use explicit checks to surface invalid data before it reaches curated outputs.'},
      {id:'lake',title:'Delta lakehouse',caption:'Medallion architecture',kind:'lake',x:74,y:49,detail:'Store raw, refined, and curated data in a shared medallion architecture. ADF deployment guidance is documented.'},
      {id:'serve',title:'Claims & quotes',caption:'Curated analysis',kind:'analytics',x:93,y:49,detail:'Make claims and quoting data available for analysis through consistent curated tables.'}
    ],edges:[['quotes','schema'],['claims','cdc'],['schema','quality'],['cdc','quality'],['quality','lake'],['lake','serve']]
  }
};
