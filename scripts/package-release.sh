#!/usr/bin/env bash
set -e

# Version check
if [ -z "$1" ]; then
  echo "Uso: $0 <version> (ej: v1.0.0)"
  exit 1
fi

VERSION="$1"
OUTPUT_NAME="docker-labs-${VERSION}"
DIST_DIR="dist"
ARCHIVE="${OUTPUT_NAME}.zip"

echo "📦 Empaquetando ${OUTPUT_NAME}..."

# Clean previous build
rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}/${OUTPUT_NAME}"

# Copy files excluding git and heavy ignored files
# Using rsync if available, else simple copy and clean
echo "   Copiando archivos..."
# Exclude git, node_modules, vendor, dist itself
rsync -av --progress . "${DIST_DIR}/${OUTPUT_NAME}" \
  --exclude '.git' \
  --exclude '.github' \
  --exclude '.idea' \
  --exclude '.vscode' \
  --exclude 'node_modules' \
  --exclude 'vendor' \
  --exclude 'dist' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  --exclude 'brain'

# Create ZIP
echo "   Comprimiendo..."
cd "${DIST_DIR}"
zip -r "${ARCHIVE}" "${OUTPUT_NAME}" > /dev/null

echo "✅ Release creado exitosamente: ${DIST_DIR}/${ARCHIVE}"
echo "   Tamaño: $(du -h "${ARCHIVE}" | cut -f1)"
echo "🚀 Listo para subir a GitHub Releases!"
