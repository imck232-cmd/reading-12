
import { GoogleGenAI, Type } from "@google/genai";
import type { Curriculum, QuizQuestion } from './types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export async function structureCurriculum(fileContent: string): Promise<Curriculum> {
  const prompt = `
    قم بتحليل محتوى المنهج الدراسي التالي وهيكلته في صيغة JSON.
    يجب أن يحتوي كائن JSON على مفتاح واحد "lessons"، وهو عبارة عن مصفوفة.
    يجب أن يحتوي كل عنصر في مصفوفة "lessons" على:
    1. "title": عنوان الدرس.
    2. "content": ملخص موجز لمحتوى الدرس.
    3. "questions": مصفوفة من أسئلة التقويم والأسئلة العامة المتعلقة بالدرس.
       يجب أن يحتوي كل سؤال على "questionText" (نص السؤال) و "answerText" (نص الإجابة).

    تأكد من أن الإجابات دقيقة ومأخوذة مباشرة من المحتوى المقدم.

    محتوى المنهج:
    ---
    ${fileContent}
    ---
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionText: { type: Type.STRING },
                      answerText: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as Curriculum;
  } catch (error) {
    console.error("Failed to parse JSON from Gemini:", response.text);
    throw new Error("The curriculum data received was not in the expected format.");
  }
}

export async function generateQuiz(curriculumText: string): Promise<QuizQuestion[]> {
  const prompt = `
    بناءً على محتوى المنهج الدراسي التالي، قم بإنشاء اختبار ممتع ومتنوع من 5 أسئلة بصيغة الاختيار من متعدد.
    يجب أن تغطي الأسئلة مواضيع مختلفة من المنهج.
    قم بالرد بصيغة JSON فقط. يجب أن يكون الرد عبارة عن مصفوفة من كائنات الأسئلة.
    كل كائن سؤال يجب أن يحتوي على:
    1. "question": نص السؤال.
    2. "options": مصفوفة من 4 خيارات نصية. يجب أن يكون أحدها هو الإجابة الصحيحة.
    3. "correctAnswer": النص الدقيق للإجابة الصحيحة من بين الخيارات.

    محتوى المنهج:
    ---
    ${curriculumText}
    ---
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
          },
        },
      },
    },
  });

  try {
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Failed to parse JSON for quiz from Gemini:", response.text);
    throw new Error("The quiz data received was not in the expected format.");
  }
}

export async function answerGeneralQuestion(curriculumText: string, userQuestion: string): Promise<string> {
    const prompt = `
        بصفتك مساعدًا تعليميًا، أجب على سؤال المستخدم التالي بالاعتماد **حصريًا** على محتوى المنهج الدراسي المقدم.
        لا تستخدم أي معلومات خارجية.
        إذا كانت الإجابة غير موجودة في المنهج، أجب بوضوح: "لا يمكنني العثور على إجابة لهذا السؤال في محتوى المنهج الدراسي المقدم."

        محتوى المنهج الدراسي:
        ---
        ${curriculumText}
        ---

        سؤال المستخدم:
        "${userQuestion}"
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    return response.text;
}
