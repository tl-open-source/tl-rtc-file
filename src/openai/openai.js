/**
 * openapi api
 * @author iamtsm
 */

const request = require('request')
const openai = require('../../conf/cfg.json').openai

/**
 * openai聊天接口
 * @param {*} prompt 
 * @param {*} model 
 * @param {*} maxTokens 
 * @param {*} temperature 
 * @param {*} topP 
 * @returns 
 */
function openaiChat(
    prompt,
    model = 'text-davinci-003',
    maxTokens = 60,
    temperature = 0.5,
    topP = 1
) {
    return new Promise((resolve, reject) => {
        const options = {
            url: 'https://api.openai.com/v1/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openai.apiKey}`
            },
            json: {
                prompt: prompt,
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                top_p: topP
            }
        }

        request.post(options, (error, response, body) => {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
}


module.exports = {
    openaiChat
}