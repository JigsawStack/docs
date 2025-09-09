export interface APIType {
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  sdk_key_string: string;
  skip_request?: boolean;
  direct_id?: string;
}

export const APISchemas: {
  [key: string]: APIType;
} = {
  "ai-scrape": {
    path: "/v1/ai/scrape",
    method: "POST",
    body: {
      url: "https://news.ycombinator.com/news",
      element_prompts: ["titles", "points"],
    },
    sdk_key_string: "web.ai_scrape",
  },
  sentiment: {
    path: "/v1/ai/sentiment",
    method: "POST",
    body: {
      text: "I love this product! It's amazing but the delivery was a bit late.",
    },
    sdk_key_string: "sentiment",
  },
  classification: {
    path: "/v1/classification",
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
    path: "/v1/ai/translate",
    method: "POST",
    body: {
      text: ["Hello", "How are you?", "Thank you"],
      target_language: "zh",
    },
    sdk_key_string: "translate.text",
  },
  summary: {
    path: "/v1/ai/summary",
    method: "POST",
    body: {
      text: "The Leaning Tower of Pisa, or simply, the Tower of Pisa, is the campanile, or freestanding bell tower, of Pisa Cathedral. It is situated behind the Cathedral and is the third-oldest structure in the city's Cathedral Square, after the Cathedral and the Baptistry. The tower's tilt began during construction in the 12th century, caused by an inadequate foundation on ground too soft on one side to properly support the structure's weight. The tilt increased in the decades before the structure was completed in the 14th century. It gradually increased until the structure was stabilized by efforts in the late 20th and early 21st centuries. The height of the tower is 55.86 metres (183.27 feet) from the ground on the low side and 56.67 metres (185.93 feet) on the high side. The width of the walls at the base is 2.44 m (8 ft 0.06 in). Its weight is estimated at 14,500 tonnes. The tower has 296 or 294 steps; the seventh floor has two fewer steps on the north-facing staircase.",
      type: "points",
      max_points: 3,
    },
    sdk_key_string: "summary",
  },
  prediction: {
    path: "/v1/ai/prediction",
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
    path: "/v1/ai/sql",
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
    path: "/v1/web/search",
    method: "POST",
    body: {
      query: "What is the capital of France?",
    },
    sdk_key_string: "web.search",
  },
  "search-suggestions": {
    path: "/v1/web/search/suggest",
    method: "GET",
    query: {
      query: "What is the capital",
    },
    sdk_key_string: "web.search_suggestions",
  },
  embedding: {
    path: "/v1/embedding",
    method: "POST",
    body: {
      text: "Caption: Secluded Tiki Bar on a serene lake, perfect for a refreshing drink and a relaxing getaway",
      type: "text",
    },
    sdk_key_string: "embedding",
  },
  embeddingV2: {
    path: "/v2/embedding",
    method: "POST",
    body: {
      text: "Caption: Secluded Tiki Bar on a serene lake, perfect for a refreshing drink and a relaxing getaway",
      type: "text",
    },
    sdk_key_string: "embeddingV2",
  },
  "object-detection": {
    path: "/v1/object_detection",
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
    path: "/v1/vocr",
    method: "POST",
    body: {
      prompt: ["total_price", "tax"],
      url: "https://jigsawstack.com/preview/vocr-example.jpg",
    },
    sdk_key_string: "vision.vocr",
  },
  "speech-to-text": {
    path: "/v1/ai/transcribe",
    method: "POST",
    body: {
      url: "https://jigsawstack.com/preview/stt-example.wav",
    },
    sdk_key_string: "audio.speech_to_text",
  },
  "spam-check": {
    path: "/v1/validate/spam_check",
    method: "POST",
    body: {
      text: "Congratulations! You've won a free iPhone! Click here to claim now!",
    },
    sdk_key_string: "validate.spamcheck",
  },
  nsfw: {
    path: "/v1/validate/nsfw",
    method: "POST",
    body: {
      url: "https://jigsawstack.com/preview/nsfw-example.jpg",
    },
    sdk_key_string: "validate.nsfw",
  },
  profanity: {
    path: "/v1/validate/profanity",
    method: "POST",
    body: {
      text: "This is a sample text that might contain inappropriate language.",
    },
    sdk_key_string: "validate.profanity",
  },
  spellcheck: {
    path: "/v1/validate/spell_check",
    method: "POST",
    body: {
      text: "This sentense has a speling mistake.",
    },
    sdk_key_string: "validate.spellcheck",
  },
  "file-upload": {
    path: "/v1/store/file",
    method: "POST",
    body: {
      blob: "image-123.png",
      key: "image-123.png",
    },
    sdk_key_string: "store.upload",
    skip_request: true,
  },
  "file-get": {
    path: "/v1/store/file/read/image-123.png",
    method: "GET",
    query: {
      key: "image-123.png",
    },
    sdk_key_string: "store.get",
    skip_request: true,
  },
  "file-delete": {
    path: "/v1/store/file/read/image-123.png",
    method: "DELETE",
    query: {
      key: "image-123.png",
    },
    sdk_key_string: "store.delete",
    skip_request: true,
  },
  "image-generation": {
    path: "/v1/ai/image_generation",
    method: "POST",
    body: {
      prompt: "A beautiful sunset over a calm ocean",
      return_type: "url",
    },
    sdk_key_string: "image_generation",
  },
  "image-translate": {
    path: "/v1/ai/translate/image",
    method: "POST",
    body: {
      url: "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      target_language: "hi",
      return_type: "url",
    },
    sdk_key_string: "translate.image",
  },
  "html-to-any": {
    path: "/v1/web/html_to_any",
    method: "POST",
    body: {
      url: "https://news.ycombinator.com/",
      return_type: "url",
    },
    sdk_key_string: "web.html_to_any",
  },
  "deep-research": {
    path: "/v1/web/deep_research",
    method: "POST",
    body: {
      query: "What is the meaning of life?",
    },
    sdk_key_string: "web.deep_research",
  },
"prompt-engine-create": {
    path: "/v1/prompt_engine",
    method: "POST",
    body: {
      prompt: "Tell me a story about {about}",
      inputs: [
        {
          key: "about",
          optional: false,
          initial_value: "Leaning Tower of Pisa",
        },
      ],
      return_prompt: "Return the result in a markdown format",
      prompt_guard: ["sexual_content", "defamation"],
    },
    sdk_key_string: "prompt_engine.create",
  },
  "prompt-engine-run": {
    path: "/v1/prompt_engine/0073d008-da9b-4c27-90a8-0240f3ecd4f5",
    method: "POST",
    query: {
      id: "0073d008-da9b-4c27-90a8-0240f3ecd4f5",
    },
    body: {
      input_values: {
        text: "How to get started with JigsawStack?",
      },
    },
    sdk_key_string: "prompt_engine.run",
  },
  "prompt-engine-retrieve": {
    path: "/v1/prompt_engine/14d675d5-b309-463d-8906-1be65af74c43",
    method: "GET",
    query: {
      id: "14d675d5-b309-463d-8906-1be65af74c43",
    },
    sdk_key_string: "prompt_engine.get",
    skip_request: true,
  },
  "prompt-engine-list": {
    path: "/v1/prompt_engine",
    method: "GET",
    query: {
      limit: "10",
    },
    sdk_key_string: "prompt_engine.list",
  },
  "prompt-engine-delete": {
    path: "/v1/prompt_engine/${id}",
    method: "DELETE",
    query: {
      promptId: "dc578c69-6eb5-4c5b-82ab-9f74077cfdd5",
    },
    sdk_key_string: "prompt_engine.delete",
    skip_request: true,
  },
  "prompt-engine-run-direct": {
    path: "/v1/prompt_engine/run",
    method: "POST",
    body: {
      prompt: "Tell me a story about {about}",
      inputs: [
        {
          key: "about",
          optional: true,
          initial_value: "Leaning Tower of Pisa",
        },
      ],
      return_prompt: "Return the result in a markdown format",
      prompt_guard: ["sexual_content", "defamation"],
      input_values: {
        about: "Santorini",
      },
    },
    sdk_key_string: "prompt_engine.run_prompt_direct",
  },
};
