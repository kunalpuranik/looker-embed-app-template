#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Enable debug mode to print each command before executing
set -x

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Set variables (replace these with your actual values)
PROJECT_ID=${REACT_APP_GCP_PROJECT_ID}
APP_NAME="starterkit-app"
REGION=${REACT_APP_GCP_PROJECT_REGION}
REPO_NAME="starterkit-app"
REPO_LOCATION=${REACT_APP_GCP_PROJECT_REGION}
IMAGE_NAME="${REPO_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${APP_NAME}"
# Get the project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Check if necessary files exist
if [ ! -f "package.json" ] || [ ! -d "server" ] || [ ! -f "server/app.js" ]; then
    echo "Error: Required files are missing. Make sure you're in the correct directory."
    exit 1
fi


# Enable necessary APIs
echo "Enabling necessary APIs..."
gcloud services enable artifactregistry.googleapis.com run.googleapis.com secretmanager.googleapis.com

# Check if Artifact Registry repository exists
if gcloud artifacts repositories describe "${REPO_NAME}" --location="${REPO_LOCATION}" &>/dev/null; then
    echo "Artifact Registry repository ${REPO_NAME} already exists. Skipping creation."
else
    echo "Creating Artifact Registry repository..."
    gcloud artifacts repositories create "${REPO_NAME}" \
        --repository-format=docker \
        --location="${REPO_LOCATION}" \
        --description="Docker repository for ${APP_NAME}"
fi

# Configure Docker to use gcloud as a credential helper
gcloud auth configure-docker ${REPO_LOCATION}-docker.pkg.dev

# Build and push the Docker image
echo "Building and pushing Docker image..."
docker build \
  --build-arg REACT_APP_LOOKER_HOST="${REACT_APP_LOOKER_HOST}" \
  --build-arg REACT_APP_LOOKER_API_URL="${REACT_APP_LOOKER_API_URL}" \
  --build-arg REACT_APP_LOOKER_PROXY_URL="https://${APP_NAME}-${PROJECT_NUMBER}.${REGION}.run.app/api" \
  --build-arg REACT_APP_LOOKER_DASHBOARD_1="${REACT_APP_LOOKER_DASHBOARD_1}" \
  --build-arg REACT_APP_LOOKER_DASHBOARD_TAB_1="${REACT_APP_LOOKER_DASHBOARD_TAB_1}" \
  --build-arg REACT_APP_LOOKER_DASHBOARD_TAB_2="${REACT_APP_LOOKER_DASHBOARD_TAB_2}" \
  --build-arg REACT_APP_LOOKER_LOOKS_TAB_1="${REACT_APP_LOOKER_LOOKS_TAB_1}" \
  --build-arg REACT_APP_LOOKER_LOOKS_TAB_2="${REACT_APP_LOOKER_LOOKS_TAB_2}" \
  --build-arg REACT_APP_LOOKER_LOOKS_TAB_3="${REACT_APP_LOOKER_LOOKS_TAB_3}" \
  --build-arg REACT_APP_SINGLE_CARDS="${REACT_APP_SINGLE_CARDS}" \
  --build-arg REACT_APP_TIMESERIES="${REACT_APP_TIMESERIES}" \
  --build-arg REACT_APP_LOOKER_EXPLORE="${REACT_APP_LOOKER_EXPLORE}" \
  -t "${IMAGE_NAME}" .
docker push "${IMAGE_NAME}"

create_secret_if_not_exists() {
    local secret_name=$1
    local secret_value=$2
    if ! gcloud secrets describe "${secret_name}" &>/dev/null; then
        echo "Creating secret ${secret_name}..."
        echo -n "${secret_value}" | gcloud secrets create "${secret_name}" --replication-policy="automatic" --data-file=-
    else
        echo "Secret ${secret_name} already exists. Skipping creation."
    fi
}

create_secret_if_not_exists "LOOKER_CLIENT_ID" "${REACT_APP_LOOKER_CLIENT_ID}"
create_secret_if_not_exists "LOOKER_CLIENT_SECRET" "${REACT_APP_LOOKER_CLIENT_SECRET}"
create_secret_if_not_exists "GSI_CLIENT_ID" "${REACT_APP_GSI_CLIENT_ID}"

# Grant the Cloud Run service account access to the secrets
echo "Granting Cloud Run service account access to secrets..."
for SECRET_NAME in LOOKER_CLIENT_ID LOOKER_CLIENT_SECRET GSI_CLIENT_ID
do
    gcloud secrets add-iam-policy-binding $SECRET_NAME \
        --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
        --role="roles/secretmanager.secretAccessor"
done

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="REACT_APP_LOOKER_HOST=$REACT_APP_LOOKER_HOST,\
REACT_APP_LOOKER_API_URL=$REACT_APP_LOOKER_API_URL,\
REACT_APP_LOOKER_PROXY_URL=https://$APP_NAME-$PROJECT_NUMBER.$REGION.run.app/api,\
REACT_APP_LOOKER_DASHBOARD_1=$REACT_APP_LOOKER_DASHBOARD,\
REACT_APP_LOOKER_DASHBOARD_TAB_1=$REACT_APP_LOOKER_DASHBOARD_TAB_1,\
REACT_APP_LOOKER_DASHBOARD_TAB_2=$REACT_APP_LOOKER_DASHBOARD_TAB_2,\
REACT_APP_LOOKER_LOOKS_TAB_1=$REACT_APP_LOOKER_LOOKS_TAB_1,\
REACT_APP_LOOKER_LOOKS_TAB_2=$REACT_APP_LOOKER_LOOKS_TAB_2,\
REACT_APP_LOOKER_LOOKS_TAB_3=$REACT_APP_LOOKER_LOOKS_TAB_3,\
REACT_APP_SINGLE_CARDS=$REACT_APP_SINGLE_CARDS,\
REACT_APP_TIMESERIES=$REACT_APP_TIMESERIES,\
REACT_APP_LOOKER_EXPLORE=$REACT_APP_LOOKER_EXPLORE, \
NODE_ENV=production" \
  --set-secrets="REACT_APP_LOOKER_CLIENT_ID=LOOKER_CLIENT_ID:latest,\
REACT_APP_LOOKER_CLIENT_SECRET=LOOKER_CLIENT_SECRET:latest,\
REACT_APP_GSI_CLIENT_ID=GSI_CLIENT_ID:latest"

echo "Deployment completed successfully!"