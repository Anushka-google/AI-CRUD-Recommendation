const axios = require('axios');
const Candidate = require('../models/Candidate');

exports.shortlistCandidate = async (req, res) => {
  try {
    const { candidateId, jobRequirements } = req.body;

    if (!candidateId || !jobRequirements) {
      return res.status(400).json({ error: 'candidateId and jobRequirements are required' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey || openRouterApiKey === 'YOUR_OPENROUTER_KEY') {
      // Fallback mock AI response
      const mockRecommendation = `MOCK AI: ${candidate.name} is a solid fit based on ${candidate.skills.join(', ')}.`;
      const mockQuestions = ["Tell me about your experience.", "How do you handle conflict?"];
      
      candidate.aiRecommendation = mockRecommendation;
      candidate.interviewQuestions = mockQuestions;
      await candidate.save();

      return res.json({ 
        message: 'Used Mock AI due to missing API key',
        aiRecommendation: mockRecommendation,
        interviewQuestions: mockQuestions
      });
    }

    // Call OpenRouter
    const prompt = `
    You are an expert technical recruiter. Analyze the following candidate and the job requirements.
    Return a JSON object ONLY with no markdown formatting.
    The JSON object must have exactly two keys:
    1. "aiRecommendation": A short paragraph explaining why this candidate is suitable or not.
    2. "interviewQuestions": An array of 3 specific technical/behavioral interview questions tailored to their profile and the job.

    Candidate Profile:
    Name: ${candidate.name}
    Skills: ${candidate.skills.join(', ')}
    Experience: ${candidate.experience} years
    Bio: ${candidate.bio}

    Job Requirements:
    ${JSON.stringify(jobRequirements)}
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://ai-candidate-shortlisting.com', // Required by OpenRouter
          'X-Title': 'Candidate Shortlisting System'
        }
      }
    );

    let aiResult;
    try {
      aiResult = JSON.parse(response.data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response', response.data.choices[0].message.content);
      aiResult = {
        aiRecommendation: response.data.choices[0].message.content,
        interviewQuestions: ["Could you elaborate on your past projects?"]
      };
    }

    candidate.aiRecommendation = aiResult.aiRecommendation || 'Recommendation could not be generated.';
    candidate.interviewQuestions = aiResult.interviewQuestions || [];
    await candidate.save();

    res.json({
      message: 'AI shortlisting successful',
      aiRecommendation: candidate.aiRecommendation,
      interviewQuestions: candidate.interviewQuestions
    });

  } catch (error) {
    console.error('AI Shortlisting Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process AI shortlisting' });
  }
};
