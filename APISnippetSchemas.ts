export interface APIType {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  sdk_key_string: string;
  skip_request?: boolean;
}

export const APISchemas: {
  [key: string]: APIType;
} = {
  "ai-scrape": {
    path: "/ai/scrape",
    method: "POST",
    body: {
      url: "https://news.ycombinator.com/news",
      element_prompts: ["titles", "points"],
    },
    sdk_key_string: "web.ai_scrape",
  },
  sentiment: {
    path: "/ai/sentiment",
    method: "POST",
    body: {
      text: "I love this product! It's amazing but the delivery was a bit late.",
    },
    sdk_key_string: "sentiment",
  },
  classification: {
    path: "/classification",
    method: "POST",
    body: {
      dataset: [
        { type: "image", value: "https://jigsawstack.com/preview/classification-example-1.jpg" },
        { type: "image", value: "https://jigsawstack.com/preview/classification-example-2.jpg" },
      ],
      labels: [
        { type: "text", value: "hotdog" },
        { type: "text", value: "not a hotdog" },
      ],
    },
    sdk_key_string: "classification",
  },
  translate: {
    path: "/ai/translate",
    method: "POST",
    body: {
      text: ["Hello", "How are you?", "Thank you"],
      target_language: "zh",
    },
    sdk_key_string: "translate.text",
  },
  summary: {
    path: "/ai/summary",
    method: "POST",
    body: {
      text: "The Leaning Tower of Pisa, or simply, the Tower of Pisa, is the campanile, or freestanding bell tower, of Pisa Cathedral. It is situated behind the Cathedral and is the third-oldest structure in the city's Cathedral Square, after the Cathedral and the Baptistry. The tower's tilt began during construction in the 12th century, caused by an inadequate foundation on ground too soft on one side to properly support the structure's weight. The tilt increased in the decades before the structure was completed in the 14th century. It gradually increased until the structure was stabilized by efforts in the late 20th and early 21st centuries. The height of the tower is 55.86 metres (183.27 feet) from the ground on the low side and 56.67 metres (185.93 feet) on the high side. The width of the walls at the base is 2.44 m (8 ft 0.06 in). Its weight is estimated at 14,500 tonnes. The tower has 296 or 294 steps; the seventh floor has two fewer steps on the north-facing staircase.",
      type: "points",
      max_points: 3,
    },
    sdk_key_string: "summary",
  },
  prediction: {
    path: "/ai/prediction",
    method: "POST",
    body: {
      dataset: [
        { date: "2023-01-01", value: 353459 },
        { date: "2023-01-02", value: 313734 },
        { date: "2023-01-03", value: 333774 },
        { date: "2023-01-04", value: 348636 },
        { date: "2023-01-05", value: 278903 },
      ],
      steps: 3,
    },
    sdk_key_string: "prediction",
  },
  sql: {
    path: "/ai/sql",
    method: "POST",
    body: {
      database: "postgresql",
      prompt: "Find all transactions with amounts exceeding $10,000, sorted by transaction date",
      sql_schema: `
            CREATE TABLE Transactions (
              transaction_id INT PRIMARY KEY, 
              user_id INT NOT NULL,
              total_amount DECIMAL(10, 2) NOT NULL, 
              transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              status VARCHAR(20) DEFAULT 'pending',
              FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
          `,
    },
    sdk_key_string: "text_to_sql",
  },
  "ai-search": {
    path: "/web/search",
    method: "POST",
    body: {
      query: "What is the capital of France?",
    },
    sdk_key_string: "web.search",
  },
  "search-suggestions": {
    path: "/web/search/suggest",
    method: "GET",
    query: {
      query: "What is the capital",
    },
    sdk_key_string: "web.search_suggestions",
  },
  embedding: {
    path: "/embedding",
    method: "POST",
    body: {
      text: "Caption: Secluded Tiki Bar on a serene lake, perfect for a refreshing drink and a relaxing getaway",
      type: "text",
    },
    sdk_key_string: "embedding",
  },
  "object-detection": {
    path: "/object_detection",
    method: "POST",
    body: {
      url: "https://jigsawstack.com/preview/object-detection-example-input.jpg",
      // prompts: ["objects on the screen"],
      features: ["object_detection"],
      annotated_image: true,
      return_type: "url",
    },
    sdk_key_string: "vision.object_detection",
  },
  vocr: {
    path: "/vocr",
    method: "POST",
    body: {
      prompt: ["total_price", "tax"],
      url: "https://jigsawstack.com/preview/vocr-example.jpg",
    },
    sdk_key_string: "vision.vocr",
  },
  "speech-to-text": {
    path: "/ai/transcribe",
    method: "POST",
    body: {
      url: "https://jigsawstack.com/preview/stt-example.wav",
    },
    sdk_key_string: "audio.speech_to_text",
  },
  "spam-check": {
    path: "/validate/spam_check",
    method: "POST",
    body: {
      text: "Congratulations! You've won a free iPhone! Click here to claim now!",
    },
    sdk_key_string: "validate.spamcheck",
  },
  nsfw: {
    path: "/validate/nsfw",
    method: "POST",
    body: {
      url: "https://images.unsplash.com/photo-1633998979521-11ca9d0e6e38?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    sdk_key_string: "validate.nsfw",
  },
  profanity: {
    path: "/validate/profanity",
    method: "POST",
    body: {
      text: "This is a sample text that might contain inappropriate language.",
    },
    sdk_key_string: "validate.profanity",
  },
  spellcheck: {
    path: "/validate/spell_check",
    method: "POST",
    body: {
      text: "This sentense has a speling mistake.",
    },
    sdk_key_string: "validate.spellcheck",
  },
  "file-upload": {
    path: "/store/file",
    method: "POST",
    body: {
      blob: "image-123.png",
      key: "image-123.png",
    },
    sdk_key_string: "store.upload",
    skip_request: true,
  },
  "file-get": {
    path: "/store/file/read/image-123.png",
    method: "GET",
    query: {
      key: "image-123.png",
    },
    sdk_key_string: "store.get",
    skip_request: true,
  },
  "file-delete": {
    path: "/store/file/read/image-123.png",
    method: "DELETE",
    query: {
      key: "image-123.png",
    },
    sdk_key_string: "store.delete",
    skip_request: true,
  },
  "image-generation": {
    path: "/ai/image_generation",
    method: "POST",
    body: {
      prompt: "A beautiful sunset over a calm ocean",
      return_type: "url",
    },
    sdk_key_string: "image_generation",
  },
  "image-translate": {
    path: "/ai/translate/image",
    method: "POST",
    body: {
      url: "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      target_language: "hi",
      return_type: "url",
    },
    sdk_key_string: "translate.image",
  },
  "html-to-any": {
    path: "/web/html_to_any",
    method: "POST",
    body: {
      url: "https://news.ycombinator.com/",
      return_type: "url",
    },
    sdk_key_string: "web.html_to_any",
  },
  "deep-research": {
    path: "/web/deep_research",
    method: "POST",
    body: {
      query: "What is the meaning of life?",
    },
    sdk_key_string: "web.deep_research",
  },
};
