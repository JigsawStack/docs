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

const getCSharpCode = (api: APIType) => {
  const method = api.method.charAt(0).toUpperCase() + api.method.slice(1).toLowerCase();
  const fullUrl = `${url}${api.path}${api.query ? `?${new URLSearchParams(api.query).toString()}` : ""}`;
  
  let paramsCode = '';
  if (api.direct_id) {
    paramsCode = `"${api.direct_id}"`;
  } else if (api.body || api.query) {
    const params = {
      ...api?.body,
      ...api?.query,
    };
    
    // Convert JSON to C# anonymous object format
    const formatCSharpObject = (obj: any, indent: number = 4): string => {
      const spaces = ' '.repeat(indent);
      const entries = Object.entries(obj);
      
      if (entries.length === 0) return 'new { }';
      
      const props = entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          const items = value.map(v => 
            typeof v === 'string' ? `"${v}"` : JSON.stringify(v)
          ).join(', ');
          return `${spaces}${key} = new List<${typeof value[0] === 'string' ? 'string' : 'object'}> { ${items} }`;
        } else if (typeof value === 'object' && value !== null) {
          return `${spaces}${key} = ${formatCSharpObject(value, indent + 4)}`;
        } else if (typeof value === 'string') {
          return `${spaces}${key} = "${value}"`;
        } else {
          return `${spaces}${key} = ${value}`;
        }
      }).join(',\n');
      
      return `new\n{\n${props}\n${' '.repeat(indent - 4)}}`;
    };
    
    paramsCode = formatCSharpObject(params);
  }

  const hasBody = api.method !== 'GET' && (api.body || (!api.direct_id && api.query));
  
  const csharpCode = `using System.Net.Http.Headers;
using System.Net.Http.Json;

HttpClient client = new HttpClient();

HttpRequestMessage request = new HttpRequestMessage(HttpMethod.${method}, "${fullUrl}");
request.Headers.Add("x-api-key", "your-api-key");${hasBody ? `
request.Content = JsonContent.Create(${paramsCode});
request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");` : ''}

HttpResponseMessage response = await client.SendAsync(request);
response.EnsureSuccessStatusCode();
string responseBody = await response.Content.ReadAsStringAsync();

Console.WriteLine(responseBody);`;

  return csharpCode;
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
      const csharpSDKCode = getCSharpCode(api);
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
${csharpSDKCode}
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
