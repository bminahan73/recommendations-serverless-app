#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RecommendationsAppStack } from '../lib/recommendations-app-stack';

const app = new cdk.App();
new RecommendationsAppStack(app, 'RecommendationsAppStack');
