import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import RecommendationsApp = require('../lib/recommendations-app-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RecommendationsApp.RecommendationsAppStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
