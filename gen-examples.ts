import "dotenv/config";
import fs from "fs";
import { CurlGenerator } from "curl-generator";
import * as curlconverter from "curlconverter";
import { APISchemas, APIType } from "./APISnippetSchemas";

const url = "https://api.jigsawstack.com";

const getSDKJSCode = (api: APIType) => {
  const params = api.direct_id 
    ? `"${api.direct_id}"` 
    : JSON.stringify(
        {
          ...api?.body,
          ...api?.query,
        },
        null,
        6
      );

  const JSSDKCode = `import { JigsawStack } from "jigsawstack";

const jigsaw = JigsawStack({ apiKey: "your-api-key" });

const response = await jigsaw.${api.sdk_key_string}(${params})`;

  return JSSDKCode;
};


const getSDKPythonCode = (api: APIType) => {
  let params;
  
  if (api.direct_id) {
    params = `"${api.direct_id}"`;
  } else {
    const jsonString = JSON.stringify(
      {
        ...api?.body,
        ...api?.query,
      },
      null,
      6
    );
    
    params = jsonString
      .replace(/: true/g, ': True')
      .replace(/: false/g, ': False');
  }

  const pythonCode = `from jigsawstack import JigsawStack

jigsaw = JigsawStack(api_key="your-api-key")

response = jigsaw.${api.sdk_key_string}(${params})`;

  return pythonCode;
};

const gen = async () => {
  fs.rmSync("./snippets/code-req-examples", { recursive: true, force: true });
  fs.mkdirSync("./snippets/code-req-examples");
  const apiKeys = Object.keys(APISchemas);

  const promises = apiKeys.map(async (apiKey) => {
    try {
      const api = APISchemas[apiKey];
      const JSSDKCode = getSDKJSCode(api);
      const pythonCode = getSDKPythonCode(api);
      let curlCode = CurlGenerator({
        url: `${url}${api.path}${api.query ? `?${new URLSearchParams(api.query).toString()}` : ""}`,
        method: api.method as any,
        headers: {
          ...api.headers,
          "Content-Type": "application/json",
          "x-api-key": "your-api-key",
        },
        body: api.body,
      });

      curlCode = curlCode.replace(/([;()])/g, "\\$1");

      const phpCode = curlconverter.toPhp(curlCode);
      const rubyCode = curlconverter.toRuby(curlCode);
      const goCode = curlconverter.toGo(curlCode);
      const javaCode = curlconverter.toJava(curlCode);
      const swiftCode = curlconverter.toSwift(curlCode);
      const dartCode = curlconverter.toDart(curlCode);
      const kotlinCode = curlconverter.toKotlin(curlCode);
      const csharpCode = curlconverter.toCSharp(curlCode);

      let responseBody = null;

      if (!api.skip_request) {
        const response = await fetch(`${url}${api.path}${api.query ? `?${new URLSearchParams(api.query).toString()}` : ""}`, {
          method: api.method,
          headers: {
            ...api.headers,
            "Content-Type": "application/json",
            "x-api-key": process.env.JIGSAWSTACK_API_KEY!,
          },
          body: api.body ? JSON.stringify(api.body) : undefined,
        });

        if (!response.ok) {
          console.error(`${apiKey}: failed to generate response example`, response.status);
          return;
        }

        console.log(apiKey, response.headers.get("content-type"));

        responseBody = response.headers.get("content-type")?.includes("application/json") ? await response.json() : null;
      }

      const doc = `
    <RequestExample>
    \`\`\`javascript Javascript
${JSSDKCode}
    \`\`\`
    \`\`\`python Python
${pythonCode}
    \`\`\`
    \`\`\`bash Curl
${curlCode}
    \`\`\`
    \`\`\`php PHP
${phpCode}
    \`\`\`
    \`\`\`ruby Ruby
${rubyCode}
    \`\`\`
    \`\`\`go Go
${goCode}
    \`\`\`
    \`\`\`java Java
${javaCode}
    \`\`\`
    \`\`\`swift Swift
${swiftCode}
    \`\`\`
    \`\`\`dart Dart
${dartCode}
    \`\`\`
    \`\`\`kotlin Kotlin
${kotlinCode}
    \`\`\`
    \`\`\`csharp C#
${csharpCode}
    \`\`\`
    </RequestExample>
    ${
      responseBody
        ? `<ResponseExample>
    \`\`\`json Response
${JSON.stringify(responseBody, null, 6)}
    \`\`\`
    </ResponseExample>
    `
        : "\n\n<ResponseExample></ResponseExample>"
    }
    `;

      fs.writeFileSync(`./snippets/code-req-examples/${apiKey}.mdx`, doc);
    } catch (error) {
      console.error(`${apiKey}: failed to generate response example`, error);
    }
  });

  await Promise.all(promises);

  console.log("done");
};

gen();
