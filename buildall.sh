#!/usr/bin/env bash
cd common && npm run build
cd -
cd lambdas/get-recommendations && npm run build
cd -
cd lambdas/make-recommendations && npm run build
cd -
cd frontend && npm run build
cd -
cd cdk && npm run build
cd -