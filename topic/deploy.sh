zip -r topics-function.zip .
aws lambda update-function-code \
    --function-name  topics \
    --zip-file fileb://topics-function.zip
rm topics-function.zip