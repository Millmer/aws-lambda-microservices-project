const AWS = require('aws-sdk');
const ssm = new AWS.SSM({
  apiVersion: '2014-11-06'
});
const axios = require('axios').default;

module.exports.sendSlackMessage = async (stage, service, message) => {
  try {
    const token = await getSlackToken(stage);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    const data = {
      channel: '#application-error',
      text: `*STAGE*: ${stage} \n *SERVICE*: ${service} \n *MESSAGE*: ${message}`,
    };
    await postMessage(data, headers);
    console.info('Slack message posted!');
  } catch (error) {
    console.error(error);
  }
};

async function postMessage(data, headers) {
  return new Promise((resolve, reject) => {
    axios.post('https://slack.com/api/chat.postMessage', data, { headers: headers })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject();
      });
  });

}

async function getSlackToken(stage) {
  const paramsSsm = {
    Name: `/${stage}/project/slack_token`
  };
  try {
    const ssmParameter = await ssm.getParameter(paramsSsm).promise();
    return ssmParameter.Parameter.Value;
  } catch (err) {
    console.error(`*** Failed to get SSM parameter - /${stage}/project/slack_token: `, err);
    throw Error(err);
  }
}