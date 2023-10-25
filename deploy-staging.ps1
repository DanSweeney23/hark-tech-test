cd frontend
npm run build-staging
cd ../iac
cdk deploy --profile staging
cd ..