const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function repoPath(...segments) {
  return path.join(repoRoot, ...segments);
}

const defaults = [
  {
    id: "01-node-api",
    name: "Node.js API",
    description: "Microservicio REST basico para rutas HTTP y desarrollo backend con Node.js.",
    stack: "Node.js 18 + Express",
    composeFile: repoPath("01-node-api", "docker-compose.yml"),
    docsPath: repoPath("01-node-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:3000" }],
    healthUrl: "http://localhost:3000/health",
    tags: ["api", "node", "starter"],
    category: "starter"
  },
  {
    id: "02-php-lamp",
    name: "PHP LAMP",
    description: "Entorno clasico para aplicaciones administrativas con PHP, Apache y MariaDB.",
    stack: "PHP 8.1 + Apache + MariaDB",
    composeFile: repoPath("02-php-lamp", "docker-compose.yml"),
    docsPath: repoPath("02-php-lamp", "README.md"),
    urls: [
      { label: "Web", url: "http://localhost:8081" },
      { label: "phpMyAdmin", url: "http://localhost:8082" }
    ],
    tags: ["php", "db", "monolith"],
    category: "starter"
  },
  {
    id: "03-python-api",
    name: "Python API",
    description: "Servicio Flask sencillo para aprender APIs Dockerizadas con Python.",
    stack: "Python 3.10 + Flask",
    composeFile: repoPath("03-python-api", "docker-compose.yml"),
    docsPath: repoPath("03-python-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:5000" }],
    healthUrl: "http://localhost:5000/health",
    tags: ["api", "python", "starter"],
    category: "starter"
  },
  {
    id: "04-redis-cache",
    name: "Redis Cache API",
    description: "API con Redis para demostrar cache, tiempo de respuesta y capas de performance.",
    stack: "Node.js 18 + Redis",
    composeFile: repoPath("04-redis-cache", "docker-compose.yml"),
    docsPath: repoPath("04-redis-cache", "README.md"),
    urls: [{ label: "API", url: "http://localhost:3001" }],
    healthUrl: "http://localhost:3001/health",
    tags: ["cache", "redis", "performance"],
    category: "infra"
  },
  {
    id: "05-postgres-api",
    name: "Inventory Core",
    description: "Backend transaccional para clientes, productos y pedidos con PostgreSQL.",
    stack: "Python 3.12 + FastAPI + PostgreSQL",
    composeFile: repoPath("05-postgres-api", "docker-compose.yml"),
    docsPath: repoPath("05-postgres-api", "README.md"),
    urls: [
      { label: "Sistema", url: "http://localhost:8000" },
      { label: "Swagger", url: "http://localhost:8000/docs" }
    ],
    healthUrl: "http://localhost:8000/health",
    tags: ["core", "postgres", "inventory"],
    category: "platform"
  },
  {
    id: "06-nginx-proxy",
    name: "Platform Gateway",
    description: "Gateway de entrada que unifica el acceso al panel, al core transaccional y al portal operativo.",
    stack: "Nginx",
    composeFile: repoPath("06-nginx-proxy", "docker-compose.yml"),
    docsPath: repoPath("06-nginx-proxy", "README.md"),
    urls: [{ label: "Gateway", url: "http://localhost:8085" }],
    tags: ["gateway", "nginx", "edge"],
    category: "platform"
  },
  {
    id: "07-rabbitmq-messaging",
    name: "RabbitMQ Messaging",
    description: "Mensajeria asincrona con producer y consumer para jobs desacoplados.",
    stack: "Node.js 18 + RabbitMQ",
    composeFile: repoPath("07-rabbitmq-messaging", "docker-compose.yml"),
    docsPath: repoPath("07-rabbitmq-messaging", "README.md"),
    urls: [{ label: "Management", url: "http://localhost:15672" }],
    tags: ["queue", "rabbitmq", "async"],
    category: "infra"
  },
  {
    id: "08-prometheus-grafana",
    name: "Prometheus + Grafana",
    description: "Centro de observabilidad para metricas y dashboards operativos.",
    stack: "Prometheus + Grafana",
    composeFile: repoPath("08-prometheus-grafana", "docker-compose.yml"),
    docsPath: repoPath("08-prometheus-grafana", "README.md"),
    urls: [
      { label: "Prometheus", url: "http://localhost:9090" },
      { label: "Grafana", url: "http://localhost:3002" }
    ],
    tags: ["monitoring", "metrics", "ops"],
    category: "infra"
  },
  {
    id: "09-multi-service-app",
    name: "Operations Portal",
    description: "Portal operativo que consolida datos del Inventory Core y agrega watchlist persistida.",
    stack: "HTML + Node.js + MongoDB",
    composeFile: repoPath("09-multi-service-app", "docker-compose.yml"),
    docsPath: repoPath("09-multi-service-app", "README.md"),
    urls: [
      { label: "Sistema", url: "http://localhost:8083" },
      { label: "Overview API", url: "http://localhost:3003/api/overview" }
    ],
    healthUrl: "http://localhost:3003/api/health",
    tags: ["fullstack", "mongo", "portal"],
    category: "platform"
  },
  {
    id: "10-go-api",
    name: "Go API",
    description: "Servicio HTTP ligero para endpoints de alto rendimiento y utilidades rapidas.",
    stack: "Go 1.21",
    composeFile: repoPath("10-go-api", "docker-compose.yml"),
    docsPath: repoPath("10-go-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:8084" }],
    healthUrl: "http://localhost:8084/health",
    tags: ["go", "api", "performance"],
    category: "starter"
  },
  {
    id: "11-elasticsearch-search",
    name: "Elasticsearch Search",
    description: "Servicio de indexacion y busqueda full text para catalogos y conocimiento.",
    stack: "Python 3.12 + Elasticsearch",
    composeFile: repoPath("11-elasticsearch-search", "docker-compose.yml"),
    docsPath: repoPath("11-elasticsearch-search", "README.md"),
    urls: [
      { label: "API", url: "http://localhost:8000" },
      { label: "Elasticsearch", url: "http://localhost:9200" }
    ],
    healthUrl: "http://localhost:8000/health",
    tags: ["search", "elasticsearch", "indexing"],
    category: "infra"
  },
  {
    id: "12-jenkins-ci",
    name: "Jenkins CI",
    description: "Automatizacion de pipelines para builds, testing y despliegues repetibles.",
    stack: "Jenkins LTS",
    composeFile: repoPath("12-jenkins-ci", "docker-compose.yml"),
    docsPath: repoPath("12-jenkins-ci", "README.md"),
    urls: [{ label: "Jenkins", url: "http://localhost:8080" }],
    tags: ["ci", "automation", "delivery"],
    category: "infra"
  }
];

function loadManifest(labId) {
  const manifestPath = repoPath(labId, "lab-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    return {
      manifestError: `No fue posible leer ${manifestPath}: ${error.message}`
    };
  }
}

function mergeLab(defaultLab) {
  const manifest = loadManifest(defaultLab.id);
  const merged = {
    ...defaultLab,
    ...manifest,
    composeFile: defaultLab.composeFile,
    docsPath: defaultLab.docsPath,
    manifestPath: repoPath(defaultLab.id, "lab-manifest.json")
  };

  if (!Array.isArray(merged.urls)) {
    merged.urls = defaultLab.urls;
  }
  if (!Array.isArray(merged.tags)) {
    merged.tags = defaultLab.tags;
  }
  if (!Array.isArray(merged.relatedLabs)) {
    merged.relatedLabs = [];
  }

  return merged;
}

module.exports = defaults.map(mergeLab);
