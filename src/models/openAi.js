require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeDiaryContent(content) {
    const prompt = `
    다음 일기 내용을 분석하여 다음 정보를 간단하게 추출하세요:
    - 감정 상태 (기분)
    - 사건이 일어난 날짜
    - 해시태그

    일기 내용:
    ${content}

    응답 예시 형식 (이 형식대로 정확히 답변하세요):
    - 기분: 
    - 날짜: 
    - 해시태그: 
`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
        });

        const extractedText = response.choices[0].message.content.trim();
        const [moodLine, dateLine, hashTagLine] = extractedText.split("\n");

        const mood = moodLine.split(":")[1]?.trim() || null;
        const date = dateLine.split(":")[1]?.trim() || null;
        const hashTag = hashTagLine.split(":")[1]?.trim() || null;
        
        return { mood, date, hashTag };
    } catch (error) {
        console.error("Error in OpenAI API request:", error);
        throw error;
    }
}

async function provideCounseling(content) {
    const prompt = `
        You are a psychological counselor. Read the following diary entry and provide counseling feedback.
        
        Diary Entry:
        ${content}
        
        Counseling advice:
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "당신은 심리상담가입니다." },
                { role: "user", content: prompt },
            ],
            max_tokens: 200,
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}

module.exports = { analyzeDiaryContent, provideCounseling };
