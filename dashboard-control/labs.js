const fs = require("fs");
const path = require("path");

const localRepoRoot = process.env.APP_REPO_ROOT
  ? path.resolve(process.env.APP_REPO_ROOT)
  : path.resolve(__dirname, "..");
const dockerRepoRoot = process.env.DOCKER_REPO_ROOT
  ? path.resolve(process.env.DOCKER_REPO_ROOT)
  : localRepoRoot;

function localRepoPath(...segments) {
  return path.join(localRepoRoot, ...segments);
}

function dockerRepoPath(...segments) {
  return path.join(dockerRepoRoot, ...segments);
}

const defaults = [
  {
    id: "01-node-api",
    name: "Node.js API",
    description: "Microservicio REST basico para rutas HTTP y desarrollo backend con Node.js.",
    stack: "Node.js 18 + Express",
    composeFile: dockerRepoPath("01-node-api", "docker-compose.yml"),
    docsPath: localRepoPath("01-node-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:3000" }],
    healthUrl: "http://localhost:3000/health",
    tags: ["api", "node", "starter"],
    category: "starter",
    recommendedRamGb: 1.5,
    resourceProfile: "light"
  },
  {
    id: "02-php-lamp",
    name: "PHP LAMP",
    description: "Entorno clasico para aplicaciones administrativas con PHP, Apache y MariaDB.",
    stack: "PHP 8.1 + Apache + MariaDB",
    composeFile: dockerRepoPath("02-php-lamp", "docker-compose.yml"),
    docsPath: localRepoPath("02-php-lamp", "README.md"),
    urls: [
      { label: "Web", url: "http://localhost:8081" },
      { label: "phpMyAdmin", url: "http://localhost:8082" }
    ],
    tags: ["php", "db", "monolith"],
    category: "starter",
    recommendedRamGb: 3,
    resourceProfile: "medium"
  },
  {
    id: "03-python-api",
    name: "Python API",
    description: "Servicio Flask sencillo para aprender APIs Dockerizadas con Python.",
    stack: "Python 3.10 + Flask",
    composeFile: dockerRepoPath("03-python-api", "docker-compose.yml"),
    docsPath: localRepoPath("03-python-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:5000" }],
    healthUrl: "http://localhost:5000/health",
    tags: ["api", "python", "starter"],
    category: "starter",
    recommendedRamGb: 1.5,
    resourceProfile: "light"
  },
  {
    id: "04-redis-cache",
    name: "Redis Cache API",
    description: "API con Redis para demostrar cache, tiempo de respuesta y capas de performance.",
    stack: "Node.js 18 + Redis",
    composeFile: dockerRepoPath("04-redis-cache", "docker-compose.yml"),
    docsPath: localRepoPath("04-redis-cache", "README.md"),
    urls: [{ label: "API", url: "http://localhost:3001" }],
    healthUrl: "http://localhost:3001/health",
    tags: ["cache", "redis", "performance"],
    category: "infra",
    recommendedRamGb: 2,
    resourceProfile: "light"
  },
  {
    id: "05-postgres-api",
    name: "Inventory Core",
    description: "Backend transaccional para clientes, productos y pedidos con PostgreSQL.",
    stack: "Python 3.12 + FastAPI + PostgreSQL",
    composeFile: dockerRepoPath("05-postgres-api", "docker-compose.yml"),
    docsPath: localRepoPath("05-postgres-api", "README.md"),
    urls: [
      { label: "Sistema", url: "http://localhost:8000" },
      { label: "Swagger", url: "http://localhost:8000/docs" }
    ],
    healthUrl: "http://localhost:8000/health",
    tags: ["core", "postgres", "inventory"],
    category: "platform",
    recommendedRamGb: 3,
    resourceProfile: "medium"
  },
  {
    id: "06-nginx-proxy",
    name: "Platform Gateway",
    description: "Gateway de entrada que unifica el acceso al panel, al core transaccional y al portal operativo.",
    stack: "Nginx",
    composeFile: dockerRepoPath("06-nginx-proxy", "docker-compose.yml"),
    docsPath: localRepoPath("06-nginx-proxy", "README.md"),
    urls: [{ label: "Gateway", url: "http://localhost:8085" }],
    tags: ["gateway", "nginx", "edge"],
    category: "platform",
    recommendedRamGb: 1,
    resourceProfile: "light"
  },
  {
    id: "07-rabbitmq-messaging",
    name: "RabbitMQ Messaging",
    description: "Mensajeria asincrona con producer y consumer para jobs desacoplados.",
    stack: "Node.js 18 + RabbitMQ",
    composeFile: dockerRepoPath("07-rabbitmq-messaging", "docker-compose.yml"),
    docsPath: localRepoPath("07-rabbitmq-messaging", "README.md"),
    urls: [{ label: "Management", url: "http://localhost:15672" }],
    tags: ["queue", "rabbitmq", "async"],
    category: "infra",
    recommendedRamGb: 2.5,
    resourceProfile: "medium"
  },
  {
    id: "08-prometheus-grafana",
    name: "Prometheus + Grafana",
    description: "Centro de observabilidad para metricas y dashboards operativos.",
    stack: "Prometheus + Grafana",
    composeFile: dockerRepoPath("08-prometheus-grafana", "docker-compose.yml"),
    docsPath: localRepoPath("08-prometheus-grafana", "README.md"),
    urls: [
      { label: "Prometheus", url: "http://localhost:9090" },
      { label: "Grafana", url: "http://localhost:3002" }
    ],
    tags: ["monitoring", "metrics", "ops"],
    category: "infra",
    recommendedRamGb: 4,
    resourceProfile: "heavy"
  },
  {
    id: "09-multi-service-app",
    name: "Operations Portal",
    description: "Portal operativo que consolida datos del Inventory Core y agrega watchlist persistida.",
    stack: "HTML + Node.js + MongoDB",
    composeFile: dockerRepoPath("09-multi-service-app", "docker-compose.yml"),
    docsPath: localRepoPath("09-multi-service-app", "README.md"),
    urls: [
      { label: "Sistema", url: "http://localhost:8083" },
      { label: "Overview API", url: "http://localhost:3003/api/overview" }
    ],
    healthUrl: "http://localhost:3003/api/health",
    tags: ["fullstack", "mongo", "portal"],
    category: "platform",
    recommendedRamGb: 4,
    resourceProfile: "heavy"
  },
  {
    id: "10-go-api",
    name: "Go API",
    description: "Servicio HTTP ligero para endpoints de alto rendimiento y utilidades rapidas.",
    stack: "Go 1.21",
    composeFile: dockerRepoPath("10-go-api", "docker-compose.yml"),
    docsPath: localRepoPath("10-go-api", "README.md"),
    urls: [{ label: "API", url: "http://localhost:8084" }],
    healthUrl: "http://localhost:8084/health",
    tags: ["go", "api", "performance"],
    category: "starter",
    recommendedRamGb: 1,
    resourceProfile: "light"
  },
  {
    id: "11-elasticsearch-search",
    name: "Elasticsearch Search",
    description: "Servicio de indexacion y busqueda full text para catalogos y conocimiento.",
    stack: "Python 3.12 + Elasticsearch",
    composeFile: dockerRepoPath("11-elasticsearch-search", "docker-compose.yml"),
    docsPath: localRepoPath("11-elasticsearch-search", "README.md"),
    urls: [
      { label: "API", url: "http://localhost:8000" },
      { label: "Elasticsearch", url: "http://localhost:9200" }
    ],
    healthUrl: "http://localhost:8000/health",
    tags: ["search", "elasticsearch", "indexing"],
    category: "infra",
    recommendedRamGb: 6,
    resourceProfile: "heavy"
  },
  {
    id: "12-jenkins-ci",
    name: "Jenkins CI",
    description: "Automatizacion de pipelines para builds, testing y despliegues repetibles.",
    stack: "Jenkins LTS",
    composeFile: dockerRepoPath("12-jenkins-ci", "docker-compose.yml"),
    docsPath: localRepoPath("12-jenkins-ci", "README.md"),
    urls: [{ label: "Jenkins", url: "http://localhost:8080" }],
    tags: ["ci", "automation", "delivery"],
    category: "infra",
    recommendedRamGb: 4,
    resourceProfile: "heavy"
  }
];

function loadManifest(labId) {
  const manifestPath = localRepoPath(labId, "lab-manifest.json");
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
    manifestPath: localRepoPath(defaultLab.id, "lab-manifest.json")
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
