# Services
All files and folders have been redacted out of concern of privacy.

This folder should be filled with services that contain `serverless.yml` configurations describing the APIs, language, env vars, permissions, slack bot and cache settings along with the handlers, validation, test events and packages/libraries.

The expected file structure is:
```
/
  my-service/
    package.json      # Individual packages
    serverless.yml    # Individual serverless deploy settings
    events/           # Expected inputs to handler functions for testing
    handlers/         # .js files exposing the Lambda function handlers
    validation/       # Specific validation functions for handlers
    ...               # Any other module specific libraries that may be developed
```

The services connected with multiple AWS Services. I was also heavily involved in the creation and maintainance of the services. Mostly written in Node.js (with the exception of a few Python3 functions) relying heavily on the AWS SDK to interact with the many services we integrated with (DynamoDB, ElasticSearch, Aurora Serverless, S3, SNS, SES & Cognito).