const GEMINI_API_KEY = 'AIzaSyBa96U9qKNdEDTnqpJHFsgSN5exzAS2xBQ';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

export interface TripRequest {
  destination: string;
  duration: number;
  budget: string;
  travelers: number;
  interests?: string;
  images?: Array<{ data: string; mimeType: string }>;
  language?: string;
}

export interface TripResponse {
  title: string;
  description: string;
  itinerary: Array<{
    day: number;
    title: string;
    activities: string[];
    places: string[];
  }>;
  recommendations: {
    hotels: string[];
    restaurants: string[];
    tips: string[];
  };
}

export async function generateTrip(request: TripRequest): Promise<string> {
  const languageMap: { [key: string]: string } = {
    english: 'English',
    tamil: 'Tamil',
    hindi: 'Hindi',
    telugu: 'Telugu',
    kannada: 'Kannada',
    malayalam: 'Malayalam'
  };

  const selectedLanguage = request.language ? languageMap[request.language] || 'English' : 'English';
  const languageInstruction = request.language && request.language !== 'english'
    ? `\n\nIMPORTANT: Generate the ENTIRE response in ${selectedLanguage} language. All text, headings, descriptions, and content must be written in ${selectedLanguage}.`
    : '';

  const prompt = `You are an expert travel planner specializing in Tamil Nadu tourism. Generate a detailed trip itinerary for:

Destination: ${request.destination}, Tamil Nadu
Duration: ${request.duration} days
Budget: ${request.budget}
Number of Travelers: ${request.travelers}
${request.interests ? `Interests: ${request.interests}` : ''}

Please provide:
1. A compelling trip title and overview
2. Day-by-day itinerary with specific places to visit, activities, and timings
3. Hotel recommendations with brief descriptions
4. Restaurant recommendations for authentic Tamil Nadu cuisine
5. Travel tips and cultural insights
6. Best time to visit each place
7. Estimated costs breakdown

Format the response in a clear, structured way with headings and bullet points. Focus on showcasing Tamil Nadu's rich culture, temples, beaches, hill stations, and heritage sites.${languageInstruction}`;

  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [
    { text: prompt }
  ];

  if (request.images && request.images.length > 0) {
    request.images.forEach(img => {
      parts.push({
        inline_data: {
          mime_type: img.mimeType,
          data: img.data
        }
      });
    });
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: parts
      }]
    })
  });

  const result = await response.json();

  if (result.candidates && result.candidates.length > 0) {
    const candidate = result.candidates[0];
    if (candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    }
  }

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  throw new Error('Failed to generate trip itinerary');
}

export async function chatWithAI(message: string, images?: Array<{ data: string; mimeType: string }>): Promise<string> {
  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [
    { text: `You are a Tamil Nadu travel expert assistant. Answer the following question: ${message}` }
  ];

  if (images && images.length > 0) {
    images.forEach(img => {
      parts.push({
        inline_data: {
          mime_type: img.mimeType,
          data: img.data
        }
      });
    });
  }

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: parts
      }]
    })
  });

  const result = await response.json();

  if (result.candidates && result.candidates.length > 0) {
    const candidate = result.candidates[0];
    if (candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    }
  }

  if (result.error?.message) {
    throw new Error(result.error.message);
  }

  throw new Error('Failed to get response');
}
